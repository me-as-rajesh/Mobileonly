import * as admin from 'firebase-admin';

// This is a private key, DO NOT commit it to version control.
// It should be stored as a secret environment variable.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let app: admin.app.App | undefined;

if (!admin.apps.length) {
  if (serviceAccount) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } else {
    console.warn("Firebase Admin SDK not initialized. FIREBASE_SERVICE_ACCOUNT_KEY env var is missing.");
  }
} else {
  app = admin.app();
}

export const adminApp = app;
