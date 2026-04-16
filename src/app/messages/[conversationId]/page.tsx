'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, Send, Phone, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { doc, collection, query, orderBy, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientTime } from "@/components/client-date";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

export default function ChatPage({ params }: { params: { conversationId: string } }) {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const [newMessage, setNewMessage] = React.useState("");
    const [isSending, setIsSending] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);


    const conversationRef = doc(firestore, 'conversations', params.conversationId);
    const { data: conversation, loading: convLoading } = useDoc(conversationRef);

    const messagesQuery = query(collection(firestore, `conversations/${params.conversationId}/messages`), orderBy('timestamp', 'asc'));
    const { data: messages, loading: messagesLoading } = useCollection<Message>(messagesQuery);
    
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    React.useEffect(() => {
      if (!userLoading && !user) {
        router.push('/login');
      }
    }, [user, userLoading, router]);
    
    if (convLoading || userLoading) {
        return (
             <div className="flex flex-col h-screen bg-background">
                <Header />
                <div className="flex-1 container mx-auto max-w-4xl py-4 px-0 md:px-6 md:py-6 h-[calc(100vh-4rem)]">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                           <Skeleton className="h-12 w-1/2" />
                           <Skeleton className="h-12 w-1/4" />
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                            <Skeleton className="h-10 w-1/3" />
                            <Skeleton className="h-10 w-1/2 self-end" />
                            <Skeleton className="h-10 w-1/4" />
                        </CardContent>
                        <div className="border-t p-4 bg-background">
                           <Skeleton className="h-10 w-full" />
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    if (!conversation) {
        return notFound();
    }

    const otherUser = user?.uid === conversation.buyerId 
        ? { name: conversation.sellerName, avatar: conversation.sellerAvatar }
        : { name: conversation.buyerName, avatar: conversation.buyerAvatar };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;
        
        setIsSending(true);
        const text = newMessage;
        setNewMessage("");

        const messagesColRef = collection(firestore, `conversations/${params.conversationId}/messages`);
        await addDoc(messagesColRef, {
            senderId: user.uid,
            text,
            timestamp: serverTimestamp(),
        });
        await updateDoc(conversationRef, {
          lastMessageText: text,
          lastMessageAt: serverTimestamp(),
        })

        setIsSending(false);
    };

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
                <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="font-semibold">{otherUser.name}</p>
                {/* <p className="text-sm text-muted-foreground">Online</p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/listings/${conversation.listingId}`} className="flex items-center gap-3 bg-muted p-2 rounded-lg hover:bg-muted/80">
                <Image src={conversation.listingImage} alt={conversation.listingTitle} width={40} height={40} className="rounded-md object-cover" />
                <div className="hidden sm:block">
                    <p className="font-semibold text-sm truncate max-w-[200px]">{conversation.listingTitle}</p>
                    <p className="text-xs text-primary font-bold">₹{conversation.listingPrice.toLocaleString("en-IN")}</p>
                </div>
              </Link>
              <Button variant="outline" size="icon" disabled>
                  <Phone className="h-4 w-4" />
                  <span className="sr-only">Share Contact</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {messagesLoading && <Loader2 className="mx-auto my-12 h-8 w-8 animate-spin text-muted-foreground" />}
            {messages?.map((message: Message) => {
              const isCurrentUser = message.senderId === user?.uid;
              const msgDate = message.timestamp ? new Date(message.timestamp.seconds * 1000) : new Date();

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
                      <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
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
                    <ClientTime date={msgDate} options={{hour: '2-digit', minute: '2-digit'}} className="text-xs opacity-70 float-right mt-1"/>
                  </div>
                </div>
              );
            })}
             <div ref={messagesEndRef} />
          </CardContent>
          <div className="border-t p-4 bg-background">
            <form onSubmit={handleSendMessage} className="relative">
              <Input
                placeholder="Type your message..."
                className="pr-12 text-base"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8"
                disabled={isSending || !newMessage.trim()}
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
