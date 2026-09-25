/**
 * Tutoring lessons from a Google Calendar (koncept.md §3.4, §9): the secret
 * iCal address of a calendar that holds only lessons, TUTORING_ICAL_URL, a
 * Secret Manager value read at runtime. Recurring lessons (RRULE, with moved
 * or cancelled occurrences) are expanded by ical.js. Which past lessons are
 * paid is marked on the dashboard and kept in Firestore (private/payments).
 */
import ICAL from 'ical.js';
import { LESSONS_SHOWN, type Lesson } from '../mocks/lessons';
import { readDoc, writeDoc } from './firestore';

export const icalUrl = () => process.env.TUTORING_ICAL_URL ?? '';

const PAYMENTS = 'private/payments';
const DAY = 86_400_000;
/* How far back unpaid lessons are listed, and how far ahead the next ones. */
const PAST_DAYS = 30;
const AHEAD_DAYS = 14;
/* A guard for an endless rule starting long ago. */
const MAX_OCCURRENCES = 5_000;

type Occurrence = Omit<Lesson, 'paid'>;

/** Every lesson between `since` and `until`, soonest first. */
export function parseLessons(ics: string, since: Date, until: Date): Occurrence[] {
	const calendar = new ICAL.Component(ICAL.parse(ics));
	for (const zone of calendar.getAllSubcomponents('vtimezone')) ICAL.TimezoneService.register(zone);

	const masters = new Map<string, ICAL.Event>();
	const exceptions: ICAL.Event[] = [];
	for (const component of calendar.getAllSubcomponents('vevent')) {
		const event = new ICAL.Event(component);
		if (event.isRecurrenceException()) exceptions.push(event);
		else masters.set(event.uid, event);
	}
	for (const exception of exceptions) masters.get(exception.uid)?.relateException(exception);

	const lessons: Occurrence[] = [];
	/* The key follows the planned time (RECURRENCE-ID), so a moved lesson
	   keeps its payment mark. */
	const add = (uid: string, item: ICAL.Event, planned: ICAL.Time, start: ICAL.Time, end: ICAL.Time) => {
		if (item.component.getFirstPropertyValue('status') === 'CANCELLED') return;
		const startDate = start.toJSDate();
		if (startDate < since || startDate >= until) return;
		lessons.push({
			key: `${uid}@${planned.toJSDate().toISOString()}`,
			start: startDate,
			end: end.toJSDate(),
			student: item.summary || '—',
		});
	};

	for (const event of masters.values()) {
		if (!event.isRecurring()) {
			add(event.uid, event, event.startDate, event.startDate, event.endDate);
			continue;
		}
		const iterator = event.iterator();
		for (let i = 0, next = iterator.next(); next && i < MAX_OCCURRENCES; i++, next = iterator.next()) {
			if (next.toJSDate() >= until) break;
			const details = event.getOccurrenceDetails(next);
			add(event.uid, details.item, details.recurrenceId, details.startDate, details.endDate);
		}
	}
	return lessons.sort((a, b) => a.start.getTime() - b.start.getTime());
}

async function readPayments(): Promise<Record<string, true>> {
	return ((await readDoc(PAYMENTS)).paid as Record<string, true> | undefined) ?? {};
}

export async function fetchLessons(now = new Date()): Promise<{ upcoming: Lesson[]; unpaid: Lesson[] }> {
	const response = await fetch(icalUrl(), { signal: AbortSignal.timeout(10_000) });
	if (!response.ok) throw new Error(`calendar responded ${response.status}`);
	const occurrences = parseLessons(
		await response.text(),
		new Date(now.getTime() - PAST_DAYS * DAY),
		new Date(now.getTime() + AHEAD_DAYS * DAY),
	);
	const paid = await readPayments();
	const lessons = occurrences.map((lesson) => ({ ...lesson, paid: Boolean(paid[lesson.key]) }));

	return {
		/* A lesson going on right now is still "next". */
		upcoming: lessons.filter((lesson) => lesson.end > now).slice(0, LESSONS_SHOWN),
		unpaid: lessons.filter((lesson) => lesson.end <= now && !lesson.paid).reverse(),
	};
}

/** Marks one lesson as paid or not; the map is small, so it is rewritten whole. */
export async function setPaid(key: string, paid: boolean): Promise<void> {
	const payments = await readPayments();
	if (paid) payments[key] = true;
	else delete payments[key];
	await writeDoc(PAYMENTS, { paid: payments });
}
