"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DashboardData } from "@/lib/dashboard-data";
import { dayProgress } from "@/lib/day-progress";
import { formatDateKey, formatDatePl, getNamedays } from "@/lib/namedays";
import { getIsoWeek } from "@/lib/iso-week";
import { rotateSlogans } from "@/lib/slogans";

const SCENE_WIDTH = 1920;
const SCENE_HEIGHT = 1080;

function computeScale(): number {
  return Math.min(window.innerWidth / SCENE_WIDTH, window.innerHeight / SCENE_HEIGHT);
}

const FOOTER_SECTIONS = ["Pogoda", "Urodziny", "Ogłoszenia", "Wydarzenia"] as const;

export default function DashboardClient({ data }: DashboardClientProps) {
  const router = useRouter();
  const [now, setNow] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const tick = () => {
      setNow(new Date());
      setElapsed((value) => value + 1);
    };
    const interval = window.setInterval(tick, 1000);
    const refresh = window.setInterval(() => router.refresh(), 600_000);
    const onResize = () => setScale(computeScale());
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearInterval(interval);
      window.clearInterval(refresh);
      window.removeEventListener("resize", onResize);
    };
  }, [router]);

  const time = now;
  const date = time ?? new Date(0);

  const hours = String(time?.getHours() ?? 0).padStart(2, "0");
  const minutes = String(time?.getMinutes() ?? 0).padStart(2, "0");
  const seconds = String(time?.getSeconds() ?? 0).padStart(2, "0");

  const progress = time ? dayProgress(time) : { percent: 0, seconds: 0 };
  const slogan = rotateSlogans(data.slogans, data.rotateSeconds, elapsed);
  const { dayName, fullDate } = formatDatePl(date);
  const namedays = getNamedays(formatDateKey(date));
  const isoWeek = getIsoWeek(date);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#141312",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: SCENE_WIDTH,
          height: SCENE_HEIGHT,
          flex: "none",
          transform: "scale(var(--scale,1))",
          transformOrigin: "center center",
          ["--scale" as string]: scale,
          background: "#201e1d",
          color: "#f3f2f2",
          fontFamily: "var(--font-archivo), system-ui, sans-serif",
          fontVariantNumeric: "tabular-nums",
          display: "flex",
          flexDirection: "column",
          padding: "56px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* Nagłówek */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 28,
            borderBottom: "2px solid rgba(243,242,242,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 28, height: 28, background: "#ec3013" }} />
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {data.companyName}
            </div>
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#bab6b6",
              whiteSpace: "nowrap",
            }}
          >
            Tydzień {isoWeek}
          </div>
        </div>

        {/* Zawartość */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)",
          }}
        >
          {/* Lewa kolumna */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 56,
              minWidth: 0,
              paddingRight: 80,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 0.8,
                fontWeight: 800,
                letterSpacing: "-0.045em",
              }}
            >
              <div style={{ fontSize: 290 }}>{time ? `${hours}:${minutes}` : "--:--"}</div>
              <div
                style={{
                  fontSize: 76,
                  fontWeight: 600,
                  color: "#ff563c",
                  marginLeft: 20,
                  flex: "none",
                  letterSpacing: "-0.02em",
                }}
              >
                {time ? seconds : "--"}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ height: 8, background: "#3a3736" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progress.percent}%`,
                    background: "#ec3013",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#bab6b6",
                  whiteSpace: "nowrap",
                }}
              >
                <div>00:00</div>
                <div>Dzień w {Math.round(progress.percent)}%</div>
                <div>24:00</div>
              </div>
            </div>
          </div>

          {/* Prawa kolumna */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              borderLeft: "2px solid rgba(243,242,242,0.3)",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 72,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  paddingBottom: 40,
                  borderBottom: "2px solid rgba(243,242,242,0.3)",
                }}
              >
                <div style={{ fontSize: 44, fontWeight: 600, color: "#ff563c", textTransform: "capitalize" }}>
                  {dayName}
                </div>
                <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
                  {fullDate}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 40 }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#bab6b6",
                    whiteSpace: "nowrap",
                  }}
                >
                  Imieniny
                </div>
                <div style={{ fontSize: 48, fontWeight: 400, lineHeight: 1.2, textWrap: "balance" }}>
                  {namedays ?? "Brak danych"}
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#ec3013",
                padding: "44px 56px 48px 72px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#f3f2f2",
                    whiteSpace: "nowrap",
                  }}
                >
                  Hasło
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {Array.from({ length: slogan.count }, (_, index) => (
                    <div
                      key={index}
                      style={{
                        width: index === slogan.index ? 40 : 16,
                        height: 8,
                        background: index === slogan.index ? "#f3f2f2" : "#ae1800",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  textWrap: "balance",
                }}
              >
                {slogan.text}
              </div>
            </div>
          </div>
        </div>

        {/* Stopka */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,minmax(0,1fr))",
            borderTop: "2px solid rgba(243,242,242,0.3)",
            height: 150,
          }}
        >
          {FOOTER_SECTIONS.map((label, index) => (
            <div
              key={label}
              style={{
                padding: index === 0 ? "28px 32px 0 0" : index === 3 ? "28px 0 0 32px" : "28px 32px 0",
                borderLeft: index === 0 ? undefined : "2px solid rgba(243,242,242,0.3)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#bab6b6",
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: 28, color: "#7d7979" }}>Moduł w przygotowaniu</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export type DashboardClientProps = {
  data: DashboardData;
};
