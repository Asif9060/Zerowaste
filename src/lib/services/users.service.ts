import type { User } from "@/types";
import { MOCK_USERS, DEMO_CREDENTIALS } from "@/lib/mock-data/users";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

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

export async function loginUser(payload: LoginPayload): Promise<User> {
  await delay(500);
  // Mock: any of the demo credentials or any email from mock users with password "demo1234"
  const user = MOCK_USERS.find((u) => u.email === payload.email);
  if (!user || payload.password !== "demo1234") {
    throw new Error("Invalid email or password.");
  }
  if (user.isSuspended) {
    throw new Error("Your account has been suspended. Contact support.");
  }
  return user;
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
  await delay(600);
  // Mock: create user object (not persisted in mock)
  const newUser: User = {
    id: `u${Date.now()}`,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    location: payload.location,
    bio: payload.bio,
    profilePhoto: `https://api.dicebear.com/9.x/avataaars/svg?seed=${payload.name}`,
    isVerified: false,
    isSuspended: false,
    createdAt: new Date().toISOString(),
  };
  return newUser;
}

export async function getUserById(id: string): Promise<User | null> {
  await delay();
  return MOCK_USERS.find((u) => u.id === id) ?? null;
}

export async function getAllUsers(): Promise<User[]> {
  await delay();
  return [...MOCK_USERS];
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  await delay(400);
  const existing = MOCK_USERS.find((u) => u.id === id);
  if (!existing) throw new Error("User not found");
  return { ...existing, ...data };
}

export { DEMO_CREDENTIALS };
