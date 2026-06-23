/** Watch demos and local e2e should hit localhost — not Vercel previews behind auth. */
export function assertPlaywrightRunsLocally(baseURL: string): void {
  let host: string;
  try {
    host = new URL(baseURL).hostname;
  } catch {
    throw new Error(`Invalid PLAYWRIGHT base URL: ${baseURL}`);
  }

  if (host === "localhost" || host === "127.0.0.1") return;

  throw new Error(
    [
      `Playwright is pointed at ${baseURL}, which is not localhost.`,
      "Vercel preview deployments with protection redirect to login (GitHub OAuth), so booking headings never appear.",
      "",
      "Fix:",
      "  1. Unset PLAYWRIGHT_BASE_URL in your shell / .env",
      "  2. Run: npx playwright test e2e/watch-demo.spec.ts --headed --project=chromium",
      "     (Playwright will start the dev server on http://localhost:3002)",
      "",
      "Or explicitly:",
      "  $env:PLAYWRIGHT_BASE_URL=\"http://localhost:3002\"   # PowerShell",
      "  PLAYWRIGHT_BASE_URL=http://localhost:3002 npx playwright test ...  # bash",
    ].join("\n")
  );
}
