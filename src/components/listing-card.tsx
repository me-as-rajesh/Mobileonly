'use client';

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Cpu, HardDrive } from "lucide-react";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ClientDate } from "./client-date";

type ListingCardProps = {
  listing: Listing;
  className?: string;
};

export function ListingCard({ listing, className }: ListingCardProps) {
  const imageUrl =
    PlaceHolderImages.find((img) => img.id === listing.images[0])?.imageUrl ??
    "https://picsum.photos/seed/placeholder/800/600";

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl",
        className
      )}
    >
      <CardHeader className="p-0 relative">
        <Link href={`/listings/${listing.id}`} className="block">
          <div className="aspect-[4/3] overflow-hidden">
            <Image
              src={imageUrl}
              alt={listing.title}
              width={800}
              height={600}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="smartphone"
            />
          </div>
        </Link>
        {listing.isBoosted && (
          <Badge className="absolute top-2 left-2" variant="default">
            Boosted
          </Badge>
        )}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Favorite</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 p-4">
        <h3 className="font-headline text-lg font-semibold leading-tight">
          <Link href={`/listings/${listing.id}`} className="hover:text-primary">
            {listing.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          {listing.location.district}, {listing.location.state}
        </p>
        <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5" title="RAM">
                <Cpu className="w-4 h-4"/>
                <span>{listing.variant.ram} GB</span>
            </div>
            <div className="flex items-center gap-1.5" title="Storage">
                <HardDrive className="w-4 h-4"/>
                <span>{listing.variant.storage} GB</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-end justify-between">
          <p className="text-2xl font-bold text-primary">
            ₹{listing.price.toLocaleString("en-IN")}
          </p>
          <ClientDate
            date={listing.createdAt}
            options={{
              day: "numeric",
              month: "short",
            }}
            className="text-xs text-muted-foreground"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
