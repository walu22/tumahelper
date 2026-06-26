import { redirect } from "next/navigation";
import {
  LOGIN_ACCOUNTS,
  ROLE_REDIRECTS,
  isDevBypassEnabled,
} from "@/lib/auth/config";
import {
  getDevAccountAliases,
  isDevLoginPageEnabled,
  signInAsDevAccount,
} from "@/lib/auth/dev-login";

export default function DevLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  if (!isDevLoginPageEnabled()) {
    redirect("/login");
  }

  async function devLoginAction(formData: FormData) {
    "use server";

    if (!isDevLoginPageEnabled()) {
      redirect("/login");
    }

    const phone = String(formData.get("phone") || "");
    const redirectTo = String(formData.get("redirect") || "") || null;
    const account = LOGIN_ACCOUNTS.find((item) => item.phone === phone);

    if (!account) {
      redirect("/dev-login?error=Unknown+account");
    }

    const result = signInAsDevAccount(account, redirectTo);
    redirect(result.redirect);
  }

  const usingSupabaseLogin = !isDevBypassEnabled();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="bg-card p-8 rounded-2xl shadow-md max-w-md w-full border border-border/70">
        <h1 className="text-xl font-bold mb-2">Dev Login</h1>
        <p className="text-sm text-muted-foreground mb-2">
          One-click login for local development. Password for manual login:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">dev123</code>
        </p>
        {usingSupabaseLogin ? (
          <p className="text-xs text-muted-foreground mb-6">
            Supabase is configured, but these buttons still use local dev sessions so
            you can test every role without seeding auth first.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mb-6">
            No Supabase auth required on this page.
          </p>
        )}

        {searchParams.error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {searchParams.error}
          </div>
        ) : null}

        <div className="space-y-3">
          {LOGIN_ACCOUNTS.map((account) => {
            const aliases = getDevAccountAliases(account);
            const destination = ROLE_REDIRECTS[account.role] ?? "/";

            return (
              <form key={account.phone} action={devLoginAction}>
                <input type="hidden" name="phone" value={account.phone} />
                {searchParams.redirect ? (
                  <input type="hidden" name="redirect" value={searchParams.redirect} />
                ) : null}
                <button
                  type="submit"
                  className="w-full rounded-xl border border-border/70 p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium capitalize">{account.role}</p>
                      <p className="mt-0.5 text-sm text-foreground">{account.full_name}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {aliases.join(" · ")}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                      Open
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Goes to {destination}
                  </p>
                </button>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
