import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { listings } from '@/lib/data';
import { Star, Verified } from 'lucide-react';
import { ListingCard } from '@/components/listing-card';

// In a real app, you'd fetch this data based on params.userId
const mockSeller = listings[0].seller; 
const sellerListings = listings.filter(l => l.seller.id === mockSeller.id);

export default function ProfilePage({ params }: { params: { userId: string } }) {
  if (!mockSeller) {
    notFound();
  }

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto max-w-6xl py-12 px-4 md:px-6">
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-md">
              <AvatarImage src={mockSeller.avatar} alt={mockSeller.name} />
              <AvatarFallback>{mockSeller.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold font-headline">{mockSeller.name}</h1>
                {mockSeller.isVerified && (
                  <Badge variant="default" className="gap-1">
                    <Verified className="h-4 w-4" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-bold text-foreground">{mockSeller.rating}</span>
                  <span>({mockSeller.reviews} reviews)</span>
                </div>
                <span>•</span>
                <span>Member since 2023</span>
              </div>
              <p className="text-muted-foreground pt-2">
                Tech enthusiast and trusted seller on ConnectCell. All devices are carefully inspected.
              </p>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-2xl font-bold font-headline mb-6">
            Active Listings from {mockSeller.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
