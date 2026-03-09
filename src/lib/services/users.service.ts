import type { User } from "@/types";

const BASE_URL =
  typeof window === "undefined"
    ? (process.env.NEXTAUTH_URL ??
       (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"))
    : "";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "farmer" | "buyer";
  location: { country: "ZA" | "ZW"; province: string; city: string };
  bio?: string;
}

// loginUser is handled directly by next-auth signIn on the login page.
// This stub is kept so existing imports don't break — pages call signIn() instead.
export async function loginUser(_payload: LoginPayload): Promise<User> {
  throw new Error("Use signIn('credentials', ...) from next-auth/react directly.");
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Registration failed");
  }
  return res.json();
}

export async function getUserById(id: string): Promise<User | null> {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/api/admin/users`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to update user");
  }
  return res.json();
}

// Demo credentials for quick-fill on login page
export const DEMO_CREDENTIALS = {
  farmer: { email: "sipho@farm.co.za", password: "demo1234" },
  buyer: { email: "amahle@restaurant.co.za", password: "demo1234" },
  admin: { email: "admin@zerowaste.farm", password: "demo1234" },
};

