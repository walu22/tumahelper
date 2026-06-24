"use client";

import { useEffect, useState } from "react";

const DEFAULT_TICK_MS = 30_000;

/** Re-render on a timer so same-day slot lists stay current while the user is on the form. */
export function useScheduleClock(tickMs: number = DEFAULT_TICK_MS): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);

  return now;
}
