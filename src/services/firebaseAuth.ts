import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User as AppUser } from '../types';
import { isAdmin } from '../utils/adminConfig';

// Firebase User'ı App User'a çevir
const convertFirebaseUser = async (firebaseUser: User): Promise<AppUser> => {
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  
  if (userDoc.exists()) {
    const userData = userDoc.data();
    return {
      id: firebaseUser.uid,
      name: userData.name || firebaseUser.displayName || 'Kullanıcı',
      email: firebaseUser.email || '',
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'Kullanıcı')}&background=3b82f6&color=fff`,
      bio: userData.bio || '',
      location: userData.location || '',
      interests: userData.interests || [],
      friends: userData.friends || [],
      isAdmin: isAdmin(firebaseUser.email || '')
    };
  } else {
    // Yeni kullanıcı için varsayılan veri oluştur
    const newUser: AppUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Kullanıcı',
      email: firebaseUser.email || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'Kullanıcı')}&background=3b82f6&color=fff`,
      bio: '',
      location: '',
      interests: [],
      friends: [],
      isAdmin: isAdmin(firebaseUser.email || '')
    };
    
    // Firestore'a kaydet
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    return newUser;
  }
};

// Giriş yap
export const loginWithEmail = async (email: string, password: string): Promise<AppUser | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await convertFirebaseUser(userCredential.user);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Kayıt ol
export const registerWithEmail = async (name: string, email: string, password: string): Promise<AppUser | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Kullanıcı profilini güncelle
    const newUser: AppUser = {
      id: userCredential.user.uid,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
      bio: '',
      location: '',
      interests: [],
      friends: [],
      isAdmin: isAdmin(email)
    };
    
    // Firestore'a kaydet
    await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
    
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Çıkış yap
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Auth state değişikliklerini dinle
export const onAuthStateChange = (callback: (user: AppUser | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const appUser = await convertFirebaseUser(firebaseUser);
        callback(appUser);
      } catch (error) {
        console.error('Error converting user:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
