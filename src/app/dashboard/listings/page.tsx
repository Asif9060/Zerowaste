"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/auth.store";
import { getListingsByFarmer, deleteListing } from "@/lib/services/listings.service";
import { formatCurrency, formatDate, getDaysUntilExpiry } from "@/lib/utils";
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

export default function MyListingsPage() {
  const { user } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    getListingsByFarmer(user.id).then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, [user]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteListing(deleteTarget.id);
    setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleting(false);
    toast.success("Listing deleted.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-muted-foreground mt-1">Manage your surplus produce listings.</p>
        </div>
        <Link href="/dashboard/listings/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Post New
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{listings.length} listing{listings.length !== 1 ? "s" : ""}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : listings.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-muted-foreground">No listings yet.</p>
              <Link href="/dashboard/listings/new" className="mt-3 inline-block">
                <Button size="sm">Post your first listing</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 text-left">Listing</th>
                    <th className="px-3 py-3 text-left hidden sm:table-cell">Category</th>
                    <th className="px-3 py-3 text-left">Price</th>
                    <th className="px-3 py-3 text-left hidden md:table-cell">Urgency</th>
                    <th className="px-3 py-3 text-left">Status</th>
                    <th className="px-3 py-3 text-left hidden lg:table-cell">Expires</th>
                    <th className="px-3 py-3 text-left hidden lg:table-cell">Views</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {listings.map((l) => {
                    const daysLeft = getDaysUntilExpiry(l.expiresAt);
                    return (
                      <tr key={l.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-foreground line-clamp-1 max-w-xs">{l.title}</p>
                          <p className="text-xs text-muted-foreground">{l.quantity} {l.unit}</p>
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell">
                          <span className="capitalize text-muted-foreground">{l.category}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-semibold text-primary">
                            {formatCurrency(l.price, l.currency)}
                          </span>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <UrgencyBadge urgency={l.urgency} />
                        </td>
                        <td className="px-3 py-3">
                          <Badge className={`capitalize text-xs border-0 ${STATUS_COLORS[l.status]}`}>
                            {l.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 hidden lg:table-cell">
                          <span className={daysLeft <= 1 ? "text-red-600 font-semibold" : "text-muted-foreground"}>
                            {daysLeft <= 0 ? "Today" : `${daysLeft}d`}
                          </span>
                        </td>
                        <td className="px-3 py-3 hidden lg:table-cell">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" />{l.views}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <Link href={`/dashboard/listings/${l.id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(l)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete listing?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
