import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const locationSchema = z.object({
  country: z.enum(["ZA", "ZW"], { message: "Please select a country" }),
  province: z.string().min(1, "Please select a province"),
  city: z.string().min(1, "Please select a city"),
});

export const registerSchema = z
  .object({
    role: z.enum(["farmer", "buyer"], { message: "Please select your role" }),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[\d\s\-()]+$/, "Please enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    location: locationSchema,
    bio: z.string().max(300, "Bio must be 300 characters or fewer").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
