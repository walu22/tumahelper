import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { LOGIN_ACCOUNTS, isDevBypassEnabled } from "@/lib/auth/config";
import { loginAction } from "./actions";
import { SubmitButton } from "./submit-button";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; email?: string; redirect?: string };
}) {
  const devMode = isDevBypassEnabled();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LogoMark size={48} />
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Sign in to manage bookings, workers, and your account
            </p>
          </div>

          {searchParams.error ? (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {searchParams.error}
            </div>
          ) : null}

          <form action={loginAction} className="space-y-4">
            {searchParams.redirect ? (
              <input type="hidden" name="redirect" value={searchParams.redirect} />
            ) : null}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                defaultValue={searchParams.email || ""}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <SubmitButton />
          </form>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm border p-5 text-sm">
          <p className="font-medium mb-3">Demo accounts</p>
          <ul className="space-y-2 text-muted-foreground">
            {LOGIN_ACCOUNTS.map((account) => (
              <li key={account.email} className="flex justify-between gap-4">
                <span className="capitalize">{account.role}</span>
                <span className="text-foreground">{account.email}</span>
              </li>
            ))}
            <li className="text-xs pt-1">Legacy aliases also work: admin@, worker@, customer@tumahelper.dev</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            {devMode
              ? "Dev mode password: dev123"
              : "Run npm run setup:credentials to reset passwords"}
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          No account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
