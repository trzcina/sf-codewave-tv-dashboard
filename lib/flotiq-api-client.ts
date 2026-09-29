import { Flotiq } from "@flotiq/flotiq-api-sdk";
import { createNextMiddleware } from "@flotiq/nextjs-addon";

/**
 * Single shared Flotiq client. Import it everywhere; never create a client per route.
 *
 * The Next.js middleware:
 * - tags every request with `flotiq-content` and `flotiq-content-<ctd>` (see the revalidate route),
 * - caches responses for 1 day by default — except in Vercel PR previews (see below),
 * - switches to draft content (`x-mode: preview`) when Next.js draft mode is on,
 * - disables caching in development and for write requests.
 */
export const flotiqApiClient = new Flotiq({
  apiKey: process.env.FLOTIQ_API_KEY,
  // PR previews get no revalidation webhook (it points at production), so they read Flotiq fresh.
  middleware: [createNextMiddleware(process.env.VERCEL_ENV === "preview" ? { revalidateTime: 0 } : {})],
});

export const isFlotiqConfigured = Boolean(process.env.FLOTIQ_API_KEY);
