
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CircleUser,
  Heart,
  Home,
  Menu,
  MessageSquare,
  Package,
  Search,
  History,
  Shield,
  Settings,
  LogIn,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/listings", label: "Browse", icon: Search },
];

const authenticatedNavItems = [
    ...navItems,
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/messages", label: "Messages", icon: MessageSquare },
]

export function Header() {
  const pathname = usePathname();
  const { user, profile, loading } = useUser();
  const auth = useAuth();
  
  const currentNavItems = user ? authenticatedNavItems : navItems;

  // Do not render header on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    signOut(auth);
  }

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Logo />
        </Link>
        {currentNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Logo />
            </Link>
            {currentNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-2.5 transition-colors hover:text-foreground",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        {user && (
            <Link href="/sell" passHref>
                <Button className="hidden sm:inline-flex">Sell Now</Button>
            </Link>
        )}
        {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
        ) : user && profile ? (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                    <AvatarImage src={profile.avatar!} alt={profile.name!} />
                    <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{profile.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.uid}`} className="w-full flex items-center"><CircleUser className="mr-2"/>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/my-listings" className="w-full flex items-center"><Package className="mr-2"/>My Listings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/recently-viewed" className="w-full flex items-center"><History className="mr-2"/>Recently Viewed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full flex items-center"><Settings className="mr-2"/>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* This would be conditional for admin role */}
                <DropdownMenuItem asChild>
                    <Link href="/admin" className="w-full flex items-center"><Shield className="mr-2"/>Admin Panel</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2"/>Logout</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            <Link href="/login" passHref>
                <Button variant="outline"><LogIn className="mr-2"/>Login</Button>
            </Link>
        )}
      </div>
    </header>
  );
}
