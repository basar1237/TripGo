import React from 'react';
import { Card, Text, Group, Avatar, Badge, Button, Image } from '@mantine/core';
// import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaHeart } from 'react-icons/fa';
import { Event } from '../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
  onJoin?: (eventId: string) => void;
  onLike?: (eventId: string) => void;
  showActions?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onJoin, 
  onLike, 
  showActions = true 
}) => {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: tr });
  };

  return (
    <Card 
      shadow="sm" 
      p="lg" 
      radius="md" 
      withBorder
      className="hover:shadow-lg transition-shadow duration-200"
    >
      {event.image && (
        <Card.Section>
          <Image
            src={event.image}
            height={200}
            alt={event.title}
            className="object-cover"
          />
        </Card.Section>
      )}

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} size="lg" lineClamp={2}>
          {event.title}
        </Text>
        {event.category && (
          <Badge color="blue" variant="light">
            {event.category}
          </Badge>
        )}
      </Group>

      <Text size="sm" c="dimmed" lineClamp={3} mb="md">
        {event.description}
      </Text>

      <Group gap="xs" mb="md">
        <span className="text-gray-500">📅</span>
        <Text size="sm" c="dimmed">
          {formatDate(event.date)}
        </Text>
      </Group>

      <Group gap="xs" mb="md">
        <span className="text-gray-500">📍</span>
        <Text size="sm" c="dimmed">
          {event.location}
        </Text>
      </Group>

      <Group gap="xs" mb="md">
        <span className="text-gray-500">👥</span>
        <Text size="sm" c="dimmed">
          {event.participants.length} katılımcı
        </Text>
      </Group>

      {showActions && (
        <Group justify="space-between" mt="md">
          <Group gap="sm">
            <Button
              variant="light"
              color="blue"
              size="sm"
              onClick={() => onJoin?.(event.id)}
              className="hover:bg-blue-50"
            >
              Katıl
            </Button>
            <Button
              variant="subtle"
              color="red"
              size="sm"
              leftSection={<span>❤️</span>}
              onClick={() => onLike?.(event.id)}
              className="hover:bg-red-50"
            >
              Beğen
            </Button>
          </Group>
          
          <Avatar.Group spacing="sm">
            {event.participants.slice(0, 3).map((participantId) => (
              <Avatar
                key={participantId}
                size="sm"
                radius="xl"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participantId}`}
                alt={`Katılımcı ${participantId}`}
              />
            ))}
            {event.participants.length > 3 && (
              <Avatar size="sm" radius="xl" color="gray">
                +{event.participants.length - 3}
              </Avatar>
            )}
          </Avatar.Group>
        </Group>
      )}
    </Card>
  );
};

export default EventCard;
