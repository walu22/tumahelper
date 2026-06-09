import { User, UserRole } from "@/types";
import { NextResponse } from "next/server";
import { resolveUserFromCookies } from "@/lib/auth/session";

export async function getCurrentUser(): Promise<User | null> {
  return resolveUserFromCookies();
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: UserRole | UserRole[]): Promise<User> {
  const user = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];

  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  return requireRole("admin");
}

export const requireUser = requireAuth;

export async function createAuditLog(params: {
  action: string
  entityType: string
  entityId: string
  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>
  adminId?: string
}) {
  const { getRouteHandlerClient } = await import('./supabase')
  const supabase = getRouteHandlerClient()
  await supabase.from('audit_logs').insert({
    admin_id: params.adminId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    old_value: params.oldValue || null,
    new_value: params.newValue || null,
  })
}

export async function createNotification(params: {
  userId: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
}) {
  const { getAdminClient } = await import('./supabase')
  const supabase = getAdminClient()
  await supabase.from('notifications').insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    data: params.data || null,
  })
}

export async function requireCustomer(): Promise<User> {
  return requireRole(["customer", "employer"]);
}

export async function requireWorker(): Promise<User> {
  return requireRole("worker");
}

export async function requireEmployer(): Promise<User> {
  return requireRole("employer");
}

// AuthResult pattern for routes that prefer not to throw
export interface AuthResult {
  user: User | null;
  error: string | null;
}

async function wrap<T>(fn: () => Promise<T>): Promise<AuthResult> {
  try { const r = await fn(); return { user: r as unknown as User, error: null }; }
  catch (e: any) { return { user: null, error: e.message }; }
}

export const requireAuthResult = () => wrap(requireAuth);
export const requireAdminResult = () => wrap(requireAdmin);
export const requireCustomerResult = () => wrap(requireCustomer);
export const requireWorkerResult = () => wrap(requireWorker);
export const requireEmployerResult = () => wrap(requireEmployer);

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
    { status: 401 }
  );
}

export function forbiddenResponse() {
  return NextResponse.json(
    { success: false, error: { code: "FORBIDDEN", message: "Insufficient permissions" } },
    { status: 403 }
  );
}

export function errorResponse(code: string, message: string, status: number = 400) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}

export function successResponse<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  });
}
