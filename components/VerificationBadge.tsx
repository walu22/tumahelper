"use client";

import { VerificationLevel } from "@/types";
import { Shield } from "lucide-react";

interface VerificationBadgeProps {
  level: VerificationLevel;
  size?: "sm" | "md" | "lg";
}

const levelConfig = {
  none: { color: "text-muted-foreground", bg: "bg-muted", label: "Unverified" },
  bronze: { color: "text-amber-700", bg: "bg-amber-100", label: "Bronze" },
  silver: { color: "text-muted-foreground", bg: "bg-muted", label: "Silver" },
  gold: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Gold" },
  platinum: { color: "text-slate-700", bg: "bg-slate-200", label: "Platinum" },
};

export function VerificationBadge({ level, size = "md" }: VerificationBadgeProps) {
  const config = levelConfig[level];
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bg} ${config.color} ${sizeClasses[size]}`}>
      <Shield className="w-3 h-3" />
      {config.label}
    </span>
  );
}
