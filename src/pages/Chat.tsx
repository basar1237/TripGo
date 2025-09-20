import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextInput,
  Textarea,
  Button,
  Group,
  Text,
  ScrollArea,
  Avatar,
  Stack,
  Title,
  ActionIcon,
  Badge,
  Divider
} from '@mantine/core';
// Icons removed - using text alternatives
import { useAuth } from '../context/AuthContext';
import { 
  sendMessage, 
  getMessages, 
  subscribeToMessages, 
  markMessagesAsRead,
  getUserById 
} from '../services/firebaseFirestore';
import { Message, User } from '../types';

const Chat: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Diğer kullanıcıyı getir
  useEffect(() => {
    const loadOtherUser = async () => {
      if (userId) {
        const user = await getUserById(userId);
        setOtherUser(user);
      }
    };
    loadOtherUser();
  }, [userId]);

  // Mesajları yükle ve gerçek zamanlı dinle
  useEffect(() => {
    if (!currentUser || !userId) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const initialMessages = await getMessages(currentUser.id, userId);
        setMessages(initialMessages);
        
        // Mesajları okundu olarak işaretle
        await markMessagesAsRead(currentUser.id, userId);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Gerçek zamanlı mesaj dinleme
    const unsubscribe = subscribeToMessages(currentUser.id, userId, (newMessages) => {
      setMessages(newMessages);
      // Yeni mesajlar geldiğinde okundu olarak işaretle
      if (newMessages.length > 0) {
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.senderId === userId && !lastMessage.isRead) {
          markMessagesAsRead(currentUser.id, userId);
        }
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [currentUser, userId]);

  // Mesaj gönder
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !userId || isSending) return;

    setIsSending(true);
    try {
      const message = await sendMessage(currentUser.id, userId, newMessage.trim());
      if (message) {
        setNewMessage('');
        // Mesajlar otomatik olarak gerçek zamanlı güncellenecek
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Enter tuşu ile mesaj gönder
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Mesajları otomatik scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentUser || !userId) {
    return (
      <Container size="md" py="xl">
        <Text>Kullanıcı bulunamadı</Text>
      </Container>
    );
  }

  if (!otherUser) {
    return (
      <Container size="md" py="xl">
        <Text>Yükleniyor...</Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper shadow="sm" radius="md" withBorder className="h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <ActionIcon
                variant="subtle"
                onClick={() => navigate(-1)}
                size="lg"
              >
                ←
              </ActionIcon>
              <Avatar
                src={otherUser.avatar}
                alt={otherUser.name}
                size="md"
                radius="xl"
              >
                {otherUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Text fw={500} size="lg">
                  {otherUser.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {otherUser.location}
                </Text>
              </div>
            </Group>
            <Badge color="green" variant="light">
              Çevrimiçi
            </Badge>
          </Group>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" scrollbarSize={6}>
          <Stack gap="sm">
            {isLoading ? (
              <Text ta="center" c="dimmed">Mesajlar yükleniyor...</Text>
            ) : messages.length === 0 ? (
              <Text ta="center" c="dimmed">
                Henüz mesaj yok. İlk mesajı siz gönderin!
              </Text>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.senderId === currentUser.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <Text size="sm">{message.content}</Text>
                    <Text
                      size="xs"
                      className={`mt-1 ${
                        message.senderId === currentUser.id
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </Stack>
        </ScrollArea>

        <Divider />

        {/* Message Input */}
        <div className="p-4">
          <Group gap="sm" align="flex-end">
            <Textarea
              placeholder="Mesajınızı yazın..."
              value={newMessage}
              onChange={(event) => setNewMessage(event.currentTarget.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isSending}
              minRows={1}
              maxRows={4}
              autosize
            />
            <ActionIcon
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              loading={isSending}
              size="lg"
              color="blue"
              variant="filled"
            >
              →
            </ActionIcon>
          </Group>
        </div>
      </Paper>
    </Container>
  );
};

export default Chat;
