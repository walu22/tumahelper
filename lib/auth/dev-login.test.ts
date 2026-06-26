import { describe, expect, it, afterEach } from "vitest";
import {
  getDevAccountAliases,
  isDevLoginPageEnabled,
} from "./dev-login";
import { LOGIN_ACCOUNTS } from "./config";

describe("dev login", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalAllowDevLogin = process.env.ALLOW_DEV_LOGIN;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalAllowDevLogin === undefined) {
      delete process.env.ALLOW_DEV_LOGIN;
    } else {
      process.env.ALLOW_DEV_LOGIN = originalAllowDevLogin;
    }
  });

  it("is enabled in development", () => {
    process.env.NODE_ENV = "development";
    delete process.env.ALLOW_DEV_LOGIN;
    expect(isDevLoginPageEnabled()).toBe(true);
  });

  it("is disabled in production unless ALLOW_DEV_LOGIN is set", () => {
    process.env.NODE_ENV = "production";
    delete process.env.ALLOW_DEV_LOGIN;
    expect(isDevLoginPageEnabled()).toBe(false);

    process.env.ALLOW_DEV_LOGIN = "true";
    expect(isDevLoginPageEnabled()).toBe(true);
  });

  it("exposes admin aliases for the admin dev account", () => {
    const admin = LOGIN_ACCOUNTS.find((account) => account.role === "admin");
    expect(admin).toBeTruthy();
    expect(getDevAccountAliases(admin!)).toEqual([
      "admin@tumahelper.dev",
      "owner@tumahelper.dev",
    ]);
  });
});
