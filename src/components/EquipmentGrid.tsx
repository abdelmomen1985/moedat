import React from 'react';
import {
  Box,
  Container,
  Title,
  Text,
  SimpleGrid,
  Button,
  Group } from
'@mantine/core';
import { EquipmentCard } from './EquipmentCard';
import type { Equipment } from '../data/types';

interface EquipmentGridProps {
  items: Equipment[];
  title?: string;
  description?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadMoreLabel?: string;
  emptyMessage?: string;
}

export function EquipmentGrid({
  items,
  title,
  description,
  onLoadMore,
  hasMore,
  loadMoreLabel = 'عرض المزيد',
  emptyMessage = 'لا توجد معدات مطابقة لبحثك حالياً'
}: EquipmentGridProps) {
  return (
    <Box py={80} bg="#F8F9FA">
      <Container size="xl">
        {(title || description) &&
        <Box ta="center" mb={50}>
            {title &&
          <Title order={2} fw={800} c="#1B1B2F" mb="sm">
                {title}
              </Title>
          }
            {description &&
          <Text c="dimmed" size="lg" maw={600} mx="auto">
                {description}
              </Text>
          }
          </Box>
        }

        {items.length === 0 ?
        <Text ta="center" c="dimmed" size="lg" py={40}>
            {emptyMessage}
          </Text> :

        <SimpleGrid
          cols={{
            base: 1,
            sm: 2,
            lg: 4
          }}
          spacing="lg">

            {items.map((item) =>
          <EquipmentCard
            key={item.id}
            id={item.id}
            title={item.title}
            category={item.category}
            region={item.region}
            year={item.year}
            condition={item.condition}
            serviceType={item.serviceType}
            image={item.image} />

          )}
          </SimpleGrid>
        }

        {onLoadMore && hasMore &&
        <Group justify="center" mt={50}>
            <Button
            size="lg"
            variant="outline"
            color="brand.5"
            radius="md"
            px={40}
            onClick={onLoadMore}>

              {loadMoreLabel}
            </Button>
          </Group>
        }
      </Container>
    </Box>);

}
