import { beforeEach, describe, expect, it, vi } from "vitest";

import { FALLBACK_DASHBOARD_DATA, getDashboardData } from "./dashboard-data";
import { NAMEDAYS_DATA } from "./namedays-data";

let configured = true;

vi.mock("./flotiq-api-client", () => ({
  get isFlotiqConfigured() {
    return configured;
  },
  flotiqApiClient: {
    content: {
      dashboardsettings: {
        list: vi.fn(),
      },
      slogans: {
        list: vi.fn(),
      },
      namedays: {
        list: vi.fn(),
      },
    },
  },
}));

import { flotiqApiClient } from "./flotiq-api-client";

const mocked = {
  settings: vi.mocked(flotiqApiClient.content.dashboardsettings.list),
  slogans: vi.mocked(flotiqApiClient.content.slogans.list),
  namedays: vi.mocked(flotiqApiClient.content.namedays.list),
};

function mockResponses(
  settings: unknown,
  slogans: unknown,
  namedays: unknown,
) {
  mocked.settings.mockResolvedValue(settings as never);
  mocked.slogans.mockResolvedValue(slogans as never);
  mocked.namedays.mockResolvedValue(namedays as never);
}

describe("getDashboardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns full data from Flotiq (active slogans sorted by order)", async () => {
    mockResponses(
      { data: [{ company_name: "CodeWave Sp. z o.o.", rotate_seconds: 20 }] },
      {
        data: [
          { text: "B", active: true, order: 2 },
          { text: "A", active: true, order: 1 },
          { text: "Nieaktywne", active: false, order: 0 },
        ],
      },
      { data: [{ date: "09-29", names: "Michała, Gabriela, Rafała" }] },
    );
    const result = await getDashboardData();
    expect(result).toEqual({
      companyName: "CodeWave Sp. z o.o.",
      rotateSeconds: 20,
      slogans: [{ text: "A" }, { text: "B" }],
      namedays: { "09-29": "Michała, Gabriela, Rafała" },
    });
    expect(mocked.settings).toHaveBeenCalledWith({
      limit: 1,
    });
    expect(mocked.namedays).toHaveBeenCalledWith({
      limit: 400,
    });
  });

  it("falls back per section when a fetch throws", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocked.settings.mockRejectedValue(new Error("network down"));
    mocked.slogans.mockResolvedValue({
      data: [{ text: "Z Flotiq", active: true, order: 1 }],
    } as never);
    mocked.namedays.mockRejectedValue(new Error("network down"));
    const result = await getDashboardData();
    expect(result.companyName).toBe(FALLBACK_DASHBOARD_DATA.companyName);
    expect(result.rotateSeconds).toBe(FALLBACK_DASHBOARD_DATA.rotateSeconds);
    expect(result.slogans).toEqual([{ text: "Z Flotiq" }]);
    expect(result.namedays).toEqual(NAMEDAYS_DATA);
    errorSpy.mockRestore();
  });

  it("falls back completely when Flotiq returns empty content", async () => {
    mockResponses({ data: [] }, { data: [] }, { data: [] });
    const result = await getDashboardData();
    expect(result).toEqual(FALLBACK_DASHBOARD_DATA);
  });

  it("falls back completely when Flotiq is not configured", async () => {
    configured = false;
    const result = await getDashboardData();
    expect(result).toEqual(FALLBACK_DASHBOARD_DATA);
    expect(mocked.settings).not.toHaveBeenCalled();
    configured = true;
  });
});