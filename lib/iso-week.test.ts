import { describe, expect, it } from "vitest";
import { getIsoWeek } from "./iso-week";

describe("getIsoWeek", () => {
  it("returns the ISO week of the design reference date (Tue, 29 Sep 2026)", () => {
    expect(getIsoWeek(new Date(2026, 8, 29))).toBe(40);
  });

  it("handles year boundaries", () => {
    expect(getIsoWeek(new Date(2027, 0, 1))).toBe(53);
    expect(getIsoWeek(new Date(2026, 0, 1))).toBe(1);
  });
});
