import { redirect } from "next/navigation";
import { signIn, AuthError } from "@/lib/auth/login";
import { LOGIN_ACCOUNTS, isDevBypassEnabled } from "@/lib/auth/config";

export default function DevLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  async function devLoginAction(formData: FormData) {
    "use server";

    const phone = String(formData.get("phone") || "");
    const account = LOGIN_ACCOUNTS.find((item) => item.phone === phone);

    if (!account) {
      redirect("/dev-login?error=Unknown+phone+number");
    }

    if (!isDevBypassEnabled()) {
      redirect(`/login?email=${encodeURIComponent(account.email)}`);
    }

    let result;
    try {
      result = await signIn({ email: account.email, password: "dev123" });
    } catch (error) {
      const message = error instanceof AuthError ? error.message : "Login failed";
      redirect(`/dev-login?error=${encodeURIComponent(message)}`);
    }

    redirect(result.redirect);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full">
        <h1 className="text-xl font-bold mb-2">Dev Login</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isDevBypassEnabled()
            ? "One-click login for local development"
            : "Opens the login page with the account email prefilled"}
        </p>

        {searchParams.error ? (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{searchParams.error}</div>
        ) : null}

        <div className="space-y-2">
          {LOGIN_ACCOUNTS.map((account) => (
            <form key={account.phone} action={devLoginAction}>
              <input type="hidden" name="phone" value={account.phone} />
              <button
                type="submit"
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium capitalize">{account.role}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{account.email}</span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
