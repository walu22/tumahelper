import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { mark: 28, text: "text-lg" },
  md: { mark: 36, text: "text-xl" },
  lg: { mark: 48, text: "text-2xl" },
};

/** TumaHelper mark — house with rising sun (SweepSouth-inspired) */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Sun */}
      <circle cx="24" cy="14" r="9" fill="#E1B016" />
      <circle cx="24" cy="14" r="6.5" fill="#F5C842" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1={24 + Math.cos((deg * Math.PI) / 180) * 11}
          y1={14 + Math.sin((deg * Math.PI) / 180) * 11}
          x2={24 + Math.cos((deg * Math.PI) / 180) * 14}
          y2={14 + Math.sin((deg * Math.PI) / 180) * 14}
          stroke="#E1B016"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      {/* House body */}
      <path
        d="M10 42V24.5L24 14.5L38 24.5V42H10Z"
        fill="#027749"
      />
      {/* Roof highlight */}
      <path
        d="M10 24.5L24 14.5L38 24.5L24 19L10 24.5Z"
        fill="#039855"
      />
      {/* Door */}
      <rect x="20" y="32" width="8" height="10" rx="1" fill="#F5C842" />
      {/* Window */}
      <rect x="14" y="27" width="6" height="6" rx="1" fill="#80C5BC" />
      <rect x="28" y="27" width="6" height="6" rx="1" fill="#80C5BC" />
      {/* Heart accent — care / home */}
      <path
        d="M24 22.5C22.5 21 20 21.2 19 22.8C18 21.2 15.5 21 14 22.5C12.5 24 14 26.5 19 29.5C24 26.5 25.5 24 24 22.5Z"
        fill="#FE80C9"
        opacity="0.9"
      />
    </svg>
  );
}

export function Logo({ className, showWordmark = true, size = "md" }: LogoProps) {
  const s = sizes[size];

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={s.mark} />
      {showWordmark && (
        <span className={cn("font-display font-bold text-primary leading-none", s.text)}>
          TumaHelper
        </span>
      )}
    </span>
  );
}
