import * as React from 'react';
import { Suspense } from 'react';
import { ListingsClient } from './client';
import { Skeleton } from '@/components/ui/skeleton';

function ListingsPageSkeleton() {
  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 py-8 px-4 md:px-6">
      <aside className="hidden md:block">
        <div className="sticky top-20 space-y-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-32" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </aside>
      <main>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ListingsPage() {
  return (
    // You can add a fallback UI here while the client component is loading
    <Suspense fallback={<ListingsPageSkeleton />}>
      <ListingsClient />
    </Suspense>
  );
}
