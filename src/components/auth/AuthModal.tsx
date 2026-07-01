import React from 'react';
import { Modal, Tabs, TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { UserIcon, MailIcon, PhoneIcon, LockIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PHONE_REGEX = /^05\d{8}$/;

interface LoginValues {
  email: string;
  password: string;
}

interface SignupValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function AuthModal() {
  const { authModalOpened, authModalMode, closeAuthModal, login, signup } = useAuth();
  const [formError, setFormError] = React.useState<string | null>(null);

  const loginForm = useForm<LoginValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => value.includes('@') ? null : 'أدخل بريد إلكتروني صحيح',
      password: (value) => value.length >= 6 ? null : 'كلمة المرور 6 أحرف على الأقل'
    }
  });

  const signupForm = useForm<SignupValues>({
    initialValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
    validate: {
      name: (value) => value.trim().length >= 2 ? null : 'أدخل الاسم الكامل',
      email: (value) => value.includes('@') ? null : 'أدخل بريد إلكتروني صحيح',
      phone: (value) => PHONE_REGEX.test(value) ? null : 'أدخل رقم جوال سعودي صحيح (05xxxxxxxx)',
      password: (value) => value.length >= 6 ? null : 'كلمة المرور 6 أحرف على الأقل',
      confirmPassword: (value, values) =>
      value === values.password ? null : 'كلمتا المرور غير متطابقتين'
    }
  });

  const handleClose = () => {
    setFormError(null);
    loginForm.reset();
    signupForm.reset();
    closeAuthModal();
  };

  const handleLogin = loginForm.onSubmit((values) => {
    const result = login(values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    notifications.show({ message: 'تم تسجيل الدخول بنجاح', color: 'green' });
    handleClose();
  });

  const handleSignup = signupForm.onSubmit((values) => {
    const result = signup(values.name, values.email, values.phone, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    notifications.show({ message: 'تم إنشاء الحساب بنجاح', color: 'green' });
    handleClose();
  });

  return (
    <Modal
      opened={authModalOpened}
      onClose={handleClose}
      title="مرحباً بك في المعدات"
      centered
      radius="md"
      size="sm">

      <Tabs
        defaultValue={authModalMode}
        onChange={() => setFormError(null)}>

        <Tabs.List grow mb="md">
          <Tabs.Tab value="login">تسجيل الدخول</Tabs.Tab>
          <Tabs.Tab value="signup">إنشاء حساب</Tabs.Tab>
        </Tabs.List>

        {formError &&
        <Alert
          color="red"
          icon={<AlertCircleIcon size={16} />}
          mb="md"
          onClose={() => setFormError(null)}
          withCloseButton>

            {formError}
          </Alert>
        }

        <Tabs.Panel value="login">
          <form onSubmit={handleLogin}>
            <Stack gap="sm">
              <TextInput
                label="البريد الإلكتروني"
                placeholder="example@email.com"
                leftSection={<MailIcon size={16} />}
                {...loginForm.getInputProps('email')} />

              <PasswordInput
                label="كلمة المرور"
                placeholder="********"
                leftSection={<LockIcon size={16} />}
                {...loginForm.getInputProps('password')} />

              <Button type="submit" color="brand.5" fullWidth mt="sm">
                تسجيل الدخول
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="signup">
          <form onSubmit={handleSignup}>
            <Stack gap="sm">
              <TextInput
                label="الاسم الكامل"
                placeholder="محمد أحمد"
                leftSection={<UserIcon size={16} />}
                {...signupForm.getInputProps('name')} />

              <TextInput
                label="البريد الإلكتروني"
                placeholder="example@email.com"
                leftSection={<MailIcon size={16} />}
                {...signupForm.getInputProps('email')} />

              <TextInput
                label="رقم الجوال"
                placeholder="05xxxxxxxx"
                leftSection={<PhoneIcon size={16} />}
                dir="ltr"
                {...signupForm.getInputProps('phone')} />

              <PasswordInput
                label="كلمة المرور"
                placeholder="********"
                leftSection={<LockIcon size={16} />}
                {...signupForm.getInputProps('password')} />

              <PasswordInput
                label="تأكيد كلمة المرور"
                placeholder="********"
                leftSection={<LockIcon size={16} />}
                {...signupForm.getInputProps('confirmPassword')} />

              <Button type="submit" color="brand.5" fullWidth mt="sm">
                إنشاء حساب
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Modal>);

}
