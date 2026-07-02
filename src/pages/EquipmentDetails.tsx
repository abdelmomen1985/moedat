import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Text,
  Title,
  Badge,
  Group,
  Button,
  Card,
  Divider,
  SimpleGrid,
  ThemeIcon,
  Avatar,
  Breadcrumbs,
  Anchor,
  Stack } from
'@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  TruckIcon,
  MapPinIcon,
  CalendarIcon,
  ZapIcon,
  PhoneIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  Share2Icon,
  HeartIcon } from
'lucide-react';
import { getEquipmentById, getCompanyById } from '../data/repository';
import { useFavorites } from '../hooks/useFavorites';

export function EquipmentDetails() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const equipment = id ? getEquipmentById(id) : undefined;
  const company = equipment ? getCompanyById(equipment.companyId) : undefined;

  if (!equipment) {
    return (
      <Box py={80} bg="#F8F9FA" style={{ flex: 1 }}>
        <Container size="xl" ta="center">
          <Title order={2} mb="md">لم يتم العثور على هذا الإعلان</Title>
          <Button color="brand.5" onClick={() => navigate('/equipment')}>
            العودة للإعلانات
          </Button>
        </Container>
      </Box>);

  }

  const favorite = isFavorite(equipment.id);

  const specs = [
  { label: 'سنة الصنع', value: equipment.year, icon: <CalendarIcon size={18} /> },
  { label: 'الحالة', value: equipment.condition, icon: <ShieldCheckIcon size={18} /> },
  { label: 'نوع الوقود', value: equipment.fuelType, icon: <ZapIcon size={18} /> },
  { label: 'المنطقة', value: equipment.region, icon: <MapPinIcon size={18} /> }];


  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: equipment.title, url });
      } catch {
        // user cancelled share sheet, nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      notifications.show({ message: 'تم نسخ رابط الإعلان', color: 'green' });
    } catch {
      notifications.show({ message: 'تعذر نسخ الرابط', color: 'red' });
    }
  };

  const handleWhatsApp = () => {
    if (!company) return;
    const phoneDigits = company.whatsapp.replace(/[^\d]/g, '');
    const text = encodeURIComponent(`مرحباً، أنا مهتم بإعلان "${equipment.title}" على منصة المعدات.`);
    window.open(`https://wa.me/${phoneDigits}?text=${text}`, '_blank');
  };

  return (
    <Box
      py="xl"
      bg="#F8F9FA"
      style={{
        flex: 1
      }}>

      <Container size="xl">
        {/* Navigation & Breadcrumbs */}
        <Group justify="space-between" mb="lg">
          <Button
            variant="subtle"
            color="gray"
            leftSection={<ChevronRightIcon size={18} />}
            onClick={() => navigate(-1)}>

            العودة
          </Button>
          <Breadcrumbs separator=">">
            <Anchor component={Link} to="/" c="dimmed" size="sm">
              الرئيسية
            </Anchor>
            <Anchor
              component={Link}
              to={`/equipment?category=${equipment.category}`}
              c="dimmed"
              size="sm">

              {equipment.category}
            </Anchor>
            <Text size="sm" c="brand.5" fw={600}>
              {equipment.title}
            </Text>
          </Breadcrumbs>
        </Group>

        <Grid gutter="xl">
          {/* Main Content */}
          <Grid.Col
            span={{
              base: 12,
              md: 8
            }}>

            <Card shadow="sm" padding="0" radius="md" withBorder mb="xl">
              <Box
                h={{
                  base: 300,
                  md: 450
                }}
                bg={
                equipment.image ?
                undefined :
                'linear-gradient(135deg, #2C2C3E 0%, #1B1B2F 100%)'
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundImage: equipment.image ?
                  `url(${equipment.image})` :
                  undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>

                {!equipment.image && <TruckIcon size={120} color="rgba(255,255,255,0.1)" />}
                <Badge
                  color="brand.5"
                  size="xl"
                  radius="sm"
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    fontWeight: 700
                  }}>

                  {equipment.serviceType}
                </Badge>
              </Box>
            </Card>

            <Box mb="xl">
              <Group justify="space-between" align="flex-start" mb="md">
                <Box>
                  <Text c="brand.5" fw={600} mb={8}>
                    {equipment.category}
                  </Text>
                  <Title
                    order={1}
                    fw={800}
                    c="#1B1B2F"
                    style={{
                      fontSize: '2rem'
                    }}>

                    {equipment.title}
                  </Title>
                </Box>
                <Group gap="sm">
                  <Button variant="default" radius="md" px="xs" onClick={handleShare}>
                    <Share2Icon size={18} />
                  </Button>
                  <Button
                    variant={favorite ? 'light' : 'default'}
                    radius="md"
                    px="xs"
                    color={favorite ? 'red' : 'gray'}
                    onClick={() => toggleFavorite(equipment.id)}>

                    <HeartIcon size={18} color={favorite ? '#E03131' : undefined} fill={favorite ? 'currentColor' : 'none'} />
                  </Button>
                </Group>
              </Group>

              <Text
                c="dimmed"
                size="lg"
                style={{
                  lineHeight: 1.8
                }}
                mb="xl">

                {equipment.description}
              </Text>

              <Title order={3} fw={700} c="#1B1B2F" mb="md">
                المواصفات الأساسية
              </Title>
              <SimpleGrid
                cols={{
                  base: 2,
                  sm: 4
                }}
                spacing="md"
                mb="xl">

                {specs.map((spec, index) =>
                <Card
                  key={index}
                  withBorder
                  padding="md"
                  radius="md"
                  bg="white">

                    <Group gap="sm" mb={8}>
                      <ThemeIcon
                      variant="light"
                      color="brand.5"
                      size="md"
                      radius="xl">

                        {spec.icon}
                      </ThemeIcon>
                      <Text size="sm" c="dimmed">
                        {spec.label}
                      </Text>
                    </Group>
                    <Text fw={700} size="lg">
                      {spec.value}
                    </Text>
                  </Card>
                )}
              </SimpleGrid>
            </Box>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col
            span={{
              base: 12,
              md: 4
            }}>

            <Box pos="sticky" top={100}>
              {/* Pricing Card */}
              <Card shadow="sm" padding="xl" radius="md" withBorder mb="md">
                <Text size="sm" c="dimmed" mb={4}>
                  السعر التقديري
                </Text>
                <Group align="flex-end" gap="xs" mb="xl">
                  <Title order={2} fw={800} c="brand.5">
                    {equipment.pricePerDay > 0 ? equipment.pricePerDay.toLocaleString('ar') : 'اتصل للسعر'}
                  </Title>
                  {equipment.pricePerDay > 0 &&
                  <Text fw={600} c="#1B1B2F" pb={4}>
                      ريال / يوم
                    </Text>
                  }
                </Group>

                <Divider my="md" />

                <Stack gap="md">
                  <Button
                    size="lg"
                    radius="md"
                    color="brand.5"
                    fullWidth
                    leftSection={<PhoneIcon size={20} />}
                    onClick={() => setPhoneRevealed(true)}>

                    {phoneRevealed && company ? <span dir="ltr">{company.phone}</span> : 'إظهار رقم الهاتف'}
                  </Button>
                  <Button
                    size="lg"
                    radius="md"
                    color="green.6"
                    fullWidth
                    leftSection={<MessageCircleIcon size={20} />}
                    onClick={handleWhatsApp}>

                    تواصل عبر واتساب
                  </Button>
                </Stack>
              </Card>

              {/* Company Card */}
              {company &&
              <Card shadow="sm" padding="xl" radius="md" withBorder>
                  <Title order={4} fw={700} c="#1B1B2F" mb="md">
                    معلومات المعلن
                  </Title>
                  <Group wrap="nowrap" mb="md">
                    <Avatar size="lg" radius="md" color="brand.5">
                      {company.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Text fw={700} size="md">
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
                  <Group gap="xs" mb="lg">
                    <MapPinIcon size={16} color="var(--mantine-color-gray-5)" />
                    <Text size="sm" c="dimmed">
                      {company.region}، {company.city}
                    </Text>
                  </Group>
                  <Button
                  variant="light"
                  color="gray"
                  fullWidth
                  radius="md"
                  component={Link}
                  to={`/companies/${company.id}`}>

                    عرض كل إعلانات الشركة
                  </Button>
                </Card>
              }
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>);

}
