import { describe, expect, it } from 'vitest';
import { hasServiceIconKeywordMatch } from './service-icons';

describe('hasServiceIconKeywordMatch', () => {
	it('matches keywords inside route titles', () => {
		expect(hasServiceIconKeywordMatch('YouTube DISABLED')).toBe(true);
		expect(hasServiceIconKeywordMatch('Cloudflare IPs')).toBe(true);
		expect(hasServiceIconKeywordMatch('Facebook')).toBe(true);
	});

	it('does not match unrelated names', () => {
		expect(hasServiceIconKeywordMatch('My custom list')).toBe(false);
		expect(hasServiceIconKeywordMatch('')).toBe(false);
	});
});
