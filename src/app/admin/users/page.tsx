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
import { MoreHorizontal, UserX, UserCheck } from "lucide-react";
import Link from "next/link";

const users = [
  { id: 'seller-1', name: 'Alex R.', email: 'alex@example.com', role: 'seller', status: 'Active', isVerified: true, joined: '2023-01-15' },
  { id: 'seller-2', name: 'Samantha B.', email: 'samantha@example.com', role: 'buyer', status: 'Active', isVerified: true, joined: '2023-02-20' },
  { id: 'seller-3', name: 'TechDeals', email: 'techdeals@example.com', role: 'seller', status: 'Blocked', isVerified: false, joined: '2023-03-10' },
  { id: 'user-4', name: 'New User', email: 'new@example.com', role: 'buyer', status: 'Active', isVerified: false, joined: '2024-07-21' },
];

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Manage Users</h1>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <Link href={`/profile/${user.id}`} className="hover:underline">{user.name}</Link>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                    {user.isVerified ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>}
                </TableCell>
                <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
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
                      <DropdownMenuItem><UserCheck className="mr-2"/> Verify User</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive"><UserX className="mr-2"/> Block User</DropdownMenuItem>
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
