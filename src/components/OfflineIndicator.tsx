import React, { useEffect, useState } from 'react';
import { Box, Group, Text, Transition } from '@mantine/core';
import { WifiOffIcon, WifiIcon } from 'lucide-react';
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (hasBeenOffline) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setHasBeenOffline(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasBeenOffline]);
  const showOffline = !isOnline;
  const showOnline = showReconnected && isOnline;
  if (!showOffline && !showOnline) return null;
  return (
    <>
      {/* Offline Banner */}
      <Transition mounted={showOffline} transition="slide-down" duration={300}>
        {(styles) =>
        <Box
          style={{
            ...styles,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#DC2626',
            padding: '8px 0'
          }}>
          
            <Group justify="center" gap="sm">
              <WifiOffIcon size={18} color="white" />
              <Text c="white" fw={600} size="sm">
                لا يوجد اتصال بالإنترنت — بعض المحتوى قد لا يكون متاحاً
              </Text>
            </Group>
          </Box>
        }
      </Transition>

      {/* Reconnected Banner */}
      <Transition mounted={showOnline} transition="slide-down" duration={300}>
        {(styles) =>
        <Box
          style={{
            ...styles,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#16A34A',
            padding: '8px 0'
          }}>
          
            <Group justify="center" gap="sm">
              <WifiIcon size={18} color="white" />
              <Text c="white" fw={600} size="sm">
                تم استعادة الاتصال بالإنترنت
              </Text>
            </Group>
          </Box>
        }
      </Transition>
    </>);

}