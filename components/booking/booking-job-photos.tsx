"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingJobPhotosProps {
  files: File[];
  onChange: (files: File[]) => void;
  id?: string;
}

export function BookingJobPhotos({ files, onChange, id = "booking-job-photos" }: BookingJobPhotosProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(next: FileList | null) {
    if (!next?.length) return;
    const merged = [...files, ...Array.from(next)].slice(0, 4);
    onChange(merged);
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={id} className="text-sm font-medium mb-1 block">
          Photos (optional)
        </label>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Add photos of the issue if you have them. This helps TumaHelper review specialist jobs faster.
        </p>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      {files.length < 4 && (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Add photos
        </Button>
      )}
    </div>
  );
}

export async function uploadBookingJobPhotos(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];

  const formData = new FormData();
  for (const file of files) {
    formData.append("photos", file);
  }

  const res = await fetch("/api/uploads/booking-photos", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Could not upload photos");
  }

  return (data.data?.urls as string[]) ?? [];
}

export function appendPhotoUrlsToDescription(description: string, urls: string[]): string {
  if (urls.length === 0) return description;
  const block = ["Job photos:", ...urls.map((url) => `- ${url}`)].join("\n");
  const trimmed = description.trim();
  return trimmed ? `${trimmed}\n\n${block}` : block;
}
