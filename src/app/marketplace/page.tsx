"use client";

import { useState, useEffect } from "react";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { FilterBar } from "@/components/marketplace/FilterBar";
import { Skeleton } from "@/components/ui/skeleton";
import { getListings } from "@/lib/services/listings.service";
import type { Listing, ListingFilters } from "@/types";
import { Package } from "lucide-react";

const CARD_SKELETON = Array.from({ length: 6 });

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ListingFilters>({ sortBy: "urgency", status: "active" });

  useEffect(() => {
    setLoading(true);
    getListings({ ...filters, status: "active" }).then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
        <p className="mt-1 text-muted-foreground">
          Browse fresh surplus from farms across South Africa and Zimbabwe.
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-8">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          total={listings.length}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CARD_SKELETON.map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border">
              <Skeleton className="h-44 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No listings found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
