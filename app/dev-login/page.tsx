import { redirect } from "next/navigation";
import { getDevAccountByPhone, isDevAuthBypassEnabled, setDevSessionInCookies, DEV_PASSWORD } from "@/lib/dev-auth-bypass";
import { ensureDevAuthUser, getDevEmail, ROLE_REDIRECTS } from "@/lib/dev-auth";
import { getRouteHandlerClient } from "@/lib/supabase";

const ACCOUNTS = [
  { label: "Worker", phone: "+260961111111" },
  { label: "Customer", phone: "+260976666666" },
  { label: "Admin", phone: "+260970000001" },
];

const PHONE_ROLES: Record<string, string> = {
  "+260961111111": "worker",
  "+260962222222": "worker",
  "+260963333333": "worker",
  "+260964444444": "worker",
  "+260965555555": "worker",
  "+260966666666": "worker",
  "+260967777777": "worker",
  "+260968888888": "worker",
  "+260969999999": "worker",
  "+260960000000": "worker",
  "+260976666666": "customer",
  "+260977777777": "customer",
  "+260978888888": "customer",
  "+260970000004": "customer",
  "+260970000005": "customer",
  "+260970000001": "admin",
};

async function loginByPhone(phone: string) {
  if (!PHONE_ROLES[phone]) {
    redirect("/dev-login?error=Invalid+phone");
  }

  if (isDevAuthBypassEnabled()) {
    const account = getDevAccountByPhone(phone);
    if (!account) {
      redirect(`/dev-login?error=${encodeURIComponent(`No dev account for ${phone}`)}`);
    }
    setDevSessionInCookies(account);
    redirect(ROLE_REDIRECTS[account.role] || "/dashboard");
  }

  const role = PHONE_ROLES[phone];
  const email = getDevEmail(role, phone);
  await ensureDevAuthUser({ email, password: DEV_PASSWORD, role, phone });

  const supabase = getRouteHandlerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: DEV_PASSWORD });
  if (error) {
    redirect(`/dev-login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(ROLE_REDIRECTS[role] || "/dashboard");
}

export default function DevLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  async function devLoginAction(formData: FormData) {
    "use server";
    await loginByPhone(String(formData.get("phone") || ""));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Dev Login</h1>
        <p className="text-sm text-muted-foreground mb-4">Click a user to log in instantly:</p>

        {searchParams.error ? (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{searchParams.error}</div>
        ) : null}

        <div className="space-y-2">
          {ACCOUNTS.map((account) => (
            <form key={account.phone} action={devLoginAction}>
              <input type="hidden" name="phone" value={account.phone} />
              <button
                type="submit"
                className="w-full text-left block p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <span className="font-medium">{account.label}</span>
                <span className="text-xs text-muted-foreground ml-2">{account.phone}</span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
