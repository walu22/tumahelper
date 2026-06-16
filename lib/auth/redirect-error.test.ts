import { describe, expect, it } from "vitest";
import { isNextRedirectError } from "./redirect-error";

describe("isNextRedirectError", () => {
  it("detects Next.js redirect digest", () => {
    expect(
      isNextRedirectError({ digest: "NEXT_REDIRECT;replace;/onboarding/worker" })
    ).toBe(true);
  });

  it("returns false for normal errors", () => {
    expect(isNextRedirectError(new Error("Registration failed"))).toBe(false);
    expect(isNextRedirectError(null)).toBe(false);
  });
});
