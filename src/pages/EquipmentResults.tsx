import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Title, Text } from '@mantine/core';
import { SearchSection } from '../components/SearchSection';
import { EquipmentGrid } from '../components/EquipmentGrid';
import { getAllEquipment } from '../data/repository';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { buildSearchParams, parseSearchParams, SearchValues } from '../utils/searchParams';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function EquipmentResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const values = parseSearchParams(searchParams);
  useDocumentTitle('نتائج البحث');

  const filtered = useMemo(() => {
    const all = getAllEquipment();
    return all.filter((item) => {
      if (
      values.keyword &&
      !item.title.includes(values.keyword) &&
      !item.description.includes(values.keyword))
      {
        return false;
      }
      if (values.serviceType && item.serviceType !== values.serviceType) return false;
      if (values.category && item.category !== values.category) return false;
      if (values.region && item.region !== values.region) return false;
      return true;
    });
  }, [values.keyword, values.serviceType, values.category, values.region]);

  const { visibleItems, hasMore, loadMore } = usePaginatedList(filtered, 8);

  const handleSearch = (next: SearchValues) => {
    setSearchParams(buildSearchParams(next));
  };

  return (
    <Box style={{ flex: 1 }} bg="#F8F9FA">
      <Box bg="#1B1B2F" pt={50} pb={80}>
        <Container size="xl">
          <Title order={1} c="white" fw={800} mb="xs">
            جميع الإعلانات
          </Title>
          <Text c="gray.3">تصفح جميع إعلانات المعدات المتاحة وابحث حسب احتياجك</Text>
        </Container>
      </Box>
      <SearchSection initialValues={values} onSearch={handleSearch} floating />
      <EquipmentGrid
        items={visibleItems}
        onLoadMore={loadMore}
        hasMore={hasMore}
        emptyMessage="لا توجد نتائج مطابقة، جرّب تعديل معايير البحث" />

    </Box>);

}
