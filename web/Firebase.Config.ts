// firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2RmTyj15t4d4tELZqrCyzuOd_VDqNFlE",
  authDomain: "fir-auth-6a418.firebaseapp.com",
  projectId: "fir-auth-6a418",
  storageBucket: "fir-auth-6a418.firebasestorage.app",
  messagingSenderId: "1095114124557",
  appId: "1:1095114124557:web:9cf8f69d961df6bdef5444"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export types for Firestore
export type { User } from 'firebase/auth';
export type { DocumentData, DocumentReference } from 'firebase/firestore';

