import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Group,
  Text,
  Button,
  CloseButton,
  Paper } from
'@mantine/core';
import { DownloadIcon, SmartphoneIcon } from 'lucide-react';
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
  }>;
}
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
  useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    // Check if user previously dismissed
    const wasDismissed = localStorage.getItem('almoedat-pwa-dismissed');
    if (wasDismissed) {
      const dismissedTime = parseInt(wasDismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);
  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);
  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('almoedat-pwa-dismissed', Date.now().toString());
  }, []);
  if (isInstalled || dismissed || !showBanner) return null;
  return (
    <Box
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      style={{
        zIndex: 1000
      }}
      p="md">
      
      <Container size="xl">
        <Paper
          shadow="xl"
          radius="lg"
          p="lg"
          style={{
            background: 'linear-gradient(135deg, #1B1B2F 0%, #2C2C3E 100%)',
            border: '1px solid rgba(212, 160, 23, 0.3)'
          }}>
          
          <Group justify="space-between" align="center" wrap="nowrap" gap="md">
            <Group
              gap="md"
              wrap="nowrap"
              style={{
                flex: 1
              }}>
              
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background:
                  'linear-gradient(135deg, #D4A017 0%, #E8BE1D 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                
                <SmartphoneIcon size={24} color="#1B1B2F" />
              </Box>
              <Box
                style={{
                  minWidth: 0
                }}>
                
                <Text c="white" fw={700} size="md">
                  ثبّت تطبيق المعدات
                </Text>
                <Text c="gray.4" size="sm" lineClamp={1}>
                  احصل على وصول سريع للمنصة من شاشتك الرئيسية
                </Text>
              </Box>
            </Group>

            <Group
              gap="sm"
              wrap="nowrap"
              style={{
                flexShrink: 0
              }}>
              
              <Button
                color="brand.5"
                radius="md"
                size="sm"
                leftSection={<DownloadIcon size={16} />}
                onClick={handleInstall}
                fw={700}>
                
                تثبيت
              </Button>
              <CloseButton
                variant="subtle"
                c="gray.4"
                onClick={handleDismiss}
                aria-label="إغلاق" />
              
            </Group>
          </Group>
        </Paper>
      </Container>
    </Box>);

}