'use client';

import type {DocumentReference, DocumentData} from 'firebase/firestore';
import {onSnapshot} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import { useMemoFirebase } from './use-memo-firebase';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';

export function useDoc<T>(
  ref: DocumentReference<T, DocumentData> | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const memoizedRef = useMemoFirebase(() => ref, [ref]);

  useEffect(() => {
    if (!memoizedRef) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = {id: snapshot.id, ...snapshot.data()} as T;
          setData(data);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: memoizedRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef]);

  return {data, loading, error};
}
