"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LogoIcon from "@/assets/logo_icon_rounded.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginFormValues, loginSchema } from "../types";

export function LoginForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setErrorMsg(null);
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.error) {
        setErrorMsg("Failed to authenticate. Please verify your credentials.");
      } else if (res?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      const err = error as Error;
      setErrorMsg(
        err.message ||
          "Failed to authenticate. Please verify your credentials.",
      );
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <div className="relative overflow-hidden bg-card/95 text-card-foreground backdrop-blur-2xl px-8 py-10 rounded-[2.5rem] shadow-2xl border border-border/80">
        <div className="flex flex-col items-center text-center space-y-5 mb-8">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden border border-border/50 bg-background/50 shadow-sm">
            <Image
              src={LogoIcon}
              alt="HR-Connect Logo"
              width={80}
              height={80}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              HR-Connect
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Secure Operational Portal
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2.5">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-foreground"
            >
              Corporate Email
            </Label>
            <Input
              id="email"
              placeholder="email@hrconnect.org"
              className="h-12 bg-background/50 border-border/80 hover:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </Label>
              <a
                href="#"
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 bg-background/50 border-border/80 hover:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm pr-12"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted/50"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
              <div className="w-1 h-5 bg-destructive rounded-full shrink-0" />
              <p className="leading-tight">{errorMsg}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.98] mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
