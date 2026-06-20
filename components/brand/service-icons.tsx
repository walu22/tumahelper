import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { ServiceIconKey } from "@/lib/landing/content";

interface ServiceIconProps {
  className?: string;
}

const iconBase = "h-14 w-14";

export function IndoorCleaningIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#E8F5EF" />
      <path d="M18 44V28l14-10 14 10v16H18Z" fill="#027749" />
      <path d="M18 28l14-10 14 10-14-8-14 8Z" fill="#039855" />
      <rect x="28" y="36" width="8" height="8" rx="1" fill="#80C5BC" />
      <path d="M22 44h20" stroke="#027749" strokeWidth="2" strokeLinecap="round" />
      <circle cx="46" cy="20" r="8" fill="#FE80C9" opacity="0.85" />
      <path d="M43 20h6M46 17v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function NannyIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#FDE8F3" />
      <circle cx="26" cy="24" r="6" fill="#FE80C9" />
      <circle cx="38" cy="26" r="5" fill="#027749" />
      <path d="M20 44c2-8 8-12 12-12s10 4 12 12" stroke="#027749" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 18v-4M32 14l2 2M32 14l-2 2" stroke="#E1B016" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="18" r="4" fill="#E1B016" />
    </svg>
  );
}

export function ShortStayIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#E8F0FF" />
      <path d="M18 44V28l14-10 14 10v16H18Z" fill="#2563EB" />
      <path d="M18 28l14-10 14 10-14-8-14 8Z" fill="#3B82F6" />
      <rect x="27" y="34" width="10" height="10" rx="1.5" fill="white" />
      <path d="M30 38h4M32 36v4" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="46" cy="20" r="7" fill="#FE80C9" opacity="0.9" />
      <path d="M43 20h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LaundryIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#E8F4FF" />
      <rect x="20" y="18" width="24" height="28" rx="4" fill="#60A5FA" />
      <circle cx="32" cy="36" r="8" stroke="white" strokeWidth="2.5" />
      <path d="M26 24h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="24" r="1.5" fill="white" />
    </svg>
  );
}

export function GardenIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#EAF7EA" />
      <path d="M32 44V24" stroke="#166534" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 30c-6-4-10-1-10 4s4 8 10 4" fill="#22C55E" />
      <path d="M32 26c6-4 10-1 10 4s-4 8-10 4" fill="#16A34A" />
      <path d="M18 44h28" stroke="#854D0E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function HousekeepingIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#F3E8FF" />
      <path d="M20 42V30l12-8 12 8v12H20Z" fill="#7C3AED" />
      <path d="M20 30l12-8 12 8-12-6-12 6Z" fill="#8B5CF6" />
      <rect x="28" y="36" width="8" height="6" rx="1" fill="#DDD6FE" />
      <circle cx="46" cy="22" r="8" fill="#E1B016" />
      <path d="M46 18v8M42 22h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CookingIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#FFF4E6" />
      <ellipse cx="32" cy="40" rx="16" ry="6" fill="#EA580C" />
      <path d="M20 40c0-10 5-16 12-16s12 6 12 16" fill="#F97316" />
      <path d="M26 30c2-4 4-6 6-6s4 2 6 6" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 22c0-3 2-5 4-5" stroke="#E1B016" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 22c0-3-2-5-4-5" stroke="#E1B016" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const ICON_MAP: Record<ServiceIconKey, ComponentType<ServiceIconProps>> = {
  indoor: IndoorCleaningIcon,
  nanny: NannyIcon,
  short_stay: ShortStayIcon,
  housekeeping: HousekeepingIcon,
  cooking: CookingIcon,
  laundry: LaundryIcon,
  garden: GardenIcon,
};

export function ServiceIcon({ name, className }: { name: ServiceIconKey; className?: string }) {
  const Icon = ICON_MAP[name];
  return <Icon className={className} />;
}
