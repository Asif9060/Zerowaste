import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Zap, Users, TrendingDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { getFeaturedListings } from "@/lib/services/listings.service";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Leaf,
    title: "Farmers Post Surplus",
    description:
      "Register your farm and post surplus produce with photos, quantity, price, and urgency level. Takes under 2 minutes.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    step: "02",
    icon: Zap,
    title: "Buyers Get Alerted",
    description:
      "Restaurants, street vendors, and grocery stores browse real-time listings and get notified about new deals in their area.",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    step: "03",
    icon: ShieldCheck,
    title: "Connect & Transact",
    description:
      "Buyers contact farmers directly via WhatsApp or the platform. Deals are tracked and a small commission goes to ZeroWaste Farm.",
    color: "text-green-700",
    bg: "bg-green-100",
  },
];

const STATS = [
  { value: "2,400+", label: "Farmers registered", icon: Users },
  { value: "18 000 kg", label: "Food saved monthly", icon: Leaf },
  { value: "94%", label: "Listings sold within 3 days", icon: TrendingDown },
  { value: "4.8 / 5", label: "Average farmer rating", icon: Star },
];

const BUYER_TYPES = [
  { label: "Restaurants & Hotels", emoji: "🍽️" },
  { label: "Street Food Vendors", emoji: "🌽" },
  { label: "Grocery & Retail Stores", emoji: "🛒" },
  { label: "Catering Companies", emoji: "🍱" },
  { label: "Schools & Institutions", emoji: "🏫" },
  { label: "Food Processing Plants", emoji: "🏭" },
];

export default async function HomePage() {
  const featured = await getFeaturedListings(6);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-amber-50 py-20 sm:py-28">
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-0 text-sm px-3 py-1">
              🌱 South Africa &amp; Zimbabwe
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Stop Food Waste.{" "}
              <span className="text-primary">Start Earning.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              ZeroWaste Farm connects farmers with surplus produce to buyers who need it — before
              it rots. Post in minutes. Sell the same day.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8">
                  Start Selling Surplus
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                  Browse Listings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto h-6 w-6 text-primary mb-2" />
                <p className="text-2xl font-extrabold text-foreground sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Simple, fast, and built for farmers on the move.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${step.bg}`}>
                  <step.icon className={`h-7 w-7 ${step.color}`} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Step {step.step}
                </span>
                <h3 className="mt-1 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Featured Listings</h2>
              <p className="mt-1 text-muted-foreground">Urgent deals from verified farmers</p>
            </div>
            <Link href="/marketplace">
              <Button variant="ghost" className="gap-1 text-primary">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="px-10">Browse All Listings</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who Buys */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-amber-50/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Who Buys on ZeroWaste Farm?</h2>
            <p className="mt-3 text-muted-foreground">
              Thousands of food businesses across SA and Zimbabwe rely on us for affordable, fresh surplus produce.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {BUYER_TYPES.map((b) => (
              <Card key={b.label} className="text-center border-border hover:border-primary/40 transition-colors">
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{b.emoji}</div>
                  <p className="text-xs font-medium text-foreground leading-tight">{b.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to stop wasting food?</h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join 2,400+ farmers already selling their surplus on ZeroWaste Farm. Free to register.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-10 text-primary font-bold">
                Register as Farmer
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-10">
                Register as Buyer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
