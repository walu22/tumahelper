import { redirect } from "next/navigation";
import { PERMANENT_HIRE_HREF } from "@/lib/landing/content";

/** Legacy route — permanent hire content lives on the homepage. */
export default function HirePage() {
  redirect(PERMANENT_HIRE_HREF);
}
