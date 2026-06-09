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

export function BrowseIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(iconBase, className)} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#E0F2EE" />
      <circle cx="28" cy="28" r="10" stroke="#027749" strokeWidth="3" fill="none" />
      <path d="M35 35l8 8" stroke="#027749" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="26" r="2" fill="#FE80C9" />
      <circle cx="32" cy="26" r="2" fill="#027749" />
      <circle cx="28" cy="32" r="2" fill="#E1B016" />
    </svg>
  );
}

const ICON_MAP: Record<ServiceIconKey, ComponentType<ServiceIconProps>> = {
  indoor: IndoorCleaningIcon,
  nanny: NannyIcon,
  browse: BrowseIcon,
};

export function ServiceIcon({ name, className }: { name: ServiceIconKey; className?: string }) {
  const Icon = ICON_MAP[name];
  return <Icon className={className} />;
}
