"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const [city, setCity] = useState("Lusaka");
  const [area, setArea] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    const res = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, area, companyName }),
    });
    if (res.ok) router.push("/employer/dashboard");
    else setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-500 mb-8">Tell us about yourself</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company / Household Name</label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area/Suburb</label>
            <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g., Kabulonga" />
          </div>
          <Button
            onClick={handleComplete}
            disabled={loading || !area.trim()}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? "Saving..." : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}
