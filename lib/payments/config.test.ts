import { describe, expect, it } from "vitest";
import { getPaymentAccountDetails } from "./config";

describe("payment account config", () => {
  it("returns demo defaults when env is unset", () => {
    const details = getPaymentAccountDetails();
    expect(details.isDemo).toBe(true);
    expect(details.mtnNumber).toBe("097 000 0000");
  });
});
