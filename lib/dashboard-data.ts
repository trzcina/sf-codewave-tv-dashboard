import { NAMEDAYS_DATA } from "./namedays-data";
import { pickSlogans } from "./slogans";

import { flotiqApiClient, isFlotiqConfigured } from "./flotiq-api-client";

export type DashboardData = {
  companyName: string;
  rotateSeconds: number;
  slogans: { text: string }[];
  namedays: Record<string, string>;
};

export const FALLBACK_DASHBOARD_DATA: DashboardData = {
  companyName: "CodeWave",
  rotateSeconds: 15,
  slogans: [
    { text: "Razem budujemy przyszłość" },
    { text: "Każda linia kodu ma znaczenie" },
    { text: "Dobry kod to wspólna sprawa" },
  ],
  namedays: NAMEDAYS_DATA,
};

async function fetchSettings(): Promise<{ companyName: string; rotateSeconds: number }> {
  const { data } = await flotiqApiClient.content.dashboardsettings.list({
    limit: 1,
  });
  const settings = data[0];
  return {
    companyName: settings?.company_name || FALLBACK_DASHBOARD_DATA.companyName,
    rotateSeconds:
      settings?.rotate_seconds ?? FALLBACK_DASHBOARD_DATA.rotateSeconds,
  };
}

async function fetchSlogans(): Promise<{ text: string }[]> {
  const { data } = await flotiqApiClient.content.slogans.list({
    limit: 100,
  });
  const active = data.filter((slogan) => slogan.active !== false);
  return pickSlogans(active).map((slogan) => ({ text: slogan.text }));
}

async function fetchNamedays(): Promise<Record<string, string>> {
  const { data } = await flotiqApiClient.content.namedays.list({
    limit: 400,
  });
  const map: Record<string, string> = {};
  for (const entry of data) {
    map[entry.date] = entry.names;
  }
  return map;
}

/**
 * Fetches all dashboard content from Flotiq, section by section — a failing
 * section falls back on its own without breaking the others. When Flotiq is
 * not configured (no FLOTIQ_API_KEY) or everything fails, returns the full
 * local fallback.
 */
export async function getDashboardData(): Promise<DashboardData> {
  if (!isFlotiqConfigured) {
    return FALLBACK_DASHBOARD_DATA;
  }

  const [settings, slogans, namedays] = await Promise.all([
    fetchSettings().catch((error) => {
      console.error("dashboard: settings fallback", error);
      return {
        companyName: FALLBACK_DASHBOARD_DATA.companyName,
        rotateSeconds: FALLBACK_DASHBOARD_DATA.rotateSeconds,
      };
    }),
    fetchSlogans().catch((error) => {
      console.error("dashboard: slogans fallback", error);
      return FALLBACK_DASHBOARD_DATA.slogans;
    }),
    fetchNamedays().catch((error) => {
      console.error("dashboard: namedays fallback", error);
      return FALLBACK_DASHBOARD_DATA.namedays;
    }),
  ]);

  return {
    companyName: settings.companyName,
    rotateSeconds: settings.rotateSeconds,
    slogans: slogans.length > 0 ? slogans : FALLBACK_DASHBOARD_DATA.slogans,
    namedays: Object.keys(namedays).length > 0 ? namedays : FALLBACK_DASHBOARD_DATA.namedays,
  };
}