'use client';

import { useEffect, useState } from 'react';
import { DailySchedule, dateKeyInBloomington, getNextPrayer, getSchedule, PrayerName, TIME_ZONE } from '@/lib/prayer-times';

const dateFormat = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, hour: 'numeric', minute: '2-digit' });
const prayerOrder: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function countdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(total / 3600)).padStart(2, '0')}:${String(Math.floor(total % 3600 / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export default function Home() {
  const [now, setNow] = useState<Date | null>(null);
  const [schedule, setSchedule] = useState<DailySchedule | null>(null);
  useEffect(() => {
    const update = () => {
      const instant = new Date(); setNow(instant);
      const key = dateKeyInBloomington(instant);
      setSchedule(current => current?.dateKey === key ? current : getSchedule(key));
    };
    update(); const timer = window.setInterval(update, 1000);
    document.addEventListener('visibilitychange', update); window.addEventListener('focus', update);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', update); window.removeEventListener('focus', update); };
  }, []);

  const next = now ? getNextPrayer(now) : null;
  const visibleSchedule = schedule ?? next?.schedule ?? null;
  const currentPrayer = next?.prayer.name;

  return <main className="page-shell">
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Prayer Times home">Prayer Times</a>
      <div className="location"><span className="location-dot" aria-hidden="true"/>Bloomington, Indiana</div>
    </header>

    <section className="hero" id="top" aria-labelledby="next-prayer-title">
      <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line"/>THE NEXT PRAYER</p>
        <h1 id="next-prayer-title">{next?.prayer.label ?? 'Next prayer'}</h1>
        <p className="prayer-begins">Prayer begins at <strong>{next ? timeFormat.format(next.prayer.time) : '—'}</strong></p>
      </div>
      <div className="countdown-wrap"><span className="countdown-label">TIME REMAINING</span><p className="countdown" aria-label={next && now ? `${Math.floor((next.prayer.time.getTime()-now.getTime())/3600000)} hours, ${Math.floor((next.prayer.time.getTime()-now.getTime())%3600000/60000)} minutes remaining` : 'Loading countdown'}>{next && now ? countdown(next.prayer.time.getTime() - now.getTime()) : '––:––:––'}</p><p className="countdown-caption">Hours <span/> Minutes <span/> Seconds</p></div>
      <div className="hero-date"><span className="date-icon" aria-hidden="true"/>{now ? dateFormat.format(now) : 'Today in Bloomington'}</div>
    </section>

    <section className="schedule-section" aria-labelledby="schedule-title">
      <div className="section-heading"><div><p className="eyebrow">YOUR DAILY GUIDE</p><h2 id="schedule-title">Today&apos;s prayer times</h2></div><span className="local-time">Bloomington local time</span></div>
      <div className="schedule-card">
        {prayerOrder.map((name, i) => {
          const prayer = visibleSchedule?.prayers.find(item => item.name === name);
          const active = currentPrayer === name;
          return <div className={`prayer-row${active ? ' is-next' : ''}`} key={name} aria-current={active ? 'time' : undefined}>
            <div className="prayer-name"><span className="row-index">{i + 1}.</span><span className="prayer-dot" aria-hidden="true"/>{prayer?.label ?? name}</div>
            <div className="prayer-time">{prayer ? timeFormat.format(prayer.time) : '—'}{active && <span className="next-pill">NEXT</span>}</div>
          </div>;
        })}
      </div>
      <p className="sunrise-note"><span className="sunrise-icon" aria-hidden="true"/><span>Sunrise</span><strong>{visibleSchedule ? timeFormat.format(visibleSchedule.sunrise) : '—'}</strong><span className="sunrise-explainer">For reference only</span></p>
    </section>

    <footer className="site-footer"><p>Calculated for Bloomington, Indiana using the ISNA method.</p><span className="footer-rule"/><a href="https://www.icob.org/prayer" target="_blank" rel="noreferrer">Local reference <span aria-hidden="true">↗</span></a></footer>
    <p className="disclaimer">Prayer times are calculated locally and may differ slightly from the Islamic Center of Bloomington&apos;s published timetable.</p>
  </main>;
}
