"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/brand/logo";

export function CustomerOnboardingForm() {
  const router = useRouter();
  const [city, setCity] = useState("Lusaka");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!area.trim()) {
      setError("Enter your area or suburb.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, area: area.trim() }),
    });

    if (res.ok) {
      router.push("/customer/dashboard");
    } else {
      const body = await res.json().catch(() => null);
      setError(body?.error?.message || "Could not save your location.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-border shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogoMark size={48} />
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome!</h1>
          <p className="text-muted-foreground mt-2">Tell us where you&apos;re located</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">City</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Area / suburb</label>
            <Input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g., Kabulonga, Woodlands"
            />
          </div>
          <Button
            onClick={handleComplete}
            disabled={loading || !area.trim()}
            className="w-full rounded-full"
          >
            {loading ? "Saving..." : "Get started"}
          </Button>
        </div>
      </div>
    </div>
  );
}
