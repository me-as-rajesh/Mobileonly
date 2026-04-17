
'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '../mongodb';
import User from '@/models/User';
import { auth } from 'firebase-admin';
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
    _id: string;
    uid: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'buyer' | 'seller' | 'both';
    createdAt: Date;
    updatedAt: Date;
}

// Ensure Firebase Admin is initialized
if (!adminApp) {
  throw new Error("Firebase Admin SDK not initialized");
}

export async function getAuthenticatedUserProfile(): Promise<UserProfile | null> {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const decodedToken = await auth(adminApp).verifySessionCookie(sessionCookie, true);
    return await getUserByUid(decodedToken.uid);
  } catch (error) {
    console.error('Failed to get authenticated user profile:', error);
    return null;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ uid: userData.uid });
    if (existingUser) {
      // Optionally update user data on new login
      return JSON.parse(JSON.stringify(existingUser));
    }

    const newUser = await User.create({
      uid: userData.uid,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      role: userData.role,
    });

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user in database');
  }
}

export async function getUserByUid(uid: string): Promise<UserProfile | null> {
  try {
    await dbConnect();
    const user = await User.findOne({ uid });
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user data');
  }
}
