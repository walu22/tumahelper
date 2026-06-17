"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { Smartphone, Banknote, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentInstructionsProps {
  bookingId: string;
  totalAmount: number;
  paymentStatus: string;
}

const STEPS = [
  {
    icon: Smartphone,
    title: "Pay via mobile money",
    body: "Send the total amount using MTN Mobile Money or Airtel Money from your phone.",
  },
  {
    icon: Banknote,
    title: "Use the booking reference",
    body: "Put your booking code in the payment reference/note so we can match it quickly.",
  },
  {
    icon: Upload,
    title: "Upload your proof",
    body: "Screenshot your confirmation SMS or receipt here. We verify within a few hours.",
  },
];

export function PaymentInstructions({
  bookingId,
  totalAmount,
  paymentStatus,
}: PaymentInstructionsProps) {
  const [uploading, setUploading] = useState(false);
  const [localStatus, setLocalStatus] = useState(paymentStatus);
  const fileRef = useRef<HTMLInputElement>(null);

  const isPaid = localStatus === "paid" || localStatus === "confirmed";

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("screenshot", file);

      const res = await fetch(`/api/bookings/${bookingId}/payment-proof`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setLocalStatus("paid");
      toast.success("Payment proof uploaded. We'll confirm shortly");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (isPaid) {
    return (
      <CardShell title="Payment">
        <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4">
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">
              {localStatus === "confirmed" ? "Payment confirmed" : "Proof received"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {localStatus === "confirmed"
                ? "Your payment has been verified. Thank you!"
                : "We're verifying your payment. You'll be notified once confirmed."}
            </p>
          </div>
        </div>
      </CardShell>
    );
  }

  return (
    <CardShell title="How to pay">
      <p className="text-sm text-muted-foreground mb-4">
        Total due: <span className="font-semibold text-foreground">{formatCurrency(totalAmount)}</span>
      </p>

      <div className="rounded-xl bg-surface border border-border p-4 mb-5 space-y-2 text-sm">
        <p className="font-medium">Payment details (demo)</p>
        <p>
          <span className="text-muted-foreground">MTN MoMo:</span>{" "}
          <span className="font-mono">097 000 0000</span> · TumaHelper Ltd
        </p>
        <p>
          <span className="text-muted-foreground">Airtel Money:</span>{" "}
          <span className="font-mono">097 000 0001</span> · TumaHelper Ltd
        </p>
        <p className="text-muted-foreground text-xs pt-1">
          Cash on arrival is also fine. Agree with your worker before the visit.
        </p>
      </div>

      <ol className="space-y-4 mb-6">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {i + 1}
            </div>
            <div>
              <p className="font-medium text-sm">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleUpload}
      />
      <Button
        className="w-full rounded-full"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload payment proof
          </>
        )}
      </Button>
    </CardShell>
  );
}

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      {children}
    </div>
  );
}
