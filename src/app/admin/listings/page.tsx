"use client";

import { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminListings, approveListing, removeListing } from "@/lib/services/admin.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { UrgencyBadge } from "@/components/marketplace/UrgencyBadge";
import type { Listing } from "@/types";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  sold: "bg-blue-100 text-blue-700",
  expired: "bg-red-100 text-red-700",
  pending_review: "bg-amber-100 text-amber-700",
  removed: "bg-stone-100 text-stone-600",
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    getAdminListings().then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (l: Listing) => {
    setBusy(l.id);
    await approveListing(l.id);
    setListings((prev) => prev.map((x) => x.id === l.id ? { ...x, status: "active" } : x));
    setBusy(null);
    toast.success("Listing approved.");
  };

  const handleRemove = async (l: Listing) => {
    setBusy(l.id);
    await removeListing(l.id);
    setListings((prev) => prev.map((x) => x.id === l.id ? { ...x, status: "removed" } : x));
    setBusy(null);
    toast.success("Listing removed.");
  };

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.farmerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Listings</h1>
        <p className="text-muted-foreground mt-1">Review and moderate produce listings.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search listings or farmers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <CardTitle className="text-sm text-muted-foreground ml-auto">
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 text-left">Listing</th>
                    <th className="px-3 py-3 text-left hidden sm:table-cell">Farmer</th>
                    <th className="px-3 py-3 text-left">Price</th>
                    <th className="px-3 py-3 text-left hidden md:table-cell">Urgency</th>
                    <th className="px-3 py-3 text-left">Status</th>
                    <th className="px-3 py-3 text-left hidden lg:table-cell">Created</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((l) => (
                    <tr key={l.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground line-clamp-1 max-w-xs">{l.title}</p>
                        <p className="text-xs text-muted-foreground">{l.location.city}, {l.location.country}</p>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell text-muted-foreground">{l.farmerName}</td>
                      <td className="px-3 py-3 font-semibold text-primary">
                        {formatCurrency(l.price, l.currency)}
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <UrgencyBadge urgency={l.urgency} />
                      </td>
                      <td className="px-3 py-3">
                        <Badge className={`capitalize text-xs border-0 ${STATUS_COLORS[l.status]}`}>
                          {l.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground">
                        {formatDate(l.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        {l.status === "pending_review" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            disabled={busy === l.id}
                            onClick={() => handleApprove(l)}
                          >
                            <CheckCircle className="h-3 w-3 text-green-600" />Approve
                          </Button>
                        )}
                        {l.status !== "removed" && l.status !== "sold" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs gap-1 text-destructive hover:text-destructive ml-1"
                            disabled={busy === l.id}
                            onClick={() => handleRemove(l)}
                          >
                            <XCircle className="h-3 w-3" />Remove
                          </Button>
                        )}
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
