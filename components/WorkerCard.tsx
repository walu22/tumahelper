"use client";

/* eslint-disable @next/next/no-img-element */

import { PublicWorkerProfile } from "@/types";
import { TrustScoreBadge } from "./TrustScoreBadge";
import { VerificationBadge } from "./VerificationBadge";
import { MapPin, Star, Briefcase } from "lucide-react";
import Link from "next/link";

interface WorkerCardProps {
  worker: PublicWorkerProfile;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <Link href={`/workers/${worker.id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-100 h-full">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
            {worker.profile_photo_url ? (
              <img
                src={worker.profile_photo_url}
                alt={worker.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                {worker.full_name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 truncate">{worker.full_name}</h3>
              <TrustScoreBadge
                score={worker.trust_score}
                isProvisional={worker.is_provisional}
                size="sm"
              />
            </div>
            
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{worker.area}, {worker.city}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <VerificationBadge level={worker.verification_level} size="sm" />
              <span className="text-xs text-gray-500 capitalize truncate">{worker.category.replace("_", " ")}</span>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                <span className="font-medium">{worker.average_rating.toFixed(1)}</span>
                <span className="text-gray-400">({worker.total_reviews})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Briefcase className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{worker.total_jobs_completed} jobs</span>
              </div>
            </div>
            
            {worker.skills && worker.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {worker.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {skill.replace("_", " ")}
                  </span>
                ))}
                {worker.skills.length > 3 && (
                  <span className="text-xs text-gray-400">+{worker.skills.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
