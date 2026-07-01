import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  SimpleGrid,
  TextInput,
  Select,
  Button,
  Group } from
'@mantine/core';
import {
  SearchIcon,
  MapPinIcon,
  WrenchIcon,
  LayoutGridIcon } from
'lucide-react';
import { SearchValues } from '../utils/searchParams';
import { getRegions } from '../data/cities';

interface SearchSectionProps {
  initialValues?: SearchValues;
  onSearch: (values: SearchValues) => void;
  floating?: boolean;
}

const DEFAULT_VALUES: SearchValues = {
  keyword: '',
  serviceType: null,
  category: null,
  region: null
};

export function SearchSection({
  initialValues = DEFAULT_VALUES,
  onSearch,
  floating = true
}: SearchSectionProps) {
  const [values, setValues] = useState<SearchValues>(initialValues);

  const handleSubmit = () => onSearch(values);

  return (
    <Box
      style={
      floating ?
      {
        marginTop: '-60px',
        position: 'relative',
        zIndex: 10
      } :
      undefined
      }>

      <Container size="xl">
        <Card
          shadow="xl"
          padding="xl"
          radius="lg"
          bg="white"
          style={{
            border: '1px solid #E5E7EB'
          }}>

          <SimpleGrid
            cols={{
              base: 1,
              md: 4
            }}
            spacing="md"
            verticalSpacing="md">

            <TextInput
              placeholder="ابحث عن معدات..."
              label="كلمة البحث"
              leftSection={<SearchIcon size={16} />}
              size="md"
              radius="md"
              value={values.keyword}
              onChange={(e) => setValues({ ...values, keyword: e.currentTarget.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />


            <Select
              placeholder="اختر نوع الخدمة"
              label="نوع الخدمة"
              data={['للإيجار', 'للبيع', 'مطلوب للإيجار', 'مطلوب للبيع']}
              leftSection={<WrenchIcon size={16} />}
              size="md"
              radius="md"
              clearable
              value={values.serviceType}
              onChange={(val) => setValues({ ...values, serviceType: val })} />


            <Select
              placeholder="اختر التصنيف"
              label="التصنيف"
              data={[
              'معدات الرفع',
              'معدات الحفر',
              'معدات النقل',
              'معدات التحميل',
              'معدات الطرق']
              }
              leftSection={<LayoutGridIcon size={16} />}
              size="md"
              radius="md"
              clearable
              value={values.category}
              onChange={(val) => setValues({ ...values, category: val })} />


            <Select
              placeholder="اختر المنطقة"
              label="المنطقة / المدينة"
              data={getRegions()}
              leftSection={<MapPinIcon size={16} />}
              size="md"
              radius="md"
              clearable
              value={values.region}
              onChange={(val) => setValues({ ...values, region: val })} />

          </SimpleGrid>

          <Group justify="flex-end" mt="lg">
            <Button
              size="md"
              color="brand.5"
              radius="md"
              leftSection={<SearchIcon size={18} />}
              px="xl"
              onClick={handleSubmit}>

              ابحث
            </Button>
          </Group>
        </Card>
      </Container>
    </Box>);

}
