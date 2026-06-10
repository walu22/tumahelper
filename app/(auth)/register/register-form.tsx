"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/brand/logo";
import { UserRole } from "@/types";
import { registerAction } from "./actions";

const roleDescriptions: { role: UserRole; title: string; description: string }[] = [
  {
    role: "customer",
    title: "I need help at home",
    description: "Book verified nannies and cleaners",
  },
  {
    role: "worker",
    title: "I want to work",
    description: "Offer your services and get hired",
  },
  {
    role: "employer",
    title: "I want to hire permanently",
    description: "Post jobs and find long-term staff",
  },
];

export function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") as UserRole | null;
  const error = searchParams.get("error");
  const prefilledEmail = searchParams.get("email") || "";
  const prefilledName = searchParams.get("name") || "";

  const [role, setRole] = useState<UserRole | null>(
    initialRole && ["customer", "worker", "employer"].includes(initialRole)
      ? initialRole
      : null
  );

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LogoMark size={48} />
            </div>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-gray-500 mt-1">How will you use TumaHelper?</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {roleDescriptions.map(({ role: r, title, description }) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left bg-white"
              >
                <div className="font-semibold text-lg">{title}</div>
                <div className="text-sm text-gray-500">{description}</div>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogoMark size={48} />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm capitalize">Signing up as {role}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <form action={registerAction} className="space-y-4">
          <input type="hidden" name="role" value={role} />

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">
              Full name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              minLength={2}
              defaultValue={prefilledName}
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={prefilledEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+26097XXXXXXX"
              autoComplete="tel"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Zambian format: +26097XXXXXXX, used for MoMo payments and contact
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
            <span>
              Role: <span className="font-medium capitalize">{role}</span>
            </span>
            <button
              type="button"
              onClick={() => setRole(null)}
              className="text-primary hover:underline"
            >
              Change
            </button>
          </div>

          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
