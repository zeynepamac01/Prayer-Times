import { CalculationMethod, Coordinates, PrayerTimes, Prayer } from 'adhan';

export const TIME_ZONE = 'America/Indiana/Indianapolis';
export const COORDINATES = { latitude: 39.1653, longitude: -86.5264 };
export const PRAYER_NAMES: Record<string, string> = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };
export type PrayerName = keyof typeof PRAYER_NAMES;
export type PrayerEntry = { name: PrayerName; label: string; time: Date };
export type DailySchedule = { dateKey: string; prayers: PrayerEntry[]; sunrise: Date };
const scheduleCache = new Map<string, DailySchedule>();

export function dateKeyInBloomington(instant: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(instant);
  const part = (t: string) => parts.find(p => p.type === t)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function dateParts(key: string) { const [year, month, day] = key.split('-').map(Number); return { year, month, day }; }

export function getSchedule(key: string): DailySchedule {
  const cached = scheduleCache.get(key);
  if (cached) return cached;
  const { year, month, day } = dateParts(key);
  // Adhan returns absolute instants. Format those with TIME_ZONE in the UI, never the visitor's zone.
  const date = new Date(year, month - 1, day, 12);
  const params = CalculationMethod.NorthAmerica();
  const times = new PrayerTimes(new Coordinates(COORDINATES.latitude, COORDINATES.longitude), date, params);
  const prayers: PrayerEntry[] = (['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(name => ({ name, label: PRAYER_NAMES[name], time: times.timeForPrayer(({ fajr: Prayer.Fajr, dhuhr: Prayer.Dhuhr, asr: Prayer.Asr, maghrib: Prayer.Maghrib, isha: Prayer.Isha } as const)[name])! }));
  const result = { dateKey: key, prayers, sunrise: times.sunrise };
  scheduleCache.set(key, result);
  if (scheduleCache.size > 4) scheduleCache.delete(scheduleCache.keys().next().value!);
  return result;
}

export function getNextPrayer(now: Date): { prayer: PrayerEntry; schedule: DailySchedule } {
  const today = dateKeyInBloomington(now);
  const schedule = getSchedule(today);
  const upcoming = schedule.prayers.find(p => p.time.getTime() > now.getTime());
  if (upcoming) return { prayer: upcoming, schedule };
  const tomorrowDate = new Date(Date.UTC(...(() => { const {year,month,day}=dateParts(today); return [year,month-1,day+1] as [number,number,number]; })()));
  const ymd = tomorrowDate.toISOString().slice(0, 10);
  const tomorrow = getSchedule(ymd);
  return { prayer: tomorrow.prayers[0], schedule };
}
