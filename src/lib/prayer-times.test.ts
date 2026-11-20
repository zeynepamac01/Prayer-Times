import { describe, expect, it } from 'vitest';
import { dateKeyInBloomington, getNextPrayer, getSchedule } from './prayer-times';

describe('Bloomington prayer date and time handling', () => {
  it('uses the Bloomington date for visitors in other timezones', () => {
    expect(dateKeyInBloomington(new Date('2026-01-01T02:00:00Z'))).toBe('2025-12-31');
  });
  it('calculates a winter and summer schedule with chronological prayers', () => {
    for (const day of ['2026-01-15', '2026-07-15']) {
      const { prayers } = getSchedule(day);
      expect(prayers).toHaveLength(5);
      for (let i = 1; i < prayers.length; i++) expect(prayers[i].time.getTime()).toBeGreaterThan(prayers[i - 1].time.getTime());
    }
  });
  it('applies the Bloomington daylight saving offset to calculated dates', () => {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Indiana/Indianapolis', hour: 'numeric' });
    for (const day of ['2026-03-07', '2026-03-08', '2026-11-01', '2026-11-02']) {
      expect(formatter.format(getSchedule(day).prayers[1].time)).toContain('12');
    }
  });
  it('handles leap day and year rollover', () => {
    expect(getSchedule('2028-02-29').dateKey).toBe('2028-02-29');
    expect(dateKeyInBloomington(new Date('2027-01-01T04:00:00Z'))).toBe('2026-12-31');
  });
  it('moves to the following prayer at the exact prayer instant', () => {
    const schedule = getSchedule('2026-06-03');
    const next = getNextPrayer(schedule.prayers[0].time);
    expect(next.prayer.name).toBe('dhuhr');
  });
  it('selects tomorrow Fajr after Isha', () => {
    const schedule = getSchedule('2026-06-03');
    const next = getNextPrayer(new Date(schedule.prayers[4].time.getTime() + 1));
    expect(next.prayer.name).toBe('fajr');
    expect(dateKeyInBloomington(next.prayer.time)).toBe('2026-06-04');
    expect(next.schedule.dateKey).toBe('2026-06-03');
  });
  it('rolls schedule dates after midnight and derives countdowns from absolute instants', () => {
    const now = new Date('2026-06-04T04:30:00Z');
    expect(dateKeyInBloomington(now)).toBe('2026-06-04');
    expect(getNextPrayer(now).schedule.dateKey).toBe('2026-06-04');
  });
});
