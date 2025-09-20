import React, { useState, useEffect } from 'react';
import { Container, Title, Grid, Text, Select, Group, Button, LoadingOverlay } from '@mantine/core';
import { IconFilter, IconRefresh } from '@tabler/icons-react';
import EventCard from '../components/EventCard';
import { Event } from '../types';
import { getEvents } from '../api/mockAPI';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = [
    { value: '', label: 'Tüm Kategoriler' },
    { value: 'Seyahat', label: 'Seyahat' },
    { value: 'Müzik', label: 'Müzik' },
    { value: 'Spor', label: 'Spor' },
    { value: 'Teknoloji', label: 'Teknoloji' },
    { value: 'Sanat', label: 'Sanat' },
    { value: 'Yemek', label: 'Yemek' },
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, categoryFilter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Etkinlikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;
    
    if (categoryFilter && categoryFilter !== '') {
      filtered = events.filter(event => event.category === categoryFilter);
    }

    // Sort by date (upcoming events first)
    filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setFilteredEvents(filtered);
  };

  const handleJoinEvent = (eventId: string) => {
    console.log('Etkinliğe katıl:', eventId);
    // TODO: Implement join event functionality
  };

  const handleLikeEvent = (eventId: string) => {
    console.log('Etkinliği beğen:', eventId);
    // TODO: Implement like event functionality
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <LoadingOverlay visible={loading} />
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1} mb="xs">
            Yaklaşan Etkinlikler
          </Title>
          <Text c="dimmed" size="lg">
            Yeni arkadaşlarla tanışmak ve harika deneyimler yaşamak için etkinliklere katılın!
          </Text>
        </div>
        <Button
          variant="light"
          leftSection={<IconRefresh size={16} />}
          onClick={loadEvents}
        >
          Yenile
        </Button>
      </Group>

      <Group mb="xl">
        <Select
          placeholder="Kategori seçin"
          data={categories}
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value)}
          leftSection={<IconFilter size={16} />}
          className="min-w-48"
        />
      </Group>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <Text size="xl" c="dimmed" mb="md">
            {categoryFilter ? 'Bu kategoride etkinlik bulunamadı.' : 'Henüz etkinlik yok.'}
          </Text>
          <Text c="dimmed">
            İlk etkinliği oluşturmak ister misiniz?
          </Text>
        </div>
      ) : (
        <Grid>
          {filteredEvents.map((event) => (
            <Grid.Col key={event.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <EventCard
                event={event}
                onJoin={handleJoinEvent}
                onLike={handleLikeEvent}
                showActions={true}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
