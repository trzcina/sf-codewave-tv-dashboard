import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

import { revalidateTag } from "next/cache";
import { POST } from "./route";

const KEY = "test-editor-key";

function request(headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/flotiq/revalidate", { method: "POST", headers });
}

describe("POST /api/flotiq/revalidate", () => {
  beforeEach(() => vi.stubEnv("FLOTIQ_CLIENT_AUTH_KEY", KEY));
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("rejects a request without x-editor-key", async () => {
    const res = await POST(request());
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a wrong x-editor-key", async () => {
    const res = await POST(request({ "x-editor-key": "wrong" }));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects everything when FLOTIQ_CLIENT_AUTH_KEY is not configured", async () => {
    vi.stubEnv("FLOTIQ_CLIENT_AUTH_KEY", "");
    const res = await POST(request({ "x-editor-key": "" }));
    expect(res.status).toBe(401);
  });

  it("invalidates Flotiq content with the correct key", async () => {
    const res = await POST(request({ "x-editor-key": KEY }));
    expect(res.status).toBe(204);
    expect(revalidateTag).toHaveBeenCalledWith("flotiq-content", "max");
  });
});
