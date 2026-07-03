import React from 'react';
import { Button, Center, Stack, Text, Title } from '@mantine/core';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Center mih="50vh">
          <Stack align="center" gap="md">
            <Title order={3}>حدث خطأ غير متوقع</Title>
            <Text c="dimmed">حاول إعادة تحميل الصفحة</Text>
            <Button
              color="brand.5"
              radius="md"
              onClick={() => window.location.reload()}>
              إعادة التحميل
            </Button>
          </Stack>
        </Center>
      );
    }
    return this.props.children;
  }
}
