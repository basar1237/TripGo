import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase konfigürasyonu
const firebaseConfig = {
  apiKey: "AIzaSyB00KoKj58dmVHsjNruCYFJX4z0pfpzqoE",
  authDomain: "tripgo-ea700.firebaseapp.com",
  projectId: "tripgo-ea700",
  storageBucket: "tripgo-ea700.firebasestorage.app",
  messagingSenderId: "66978754898",
  appId: "1:66978754898:web:5b148650ab93fe63648a8b",
  measurementId: "G-YXJHJHLFVD"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Servisleri export et
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
