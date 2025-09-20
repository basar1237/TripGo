import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Title, Text, TextInput, PasswordInput, Button, Group, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconUsers, IconCheck } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value: string) => (value.length < 2 ? 'İsim en az 2 karakter olmalıdır' : null),
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Geçerli bir email adresi giriniz'),
      password: (value: string) => (value.length < 6 ? 'Şifre en az 6 karakter olmalıdır' : null),
      confirmPassword: (value: string, values: any) =>
        value !== values.password ? 'Şifreler eşleşmiyor' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError('');
    setSuccess(false);
    try {
      const success = await register(values.name, values.email, values.password);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Kayıt işlemi başarısız oldu');
      }
    } catch (err) {
      setError('Kayıt yapılırken bir hata oluştu');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Container size={420}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md" className="bg-white text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconCheck className="w-8 h-8 text-white" />
            </div>
            <Title order={2} ta="center" mb="md" c="green">
              Kayıt Başarılı!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mb="lg">
              Hesabınız başarıyla oluşturuldu. Ana sayfaya yönlendiriliyorsunuz...
            </Text>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container size={420}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md" className="bg-white">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconUsers className="w-8 h-8 text-white" />
            </div>
            <Title order={2} ta="center" mb="md">
              GoTrip'e Katılın
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
              Yeni arkadaşlar edinin ve harika etkinliklere katılın
            </Text>
          </div>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Hata"
              color="red"
              mb="md"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Ad Soyad"
                placeholder="Adınızı ve soyadınızı giriniz"
                required
                {...form.getInputProps('name')}
                size="md"
              />
              <TextInput
                label="Email"
                placeholder="email@example.com"
                required
                {...form.getInputProps('email')}
                size="md"
              />
              <PasswordInput
                label="Şifre"
                placeholder="Şifrenizi giriniz"
                required
                {...form.getInputProps('password')}
                size="md"
              />
              <PasswordInput
                label="Şifre Tekrar"
                placeholder="Şifrenizi tekrar giriniz"
                required
                {...form.getInputProps('confirmPassword')}
                size="md"
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              mt="xl"
              size="md"
              loading={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
            </Button>
          </form>

          <Text ta="center" mt="lg">
            <Text size="sm" c="dimmed">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Giriş yapın
              </Link>
            </Text>
          </Text>
        </Paper>
      </Container>
    </div>
  );
};

export default Register;
