import Link from "next/link";
import { loginAction, quickDevLoginAction } from "./actions";
import { isDevAuthBypassEnabled } from "@/lib/dev-auth-bypass";

function LoginForm({
  error,
  email,
  redirectTo,
  devLoginEnabled,
}: {
  error?: string;
  email?: string;
  redirectTo?: string;
  devLoginEnabled: boolean;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">TH</span>
          </div>
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground text-sm mt-1">Use your email and password to sign in</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
        )}

        <form action={loginAction} className="space-y-4">
          {redirectTo ? <input type="hidden" name="redirect" value={redirectTo} /> : null}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={email || ""}
              placeholder="you@example.com"
              className="w-full border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white rounded-md py-2 font-medium hover:bg-primary-dark"
          >
            Sign In
          </button>
        </form>

        {devLoginEnabled && (
          <div className="mt-6 space-y-3">
            <p className="text-xs text-muted-foreground font-medium">Quick dev login:</p>
            <div className="grid gap-2">
              {[
                { label: "Admin", email: "admin@tumahelper.dev" },
                { label: "Worker", email: "worker@tumahelper.dev" },
                { label: "Customer", email: "customer@tumahelper.dev" },
              ].map((account) => (
                <form key={account.email} action={quickDevLoginAction}>
                  {redirectTo ? <input type="hidden" name="redirect" value={redirectTo} /> : null}
                  <input type="hidden" name="email" value={account.email} />
                  <button
                    type="submit"
                    className="w-full text-left px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
                  >
                    {account.label}
                    <span className="text-muted-foreground ml-2">{account.email}</span>
                  </button>
                </form>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Password for all dev accounts: dev123</p>
          </div>
        )}

        {!devLoginEnabled && (
          <p className="mt-6 text-xs text-muted-foreground">
            Need a demo account? Ask your admin or use credentials from your Supabase project.
          </p>
        )}

        <p className="mt-4 text-center text-sm">
          <Link href="/dev-login" className="text-primary hover:underline">
            Dev login page
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; email?: string; redirect?: string };
}) {
  return (
    <LoginForm
      error={searchParams.error}
      email={searchParams.email}
      redirectTo={searchParams.redirect}
      devLoginEnabled={isDevAuthBypassEnabled()}
    />
  );
}
