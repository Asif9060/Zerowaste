"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth.schema";
import { loginUser, DEMO_CREDENTIALS } from "@/lib/services/users.service";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loadNotifs = useNotificationsStore((s) => s.loadForUser);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await loginUser(data);
      login(user);
      loadNotifs(user.id);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  };

  const fillDemo = (role: "farmer" | "buyer" | "admin") => {
    setValue("email", DEMO_CREDENTIALS[role].email);
    setValue("password", DEMO_CREDENTIALS[role].password);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary/5 to-amber-50/60 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-primary text-xl">
            <Leaf className="h-7 w-7" />
            ZeroWaste Farm
          </Link>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-0">
            <h1 className="text-xl font-bold text-foreground">Welcome back</h1>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            {/* Demo quick-fill */}
            <div className="mt-5 rounded-lg bg-muted/60 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">🔑 Demo accounts (password: demo1234)</p>
              <div className="flex gap-2">
                {(["farmer", "buyer", "admin"] as const).map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    className="flex-1 capitalize text-xs"
                    onClick={() => fillDemo(role)}
                    type="button"
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-primary hover:underline">
                Create one free
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
