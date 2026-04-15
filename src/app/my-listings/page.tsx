import { listings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const mySellerId = "seller-1";
const myListings = listings.filter(l => l.seller.id === mySellerId);
const activeListings = myListings.filter(l => l.status === 'active' || l.status === undefined);
const soldListings = listings.filter(l => l.status === 'sold');
const flaggedListings = listings.filter(l => l.status === 'flagged');

export default function MyListingsPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl py-12 px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
                My Listings
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your active, sold, and flagged listings.
              </p>
            </div>
            <Link href="/sell">
              <Button>Create New Listing</Button>
            </Link>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
              <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
              <TabsTrigger value="sold">Sold ({soldListings.length})</TabsTrigger>
              <TabsTrigger value="flagged">Flagged ({flaggedListings.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-6">
              {activeListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {activeListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-dashed border-2 rounded-lg mt-6">
                  <h2 className="text-2xl font-semibold">No active listings</h2>
                  <p className="text-muted-foreground mt-2">Create a new listing to start selling.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="sold" className="mt-6">
              <div className="text-center py-20 border-dashed border-2 rounded-lg mt-6">
                <h2 className="text-2xl font-semibold">No sold listings yet</h2>
                <p className="text-muted-foreground mt-2">Your sold items will appear here.</p>
              </div>
            </TabsContent>
            <TabsContent value="flagged" className="mt-6">
              <div className="text-center py-20 border-dashed border-2 rounded-lg mt-6">
                <h2 className="text-2xl font-semibold">No flagged listings</h2>
                <p className="text-muted-foreground mt-2">Listings that need your attention will be shown here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
