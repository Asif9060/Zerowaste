"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Package, DollarSign, LogOut, ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/commissions", label: "Commissions", icon: DollarSign },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }
    if (session?.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || !session?.user || session.user.role !== "admin") return null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-background border-r border-border flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Admin Panel</p>
          <p className="font-bold text-foreground mt-0.5">{session.user.name}</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-primary/60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
