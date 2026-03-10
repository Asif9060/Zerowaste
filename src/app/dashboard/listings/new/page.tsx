"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingForm } from "@/components/forms/ListingForm";
import { createListing } from "@/lib/services/listings.service";
import { useAuthStore } from "@/store/auth.store";
import type { ListingFormData } from "@/lib/validators/listing.schema";
import { toast } from "sonner";

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ListingFormData) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await createListing({
        ...data,
        farmerId: user.id,
        farmerName: user.name,
        farmerPhone: user.phone,
        status: "pending_review",
        isFeatured: false,
      });
      toast.success("Listing posted successfully!");
      router.push("/dashboard/listings");
    } catch {
      toast.error("Failed to post listing. Please try again.");
      setIsSubmitting(false);
    }
  };

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
          <CardTitle>Post New Listing</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details about your surplus produce to connect with buyers.
          </p>
        </CardHeader>
        <CardContent>
          <ListingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
