import { describe, expect, it } from "vitest";
import { parseStored } from "./persisted-state";

describe("parseStored", () => {
  const fallback = { best: 0 };

  it("returns the fallback when nothing is stored", () => {
    expect(parseStored(null, fallback)).toBe(fallback);
  });

  it("returns the fallback for malformed JSON", () => {
    expect(parseStored("{not json", fallback)).toBe(fallback);
  });

  it("returns the parsed value", () => {
    expect(parseStored('{"best":7}', fallback)).toEqual({ best: 7 });
  });
});
