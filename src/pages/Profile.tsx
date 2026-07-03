import { useEffect } from 'react';
import {
  Box,
  Container,
  Title,
  Text,
  Card,
  TextInput,
  Button,
  Stack,
  Divider,
  Group,
  Avatar,
  Center } from
'@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { UserIcon, LockIcon, PhoneIcon, MailIcon } from 'lucide-react';
import { useAuth, type AuthSession } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface ProfileFormValues {
  name: string;
  phone: string;
}

function ProfileForm({ user }: { user: AuthSession }) {
  const { updateProfile } = useAuth();

  const form = useForm<ProfileFormValues>({
    initialValues: {
      name: user.name,
      phone: user.phone
    },
    validate: {
      name: (value) => value.trim().length >= 2 ? null : 'أدخل الاسم الكامل',
      phone: (value) => /^05\d{8}$/.test(value) ? null : 'أدخل رقم جوال سعودي صحيح (05xxxxxxxx)'
    }
  });

  // Sync form when user data changes (e.g. after profile update)
  useEffect(() => {
    form.setValues({ name: user.name, phone: user.phone });
  }, [user.name, user.phone, form]);

  const handleSubmit = form.onSubmit((values) => {
    updateProfile(values);
    notifications.show({ message: 'تم تحديث الملف الشخصي بنجاح', color: 'green' });
  });

  const initial = user.name.charAt(0) || '؟';

  return (
    <Box py="xl">
      <Container size="sm">
        <Stack gap="lg">
          {/* Header */}
          <Center>
            <Stack align="center" gap="sm">
              <Avatar size={80} radius="xl" color="brand" variant="filled">
                {initial}
              </Avatar>
              <Title order={2}>{user.name}</Title>
              <Text c="dimmed">{user.email}</Text>
            </Stack>
          </Center>

          {/* Profile Form */}
          <Card withBorder radius="md" padding="lg">
            <Title order={4} mb="md">الملف الشخصي</Title>
            <Divider mb="md" />

            <form onSubmit={handleSubmit}>
              <Stack gap="sm">
                <TextInput
                  label="الاسم الكامل"
                  placeholder="محمد أحمد"
                  leftSection={<UserIcon size={16} />}
                  {...form.getInputProps('name')} />

                <TextInput
                  label="البريد الإلكتروني"
                  value={user.email}
                  leftSection={<MailIcon size={16} />}
                  disabled
                  description="لا يمكن تغيير البريد الإلكتروني" />

                <TextInput
                  label="رقم الجوال"
                  placeholder="05xxxxxxxx"
                  leftSection={<PhoneIcon size={16} />}
                  dir="ltr"
                  {...form.getInputProps('phone')} />

                <Group justify="flex-end" mt="sm">
                  <Button type="submit" color="brand.5" radius="md">
                    حفظ التغييرات
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Stack>
      </Container>
    </Box>);
}

export function Profile() {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  useDocumentTitle('الملف الشخصي');

  if (!isAuthenticated || !user) {
    return (
      <Box py="xl">
        <Container size="sm" ta="center">
          <Stack align="center" gap="md">
            <LockIcon size={48} color="var(--mantine-color-gray-5)" />
            <Title order={3}>يجب تسجيل الدخول أولاً</Title>
            <Text c="dimmed">سجّل دخولك لعرض ملفك الشخصي</Text>
            <Button
              color="brand.5"
              radius="md"
              size="lg"
              onClick={() => openAuthModal('login')}>
              تسجيل الدخول
            </Button>
          </Stack>
        </Container>
      </Box>);
  }

  return <ProfileForm user={user} />;
}
