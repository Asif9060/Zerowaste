"use client";

import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PRODUCE_CATEGORIES } from "@/types";
import type { ListingFilters, ProduceCategory, Urgency, Country } from "@/types";

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

  const update = useCallback(
    (patch: Partial<ListingFilters>) => onChange({ ...filters, ...patch }),
    [filters, onChange]
  );

  const activeFilterCount = [
    filters.category && filters.category !== "all",
    filters.urgency && filters.urgency !== "all",
    filters.country && filters.country !== "all",
  ].filter(Boolean).length;

  const clearAll = () =>
    onChange({ search: filters.search, sortBy: filters.sortBy });

  return (
    <div className="space-y-3">
      {/* Search + sort row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
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
        <Select
          value={filters.sortBy ?? "newest"}
          onValueChange={(v) => update({ sortBy: v as ListingFilters["sortBy"] })}
        >
          <SelectTrigger className="w-44 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
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
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Category
              </label>
              <Select
                value={filters.category ?? "all"}
                onValueChange={(v) => update({ category: v as ProduceCategory | "all" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {PRODUCE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
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
                onValueChange={(v) => update({ urgency: v as Urgency | "all" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All urgencies" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
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
                onValueChange={(v) => update({ country: v as Country | "all" })}
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
        <span className="font-semibold text-foreground">{total}</span> listing{total !== 1 ? "s" : ""} found
      </p>
    </div>
  );
}
