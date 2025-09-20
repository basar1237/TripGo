import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, Event, Message, Chat } from '../types';

// Kullanıcı aktiviteleri için interface
interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: 'login' | 'register' | 'create_event' | 'join_event' | 'view_page';
  timestamp: any;
  details: string;
  userAgent?: string;
  ip?: string;
}

// Kullanıcıları getir
export const getUsers = async (): Promise<User[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Kullanıcıyı ID ile getir
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', id));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Etkinlikleri getir
export const getEvents = async (): Promise<Event[]> => {
  try {
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    const events = eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      let eventDate: Date;
      
      // Tarih dönüşümü - Firebase Timestamp veya Date objesi olabilir
      if (data.date instanceof Date) {
        eventDate = data.date;
      } else if (data.date && typeof data.date.toDate === 'function') {
        eventDate = data.date.toDate();
      } else if (data.date && typeof data.date === 'string') {
        eventDate = new Date(data.date);
      } else {
        eventDate = new Date();
      }
      
      return {
        id: doc.id,
        ...data,
        date: eventDate
      };
    }) as Event[];
    
    console.log('Raw events from Firebase:', events);
    
    // Tarihe göre sırala (en yeni önce)
    const sortedEvents = events.sort((a, b) => b.date.getTime() - a.date.getTime());
    console.log('Sorted events:', sortedEvents);
    
    return sortedEvents;
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

// Etkinlik oluştur
export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  try {
    console.log('Creating event with data:', event);
    
    const docRef = await addDoc(collection(db, 'events'), {
      ...event,
      date: event.date, // Date objesi olarak kaydet
      createdAt: serverTimestamp()
    });
    
    const createdEvent = {
      id: docRef.id,
      ...event
    };
    
    console.log('Event created successfully:', createdEvent);
    return createdEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Kullanıcı aktivitesi logla
export const logUserActivity = async (
  userId: string, 
  action: UserActivity['action'], 
  details: string,
  userAgent?: string
): Promise<void> => {
  try {
    const user = await getUserById(userId);
    if (user) {
      await addDoc(collection(db, 'userActivities'), {
        userId,
        userName: user.name,
        action,
        details,
        userAgent: userAgent || navigator.userAgent,
        timestamp: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Kullanıcı aktivitelerini getir
export const getUserActivities = async (limitCount: number = 50): Promise<UserActivity[]> => {
  try {
    const activitiesSnapshot = await getDocs(
      query(
        collection(db, 'userActivities'), 
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      )
    );
    
    return activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as UserActivity[];
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
};

// Kullanıcı ara
export const searchUsers = async (queryText: string): Promise<User[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    
    const lowerQuery = queryText.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(lowerQuery) ||
      user.location?.toLowerCase().includes(lowerQuery) ||
      user.interests?.some(interest => interest.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// Kullanıcı güncelle
export const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

// Kullanıcı sil
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

// Arkadaş ekle
export const addFriend = async (userId: string, friendId: string): Promise<boolean> => {
  try {
    const user = await getUserById(userId);
    const friend = await getUserById(friendId);
    
    if (user && friend) {
      const userFriends = user.friends || [];
      const friendFriends = friend.friends || [];
      
      if (!userFriends.includes(friendId)) {
        userFriends.push(friendId);
        await updateDoc(doc(db, 'users', userId), { friends: userFriends });
      }
      
      if (!friendFriends.includes(userId)) {
        friendFriends.push(userId);
        await updateDoc(doc(db, 'users', friendId), { friends: friendFriends });
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding friend:', error);
    return false;
  }
};

// Mesaj gönder
export const sendMessage = async (
  senderId: string, 
  receiverId: string, 
  content: string
): Promise<Message | null> => {
  try {
    const sender = await getUserById(senderId);
    const receiver = await getUserById(receiverId);
    
    if (!sender || !receiver) {
      throw new Error('Gönderici veya alıcı bulunamadı');
    }

    const messageData = {
      senderId,
      receiverId,
      content,
      timestamp: serverTimestamp(),
      isRead: false,
      senderName: sender.name,
      receiverName: receiver.name
    };

    const docRef = await addDoc(collection(db, 'messages'), messageData);
    
    const message: Message = {
      id: docRef.id,
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
      isRead: false,
      senderName: sender.name,
      receiverName: receiver.name
    };

    // Chat koleksiyonunu güncelle
    await updateOrCreateChat(senderId, receiverId, message);

    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

// Chat oluştur veya güncelle
const updateOrCreateChat = async (userId1: string, userId2: string, lastMessage: Message) => {
  try {
    const chatId = [userId1, userId2].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);

    const chatData = {
      participants: [userId1, userId2],
      lastMessage: {
        id: lastMessage.id,
        content: lastMessage.content,
        senderId: lastMessage.senderId,
        timestamp: lastMessage.timestamp
      },
      lastMessageTime: lastMessage.timestamp,
      participantNames: {
        [userId1]: lastMessage.senderName || '',
        [userId2]: lastMessage.receiverName || ''
      },
      updatedAt: serverTimestamp()
    };

    if (chatDoc.exists()) {
      await updateDoc(chatRef, chatData);
    } else {
      await addDoc(collection(db, 'chats'), {
        ...chatData,
        id: chatId
      });
    }
  } catch (error) {
    console.error('Error updating chat:', error);
  }
};

// Kullanıcının chat'lerini getir
export const getUserChats = async (userId: string): Promise<Chat[]> => {
  try {
    const chatsSnapshot = await getDocs(
      query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      )
    );

    return chatsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        participants: data.participants,
        lastMessage: data.lastMessage,
        lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
        participantNames: data.participantNames
      };
    });
  } catch (error) {
    console.error('Error getting user chats:', error);
    return [];
  }
};

// İki kullanıcı arasındaki mesajları getir
export const getMessages = async (userId1: string, userId2: string): Promise<Message[]> => {
  try {
    const messagesSnapshot = await getDocs(
      query(
        collection(db, 'messages'),
        where('senderId', 'in', [userId1, userId2]),
        where('receiverId', 'in', [userId1, userId2]),
        orderBy('timestamp', 'asc')
      )
    );

    return messagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        timestamp: data.timestamp?.toDate() || new Date(),
        isRead: data.isRead,
        senderName: data.senderName,
        receiverName: data.receiverName
      };
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

// Mesajları gerçek zamanlı dinle
export const subscribeToMessages = (
  userId1: string, 
  userId2: string, 
  callback: (messages: Message[]) => void
) => {
  const q = query(
    collection(db, 'messages'),
    where('senderId', 'in', [userId1, userId2]),
    where('receiverId', 'in', [userId1, userId2]),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        timestamp: data.timestamp?.toDate() || new Date(),
        isRead: data.isRead,
        senderName: data.senderName,
        receiverName: data.receiverName
      };
    });
    callback(messages);
  });
};

// Mesajları okundu olarak işaretle
export const markMessagesAsRead = async (userId1: string, userId2: string): Promise<void> => {
  try {
    const messagesSnapshot = await getDocs(
      query(
        collection(db, 'messages'),
        where('senderId', '==', userId2),
        where('receiverId', '==', userId1),
        where('isRead', '==', false)
      )
    );

    const batch = writeBatch(db);
    messagesSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};
