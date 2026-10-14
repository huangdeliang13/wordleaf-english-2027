import { validateBackup } from './importer.mjs';
import { BUNDLED_WORDS, mergeVocabulary, termKey } from './vocabulary.mjs';

export function stableString(value) {
  if (Array.isArray(value)) return '[' + value.map(stableString).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stableString(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
const stamp = x => Number.isFinite(x) && x >= 0 ? x : 0;
const validId = id => typeof id === 'string' && /^(base|custom):/.test(id) && id.length <= 150;
function latest(a, b, at) {
  if (!a) return b;
  if (!b) return a;
  const delta = at(a) - at(b);
  return delta ? (delta > 0 ? a : b) : (stableString(a) >= stableString(b) ? a : b);
}

export function normaliseEnvelope(raw) {
  if (!raw || raw.app !== 'wordleaf' || raw.version !== 1 || raw.syncVersion !== 1) throw new Error('云端记录版本不兼容，请先导出本机备份。');
  const state = validateBackup(raw);
  const meta = { favorites: {}, words: {}, settingsAt: stamp(raw.meta?.settingsAt) };
  for (const [id, item] of Object.entries(raw.meta?.favorites || {})) {
    if (validId(id) && typeof item?.value === 'boolean') meta.favorites[id] = { at: stamp(item.at), value: item.value };
  }
  for (const id of state.favorites) if (!meta.favorites[id]) meta.favorites[id] = { at: 0, value: true };
  for (const word of state.customWords) meta.words[word.id] = stamp(raw.meta?.words?.[word.id]);
  if (!meta.settingsAt && (state.settings.dailyNew !== 20 || state.settings.autoAudio)) meta.settingsAt = 1;
  return { app: 'wordleaf', version: 1, syncVersion: 1, state, meta };
}

export function fromLocalState(state) {
  return normaliseEnvelope({ app: 'wordleaf', version: 1, syncVersion: 1, state, meta: state.syncMeta });
}

export function captureChanges(before, current, now = Date.now()) {
  const next = fromLocalState(current);
  if (!before) return next;
  // Backup imports may have no sync metadata. Keep existing clocks/tombstones
  // before marking genuine local changes, so an offline removal is not lost.
  for (const [id, item] of Object.entries(before.meta.favorites)) {
    if (!next.meta.favorites[id] || next.meta.favorites[id].at <= item.at) next.meta.favorites[id] = { ...item };
  }
  next.meta.settingsAt = Math.max(next.meta.settingsAt, before.meta.settingsAt);
  for (const id of Object.keys(next.meta.words)) next.meta.words[id] = Math.max(next.meta.words[id], before.meta.words[id] || 0);
  const was = new Set(before.state.favorites), is = new Set(next.state.favorites);
  for (const id of new Set([...was, ...is])) if (was.has(id) !== is.has(id)) next.meta.favorites[id] = { at: now, value: is.has(id) };
  if (stableString(before.state.settings) !== stableString(next.state.settings)) next.meta.settingsAt = now;
  const previousWords = new Map(before.state.customWords.map(w => [w.id, w]));
  for (const word of next.state.customWords) if (stableString(previousWords.get(word.id)) !== stableString(word)) next.meta.words[word.id] = now;
  return next;
}

export function aliasMap(customWords) {
  const targets = new Map(mergeVocabulary(customWords).map(w => [termKey(w.term), w.id]));
  return new Map([...BUNDLED_WORDS, ...customWords].map(w => [w.id, targets.get(termKey(w.term)) || w.id]));
}

export function mergeEnvelopes(left, right) {
  const a = normaliseEnvelope(left), b = normaliseEnvelope(right);
  const custom = new Map(), wordTimes = {};
  for (const envelope of [a, b]) for (const word of envelope.state.customWords) {
    const key = termKey(word.term), old = custom.get(key), at = envelope.meta.words[word.id] || 0;
    const chosen = latest(old, { word, at }, x => x.at);
    custom.set(key, chosen);
  }
  const customWords = [...custom.values()].map(x => x.word).sort((x, y) => x.id.localeCompare(y.id));
  for (const { word, at } of custom.values()) wordTimes[word.id] = at;
  const aliases = aliasMap(customWords), canonical = id => aliases.get(id) || id;
  const progress = {}, logs = new Map(), favorites = {};
  for (const envelope of [a, b]) {
    for (const [original, p] of Object.entries(envelope.state.progress)) {
      const id = canonical(original);
      progress[id] = latest(progress[id], p, x => x.lastReviewed);
    }
    for (const entry of envelope.state.logs) {
      const log = { ...entry, id: canonical(entry.id) }, key = [log.id, log.at, log.grade].join('|');
      const previous = logs.get(key);
      logs.set(key, { ...log, isNew: log.isNew || previous?.isNew === true });
    }
    for (const [original, item] of Object.entries(envelope.meta.favorites)) {
      const id = canonical(original);
      // If two clocks coincide, removal wins deterministically.
      const previous = favorites[id];
      favorites[id] = !previous || item.at > previous.at ? item
        : item.at === previous.at ? { at: item.at, value: item.value && previous.value } : previous;
    }
  }
  const settings = latest({ value: a.state.settings, at: a.meta.settingsAt }, { value: b.state.settings, at: b.meta.settingsAt }, x => x.at);
  return normaliseEnvelope({ app: 'wordleaf', version: 1, syncVersion: 1,
    state: { customWords, progress, logs: [...logs.values()].sort((x, y) => x.at - y.at || x.id.localeCompare(y.id) || x.grade.localeCompare(y.grade)),
      favorites: Object.keys(favorites).filter(id => favorites[id].value).sort(), settings: settings.value, activeSession: null },
    meta: { favorites, words: wordTimes, settingsAt: settings.at },
  });
}
