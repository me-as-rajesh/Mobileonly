import {
  doc,
  setDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function createUserProfile(
  db: Firestore,
  user: User,
  role: 'buyer' | 'seller' | 'both',
  name: string
) {
  const userRef = doc(db, 'users', user.uid);
  const data: UserProfile = {
    uid: user.uid,
    email: user.email,
    name: name || user.displayName,
    avatar: user.photoURL,
    role,
    createdAt: new Date().toISOString(),
  };

  setDoc(userRef, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'create',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
