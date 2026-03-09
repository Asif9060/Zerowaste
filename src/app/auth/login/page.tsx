"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth.schema";
import { DEMO_CREDENTIALS } from "@/lib/services/users.service";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
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
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(
        result.error === "CredentialsSignin"
          ? "Invalid email or password."
          : result.error
      );
      return;
    }

    if (result?.ok) {
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    }
  };

  const fillDemo = (role: "farmer" | "buyer" | "admin") => {
    setValue("email", DEMO_CREDENTIALS[role].email);
    setValue("password", DEMO_CREDENTIALS[role].password);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-primary/5 to-amber-50/60 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-primary text-2xl">
            <Leaf className="h-8 w-8" />
            ZeroWaste Farm
          </Link>
          <p className="mt-2 text-base text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2 pt-8 px-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          </CardHeader>
          <CardContent className="pt-4 px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-11 text-base"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password")}
                    className="pr-10 h-11 text-base"
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

              <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            {/* Demo quick-fill */}
            {/* <div className="mt-5 rounded-lg bg-muted/60 p-4">
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
            </div> */}

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
