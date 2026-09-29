import { describe, expect, it } from "vitest";

import { dayProgress } from "./day-progress";

describe("dayProgress", () => {
  it("is 0 at midnight", () => {
    const { percent, seconds } = dayProgress(new Date(2026, 8, 29, 0, 0, 0));
    expect(percent).toBe(0);
    expect(seconds).toBe(0);
  });

  it("is 50 at noon", () => {
    const { percent } = dayProgress(new Date(2026, 8, 29, 12, 0, 0));
    expect(percent).toBe(50);
  });

  it("is almost 100 at 23:59:59", () => {
    const { percent } = dayProgress(new Date(2026, 8, 29, 23, 59, 59));
    expect(percent).toBeGreaterThan(99.99);
    expect(percent).toBeLessThan(100);
  });

  it("counts seconds of the day", () => {
    const { seconds } = dayProgress(new Date(2026, 8, 29, 1, 30, 0));
    expect(seconds).toBe(5400);
  });
});