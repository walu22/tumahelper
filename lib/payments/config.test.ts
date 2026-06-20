import { describe, expect, it } from "vitest";
import { getPaymentAccountDetails } from "./config";

describe("payment account config", () => {
  it("formats the production Airtel number when env is unset", () => {
    const details = getPaymentAccountDetails();
    expect(details.isDemo).toBe(false);
    expect(details.airtelNumber).toBe("097 282 6732");
    expect(details.accountName).toBe("");
  });
});
