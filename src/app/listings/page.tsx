import { listings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";
import { Filters } from "@/components/filters";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SlidersHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BrowsePage() {
  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 py-8 px-4 md:px-6">
      <aside className="hidden md:block">
        <div className="sticky top-20">
            <h2 className="text-2xl font-bold font-headline mb-4">Filters</h2>
            <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
                <Filters />
            </ScrollArea>
        </div>
      </aside>

      <main>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">
            All Listings
          </h1>
          <div className="md:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Filters</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 pt-8">
                  <h2 className="text-2xl font-bold font-headline mb-4">Filters</h2>
                   <ScrollArea className="h-[70vh]">
                     <Filters />
                   </ScrollArea>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg">Load More</Button>
        </div>
      </main>
    </div>
  );
}
