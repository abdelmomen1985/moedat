import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Title,
  Text,
  Card,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Button,
  SimpleGrid,
  FileInput,
  Stack,
  Alert } from
'@mantine/core';
import { notifications } from '@mantine/notifications';
import { LockIcon, UploadIcon, CheckCircle2Icon } from 'lucide-react';
import { useForm } from '@mantine/form';
import { useAuth } from '../context/AuthContext';
import { getRegions, getCitiesByRegion } from '../data/cities';
import { addUserListing, getOrCreateCompanyForUser } from '../data/repository';
import { resizeImageFile, ImageTooLargeError } from '../utils/imageResize';
import type { Equipment, EquipmentCategory, EquipmentCondition, ServiceType } from '../data/types';

interface ListingFormValues {
  title: string;
  category: EquipmentCategory | '';
  serviceType: ServiceType | '';
  region: string;
  city: string;
  year: string;
  condition: EquipmentCondition | '';
  fuelType: string;
  pricePerDay: number | '';
  description: string;
}

export function PostListing() {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [imageError, setImageError] = useState<string | null>(null);
  const [createdListingId, setCreatedListingId] = useState<string | null>(null);

  const form = useForm<ListingFormValues>({
    initialValues: {
      title: '',
      category: '',
      serviceType: '',
      region: '',
      city: '',
      year: String(new Date().getFullYear()),
      condition: '',
      fuelType: 'ديزل',
      pricePerDay: '',
      description: ''
    },
    validate: {
      title: (value) => value.trim().length >= 5 ? null : 'العنوان يجب أن يكون 5 أحرف على الأقل',
      category: (value) => value ? null : 'اختر التصنيف',
      serviceType: (value) => value ? null : 'اختر نوع الخدمة',
      region: (value) => value ? null : 'اختر المنطقة',
      city: (value) => value ? null : 'اختر المدينة',
      condition: (value) => value ? null : 'اختر الحالة',
      description: (value) => value.trim().length >= 10 ? null : 'الوصف يجب أن يكون 10 أحرف على الأقل'
    }
  });

  if (!isAuthenticated || !user) {
    return (
      <Box py={100} bg="#F8F9FA" style={{ flex: 1 }}>
        <Container size="xs" ta="center">
          <LockIcon size={48} color="#D4A017" style={{ marginBottom: 16 }} />
          <Title order={2} mb="sm">يجب تسجيل الدخول أولاً</Title>
          <Text c="dimmed" mb="xl">
            لإضافة إعلان جديد، الرجاء تسجيل الدخول أو إنشاء حساب جديد.
          </Text>
          <Button color="brand.5" radius="md" onClick={() => openAuthModal('login')}>
            تسجيل الدخول / إنشاء حساب
          </Button>
        </Container>
      </Box>);

  }

  if (createdListingId) {
    return (
      <Box py={100} bg="#F8F9FA" style={{ flex: 1 }}>
        <Container size="xs" ta="center">
          <CheckCircle2Icon size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <Title order={2} mb="sm">تم نشر إعلانك بنجاح</Title>
          <Text c="dimmed" mb="xl">يمكنك الآن مشاهدة إعلانك أو إضافة إعلان آخر.</Text>
          <SimpleGrid cols={2}>
            <Button component={Link} to={`/equipment/${createdListingId}`} color="brand.5" radius="md">
              عرض الإعلان
            </Button>
            <Button
              variant="outline"
              color="brand.5"
              radius="md"
              onClick={() => {
                form.reset();
                setImageDataUrl(undefined);
                setCreatedListingId(null);
              }}>

              إضافة إعلان آخر
            </Button>
          </SimpleGrid>
        </Container>
      </Box>);

  }

  const cityOptions = form.values.region ?
  getCitiesByRegion(form.values.region).map((c) => c.city) :
  [];

  const handleFileChange = async (file: File | null) => {
    setImageError(null);
    if (!file) {
      setImageDataUrl(undefined);
      return;
    }
    try {
      const dataUrl = await resizeImageFile(file);
      setImageDataUrl(dataUrl);
    } catch (err) {
      setImageError(err instanceof ImageTooLargeError ? err.message : 'تعذر معالجة الصورة');
    }
  };

  const handleSubmit = form.onSubmit((values) => {
    const company = getOrCreateCompanyForUser(user);
    const cityInfo = getCitiesByRegion(values.region).find((c) => c.city === values.city);
    const equipment: Equipment = {
      id: `eq-${crypto.randomUUID()}`,
      title: values.title,
      category: values.category as EquipmentCategory,
      serviceType: values.serviceType as ServiceType,
      region: values.region,
      city: values.city,
      lat: cityInfo?.lat ?? 24.7136,
      lng: cityInfo?.lng ?? 46.6753,
      year: values.year,
      condition: values.condition as EquipmentCondition,
      fuelType: values.fuelType,
      pricePerDay: typeof values.pricePerDay === 'number' ? values.pricePerDay : 0,
      description: values.description,
      companyId: company.id,
      status: 'available',
      createdAt: new Date().toISOString(),
      image: imageDataUrl
    };
    addUserListing(equipment);
    notifications.show({ message: 'تم نشر الإعلان بنجاح', color: 'green' });
    setCreatedListingId(equipment.id);
  });

  return (
    <Box py={60} bg="#F8F9FA" style={{ flex: 1 }}>
      <Container size="sm">
        <Title order={1} fw={800} c="#1B1B2F" mb="xs">
          أضف إعلانك
        </Title>
        <Text c="dimmed" mb="xl">
          املأ البيانات التالية لنشر إعلان معدتك على المنصة
        </Text>

        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="عنوان الإعلان"
                placeholder="مثال: رافعة تلسكوبية 50 طن للإيجار"
                {...form.getInputProps('title')} />


              <SimpleGrid cols={2}>
                <Select
                  label="التصنيف"
                  placeholder="اختر التصنيف"
                  data={[
                  'معدات الرفع',
                  'معدات الحفر',
                  'معدات النقل',
                  'معدات التحميل',
                  'معدات الطرق']
                  }
                  {...form.getInputProps('category')} />


                <Select
                  label="نوع الخدمة"
                  placeholder="اختر نوع الخدمة"
                  data={['للإيجار', 'للبيع', 'مطلوب للإيجار', 'مطلوب للبيع']}
                  {...form.getInputProps('serviceType')} />

              </SimpleGrid>

              <SimpleGrid cols={2}>
                <Select
                  label="المنطقة"
                  placeholder="اختر المنطقة"
                  data={getRegions()}
                  {...form.getInputProps('region')}
                  onChange={(val) => {
                    form.setFieldValue('region', val ?? '');
                    form.setFieldValue('city', '');
                  }} />


                <Select
                  label="المدينة"
                  placeholder="اختر المدينة"
                  data={cityOptions}
                  disabled={!form.values.region}
                  {...form.getInputProps('city')} />

              </SimpleGrid>

              <SimpleGrid cols={3}>
                <TextInput label="سنة الصنع" {...form.getInputProps('year')} />
                <Select
                  label="الحالة"
                  placeholder="اختر الحالة"
                  data={['جديد', 'مستعمل']}
                  {...form.getInputProps('condition')} />

                <TextInput label="نوع الوقود" {...form.getInputProps('fuelType')} />
              </SimpleGrid>

              <NumberInput
                label="السعر اليومي (ريال)"
                placeholder="اتركه فارغاً إذا كان للبيع أو حسب الاتفاق"
                min={0}
                {...form.getInputProps('pricePerDay')} />


              <Textarea
                label="الوصف"
                placeholder="اكتب وصفاً تفصيلياً عن المعدة وحالتها ومواصفاتها"
                minRows={4}
                {...form.getInputProps('description')} />


              <FileInput
                label="صورة المعدة (اختياري)"
                placeholder="اختر صورة"
                accept="image/*"
                leftSection={<UploadIcon size={16} />}
                onChange={handleFileChange}
                clearable />


              {imageError && <Alert color="red">{imageError}</Alert>}

              {imageDataUrl &&
              <Box
                h={160}
                style={{
                  borderRadius: 8,
                  backgroundImage: `url(${imageDataUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />

              }

              <Button type="submit" color="brand.5" radius="md" size="md" mt="sm">
                نشر الإعلان
              </Button>
            </Stack>
          </form>
        </Card>
      </Container>
    </Box>);

}
