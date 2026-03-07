import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Currency, Urgency } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === "ZAR") {
    return `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date("2026-03-07T12:00:00Z"); // mock "now"
  const then = new Date(dateString);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getDaysUntilExpiry(expiresAt: string): number {
  const now = new Date("2026-03-07T12:00:00Z");
  const expiry = new Date(expiresAt);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function buildWhatsAppLink(phone: string, listingTitle: string): string {
  const cleaned = phone.replace(/\s+/g, "");
  const message = encodeURIComponent(
    `Hi, I found your listing on ZeroWaste Farm: "${listingTitle}". I'm interested — is it still available?`
  );
  return `https://wa.me/${cleaned.replace("+", "")}?text=${message}`;
}

export function getUrgencyDaysLabel(urgency: Urgency): string {
  switch (urgency) {
    case "critical": return "Expires today";
    case "high": return "2–3 days left";
    case "medium": return "1 week left";
    case "low": return "2+ weeks left";
  }
}
