import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const draft = { isEnabled: false, enable: vi.fn(), disable: vi.fn() };

vi.mock("next/headers", () => ({ draftMode: async () => draft }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

import { GET } from "./route";

const KEY = "test-editor-key";

function request(query: string) {
  return new NextRequest(`http://localhost/api/flotiq/draft?${query}`);
}

describe("GET /api/flotiq/draft", () => {
  beforeEach(() => {
    vi.stubEnv("FLOTIQ_CLIENT_AUTH_KEY", KEY);
    draft.isEnabled = false;
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("rejects a wrong key", async () => {
    const res = await GET(request("key=wrong"));
    expect(res.status).toBe(401);
    expect(draft.enable).not.toHaveBeenCalled();
  });

  it("rejects everything when FLOTIQ_CLIENT_AUTH_KEY is not configured", async () => {
    vi.stubEnv("FLOTIQ_CLIENT_AUTH_KEY", "");
    const res = await GET(request("key="));
    expect(res.status).toBe(401);
  });

  it("toggles draft mode on and redirects to the given path", async () => {
    await expect(GET(request(`key=${KEY}&redirect=/blog/post`))).rejects.toThrow("REDIRECT:/blog/post");
    expect(draft.enable).toHaveBeenCalled();
  });

  it("disables draft mode with draft=false", async () => {
    draft.isEnabled = true;
    await expect(GET(request(`key=${KEY}&draft=false`))).rejects.toThrow("REDIRECT:/");
    expect(draft.disable).toHaveBeenCalled();
  });

  it("does not redirect to another host", async () => {
    await expect(GET(request(`key=${KEY}&redirect=//evil.example`))).rejects.toThrow(/^REDIRECT:\/$/);
    await expect(GET(request(`key=${KEY}&redirect=https://evil.example`))).rejects.toThrow(/^REDIRECT:\/$/);
  });
});
