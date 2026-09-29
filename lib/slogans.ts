export type Slogan = { text: string; active?: boolean; order?: number };

/** Active slogans sorted by `order` (ascending); order-less items last. */
export function pickSlogans(slogans: Slogan[]): Slogan[] {
  return [...slogans]
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
}

/**
 * Current slogan state: only active slogans, sorted by `order`, rotating
 * every `rotateSeconds` of `elapsedSeconds`. With no rotation or no slogans,
 * index is 0.
 */
export function rotateSlogans(
  slogans: Slogan[],
  rotateSeconds: number,
  elapsedSeconds: number,
): { text: string | null; index: number; count: number } {
  const active = pickSlogans(slogans);
  const count = active.length;
  if (count === 0) {
    return { text: null, index: 0, count: 0 };
  }
  if (!rotateSeconds || rotateSeconds <= 0) {
    return { text: active[0]!.text, index: 0, count };
  }
  const index = Math.floor(elapsedSeconds / rotateSeconds) % count;
  return { text: active[index]!.text, index, count };
}

/** Index (and count) of the currently displayed slogan. */
export function pickSlogan(
  slogans: Slogan[],
  elapsed: number,
  rotateSeconds: number,
): { index: number; count: number } {
  const { index, count } = rotateSlogans(slogans, rotateSeconds, elapsed);
  return { index, count };
}