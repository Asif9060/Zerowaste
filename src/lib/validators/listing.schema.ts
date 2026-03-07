import { z } from "zod";
import { locationSchema } from "./auth.schema";

export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be 100 characters or fewer"),
  category: z.enum(
    ["vegetables", "fruits", "grains", "livestock", "poultry", "dairy", "herbs", "other"],
    { message: "Please select a category" }
  ),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be 1000 characters or fewer"),
  quantity: z
    .number()
    .positive("Quantity must be greater than 0"),
  unit: z.enum(["kg", "g", "ton", "crate", "bag", "dozen", "head", "litre"], {
    message: "Please select a unit",
  }),
  price: z
    .number()
    .positive("Price must be greater than 0"),
  currency: z.enum(["ZAR", "USD"], { message: "Please select a currency" }),
  urgency: z.enum(["low", "medium", "high", "critical"], {
    message: "Please select urgency level",
  }),
  location: locationSchema,
  expiresAt: z.string().min(1, "Please select an expiry date"),
  photoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export type ListingFormData = z.infer<typeof listingSchema>;
