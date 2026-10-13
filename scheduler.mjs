export const DAY = 86400000;
export const DATE_ZONE = 'Asia/Shanghai';
export function dayKey(time = Date.now()) {
  const p = dateFormatter.formatToParts(new Date(time));
  return ['year', 'month', 'day'].map(k => p.find(x => x.type === k).value).join('-');
}
const dateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: DATE_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
export function logCounts(logs) {
  const map = new Map();
  for (const log of logs) { const key = dayKey(log.at); if (!map.has(key)) map.set(key, new Set()); map.get(key).add(log.id); }
  return map;
}
export function schedule(previous = {}, grade, now = Date.now()) {
  if (!['again', 'hard', 'good'].includes(grade)) throw new Error('未知记忆反馈');
  const p = { interval: 0, ease: 2.3, repetitions: 0, lapses: 0, ...previous };
  const ease = Math.max(1.3, Math.min(3, p.ease + (grade === 'hard' ? -0.15 : grade === 'again' ? -0.2 : 0.05)));
  if (grade === 'again') return { ...p, ease, interval: 0, repetitions: 0, lapses: p.lapses + 1, due: now + 60000, lastReviewed: now, status: 'learning' };
  const interval = grade === 'hard'
    ? Math.max(1, Math.round(p.interval * 1.2))
    : p.repetitions === 0 ? 1 : p.repetitions === 1 ? 3 : Math.min(180, Math.max(p.interval + 1, Math.round(p.interval * ease)));
  return { ...p, ease, interval, repetitions: p.repetitions + 1, due: now + interval * DAY, lastReviewed: now, status: interval >= 21 && p.repetitions + 1 >= 4 ? 'mastered' : 'review' };
}
export function dueWords(words, progress, now = Date.now()) {
  return words.filter(w => progress[w.id] && progress[w.id].due <= now)
    .sort((a, b) => progress[a.id].due - progress[b.id].due);
}
export function statsFor(words, progress) {
  return words.reduce((s, w) => { const p = progress[w.id]; if (!p) s.new++; else { s.learned++; if (p.status === 'mastered') s.mastered++; if (p.lapses > 0) s.difficult++; } return s; }, { new: 0, learned: 0, mastered: 0, difficult: 0 });
}
export function todayStats(logs, time = Date.now()) {
  const logsToday = logs.filter(l => dayKey(l.at) === dayKey(time));
  const newIds = new Set(logsToday.filter(l => l.isNew).map(l => l.id));
  return { learned: newIds.size, reviewed: new Set(logsToday.filter(l => !newIds.has(l.id)).map(l => l.id)).size, unique: new Set(logsToday.map(l => l.id)).size, events: logsToday.length };
}
export function streak(logs, time = Date.now()) {
  const days = new Set(logs.map(l => dayKey(l.at)));
  let cursor = time;
  if (!days.has(dayKey(cursor))) cursor -= DAY;
  let n = 0;
  while (days.has(dayKey(cursor))) { n++; cursor -= DAY; }
  return n;
}
export function forecast(words, progress, time = Date.now()) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = dayKey(time + i * DAY);
    return { date, count: words.filter(w => progress[w.id] && (i === 0 ? progress[w.id].due <= time || dayKey(progress[w.id].due) === date : dayKey(progress[w.id].due) === date)).length };
  });
}
