import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { loginAction } from "./actions";
import { SubmitButton } from "./submit-button";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; email?: string; redirect?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-md p-8">
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
