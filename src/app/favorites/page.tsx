import { listings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";

export default function FavoritesPage() {
  const favoriteListings = listings.slice(0, 4);

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
          Your Favorites
        </h1>
        <p className="text-muted-foreground text-lg">
          The listings you've saved. Don't let a great deal slip away!
        </p>
      </div>
      {favoriteListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-dashed border-2 rounded-lg">
          <h2 className="text-2xl font-semibold">No favorites yet!</h2>
          <p className="text-muted-foreground mt-2">
            Click the heart icon on a listing to save it here.
          </p>
        </div>
      )}
    </div>
  );
}
