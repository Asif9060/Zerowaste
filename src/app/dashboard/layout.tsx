"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    } else if (user?.role === "admin") {
      router.replace("/admin");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role === "admin") {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar role={user.role} />
      <main className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
