import { describe, expect, it } from "vitest";

import { NAMEDAYS_DATA } from "./namedays-data";
import {
  formatDateKey,
  formatDatePl,
  getNamedays,
  parseNamedaysText,
} from "./namedays";

describe("parseNamedaysText", () => {
  it("parses a sample of the real file format", () => {
    const sample = [
      "Mieczysława, Mieszka, Masława|Izydora, Bazylego, Grzegorza|Trzeci|" +
      Array(28).fill("Styczeń").join("|"),
      Array(29).fill("Luty").join("|"),
      Array(31).fill("Marzec").join("|"),
      Array(30).fill("Kwiecień").join("|"),
      Array(31).fill("Maj").join("|"),
      Array(30).fill("Czerwiec").join("|"),
      Array(31).fill("Lipiec").join("|"),
      Array(31).fill("Sierpień").join("|"),
      Array(30).fill("Wrzesień").join("|"),
      Array(31).fill("Październik").join("|"),
      Array(30).fill("Listopad").join("|"),
      Array(31).fill("Grudzień").join("|"),
    ].join("\n");
    const map = parseNamedaysText(sample);
    expect(map["01-01"]).toBe("Mieczysława, Mieszka, Masława");
    expect(map["01-02"]).toBe("Izydora, Bazylego, Grzegorza");
    expect(map["01-03"]).toBe("Trzeci");
    expect(map["02-29"]).toBe("Luty");
    expect(map["12-31"]).toBe("Grudzień");
    expect(Object.keys(map)).toHaveLength(366);
  });

  it("rejects wrong line or day counts", () => {
    expect(() => parseNamedaysText("a|b\nc|d")).toThrow();
    expect(() => parseNamedaysText(Array(12).fill("a|b|c").join("\n"))).toThrow();
  });
});

describe("NAMEDAYS_DATA (parsed from the local file)", () => {
  it("has 366 days and the known entries", () => {
    expect(Object.keys(NAMEDAYS_DATA)).toHaveLength(366);
    expect(NAMEDAYS_DATA["01-01"]).toBe("Mieczysława, Mieszka, Masława");
    expect(NAMEDAYS_DATA["12-31"]).toBe("Sylwestra, Melanii, Mariusza");
    expect(NAMEDAYS_DATA["02-29"]).toBe("Lutosława, Romana");
    expect(NAMEDAYS_DATA["09-29"]).toBe("Michała, Gabriela, Rafała");
  });
});

describe("getNamedays", () => {
  it("returns names for a known key and null otherwise", () => {
    expect(getNamedays("09-29")).toBe("Michała, Gabriela, Rafała");
    expect(getNamedays("02-30")).toBeNull();
  });
});

describe("formatDateKey", () => {
  it("formats MM-DD in local time", () => {
    expect(formatDateKey(new Date(2026, 8, 29))).toBe("09-29");
    expect(formatDateKey(new Date(2026, 0, 1))).toBe("01-01");
    expect(formatDateKey(new Date(2026, 11, 31))).toBe("12-31");
  });
});

describe("formatDatePl", () => {
  it("returns Polish weekday (capitalized) and full date", () => {
    // Tue, Sep 29 2026
    const result = formatDatePl(new Date(2026, 8, 29, 18, 5));
    expect(result.dayName).toBe("Wtorek");
    expect(result.fullDate).toBe("29 września 2026");
    expect(formatDatePl(new Date(2026, 0, 1)).dayName).toBe("Czwartek");
  });
});