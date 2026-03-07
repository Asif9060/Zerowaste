"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth.store";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data/transactions";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async fetch
    const timer = setTimeout(() => {
      const filtered = MOCK_TRANSACTIONS.filter((t) => t.buyerId === user?.id);
      setOrders(filtered);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-1">Your purchase history and enquiries.</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{orders.length} order{orders.length !== 1 ? "s" : ""}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No orders yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Contact farmers via WhatsApp to start buying.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 text-left">Listing</th>
                    <th className="px-3 py-3 text-left hidden sm:table-cell">Farmer</th>
                    <th className="px-3 py-3 text-left">Amount</th>
                    <th className="px-3 py-3 text-left">Status</th>
                    <th className="px-3 py-3 text-left hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground line-clamp-1 max-w-xs">
                          {o.listingTitle}
                        </p>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell text-muted-foreground">
                        {o.farmerName}
                      </td>
                      <td className="px-3 py-3 font-semibold text-primary">
                        {formatCurrency(o.amount, o.currency)}
                      </td>
                      <td className="px-3 py-3">
                        <Badge className={`capitalize text-xs border-0 ${STATUS_COLORS[o.status]}`}>
                          {o.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell text-muted-foreground">
                        {formatDate(o.createdAt)}
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
