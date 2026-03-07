"use client";

import { useEffect, useState } from "react";
import { Users, Package, ShieldCheck, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminStats } from "@/lib/services/admin.service";
import { formatCurrency } from "@/lib/utils";
import type { AdminStats } from "@/types";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  highlight?: boolean;
}

function StatCard({ label, value, icon: Icon, sub, highlight }: StatCardProps) {
  return (
    <Card className={highlight ? "border-primary/30 bg-primary/5" : ""}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`rounded-xl p-2.5 ${highlight ? "bg-primary/15" : "bg-muted"}`}>
            <Icon className={`h-5 w-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">ZeroWaste Farm platform overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} sub={`${stats.totalFarmers} farmers · ${stats.totalBuyers} buyers`} />
        <StatCard label="Active Listings" value={stats.activeListings} icon={Package} sub={`${stats.listingsThisMonth} added this month`} />
        <StatCard label="Transactions" value={stats.totalTransactions} icon={TrendingUp} />
        <StatCard label="Commission Revenue" value={formatCurrency(stats.totalCommissionRevenue, "ZAR")} icon={DollarSign} highlight />
        <StatCard label="Pending Verifications" value={stats.pendingVerifications} icon={ShieldCheck} sub="Users awaiting review" />
        <StatCard label="Listings This Month" value={stats.listingsThisMonth} icon={Clock} />
      </div>
    </div>
  );
}
