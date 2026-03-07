import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Package,
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UrgencyBadge } from "@/components/marketplace/UrgencyBadge";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getListingById, getListings } from "@/lib/services/listings.service";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { formatCurrency, formatDate, getDaysUntilExpiry } from "@/lib/utils";
import { PRODUCE_CATEGORIES, URGENCY_CONFIG } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const daysLeft = getDaysUntilExpiry(listing.expiresAt);
  const categoryLabel = PRODUCE_CATEGORIES.find((c) => c.value === listing.category)?.label ?? listing.category;
  const urgencyConfig = URGENCY_CONFIG[listing.urgency];

  // Related listings
  const related = (await getListings({ category: listing.category, status: "active" }))
    .filter((l) => l.id !== listing.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left — photos + description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo gallery */}
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            {listing.photos[0] ? (
              <div className="relative h-72 sm:h-96">
                <Image
                  src={listing.photos[0]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center">
                <Package className="h-20 w-20 text-muted-foreground/30" />
              </div>
            )}
            {listing.photos.length > 1 && (
              <div className="flex gap-2 p-3">
                {listing.photos.map((photo, i) => (
                  <div key={i} className="relative h-16 w-16 rounded-md overflow-hidden border border-border">
                    <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title + badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <UrgencyBadge urgency={listing.urgency} />
              <Badge variant="outline" className="capitalize">{categoryLabel}</Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {listing.location.country === "ZA" ? "🇿🇦 South Africa" : "🇿🇼 Zimbabwe"}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{listing.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {listing.location.city}, {listing.location.province}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {listing.views} views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Listed {formatDate(listing.createdAt)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">About this listing</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
          </div>

          {/* Details grid */}
          <Card>
            <CardContent className="p-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quantity</p>
                <p className="mt-1 font-bold text-foreground">{listing.quantity} {listing.unit}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price</p>
                <p className="mt-1 font-bold text-primary text-lg">
                  {formatCurrency(listing.price, listing.currency)}
                  <span className="text-xs font-normal text-muted-foreground"> /{listing.unit}</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Urgency</p>
                <p className={`mt-1 font-bold ${urgencyConfig.color}`}>{urgencyConfig.label}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Expires</p>
                <p className={`mt-1 font-bold flex items-center gap-1 ${daysLeft <= 1 ? "text-red-600" : "text-foreground"}`}>
                  <Clock className="h-3.5 w-3.5" />
                  {daysLeft <= 0 ? "Today" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — farmer + contact */}
        <div className="space-y-5">
          {/* Contact card */}
          <Card className="border-primary/20 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-primary">
                  {formatCurrency(listing.price, listing.currency)}
                  <span className="text-sm font-normal text-muted-foreground"> per {listing.unit}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Total for {listing.quantity} {listing.unit}: {formatCurrency(listing.price * listing.quantity, listing.currency)}
                </p>
              </div>
              <Separator />
              <WhatsAppButton phone={listing.farmerPhone} listingTitle={listing.title} size="default" />
              <a href={`tel:${listing.farmerPhone}`}>
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  Call Farmer
                </Button>
              </a>
              <p className="text-center text-xs text-muted-foreground">
                Contacting the farmer is free. A 5% commission applies to completed sales.
              </p>
            </CardContent>
          </Card>

          {/* Farmer profile */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Seller</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${listing.farmerName}`} />
                  <AvatarFallback>{listing.farmerName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-foreground">{listing.farmerName}</p>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {listing.location.city}, {listing.location.province}
                  </p>
                  <p className="text-xs text-muted-foreground">{listing.farmerPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Urgency info */}
          <Card className={`border-0 ${urgencyConfig.bgColor}`}>
            <CardContent className="p-4">
              <p className={`text-sm font-semibold ${urgencyConfig.color}`}>
                ⚡ {urgencyConfig.description}
              </p>
              <p className={`text-xs mt-1 ${urgencyConfig.color} opacity-80`}>
                Act fast — this produce is perishable.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related listings */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-foreground mb-5">Similar Listings</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
