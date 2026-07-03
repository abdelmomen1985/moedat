import { describe, it, expect, vi } from 'vitest';
import { generateId } from '../id';

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('returns unique values on successive calls', () => {
    const a = generateId();
    const b = generateId();
    expect(a).not.toBe(b);
  });

  it('falls back when crypto.randomUUID is unavailable', () => {
    const original = crypto.randomUUID;
    // @ts-expect-error — simulating insecure context
    crypto.randomUUID = undefined;

    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
    // fallback format: timestamp-random
    expect(id).toMatch(/^\d+-[a-z0-9]+$/);

    crypto.randomUUID = original;
  });

  it('falls back when crypto.randomUUID throws', () => {
    const original = crypto.randomUUID;
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
      throw new TypeError('Not supported');
    });

    const id = generateId();
    expect(id).toMatch(/^\d+-[a-z0-9]+$/);

    crypto.randomUUID = original;
  });
});
