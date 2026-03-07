"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminTransactions } from "@/lib/services/admin.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminCommissionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminTransactions().then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.commissionValue, 0);

  const completedCount = transactions.filter((t) => t.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commissions</h1>
        <p className="text-muted-foreground mt-1">Platform transaction and commission overview.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:max-w-md">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/15 p-2">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total earned</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(totalRevenue, "ZAR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted p-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-xl font-bold text-foreground">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{transactions.length} transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 text-left">Listing</th>
                    <th className="px-3 py-3 text-left hidden sm:table-cell">Farmer</th>
                    <th className="px-3 py-3 text-left hidden sm:table-cell">Buyer</th>
                    <th className="px-3 py-3 text-left">Amount</th>
                    <th className="px-3 py-3 text-left">Commission</th>
                    <th className="px-3 py-3 text-left">Status</th>
                    <th className="px-3 py-3 text-left hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground line-clamp-1 max-w-[200px]">
                          {t.listingTitle}
                        </p>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell text-muted-foreground">{t.farmerName}</td>
                      <td className="px-3 py-3 hidden sm:table-cell text-muted-foreground">{t.buyerName}</td>
                      <td className="px-3 py-3 font-semibold">
                        {formatCurrency(t.amount, t.currency)}
                      </td>
                      <td className="px-3 py-3 text-primary font-semibold">
                        {formatCurrency(t.commissionValue, t.currency)}
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                          ({t.commissionRate}%)
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <Badge className={`capitalize text-xs border-0 ${STATUS_COLORS[t.status]}`}>
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground">
                        {formatDate(t.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
