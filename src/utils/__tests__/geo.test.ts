import { describe, it, expect } from 'vitest';
import { haversineDistanceKm, formatDistance } from '../geo';

describe('haversineDistanceKm', () => {
  it('returns 0 for the same point', () => {
    expect(haversineDistanceKm(24.7136, 46.6753, 24.7136, 46.6753)).toBe(0);
  });

  it('calculates distance between Riyadh and Jeddah (~844 km straight-line)', () => {
    // Riyadh: 24.7136, 46.6753 — Jeddah: 21.5429, 39.1728
    const dist = haversineDistanceKm(24.7136, 46.6753, 21.5429, 39.1728);
    expect(dist).toBeGreaterThan(830);
    expect(dist).toBeLessThan(860);
  });

  it('calculates distance between two nearby points (~1 km)', () => {
    // ~0.009 degrees latitude ≈ 1 km
    const dist = haversineDistanceKm(24.7136, 46.6753, 24.7226, 46.6753);
    expect(dist).toBeGreaterThan(0.9);
    expect(dist).toBeLessThan(1.1);
  });

  it('is symmetric', () => {
    const a = haversineDistanceKm(24.7136, 46.6753, 21.5429, 39.1728);
    const b = haversineDistanceKm(21.5429, 39.1728, 24.7136, 46.6753);
    expect(a).toBeCloseTo(b, 10);
  });
});

describe('formatDistance', () => {
  it('formats sub-kilometer distances in meters', () => {
    expect(formatDistance(0.5)).toBe('500 م');
  });

  it('formats kilometer distances with one decimal', () => {
    expect(formatDistance(5.3)).toBe('5.3 كم');
  });

  it('formats exactly 1 km', () => {
    expect(formatDistance(1)).toBe('1.0 كم');
  });

  it('formats 0 m', () => {
    expect(formatDistance(0)).toBe('0 م');
  });
});
