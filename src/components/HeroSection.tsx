import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Paper } from
'@mantine/core';
import { SearchIcon, PlusIcon } from 'lucide-react';
export function HeroSection() {
  const navigate = useNavigate();
  const stats = [
  {
    value: '+5000',
    label: 'معدة'
  },
  {
    value: '+1200',
    label: 'شركة'
  },
  {
    value: '+50',
    label: 'مدينة'
  }];

  return (
    <Box
      bg="#1B1B2F"
      pt={80}
      pb={120}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundImage:
        'radial-gradient(circle at 50% 0%, #2C2C3E 0%, #1B1B2F 70%)'
      }}>
      
      <Container
        size="xl"
        style={{
          position: 'relative',
          zIndex: 2
        }}>
        
        <Box ta="center" maw={800} mx="auto">
          <Title
            order={1}
            c="white"
            fw={800}
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.2
            }}
            mb="md">
            
            أكبر منصة لتأجير المعدات الثقيلة في المملكة
          </Title>
          <Text
            c="gray.4"
            size="xl"
            mb="xl"
            style={{
              lineHeight: 1.6
            }}>
            
            اعثر على المعدات المناسبة لمشروعك بأفضل الأسعار وأعلى جودة. تواصل مع
            مئات الشركات الموثوقة في جميع أنحاء المملكة.
          </Text>

          <Group justify="center" gap="md" mb={60}>
            <Button
              size="xl"
              radius="md"
              color="brand.5"
              leftSection={<SearchIcon size={20} />}
              style={{
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) =>
              e.currentTarget.style.transform = 'translateY(-2px)'
              }
              onMouseLeave={(e) =>
              e.currentTarget.style.transform = 'translateY(0)'
              }
              onClick={() => navigate('/equipment')}>

              تصفح المعدات
            </Button>
            <Button
              size="xl"
              radius="md"
              variant="outline"
              color="white"
              leftSection={<PlusIcon size={20} />}
              style={{
                transition: 'transform 0.2s, background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => navigate('/post-listing')}>

              أضف إعلانك
            </Button>
          </Group>

          <SimpleGrid
            cols={{
              base: 1,
              sm: 3
            }}
            spacing="lg"
            maw={600}
            mx="auto">
            
            {stats.map((stat, index) =>
            <Paper
              key={index}
              bg="rgba(255, 255, 255, 0.05)"
              p="md"
              radius="md"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
              
                <Text c="brand.5" fw={800} size="h2" mb={4}>
                  {stat.value}
                </Text>
                <Text c="gray.3" fw={500}>
                  {stat.label}
                </Text>
              </Paper>
            )}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>);

}