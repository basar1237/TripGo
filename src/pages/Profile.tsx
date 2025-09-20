import React, { useState, useEffect, useCallback } from 'react';
import { Container, Paper, Title, Text, Grid, Group, Avatar, Badge, Button, Tabs, LoadingOverlay } from '@mantine/core';
// import { 👤, 📅, ⚙️, 📍, 👤s, ✏️ } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Event } from '../types';
import { getEvents } from '../api/mockAPI';
import EventCard from '../components/EventCard';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserEvents = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const events = await getEvents();
      // Filter events created by current user
      const filteredEvents = events.filter(event => event.createdBy === user?.id);
      setUserEvents(filteredEvents);
    } catch (error) {
      console.error('Kullanıcı etkinlikleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserEvents();
    }
  }, [user, loadUserEvents]);

  if (!user) {
    return (
      <Container size="xl" py="xl">
        <div className="text-center">
          <Text size="xl" c="dimmed">
            Lütfen giriş yapın
          </Text>
        </div>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" p="xl" radius="md" withBorder mb="xl">
        <Group align="flex-start" mb="xl">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="xl"
            radius="xl"
          />
          <div className="flex-1">
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={2} mb="xs">
                  {user.name}
                </Title>
                <Group gap="xs" mb="sm">
                  <span className="text-lg text-gray-500">📍</span>
                  <Text size="sm" c="dimmed">
                    {user.location || 'Konum belirtilmemiş'}
                  </Text>
                </Group>
                <Group gap="xs" mb="sm">
                  <span className="text-lg text-gray-500">👤</span>
                  <Text size="sm" c="dimmed">
                    {user.friends?.length || 0} arkadaş
                  </Text>
                </Group>
              </div>
              <Button
                variant="light"
                leftSection={<span className="text-lg">✏️</span>}
                size="sm"
              >
                Profili Düzenle
              </Button>
            </Group>
            
            {user.bio && (
              <Text size="md" c="dimmed" mb="md">
                {user.bio}
              </Text>
            )}

            {user.interests && user.interests.length > 0 && (
              <div>
                <Text size="sm" fw={500} mb="xs">
                  İlgi Alanları:
                </Text>
                <Group gap="xs">
                  {user.interests.map((interest, index) => (
                    <Badge key={index} variant="light" color="blue" size="sm">
                      {interest}
                    </Badge>
                  ))}
                </Group>
              </div>
            )}
          </div>
        </Group>
      </Paper>

      <Tabs defaultValue="events">
        <Tabs.List mb="xl">
          <Tabs.Tab value="events" leftSection={<span className="text-lg">📅</span>}>
            Etkinliklerim ({userEvents.length})
          </Tabs.Tab>
          <Tabs.Tab value="friends" leftSection={<span className="text-lg">👤</span>}>
            Arkadaşlarım ({user.friends?.length || 0})
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<span className="text-lg">⚙️</span>}>
            Ayarlar
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="events">
          {loading ? (
            <LoadingOverlay visible={loading} />
          ) : userEvents.length === 0 ? (
            <Paper shadow="sm" p="xl" radius="md" withBorder className="text-center">
              <span className="text-5xl text-gray-400 mx-auto mb-4 block">📅</span>
              <Title order={3} mb="md" c="dimmed">
                Henüz etkinlik oluşturmadınız
              </Title>
              <Text c="dimmed" mb="lg">
                İlk etkinliğinizi oluşturmak için aşağıdaki butona tıklayın
              </Text>
              <Button
                component="a"
                href="/create-event"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Etkinlik Oluştur
              </Button>
            </Paper>
          ) : (
            <Grid>
              {userEvents.map((event) => (
                <Grid.Col key={event.id} span={{ base: 12, sm: 6, lg: 4 }}>
                  <EventCard
                    event={event}
                    showActions={false}
                  />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="friends">
          <Paper shadow="sm" p="xl" radius="md" withBorder className="text-center">
            <span className="text-5xl text-gray-400 mx-auto mb-4 block">👤</span>
            <Title order={3} mb="md" c="dimmed">
              Arkadaş listesi yakında gelecek
            </Title>
            <Text c="dimmed">
              Arkadaşlarınızı görüntülemek için önce arkadaş eklemeniz gerekiyor.
            </Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="settings">
          <Paper shadow="sm" p="xl" radius="md" withBorder className="text-center">
            <span className="text-5xl text-gray-400 mx-auto mb-4 block">⚙️</span>
            <Title order={3} mb="md" c="dimmed">
              Ayarlar yakında gelecek
            </Title>
            <Text c="dimmed">
              Hesap ayarlarınızı düzenleyebileceğiniz özellikler geliştiriliyor.
            </Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default Profile;
