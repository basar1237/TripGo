import React, { useState, useEffect } from 'react';
import { Container, Title, Text, TextInput, Grid, Group, Button, LoadingOverlay, Stack, Paper } from '@mantine/core';
// import { 🔍, 🔄 } from 'react-icons/fa';
import ProfileCard from '../components/ProfileCard';
import { User } from '../types';
import { getUsers, searchUsers } from '../api/mockAPI';

const FriendSearch: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUsers();
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchUsers(searchQuery);
      setUsers(searchResults);
    } catch (error) {
      console.error('Arama yapılırken hata:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = (userId: string) => {
    console.log('Arkadaş ekle:', userId);
    // TODO: Implement add friend functionality
  };

  const handleMessage = (userId: string) => {
    console.log('Mesaj gönder:', userId);
    // TODO: Implement messaging functionality
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            Arkadaş Ara
          </Title>
          <Text c="dimmed" size="lg">
            Yeni arkadaşlar bulun ve bağlantı kurun
          </Text>
        </div>

        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group gap="md" align="flex-end">
            <TextInput
              placeholder="İsim, konum veya ilgi alanı ara..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              leftSection={<span className="text-lg">🔍</span>}
              size="md"
              className="flex-1"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button
              onClick={handleSearch}
              loading={isSearching}
              size="md"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Ara
            </Button>
            <Button
              variant="light"
              leftSection={<span className="text-lg">🔄</span>}
              onClick={loadUsers}
              size="md"
            >
              Yenile
            </Button>
          </Group>
        </Paper>

        {loading ? (
          <LoadingOverlay visible={loading} />
        ) : users.length === 0 ? (
          <Paper shadow="sm" p="xl" radius="md" withBorder className="text-center">
            <Text size="xl" c="dimmed" mb="md">
              {searchQuery ? 'Arama sonucu bulunamadı.' : 'Henüz kullanıcı yok.'}
            </Text>
            <Text c="dimmed">
              {searchQuery ? 'Farklı anahtar kelimeler deneyin.' : 'İlk kullanıcı olmak için kayıt olun.'}
            </Text>
          </Paper>
        ) : (
          <div>
            <Text size="sm" c="dimmed" mb="md">
              {users.length} kullanıcı bulundu
            </Text>
            <Grid>
              {users.map((user) => (
                <Grid.Col key={user.id} span={{ base: 12, sm: 6, lg: 4 }}>
                  <ProfileCard
                    user={user}
                    onAddFriend={handleAddFriend}
                    onMessage={handleMessage}
                    showActions={true}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </div>
        )}
      </Stack>
    </Container>
  );
};

export default FriendSearch;
