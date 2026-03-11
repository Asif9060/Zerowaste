"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth.store";
import { updateUser } from "@/lib/services/users.service";
import { SA_LOCATIONS, ZW_LOCATIONS, ALL_LOCATIONS } from "@/lib/mock-data/locations";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  bio: z.string().max(300, "Bio must be 300 characters or fewer").optional(),
  country: z.enum(["ZA", "ZW"]),
  province: z.string().min(1, "Please select a province"),
  city: z.string().min(1, "Please select a city"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser: updateStoreUser } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      bio: user?.bio ?? "",
      country: (user?.location.country ?? "ZA") as "ZA" | "ZW",
      province: user?.location.province ?? "",
      city: user?.location.city ?? "",
    },
  });

  const selectedCountry = watch("country");
  const selectedProvince = watch("province");

  const locationData = ALL_LOCATIONS[selectedCountry] ?? {};
  const provinces = Object.keys(locationData);
  const cities: string[] = selectedProvince ? (locationData[selectedProvince] ?? []) : [];

  // When country changes reset province/city
  const handleCountryChange = (v: string | null) => {
    if (!v) return;
    setValue("country", v as "ZA" | "ZW", { shouldDirty: true });
    setValue("province", "", { shouldDirty: true });
    setValue("city", "", { shouldDirty: true });
  };

  const handleProvinceChange = (v: string | null) => {
    setValue("province", v ?? "", { shouldDirty: true });
    setValue("city", "", { shouldDirty: true });
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await updateUser(user.id, {
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        location: { country: data.country, province: data.province, city: data.city },
      });
      updateStoreUser(updated);
      reset(data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePhotoUpload = async (urls: string[]) => {
    if (!user || !urls[0]) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePhoto: urls[0] }),
      });
      if (!res.ok) throw new Error("Failed to update photo");
      const updated = await res.json();
      updateStoreUser(updated);
      toast.success("Profile photo updated!");
    } catch {
      toast.error("Failed to update profile photo.");
    }
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Update your account details.</p>
      </div>

      {/* Avatar card */}
      <Card>
        <CardContent className="pt-6 flex items-start gap-5">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarImage src={user.profilePhoto} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
            <div className="mt-4">
              <ImageUpload
                value={user.profilePhoto ? [user.profilePhoto] : []}
                onChange={handleProfilePhotoUpload}
                maxFiles={1}
                folder="profiles"
                label="Profile photo"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone number *</Label>
              <Input id="phone" type="tel" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} placeholder="Tell buyers a bit about your farm…" {...register("bio")} />
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location *</Label>
              <div className="grid grid-cols-3 gap-3">
                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
                    <SelectItem value="ZW">🇿🇼 Zimbabwe</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={watch("city")}
                  onValueChange={(v) => setValue("city", v ?? "", { shouldDirty: true })}
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
              {(errors.province || errors.city) && (
                <p className="text-xs text-destructive">Please select province and city.</p>
              )}
            </div>

            <Button type="submit" disabled={saving || !isDirty} className="w-full">
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account info (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Verification</span>
            <span className={user.isVerified ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
              {user.isVerified ? "Verified ✓" : "Pending review"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
