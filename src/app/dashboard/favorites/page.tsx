"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { useAuthStore } from "@/store/auth.store";
import { getListingById } from "@/lib/services/listings.service";
import type { Listing } from "@/types";

// Mock: fixed favourite listing IDs per user (no persistence layer yet)
const MOCK_FAVOURITES: Record<string, string[]> = {
  default: ["listing-3", "listing-7", "listing-12", "listing-18"],
};

export default function FavouritesPage() {
  const { user } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    const ids = MOCK_FAVOURITES[user?.id ?? "default"] ?? MOCK_FAVOURITES.default;
    setSaved(new Set(ids));
    Promise.all(ids.map((id) => getListingById(id))).then((results) => {
      setListings(results.filter(Boolean) as Listing[]);
      setLoading(false);
    });
  }, [user]);

  const handleUnsave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved Listings</h1>
        <p className="text-muted-foreground mt-1">Produce you&apos;ve bookmarked for easy access.</p>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="py-20 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No saved listings yet.</p>
          <Link href="/marketplace" className="mt-3 inline-block">
            <Button size="sm" variant="outline">Browse marketplace</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <div key={l.id} className="relative group">
              <ListingCard listing={l} />
              <button
                onClick={() => handleUnsave(l.id)}
                className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 shadow hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove from saved"
              >
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
