"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  User,
  Heart,
  ShoppingBag,
  Users,
  Package,
  BarChart3,
  DollarSign,
  Leaf,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const FARMER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "My Listings", icon: ListChecks },
  { href: "/dashboard/listings/new", label: "Post Listing", icon: PlusCircle },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const BUYER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/favorites", label: "Saved Listings", icon: Heart },
  { href: "/dashboard/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/commissions", label: "Commissions", icon: DollarSign },
];

function NavList({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-0.5">
      {items.map((item) => {
        const isActive = item.href === "/dashboard" || item.href === "/admin"
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

interface DashboardSidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = role === "admin" ? ADMIN_NAV : role === "farmer" ? FARMER_NAV : BUYER_NAV;

  const sidebarContent = (
    <div className="flex h-full flex-col gap-6 py-6 px-3">
      <Link href="/" className="flex items-center gap-2 px-1 font-bold text-primary">
        <Leaf className="h-5 w-5" />
        <span className="text-base">ZeroWaste Farm</span>
      </Link>
      <div>
        <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {role === "admin" ? "Admin" : role === "farmer" ? "Farmer" : "Buyer"}
        </p>
        <NavList items={items} />
      </div>
      <div className="mt-auto px-3">
        <Link href="/marketplace" className="text-xs text-muted-foreground hover:text-foreground">
          ← Back to Marketplace
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-sidebar min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden fixed bottom-6 left-4 z-40">
        <Button
          size="icon"
          className="rounded-full shadow-lg"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-56 bg-sidebar border-r border-border">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
