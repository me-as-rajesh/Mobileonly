import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let serviceAccount: admin.ServiceAccount | undefined;

// Try loading from environment variable first (for production/Vercel)
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
  }
} 
// Fallback to local file (for local development)
else {
  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      const fileContents = fs.readFileSync(serviceAccountPath, 'utf8');
      // Ensure the file is not just an empty placeholder
      if (fileContents && !fileContents.includes("YOUR_PROJECT_ID")) {
        serviceAccount = JSON.parse(fileContents);
      }
    }
  } catch (error) {
    console.warn("Could not load local serviceAccountKey.json:", error);
  }
}


let app: admin.app.App | undefined;

if (!admin.apps.length) {
  if (serviceAccount) {
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    } catch(error) {
       console.error("Firebase Admin SDK Initialization Error: ", error);
    }
  } else {
    console.warn("Firebase Admin SDK not initialized. Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment or a valid serviceAccountKey.json file exists at the project root.");
  }
} else {
  app = admin.app();
}

export const adminApp = app;
