'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { listings } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowLeft, Send, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";

// Mock data for a single conversation
const conversations:any = {
  "conv-1": {
    id: "conv-1",
    listing: listings[0],
    otherUser: listings[0].seller,
    messages: [
      { id: "msg-1", senderId: "buyer-id", text: "Is this still available?", timestamp: "10:00 AM" },
      { id: "msg-2", senderId: "seller-1", text: "Yes, it is!", timestamp: "10:01 AM" },
      { id: "msg-3", senderId: "buyer-id", text: "What's the battery health like?", timestamp: "10:02 AM" },
      { id: "msg-4", senderId: "seller-1", text: "It's at 95%. I've updated the description with more details.", timestamp: "10:03 AM" },
      { id: "msg-5", senderId: "buyer-id", text: "Great, thanks! I'm interested.", timestamp: "10:05 AM" },
    ],
  },
  "conv-2": {
    id: "conv-2",
    listing: listings[2],
    otherUser: listings[2].seller,
    messages: [
      { id: "msg-1", senderId: "buyer-id", text: "Can you do 35k?", timestamp: "6:30 PM" },
    ]
  },
  "conv-3": {
    id: "conv-3",
    listing: listings[3],
    otherUser: listings[3].seller,
    messages: [
      { id: "msg-1", senderId: "seller-3", text: "Okay, sounds good. Let's meet tomorrow.", timestamp: "11:45 AM" },
    ]
  }
};

const currentUserId = "buyer-id"; // Mock current user

export default function ChatPage({ params }: { params: { conversationId: string } }) {
    const conversation = conversations[params.conversationId];

  if (!conversation) {
    notFound();
  }
  
  const { listing, otherUser, messages } = conversation;
  const listingImage = PlaceHolderImages.find(p => p.id === listing.images[0])?.imageUrl || `https://picsum.photos/seed/${listing.images[0]}/100/100`;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex-1 container mx-auto max-w-4xl py-4 px-0 md:px-6 md:py-6 h-[calc(100vh-4rem)]">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
              <Link href="/messages" className="md:hidden">
                <Button variant="ghost" size="icon">
                  <ArrowLeft />
                </Button>
              </Link>
              <Avatar>
                <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="font-semibold">{otherUser.name}</p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/listings/${listing.id}`} className="flex items-center gap-3 bg-muted p-2 rounded-lg hover:bg-muted/80">
                <Image src={listingImage} alt={listing.title} width={40} height={40} className="rounded-md object-cover" />
                <div className="hidden sm:block">
                    <p className="font-semibold text-sm truncate max-w-[200px]">{listing.title}</p>
                    <p className="text-xs text-primary font-bold">₹{listing.price.toLocaleString("en-IN")}</p>
                </div>
              </Link>
              <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                  <span className="sr-only">Share Contact</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message: any) => {
              const isCurrentUser = message.senderId === currentUserId;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={otherUser.avatar} />
                      <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-md rounded-lg px-4 py-2",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs opacity-70 float-right mt-1">{message.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
          <div className="border-t p-4 bg-background">
            <div className="relative">
              <Input
                placeholder="Type your message..."
                className="pr-12 text-base"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
