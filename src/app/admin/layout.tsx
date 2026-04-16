'use client'

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  Package,
  ShieldAlert,
  Users,
  Menu,
  CircleUser
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/listings", label: "Listings", icon: Package },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/reports", label: "Reports", icon: ShieldAlert },
]

function AdminMobileNav() {
    const pathname = usePathname();
    return (
        <Sheet>
            <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                    <Logo />
                </Link>
                {adminNavItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", {
                            "bg-muted text-foreground": pathname === item.href
                        })}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                         {item.label === 'Reports' && (
                            <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                6
                            </Badge>
                        )}
                    </Link>
                ))}
            </nav>
            </SheetContent>
        </Sheet>
    )
}

function AdminDesktopNav() {
    const pathname = usePathname();
    return (
        <div className="hidden border-r bg-background md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <Logo />
                    </Link>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {adminNavItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", {
                                    "bg-muted text-primary": pathname === item.href
                                })}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                                {item.label === 'Reports' && (
                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                        6
                                    </Badge>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <AdminDesktopNav />
        <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
                <AdminMobileNav />
                <div className="w-full flex-1">
                    {/* Can add a search bar here if needed */}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
                {children}
            </main>
        </div>
    </div>
  );
}
