'use client';

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ClientTime } from "@/components/client-date";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  participants: string[];
  lastMessageText: string;
  lastMessageAt: {
    seconds: number;
    nanoseconds: number;
  };
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  buyerName: string;
  buyerAvatar: string;
  sellerName: string;
  sellerAvatar: string;
}

export default function MessagesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const conversationsQuery = user
    ? query(
        collection(firestore, "conversations"),
        where("participants", "array-contains", user.uid),
        orderBy("lastMessageAt", "desc")
      )
    : null;

  const { data: conversations, loading } = useCollection<Conversation>(conversationsQuery);
  
  const getOtherUser = (conv: Conversation) => {
      if (!user) return { name: 'User', avatar: '' };
      const isBuyer = user.uid === conv.buyerId;
      return {
          name: isBuyer ? conv.sellerName : conv.buyerName,
          avatar: isBuyer ? conv.sellerAvatar : conv.buyerAvatar
      }
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
              Inbox
            </h1>
            <p className="text-muted-foreground text-lg">
              All your conversations in one place.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {loading && (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4">
                            <Skeleton className="h-14 w-14 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-2/4" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))
                )}
                {!loading && conversations?.length === 0 && (
                    <div className="text-center py-20">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h2 className="mt-4 text-xl font-semibold">No messages yet</h2>
                        <p className="text-muted-foreground mt-1">Start a conversation on a listing page.</p>
                    </div>
                )}
                {conversations?.map((conv) => {
                    const otherUser = getOtherUser(conv);
                    const lastMessageDate = new Date(conv.lastMessageAt.seconds * 1000);
                  
                  return (
                  <Link href={`/messages/${conv.id}`} key={conv.id}>
                    <div
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                    >
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={otherUser.avatar} />
                        <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold">{otherUser.name}</p>
                          <ClientTime
                            date={lastMessageDate}
                            className="text-xs text-muted-foreground"
                            options={{
                              hour: '2-digit',
                              minute: '2-digit'
                            }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">{conv.listingTitle}</p>
                        <div className="flex justify-between items-end">
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{conv.lastMessageText || '...'}</p>
                          {/* {conv.unreadCount > 0 && (
                            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                              {conv.unreadCount}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </Link>
                )})}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
