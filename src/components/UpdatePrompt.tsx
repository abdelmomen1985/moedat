import React, { useEffect, useState } from 'react';
import { Box, Container, Group, Text, Button, Paper } from '@mantine/core';
import { RefreshCwIcon } from 'lucide-react';
export function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] =
  useState<ServiceWorkerRegistration | null>(null);
  useEffect(() => {
    // Listen for service worker update events
    const handleSWUpdate = (event: CustomEvent<ServiceWorkerRegistration>) => {
      setRegistration(event.detail);
      setShowUpdate(true);
    };
    window.addEventListener(
      'sw-update-available',
      handleSWUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        'sw-update-available',
        handleSWUpdate as EventListener
      );
    };
  }, []);
  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({
        type: 'SKIP_WAITING'
      });
      window.location.reload();
    }
  };
  if (!showUpdate) return null;
  return (
    <Box
      pos="fixed"
      top={80}
      left={0}
      right={0}
      style={{
        zIndex: 999
      }}
      p="md">
      
      <Container size="sm">
        <Paper
          shadow="lg"
          radius="md"
          p="md"
          style={{
            background: '#1B1B2F',
            border: '1px solid rgba(212, 160, 23, 0.3)'
          }}>
          
          <Group justify="space-between" align="center" gap="md">
            <Group
              gap="sm"
              style={{
                flex: 1
              }}>
              
              <RefreshCwIcon size={20} color="#D4A017" />
              <Text c="white" fw={600} size="sm">
                يتوفر تحديث جديد للمنصة
              </Text>
            </Group>
            <Button
              color="brand.5"
              radius="md"
              size="xs"
              onClick={handleUpdate}
              fw={700}>
              
              تحديث الآن
            </Button>
          </Group>
        </Paper>
      </Container>
    </Box>);

}