'use client';

import * as React from "react";
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { listings } from '@/lib/data';
import { Star, Verified } from 'lucide-react';
import { ListingCard } from '@/components/listing-card';
import { useDoc, useFirestore, type UserProfile } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientDate } from "@/components/client-date";

function ProfilePageSkeleton() {
  return (
    <div className="bg-muted/40">
      <div className="container mx-auto max-w-6xl py-12 px-4 md:px-6">
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-full" />
               <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const firestore = useFirestore();
  const userRef = doc(firestore, 'users', params.userId);
  const { data: userProfile, loading } = useDoc<UserProfile>(userRef);

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (!userProfile) {
    notFound();
  }

  // TODO: Fetch user's listings from Firestore instead of mock data
  const userListings = listings.filter(l => l.seller.id === userProfile.uid);

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto max-w-6xl py-12 px-4 md:px-6">
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-md">
              <AvatarImage src={userProfile.avatar!} alt={userProfile.name!} />
              <AvatarFallback>{userProfile.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold font-headline">{userProfile.name}</h1>
                {/* Note: isVerified is not on the default profile yet */}
                {/* {userProfile.isVerified && (
                  <Badge variant="default" className="gap-1">
                    <Verified className="h-4 w-4" />
                    Verified
                  </Badge>
                )} */}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  {/* TODO: Replace with real rating data */}
                  <span className="font-bold text-foreground">4.8</span>
                  <span>(124 reviews)</span>
                </div>
                <span>•</span>
                <span>Member since <ClientDate date={userProfile.createdAt} options={{ year: 'numeric' }} /></span>
              </div>
              <p className="text-muted-foreground pt-2">
                Tech enthusiast and trusted seller on ConnectCell. All devices are carefully inspected.
              </p>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-2xl font-bold font-headline mb-6">
            Active Listings from {userProfile.name}
          </h2>
          {userListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
             <Card>
              <CardContent className="py-20 text-center">
                <p className="text-muted-foreground">{userProfile.name} has no active listings.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
