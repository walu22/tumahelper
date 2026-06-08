"use client";

interface TrustScoreBadgeProps {
  score: number;
  isProvisional?: boolean;
  size?: "sm" | "md" | "lg";
}

export function TrustScoreBadge({ score, isProvisional = false, size = "md" }: TrustScoreBadgeProps) {
  const getLabel = () => {
    if (isProvisional) return "New";
    if (score >= 90) return "Exceptional";
    if (score >= 75) return "Trusted";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getColor = () => {
    if (isProvisional) return "bg-gray-100 text-gray-600 border-gray-300";
    if (score >= 90) return "bg-green-100 text-green-800 border-green-300";
    if (score >= 75) return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 transform -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-200"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={isProvisional ? "text-gray-400" : score >= 75 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500"}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {score}
        </span>
      </div>
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium ${getColor()} ${sizeClasses[size]}`}>
        {getLabel()}
      </span>
    </div>
  );
}
