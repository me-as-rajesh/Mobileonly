
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';
import { cookies } from 'next/headers';
import { adminApp } from '@/firebase/admin';

interface CreateUserParams {
  uid: string;
  email: string;
  name: string;
  avatar: string | null;
  role: 'buyer' | 'seller' | 'both';
}

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'buyer' | 'seller' | 'both';
    createdAt: string;
    updatedAt: string;
}

export async function getAuthenticatedUserProfile(): Promise<UserProfile | null> {
  if (!adminApp) {
    console.warn("Firebase Admin SDK not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is likely missing on the server. Cannot authenticate server-side.");
    return null;
  }
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const decodedToken = await auth(adminApp).verifySessionCookie(sessionCookie, true);
    return await getUserByUid(decodedToken.uid);
  } catch (error) {
    console.error('Failed to get authenticated user profile:', error);
    // This can happen if the cookie is invalid or expired. It's not a critical server error.
    return null;
  }
}

export async function createUser(userData: CreateUserParams) {
  if (!adminApp) {
    throw new Error("Firebase Admin SDK not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is likely missing on the server.");
  }
  try {
    const db = getDatabase(adminApp);
    const userRef = db.ref(`users/${userData.uid}`);
    const snapshot = await userRef.once('value');

    if (snapshot.exists()) {
      // User already exists, return existing data
      return snapshot.val();
    }
    
    const newUser: Omit<UserProfile, 'uid'> = {
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar || '',
      role: userData.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userRef.set(newUser);

    return { ...newUser, uid: userData.uid };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user in database');
  }
}

export async function getUserByUid(uid: string): Promise<UserProfile | null> {
  if (!adminApp) {
    console.warn("Firebase Admin SDK not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is likely missing on the server. Returning null for getUserByUid to allow build to pass.");
    return null;
  }
  try {
    const db = getDatabase(adminApp);
    const userRef = db.ref(`users/${uid}`);
    const snapshot = await userRef.once('value');
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const userData = snapshot.val();
    return { ...userData, uid };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user data');
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  if (!adminApp) {
    console.warn("Firebase Admin SDK not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is likely missing on the server. Returning empty list for getAllUsers to allow build to pass.");
    return [];
  }
  try {
    const db = getDatabase(adminApp);
    const usersRef = db.ref('users');
    const snapshot = await usersRef.once('value');

    if (!snapshot.exists()) {
      return [];
    }

    const usersData = snapshot.val();
    const usersArray = Object.keys(usersData).map(uid => ({
      ...usersData[uid],
      uid: uid,
    }));
    
    return JSON.parse(JSON.stringify(usersArray));
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch all users.');
  }
}
