import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listings } from "@/lib/data";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MessagesPage() {
  const conversations = [
    {
      id: "conv-1",
      listing: listings[0],
      otherUser: listings[0].seller,
      lastMessage: "Is this still available?",
      unreadCount: 1,
      timestamp: "2024-07-21T10:00:00Z",
    },
    {
      id: "conv-2",
      listing: listings[2],
      otherUser: listings[2].seller,
      lastMessage: "Can you do 35k?",
      unreadCount: 0,
      timestamp: "2024-07-20T18:30:00Z",
    },
    {
      id: "conv-3",
      listing: listings[3],
      otherUser: listings[3].seller,
      lastMessage: "Okay, sounds good. Let's meet tomorrow.",
      unreadCount: 0,
      timestamp: "2024-07-19T11:45:00Z",
    },
  ];

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
                {conversations.map((conv) => (
                  <Link href={`/messages/${conv.id}`} key={conv.id}>
                    <div
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                    >
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={conv.otherUser.avatar} />
                        <AvatarFallback>{conv.otherUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold">{conv.otherUser.name}</p>
                          <time className="text-xs text-muted-foreground">
                            {new Date(conv.timestamp).toLocaleTimeString("en-IN", {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </time>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">{conv.listing.title}</p>
                        <div className="flex justify-between items-end">
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                              {conv.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
