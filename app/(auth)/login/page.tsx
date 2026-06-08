"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { phoneSchema } from "@/lib/validations";

const roleRedirects: Record<string, string> = {
  customer: "/customer/dashboard",
  worker: "/worker/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const validated = phoneSchema.parse(phone);

      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: validated }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to send OTP");
      }

      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Invalid phone number");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Invalid OTP");
      }

      const { user, isNewUser } = data.data;

      if (isNewUser) {
        localStorage.setItem("pendingPhone", phone);
        router.push("/register");
      } else {
        const redirect = searchParams.get("redirect") || roleRedirects[user?.role] || "/dashboard";
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">TH</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome to TumaHelper</h1>
          <p className="text-gray-500 mt-1">Sign in with your phone number</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+26097XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your Zambian phone number to receive a code
              </p>
            </div>
            <Button
              onClick={handleRequestOTP}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full text-center text-2xl tracking-[0.5em]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Code sent to {phone}
              </p>
            </div>
            <Button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </Button>
            <button
              onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Change phone number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
