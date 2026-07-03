import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Title, Text, SimpleGrid, Card, Badge, List, Button, ThemeIcon } from '@mantine/core';
import { CheckIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface Tier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const TIERS: Tier[] = [
{
  name: 'مجاني',
  price: '0 ريال',
  description: 'مناسبة لتجربة المنصة ونشر إعلانك الأول.',
  features: ['إعلان واحد نشط', 'ظهور في نتائج البحث', 'دعم عبر البريد الإلكتروني']
},
{
  name: 'أساسي',
  price: '199 ريال',
  period: '/ شهر',
  description: 'للشركات الصغيرة التي تدير عدة معدات.',
  features: ['حتى 10 إعلانات نشطة', 'ظهور مميز في النتائج', 'شارة "شركة موثقة"', 'دعم فني على مدار الساعة'],
  highlighted: true
},
{
  name: 'احترافي',
  price: '499 ريال',
  period: '/ شهر',
  description: 'لشركات تأجير المعدات متوسطة الحجم.',
  features: ['حتى 50 إعلان نشط', 'صفحة شركة مخصصة', 'إحصائيات أداء الإعلانات', 'دعم فني مخصص']
},
{
  name: 'مؤسسات',
  price: 'تواصل معنا',
  description: 'لكبرى شركات المعدات والمقاولات.',
  features: ['إعلانات غير محدودة', 'إدارة فريق متعدد المستخدمين', 'تكامل مع أنظمتكم', 'مدير حساب مخصص']
}];


export function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  useDocumentTitle('الأسعار');

  const handleSelect = () => {
    if (isAuthenticated) {
      navigate('/post-listing');
    } else {
      openAuthModal('signup');
    }
  };

  return (
    <Box style={{ flex: 1 }} bg="#F8F9FA">
      <Box bg="#1B1B2F" py={60}>
        <Container size="xl" ta="center">
          <Title order={1} c="white" fw={800} mb="xs">
            أسعار الباقات
          </Title>
          <Text c="gray.4" maw={600} mx="auto">
            اختر الباقة المناسبة لحجم أعمالك وابدأ في نشر إعلاناتك اليوم
          </Text>
        </Container>
      </Box>

      <Container size="xl" py={60}>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {TIERS.map((tier) =>
          <Card
            key={tier.name}
            shadow="sm"
            padding="xl"
            radius="md"
            withBorder
            style={{
              borderColor: tier.highlighted ? '#D4A017' : undefined,
              borderWidth: tier.highlighted ? 2 : 1,
              overflow: 'visible',
              position: 'relative'
            }}>

              {tier.highlighted &&
            <Badge
              color="brand.5"
              style={{ position: 'absolute', top: -12, right: 20, zIndex: 1 }}>

                  الأكثر طلباً
                </Badge>
            }
              <Title order={3} fw={700} c="#1B1B2F" mb={4} mt={tier.highlighted ? 'xs' : 0}>
                {tier.name}
              </Title>
              <Text c="dimmed" size="sm" mb="md">
                {tier.description}
              </Text>
              <Text fw={800} size="xl" c="brand.5" mb="lg">
                {tier.price} <Text component="span" size="sm" c="dimmed">{tier.period}</Text>
              </Text>
              <List spacing="sm" mb="xl" icon={
              <ThemeIcon color="brand.5" size={20} radius="xl" variant="light">
                  <CheckIcon size={12} />
                </ThemeIcon>
              }>

                {tier.features.map((feature) => <List.Item key={feature}>{feature}</List.Item>)}
              </List>
              <Button
              fullWidth
              radius="md"
              color="brand.5"
              variant={tier.highlighted ? 'filled' : 'outline'}
              onClick={handleSelect}>

                ابدأ الآن
              </Button>
            </Card>
          )}
        </SimpleGrid>
      </Container>
    </Box>);

}
