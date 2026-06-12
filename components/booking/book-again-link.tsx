import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookAgainLabel } from "@/lib/bookings/book-again";

export function BookAgainLink({
  href,
  workerName,
  className = "",
  size = "default",
}: {
  href: string;
  workerName?: string | null;
  className?: string;
  size?: "default" | "sm";
}) {
  return (
    <Button
      asChild
      variant="outline"
      size={size}
      className={`rounded-full gap-2 ${className}`.trim()}
    >
      <Link href={href}>
        <RotateCcw className="h-4 w-4" />
        {bookAgainLabel(workerName)}
      </Link>
    </Button>
  );
}
