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
import { MoreHorizontal, Check, X } from "lucide-react";
import Link from "next/link";

const reports = [
    { id: 'rep-1', targetType: 'listing', targetId: '3', reason: 'scam', reporter: 'Samantha B.', status: 'pending', createdAt: '2024-07-20T10:00:00Z' },
    { id: 'rep-2', targetType: 'user', targetId: 'seller-3', reason: 'inappropriate', reporter: 'Alex R.', status: 'pending', createdAt: '2024-07-19T15:00:00Z' },
    { id: 'rep-3', targetType: 'listing', targetId: '8', reason: 'wrong_price', reporter: 'Samantha B.', status: 'resolved', createdAt: '2024-07-18T12:00:00Z' },
];

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Manage Reports</h1>
       <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                    <Link href={report.targetType === 'listing' ? `/listings/${report.targetId}` : `/profile/${report.targetId}`} className="underline font-medium hover:text-primary">
                        {report.targetType === 'listing' ? `Listing ID: ${report.targetId}` : `User ID: ${report.targetId}`}
                    </Link>
                </TableCell>
                <TableCell className="capitalize">{report.reason.replace('_', ' ')}</TableCell>
                <TableCell>{report.reporter}</TableCell>
                <TableCell>
                  <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" disabled={report.status !== 'pending'}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                       <DropdownMenuItem><Check className="mr-2"/> Resolve Report</DropdownMenuItem>
                      <DropdownMenuItem><X className="mr-2"/> Dismiss Report</DropdownMenuItem>
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
