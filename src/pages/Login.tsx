import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Title, Text, TextInput, PasswordInput, Button, Group, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
// import { FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string>('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Geçerli bir email adresi giriniz'),
      password: (value: string) => (value.length < 6 ? 'Şifre en az 6 karakter olmalıdır' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError('');
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate('/');
      } else {
        setError('Email veya şifre hatalı');
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container size={420}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md" className="bg-white">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">👥</span>
            </div>
            <Title order={2} ta="center" mb="md">
              GoTrip'e Hoş Geldiniz
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
              Hesabınıza giriş yapın ve yeni arkadaşlarla tanışın
            </Text>
          </div>

          {error && (
            <Alert
              icon={<span>⚠️</span>}
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
            </Stack>

            <Button
              type="submit"
              fullWidth
              mt="xl"
              size="md"
              loading={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <Group justify="space-between" mt="lg">
            <Text size="sm" c="dimmed">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Kayıt olun
              </Link>
            </Text>
            <Text size="sm" c="dimmed">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
                Şifremi unuttum
              </Link>
            </Text>
          </Group>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
