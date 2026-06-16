import { describe, expect, it } from "vitest";
import { normalizeZambianPhone } from "@/lib/validations";

describe("normalizeZambianPhone", () => {
  it("converts local 0-prefix numbers to E.164", () => {
    expect(normalizeZambianPhone("0971234567")).toBe("+260971234567");
  });

  it("keeps +260 numbers unchanged", () => {
    expect(normalizeZambianPhone("+260971234567")).toBe("+260971234567");
  });

  it("strips spaces", () => {
    expect(normalizeZambianPhone("097 123 4567")).toBe("+260971234567");
  });
});
