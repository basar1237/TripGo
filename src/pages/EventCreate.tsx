import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, Text, TextInput, Textarea, Button, Stack, Select, Alert, Grid, Group } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
// import { ⚠️, ✅, 📅 } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { createEvent, logUserActivity } from '../services/firebaseFirestore';

const EventCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'Seyahat', label: 'Seyahat' },
    { value: 'Müzik', label: 'Müzik' },
    { value: 'Spor', label: 'Spor' },
    { value: 'Teknoloji', label: 'Teknoloji' },
    { value: 'Sanat', label: 'Sanat' },
    { value: 'Yemek', label: 'Yemek' },
    { value: 'Eğitim', label: 'Eğitim' },
    { value: 'Diğer', label: 'Diğer' },
  ];

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      date: new Date(),
      location: '',
      category: '',
    },
    validate: {
      title: (value: string) => (value.length < 3 ? 'Başlık en az 3 karakter olmalıdır' : null),
      description: (value: string) => (value.length < 10 ? 'Açıklama en az 10 karakter olmalıdır' : null),
      location: (value: string) => (value.length < 3 ? 'Konum en az 3 karakter olmalıdır' : null),
      category: (value: string) => (!value ? 'Kategori seçmelisiniz' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!user) {
      setError('Lütfen giriş yapın');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const newEvent = {
        title: values.title,
        description: values.description,
        date: values.date,
        location: values.location,
        createdBy: user.id,
        participants: [user.id],
        category: values.category,
      };

      console.log('Creating event:', newEvent);
      const createdEvent = await createEvent(newEvent);
      console.log('Event created successfully:', createdEvent);
      
      // Etkinlik oluşturma aktivitesini logla
      await logUserActivity(user.id, 'create_event', `Etkinlik oluşturuldu: ${values.title}`, navigator.userAgent);
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Etkinlik oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container size="md" py="xl">
        <div className="text-center">
          <Text size="xl" c="dimmed">
            Lütfen giriş yapın
          </Text>
        </div>
      </Container>
    );
  }

  if (success) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder shadow="md" p={40} radius="md" className="bg-white text-center">
          <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <Title order={2} ta="center" mb="md" c="green">
            Etkinlik Oluşturuldu!
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb="lg">
            Etkinliğiniz başarıyla oluşturuldu. Ana sayfaya yönlendiriliyorsunuz...
          </Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="md" p={40} radius="md" className="bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <Title order={2} ta="center" mb="md">
            Yeni Etkinlik Oluştur
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Arkadaşlarınızla harika bir etkinlik düzenleyin
          </Text>
        </div>

        {error && (
          <Alert
            icon={<span className="text-lg">⚠️</span>}
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
              label="Etkinlik Başlığı"
              placeholder="Etkinliğinizin başlığını giriniz"
              required
              {...form.getInputProps('title')}
              size="md"
            />

            <Textarea
              label="Açıklama"
              placeholder="Etkinlik hakkında detaylı bilgi veriniz"
              required
              minRows={4}
              {...form.getInputProps('description')}
              size="md"
            />

            <Grid>
              <Grid.Col span={6}>
                <DatePickerInput
                  label="Tarih ve Saat"
                  placeholder="Tarih seçiniz"
                  required
                  {...form.getInputProps('date')}
                  size="md"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Kategori"
                  placeholder="Kategori seçiniz"
                  data={categories}
                  required
                  {...form.getInputProps('category')}
                  size="md"
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Konum"
              placeholder="Etkinlik konumunu giriniz"
              required
              {...form.getInputProps('location')}
              size="md"
            />
          </Stack>

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {loading ? 'Oluşturuluyor...' : 'Etkinlik Oluştur'}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default EventCreate;
