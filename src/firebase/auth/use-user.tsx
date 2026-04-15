'use client';

import {useEffect, useState} from 'react';
import {type User} from 'firebase/auth';
import {useAuth, useFirestore} from '../provider';
import { doc, onSnapshot } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: 'buyer' | 'seller' | 'both';
  [key: string]: any;
}


export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user && firestore) {
      const unsub = onSnapshot(doc(firestore, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          setProfile({uid: doc.id, ...doc.data()} as UserProfile);
        } else {
          setProfile(null);
        }
      });
      return () => unsub();
    } else {
      setProfile(null);
    }
  }, [user, firestore]);

  return {user, profile, loading};
}
