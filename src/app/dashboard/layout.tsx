"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }
    if (session?.user?.role === "admin") {
      router.replace("/admin");
    }
  }, [status, session, router]);

  if (status === "loading") return null;
  if (status === "unauthenticated" || !session?.user) return null;
  if (session.user.role === "admin") return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar role={session.user.role as "farmer" | "buyer"} />
      <main className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
