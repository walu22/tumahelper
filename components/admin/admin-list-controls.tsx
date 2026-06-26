import { Suspense } from "react";
import {
  AdminListToolbar,
  type AdminListToolbarProps,
} from "@/components/admin/admin-list-toolbar";

export function AdminListControls(props: AdminListToolbarProps) {
  return (
    <Suspense fallback={<div className="h-10 animate-pulse rounded-xl bg-muted/50" />}>
      <AdminListToolbar {...props} />
    </Suspense>
  );
}
