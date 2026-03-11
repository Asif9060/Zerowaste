"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Leaf, Tractor, ShoppingCart, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { registerSchema, type RegisterFormData } from "@/lib/validators/auth.schema";
import { registerUser } from "@/lib/services/users.service";
import { signIn } from "next-auth/react";
import { SA_LOCATIONS, ZW_LOCATIONS, ALL_LOCATIONS } from "@/lib/mock-data/locations";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = 1 | 2;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<"ZA" | "ZW" | "">("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: undefined },
  });

  const selectedRole = watch("role");

  const handleNextStep = async () => {
    const valid = await trigger("role");
    if (valid) setStep(2);
  };

  const onCountryChange = (country: string | null) => {
    if (!country) return;
    const c = country as "ZA" | "ZW";
    setSelectedCountry(c);
    setSelectedProvince("");
    setValue("location.country", c);
    setValue("location.province", "");
    setValue("location.city", "");
  };

  const onProvinceChange = (province: string | null) => {
    setSelectedProvince(province ?? "");
    setValue("location.province", province ?? "");
    setValue("location.city", "");
  };

  const provinces = selectedCountry
    ? Object.keys(ALL_LOCATIONS[selectedCountry] ?? {})
    : [];

  const cities = selectedCountry && selectedProvince
    ? (ALL_LOCATIONS[selectedCountry]?.[selectedProvince] ?? [])
    : [];

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        location: data.location,
        bio: data.bio,
      });

      // Sign in immediately after registration
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Account created! Welcome to ZeroWaste Farm.");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Account created but sign-in failed. Please log in.");
        router.push("/auth/login");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary/5 to-amber-50/60 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-primary text-xl">
            <Leaf className="h-7 w-7" />
            ZeroWaste Farm
          </Link>
          <p className="mt-2 text-muted-foreground">Create your free account</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-colors",
                step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {s}
            </div>
          ))}
          <div className="h-0.5 w-8 bg-border rounded" />
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            {step === 1 ? (
              /* ── Step 1: Role selection ── */
              <div className="space-y-5">
                <h1 className="text-xl font-bold">Choose your role</h1>
                <p className="text-sm text-muted-foreground">How will you use ZeroWaste Farm?</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      role: "farmer" as const,
                      icon: Tractor,
                      title: "I'm a Farmer",
                      description: "I want to sell my surplus produce and reduce waste on my farm.",
                      color: "border-primary bg-primary/5",
                    },
                    {
                      role: "buyer" as const,
                      icon: ShoppingCart,
                      title: "I'm a Buyer",
                      description: "I want to buy fresh surplus produce for my restaurant, store, or stall.",
                      color: "border-amber-500 bg-amber-50",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => setValue("role", opt.role)}
                      className={cn(
                        "rounded-xl border-2 p-5 text-left transition-all hover:shadow-sm",
                        selectedRole === opt.role
                          ? opt.color + " shadow-sm"
                          : "border-border hover:border-muted-foreground/30"
                      )}
                    >
                      <opt.icon
                        className={cn(
                          "h-8 w-8 mb-3",
                          opt.role === "farmer" ? "text-primary" : "text-amber-600"
                        )}
                      />
                      <p className="font-bold text-foreground">{opt.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{opt.description}</p>
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-xs text-destructive">{errors.role.message}</p>
                )}
                <Button
                  className="w-full"
                  onClick={handleNextStep}
                  disabled={!selectedRole}
                >
                  Continue
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            ) : (
              /* ── Step 2: Profile form ── */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h1 className="text-xl font-bold">Your profile</h1>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full name *</Label>
                    <Input id="name" placeholder="Sipho Dlamini" {...register("name")} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone number *</Label>
                    <Input id="phone" placeholder="+27 82 123 4567" {...register("phone")} />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email address *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                {/* Location */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label>Country *</Label>
                    <Select onValueChange={onCountryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
                        <SelectItem value="ZW">🇿🇼 Zimbabwe</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.location?.country && (
                      <p className="text-xs text-destructive">{errors.location.country.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Province *</Label>
                    <Select onValueChange={onProvinceChange} disabled={!selectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.location?.province && (
                      <p className="text-xs text-destructive">{errors.location.province.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>City *</Label>
                    <Select
                      onValueChange={(v) => setValue("location.city", (v as string | null) ?? "")}
                      disabled={!selectedProvince}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.location?.city && (
                      <p className="text-xs text-destructive">{errors.location.city.message}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        {...register("password")}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirm password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio (optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell buyers a bit about your farm or business…"
                    rows={3}
                    {...register("bio")}
                  />
                  {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account…" : "Create Account"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
