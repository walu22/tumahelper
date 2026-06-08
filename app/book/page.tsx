"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerCard } from "@/components/worker-card";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Clock, MapPin, CreditCard } from "lucide-react";

type Step = "category" | "worker" | "datetime" | "location" | "confirm";

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("category");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkers = async (category: string) => {
    setLoading(true);
    const res = await fetch(`/api/workers?category=${category}&available=true`);
    const data = await res.json();
    setWorkers(data.data || []);
    setLoading(false);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    fetchWorkers(category);
    setStep("worker");
  };

  const handleWorkerSelect = (worker: any) => {
    setSelectedWorker(worker);
    setStep("datetime");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerId: selectedWorker.user_id,
        categoryId: selectedCategory === "nanny" ? "11111111-1111-1111-1111-111111111111" : "22222222-2222-2222-2222-222222222222",
        serviceDate: date,
        serviceTime: time,
        locationAddress: address,
        description: notes,
        amount: 20000,
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Book a Worker</h1>

      <div className="flex items-center gap-2 mb-8">
        {["category", "worker", "datetime", "location", "confirm"].map((s, i) => (
          <div key={s} className={`h-2 flex-1 rounded-full ${
            ["category", "worker", "datetime", "location", "confirm"].indexOf(step) >= i
              ? "bg-primary"
              : "bg-gray-200"
          }`} />
        ))}
      </div>

      {step === "category" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">What service do you need?</h2>
          <button
            onClick={() => handleCategorySelect("nanny")}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 text-left transition-colors"
          >
            <div className="font-semibold text-lg">Nanny / Childcare</div>
            <div className="text-gray-500">Day nanny, live-in nanny, or babysitter</div>
          </button>
          <button
            onClick={() => handleCategorySelect("house_cleaner")}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 text-left transition-colors"
          >
            <div className="font-semibold text-lg">House Cleaning</div>
            <div className="text-gray-500">Regular cleaning, deep cleaning, laundry</div>
          </button>
        </div>
      )}

      {step === "worker" && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Select a worker</h2>
          {loading ? (
            <div className="text-center py-8">Loading workers...</div>
          ) : (
            <div className="space-y-4">
              {workers.map((worker) => (
                <button
                  key={worker.id}
                  onClick={() => handleWorkerSelect(worker)}
                  className="w-full text-left"
                >
                  <WorkerCard worker={worker} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === "datetime" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            When do you need them?
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("worker")} className="flex-1">Back</Button>
            <Button onClick={() => setStep("location")} disabled={!date || !time} className="flex-1 bg-primary">Continue</Button>
          </div>
        </div>
      )}

      {step === "location" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Where do you need them?
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              rows={3}
              placeholder="Any special instructions..."
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("datetime")} className="flex-1">Back</Button>
            <Button onClick={() => setStep("confirm")} disabled={!address.trim()} className="flex-1 bg-primary">Continue</Button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Confirm Booking</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Worker</span>
              <span className="font-medium">{selectedWorker?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">{date} at {time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location</span>
              <span className="font-medium text-right">{address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-medium">{formatCurrency(20000)}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">{formatCurrency(20000)}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("location")} className="flex-1">Back</Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-primary">
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
