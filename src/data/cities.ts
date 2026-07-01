export interface CityInfo {
  city: string;
  region: string;
  lat: number;
  lng: number;
}

export const CITIES: CityInfo[] = [
{ city: 'الرياض', region: 'الرياض', lat: 24.7136, lng: 46.6753 },
{ city: 'جدة', region: 'مكة المكرمة', lat: 21.4858, lng: 39.1925 },
{ city: 'مكة المكرمة', region: 'مكة المكرمة', lat: 21.3891, lng: 39.8579 },
{ city: 'الطائف', region: 'مكة المكرمة', lat: 21.2703, lng: 40.4158 },
{ city: 'المدينة المنورة', region: 'المدينة المنورة', lat: 24.5247, lng: 39.5692 },
{ city: 'ينبع', region: 'المدينة المنورة', lat: 24.0895, lng: 38.0618 },
{ city: 'الدمام', region: 'المنطقة الشرقية', lat: 26.4207, lng: 50.0888 },
{ city: 'الخبر', region: 'المنطقة الشرقية', lat: 26.2172, lng: 50.1971 },
{ city: 'الجبيل', region: 'المنطقة الشرقية', lat: 27.0046, lng: 49.6605 },
{ city: 'أبها', region: 'عسير', lat: 18.2164, lng: 42.5053 },
{ city: 'جازان', region: 'جازان', lat: 16.8894, lng: 42.5706 },
{ city: 'نجران', region: 'نجران', lat: 17.4924, lng: 44.1277 },
{ city: 'تبوك', region: 'تبوك', lat: 28.3838, lng: 36.555 },
{ city: 'حائل', region: 'حائل', lat: 27.5114, lng: 41.69 },
{ city: 'بريدة', region: 'القصيم', lat: 26.326, lng: 43.975 }];


export function getCityInfo(city: string): CityInfo | undefined {
  return CITIES.find((c) => c.city === city);
}

export function getRegions(): string[] {
  return Array.from(new Set(CITIES.map((c) => c.region)));
}

export function getCitiesByRegion(region: string): CityInfo[] {
  return CITIES.filter((c) => c.region === region);
}
