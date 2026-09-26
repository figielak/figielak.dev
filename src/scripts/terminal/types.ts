/**
 * Shapes shared by the terminal core and its commands (docs/koncept.md §8).
 */

/** How a piece of output reads: the colour roles of the page tokens. */
export type Role = 'text' | 'muted' | 'accent' | 'ok' | 'down';

export interface Segment {
	text: string;
	role?: Role;
	/** Makes the segment a link; http(s) links open in a new tab. */
	href?: string;
}

export type Line = Segment[];

/** A plain string prints as one line of ordinary text. */
export type Printable = Line | string;

export type Lang = 'pl' | 'en';

export interface Dir {
	name: string;
	aliases: string[];
	href: string;
}

/** Everything the page knows at build time, handed to the browser as JSON. */
export interface TerminalData {
	lang: Lang;
	/** The `term.*` strings of the page language. */
	strings: Record<string, string>;
	/** The page as a path in the terminal, e.g. `~/dashboard`. */
	cwd: string;
	dirs: Dir[];
	/** This page in each language; a Polish-only page has no `en`. */
	langHrefs: Partial<Record<Lang, string>>;
	/** Themes that exist so far (docs/koncept.md §12). */
	themes: string[];
	socials: { name: string; label: string; url: string }[];
	projects: { name: string; title: string; href: string }[];
}

/** A `loading…` line, replaced once the data arrives or fails. */
export interface Pending {
	done(...lines: Printable[]): void;
}

export interface Context {
	args: string[];
	/** Everything typed after the command name, spacing kept. */
	rest: string;
	data: TerminalData;
	commands: Command[];
	history: string[];
	t(key: string, vars?: Record<string, string | number>): string;
	print(...lines: Printable[]): void;
	loading(): Pending;
	clear(): void;
	close(): void;
	navigate(href: string): void;
	/** Asks for a line of input under its own prompt; `secret` masks it. */
	ask(label: string, secret?: boolean): Promise<string>;
	/** Covers the output for an effect until `run` ends or a key is pressed. */
	takeover(run: (screen: HTMLElement, signal: AbortSignal) => Promise<void>): Promise<void>;
}

export type Group = 'basic' | 'about' | 'live' | 'nav';

/**
 * One command. Its description in `help` is the string `term.cmd.<name>`.
 * Hidden commands (easter eggs) stay out of `help` and Tab completion.
 */
export interface Command {
	name: string;
	aliases?: string[];
	group?: Group;
	hidden?: boolean;
	/** Candidates for the first argument, for Tab completion. */
	complete?(data: TerminalData): string[];
	run(ctx: Context): void | Promise<void>;
}
