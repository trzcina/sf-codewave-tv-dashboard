import { describe, expect, it } from "vitest";

import { pickSlogan, pickSlogans, rotateSlogans } from "./slogans";

const LIST = [
  { text: "A", active: true, order: 2 },
  { text: "B", active: true, order: 1 },
  { text: "C", active: false, order: 0 },
  { text: "D" },
];

describe("pickSlogans", () => {
  it("keeps only active, sorted by order", () => {
    expect(pickSlogans(LIST).map((s) => s.text)).toEqual(["B", "A", "D"]);
  });
});

describe("rotateSlogans", () => {
  it("returns index 0 and null with no slogans", () => {
    expect(rotateSlogans([], 15, 100)).toEqual({
      text: null,
      index: 0,
      count: 0,
    });
  });

  it("stays at index 0 when rotation is off", () => {
    expect(rotateSlogans(LIST, 0, 500)).toEqual({
      text: "B",
      index: 0,
      count: 3,
    });
    expect(rotateSlogans(LIST, 15, 500).index).toBe(0);
  });

  it("rotates every rotateSeconds and wraps around", () => {
    const active = pickSlogans(LIST);
    expect(rotateSlogans(LIST, 15, 0).index).toBe(0);
    expect(rotateSlogans(LIST, 15, 14).text).toBe("B");
    expect(rotateSlogans(LIST, 15, 15).text).toBe("A");
    expect(rotateSlogans(LIST, 15, 30).text).toBe("D");
    expect(rotateSlogans(LIST, 15, 45).text).toBe("B");
    expect(active).toHaveLength(3);
  });
});

describe("pickSlogan", () => {
  it("returns index and count", () => {
    expect(pickSlogan(LIST, 20, 15)).toEqual({ index: 1, count: 3 });
    expect(pickSlogan(LIST, 0, 15)).toEqual({ index: 0, count: 3 });
  });
});