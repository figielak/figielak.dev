/** Constant-time comparison of secrets: the password and push tokens (koncept.md §14). */
import { createHash, timingSafeEqual } from 'node:crypto';

/** Hashing first gives equal-length buffers, so the comparison is constant-time. */
const digest = (value: string) => createHash('sha256').update(value).digest();

export function sameSecret(given: string, expected: string): boolean {
	return timingSafeEqual(digest(given), digest(expected));
}
