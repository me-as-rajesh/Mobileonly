'use client';

import { useMemo } from 'react';

// Custom comparison logic for Firestore objects
function areDepsEqual(a: any, b: any) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (typeof a.isEqual === 'function') {
    return a.isEqual(b);
  }
  if (typeof a.equals === 'function') {
    return a.equals(b);
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (e) {
    return false;
  }
}

function useMemoCompare<T>(next: T, compare: (a: T, b: T) => boolean) {
  const previousRef = React.useRef<T>();
  const previous = previousRef.current;

  const isEqual = compare(previous as T, next);

  if (!isEqual) {
    previousRef.current = next;
  }
  return isEqual ? previous : next;
}


export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(factory, useMemoCompare(deps, (prevDeps, nextDeps) => {
        if (prevDeps.length !== nextDeps.length) {
            return false;
        }
        for (let i = 0; i < prevDeps.length; i++) {
            if (!areDepsEqual(prevDeps[i], nextDeps[i])) {
                return false;
            }
        }
        return true;
    }));
}
