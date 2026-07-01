import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Group,
  Button,
  Text,
  Burger,
  Drawer,
  Stack,
  Anchor,
  Menu,
  Avatar } from
'@mantine/core';
import {
  MapPinIcon,
  UserIcon,
  LogOutIcon,
  ListIcon,
  HeartIcon,
  ChevronDownIcon } from
'lucide-react';
import { NAV_LINKS } from '../data/navLinks';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, openAuthModal } = useAuth();

  return (
    <Box
      component="header"
      pos="sticky"
      top={0}
      bg="#1B1B2F"
      style={{
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
      py="md">

      <Container size="xl">
        <Group justify="space-between" align="center">
          {/* Logo */}
          <Group
            gap="xs"
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}>

            <Text
              size="xl"
              fw={800}
              c="white"
              style={{
                letterSpacing: '1px'
              }}>

              Almoedat{' '}
              <Text component="span" c="brand.5">
                |
              </Text>{' '}
              المعدات
            </Text>
          </Group>

          {/* Desktop Navigation */}
          <Group gap="lg" visibleFrom="lg">
            {NAV_LINKS.map((item) =>
            <Anchor
              key={item.label}
              component={Link}
              to={item.to}
              c="gray.3"
              fw={500}
              underline="never"
              style={{
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#D4A017'}
              onMouseLeave={(e) =>
              e.currentTarget.style.color = 'var(--mantine-color-gray-3)'
              }>

                {item.label}
              </Anchor>
            )}
          </Group>

          {/* Actions */}
          <Group visibleFrom="lg" gap="md">
            <Button
              variant="light"
              color="brand.5"
              radius="md"
              fw={600}
              leftSection={<MapPinIcon size={16} />}
              component={Link}
              to="/locator">

              بالقرب مني
            </Button>
            {isAuthenticated ?
            <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <Button
                  variant="filled"
                  color="brand.5"
                  radius="md"
                  fw={600}
                  leftSection={<Avatar size={20} radius="xl" color="dark">{user?.name.charAt(0)}</Avatar>}
                  rightSection={<ChevronDownIcon size={14} />}>

                    {user?.name.split(' ')[0]}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown dir="rtl">
                  <Menu.Item
                  leftSection={<ListIcon size={16} />}
                  onClick={() => navigate('/post-listing')}>

                    إعلاناتي
                  </Menu.Item>
                  <Menu.Item
                  leftSection={<HeartIcon size={16} />}
                  onClick={() => navigate('/favorites')}>

                    المفضلة
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                  color="red"
                  leftSection={<LogOutIcon size={16} />}
                  onClick={logout}>

                    تسجيل الخروج
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu> :

            <Button
              variant="filled"
              color="brand.5"
              radius="md"
              fw={600}
              leftSection={<UserIcon size={16} />}
              onClick={() => openAuthModal('login')}>

                دخول
              </Button>
            }
          </Group>

          {/* Mobile Menu Toggle */}
          <Burger
            opened={drawerOpened}
            onClick={() => setDrawerOpened((o) => !o)}
            hiddenFrom="lg"
            color="white"
            size="sm" />

        </Group>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        size="100%"
        padding="md"
        title={
        <Text size="xl" fw={800} c="#1B1B2F">
            المعدات
          </Text>
        }
        hiddenFrom="lg"
        zIndex={1000}
        position="right"
        dir="rtl">

        <Stack gap="md" mt="xl">
          {NAV_LINKS.map((item) =>
          <Anchor
            key={item.label}
            component={Link}
            to={item.to}
            onClick={() => setDrawerOpened(false)}
            c="#1B1B2F"
            fw={600}
            size="lg"
            underline="never"
            ta="right">

              {item.label}
            </Anchor>
          )}
          <Button
            variant="light"
            color="brand.5"
            radius="md"
            size="lg"
            leftSection={<MapPinIcon size={20} />}
            component={Link}
            to="/locator"
            onClick={() => setDrawerOpened(false)}
            fullWidth>

            المعدات بالقرب مني
          </Button>
          {isAuthenticated ?
          <Button
            variant="filled"
            color="red"
            radius="md"
            size="lg"
            mt="sm"
            leftSection={<LogOutIcon size={18} />}
            onClick={() => {
              logout();
              setDrawerOpened(false);
            }}
            fullWidth>

              تسجيل الخروج
            </Button> :

          <Button
            variant="filled"
            color="brand.5"
            radius="md"
            size="lg"
            mt="sm"
            onClick={() => {
              openAuthModal('login');
              setDrawerOpened(false);
            }}
            fullWidth>

              دخول
            </Button>
          }
        </Stack>
      </Drawer>
    </Box>);

}
