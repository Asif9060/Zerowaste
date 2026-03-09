"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth.store";

export default function SessionSync() {
  const { data: session, status } = useSession();
  const { login, logout, user: storeUser } = useAuthStore();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      logout();
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      // Skip if already synced for this user
      if (storeUser?.id === session.user.id) return;

      // Fetch the full user profile
      fetch(`/api/users/${session.user.id}`)
        .then((r) => r.json())
        .then((user) => login(user))
        .catch(() => {
          // Fallback: use minimal session data so guards work immediately
          login({
            id: session.user.id,
            name: session.user.name ?? "",
            email: session.user.email ?? "",
            phone: "",
            role: (session.user.role as "farmer" | "buyer" | "admin") ?? "buyer",
            location: { country: "ZA", province: "", city: "" },
            isVerified: false,
            isSuspended: false,
            createdAt: new Date().toISOString(),
          });
        });
    }
  }, [status, session, login, logout, storeUser?.id]);

  return null;
}
