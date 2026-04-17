'use client';

import * as React from 'react';
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  Cpu,
  HardDrive,
  Heart,
  MessageSquare,
  Shield,
  Star,
  Smartphone,
  CalendarDays,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import type { Listing, Seller } from "@/lib/types";
import { ClientDate } from "@/components/client-date";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { getListingById } from '@/lib/actions/listing.actions';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuthenticatedUserProfile } from '@/lib/actions/user.actions';


function StartChatButton({ listing, seller }: { listing: Listing, seller: Seller }) {
    const { user } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleStartChat = async () => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Authentication Required',
                description: 'Please log in to chat with the seller.',
            });
            router.push('/login');
            return;
        }

        if (user.uid === seller.id) {
             toast({
                variant: 'destructive',
                title: 'This is your listing',
                description: 'You cannot start a chat with yourself.',
            });
            return;
        }

        setIsLoading(true);

        try {
            const conversationsRef = collection(firestore, 'conversations');

            const q = query(
              conversationsRef,
              where('listingId', '==', listing.id),
              where('buyerId', '==', user.uid)
            );
            
            const existingConvs = await getDocs(q);

            if (!existingConvs.empty) {
                // Conversation already exists
                router.push(`/messages/${existingConvs.docs[0].id}`);
            } else {
                // Create a new conversation
                const buyerProfile = await getAuthenticatedUserProfile();
                if (!buyerProfile) throw new Error("Could not find your user profile.");

                const newConversationRef = await addDoc(conversationsRef, {
                    listingId: listing.id,
                    buyerId: user.uid,
                    sellerId: seller.id,
                    participants: [user.uid, seller.id],
                    createdAt: serverTimestamp(),
                    lastMessageAt: serverTimestamp(),
                    lastMessageText: '',
                    listingTitle: listing.title,
                    listingPrice: listing.price,
                    listingImage: listing.images[0],
                    buyerName: buyerProfile.name,
                    buyerAvatar: buyerProfile.avatar,
                    sellerName: seller.name,
                    sellerAvatar: seller.avatar,
                });
                router.push(`/messages/${newConversationRef.id}`);
            }

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Failed to start chat',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button size="lg" onClick={handleStartChat} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MessageSquare className="mr-2 h-5 w-5" />}
            Chat with Seller
        </Button>
    )
}

type PageProps = {
  params: { id: string };
};

function ListingDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Skeleton className="h-10 w-40 mb-8" />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function ListingDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [listing, setListing] = React.useState<Listing | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const fetchedListing = await getListingById(params.id);
      if (fetchedListing) {
        setListing(fetchedListing);
      }
      setLoading(false);
    };
    fetchListing();
  }, [params.id]);


  if (loading) {
    return <ListingDetailSkeleton />;
  }
  
  if (!listing) {
    notFound();
  }

  const {
    title,
    price,
    images,
    description,
    brand,
    model,
    variant,
    condition,
    location,
    purchaseYear,
    seller,
    createdAt,
  } = listing;


  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
      </Button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="md:sticky md:top-24 self-start">
          <Carousel>
            <CarouselContent>
              {images.map((imgUrl, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <div className="aspect-[4/3]">
                      <Image
                        src={imgUrl}
                        alt={title}
                        width={800}
                        height={600}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="font-headline text-3xl font-bold lg:text-4xl">
              {title}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-primary">
                ₹{price.toLocaleString("en-IN")}
              </p>
              {listing.isNegotiable && (
                <Badge variant="secondary">Negotiable</Badge>
              )}
            </div>
            <div className="text-muted-foreground">
              Posted in {location.district}, {location.state} on{" "}
              <ClientDate
                date={createdAt}
                options={{
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <SpecItem icon={Smartphone} label="Brand" value={brand} />
                <SpecItem icon={Smartphone} label="Model" value={model} />
                <SpecItem
                  icon={Cpu}
                  label="RAM"
                  value={`${variant.ram} GB`}
                />
                <SpecItem
                  icon={HardDrive}
                  label="Storage"
                  value={`${variant.storage} GB`}
                />
                <SpecItem icon={Shield} label="Condition" value={condition} />
                {purchaseYear && (
                    <SpecItem icon={CalendarDays} label="Purchase Year" value={String(purchaseYear)} />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={seller.avatar} alt={seller.name} />
                    <AvatarFallback>
                      {seller.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span>{seller.rating}</span>
                      </div>
                      <span>({seller.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Button size="lg" variant="outline">
                <Heart className="mr-2 h-5 w-5" />
                Favorite
            </Button>
            <StartChatButton listing={listing} seller={listing.seller} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2 font-medium">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="capitalize">{value}</span>
            </div>
        </div>
    )
}
