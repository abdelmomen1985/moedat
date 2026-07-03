import React, { useMemo, useState } from 'react';
import { Box, Container, Title, Text, TextInput, Select, SimpleGrid, Group } from '@mantine/core';
import { SearchIcon, MapPinIcon } from 'lucide-react';
import { CompanyCard } from '../components/CompanyCard';
import { getAllCompanies } from '../data/repository';
import { getRegions } from '../data/cities';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function CompanyDirectory() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState<string | null>(null);
  useDocumentTitle('دليل الشركات');

  const companies = useMemo(() => {
    return getAllCompanies().filter((company) => {
      if (keyword && !company.name.includes(keyword)) return false;
      if (region && company.region !== region) return false;
      return true;
    });
  }, [keyword, region]);

  return (
    <Box style={{ flex: 1 }} bg="#F8F9FA">
      <Box bg="#1B1B2F" py={50}>
        <Container size="xl">
          <Title order={1} c="white" fw={800} mb="xs">
            دليل الشركات
          </Title>
          <Text c="gray.4">تصفح الشركات الموثوقة لتأجير وبيع المعدات الثقيلة</Text>
        </Container>
      </Box>

      <Container size="xl" py={40}>
        <Group mb="xl" grow>
          <TextInput
            placeholder="ابحث عن شركة..."
            leftSection={<SearchIcon size={16} />}
            radius="md"
            size="md"
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)} />

          <Select
            placeholder="اختر المنطقة"
            leftSection={<MapPinIcon size={16} />}
            radius="md"
            size="md"
            data={getRegions()}
            clearable
            value={region}
            onChange={setRegion} />

        </Group>

        {companies.length === 0 ?
        <Text ta="center" c="dimmed" py={40}>لا توجد شركات مطابقة</Text> :

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
          </SimpleGrid>
        }
      </Container>
    </Box>);

}
