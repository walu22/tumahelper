import Link from "next/link";
import { loginAction } from "./actions";
import { SubmitButton } from "./submit-button";

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
              placeholder="owner@tumahelper.dev"
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
              placeholder="Enter your password"
              className="w-full border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <SubmitButton />
        </form>

        <div className="mt-6 text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Account emails:</p>
          <p>owner@tumahelper.dev — admin</p>
          <p>provider@tumahelper.dev — worker</p>
          <p>client@tumahelper.dev — customer</p>
          <p className="pt-2">Need new passwords? Run: npm run setup:credentials</p>
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
