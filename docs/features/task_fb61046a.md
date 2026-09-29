# Zbuduj pełnoekranowy dashboard na telewizor w biurze firmy CodeWave jak…

- Task: `task_fb61046a`
- Date: 2026-09-29
- Agents: 4 steps, 134 turns, $0.3096
- One fix round, after QA found unmet requirements

## Request

> Zbuduj pełnoekranowy dashboard na telewizor w biurze firmy CodeWave jako stronę główną (/) aplikacji. Port 1:1 projektu z docs/context (design.html, wariant B). Wszystkie teksty po polsku.
>
> Układ: stała scena 1920×1080 skalowana proporcjonalnie do okna przez transform: scale(min(vw/1920, vh/1080)), wyśrodkowana, letterbox #141312, bez przewijania i bez kursora. Font Archivo (400/600/800, next/font/google, z polskimi znakami), cyfry tabularne.
> - Nagłówek: czerwony kwadrat + nazwa firmy (z Flotiq), po prawej „TYDZIEŃ {nr ISO}”, pod spodem linia 2px.
> - Lewa kolumna (1.4fr): duży zegar HH:MM (290px, 800) + sekundy na czerwono (76px), pasek postępu dnia z opisem „00:00 / Dzień w X% / 24:00”.
> - Prawa kolumna (1fr), linia 2px po lewej: dzień tygodnia (czerwony), pełna data „29 września 2026” (Intl pl-PL), sekcja „IMIENINY” z dzisiejszymi imionami; na dole czerwony blok (#ec3013) z etykietą „HASŁO”, wskaźnikami rotacji (kreski) i bieżącym hasłem.
> - Stopka: 4 równe komórki „Pogoda”, „Urodziny”, „Ogłoszenia”, „Wydarzenia” z tekstem „Moduł w przygotowaniu” (miejsce na przyszłe moduły).
> Zegar aktualizuje się co sekundę po stronie klienta (komponent klienta, bez błędów hydracji — renderuj czas dopiero po mount).
>
> Dane z Flotiq (utwórz typy treści w przestrzeni Flotiq użytkownika i wypełnij je treścią):
> 1. `dashboard_settings` (singleton, 1 wpis): `company_name` (tekst, wymagany) = „CodeWave”; `rotate_seconds` (liczba, domyślnie 15) — co ile sekund zmienia się hasło.
> 2. `slogans`: `text` (tekst, wymagany), `active` (boolean, domyślnie true), `order` (liczba). Treść: „Razem budujemy przyszłość” (order 1), „Każda linia kodu ma znaczenie” (2), „Dobry kod to wspólna sprawa” (3). Wyświetlaj tylko aktywne, posortowane po order, rotuj co rotate_seconds.
> 3. `namedays`: `date` (tekst w formacie MM-DD, unikalny), `names` (tekst, np. „Michała, Gabriela, Rafała”). Zaimportuj wszystkie 366 dni z pliku namedays.txt z docs/context (12 linii = miesiące styczeń–grudzień, dni rozdzielone „|”, kolejno od 1. dnia miesiąca).
> Pobieranie: dane z Flotiq po stronie serwera (ISR, revalidate ok. 5 min), przekazane do komponentu klienta; strona ma też sama odświeżać dane co ~10 min (router.refresh()) i przełączać imieniny o północy bez przeładowania. Gdy Flotiq jest niedostępny lub pusty — fallback: nazwa „CodeWave”, powyższe 3 hasła, imieniny z lokalnej kopii namedays. Klucz API tylko po stronie serwera.

## Context

- `docs/context/task_fb61046a/brief.md`
- `docs/context/task_fb61046a/design.html`
- `docs/context/task_fb61046a/namedays.txt`

## Questions to the user

- **lead:** Flotiq read-write API key (do tworzenia typów treści i danych — dla subagenta flotiq)? — provided, kept by the Factory for the flotiq subagent (via dashboard)
- **lead:** Flotiq read-only API key (dla wdrożonej aplikacji, do odczytu danych)? — provided, in the environment as `FLOTIQ_API_KEY` (via dashboard)

## Plan

1. [flotiq] Flotiq: utwórz typy dashboard_settings, slogans, namedays + treść (366 imienin, 3 hasła, settings) i typegen (flotiq-api.d.ts) — done when flotiq-api.d.ts zawiera typy dla 3 CTD i treść jest w Flotiq
2. [developer] Lib: logika imienin (namedays.txt parser, wybór dnia, przesunięcie o północ), rotacja haseł, dzień % — funkcje czyste + testy (lib/namedays.ts, lib/namedays.test.ts, lib/slogans.ts, lib/slogans.test.ts, lib/day-progress.ts, lib/day-progress.test.ts) — done when lint+typecheck+testy przechodzą dla lib
3. [developer] Dane: serwerowe pobranie z Flotiq przez flotiqApiClient z fallbackiem lokalnym (lib/dashboard-data.ts, lib/dashboard-data.test.ts) — done when dane z Flotiq z fallbackiem; testy przechodzą (po typegen)
4. [developer] UI: strona / — scena 1920×1080 skalowana, kolumny, zegar klienta, rotacja haseł, refresh co 10 min (app/page.tsx, app/dashboard-client.tsx) — done when UI zgodne z design.html; lint/typecheck/testy przechodzą

## Requirements (QA)

- [x] Pełnoekranowy dashboard 1920×1080 jako strona główna / — `app/page.tsx renders <DashboardClient data={data}/>; app/dashboard-client.tsx builds the fixed 1920×1080 scene scaled via transform: scale with letterbox #141312, overflow hidden, cursor none (globals.css), render-after-mount clock.`
- [x] Nagłówek, zegar, imieniny, hasło, stopka — `dashboard-client.tsx: header (red square + company name + 'Tydzień {isoWeek}'), left column clock HH:MM 290px + red seconds + day-progress bar, right column day name/full date/Imieniny, red #ec3013 Hasło block with rotation indicators, footer 4 cells.`
- [x] Fallback gdy Flotiq niedostępny — `lib/dashboard-data.ts per-section catch falls back to FALLBACK_DASHBOARD_DATA (CodeWave, 3 slogans, namedays from lib/namedays-data.ts).`
- [x] Data from Flotiq — `lib/dashboard-data.ts reads dashboardsettings/slogans/namedays via flotiqApiClient.content.*.list(); flotiq-api.d.ts added in diff; router.refresh() every 600s for ISR revalidate=300 in page.tsx.`
- [x] UI: CodeWave / company name + „TYDZIEŃ {nr ISO}” — `dashboard-client.tsx header: {data.companyName} and `Tydzień {isoWeek}`.`
- [x] UI: Zegar HH:MM + sekundy na czerwono, „00:00 / Dzień w X% / 24:00” — `dashboard-client.tsx: fontSize 290 `{hours}:{minutes}`, red seconds fontSize 76, `Dzień w {progress}%`, 00:00 / 24:00; renders '--:--' pre-mount (no hydration error).`
- [x] UI: Dzień tygodnia, pełna data, „IMIENINY” — `dashboard-client.tsx: {dayName} capitalized, {fullDate} from formatDatePl (Intl pl-PL), header 'Imieniny' + {namedays}.`
- [x] UI: Czerwony blok „HASŁO” ze wskaźnikami rotacji i bieżącym hasłem — `dashboard-client.tsx: background '#ec3013', 'Hasło', rotation bars via slogan.count/index, {slogan.text}.`
- [x] UI: Stopka: „Pogoda/Urodziny/Ogłoszenia/Wydarzenia” z „Moduł w przygotowaniu” — `dashboard-client.tsx FOOTER_SECTIONS four cells each with 'Moduł w przygotowaniu'.`

## Checks

- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm run test` — passed

## Changed files

- `app/dashboard-client.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `flotiq-api.d.ts`
- `lib/dashboard-data.test.ts`
- `lib/dashboard-data.ts`
- `lib/day-progress.test.ts`
- `lib/day-progress.ts`
- `lib/iso-week.test.ts`
- `lib/iso-week.ts`
- `lib/namedays-data.ts`
- `lib/namedays.test.ts`
- `lib/namedays.ts`
- `lib/slogans.test.ts`
- `lib/slogans.ts`
