import Link from "next/link";
import { Leaf, Users, ShieldCheck, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const VALUES = [
  {
    icon: Leaf,
    title: "Zero Food Waste",
    desc: "We believe every kilogram of surplus produce deserves a buyer. Our platform turns waste into value.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Built for South African and Zimbabwean farmers and buyers. Local knowledge, local connections.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted & Verified",
    desc: "Farmers are verified before listings go live. Buyers shop with confidence.",
  },
  {
    icon: Globe,
    title: "WhatsApp-Native",
    desc: "No complicated checkout. Contact farmers directly via WhatsApp — the way Africa already communicates.",
  },
];

const TEAM = [
  { name: "Sipho Dlamini", role: "Co-founder & CEO", country: "🇿🇦" },
  { name: "Grace Moyo", role: "Co-founder & CTO", country: "🇿🇼" },
  { name: "Amahle Zulu", role: "Head of Farmer Relations", country: "🇿🇦" },
  { name: "Tendai Chikwanda", role: "Head of Buyer Growth", country: "🇿🇼" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Leaf className="h-4 w-4" />
            Our story
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Fighting food waste,<br />one listing at a time
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            ZeroWaste Farm was founded in 2024 by farmers who were tired of watching perfectly good produce
            go to waste due to market inefficiencies. We built the platform we wish we had.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Our mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Across South Africa and Zimbabwe, an estimated 30–40% of fresh produce is wasted before
              it reaches a consumer. We&apos;re on a mission to change that — connecting farmers with surplus
              stock directly to restaurants, markets, food processors, and households that want it.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We charge a small 5% commission only on completed sales, keeping the platform free for
              farmers to list and buyers to browse.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-primary/10 p-5 text-center">
              <p className="text-4xl font-extrabold text-primary">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Farmers registered</p>
            </div>
            <div className="rounded-2xl bg-accent/40 p-5 text-center">
              <p className="text-4xl font-extrabold text-foreground">12t</p>
              <p className="text-sm text-muted-foreground mt-1">Food saved this month</p>
            </div>
            <div className="rounded-2xl bg-accent/40 p-5 text-center">
              <p className="text-4xl font-extrabold text-foreground">2</p>
              <p className="text-sm text-muted-foreground mt-1">Countries served</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-5 text-center">
              <p className="text-4xl font-extrabold text-primary">5%</p>
              <p className="text-sm text-muted-foreground mt-1">Commission only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">What we stand for</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-background p-6 border border-border">
                <div className="rounded-xl bg-primary/10 w-10 h-10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">The team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {TEAM.map((m) => (
            <div key={m.name} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mx-auto mb-3">
                {m.country}
              </div>
              <p className="font-semibold text-foreground text-sm">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <Phone className="h-8 w-8 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold">Get in touch</h2>
          <p className="mt-3 opacity-80">
            Are you a farmer interested in listing? A buyer looking for bulk deals?
            Or a partner who wants to collaborate? We&apos;d love to hear from you.
          </p>
          <p className="mt-4 text-lg font-semibold">hello@zerowastefarm.co.za</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register">
              <Button variant="secondary" size="lg">Join as a Farmer</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="border-primary-foreground/50 text-primary hover:bg-primary-foreground/10">
                Browse Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
