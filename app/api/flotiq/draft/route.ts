import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Toggle draft mode: /api/flotiq/draft?key=<FLOTIQ_CLIENT_AUTH_KEY>[&draft=true|false][&redirect=/path]
 */
export async function GET(req: NextRequest) {
  const editorKey = req.nextUrl.searchParams.get("key") || "";
  const redirectPath = req.nextUrl.searchParams.get("redirect") || "/";

  if (!process.env.FLOTIQ_CLIENT_AUTH_KEY || editorKey !== process.env.FLOTIQ_CLIENT_AUTH_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const draftState = await draftMode();
  const enable = req.nextUrl.searchParams.has("draft")
    ? req.nextUrl.searchParams.get("draft") === "true"
    : !draftState.isEnabled;

  if (enable) {
    draftState.enable();
  } else {
    draftState.disable();
  }

  // Only allow relative redirects to avoid an open redirect.
  redirect(redirectPath.startsWith("/") && !redirectPath.startsWith("//") ? redirectPath : "/");
}
