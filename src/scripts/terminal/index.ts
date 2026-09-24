/**
 * Starts the terminal with every module in ./commands — a new command is a
 * new file there, nothing else.
 */
import { mountTerminal } from './core';
import type { Command, TerminalData } from './types';

const modules = import.meta.glob<{ default: Command }>('./commands/*.ts', { eager: true });
const commands = Object.values(modules).map((module) => module.default);

const root = document.querySelector<HTMLElement>('[data-terminal]');
const raw = root?.querySelector('[data-terminal-data]')?.textContent;
if (root && raw) mountTerminal(root, JSON.parse(raw) as TerminalData, commands);
