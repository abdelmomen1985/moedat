import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Box,
  Text,
  Group,
  Badge,
  ActionIcon,
  Divider,
  Button,
  SimpleGrid } from
'@mantine/core';
import {
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  ZapIcon,
  TruckIcon } from
'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
interface EquipmentCardProps {
  id: string;
  title: string;
  category: string;
  region: string;
  year: string;
  condition?: string;
  serviceType?: string;
  imageDataUrl?: string;
}
export function EquipmentCard({
  id,
  title,
  category,
  region,
  year,
  condition = 'جديد',
  serviceType = 'للإيجار',
  imageDataUrl
}: EquipmentCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={() => navigate(`/equipment/${id}`)}
      style={{
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
      }}>

      <Card.Section relative>
        <Box
          h={200}
          bg={
          imageDataUrl ?
          undefined :
          'linear-gradient(135deg, #2C2C3E 0%, #1B1B2F 100%)'
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: imageDataUrl ? `url(${imageDataUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>

          {!imageDataUrl && <TruckIcon size={64} color="rgba(255,255,255,0.2)" />}
        </Box>
        <Badge
          color="brand.5"
          variant="filled"
          size="lg"
          radius="sm"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 700
          }}>

          {serviceType}
        </Badge>
        <ActionIcon
          variant="white"
          color={favorite ? 'red' : 'gray'}
          radius="xl"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(id);
          }}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>

          <HeartIcon size={18} fill={favorite ? 'currentColor' : 'none'} />
        </ActionIcon>
      </Card.Section>

      <Box
        mt="md"
        style={{
          flex: 1
        }}>

        <Text size="sm" c="brand.5" fw={600} mb={4}>
          {category}
        </Text>
        <Text
          fw={700}
          size="lg"
          lineClamp={2}
          style={{
            lineHeight: 1.4
          }}>

          {title}
        </Text>
      </Box>

      <Divider my="md" color="gray.2" />

      <SimpleGrid cols={2} spacing="sm" mb="md">
        <Group gap={6}>
          <MapPinIcon size={16} color="var(--mantine-color-gray-5)" />
          <Text size="sm" c="dimmed">
            {region}
          </Text>
        </Group>
        <Group gap={6}>
          <CalendarIcon size={16} color="var(--mantine-color-gray-5)" />
          <Text size="sm" c="dimmed">
            {year}
          </Text>
        </Group>
        <Group gap={6}>
          <ZapIcon size={16} color="var(--mantine-color-gray-5)" />
          <Text size="sm" c="dimmed">
            ديزل
          </Text>
        </Group>
        <Group gap={6}>
          <Badge
            color={condition === 'جديد' ? 'green' : 'blue'}
            variant="light"
            size="sm">

            {condition}
          </Badge>
        </Group>
      </SimpleGrid>

      <Button variant="light" color="brand.5" fullWidth radius="md" fw={600}>
        عرض التفاصيل
      </Button>
    </Card>);

}
