/** Progress through the day since local midnight, in percent (0–100) and seconds. */
export function dayProgress(date: Date): { percent: number; seconds: number } {
  const seconds =
    date.getHours() * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds() +
    date.getMilliseconds() / 1000;
  return {
    seconds,
    percent: (seconds / 86400) * 100,
  };
}