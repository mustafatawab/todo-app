"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useRegisterUser } from "@/hooks/useAuth";
import { Loader2Icon } from "lucide-react";

type FormErrors = { name?: string; username?: string; email?: string; password?: string };

const Page = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const { mutate, isPending, isError, error } = useRegisterUser();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (field?: string): FormErrors => {
    const newErrors: FormErrors = {};
    if (!field || field === "name") {
      if (!form.name.trim()) newErrors.name = "Required";
      else if (form.name.trim().length < 2) newErrors.name = "At least 2 characters";
    }
    if (!field || field === "username") {
      if (!form.username.trim()) newErrors.username = "Required";
      else if (!/^[a-z0-9_]{3,20}$/.test(form.username.trim()))
        newErrors.username = "3-20 chars, lowercase, numbers, underscores";
    }
    if (!field || field === "email") {
      if (!form.email.trim()) newErrors.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    }
    if (!field || field === "password") {
      if (!form.password) newErrors.password = "Required";
      else if (form.password.length < 6) newErrors.password = "At least 6 characters";
    }
    return newErrors;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e: any) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(name);
    if (fieldErrors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof FormErrors] }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setTouched({ name: true, username: true, email: true, password: true });
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    mutate(form, {
      onSuccess: () => {
        setForm({ name: "", username: "", email: "", password: "" });
        setErrors({});
        setTouched({});
        router.push("/login");
        toast.success("Account created successfully.");
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <span className="text-sm font-semibold text-foreground/60">TaskFlow</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Get started with TaskFlow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
              Name
            </Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              id="name"
              type="text"
              placeholder="Your name"
              className="h-11 rounded-lg border-input bg-card px-4 text-sm transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
              aria-invalid={touched.name && !!errors.name}
            />
            {touched.name && errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground/80">
              Username
            </Label>
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              id="username"
              type="text"
              placeholder="your_username"
              className="h-11 rounded-lg border-input bg-card px-4 text-sm font-mono transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
              aria-invalid={touched.username && !!errors.username}
            />
            {touched.username && errors.username && (
              <p className="text-xs text-destructive">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
              Email
            </Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-11 rounded-lg border-input bg-card px-4 text-sm transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
              aria-invalid={touched.email && !!errors.email}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
              Password
            </Label>
            <Input
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="Create a password"
              className="h-11 rounded-lg border-input bg-card px-4 text-sm transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
              minLength={6}
              aria-invalid={touched.password && !!errors.password}
            />
            {touched.password && errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="toggle"
              onCheckedChange={(checked) => setShowPass(!!checked)}
              checked={showPass}
              className="rounded border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="toggle" className="text-sm text-muted-foreground cursor-pointer select-none">
              Show password
            </Label>
          </div>

          {isError && <p className="text-sm text-destructive">{error.message}</p>}

          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            {isPending && <Loader2Icon className="animate-spin mr-2 h-4 w-4" />}
            Create account
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-11 rounded-lg border-input bg-card hover:bg-secondary transition-all duration-200">
            <Image src="/google.png" alt="Google" width={16} height={16} className="mr-2" />
            <span className="text-sm">Google</span>
          </Button>
          <Button variant="outline" className="h-11 rounded-lg border-input bg-card hover:bg-secondary transition-all duration-200">
            <FaGithub className="w-4 h-4 mr-2" />
            <span className="text-sm">GitHub</span>
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Page;
