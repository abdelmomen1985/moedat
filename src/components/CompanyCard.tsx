import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Group, Avatar, Box, Text, Badge, Button, Stack } from '@mantine/core';
import { ShieldCheckIcon, MapPinIcon } from 'lucide-react';
import type { Company } from '../data/types';
import { getEquipmentByCompanyId } from '../data/repository';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const listingsCount = getEquipmentByCompanyId(company.id).length;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group wrap="nowrap">
          <Avatar size="lg" radius="md" color="brand.5">
            {company.name.charAt(0)}
          </Avatar>
          <Box style={{ flex: 1 }}>
            <Text fw={700} size="md" lineClamp={1}>
              {company.name}
            </Text>
            {company.verified &&
            <Group gap={4}>
                <ShieldCheckIcon size={14} color="#10B981" />
                <Text size="xs" c="green.6" fw={600}>
                  شركة موثقة
                </Text>
              </Group>
            }
          </Box>
        </Group>

        <Group gap="xs">
          <MapPinIcon size={16} color="var(--mantine-color-gray-5)" />
          <Text size="sm" c="dimmed">
            {company.region}، {company.city}
          </Text>
        </Group>

        <Badge color="brand.5" variant="light" size="lg" radius="sm" w="fit-content">
          {listingsCount} إعلان
        </Badge>

        <Button variant="light" color="brand.5" fullWidth radius="md" component={Link} to={`/companies/${company.id}`}>
          عرض الإعلانات
        </Button>
      </Stack>
    </Card>);

}
