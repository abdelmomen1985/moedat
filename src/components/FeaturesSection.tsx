import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Title,
  Text,
  Card,
  ThemeIcon } from
'@mantine/core';
import {
  SearchIcon,
  ShieldCheckIcon,
  UsersIcon,
  BuildingIcon } from
'lucide-react';
export function FeaturesSection() {
  const features = [
  {
    icon: <BuildingIcon size={24} />,
    title: 'أكبر دليل معدات',
    description:
    'نضم أكبر تشكيلة من المعدات الثقيلة بمختلف أنواعها وأحجامها لتلبية كافة احتياجات مشاريعك.'
  },
  {
    icon: <SearchIcon size={24} />,
    title: 'بحث متقدم',
    description:
    'نظام بحث ذكي ومتطور يتيح لك الوصول للمعدة المطلوبة بدقة وسرعة عالية.'
  },
  {
    icon: <ShieldCheckIcon size={24} />,
    title: 'شركات موثوقة',
    description:
    'نتعامل مع أفضل وأوثق شركات تأجير المعدات لضمان جودة الخدمة والمصداقية.'
  },
  {
    icon: <UsersIcon size={24} />,
    title: 'دعم فني متواصل',
    description:
    'فريق دعم متخصص متواجد على مدار الساعة لمساعدتك والإجابة على استفساراتك.'
  }];

  return (
    <Box py={80} bg="white">
      <Container size="xl">
        <Box ta="center" mb={50}>
          <Title order={2} fw={800} c="#1B1B2F" mb="sm">
            لماذا تختار منصة المعدات؟
          </Title>
          <Text c="dimmed" size="lg" maw={600} mx="auto">
            نقدم لك تجربة فريدة ومميزة في عالم تأجير وبيع المعدات الثقيلة
          </Text>
        </Box>

        <SimpleGrid
          cols={{
            base: 1,
            sm: 2,
            lg: 4
          }}
          spacing="xl">
          
          {features.map((feature, index) =>
          <Card
            key={index}
            padding="xl"
            radius="md"
            bg="#F8F9FA"
            style={{
              border: '1px solid #E5E7EB',
              textAlign: 'center'
            }}>
            
              <ThemeIcon
              size={60}
              radius="xl"
              color="brand.5"
              variant="light"
              mx="auto"
              mb="lg">
              
                {feature.icon}
              </ThemeIcon>
              <Title order={4} fw={700} c="#1B1B2F" mb="sm">
                {feature.title}
              </Title>
              <Text
              c="dimmed"
              size="sm"
              style={{
                lineHeight: 1.6
              }}>
              
                {feature.description}
              </Text>
            </Card>
          )}
        </SimpleGrid>
      </Container>
    </Box>);

}