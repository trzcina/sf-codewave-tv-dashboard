import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Cache invalidation, called by a Flotiq webhook on publish/update/delete.
 * POST /api/flotiq/revalidate with header `x-editor-key: <FLOTIQ_CLIENT_AUTH_KEY>`.
 * Invalidates everything tagged by the Flotiq Next.js middleware.
 */
export async function POST(req: NextRequest) {
  const editorKey = req.headers.get("x-editor-key") || "";

  if (!process.env.FLOTIQ_CLIENT_AUTH_KEY || editorKey !== process.env.FLOTIQ_CLIENT_AUTH_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  revalidateTag("flotiq-content", "max");
  return new NextResponse(undefined, { status: 204 });
}
