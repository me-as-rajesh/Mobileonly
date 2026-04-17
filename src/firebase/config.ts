import {type FirebaseOptions} from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

export function getFirebaseConfig() {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase configuration is missing. Please check your .env file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set.');
  }
  // The validation for databaseURL is now handled in the FirebaseClientProvider
  // to prevent a hard crash and show a user-friendly error screen instead.
  return firebaseConfig;
}
