import { NAMEDAYS_DATA } from "./namedays-data";

const MONTH_LENGTHS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const POLISH_DAYS = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

/**
 * Parses a local namedays file: 12 lines (months 1–12), days separated by "|",
 * in order from day 1. Returns a map "MM-DD" -> names.
 */
export function parseNamedaysText(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = text.trim().split("\n");
  if (lines.length !== 12) {
    throw new Error(`Expected 12 lines (months), got ${lines.length}`);
  }
  lines.forEach((line, monthIndex) => {
    const days = line.split("|");
    if (days.length !== MONTH_LENGTHS[monthIndex]) {
      throw new Error(
        `Month ${monthIndex + 1}: expected ${MONTH_LENGTHS[monthIndex]} days, got ${days.length}`,
      );
    }
    const month = String(monthIndex + 1).padStart(2, "0");
    days.forEach((names, dayIndex) => {
      const day = String(dayIndex + 1).padStart(2, "0");
      result[`${month}-${day}`] = names;
    });
  });
  return result;
}

/** "MM-DD" key for a date, in local time. */
export function formatDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

/** Polish day name (capitalized, e.g. "Wtorek") and full date ("29 września 2026"). */
export function formatDatePl(date: Date): {
  dayName: string;
  fullDate: string;
} {
  const dayName = POLISH_DAYS[(date.getDay() + 6) % 7] ?? "";
  const fullDate = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return { dayName, fullDate };
}

/** Names for a "MM-DD" key, or null when there is no entry. */
export function getNamedays(dateKey: string): string | null {
  return NAMEDAYS_DATA[dateKey] ?? null;
}