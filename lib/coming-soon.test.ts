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
    delete process.env.VERCEL_ENV;
  });

  it("is disabled locally and on preview deploys", () => {
    expect(isComingSoonEnabled()).toBe(false);
    process.env.VERCEL_ENV = "preview";
    expect(isComingSoonEnabled()).toBe(false);
  });

  it("is enabled when COMING_SOON=true or on Vercel production", () => {
    process.env.COMING_SOON = "true";
    expect(isComingSoonEnabled()).toBe(true);

    delete process.env.COMING_SOON;
    process.env.VERCEL_ENV = "production";
    expect(isComingSoonEnabled()).toBe(true);
  });

  it("can be turned off on production with COMING_SOON=false", () => {
    process.env.VERCEL_ENV = "production";
    process.env.COMING_SOON = "false";
    expect(isComingSoonEnabled()).toBe(false);
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
