import React from 'react';
import { Card, Text, Group, Avatar, Button, Badge, Stack } from '@mantine/core';
import { IconMapPin, IconUsers, IconMessage, IconUserPlus } from '@tabler/icons-react';
import { User } from '../types';

interface ProfileCardProps {
  user: User;
  onAddFriend?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  showActions?: boolean;
  isCompact?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  user, 
  onAddFriend, 
  onMessage, 
  showActions = true,
  isCompact = false 
}) => {
  const isAlreadyFriend = user.friends && user.friends.length > 0;

  if (isCompact) {
    return (
      <Card shadow="sm" p="md" radius="md" withBorder className="hover:shadow-md transition-shadow">
        <Group>
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="lg"
            radius="xl"
          />
          <div className="flex-1">
            <Text fw={500} size="sm">
              {user.name}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {user.location}
            </Text>
            {showActions && (
              <Group gap="xs" mt="xs">
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  leftSection={<IconMessage size={12} />}
                  onClick={() => onMessage?.(user.id)}
                >
                  Mesaj
                </Button>
                <Button
                  size="xs"
                  variant={isAlreadyFriend ? "filled" : "light"}
                  color={isAlreadyFriend ? "green" : "blue"}
                  leftSection={<IconUserPlus size={12} />}
                  onClick={() => onAddFriend?.(user.id)}
                >
                  {isAlreadyFriend ? "Arkadaş" : "Ekle"}
                </Button>
              </Group>
            )}
          </div>
        </Group>
      </Card>
    );
  }

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder className="hover:shadow-lg transition-shadow duration-200">
      <Group align="flex-start" mb="md">
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="xl"
          radius="xl"
        />
        <div className="flex-1">
          <Text fw={500} size="lg">
            {user.name}
          </Text>
          <Group gap="xs" mt="xs">
            <IconMapPin size={16} className="text-gray-500" />
            <Text size="sm" c="dimmed">
              {user.location || 'Konum belirtilmemiş'}
            </Text>
          </Group>
        </div>
      </Group>

      {user.bio && (
        <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
          {user.bio}
        </Text>
      )}

      {user.interests && user.interests.length > 0 && (
        <Stack gap="xs" mb="md">
          <Text size="sm" fw={500}>
            İlgi Alanları:
          </Text>
          <Group gap="xs">
            {user.interests.map((interest, index) => (
              <Badge key={index} variant="light" color="blue" size="sm">
                {interest}
              </Badge>
            ))}
          </Group>
        </Stack>
      )}

      <Group gap="xs" mb="md">
        <IconUsers size={16} className="text-gray-500" />
        <Text size="sm" c="dimmed">
          {user.friends?.length || 0} arkadaş
        </Text>
      </Group>

      {showActions && (
        <Group justify="space-between">
          <Button
            variant="light"
            color="blue"
            size="sm"
            leftSection={<IconMessage size={16} />}
            onClick={() => onMessage?.(user.id)}
            className="hover:bg-blue-50"
          >
            Mesaj Gönder
          </Button>
          <Button
            variant={isAlreadyFriend ? "filled" : "light"}
            color={isAlreadyFriend ? "green" : "blue"}
            size="sm"
            leftSection={<IconUserPlus size={16} />}
            onClick={() => onAddFriend?.(user.id)}
            className={isAlreadyFriend ? "bg-green-100 hover:bg-green-200" : "hover:bg-blue-50"}
          >
            {isAlreadyFriend ? "Arkadaş" : "Arkadaş Ekle"}
          </Button>
        </Group>
      )}
    </Card>
  );
};

export default ProfileCard;
