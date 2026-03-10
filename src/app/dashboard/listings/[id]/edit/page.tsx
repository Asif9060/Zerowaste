"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingForm } from "@/components/forms/ListingForm";
import { getListingById, updateListing } from "@/lib/services/listings.service";
import { useAuthStore } from "@/store/auth.store";
import type { ListingFormData } from "@/lib/validators/listing.schema";
import type { Listing } from "@/types";
import { toast } from "sonner";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getListingById(params.id).then((data) => {
      if (!data || data.farmerId !== user?.id) {
        router.replace("/dashboard/listings");
        return;
      }
      setListing(data);
      setLoading(false);
    });
  }, [params.id, user, router]);

  const handleSubmit = async (data: ListingFormData) => {
    if (!listing) return;
    setIsSubmitting(true);
    try {
      await updateListing(listing.id, data);
      toast.success("Listing updated!");
      router.push("/dashboard/listings");
    } catch {
      toast.error("Failed to update listing.");
      setIsSubmitting(false);
    }
  };

  const defaultValues: Partial<ListingFormData> | undefined = listing
    ? {
        title: listing.title,
        category: listing.category,
        description: listing.description,
        quantity: listing.quantity,
        unit: listing.unit,
        price: listing.price,
        currency: listing.currency,
        urgency: listing.urgency,
        location: {
          country: listing.location.country,
          province: listing.location.province,
          city: listing.location.city,
        },
        expiresAt: listing.expiresAt.split("T")[0],
        photos: listing.photos,
      }
    : undefined;

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/dashboard/listings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Listing</CardTitle>
          {listing && (
            <p className="text-sm text-muted-foreground mt-1">{listing.title}</p>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <ListingForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
