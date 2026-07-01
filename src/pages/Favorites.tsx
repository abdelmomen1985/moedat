import React from 'react';
import { Box, Container, Title, Text } from '@mantine/core';
import { EquipmentGrid } from '../components/EquipmentGrid';
import { getAllEquipment } from '../data/repository';
import { useFavorites } from '../hooks/useFavorites';

export function Favorites() {
  const { favorites } = useFavorites();
  const items = getAllEquipment().filter((item) => favorites.includes(item.id));

  return (
    <Box style={{ flex: 1 }} bg="#F8F9FA">
      <Box bg="#1B1B2F" py={50}>
        <Container size="xl">
          <Title order={1} c="white" fw={800} mb="xs">
            المفضلة
          </Title>
          <Text c="gray.4">المعدات التي أضفتها إلى قائمة المفضلة لديك</Text>
        </Container>
      </Box>
      <EquipmentGrid
        items={items}
        emptyMessage="لم تقم بإضافة أي معدات إلى المفضلة بعد" />

    </Box>);

}
