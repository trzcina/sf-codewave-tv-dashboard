/** ISO-8601 week number (1–53) of a date, in local time. */
export function getIsoWeek(date: Date): number {
  const target = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  // ISO week 1 contains the first Thursday of the year; align to Thursday
  // of the current week (Monday = day 1).
  const dayNr = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDayNr = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDayNr + 3);
  return (
    1 + Math.round((target.getTime() - firstThursday.getTime()) / 604800000)
  );
}
