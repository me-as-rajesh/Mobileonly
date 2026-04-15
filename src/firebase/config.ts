import {type FirebaseOptions} from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBfXuVzsWrSf3Qrae6gufiAGoXFGJ7xvNY",
  authDomain: "mobileonly-a2ef0.firebaseapp.com",
  projectId: "mobileonly-a2ef0",
  storageBucket: "mobileonly-a2ef0.appspot.com",
  messagingSenderId: "1087863751665",
  appId: "1:1087863751665:web:1428f97f0dc34668987a50"
};

export function getFirebaseConfig() {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase configuration is missing. Please check src/firebase/config.ts');
  }
  return firebaseConfig;
}
