export function parseDelimited(text) {
  const source = text.replace(/^\uFEFF/, '').trim();
  if (!source) return [];
  const first = source.split(/\r?\n/)[0];
  const separator = first.includes('\t') ? '\t' : first.includes('|') ? '|' : ',';
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (c === '"') { if (quoted && source[i + 1] === '"') { field += '"'; i++; } else if (quoted || !field) quoted = !quoted; else field += c; }
    else if (c === separator && !quoted) { row.push(field.trim()); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && source[i + 1] === '\n') i++; row.push(field.trim()); if (row.some(Boolean)) rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (quoted) throw new Error('引号未闭合，请检查导入内容。');
  row.push(field.trim()); if (row.some(Boolean)) rows.push(row);
  if (rows[0] && /^(word|term|单词)$/i.test(rows[0][0])) rows.shift();
  return rows;
}
export function importWords(text, existing) {
  const rows = parseDelimited(text);
  if (rows.length > 20000) throw new Error('一次最多导入20,000个单词，请拆分文件。');
  const seen = new Set(existing.map(w => w.term.toLowerCase()));
  const added = []; let skipped = 0, invalid = 0;
  for (const row of rows) {
    const [term, meaning, example = '', translation = '', tip = ''] = row;
    if (!term || !meaning || term.length > 120 || meaning.length > 500 || !/[a-z]/i.test(term)) { invalid++; continue; }
    const key = term.toLowerCase();
    if (seen.has(key)) { skipped++; continue; }
    seen.add(key); added.push({ id: `custom:${key}`, term, meaning, pos: '', group: '我的单词', example: example.slice(0, 1500), translation: translation.slice(0, 1500), tip: tip.slice(0, 1500) });
  }
  return { added, skipped, invalid };
}
export function validateBackup(data) {
  if (!data || data.app !== 'wordleaf' || data.version !== 1 || !data.state || typeof data.state !== 'object') throw new Error('这不是有效的拾词备份文件。');
  const s = data.state;
  if (!Array.isArray(s.customWords) || s.customWords.length > 20000 || !Array.isArray(s.logs) || !Array.isArray(s.favorites) || !s.progress || typeof s.progress !== 'object' || Array.isArray(s.progress)) throw new Error('备份结构不完整。');
  const customWords = s.customWords.map(w => {
    if (!w || typeof w.term !== 'string' || typeof w.meaning !== 'string' || !w.term.trim() || !w.meaning.trim() || w.term.length > 120 || w.meaning.length > 500) throw new Error('备份中有无效的单词。');
    return { id: `custom:${w.term.toLowerCase()}`, term: w.term, meaning: w.meaning, pos: String(w.pos || '').slice(0, 30), group: '我的单词', example: String(w.example || '').slice(0, 1500), translation: String(w.translation || '').slice(0, 1500), tip: String(w.tip || '').slice(0, 1500) };
  });
  const progress = {};
  for (const [id, p] of Object.entries(s.progress)) {
    if (!p || !Number.isFinite(p.due) || !Number.isFinite(p.interval) || p.interval < 0 || p.interval > 180 || !Number.isFinite(p.ease) || p.ease < 1.3 || p.ease > 3 || !Number.isInteger(p.repetitions) || p.repetitions < 0 || !Number.isInteger(p.lapses) || p.lapses < 0 || !['learning', 'review', 'mastered'].includes(p.status) || !Number.isFinite(p.lastReviewed)) throw new Error('备份中的复习记录无效。');
    if (id.startsWith('base:') || id.startsWith('custom:')) progress[id] = { interval: p.interval, ease: p.ease, repetitions: p.repetitions, lapses: p.lapses, due: p.due, lastReviewed: p.lastReviewed, status: p.status };
  }
  const logs = s.logs.filter(l => l && typeof l.id === 'string' && Number.isFinite(l.at) && ['again', 'hard', 'good'].includes(l.grade)).map(l => ({ id: l.id, at: l.at, grade: l.grade, isNew: l.isNew === true }));
  return { customWords, progress, logs, favorites: [...new Set(s.favorites.filter(x => typeof x === 'string'))], settings: { dailyNew: Math.max(5, Math.min(100, Math.round(Number(s.settings?.dailyNew) || 20))), autoAudio: s.settings?.autoAudio === true }, activeSession: null };
}
