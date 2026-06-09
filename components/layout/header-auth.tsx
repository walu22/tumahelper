import { getCurrentUser } from "@/lib/auth";
import { Header } from "./header";

export async function HeaderAuth() {
  const user = await getCurrentUser();
  return <Header user={user} />;
}
