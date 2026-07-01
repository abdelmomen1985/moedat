export type EquipmentCategory =
'معدات الرفع' |
'معدات الحفر' |
'معدات النقل' |
'معدات التحميل' |
'معدات الطرق';

export type ServiceType =
'للإيجار' |
'للبيع' |
'مطلوب للإيجار' |
'مطلوب للبيع';

export type EquipmentCondition = 'جديد' | 'مستعمل';

export type EquipmentStatus = 'available' | 'available-tomorrow' | 'reserved';

export interface Equipment {
  id: string;
  title: string;
  category: EquipmentCategory;
  serviceType: ServiceType;
  region: string;
  city: string;
  lat: number;
  lng: number;
  year: string;
  condition: EquipmentCondition;
  fuelType: string;
  pricePerDay: number;
  description: string;
  companyId: string;
  status: EquipmentStatus;
  createdAt: string;
  imageDataUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  verified: boolean;
  region: string;
  city: string;
  phone: string;
  whatsapp: string;
  description: string;
}
