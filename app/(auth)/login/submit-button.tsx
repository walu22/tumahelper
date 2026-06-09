"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label = "Sign In" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white rounded-md py-2 font-medium hover:bg-primary-dark disabled:opacity-50"
    >
      {pending ? "Signing in..." : label}
    </button>
  );
}

export function QuickLoginButton({
  label,
  email,
}: {
  label: string;
  email: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-left px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
    >
      <span className="font-medium">{pending ? "Signing in..." : label}</span>
      <span className="text-muted-foreground ml-2">{email}</span>
    </button>
  );
}
