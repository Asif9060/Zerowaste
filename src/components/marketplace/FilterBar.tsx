"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, SlidersHorizontal, X, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PRODUCE_CATEGORIES } from "@/types";
import type { ListingFilters, ProduceCategory, Urgency, Country } from "@/types";
import { ALL_LOCATIONS } from "@/lib/mock-data/locations";
import { useLocationStore } from "@/store/location.store";

const URGENCY_OPTIONS: { value: Urgency | "all"; label: string }[] = [
  { value: "all", label: "All urgencies" },
  { value: "critical", label: "🔴 Critical — Today" },
  { value: "high", label: "🟠 High — 2–3 days" },
  { value: "medium", label: "🟡 Medium — 1 week" },
  { value: "low", label: "🟢 Low — 2+ weeks" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "urgency", label: "Most urgent" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

interface FilterBarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  total: number;
}

export function FilterBar({ filters, onChange, total }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { detectedLocation, isDetecting, detectLocation } = useLocationStore();

  const update = useCallback(
    (patch: Partial<ListingFilters>) => onChange({ ...filters, ...patch }),
    [filters, onChange]
  );

  // When location is freshly detected, apply it to filters
  useEffect(() => {
    if (detectedLocation && !filters.province) {
      onChange({
        ...filters,
        country: detectedLocation.country,
        province: detectedLocation.province,
        city: detectedLocation.city,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectedLocation]);

  // Count active (non-default) filters
  const activeFilterCount = [
    filters.category && filters.category !== "all",
    filters.urgency && filters.urgency !== "all",
    filters.country && filters.country !== "all",
    !!filters.province,
    !!filters.city,
  ].filter(Boolean).length;

  const clearAll = () =>
    onChange({ search: filters.search, sortBy: filters.sortBy });

  // Provinces for the selected country
  const countryKey =
    filters.country && filters.country !== "all"
      ? (filters.country as Country)
      : null;
  const provinces = countryKey ? Object.keys(ALL_LOCATIONS[countryKey]) : [];

  // Cities for the selected province
  const cities =
    countryKey && filters.province
      ? ALL_LOCATIONS[countryKey][filters.province] ?? []
      : [];

  return (
    <div className="space-y-3">
      {/* Search + sort + location row */}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search ?? ""}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search produce, farmer, or city…"
            className="pl-9"
          />
          {filters.search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => update({ search: "" })}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Near Me button */}
        <Button
          variant="outline"
          size="sm"
          onClick={detectLocation}
          disabled={isDetecting}
          className="shrink-0 gap-1.5 h-10 px-3"
          aria-label="Use my location"
          title="Filter by your current location"
        >
          {isDetecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 text-primary" />
          )}
          <span className="hidden sm:inline text-sm">
            {isDetecting ? "Detecting…" : "Near Me"}
          </span>
        </Button>

        <Select
          value={filters.sortBy ?? "newest"}
          onValueChange={(v) =>
            update({ sortBy: v as ListingFilters["sortBy"] })
          }
        >
          <SelectTrigger className="w-44 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative shrink-0"
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-white border-0">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Expandable filter panel */}
      {showFilters && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          {/* Row 1: Category, Urgency, Country */}
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Category
              </label>
              <Select
                value={filters.category ?? "all"}
                onValueChange={(v) =>
                  update({ category: v as ProduceCategory | "all" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {PRODUCE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Urgency */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Urgency
              </label>
              <Select
                value={filters.urgency ?? "all"}
                onValueChange={(v) =>
                  update({ urgency: v as Urgency | "all" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All urgencies" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Country
              </label>
              <Select
                value={filters.country ?? "all"}
                onValueChange={(v) =>
                  update({
                    country: v as Country | "all",
                    province: undefined,
                    city: undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
                  <SelectItem value="ZW">🇿🇼 Zimbabwe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Province + City (shown when country is selected) */}
          {provinces.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Province */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Province / Region
                </label>
                <Select
                  value={filters.province ?? "all"}
                  onValueChange={(v) =>
                    update({
                      province: v == null || v === "all" ? undefined : v,
                      city: undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All provinces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All provinces</SelectItem>
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              {cities.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    City / Town
                  </label>
                  <Select
                    value={filters.city ?? "all"}
                    onValueChange={(v) =>
                      update({ city: v === "all" ? undefined : (v ?? undefined) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All cities</SelectItem>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {activeFilterCount > 0 && (
            <>
              <Separator />
              <button
                onClick={clearAll}
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
              >
                Clear all filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{total}</span>{" "}
        listing{total !== 1 ? "s" : ""} found
        {filters.city && (
          <span className="ml-1">
            in{" "}
            <span className="font-medium text-foreground">{filters.city}</span>
          </span>
        )}
        {!filters.city && filters.province && (
          <span className="ml-1">
            in{" "}
            <span className="font-medium text-foreground">
              {filters.province}
            </span>
          </span>
        )}
      </p>
    </div>
  );
}
