import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Group,
  ActionIcon,
  Anchor,
  Divider } from
'@mantine/core';
import {
  FacebookIcon,
  TwitterIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon } from
'lucide-react';
import { NAV_LINKS } from '../data/navLinks';
export function Footer() {
  return (
    <Box bg="#1B1B2F" c="white" pt={80} pb={30}>
      <Container size="xl">
        <SimpleGrid
          cols={{
            base: 1,
            sm: 2,
            lg: 4
          }}
          spacing="xl"
          mb={60}>
          
          {/* About Column */}
          <Stack gap="md">
            <Text
              size="xl"
              fw={800}
              style={{
                letterSpacing: '1px'
              }}>
              
              Almoedat{' '}
              <Text component="span" c="brand.5">
                |
              </Text>{' '}
              المعدات
            </Text>
            <Text
              c="gray.4"
              size="sm"
              style={{
                lineHeight: 1.6
              }}>
              
              المنصة الأولى والأكبر في المملكة العربية السعودية لتأجير وبيع
              المعدات الثقيلة. نربط بين أصحاب المشاريع وشركات المعدات الموثوقة.
            </Text>
          </Stack>

          {/* Quick Links */}
          <Stack gap="md">
            <Title order={4} fw={700} c="brand.5">
              روابط سريعة
            </Title>
            <Stack gap="sm">
              {NAV_LINKS.map((link) =>
              <Anchor
                key={link.label}
                component={Link}
                to={link.to}
                c="gray.4"
                size="sm"
                style={{
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) =>
                e.currentTarget.style.color = '#D4A017'
                }
                onMouseLeave={(e) =>
                e.currentTarget.style.color =
                'var(--mantine-color-gray-4)'
                }
                underline="never">

                  {link.label}
                </Anchor>
              )}
            </Stack>
          </Stack>

          {/* Contact Info */}
          <Stack gap="md">
            <Title order={4} fw={700} c="brand.5">
              تواصل معنا
            </Title>
            <Stack gap="sm">
              <Group gap="sm" wrap="nowrap">
                <PhoneIcon size={18} color="#D4A017" />
                <Text c="gray.4" size="sm" dir="ltr">
                  054 728 4951
                </Text>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <MailIcon size={18} color="#D4A017" />
                <Text c="gray.4" size="sm">
                  info@almoedat.com
                </Text>
              </Group>
              <Group gap="sm" wrap="nowrap" align="flex-start">
                <MapPinIcon
                  size={18}
                  color="#D4A017"
                  style={{
                    marginTop: 2
                  }} />
                
                <Text c="gray.4" size="sm">
                  الرياض، المملكة العربية السعودية
                </Text>
              </Group>
            </Stack>
          </Stack>

          {/* Social Media */}
          <Stack gap="md">
            <Title order={4} fw={700} c="brand.5">
              تابعنا
            </Title>
            <Text c="gray.4" size="sm">
              كن على اطلاع دائم بآخر العروض والمعدات المضافة للمنصة.
            </Text>
            <Group gap="sm">
              <ActionIcon
                size="lg"
                radius="xl"
                variant="filled"
                bg="rgba(255,255,255,0.1)"
                style={{
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) =>
                e.currentTarget.style.backgroundColor = '#D4A017'
                }
                onMouseLeave={(e) =>
                e.currentTarget.style.backgroundColor =
                'rgba(255,255,255,0.1)'
                }>
                
                <TwitterIcon size={18} />
              </ActionIcon>
              <ActionIcon
                size="lg"
                radius="xl"
                variant="filled"
                bg="rgba(255,255,255,0.1)"
                style={{
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) =>
                e.currentTarget.style.backgroundColor = '#D4A017'
                }
                onMouseLeave={(e) =>
                e.currentTarget.style.backgroundColor =
                'rgba(255,255,255,0.1)'
                }>
                
                <FacebookIcon size={18} />
              </ActionIcon>
            </Group>
          </Stack>
        </SimpleGrid>

        <Divider color="rgba(255,255,255,0.1)" mb="md" />

        <Group justify="center">
          <Text c="gray.5" size="sm">
            © 2026 المعدات. جميع الحقوق محفوظة
          </Text>
        </Group>
      </Container>
    </Box>);

}