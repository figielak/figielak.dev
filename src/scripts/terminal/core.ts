/**
 * The site-wide terminal (koncept.md §8): opened with ` or the >_ button in
 * the navigation. The core runs the prompt only — commands are modules in
 * ./commands, found by index.ts, so adding one never touches this file.
 *
 * Output and history live in sessionStorage, so they survive `cd` to another
 * page and closing the panel within one session.
 */
import type { Command, Context, Line, Pending, Printable, TerminalData } from './types';

const LINES_KEY = 'terminal:lines';
const HISTORY_KEY = 'terminal:history';
const MAX_LINES = 500;
const MAX_HISTORY = 100;

/* Storage can throw (private mode, blocked site data) — the terminal then
   simply starts empty on every page. */
function load<T>(key: string, fallback: T): T {
	try {
		const raw = sessionStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function store(key: string, value: unknown) {
	try {
		sessionStorage.setItem(key, JSON.stringify(value));
	} catch {}
}

export function fill(template: string, vars: Record<string, string | number> = {}): string {
	return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

const toLine = (item: Printable): Line => (typeof item === 'string' ? [{ text: item }] : item);

function isEditable(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/* Built from text nodes, never innerHTML — output may carry API data. */
function renderLine(line: Line): HTMLElement {
	const row = document.createElement('div');
	row.className = 'term-row';
	for (const segment of line) {
		const el = document.createElement(segment.href ? 'a' : 'span');
		el.textContent = segment.text;
		if (segment.role && segment.role !== 'text') el.dataset.role = segment.role;
		if (el instanceof HTMLAnchorElement && segment.href) {
			el.href = segment.href;
			if (/^https?:/.test(segment.href)) {
				el.target = '_blank';
				el.rel = 'noopener noreferrer';
			}
		}
		row.append(el);
	}
	return row;
}

export function mountTerminal(root: HTMLElement, data: TerminalData, commands: Command[]) {
	const q = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
	const body = q('.term-body');
	const output = q('.term-output');
	const log = q('.term-log');
	const input = q<HTMLInputElement>('.term-input');
	const typed = q('.term-typed');
	const prompt = q('.term-prompt');
	const defaultPrompt = [...prompt.childNodes];

	const t = (key: string, vars?: Record<string, string | number>) => fill(data.strings[key] ?? key, vars);
	const find = (name: string) => commands.find((c) => c.name === name || c.aliases?.includes(name));

	let lines: Line[] = load(LINES_KEY, []);
	const history: string[] = load(HISTORY_KEY, []);
	let historyAt = history.length;
	let draft = '';
	let isOpen = false;
	let busy = false;
	let secret = false;
	let answer: ((value: string) => void) | null = null;
	let effect: AbortController | null = null;
	let returnFocus: HTMLElement | null = null;
	let inerted: HTMLElement[] = [];

	/* ---- output ---- */

	const scrollDown = () => {
		output.scrollTop = output.scrollHeight;
	};

	function renderAll() {
		log.replaceChildren(...lines.map(renderLine));
		scrollDown();
	}

	function print(...items: Printable[]) {
		const added = items.map(toLine);
		lines.push(...added);
		if (lines.length > MAX_LINES) {
			lines = lines.slice(-MAX_LINES);
			renderAll();
		} else {
			log.append(...added.map(renderLine));
			scrollDown();
		}
		store(LINES_KEY, lines);
	}

	function loading(): Pending {
		const line: Line = [{ text: t('term.loading'), role: 'muted' }];
		print(line);
		return {
			done(...items) {
				const at = lines.indexOf(line);
				if (at < 0) return print(...items);
				lines.splice(at, 1, ...items.map(toLine));
				store(LINES_KEY, lines);
				renderAll();
			},
		};
	}

	function clear() {
		lines = [];
		store(LINES_KEY, lines);
		renderAll();
	}

	function banner(): Line {
		const [before, after = ''] = t('term.banner').split('{help}');
		return [
			{ text: before, role: 'muted' },
			{ text: 'help', role: 'accent' },
			{ text: after, role: 'muted' },
		];
	}

	const promptLine = (text: string): Line => [
		{ text: 'guest@figielak', role: 'accent' },
		{ text: `:${data.cwd}$ `, role: 'muted' },
		{ text },
	];

	/* ---- input ---- */

	/* The real input is transparent over this mirror, which draws the typed
	   text with a block cursor at the caret. */
	function renderTyped() {
		const value = secret ? '*'.repeat(input.value.length) : input.value;
		const at = Math.min(input.selectionStart ?? value.length, value.length);
		const cursor = document.createElement('span');
		cursor.className = 'term-cursor';
		cursor.textContent = value[at] ?? ' ';
		typed.replaceChildren(value.slice(0, at), cursor, value.slice(at + 1));
	}

	function setInput(value: string) {
		input.value = value;
		input.setSelectionRange(value.length, value.length);
		renderTyped();
	}

	function ask(label: string, hide = false): Promise<string> {
		return new Promise((resolve) => {
			answer = resolve;
			secret = hide;
			input.type = hide ? 'password' : 'text';
			const span = document.createElement('span');
			span.className = 'term-path';
			span.textContent = label;
			prompt.replaceChildren(span);
			setInput('');
		});
	}

	function endAsk(): ((value: string) => void) | null {
		const resolve = answer;
		answer = null;
		secret = false;
		input.type = 'text';
		prompt.replaceChildren(...defaultPrompt);
		return resolve;
	}

	function reply() {
		const value = input.value;
		print([
			{ text: prompt.textContent ?? '', role: 'muted' },
			{ text: secret ? '*'.repeat(value.length) : value },
		]);
		const resolve = endAsk();
		setInput('');
		resolve?.(value);
	}

	async function takeover(run: (screen: HTMLElement, signal: AbortSignal) => Promise<void>) {
		const screen = document.createElement('pre');
		screen.className = 'term-screen';
		screen.setAttribute('aria-hidden', 'true');
		body.append(screen);

		const controller = new AbortController();
		effect = controller;
		const stop = (event: Event) => {
			event.preventDefault();
			event.stopPropagation();
			controller.abort();
		};
		window.addEventListener('keydown', stop, { capture: true });
		screen.addEventListener('pointerdown', stop);
		try {
			await run(screen, controller.signal);
		} finally {
			window.removeEventListener('keydown', stop, { capture: true });
			screen.remove();
			effect = null;
		}
	}

	const context = (args: string[], rest: string): Context => ({
		args,
		rest,
		data,
		commands,
		history,
		t,
		print,
		loading,
		clear,
		close,
		navigate: (href) => location.assign(href),
		ask,
		takeover,
	});

	async function execute(raw: string) {
		print(promptLine(raw));
		const text = raw.trim();
		if (!text) return;

		if (history.at(-1) !== text) {
			history.push(text);
			if (history.length > MAX_HISTORY) history.shift();
			store(HISTORY_KEY, history);
		}
		historyAt = history.length;
		draft = '';

		const [head, ...args] = text.split(/\s+/);
		const command = find(head.toLowerCase());
		if (!command) return print(t('term.notFound', { name: head }));

		busy = true;
		try {
			await command.run(context(args, text.slice(head.length).trim()));
		} catch {
			print([{ text: t('term.failed', { name: head }), role: 'muted' }]);
		} finally {
			busy = false;
		}
	}

	/* Tab: the command name, or its first argument when the command offers
	   candidates. Several matches fill their common start, then get listed. */
	function complete() {
		const value = input.value;
		const parts = value.split(' ');
		let options: string[];
		if (parts.length === 1) {
			options = commands.filter((c) => !c.hidden).flatMap((c) => [c.name, ...(c.aliases ?? [])]);
		} else if (parts.length === 2) {
			options = find(parts[0].toLowerCase())?.complete?.(data) ?? [];
		} else return;

		const word = parts.at(-1)!.toLowerCase();
		const matches = [...new Set(options.filter((option) => option.startsWith(word)))];
		if (!matches.length) return;

		const head = parts.slice(0, -1).map((part) => `${part} `).join('');
		if (matches.length === 1) return setInput(`${head}${matches[0]} `);

		const common = matches.reduce((a, b) => {
			let i = 0;
			while (i < a.length && a[i] === b[i]) i++;
			return a.slice(0, i);
		});
		if (common.length > word.length) return setInput(head + common);
		print(promptLine(value), [{ text: matches.join('  '), role: 'muted' }]);
	}

	function browse(step: number) {
		if (!history.length) return;
		if (historyAt === history.length) draft = input.value;
		historyAt = Math.max(0, Math.min(history.length, historyAt + step));
		setInput(historyAt === history.length ? draft : history[historyAt]);
	}

	input.addEventListener('keydown', (event) => {
		if (event.isComposing) return;
		const key = event.key.toLowerCase();

		if (key === 'enter') {
			event.preventDefault();
			if (answer) return reply();
			if (busy) return;
			const value = input.value;
			setInput('');
			void execute(value);
			return;
		}
		if (event.ctrlKey && key === 'l') {
			event.preventDefault();
			clear();
			return;
		}
		if (answer) return;
		if (key === 'tab' && !event.shiftKey) {
			event.preventDefault();
			complete();
		} else if (key === 'arrowup') {
			event.preventDefault();
			browse(-1);
		} else if (key === 'arrowdown') {
			event.preventDefault();
			browse(1);
		}
	});

	for (const type of ['input', 'keyup', 'click', 'focus', 'blur', 'select']) {
		input.addEventListener(type, renderTyped);
	}
	document.addEventListener('selectionchange', () => {
		if (document.activeElement === input) renderTyped();
	});

	/* A click in the output puts the caret back, unless it selected text. */
	output.addEventListener('click', (event) => {
		if ((event.target as Element).closest('a') || getSelection()?.toString()) return;
		input.focus({ preventScroll: true });
	});

	/* ---- opening and closing ---- */

	function setExpanded(value: boolean) {
		for (const el of document.querySelectorAll('[data-terminal-toggle]')) {
			el.setAttribute('aria-expanded', String(value));
		}
	}

	function open() {
		if (isOpen) return;
		isOpen = true;
		returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

		/* A modal: the rest of the page goes inert until the panel closes. */
		inerted = [...document.body.children].filter(
			(el): el is HTMLElement => el instanceof HTMLElement && el !== root && !el.inert,
		);
		for (const el of inerted) el.inert = true;

		root.inert = false;
		root.dataset.open = '';
		document.documentElement.classList.add('terminal-open');
		setExpanded(true);
		scrollDown();
		requestAnimationFrame(() => input.focus({ preventScroll: true }));
	}

	function close() {
		if (!isOpen) return;
		isOpen = false;
		effect?.abort();
		if (answer) endAsk()?.('');

		delete root.dataset.open;
		root.inert = true;
		for (const el of inerted) el.inert = false;
		inerted = [];
		document.documentElement.classList.remove('terminal-open');
		setExpanded(false);
		returnFocus?.focus({ preventScroll: true });
		returnFocus = null;
	}

	document.addEventListener('keydown', (event) => {
		if (event.isComposing) return;
		const plain = !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
		if (event.code === 'Backquote' && plain) {
			/* Typing elsewhere keeps its backquote; the terminal's own input
			   treats it as the toggle. */
			if (isOpen ? event.target !== input && isEditable(event.target) : isEditable(event.target)) return;
			event.preventDefault();
			if (isOpen) close();
			else open();
		} else if (event.key === 'Escape' && isOpen) {
			event.preventDefault();
			close();
		}
	});

	document.addEventListener('click', (event) => {
		if ((event.target as Element).closest?.('[data-terminal-toggle]')) {
			if (isOpen) close();
			else open();
		}
	});

	for (const el of root.querySelectorAll('[data-terminal-close]')) el.addEventListener('click', close);

	for (const chip of root.querySelectorAll<HTMLElement>('[data-command]')) {
		chip.addEventListener('click', () => {
			if (busy || answer) return;
			void execute(chip.dataset.command!);
			input.focus({ preventScroll: true });
		});
	}

	if (!lines.length) {
		lines = [banner()];
		store(LINES_KEY, lines);
	}
	renderAll();
	renderTyped();
}
