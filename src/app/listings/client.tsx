"use client";

import * as React from 'react';
import { listings as allListings } from "@/lib/data";
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
import { getDistance } from "@/lib/utils";
import type { Location } from "@/lib/types";
import { useSearchParams, useRouter } from "next/navigation";

export interface FilterState {
  brand: string;
  priceRange: [number, number];
  condition: string;
  ram: number | null;
  storage: number | null;
  location: Location | null;
  distance: number;
}

export function ListingsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');

  const [filters, setFilters] = React.useState<FilterState>({
    brand: "all",
    priceRange: [0, 150000],
    condition: "all",
    ram: null,
    storage: null,
    location: null,
    distance: 500,
  });

  const filteredListings = React.useMemo(() => {
    return allListings.filter((listing) => {
      // Search Query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (
          !listing.title.toLowerCase().includes(searchLower) &&
          !listing.brand.toLowerCase().includes(searchLower) &&
          !listing.model.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      // Price
      if (
        listing.price < filters.priceRange[0] ||
        listing.price > filters.priceRange[1]
      ) {
        return false;
      }
      // Brand
      if (filters.brand !== "all" && listing.brand.toLowerCase() !== filters.brand) {
        return false;
      }
      // Condition
      if (filters.condition !== "all" && listing.condition !== filters.condition) {
        return false;
      }
      // RAM
      if (filters.ram && listing.variant.ram !== filters.ram) {
        return false;
      }
      // Storage
      if (filters.storage && listing.variant.storage !== filters.storage) {
        return false;
      }
      // Location
      if (filters.location) {
        const distance = getDistance(
          filters.location.lat,
          filters.location.lon,
          listing.location.lat,
          listing.location.lon
        );
        if (distance > filters.distance) {
          return false;
        }
      }
      return true;
    });
  }, [filters, searchQuery]);

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 py-8 px-4 md:px-6">
      <aside className="hidden md:block">
        <div className="sticky top-20">
           <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h2 className="text-2xl font-bold font-headline mb-4">Filters</h2>
          <ScrollArea className="h-[calc(100vh-14rem)] pr-4">
            <Filters filters={filters} setFilters={setFilters} />
          </ScrollArea>
        </div>
      </aside>

      <main>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">
            {searchQuery ? `Results for "${searchQuery}"` : "All Listings"} ({filteredListings.length})
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
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
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
