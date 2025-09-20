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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, Event } from '../types';

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
      return {
        id: doc.id,
        ...data,
        date: data.date instanceof Date ? data.date : data.date.toDate()
      };
    }) as Event[];
    
    // Tarihe göre sırala (en yeni önce)
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

// Etkinlik oluştur
export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...event,
      date: event.date, // Date objesi olarak kaydet
      createdAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...event
    };
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
