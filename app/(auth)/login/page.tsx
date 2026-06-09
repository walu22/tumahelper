import Link from "next/link";
import { loginAction, quickDevLoginAction } from "./actions";
import { SubmitButton, QuickLoginButton } from "./submit-button";

function LoginForm({
  error,
  email,
  redirectTo,
}: {
  error?: string;
  email?: string;
  redirectTo?: string;
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
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="username"
              defaultValue={email || ""}
              placeholder="admin@tumahelper.dev"
              className="w-full border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="dev123"
              className="w-full border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <SubmitButton />
        </form>

        <div className="mt-6 space-y-3">
          <p className="text-xs text-muted-foreground font-medium">Test accounts:</p>
          <div className="text-xs text-muted-foreground space-y-1 mb-3">
            <p>admin@tumahelper.dev / dev123</p>
            <p>worker@tumahelper.dev / dev123</p>
            <p>customer@tumahelper.dev / dev123</p>
          </div>
          <div className="grid gap-2">
            {[
              { label: "Admin", email: "admin@tumahelper.dev" },
              { label: "Worker", email: "worker@tumahelper.dev" },
              { label: "Customer", email: "customer@tumahelper.dev" },
            ].map((account) => (
              <form key={account.email} action={quickDevLoginAction}>
                {redirectTo ? <input type="hidden" name="redirect" value={redirectTo} /> : null}
                <input type="hidden" name="email" value={account.email} />
                <QuickLoginButton label={account.label} email={account.email} />
              </form>
            ))}
          </div>
        </div>

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
    />
  );
}
