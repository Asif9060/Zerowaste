"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, type ListingFormData } from "@/lib/validators/listing.schema";
import { PRODUCE_CATEGORIES } from "@/types";
import { SA_LOCATIONS, ZW_LOCATIONS } from "@/lib/mock-data/locations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UNITS = ["kg", "g", "ton", "crate", "bag", "dozen", "head", "litre"] as const;
const URGENCIES = ["low", "medium", "high", "critical"] as const;

interface ListingFormProps {
  defaultValues?: Partial<ListingFormData>;
  onSubmit: (data: ListingFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ListingForm({ defaultValues, onSubmit, isSubmitting }: ListingFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      quantity: 0,
      price: 0,
      currency: "ZAR",
      urgency: "medium",
      location: { country: "ZA", province: "", city: "" },
      photos: [],
      ...defaultValues,
    },
  });

  const selectedCountry = watch("location.country");
  const selectedProvince = watch("location.province");

  const locationData = selectedCountry === "ZA" ? SA_LOCATIONS : ZW_LOCATIONS;
  const provinces = Object.keys(locationData);
  const cities: string[] = selectedProvince ? (locationData[selectedProvince] ?? []) : [];

  // Reset province/city when country changes
  useEffect(() => {
    setValue("location.province", "");
    setValue("location.city", "");
  }, [selectedCountry, setValue]);

  // Reset city when province changes
  useEffect(() => {
    setValue("location.city", "");
  }, [selectedProvince, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Listing title *</Label>
        <Input id="title" placeholder="e.g. Fresh Mielies – Western Cape Farm" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label>Category *</Label>
        <Select
          defaultValue={defaultValues?.category}
            onValueChange={(v) => { if (v) setValue("category", v as ListingFormData["category"]); }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCE_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="Describe your produce, quality, harvest date, etc."
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      {/* Quantity + Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min={0}
            step="any"
            {...register("quantity", { valueAsNumber: true })}
          />
          {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Unit *</Label>
          <Select
            defaultValue={defaultValues?.unit}
            onValueChange={(v) => { if (v) setValue("unit", v as ListingFormData["unit"]); }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u} className="capitalize">{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unit && <p className="text-xs text-destructive">{errors.unit.message}</p>}
        </div>
      </div>

      {/* Price + Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Price per unit *</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="any"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Currency *</Label>
          <Select
            defaultValue={defaultValues?.currency ?? "ZAR"}
            onValueChange={(v) => { if (v) setValue("currency", v as "ZAR" | "USD"); }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
            </SelectContent>
          </Select>
          {errors.currency && <p className="text-xs text-destructive">{errors.currency.message}</p>}
        </div>
      </div>

      {/* Urgency */}
      <div className="space-y-1.5">
        <Label>Urgency *</Label>
        <Select
          defaultValue={defaultValues?.urgency ?? "medium"}
            onValueChange={(v) => { if (v) setValue("urgency", v as ListingFormData["urgency"]); }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {URGENCIES.map((u) => (
              <SelectItem key={u} value={u} className="capitalize">{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.urgency && <p className="text-xs text-destructive">{errors.urgency.message}</p>}
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <Label>Location *</Label>
        <div className="grid grid-cols-3 gap-3">
          {/* Country */}
          <Select
            defaultValue={defaultValues?.location?.country ?? "ZA"}
            onValueChange={(v) => setValue("location.country", (v ?? "ZA") as "ZA" | "ZW")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
              <SelectItem value="ZW">🇿🇼 Zimbabwe</SelectItem>
            </SelectContent>
          </Select>

          {/* Province */}
          <Select
            value={selectedProvince}
            onValueChange={(v) => setValue("location.province", v ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* City */}
          <Select
            value={watch("location.city")}
            onValueChange={(v) => setValue("location.city", v ?? "")}
            disabled={!selectedProvince}
          >
            <SelectTrigger>
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(errors.location?.country || errors.location?.province || errors.location?.city) && (
          <p className="text-xs text-destructive">Please select country, province and city.</p>
        )}
      </div>

      {/* Expiry date */}
      <div className="space-y-1.5">
        <Label htmlFor="expiresAt">Expiry date *</Label>
        <Input
          id="expiresAt"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          {...register("expiresAt")}
        />
        {errors.expiresAt && <p className="text-xs text-destructive">{errors.expiresAt.message}</p>}
      </div>

      {/* Photos */}
      <div className="space-y-1.5">
        <ImageUpload
          label="Photos (optional · up to 5)"
          value={watch("photos") ?? []}
          onChange={(urls) => setValue("photos", urls, { shouldValidate: true })}
          maxFiles={5}
          folder="listings"
        />
        {errors.photos && <p className="text-xs text-destructive">{errors.photos.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save listing"}
      </Button>
    </form>
  );
}
