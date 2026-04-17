'use client';

import * as React from 'react';
import { ListingCard } from "@/components/listing-card";
import { Filters } from "@/components/filters";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams, useRouter } from "next/navigation";
import type { Listing } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export interface FilterState {
  brand: string;
  priceRange: [number, number];
  condition: string;
  ram: number | null;
  storage: number | null;
  district: string;
}

interface ListingsClientProps {
  listings: Listing[];
  searchQuery: string | null;
}

export function ListingsClient({ listings, searchQuery }: ListingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = React.useState<FilterState>({
    brand: searchParams.get('brand') || "all",
    priceRange: [
      Number(searchParams.get('minPrice') || 0), 
      Number(searchParams.get('maxPrice') || 150000)
    ],
    condition: searchParams.get('condition') || "all",
    ram: Number(searchParams.get('ram')) || null,
    storage: Number(searchParams.get('storage')) || null,
    district: searchParams.get('district') || 'all',
  });

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set('q', searchQuery);
    
    if (filters.brand !== 'all') params.set('brand', filters.brand); else params.delete('brand');
    if (filters.condition !== 'all') params.set('condition', filters.condition); else params.delete('condition');
    if (filters.ram) params.set('ram', String(filters.ram)); else params.delete('ram');
    if (filters.storage) params.set('storage', String(filters.storage)); else params.delete('storage');
    if (filters.district !== 'all') params.set('district', filters.district); else params.delete('district');
    params.set('minPrice', String(filters.priceRange[0]));
    params.set('maxPrice', String(filters.priceRange[1]));
    
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 py-8 px-4 md:px-6">
      <aside className="hidden md:block">
        <div className="sticky top-20">
           <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h2 className="text-2xl font-bold font-headline mb-4">Filters</h2>
          <ScrollArea className="h-[calc(100vh-18rem)] pr-4">
            <Filters filters={filters} setFilters={setFilters} />
          </ScrollArea>
           <Button onClick={applyFilters} className="w-full mt-4">Apply Filters</Button>
        </div>
      </aside>

      <main>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">
            {searchQuery ? `Results for "${searchQuery}"` : "All Listings"} ({listings.length})
          </h1>
          <div className="flex items-center">
             <Button variant="ghost" onClick={() => router.back()} className="md:hidden mr-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Filters</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 pt-8">
                  <h2 className="text-2xl font-bold font-headline mb-4">
                    Filters
                  </h2>
                  <ScrollArea className="h-[70vh]">
                    <Filters filters={filters} setFilters={setFilters} />
                  </ScrollArea>
                  <Button onClick={applyFilters} className="w-full mt-4">Apply Filters</Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
            <div className="text-center py-20 border-dashed border-2 rounded-lg mt-6">
                <h2 className="text-2xl font-semibold">No listings found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
        )}
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      </main>
    </div>
  );
}
