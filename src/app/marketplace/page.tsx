"use client";

import { useState, useEffect, useRef } from "react";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { FilterBar } from "@/components/marketplace/FilterBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getListings } from "@/lib/services/listings.service";
import type { Listing, ListingFilters, Country } from "@/types";
import { Package, MapPin, Loader2, X } from "lucide-react";
import { useLocationStore } from "@/store/location.store";
import { ALL_LOCATIONS } from "@/lib/mock-data/locations";

const CARD_SKELETON = Array.from({ length: 6 });

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ListingFilters>({ sortBy: "urgency", status: "active" });

  const {
    detectedLocation,
    isDetecting,
    permissionDenied,
    detectionFailed,
    rawDetectedCountry,
    detectLocation,
    setLocation,
    clearLocation,
  } = useLocationStore();

  // Manual location picker state (shown when GPS detection fails)
  const [manualCountry, setManualCountry] = useState<Country>("ZA");
  const [manualProvince, setManualProvince] = useState("");
  const [manualCity, setManualCity] = useState("");

  const manualProvinces = Object.keys(ALL_LOCATIONS[manualCountry] ?? {});
  const manualCities = manualProvince ? (ALL_LOCATIONS[manualCountry]?.[manualProvince] ?? []) : [];

  // Track whether we've already auto-applied the detected location for this session
  const locationApplied = useRef(false);

  // Auto-apply detected location to filters once
  useEffect(() => {
    if (detectedLocation && !locationApplied.current && !filters.province) {
      locationApplied.current = true;
      setFilters((prev) => ({
        ...prev,
        country: detectedLocation.country,
        province: detectedLocation.province,
        city: detectedLocation.city,
      }));
    }
  }, [detectedLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoading(true);
    getListings({ ...filters, status: "active" }).then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, [filters]);

  const handleClearLocation = () => {
    clearLocation();
    locationApplied.current = false;
    setFilters((prev) => ({
      ...prev,
      country: undefined,
      province: undefined,
      city: undefined,
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
        <p className="mt-1 text-muted-foreground">
          Browse fresh surplus from farms across South Africa and Zimbabwe.
        </p>
      </div>

      {/* Location banner */}
      {isDetecting && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          <span>Detecting your location…</span>
        </div>
      )}

      {!isDetecting && detectedLocation && filters.province && (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>
              Showing products near{" "}
              <span className="font-semibold">
                {detectedLocation.city}, {detectedLocation.province}
              </span>
            </span>
          </div>
          <button
            onClick={handleClearLocation}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear location filter"
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      )}

      {!isDetecting && !detectedLocation && !detectionFailed && !permissionDenied && (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>Personalise results with your location</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={detectLocation}
            disabled={isDetecting}
            className="gap-1.5 shrink-0"
          >
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Allow location
          </Button>
        </div>
      )}

      {!isDetecting && !detectedLocation && permissionDenied && (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>Location blocked — enable it in browser settings, then retry</span>
          </div>
          <Button variant="outline" size="sm" onClick={detectLocation} disabled={isDetecting} className="gap-1.5 shrink-0">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Retry
          </Button>
        </div>
      )}

      {!isDetecting && !detectedLocation && detectionFailed && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {rawDetectedCountry && !["ZA", "ZW"].includes(rawDetectedCountry.toUpperCase())
                ? `GPS placed you in ${rawDetectedCountry.toUpperCase()} — set your location manually:`
                : "Could not detect your location — set it manually:"}
            </p>
            <Button variant="ghost" size="sm" onClick={detectLocation} className="gap-1.5 shrink-0 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900">
              <Loader2 className="h-3.5 w-3.5" />
              Try GPS
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 items-end">
            <Select
              value={manualCountry}
              onValueChange={(v) => { setManualCountry(v as Country); setManualProvince(""); setManualCity(""); }}
            >
              <SelectTrigger className="w-44 bg-white dark:bg-background">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
                <SelectItem value="ZW">🇿🇼 Zimbabwe</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={manualProvince || ""}
              onValueChange={(v) => { setManualProvince(v ?? ""); setManualCity(""); }}
              disabled={!manualCountry}
            >
              <SelectTrigger className="w-52 bg-white dark:bg-background">
                <SelectValue placeholder="Province / Division" />
              </SelectTrigger>
              <SelectContent>
                {manualProvinces.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={manualCity || ""}
              onValueChange={(v) => setManualCity(v ?? "")}
              disabled={!manualProvince}
            >
              <SelectTrigger className="w-44 bg-white dark:bg-background">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                {manualCities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={!manualCountry || !manualProvince || !manualCity}
              onClick={() => setLocation({ country: manualCountry, province: manualProvince, city: manualCity })}
            >
              Use This Location
            </Button>
          </div>
        </div>
      )}

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
            {filters.province
              ? `No active listings in ${filters.city ?? filters.province} right now.`
              : "Try adjusting your filters or search terms."}
          </p>
          {filters.province && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleClearLocation}
            >
              Browse all listings
            </Button>
          )}
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
