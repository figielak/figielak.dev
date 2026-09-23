/**
 * Personal facts that change with time. Computed at build time, so the site
 * only needs a rebuild to stay current — the birth date itself never renders.
 */

/* YYYY-MM-DD. */
const birthDate = '2005-11-28';

/* First academic year at university; the year rolls over on 1 October. */
const studyStartYear = 2025;

/** Full years of age on the given day. */
export function ageOn(date: Date = new Date()): number {
	const [year, month, day] = birthDate.split('-').map(Number);
	const hadBirthday =
		date.getMonth() + 1 > month || (date.getMonth() + 1 === month && date.getDate() >= day);
	return date.getFullYear() - year - (hadBirthday ? 0 : 1);
}

/** Current year of study, counting October as the start of a new one. */
export function studyYearOn(date: Date = new Date()): number {
	const octoberOrLater = date.getMonth() >= 9;
	return date.getFullYear() - studyStartYear + (octoberOrLater ? 1 : 0);
}
