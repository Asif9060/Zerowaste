"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { getListings } from "@/lib/services/listings.service";
import { useLocationStore } from "@/store/location.store";
import type { Listing } from "@/types";

const SKELETON_COUNT = 3;

export function NearYouSection() {
  const { detectedLocation, isDetecting, detectLocation } = useLocationStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!detectedLocation) {
      setListings([]);
      return;
    }

    setLoading(true);
    getListings({
      country: detectedLocation.country,
      province: detectedLocation.province,
      status: "active",
      sortBy: "urgency",
    }).then((data) => {
      setListings(data.slice(0, 6));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [detectedLocation]);

  // Don't render if detecting or if no location and already denied
  if (!detectedLocation && !isDetecting) {
    return (
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Discover Produce Near You
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                Allow location access to see fresh listings from farms in your
                province — sorted by urgency so the best deals float to the top.
              </p>
            </div>
            <Button
              onClick={detectLocation}
              disabled={isDetecting}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              {isDetecting ? "Detecting…" : "Show listings near me"}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (isDetecting || loading) {
    return (
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
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
        </div>
      </section>
    );
  }

  if (!detectedLocation) return null;

  const viewAllHref = `/marketplace?country=${detectedLocation.country}&province=${encodeURIComponent(detectedLocation.province)}`;

  return (
    <section className="py-20 bg-muted/30 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Near You in {detectedLocation.province}
              </h2>
            </div>
            <p className="mt-1 text-muted-foreground">
              Fresh surplus from farms in your area
            </p>
          </div>
          <Link href={viewAllHref}>
            <Button variant="ghost" className="gap-1 text-primary">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              No active listings in {detectedLocation.province} right now.
            </p>
            <Link href="/marketplace" className="mt-4">
              <Button variant="outline" size="sm">
                Browse all listings
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            {listings.length >= 6 && (
              <div className="mt-8 text-center">
                <Link href={viewAllHref}>
                  <Button variant="outline" className="px-10">
                    See more in {detectedLocation.province}
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
