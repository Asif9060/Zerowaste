"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Eye, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UrgencyBadge } from "./UrgencyBadge";
import { formatCurrency, formatRelativeTime, getDaysUntilExpiry } from "@/lib/utils";
import type { Listing } from "@/types";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  isSaved?: boolean;
  onSave?: (id: string) => void;
}

export function ListingCard({ listing }: ListingCardProps) {
  const daysLeft = getDaysUntilExpiry(listing.expiresAt);
  const isExpiringSoon = daysLeft <= 1;

  return (
    <Link href={`/marketplace/${listing.id}`} className="group block">
      <Card className="overflow-hidden border-border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full">
        {/* Image */}
        <div className="relative h-44 bg-muted overflow-hidden">
          {listing.photos[0] ? (
            <Image
              src={listing.photos[0]}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          {/* Urgency badge overlay */}
          <div className="absolute top-2 left-2">
            <UrgencyBadge urgency={listing.urgency} />
          </div>
          {/* Country flag */}
          <div className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-stone-700 shadow-sm">
            {listing.location.country === "ZA" ? "🇿🇦 SA" : "🇿🇼 ZW"}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          {/* Location */}
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {listing.location.city}, {listing.location.province}
          </p>

          {/* Quantity */}
          <p className="mt-1 text-xs text-muted-foreground">
            {listing.quantity} {listing.unit} available
          </p>

          {/* Price + views */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-base font-bold text-primary">
              {formatCurrency(listing.price, listing.currency)}
              <span className="text-xs font-normal text-muted-foreground"> /{listing.unit}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              {listing.views}
            </span>
          </div>

          {/* Expiry warning */}
          {isExpiringSoon && (
            <p className="mt-2 text-xs font-medium text-red-600">
              ⚠ Expires {daysLeft <= 0 ? "today" : "tomorrow"}
            </p>
          )}

          {/* Farmer + time */}
          <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
            <span className="text-xs text-muted-foreground truncate">{listing.farmerName}</span>
            <span className="text-xs text-muted-foreground shrink-0 ml-2">
              {formatRelativeTime(listing.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
