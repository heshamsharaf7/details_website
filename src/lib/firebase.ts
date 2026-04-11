// Firebase configuration - same project as Flutter app
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAm2m4tUR6p4WwUbsWedlfwnyaklZw8xcQ',
  authDomain: 'details-c34a2.firebaseapp.com',
  projectId: 'details-c34a2',
  storageBucket: 'details-c34a2.firebasestorage.app',
  messagingSenderId: '505968962330',
  appId: '1:505968962330:android:a8c52d7f568f3aa04e5aa3',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
