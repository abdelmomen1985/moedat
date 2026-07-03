import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getAllEquipment,
  getEquipmentById,
  addUserListing,
  getUserListings,
  getAllCompanies,
  getCompanyById,
} from '../repository';

// Mock crypto.randomUUID for consistent IDs in tests
vi.stubGlobal('crypto', {
  ...crypto,
  randomUUID: () => 'test-uuid-1234',
});

describe('getAllEquipment', () => {
  it('returns seed equipment merged with user listings', () => {
    const all = getAllEquipment();
    expect(all.length).toBeGreaterThanOrEqual(20); // seed data has 20 items
  });

  it('returns items sorted by createdAt descending', () => {
    const all = getAllEquipment();
    for (let i = 1; i < all.length; i++) {
      const prev = new Date(all[i - 1].createdAt).getTime();
      const curr = new Date(all[i].createdAt).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('each item has required fields', () => {
    const all = getAllEquipment();
    for (const item of all) {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.createdAt).toBeTruthy();
    }
  });
});

describe('getEquipmentById', () => {
  it('finds a seed item by id', () => {
    const all = getAllEquipment();
    const first = all[0];
    expect(getEquipmentById(first.id)).toEqual(first);
  });

  it('returns undefined for non-existent id', () => {
    expect(getEquipmentById('nonexistent-id-999')).toBeUndefined();
  });
});

describe('addUserListing / getUserListings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds and retrieves a user listing', () => {
    const listing = {
      id: 'eq-test-1',
      title: 'Test Equipment',
      category: 'رافعات',
      region: 'الرياض',
      year: '2024',
      createdAt: new Date().toISOString(),
      companyId: 'co-test',
      description: 'Test',
      serviceType: 'للإيجار' as const,
      condition: 'جديد' as const,
    };

    addUserListing(listing);
    const listings = getUserListings();
    expect(listings).toHaveLength(1);
    expect(listings[0].id).toBe('eq-test-1');
  });

  it('persists across calls', () => {
    addUserListing({
      id: 'eq-test-2',
      title: 'Another',
      category: 'حفارات',
      region: 'جدة',
      year: '2023',
      createdAt: new Date().toISOString(),
      companyId: 'co-test',
      description: 'Test',
      serviceType: 'للإيجار' as const,
      condition: 'مستعمل' as const,
    });

    // Second call should still see it
    expect(getUserListings()).toHaveLength(1);
  });
});

describe('getAllCompanies / getCompanyById', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns seed companies', () => {
    const companies = getAllCompanies();
    expect(companies.length).toBeGreaterThanOrEqual(7);
  });

  it('finds a company by id', () => {
    const companies = getAllCompanies();
    const first = companies[0];
    expect(getCompanyById(first.id)).toEqual(first);
  });

  it('returns undefined for non-existent company', () => {
    expect(getCompanyById('nonexistent-co')).toBeUndefined();
  });
});
