"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/brand/logo";
import { UserRole } from "@/types";

const roleDescriptions: { role: UserRole; title: string; description: string }[] = [
  { role: "customer", title: "I need help at home", description: "Book nannies, cleaners, and more" },
  { role: "worker", title: "I want to work", description: "Offer your services and get hired" },
  { role: "employer", title: "I want to hire permanently", description: "Post jobs and find long-term staff" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!role || !fullName.trim()) return;

    try {
      setLoading(true);
      setError("");

      const phone = localStorage.getItem("pendingPhone");

      if (!phone) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, role, fullName: fullName.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Registration failed");
      }

      localStorage.removeItem("pendingPhone");
      router.push(`/onboarding/${role}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

          <div className="space-y-3">
            {roleDescriptions.map(({ role: r, title, description }) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left bg-white"
              >
                <div className="font-semibold text-lg">{title}</div>
                <div className="text-sm text-gray-500">{description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Complete your profile</h1>
          <p className="text-gray-500 mt-1">Just a few more details</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <span className="text-sm text-gray-500">Role: </span>
              <span className="font-medium capitalize">{role}</span>
            </div>
            <button
              onClick={() => setRole(null)}
              className="text-sm text-primary hover:underline"
            >
              Change
            </button>
          </div>

          <Button
            onClick={handleRegister}
            disabled={loading || !fullName.trim()}
            className="w-full"
          >
            {loading ? "Creating account..." : "Complete Registration"}
          </Button>
        </div>
      </div>
    </div>
  );
}
