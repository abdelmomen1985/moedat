import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Title, Text, Button } from '@mantine/core';
import { HomeIcon } from 'lucide-react';

export function NotFound() {
  return (
    <Box style={{ flex: 1 }} bg="#F8F9FA" py={100}>
      <Container size="xl" ta="center">
        <Title order={1} fw={800} c="#1B1B2F" mb="sm" style={{ fontSize: '4rem' }}>
          404
        </Title>
        <Text c="dimmed" size="lg" mb="xl">
          الصفحة التي تبحث عنها غير موجودة
        </Text>
        <Button component={Link} to="/" color="brand.5" radius="md" leftSection={<HomeIcon size={18} />}>
          العودة للرئيسية
        </Button>
      </Container>
    </Box>);

}
