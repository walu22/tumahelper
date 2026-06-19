"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationRow {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: { bookingId?: string } | null;
  is_read: boolean;
  created_at: string;
}

function notificationHref(notification: NotificationRow): string | null {
  const bookingId = notification.data?.bookingId;
  if (!bookingId) return null;
  if (notification.type.startsWith("booking_") || notification.type === "payment_confirmed") {
    return `/customer/bookings/${bookingId}`;
  }
  if (
    notification.type === "booking_request" ||
    notification.type === "payment_received" ||
    notification.type === "payment_proof_submitted"
  ) {
    return `/worker/bookings/${bookingId}`;
  }
  return null;
}

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=15");
      const json = await res.json();
      if (!res.ok || !json.success) return;
      const rows = (json.data ?? []) as NotificationRow[];
      setItems(rows);
      setUnreadCount(rows.filter((n) => !n.is_read).length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30_000);
    return () => clearInterval(interval);
  }, [loadNotifications, userId]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setUnreadCount(0);
    setItems((current) => current.map((n) => ({ ...n, is_read: true })));
  }

  async function markOneRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setItems((current) =>
      current.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) loadNotifications();
        }}
        className="relative p-2 rounded-full hover:bg-surface transition-colors"
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(100vw-2rem,22rem)] rounded-xl border border-border bg-card shadow-lg z-50">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">Loading…</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                No notifications yet
              </p>
            ) : (
              <ul>
                {items.map((notification) => {
                  const href = notificationHref(notification);
                  const content = (
                    <>
                      <p className="text-sm font-medium leading-snug">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </>
                  );

                  return (
                    <li
                      key={notification.id}
                      className={cn(
                        "border-b border-border last:border-b-0",
                        !notification.is_read && "bg-primary/5"
                      )}
                    >
                      {href ? (
                        <Link
                          href={href}
                          className="block px-4 py-3 hover:bg-surface/60 transition-colors"
                          onClick={() => {
                            if (!notification.is_read) markOneRead(notification.id);
                            setOpen(false);
                          }}
                        >
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="block w-full text-left px-4 py-3 hover:bg-surface/60 transition-colors"
                          onClick={() => {
                            if (!notification.is_read) markOneRead(notification.id);
                          }}
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
