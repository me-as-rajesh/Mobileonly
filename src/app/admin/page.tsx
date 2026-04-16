import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Package, ShieldAlert, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const kpis = [
    { title: "Total Users", value: "1,254", icon: Users, description: "+20.1% from last month" },
    { title: "Active Listings", value: "876", icon: Package, description: "+180.1% from last month" },
    { title: "Pending Reports", value: "12", icon: ShieldAlert, description: "+5 since last hour" },
    { title: "Revenue", value: "₹ 5,43,210", icon: DollarSign, description: "+12.5% from last month" },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold font-headline mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
          <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
          </CardContent>
          </Card>
      ))}
      </div>
      <div className="mt-6">
        {/* Placeholder for recent activity or charts */}
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of recent admin actions and important events.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-12">
                    <p>Activity Log Coming Soon</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
