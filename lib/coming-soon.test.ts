import { describe, expect, it, afterEach } from "vitest";
import {
  isComingSoonEnabled,
  isComingSoonExemptPath,
  isStaticAssetPath,
  previewTokenMatches,
} from "./coming-soon";

describe("coming soon", () => {
  afterEach(() => {
    delete process.env.COMING_SOON;
    delete process.env.COMING_SOON_BYPASS_SECRET;
  });

  it("is disabled unless COMING_SOON=true", () => {
    expect(isComingSoonEnabled()).toBe(false);
    process.env.COMING_SOON = "true";
    expect(isComingSoonEnabled()).toBe(true);
  });

  it("exempts the coming soon page and static assets", () => {
    expect(isComingSoonExemptPath("/coming-soon")).toBe(true);
    expect(isStaticAssetPath("/logo.svg")).toBe(true);
    expect(isComingSoonExemptPath("/")).toBe(false);
  });

  it("matches preview bypass tokens only when a secret is configured", () => {
    process.env.COMING_SOON_BYPASS_SECRET = "dev-preview-key";
    expect(previewTokenMatches("dev-preview-key")).toBe(true);
    expect(previewTokenMatches("wrong")).toBe(false);
  });
});
