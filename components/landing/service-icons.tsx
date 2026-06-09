import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function NannyServiceIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="9" cy="7.5" r="2.25" />
      <path d="M5.5 18v-1.25c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5V18" />
      <circle cx="16.75" cy="8.75" r="1.75" />
      <path d="M14.25 18v-1c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5V18" />
      <path d="M12 13.25c.75-.75 1.75-1.15 2.75-1.15s2 .4 2.75 1.15" />
    </svg>
  );
}

export function HouseCleaningIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M4.5 10.75 12 5l7.5 5.75V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18v-7.25Z" />
      <path d="M10 19.5V13h4v6.5" />
      <path d="M16.25 7.5 17.75 6" />
      <path d="M18.75 5.25l1.5.75" />
      <path d="M19.5 8.75h1.5" />
      <path d="M17.75 10.25l.75 1.25" />
    </svg>
  );
}

export function FullTimeJobsIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="3.75" y="5.5" width="16.5" height="14.5" rx="2" />
      <path d="M8 4v3.25M16 4v3.25M3.75 10.25h16.5" />
      <path d="M8.75 14.25 10.75 16.25 15.75 12.25" />
    </svg>
  );
}
