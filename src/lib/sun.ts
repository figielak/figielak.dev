/**
 * Sunrise and sunset from the sunrise equation (NOAA approximation), accurate
 * to about a minute — no API needed (koncept.md §3.4). Runs at build time for
 * the first paint and again in the browser, so the times follow the real date.
 */

/** Rzeszów, the city of the dashboard's local tiles. */
export const SUN_PLACE = { lat: 50.0413, lon: 21.999 };

const RAD = Math.PI / 180;
const DAY_MS = 86_400_000;
/** Julian date of the Unix epoch. */
const JD_UNIX = 2_440_587.5;
/** Julian date of J2000.0. */
const JD_2000 = 2_451_545;

export interface SunTimes {
	sunrise: Date;
	sunset: Date;
	/** Milliseconds between sunrise and sunset. */
	dayLength: number;
}

const toDate = (jd: number) => new Date((jd - JD_UNIX) * DAY_MS);

/** Sun times on the calendar day of `date` (UTC), or null in polar day/night. */
export function sunTimes(date: Date, { lat, lon } = SUN_PLACE): SunTimes | null {
	const noon = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12);
	const n = Math.round(noon / DAY_MS + JD_UNIX - JD_2000);

	const meanNoon = n - lon / 360;
	const anomaly = (357.5291 + 0.98560028 * meanNoon) % 360;
	const center =
		1.9148 * Math.sin(anomaly * RAD) +
		0.02 * Math.sin(2 * anomaly * RAD) +
		0.0003 * Math.sin(3 * anomaly * RAD);
	const longitude = (anomaly + center + 180 + 102.9372) % 360;
	const transit =
		JD_2000 + meanNoon + 0.0053 * Math.sin(anomaly * RAD) - 0.0069 * Math.sin(2 * longitude * RAD);

	const declination = Math.asin(Math.sin(longitude * RAD) * Math.sin(23.4397 * RAD));
	const cosHourAngle =
		(Math.sin(-0.833 * RAD) - Math.sin(lat * RAD) * Math.sin(declination)) /
		(Math.cos(lat * RAD) * Math.cos(declination));
	if (Math.abs(cosHourAngle) > 1) return null;

	const hourAngle = Math.acos(cosHourAngle) / RAD / 360;
	const sunrise = toDate(transit - hourAngle);
	const sunset = toDate(transit + hourAngle);
	return { sunrise, sunset, dayLength: sunset.getTime() - sunrise.getTime() };
}
