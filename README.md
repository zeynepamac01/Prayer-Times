# Bloomington Prayer Times

A focused, responsive prayer time page for Bloomington, Indiana. It calculates adhan times locally with the open source `adhan` JavaScript package and the Islamic Society of North America (ISNA) parameters. No location access, API request, account, or manual daily timetable is needed.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` creates a production build; `npm start` serves it. The app can be deployed to Vercel or any host supporting Next.js.

Run the date and countdown edge-case suite with `npm test`.

## Calculation and timezone

Coordinates are 39.1653, -86.5264 and all calendar dates and visible times use `America/Indiana/Indianapolis`. Calculation uses `CalculationMethod.NorthAmerica()` (ISNA) and the library's standard Asr factor (shadow factor 1). Dates are taken from the Bloomington calendar, including DST; Adhan returns absolute timestamps and the UI formats them in Bloomington's timezone. Countdown time is recomputed from the current timestamp every second, and the schedule refreshes when the date changes, the tab regains focus, or it becomes visible again. Calculated daily schedules are cached briefly to avoid repeating astronomical calculations on each countdown update.

The five obligatory prayers and sunrise are shown. Sunrise is clearly marked as informational. Iqamah times are intentionally omitted; they are not astronomical calculations and should only be shown from a current, verified ICOB schedule.

## ICOB validation

The Islamic Center of Bloomington prayer page is the local reference: https://www.icob.org/prayer. The page design links to that reference and explicitly says that calculated times may differ. A representative-date comparison against a published ICOB timetable has **not yet been completed** in this deliverable. Consequently, the site does not claim exact agreement or official affiliation. Rounding, coordinates, and local adjustments may account for differences. Review ICOB's current published timetable before relying on a specific minute-level match.

## Configuration

Edit `src/lib/prayer-times.ts` to change coordinates, time zone, or calculation parameters. The default is ISNA with standard Asr. The calculation module is independent of the UI and returns typed schedules and absolute timestamps.

## Accessibility and behavior

The page has one clear reading order, high-contrast text, responsive large type, semantic headings, tabular countdown digits, and reduced-motion support. The changing countdown is not configured as a live region, so assistive technology is not interrupted every second. The app makes no network calls and uses system sans-serif fonts, so calculations continue offline after the app assets are available.

The fixed floral background is stored as `public/antique-botanical-background.webp`, converted losslessly from the supplied PNG to reduce its download size. It rotates to landscape on desktop and keeps its portrait orientation on phones. The hero card, schedule, header, and footer remain opaque for legibility.
