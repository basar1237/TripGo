import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Group,
  Text,
  Avatar,
  Stack,
  Title,
  Badge,
  ActionIcon,
  ScrollArea,
  Divider
} from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { getUserChats, getUserById } from '../services/firebaseFirestore';
import { Chat, User } from '../types';

const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<{ [userId: string]: User }>({});

  // Chat'leri yükle
  useEffect(() => {
    const loadChats = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const userChats = await getUserChats(currentUser.id);
        setChats(userChats);

        // Tüm katılımcıları getir
        const participantIds = new Set<string>();
        userChats.forEach(chat => {
          chat.participants.forEach(id => {
            if (id !== currentUser.id) {
              participantIds.add(id);
            }
          });
        });

        const participantData: { [userId: string]: User } = {};
        for (const id of Array.from(participantIds)) {
          const user = await getUserById(id);
          if (user) {
            participantData[id] = user;
          }
        }
        setParticipants(participantData);
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [currentUser]);

  // Chat'e tıklandığında
  const handleChatClick = (chat: Chat) => {
    const otherParticipant = chat.participants.find(id => id !== currentUser?.id);
    if (otherParticipant) {
      navigate(`/chat/${otherParticipant}`);
    }
  };

  // Tarih formatla
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Dün';
    } else if (days < 7) {
      return date.toLocaleDateString('tr-TR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    }
  };

  // Mesaj önizlemesi
  const getMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return 'Henüz mesaj yok';
    
    const isFromCurrentUser = chat.lastMessage.senderId === currentUser?.id;
    const prefix = isFromCurrentUser ? 'Sen: ' : '';
    return prefix + chat.lastMessage.content;
  };

  if (!currentUser) {
    return (
      <Container size="md" py="xl">
        <Text>Giriş yapmanız gerekiyor</Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="xs">
            Mesajlar
          </Title>
          <Text c="dimmed" size="lg">
            Arkadaşlarınızla konuşun
          </Text>
        </div>

        <Paper shadow="sm" radius="md" withBorder className="h-[600px]">
          {loading ? (
            <div className="p-8 text-center">
              <Text c="dimmed">Mesajlar yükleniyor...</Text>
            </div>
          ) : chats.length === 0 ? (
            <div className="p-8 text-center">
              <Text c="dimmed" size="lg">
                Henüz mesajınız yok
              </Text>
              <Text c="dimmed" size="sm" mt="xs">
                Arkadaşlarınızla mesajlaşmaya başlayın!
              </Text>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <Stack gap={0}>
                {chats.map((chat, index) => {
                  const otherParticipant = chat.participants.find(id => id !== currentUser.id);
                  const otherUser = otherParticipant ? participants[otherParticipant] : null;
                  
                  if (!otherUser) return null;

                  return (
                    <div key={chat.id}>
                      <div
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleChatClick(chat)}
                      >
                        <Group justify="space-between" align="flex-start">
                          <Group gap="md" className="flex-1 min-w-0">
                            <Avatar
                              src={otherUser.avatar}
                              alt={otherUser.name}
                              size="lg"
                              radius="xl"
                            >
                              {otherUser.name.charAt(0).toUpperCase()}
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <Group justify="space-between" align="center" mb="xs">
                                <Text fw={500} size="md" className="truncate">
                                  {otherUser.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {chat.lastMessageTime && formatTime(chat.lastMessageTime)}
                                </Text>
                              </Group>
                              
                              <Text 
                                size="sm" 
                                c="dimmed" 
                                className="truncate"
                                lineClamp={1}
                              >
                                {getMessagePreview(chat)}
                              </Text>
                            </div>
                          </Group>
                          
                          {/* Okunmamış mesaj badge'i (gelecekte eklenebilir) */}
                          {/* <Badge color="blue" variant="filled" size="sm">
                            2
                          </Badge> */}
                        </Group>
                      </div>
                      {index < chats.length - 1 && <Divider />}
                    </div>
                  );
                })}
              </Stack>
            </ScrollArea>
          )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default ChatList;
