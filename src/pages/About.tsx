import React from 'react';
import { Box, Container, Title, Text, SimpleGrid, Card, ThemeIcon } from '@mantine/core';
import { TargetIcon, EyeIcon, HeartHandshakeIcon } from 'lucide-react';

const VALUES = [
{
  icon: <TargetIcon size={24} />,
  title: 'رسالتنا',
  description: 'تسهيل الوصول إلى المعدات الثقيلة المناسبة لكل مشروع، أينما كان في المملكة.'
},
{
  icon: <EyeIcon size={24} />,
  title: 'رؤيتنا',
  description: 'أن نكون المنصة الأولى والأكثر ثقة لتأجير وبيع المعدات الثقيلة في المنطقة.'
},
{
  icon: <HeartHandshakeIcon size={24} />,
  title: 'قيمنا',
  description: 'الشفافية والموثوقية والسرعة في ربط أصحاب المشاريع بالشركات المزودة للمعدات.'
}];


export function About() {
  return (
    <Box style={{ flex: 1 }} bg="#F8F9FA">
      <Box bg="#1B1B2F" py={60}>
        <Container size="xl" ta="center">
          <Title order={1} c="white" fw={800} mb="xs">
            عن منصة المعدات
          </Title>
          <Text c="gray.4" maw={700} mx="auto" style={{ lineHeight: 1.8 }}>
            المعدات هي منصة رقمية سعودية تربط بين أصحاب المشاريع الإنشائية والصناعية وشركات
            تأجير وبيع المعدات الثقيلة الموثوقة، بهدف تسهيل عملية البحث والتواصل وتوفير
            الوقت والجهد.
          </Text>
        </Container>
      </Box>

      <Container size="xl" py={60}>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
          {VALUES.map((value) =>
          <Card key={value.title} padding="xl" radius="md" withBorder ta="center">
              <ThemeIcon size={60} radius="xl" color="brand.5" variant="light" mx="auto" mb="lg">
                {value.icon}
              </ThemeIcon>
              <Title order={4} fw={700} c="#1B1B2F" mb="sm">
                {value.title}
              </Title>
              <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                {value.description}
              </Text>
            </Card>
          )}
        </SimpleGrid>
      </Container>
    </Box>);

}
