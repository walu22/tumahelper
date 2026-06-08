import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `ZMW ${(amount / 100).toFixed(2)}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-ZM", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} at ${time}`;
}

export function generateBookingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "TH-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generatePaymentCode(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PAY-${date}-${suffix}`;
}

export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * 0.1);
}

export function calculateWorkerEarnings(amount: number): number {
  return amount - calculatePlatformFee(amount);
}

export function calculatePlacementFee(salary: number): number {
  const fee = Math.round(salary * 0.1);
  return Math.max(20000, Math.min(100000, fee));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
