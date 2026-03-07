import Link from "next/link";
import { Leaf, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-primary/10 p-5 mb-6">
        <Leaf className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-6xl font-extrabold text-foreground">404</h1>
      <p className="mt-3 text-xl font-semibold text-foreground">Page not found</p>
      <p className="mt-2 text-muted-foreground max-w-sm">
        Looks like this page has gone to compost. Let&apos;s get you back to something fresh.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Go home
          </Button>
        </Link>
        <Link href="/marketplace">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Browse marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
}
