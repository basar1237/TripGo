import { User, Event } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Spor ve doğa aktivitelerini seviyorum. Yeni arkadaşlar arıyorum!',
    location: 'İstanbul, Türkiye',
    interests: ['Spor', 'Doğa', 'Futbol'],
    friends: ['2', '3']
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Müzik ve sanat tutkunuyum. Konserlere gitmeyi seviyorum.',
    location: 'Ankara, Türkiye',
    interests: ['Müzik', 'Sanat', 'Konser'],
    friends: ['1', '3']
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Teknoloji ve programlama ile ilgileniyorum.',
    location: 'İzmir, Türkiye',
    interests: ['Teknoloji', 'Programlama', 'Gaming'],
    friends: ['1', '2']
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'İstanbul Boğaz Turu',
    description: 'Boğazda güzel bir gün geçirmek isteyenler için harika bir etkinlik!',
    date: new Date('2024-09-25T14:00:00'),
    location: 'Eminönü, İstanbul',
    createdBy: '1',
    participants: ['1', '2'],
    category: 'Seyahat',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Ankara Konseri',
    description: 'Yerel sanatçıların sahne alacağı muhteşem bir konser!',
    date: new Date('2024-09-28T19:00:00'),
    location: 'Ankara Arena',
    createdBy: '2',
    participants: ['2', '3'],
    category: 'Müzik',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Teknoloji Konferansı',
    description: 'En son teknoloji trendlerini öğrenmek için harika bir fırsat!',
    date: new Date('2024-10-05T10:00:00'),
    location: 'İzmir Fuar Merkezi',
    createdBy: '3',
    participants: ['3'],
    category: 'Teknoloji',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop'
  }
];

// API functions
export const getUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return mockUsers;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUsers.find(user => user.id === id);
};

export const getEvents = async (): Promise<Event[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEvents;
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockEvents.find(event => event.id === id);
};

export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newEvent: Event = {
    ...event,
    id: Date.now().toString()
  };
  mockEvents.push(newEvent);
  return newEvent;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const lowerQuery = query.toLowerCase();
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(lowerQuery) ||
    user.location?.toLowerCase().includes(lowerQuery) ||
    user.interests?.some(interest => interest.toLowerCase().includes(lowerQuery))
  );
};

export const addFriend = async (userId: string, friendId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = mockUsers.find(u => u.id === userId);
  const friend = mockUsers.find(u => u.id === friendId);
  
  if (user && friend) {
    if (!user.friends) user.friends = [];
    if (!friend.friends) friend.friends = [];
    
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
    }
    if (!friend.friends.includes(userId)) {
      friend.friends.push(userId);
    }
    return true;
  }
  return false;
};

// Authentication functions
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = mockUsers.find(u => u.email === email);
  // Mock için şifre kontrolü yapmıyoruz, sadece email kontrol ediyoruz
  return user || null;
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Email zaten var mı kontrol et
  const existingUser = mockUsers.find(u => u.email === userData.email);
  if (existingUser) {
    return null; // Email zaten kayıtlı
  }
  
  // Yeni kullanıcı oluştur
  const newUser: User = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=150&h=150&fit=crop&crop=face`,
    bio: '',
    location: '',
    interests: [],
    friends: []
  };
  
  mockUsers.push(newUser);
  return newUser;
};
