// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = "farmer" | "buyer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: Location;
  profilePhoto?: string;
  bio?: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string; // ISO date string
}

// ─── Location ────────────────────────────────────────────────────────────────

export type Country = "ZA" | "ZW";

export interface Location {
  country: Country;
  province: string;
  city: string;
}

// ─── Produce ─────────────────────────────────────────────────────────────────

export type ProduceCategory =
  | "vegetables"
  | "fruits"
  | "grains"
  | "livestock"
  | "poultry"
  | "dairy"
  | "herbs"
  | "other";

export const PRODUCE_CATEGORIES: { value: ProduceCategory; label: string }[] = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "grains", label: "Grains & Cereals" },
  { value: "livestock", label: "Livestock" },
  { value: "poultry", label: "Poultry & Eggs" },
  { value: "dairy", label: "Dairy" },
  { value: "herbs", label: "Herbs & Spices" },
  { value: "other", label: "Other" },
];

export type QuantityUnit = "kg" | "g" | "ton" | "crate" | "bag" | "dozen" | "head" | "litre";

export const QUANTITY_UNITS: { value: QuantityUnit; label: string }[] = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "ton", label: "Tons" },
  { value: "crate", label: "Crates" },
  { value: "bag", label: "Bags" },
  { value: "dozen", label: "Dozens" },
  { value: "head", label: "Head (livestock)" },
  { value: "litre", label: "Litres" },
];

// ─── Listing ──────────────────────────────────────────────────────────────────

export type Urgency = "low" | "medium" | "high" | "critical";
export type Currency = "ZAR" | "USD";
export type ListingStatus = "active" | "sold" | "expired" | "pending_review" | "removed";

export const URGENCY_CONFIG: Record<
  Urgency,
  { label: string; color: string; bgColor: string; description: string }
> = {
  low: {
    label: "Low",
    color: "text-green-700",
    bgColor: "bg-green-100",
    description: "Sell within 2 weeks",
  },
  medium: {
    label: "Medium",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    description: "Sell within 1 week",
  },
  high: {
    label: "High",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    description: "Sell within 2–3 days",
  },
  critical: {
    label: "Critical",
    color: "text-red-700",
    bgColor: "bg-red-100",
    description: "Must sell today",
  },
};

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  title: string;
  category: ProduceCategory;
  description: string;
  quantity: number;
  unit: QuantityUnit;
  price: number;
  currency: Currency;
  urgency: Urgency;
  location: Location;
  photos: string[];
  status: ListingStatus;
  views: number;
  isFeatured: boolean;
  expiresAt: string; // ISO date string
  createdAt: string; // ISO date string
}

// ─── Transaction ──────────────────────────────────────────────────────────────

export type TransactionStatus = "pending" | "contacted" | "completed" | "cancelled";

export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  currency: Currency;
  commissionRate: number; // e.g. 5 for 5%
  commissionValue: number;
  status: TransactionStatus;
  createdAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | "new_listing"
  | "listing_sold"
  | "listing_expiring"
  | "account_verified"
  | "new_contact"
  | "admin_action";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  href?: string;
  createdAt: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface ListingFilters {
  search?: string;
  category?: ProduceCategory | "all";
  urgency?: Urgency | "all";
  country?: Country | "all";
  province?: string;
  priceMin?: number;
  priceMax?: number;
  currency?: Currency;
  status?: ListingStatus;
  sortBy?: "newest" | "oldest" | "price_asc" | "price_desc" | "urgency";
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  activeListings: number;
  totalTransactions: number;
  totalCommissionRevenue: number;
  pendingVerifications: number;
  listingsThisMonth: number;
}
