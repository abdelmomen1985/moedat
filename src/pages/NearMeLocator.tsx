import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Text,
  Title,
  Group,
  Button,
  Card,
  TextInput,
  Select,
  Stack,
  Badge,
  Alert,
  ScrollArea } from
'@mantine/core';
import {
  MapPinIcon,
  SearchIcon,
  NavigationIcon,
  TruckIcon,
  ChevronRightIcon,
  AlertCircleIcon } from
'lucide-react';
import { NearMeMap } from '../components/map/NearMeMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { getAllEquipment } from '../data/repository';
import { haversineDistanceKm, formatDistance } from '../utils/geo';
import { getCityInfo } from '../data/cities';

const RIYADH_FALLBACK = getCityInfo('الرياض') ?? { lat: 24.7136, lng: 46.6753 };

const STATUS_LABELS: Record<string, string> = {
  available: 'متاح الآن',
  'available-tomorrow': 'متاح غداً',
  reserved: 'محجوز'
};

export function NearMeLocator() {
  const navigate = useNavigate();
  const [distance, setDistance] = useState('10');
  const [keyword, setKeyword] = useState('');
  const { status, coords, error, refresh } = useGeolocation();

  const origin = coords ?? { lat: RIYADH_FALLBACK.lat, lng: RIYADH_FALLBACK.lng };

  const nearbyEquipment = useMemo(() => {
    const radiusKm = Number(distance);
    return getAllEquipment().
    map((item) => ({
      ...item,
      distanceKm: haversineDistanceKm(origin.lat, origin.lng, item.lat, item.lng)
    })).
    filter((item) => item.distanceKm <= radiusKm).
    filter((item) => !keyword || item.title.includes(keyword)).
    sort((a, b) => a.distanceKm - b.distanceKm);
  }, [origin.lat, origin.lng, distance, keyword]);

  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 70px)'
      }}>

      {/* Top Bar */}
      <Box
        bg="white"
        py="sm"
        style={{
          borderBottom: '1px solid #E5E7EB',
          zIndex: 10
        }}>

        <Container size="fluid" px="xl">
          <Group justify="space-between">
            <Group>
              <Button
                variant="subtle"
                color="gray"
                px="xs"
                leftSection={<ChevronRightIcon size={18} />}
                onClick={() => navigate(-1)}>

                رجوع
              </Button>
              <Title order={3} fw={700} c="#1B1B2F">
                المعدات القريبة مني
              </Title>
            </Group>

            <Group>
              <TextInput
                placeholder="ابحث في محيطك..."
                leftSection={<SearchIcon size={16} />}
                w={250}
                radius="md"
                visibleFrom="sm"
                value={keyword}
                onChange={(e) => setKeyword(e.currentTarget.value)} />

              <Select
                value={distance}
                onChange={(val) => setDistance(val || '10')}
                data={[
                { value: '5', label: 'قطر 5 كم' },
                { value: '10', label: 'قطر 10 كم' },
                { value: '25', label: 'قطر 25 كم' },
                { value: '50', label: 'قطر 50 كم' },
                { value: '9999', label: 'كل المسافات' }]
                }
                radius="md"
                w={120} />

            </Group>
          </Group>
        </Container>
      </Box>

      {status === 'error' || status === 'unsupported' ?
      <Alert
        color="yellow"
        icon={<AlertCircleIcon size={18} />}
        m="md"
        title="تعذر تحديد موقعك">

          نعرض نتائج قرب الرياض بدلاً من ذلك. {error}
          <Button size="xs" variant="light" color="yellow" mt="sm" onClick={refresh}>
            إعادة المحاولة
          </Button>
        </Alert> :
      null}

      {/* Main Content Split */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        style={{
          flex: 1,
          overflow: 'hidden',
          minHeight: 0
        }}>

        {/* List Sidebar */}
        <Box
          h={{ base: 260, md: '100%' }}
          w={{ base: '100%', md: 360 }}
          style={{
            flexShrink: 0,
            borderLeft: '1px solid #E5E7EB',
            backgroundColor: '#F8F9FA'
          }}>

          <ScrollArea h="100%" type="auto">
            <Stack p="md" gap="md">
              <Group justify="space-between" mb="xs">
                <Text fw={700} size="sm" c="dimmed">
                  تم العثور على {nearbyEquipment.length} معدات
                </Text>
                <Button
                  variant="subtle"
                  size="xs"
                  color="brand.5"
                  loading={status === 'loading'}
                  leftSection={<NavigationIcon size={14} />}
                  onClick={refresh}>

                  تحديث الموقع
                </Button>
              </Group>

              {nearbyEquipment.map((item) =>
              <Card
                key={item.id}
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                style={{
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={(e) =>
                e.currentTarget.style.borderColor = '#D4A017'
                }
                onMouseLeave={(e) =>
                e.currentTarget.style.borderColor = '#E5E7EB'
                }
                onClick={() => navigate(`/equipment/${item.id}`)}>

                  <Group wrap="nowrap" align="flex-start">
                    <Box
                    w={80}
                    h={80}
                    radius="md"
                    bg="#2C2C3E"
                    style={{
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>

                      <TruckIcon size={32} color="rgba(255,255,255,0.2)" />
                    </Box>
                    <Box
                    style={{
                      flex: 1
                    }}>

                      <Group
                      justify="space-between"
                      align="flex-start"
                      wrap="nowrap"
                      mb={4}>

                        <Text fw={700} size="sm" lineClamp={2}>
                          {item.title}
                        </Text>
                        <Badge
                        color={item.status === 'available' ? 'green' : 'gray'}
                        variant="light"
                        size="xs">

                          {STATUS_LABELS[item.status]}
                        </Badge>
                      </Group>
                      <Text size="xs" c="brand.5" fw={600} mb={8}>
                        {item.category}
                      </Text>
                      <Group gap={4}>
                        <MapPinIcon
                        size={14}
                        color="var(--mantine-color-gray-5)" />

                        <Text size="xs" c="dimmed" fw={600}>
                          {formatDistance(item.distanceKm)}
                        </Text>
                      </Group>
                    </Box>
                  </Group>
                </Card>
              )}
            </Stack>
          </ScrollArea>
        </Box>

        {/* Map Area */}
        <Box
          style={{
            flex: 1,
            position: 'relative',
            minHeight: 300
          }}>

          <NearMeMap center={origin} userLocation={coords} items={nearbyEquipment} />
        </Box>
      </Flex>
    </Box>);

}
