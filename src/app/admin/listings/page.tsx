import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, ShieldCheck } from "lucide-react";
import { listings } from "@/lib/data";
import Link from "next/link";
import { ClientDate } from "@/components/client-date";

export default function AdminListingsPage() {
    const allListings = [...listings];
    allListings[2] = { ...allListings[2], status: 'flagged' };

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Manage Listings</h1>
       <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted On</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allListings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">
                    <Link href={`/listings/${listing.id}`} className="hover:underline">{listing.title}</Link>
                </TableCell>
                <TableCell>{listing.seller.name}</TableCell>
                <TableCell>₹{listing.price.toLocaleString('en-IN')}</TableCell>
                <TableCell>
                  <Badge variant={listing.status === 'active' ? 'secondary' : listing.status === 'flagged' ? 'destructive' : 'outline'}>
                    {listing.status || 'active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ClientDate date={listing.createdAt} options={{ day: 'numeric', month: 'short', year: 'numeric'}} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                       <DropdownMenuItem><ShieldCheck className="mr-2"/> Unflag Listing</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2"/> Remove Listing</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
