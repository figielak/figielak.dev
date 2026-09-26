/**
 * Tutoring lessons for the private dashboard (docs/koncept.md §3.4): the next
 * ones from the calendar and past ones not marked as paid. Student names
 * appear only here, behind the password, never cached (§14).
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export interface Lesson {
	/** The occurrence: event UID and start, stable across refreshes. */
	key: string;
	start: Date;
	end: Date;
	/** The event title — the student. */
	student: string;
	paid: boolean;
}

export type Lessons = Live<{ upcoming: Lesson[]; unpaid: Lesson[] }>;

/** Rows each list shows at most. */
export const LESSONS_SHOWN = 3;

const at = (days: number, hour: number) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	date.setHours(hour, 0, 0, 0);
	return date;
};

const lesson = (days: number, hour: number, student: string, paid = false): Lesson => ({
	key: `mock-${days}-${hour}`,
	start: at(days, hour),
	end: at(days, hour + 1),
	student,
	paid,
});

export const LESSONS_PLACEHOLDER: NonNullable<Lessons['data']> = {
	upcoming: Array.from({ length: 3 }, (_, i) => lesson(i + 1, 16, '—')),
	unpaid: [],
	updatedAt: new Date(0),
};

export function mockLessons(state: LiveState = 'ok'): Lessons {
	if (state === 'loading' || state === 'error') return { state };
	return {
		state,
		data: {
			upcoming: [lesson(0, 17, 'Ola (8 kl.)'), lesson(1, 16, 'Kuba (matura)'), lesson(3, 18, 'Zosia (8 kl.)')],
			unpaid: [lesson(-2, 16, 'Kuba (matura)'), lesson(-6, 17, 'Ola (8 kl.)')],
			updatedAt: mockUpdatedAt(state),
		},
	};
}
