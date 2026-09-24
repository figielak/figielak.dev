/**
 * Availability bars in the uptime tile. A 0–100% bar would make 96% and 99%
 * look the same, so the bar starts at BAR_FLOOR; anything below it is empty.
 */
export const BAR_FLOOR = 90;

/** Bar width in percent for a 30-day availability, 0 when there is none. */
export function availabilityBar(uptime30d: number | undefined): number {
	if (uptime30d === undefined) return 0;
	const width = ((uptime30d - BAR_FLOOR) / (100 - BAR_FLOOR)) * 100;
	return Math.round(Math.min(100, Math.max(0, width)) * 10) / 10;
}
