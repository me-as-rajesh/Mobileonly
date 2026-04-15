"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { listings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";

export default function Home() {
  const featuredListings = listings.slice(0, 8);

  return (
    <div className="flex flex-col gap-12 md:gap-16 lg:gap-24 pb-12 md:pb-16 lg:pb-24">
      <section className="bg-card border-b">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4 py-16 md:py-24 lg:py-32">
              <div className="space-y-4">
                <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  The Smart Way to Buy & Sell Phones
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  ConnectCell is your trusted peer-to-peer marketplace for
                  quality used smartphones. Find great deals or sell your old
                  phone hassle-free.
                </p>
              </div>
              <div className="w-full max-w-lg space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 text-base"
                    placeholder="Search for a model, e.g. iPhone 15 Pro"
                    type="search"
                  />
                  <Button type="submit" size="icon" aria-label="Search">
                    <Search className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
               <SmartphoneIllustration />
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 items-start">
            <h2 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl">
              Featured Listings
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Check out these top-tier devices, handpicked for you. Quality and value, guaranteed.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button variant="outline" size="lg">View All Listings</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SmartphoneIllustration() {
  return (
    <div className="relative w-[300px] h-[600px] bg-slate-800 rounded-[40px] border-[10px] border-slate-950 shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-6 bg-slate-950 rounded-t-3xl flex justify-center items-end">
        <div className="w-20 h-2 bg-slate-800 rounded-b-md"></div>
      </div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-16 bg-slate-950 rounded-r-md -ml-px"></div>
      <div className="absolute top-28 right-0 w-1 h-24 bg-slate-950 rounded-l-md -mr-px"></div>
       <div className="absolute top-40 right-0 w-1 h-24 bg-slate-950 rounded-l-md -mr-px mt-28"></div>

      <div className="p-4 pt-8 h-full bg-gradient-to-br from-primary to-accent animate-gradient-xy">
        <div className="flex flex-col gap-4">
            <div className="bg-white/20 p-4 rounded-lg flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/30"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/30 rounded"></div>
                    <div className="h-3 bg-white/30 rounded w-3/4"></div>
                </div>
            </div>
             <div className="bg-white/20 p-4 rounded-lg flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/30"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/30 rounded"></div>
                    <div className="h-3 bg-white/30 rounded w-1/2"></div>
                </div>
            </div>
             <div className="bg-white/20 p-4 rounded-lg flex items-center gap-4 opacity-50">
                <div className="w-12 h-12 rounded-lg bg-white/30"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/30 rounded"></div>
                    <div className="h-3 bg-white/30 rounded w-3/4"></div>
                </div>
            </div>
             <div className="bg-white/20 p-4 rounded-lg flex items-center gap-4 opacity-50">
                <div className="w-12 h-12 rounded-lg bg-white/30"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/30 rounded"></div>
                    <div className="h-3 bg-white/30 rounded w-2/3"></div>
                </div>
            </div>
        </div>
      </div>
       <style jsx>{`
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 10s ease infinite;
        }
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}
