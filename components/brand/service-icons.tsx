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

export function ExpressCleaningIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#E0F2EE" />
      <circle cx="32" cy="32" r="14" stroke="#027749" strokeWidth="3" fill="none" />
      <path d="M32 22v10l7 4" stroke="#027749" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 46h28" stroke="#80C5BC" strokeWidth="3" strokeLinecap="round" />
      <rect x="22" y="40" width="20" height="4" rx="2" fill="#FE80C9" opacity="0.7" />
    </svg>
  );
}

export function LaundryIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#E8F5EF" />
      <rect x="20" y="16" width="24" height="32" rx="4" fill="#027749" />
      <circle cx="32" cy="36" r="10" stroke="#80C5BC" strokeWidth="3" fill="none" />
      <circle cx="32" cy="36" r="3" fill="#FE80C9" />
      <rect x="26" y="20" width="12" height="4" rx="1" fill="#E1B016" />
    </svg>
  );
}

export function MovingCleanIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#FFF4E0" />
      <rect x="16" y="28" width="22" height="16" rx="2" fill="#027749" />
      <rect x="38" y="32" width="12" height="12" rx="2" fill="#80C5BC" />
      <circle cx="22" cy="46" r="4" fill="#027749" />
      <circle cx="34" cy="46" r="4" fill="#027749" />
      <path d="M44 26l6-6M44 26l-4 0" stroke="#E1B016" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 20h-6v6" stroke="#E1B016" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MomsHelperIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#FDE8F3" />
      <circle cx="24" cy="26" r="5" fill="#FE80C9" />
      <circle cx="40" cy="26" r="5" fill="#027749" />
      <path d="M18 44c3-6 8-9 14-9s11 3 14 9" stroke="#027749" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 14l-4 6h8l-4-6Z" fill="#E1B016" />
      <rect x="28" y="38" width="8" height="6" rx="1" fill="#80C5BC" />
    </svg>
  );
}

export type { ServiceIconKey } from "@/lib/landing/content";

const ICON_MAP: Record<ServiceIconKey, ComponentType<ServiceIconProps>> = {
  indoor: IndoorCleaningIcon,
  nanny: NannyIcon,
  express: ExpressCleaningIcon,
  laundry: LaundryIcon,
  moving: MovingCleanIcon,
  "moms-helper": MomsHelperIcon,
};

export function ServiceIcon({ name, className }: { name: ServiceIconKey; className?: string }) {
  const Icon = ICON_MAP[name];
  return <Icon className={className} />;
}
