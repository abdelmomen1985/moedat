import type { Company, Equipment } from './types';
import { EQUIPMENT_SEED } from './equipment';
import { COMPANIES_SEED } from './companies';
import { generateId } from '../utils/id';

const LISTINGS_KEY = 'almoedat-user-listings';
const COMPANIES_KEY = 'almoedat-user-companies';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getUserListings(): Equipment[] {
  return readJson<Equipment[]>(LISTINGS_KEY, []);
}

export function addUserListing(equipment: Equipment): void {
  const listings = getUserListings();
  listings.push(equipment);
  writeJson(LISTINGS_KEY, listings);
}

export function getUserCompanies(): Company[] {
  return readJson<Company[]>(COMPANIES_KEY, []);
}

export function addUserCompany(company: Company): void {
  const companies = getUserCompanies();
  companies.push(company);
  writeJson(COMPANIES_KEY, companies);
}

export function getAllEquipment(): Equipment[] {
  return [...EQUIPMENT_SEED, ...getUserListings()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getEquipmentById(id: string): Equipment | undefined {
  return getAllEquipment().find((item) => item.id === id);
}

export function getEquipmentByCompanyId(companyId: string): Equipment[] {
  return getAllEquipment().filter((item) => item.companyId === companyId);
}

export function getAllCompanies(): Company[] {
  return [...COMPANIES_SEED, ...getUserCompanies()];
}

export function getCompanyById(id: string): Company | undefined {
  return getAllCompanies().find((company) => company.id === id);
}

const USER_COMPANY_MAP_KEY = 'almoedat-user-company-map';

export function getOrCreateCompanyForUser(user: {
  id: string;
  name: string;
  phone: string;
}): Company {
  const map = readJson<Record<string, string>>(USER_COMPANY_MAP_KEY, {});
  const existingId = map[user.id];
  if (existingId) {
    const existing = getCompanyById(existingId);
    if (existing) return existing;
  }

  const company: Company = {
    id: `co-${generateId()}`,
    name: user.name,
    verified: false,
    region: 'الرياض',
    city: 'الرياض',
    phone: user.phone,
    whatsapp: user.phone,
    description: `إعلانات ${user.name} على منصة المعدات.`
  };
  addUserCompany(company);
  map[user.id] = company.id;
  writeJson(USER_COMPANY_MAP_KEY, map);
  return company;
}
