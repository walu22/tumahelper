"use client";

import { useState } from "react";
import { Crosshair, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { LocationCoords } from "@/lib/lusaka/geolocation";
import {
  geolocationFailureMessage,
  getCurrentPosition,
  isWithinLusakaBbox,
  type GeolocationFailure,
} from "@/lib/lusaka/geolocation";

interface UseCurrentLocationButtonProps {
  onResult: (result: { streetAddress: string; coords: LocationCoords }) => void;
  className?: string;
}

export function UseCurrentLocationButton({
  onResult,
  className,
}: UseCurrentLocationButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const position = await getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      if (!isWithinLusakaBbox(lat, lng)) {
        toast.error(geolocationFailureMessage("outside_lusaka"));
        return;
      }

      const response = await fetch(
        `/api/addresses/reverse?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`
      );
      const data = (await response.json()) as {
        result?: { streetAddress: string; lat: number; lng: number };
        error?: string;
      };

      if (!response.ok || !data.result) {
        toast.error(
          response.status === 400 && data.error
            ? data.error
            : geolocationFailureMessage("reverse_geocode_failed")
        );
        return;
      }

      onResult({
        streetAddress: data.result.streetAddress,
        coords: { lat: data.result.lat, lng: data.result.lng },
      });
      toast.success("Location found. Confirm your address to continue.");
    } catch (error) {
      const code = (error as Error).message as GeolocationFailure;
      toast.error(geolocationFailureMessage(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => void handleClick()}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Crosshair className="mr-2 h-4 w-4" />
      )}
      {loading ? "Finding your location..." : "Use my current location"}
    </Button>
  );
}
