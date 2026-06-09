"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}
