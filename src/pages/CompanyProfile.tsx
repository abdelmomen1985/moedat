import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Title, Text, Group, Avatar, Badge, Button } from '@mantine/core';
import { ShieldCheckIcon, MapPinIcon, PhoneIcon, ChevronRightIcon } from 'lucide-react';
import { getCompanyById, getEquipmentByCompanyId } from '../data/repository';
import { EquipmentGrid } from '../components/EquipmentGrid';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function CompanyProfile() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const company = id ? getCompanyById(id) : undefined;
  const listings = id ? getEquipmentByCompanyId(id) : [];
  const { visibleItems, hasMore, loadMore } = usePaginatedList(listings, 8);
  useDocumentTitle(company?.name || 'ملف الشركة');

  if (!company) {
    return (
      <Box py={80} bg="#F8F9FA" style={{ flex: 1 }}>
        <Container size="xl" ta="center">
          <Title order={2} mb="md">لم يتم العثور على هذه الشركة</Title>
          <Button color="brand.5" onClick={() => navigate('/companies')}>
            العودة لدليل الشركات
          </Button>
        </Container>
      </Box>);

  }

  return (
    <Box style={{ flex: 1 }} bg="#F8F9FA">
      <Box bg="#1B1B2F" py={50}>
        <Container size="xl">
          <Button
            variant="subtle"
            color="gray"
            mb="md"
            leftSection={<ChevronRightIcon size={18} />}
            onClick={() => navigate(-1)}>

            رجوع
          </Button>
          <Group wrap="nowrap" align="flex-start">
            <Avatar size={80} radius="md" color="brand.5">
              {company.name.charAt(0)}
            </Avatar>
            <Box>
              <Group gap="sm" mb={4}>
                <Title order={1} c="white" fw={800}>
                  {company.name}
                </Title>
                {company.verified &&
                <Badge color="green" leftSection={<ShieldCheckIcon size={12} />}>
                    شركة موثقة
                  </Badge>
                }
              </Group>
              <Text c="gray.4" mb="sm" maw={600}>
                {company.description}
              </Text>
              <Group gap="lg">
                <Group gap={6}>
                  <MapPinIcon size={16} color="#D4A017" />
                  <Text c="gray.3" size="sm">{company.region}، {company.city}</Text>
                </Group>
                <Group gap={6}>
                  <PhoneIcon size={16} color="#D4A017" />
                  <Text c="gray.3" size="sm" dir="ltr">{company.phone}</Text>
                </Group>
              </Group>
            </Box>
          </Group>
        </Container>
      </Box>

      <EquipmentGrid
        items={visibleItems}
        title="إعلانات الشركة"
        onLoadMore={loadMore}
        hasMore={hasMore}
        emptyMessage="لا توجد إعلانات لهذه الشركة حالياً" />

    </Box>);

}
