"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Eye, ShoppingBag, TrendingUp, ListChecks, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth.store";
import { getListingsByFarmer, getListings } from "@/lib/services/listings.service";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { UrgencyBadge } from "@/components/marketplace/UrgencyBadge";
import type { Listing } from "@/types";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [marketListings, setMarketListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user.role === "farmer") {
      getListingsByFarmer(user.id).then((data) => {
        setListings(data);
        setLoading(false);
      });
    } else {
      // Buyer dashboard: show recent market listings
      getListings({ sortBy: "urgency", status: "active" }).then((data) => {
        setMarketListings(data.slice(0, 6));
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) return null;

  // ── Farmer dashboard ──────────────────────────────────────────
  if (user.role === "farmer") {
    const active = listings.filter((l) => l.status === "active");
    const sold = listings.filter((l) => l.status === "sold");
    const totalViews = listings.reduce((sum, l) => sum + l.views, 0);

    const STATS = [
      { label: "Active Listings", value: active.length, icon: ListChecks, color: "text-primary" },
      { label: "Total Views", value: totalViews, icon: Eye, color: "text-blue-600" },
      { label: "Sold", value: sold.length, icon: ShoppingBag, color: "text-green-600" },
      { label: "All Listings", value: listings.length, icon: TrendingUp, color: "text-amber-600" },
    ];

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Good morning, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here&apos;s how your listings are doing today.</p>
          </div>
          <Link href="/dashboard/listings/new">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Post Listing
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) =>
            loading ? (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ) : (
              <Card key={stat.label}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="rounded-xl bg-muted p-2.5">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>

        {/* Recent listings */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent Listings</CardTitle>
            <Link href="/dashboard/listings">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : listings.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground text-sm">No listings yet.</p>
                <Link href="/dashboard/listings/new" className="mt-3 inline-block">
                  <Button size="sm">Post your first listing</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {listings.slice(0, 5).map((l) => (
                  <div key={l.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(l.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <UrgencyBadge urgency={l.urgency} />
                      <Badge
                        variant={l.status === "active" ? "default" : "secondary"}
                        className="capitalize text-xs"
                      >
                        {l.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" />{l.views}
                      </span>
                      <span className="font-semibold text-xs text-primary">
                        {formatCurrency(l.price, l.currency)}/{l.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Buyer dashboard ──────────────────────────────────────────
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Fresh surplus produce is ready for you.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Browse Marketplace", icon: ListChecks, href: "/marketplace", desc: "See all active listings" },
          { label: "Saved Listings", icon: Eye, href: "/dashboard/favorites", desc: "Your bookmarked produce" },
          { label: "My Orders", icon: ShoppingBag, href: "/dashboard/orders", desc: "Track your purchases" },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent market listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Urgent Deals Near You</h2>
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {marketListings.slice(0, 6).map((l) => (
              <Link key={l.id} href={`/marketplace/${l.id}`}>
                <Card className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground line-clamp-1">{l.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{l.location.city}, {l.location.province}</p>
                      </div>
                      <UrgencyBadge urgency={l.urgency} />
                    </div>
                    <p className="mt-2 font-bold text-primary">
                      {formatCurrency(l.price, l.currency)}<span className="text-xs font-normal text-muted-foreground">/{l.unit}</span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
