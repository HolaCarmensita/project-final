import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBvdDMLYRvMJbosr1if1GXHwQBJbAlSvBw',
  authDomain: 'project-final-a0ede.firebaseapp.com',
  projectId: 'project-final-a0ede',
  storageBucket: 'project-final-a0ede.firebasestorage.app',
  messagingSenderId: '783194799290',
  appId: '1:783194799290:web:506652d13d05f2ee631683',
  measurementId: 'G-77CNYVX7XF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firebase Storage and export it
export const storage = getStorage(app);

export default app;
