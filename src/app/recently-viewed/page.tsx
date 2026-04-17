import * as React from "react";
import { ListingCard } from "@/components/listing-card";
import { History } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getListings } from "@/lib/actions/listing.actions";

export default async function RecentlyViewedPage() {
  // TODO: Replace with actual recently viewed logic
  const recentlyViewedListings = await getListings({ limit: 4 });

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl py-12 px-4 md:px-6">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl flex items-center gap-3">
              <History className="w-10 h-10"/>
              Recently Viewed
            </h1>
            <p className="text-muted-foreground text-lg">
              Your browsing history. Pick up where you left off.
            </p>
          </div>
          {recentlyViewedListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentlyViewedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-dashed border-2 rounded-lg">
              <h2 className="text-2xl font-semibold">Nothing here yet!</h2>
              <p className="text-muted-foreground mt-2">
                Start browsing listings and they will appear here.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
