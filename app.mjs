import { BUNDLED_WORDS, mergeVocabulary } from './vocabulary.mjs';
import { schedule, dueWords, statsFor, todayStats, dayKey, streak, forecast, logCounts, DAY } from './scheduler.mjs';
import { importWords, validateBackup } from './importer.mjs';

const KEY = 'wordleaf:v1';
const $ = s => document.querySelector(s);
const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const paths = {
  leaf: '<path d="M4 17C2 8 9 3 21 3c0 12-6 18-15 14"/><path d="m3 22 12-12"/>',
  home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
  book: '<path d="M4 4h7a4 4 0 0 1 1 1 4 4 0 0 1 1-1h7v16h-7a4 4 0 0 0-1 1 4 4 0 0 0-1-1H4Z"/><path d="M12 5v16"/>',
  chart: '<path d="M4 3v17h17M8 15v-4m5 4V7m5 8V5"/>',
  settings: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="18" r="2" fill="currentColor"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
  star: '<path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L12 17l-5.6 3 1.1-6.1L3 9.5l6.2-.9Z"/>',
  flame: '<path d="M14 2c1 6-4 5-3 10 2 0 3-2 4-4 7 6 4 14-3 14S2 16 6 10c0 3 1 4 3 4-2-5 1-9 5-12Z"/>',
  bulb: '<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  audio: '<path d="M4 9h4l5-4v14l-5-4H4Zm12-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  reset: '<path d="M3 11a9 9 0 1 1 3 8M3 4v7h7"/>',
  cloud: '<path d="M6 18a5 5 0 0 1-1-10 7 7 0 0 1 13 0 5 5 0 0 1 0 10"/><path d="m9 15 3 3 5-5"/>',
  save: '<path d="M4 3h14l3 3v15H3V3Z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/>',
  upload: '<path d="M4 16v5h16v-5M12 17V3m-5 5 5-5 5 5"/>',
  download: '<path d="M4 16v5h16v-5M12 3v14m-5-5 5 5 5-5"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14c2 3 6 3 8 0M8 9h.01M16 9h.01"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 0-1 1-1 2m0 3h.01"/>',
  sprout: '<path d="M12 22V10M12 13C3 13 3 5 3 5s9 0 9 8Zm0-4C12 2 21 2 21 2s0 8-9 8"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.leaf}</svg>`;
const defaults = () => ({ customWords: [], progress: {}, logs: [], favorites: [], settings: { dailyNew: 20, autoAudio: false }, activeSession: null });
let storageError = false, startupMessage = '';
let state = defaults();
try { const saved = localStorage.getItem(KEY); if (saved) { const loaded = JSON.parse(saved); state = { ...state, ...validateBackup({ app: 'wordleaf', version: 1, state: loaded }), activeSession: loaded.activeSession || null }; } } catch { startupMessage = '未能读取学习记录。请在设置中恢复备份；当前记录尚未覆盖。'; storageError = true; }
let view = 'home', search = '', filter = 'all', group = 'all', page = 1, revealed = false, mode = 'recall', spellAnswer = '', modalId = null, importMessage = '';
let toastTimer;
function words() { return mergeVocabulary(state.customWords); }
function vocabularySource() { return `<details class="vocabulary-source"><summary>词库已扩充 · 3000 个课标词目 · 查看版本与来源</summary><p>按《高等职业教育专科英语课程标准（2021年版）》附录整理：入学基础 2100、基础模块 500、拓展模块 400 个词目。斜线并列词拆为独立卡片后共 3048 张，加上保留的 20 个起步补充词，内置共 ${BUNDLED_WORDS.length} 张卡片。</p><p>参考已检索到的 2026 年广东普通专升本公共英语要求；截至 2026-10-14 未检索到 2027 年官方新考纲。本词库供 2027 备考使用，不是“2027 官方发布”。适用公共英语，不替代英语专业《英语基础与写作》的词汇要求。</p><p>官方附录只提供词目与模块，不含中文释义。释义由 ECDICT 开源数据和拾词编写补充；原起步词的例句、搭配保留。常用词组需结合阅读和真题继续积累。</p><div class="source-links"><a href="https://www.moe.gov.cn/srcsite/A07/moe_737/s3876_qt/202104/t20210409_525482.html" target="_blank" rel="noopener noreferrer">教育部课程标准</a><a href="https://jwc.ycpc.edu.cn/_upload/article/files/c7/5f/68edc6dd4ce1869d09bf75ca278e/2255eca3-22c2-4171-aee5-fa75cbfc1ff0.pdf" target="_blank" rel="noopener noreferrer">词汇附录原文</a><a href="./vocabulary-sources.md" target="_blank" rel="noopener noreferrer">整理说明与释义授权</a></div></details>`; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); storageError = false; } catch { storageError = true; toast('保存失败：请及时导出备份，或检查浏览器储存空间。'); } }
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('visible'); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200); }
const formatDate = (time, options = {}) => new Date(time).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', month: 'long', day: 'numeric', ...options });
const intervalLabel = value => value <= 1 ? '明天' : `${value}天后`;
function go(next) { view = next; modalId = null; render(); window.scrollTo(0, 0); }
function speak(term) {
  if (!('speechSynthesis' in window)) return toast('当前浏览器不支持朗读。');
  const utterance = new SpeechSynthesisUtterance(term); utterance.lang = 'en-US'; utterance.rate = .85;
  const voice = speechSynthesis.getVoices().find(v => v.lang === 'en-US') || speechSynthesis.getVoices().find(v => v.lang.startsWith('en'));
  if (voice) utterance.voice = voice;
  utterance.onerror = event => { if (!['interrupted', 'canceled'].includes(event.error)) toast('朗读暂不可用，请检查设备语音支持。'); };
  speechSynthesis.cancel(); speechSynthesis.speak(utterance);
}
function shell(body) {
  const due = dueWords(words(), state.progress).length;
  const nav = [['home', 'home', '今日学习'], ['book', 'book', '我的词库'], ['stats', 'chart', '学习记录'], ['import', 'plus', '添加单词'], ['settings', 'settings', '学习设置']];
  const current = nav.find(x => x[0] === view)?.[2] || '专注背词';
  return `<div class="app-shell"><aside class="sidebar"><a class="brand" href="#home" aria-label="拾词首页"><span class="brand-mark">${icon('leaf')}</span><div><h1>拾词</h1><p>WORD BY WORD</p></div></a><div class="nav-label">我的学习空间</div><nav aria-label="主导航">${nav.map(([id, glyph, label]) => `<button class="nav-item ${view === id || (view === 'study' && id === 'home') ? 'active' : ''}" data-nav="${id}">${icon(glyph)}<span class="nav-text">${label}</span>${id === 'home' && due ? `<span class="badge">${due}</span>` : ''}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="sidebar-note"><span class="tiny">给未来的自己</span><p>每一次小小的坚持，<br>都会在考场上回响。</p></div><div class="sidebar-user"><div class="avatar">27</div><div><strong>我的公办计划</strong><p>广东专插本 · 英语</p></div><span class="dot" aria-label="本地记录"></span></div></div></aside><main class="main"><header class="topbar"><div class="mobile-brand">${icon('leaf')}拾词</div><div class="crumb">学习空间 ${icon('chevron')} <strong>${current}</strong></div><div class="top-right"><span class="saved-status">${icon('save')}${storageError ? '记录未保存' : '记录保存在本机'}</span><span class="pill">${icon('flame')}连续学习 ${streak(state.logs)} 天</span></div></header><div class="content">${body}<footer class="footer"><span class="footer-logo">拾词 / WORD BY WORD</span><span>为 2027 广东专插本英语备考积累每一词</span></footer></div></main></div>${modalId ? detailModal(modalId) : ''}`;
}
function art() { return `<svg viewBox="0 0 270 210" aria-hidden="true"><ellipse cx="147" cy="188" rx="96" ry="11" fill="#dfe7d2" stroke="none"/><g transform="translate(60 62) rotate(-9 66 65)"><rect x="7" y="5" width="102" height="128" rx="7" fill="#d3dcc6" stroke="#b5c3a6"/><rect x="0" y="0" width="103" height="128" rx="7" fill="#fbfcf5" stroke="#b9c6a7"/><path d="M12 0v128" stroke="#dbe3ce"/><text x="27" y="30" fill="#87966e" stroke="none" font-size="8" letter-spacing="2">ONE WORD</text><text x="27" y="50" fill="#426142" stroke="none" font-size="15" font-family="Georgia">at a time.</text><path d="M28 72h49m-49 10h36m-36 10h44" stroke="#d1dcc1"/><path d="m29 109 4 4 8-9" stroke="#97ae7b"/></g><g transform="translate(137 32) rotate(11 45 65)"><rect x="0" y="0" width="84" height="112" rx="8" fill="#4f714b" stroke="#476645"/><text x="14" y="23" fill="#d0debc" stroke="none" font-size="7" letter-spacing="1.5">A LITTLE</text><text x="14" y="44" fill="#f3f5e5" stroke="none" font-size="15" font-family="Georgia">every day.</text><path d="M19 81c0-15 13-20 34-18 0 18-10 27-29 24" fill="#c4d5ad" stroke="none"/><path d="m16 94 30-24" stroke="#8eab74" stroke-width="2"/></g><path d="M232 171v-34m0 11c-17 0-19-17-19-17s20 0 19 17m0-8c0-16 17-20 17-20s2 16-17 20" fill="#b7c8a2" stroke="#91a979"/><path d="m40 45 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" fill="#cfbb8a" stroke="none"/><circle cx="238" cy="69" r="3" fill="#a9bc92" stroke="none"/><circle cx="39" cy="151" r="3" fill="#a9bc92" stroke="none"/></svg>`; }
function home() {
  const all = words(), stats = statsFor(all, state.progress), today = todayStats(state.logs), due = dueWords(all, state.progress).length;
  const remaining = Math.min(Math.max(0, state.settings.dailyNew - today.learned), stats.new);
  const resumable = state.activeSession && state.activeSession.index < state.activeSession.queue.length;
  const percent = Math.round(stats.learned / all.length * 100);
  const days = Array.from({ length: 7 }, (_, i) => Date.now() - (6 - i) * DAY), counts = logCounts(state.logs);
  const f = forecast(all, state.progress), max = Math.max(1, ...f.map(x => x.count));
  return `<div class="greeting"><div><div class="eyebrow">YOUR DAILY LITTLE PROGRESS</div><h2>今天，也向目标靠近一点。</h2><p>慢慢来，每个记住的单词都算数。</p></div><div class="date">${formatDate(Date.now(), { weekday: 'long' })}</div></div>
    <section class="hero"><div class="hero-copy"><div class="hero-label">${icon('sprout')}2027 广东专插本 · 英语记忆计划</div><h3>让单词从“见过”，<br>变成“记得”。</h3><p>${due ? `今天有 ${due} 个单词等你复习，再学 ${remaining} 个新词。` : remaining ? `今天从 ${remaining} 个新词开始，给记忆一点时间。` : '今日新词目标已完成，记得明天回来复习。'}</p><button class="btn primary" data-action="start">${resumable ? '继续本轮学习' : due ? '开始今日复习' : remaining ? '开始今日学习' : '查看学习记录'}${icon('arrow')}</button><span class="hero-foot">${due + remaining ? `预计 ${Math.max(2, Math.round((due + remaining) * .5))} 分钟 · 复习优先` : '一点一滴，积累底气'}</span></div><div class="hero-art">${art()}</div></section>
    <div class="stat-grid">${statCard('今日待复习', due, '词', due ? '记忆需要及时浇水' : '暂无到期单词', 'clock')}${statCard('今日新词', today.learned, `/ ${state.settings.dailyNew}`, `${remaining} 个新词待学习`, 'sprout')}${statCard('累计已学', stats.learned, '词', `词库共 ${all.length} 个单词`, 'book')}${statCard('连续学习', streak(state.logs), '天', streak(state.logs) ? '继续保持你的节奏' : '今天，是很好的开始', 'flame')}</div>
    <div class="dashboard-bottom"><div><div class="section-title"><h3>正在学习的词书</h3><button class="small-link" data-nav="book">查看全部 ${icon('chevron')}</button></div><article class="book-card"><div class="book-cover"><span class="book-kicker">ENGLISH</span><strong>专插本<br>公共英语</strong><small>2027 PREP</small></div><div class="book-info"><h4>课标 3000 词目 · 公共英语</h4><p>分层词汇 · 中文释义 · 间隔复习<br><span class="chip">${all.length} 词</span> <span class="chip">${state.customWords.length ? '含自建单词' : '课标词目 + 起步补充'}</span></p><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div><div class="progress-caption"><span>已学 ${stats.learned} / ${all.length}</span><span>${percent}%</span></div></div><button class="arrow-btn" data-nav="book" aria-label="打开词书">${icon('arrow')}</button></article><div class="week-card"><div class="week-title"><span>这一周的坚持</span><small>每学一个词，就留下一个脚印</small></div><div class="week-grid">${days.map((d, i) => { const count = counts.get(dayKey(d))?.size || 0; return `<div class="week-day ${i === 6 ? 'today' : ''} ${count ? 'done' : ''}">${i === 6 ? '今天' : new Date(d).toLocaleDateString('zh-CN', { weekday: 'short', timeZone: 'Asia/Shanghai' })}<div class="week-dot">${count ? icon('check') : new Date(d).toLocaleDateString('en-US', { day: 'numeric', timeZone: 'Asia/Shanghai' })}</div><div class="week-number">${count ? `${count}词` : '·'}</div></div>`; }).join('')}</div></div></div>
    <div class="right-column"><div class="section-title"><h3>未来 7 天复习安排</h3><span class="label">SPACED REPETITION</span></div><div class="memory-card"><p>根据你的记忆反馈安排复习，<br>熟悉的词间隔更长，忘记的词更快回来。</p><div class="forecast-chart">${f.map(x => `<div class="bar-group"><span class="bar-number">${x.count}</span><div class="bar" style="height:${Math.max(3, x.count / max * 61)}px"></div></div>`).join('')}</div><div class="forecast-labels">${f.map((x, i) => `<span>${i === 0 ? '今天' : `${x.date.slice(5).replace('-', '/')}`}</span>`).join('')}</div><div class="legend"><i></i>当前安排 · 随复习反馈动态变化</div></div><div class="tip-card">${icon('bulb')}<div><strong>记忆小贴士</strong><p>先想一想意思，再翻开答案。<br>认真回忆一次，比多看一眼更有帮助。</p></div></div></div></div>`;
}
function statCard(title, count, unit, subtitle, glyph) { return `<div class="stat"><div class="stat-head">${title}${icon(glyph)}</div><div class="stat-value">${count}<span>${unit}</span></div><div class="stat-foot">${e(subtitle)}</div></div>`; }
function statusLabel(w) {
  const p = state.progress[w.id];
  if (!p) return ['new', '未学习'];
  if (p.due <= Date.now()) return ['due', '待复习'];
  if (p.status === 'mastered') return ['mastered', '较稳固'];
  return ['', `${formatDate(p.due)}复习`];
}
function filteredWords() { return words().filter(w => {
  const p = state.progress[w.id];
  return `${w.term} ${w.meaning} ${w.tip}`.toLowerCase().includes(search.toLowerCase()) && (group === 'all' || w.group === group)
    && (filter === 'all' || filter === 'new' && !p || filter === 'due' && p && p.due <= Date.now() || filter === 'difficult' && p?.lapses > 0 || filter === 'favorite' && state.favorites.includes(w.id) || filter === 'mastered' && p?.status === 'mastered');
  }); }
function book() {
  return `<div class="page-head"><div><div class="eyebrow">YOUR WORD COLLECTION</div><h2>我的词库</h2><p>把每一个陌生的词，慢慢变成熟悉的朋友。</p></div><button class="btn primary" data-nav="import">${icon('plus')}添加单词</button></div>${vocabularySource()}<div class="toolbar"><label class="search-wrap">${icon('search')}<input id="search" type="search" aria-label="搜索单词或中文释义" placeholder="搜索单词或中文释义" value="${e(search)}"></label><select id="word-filter" class="select" aria-label="学习状态筛选">${[['all','全部状态'],['new','未学习'],['due','待复习'],['difficult','易忘词'],['favorite','已收藏'],['mastered','较稳固']].map(([v,l]) => `<option value="${v}" ${filter===v?'selected':''}>${l}</option>`).join('')}</select><select id="group-filter" class="select" aria-label="词汇分组筛选"><option value="all">全部分组</option>${[...new Set(words().map(w=>w.group))].map(g=>`<option ${g===group?'selected':''}>${e(g)}</option>`).join('')}</select></div><div id="book-results">${bookResults()}</div>`;
}
function bookResults() {
  const filtered = filteredWords(), pages = Math.max(1, Math.ceil(filtered.length / 15)); page = Math.min(page, pages);
  return `<div class="word-count">共 ${filtered.length} 个单词${filter==='difficult'?' · 曾选择过“忘了”的词':''}</div><div class="word-list">${filtered.slice((page-1)*15,page*15).map(w => { const [cls,label] = statusLabel(w); return `<article class="word-row"><div><strong>${e(w.term)}</strong><span class="pos">${e(w.pos)}</span><small>${e(w.group)}</small></div><div class="meaning">${e(w.meaning)}</div><span class="state-chip ${cls}">${label}</span><div class="row-actions"><button class="icon-btn ${state.favorites.includes(w.id)?'favorite':''}" data-favorite="${e(w.id)}" aria-label="${state.favorites.includes(w.id)?'取消收藏':'收藏'} ${e(w.term)}" aria-pressed="${state.favorites.includes(w.id)}">${icon('star')}</button><button class="icon-btn" data-detail="${e(w.id)}" aria-label="查看 ${e(w.term)}">${icon('chevron')}</button></div></article>`; }).join('') || `<div class="panel empty">${icon('search')}<h3>这里还没有单词</h3><p>试试其他关键词或筛选条件。</p>${filter==='difficult'?'<p>坚持复习后，易忘词会在这里集中出现。</p>':''}</div>`}</div><div class="pagination"><button class="btn secondary" data-page="${page-1}" ${page===1?'disabled':''}>上一页</button><span>${page} / ${pages}</span><button class="btn secondary" data-page="${page+1}" ${page>=pages?'disabled':''}>下一页</button></div>`;
}
function meaningBlock(w) { return `<div class="meaning-block"><div class="meaning"><span class="pos">${e(w.pos)}</span>${e(w.meaning)}</div>${w.example?`<div class="example"><p>${e(w.example)}</p>${w.translation?`<p class="translation">${e(w.translation)}</p>`:''}</div>`:''}${w.tip?`<div class="word-tip">${icon('bulb')}${e(w.tip)}</div>`:''}${w.headwords?`<p class="meaning-source">课标词目：${e(w.headwords.join("；"))} · 释义：${e(w.meaningSource)}${w.sourcePage?` · 原文第${w.sourcePage}页`:""}</p>`:""}</div>`; }
function detailModal(id) {
  const w = words().find(x=>x.id===id); if (!w) return '';
  const p = state.progress[id];
  return `<div class="modal-backdrop" data-dismiss="true"><section class="modal" role="dialog" aria-modal="true" aria-label="${e(w.term)} 单词详情" tabindex="-1"><div class="modal-head"><h3>单词笔记</h3><button class="icon-btn" data-action="close-modal" aria-label="关闭">${icon('close')}</button></div><div class="study-term">${e(w.term)}</div><div class="pronunciation"><button class="audio-btn" data-audio="${e(w.id)}">${icon('audio')}听发音</button></div>${meaningBlock(w)}<p class="desc" style="margin-top:18px;font-size:11px;color:var(--muted)">${p?`下次复习：${formatDate(p.due, {hour:'2-digit',minute:'2-digit'})} · 累计忘记 ${p.lapses} 次`:'尚未学习，开始今日学习后会自动安排复习。'}</p><button class="btn secondary" data-favorite="${e(w.id)}">${icon('star')}${state.favorites.includes(w.id)?'已收藏 · 取消':'收藏这个词'}</button></section></div>`;
}
function startSession() {
  if (state.activeSession && state.activeSession.index < state.activeSession.queue.length) { revealed = false; spellAnswer = ''; go('study'); return; }
  const all = words(), today = todayStats(state.logs);
  const due = dueWords(all,state.progress);
  const fresh = all.filter(w=>!state.progress[w.id]).slice(0,Math.max(0,state.settings.dailyNew-today.learned));
  if (!due.length && !fresh.length) { go('stats'); toast('今日任务已完成，下次到期时再来复习。'); return; }
  state.activeSession = { queue: [...due.map(w=>({id:w.id,isNew:false})),...fresh.map(w=>({id:w.id,isNew:true}))], index:0, completed:[], ratings:{again:0,hard:0,good:0}, started:Date.now(), initial:due.length+fresh.length };
  revealed = false; spellAnswer = ''; save(); go('study'); autoSpeak();
}
function currentWord() { return state.activeSession ? words().find(w=>w.id===state.activeSession.queue[state.activeSession.index]?.id) : null; }
function autoSpeak() { const w = currentWord(); if (state.settings.autoAudio && mode==='recall' && w) speak(w.term); }
function study() {
  const s = state.activeSession; if (!s) return `<div class="empty"><h3>准备好开始了吗？</h3><button class="btn primary" data-action="start">开始今日学习</button></div>`;
  if (s.index>=s.queue.length) return summary();
  const w = currentWord(); if (!w) { state.activeSession=null; save(); return `<div class="empty">本轮单词已经变动，请重新开始。<button class="btn primary" data-action="start">开始学习</button></div>`; }
  const item=s.queue[s.index], p=state.progress[w.id], count=new Set(s.completed).size, percent=Math.round(count/s.initial*100);
  return `<div class="study-layout"><div class="session-header"><button class="btn secondary" data-action="pause">${icon('pause')}暂停学习</button><div class="session-progress"><div class="progress-caption"><span>本轮已练习 ${count} / ${s.initial} 词</span><span>${s.queue.length-s.index} 张卡片待练</span></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div></div></div><div class="study-mode"><button data-mode="recall" class="${mode==='recall'?'active':''}">认词 · 英译中</button><button data-mode="spell" class="${mode==='spell'?'active':''}">拼写 · 中译英</button></div><article class="study-card"><div class="study-top"><span class="word-status">${item.retry?'本轮再练':item.isNew?'新单词':'到期复习'}</span><span>${e(w.group)}</span><button class="icon-btn ${state.favorites.includes(w.id)?'favorite':''}" data-favorite="${e(w.id)}" aria-label="收藏 ${e(w.term)}" aria-pressed="${state.favorites.includes(w.id)}">${icon('star')}</button></div>
  ${mode==='recall'?`<h2 class="study-term">${e(w.term)}</h2><div class="pronunciation"><span>${e(w.pos)}</span><button class="audio-btn" data-audio="${e(w.id)}">${icon('audio')}听发音</button></div>`:`<h2 class="study-term" style="font-size:26px;line-height:1.6;letter-spacing:0">${e(w.meaning)}</h2><div class="pronunciation">${e(w.pos)} · 试着拼出英文</div>${revealed?`<p class="spell-result">${spellAnswer.trim().toLowerCase()===w.term.toLowerCase()?'✓ 拼写正确':'你的答案：'+(spellAnswer?e(spellAnswer):'未填写')}<br><strong style="display:block;font-size:30px;color:var(--green);margin-top:12px">${e(w.term)}</strong></p>`:`<input id="spell-input" class="spell-input" aria-label="输入英文拼写" placeholder="输入英文…" autocomplete="off" autocapitalize="none" spellcheck="false" value="${e(spellAnswer)}">`}`}
  ${revealed?meaningBlock(w):`<p class="reveal-hint">${mode==='recall'?'先在心里回忆它的意思，再查看答案。':'想不起来也没关系，查看答案后再巩固。'}</p><button class="btn primary reveal-btn" data-action="reveal">${mode==='recall'?'查看释义':'检查拼写'}${icon('arrow')}</button>`}</article>
  ${revealed?`<p class="grade-heading">按看到答案之前的记忆情况，诚实选择</p><div class="grades">${[['again','reset','忘了','本轮再练 + 1分钟后'],['hard','question','模糊',intervalLabel(schedule(p,'hard').interval)],['good','smile','记得',intervalLabel(schedule(p,'good').interval)]].map(([grade,glyph,label,next],i)=>`<button class="grade-btn ${grade}" data-grade="${grade}">${icon(glyph)}<strong>${label}</strong><small>${next}</small></button>`).join('')}</div>`:''}<p class="keyboard-hint"><span class="kbd">空格</span>查看释义 · <span class="kbd">1</span>忘了 <span class="kbd">2</span>模糊 <span class="kbd">3</span>记得</p></div>`;
}
let grading=false;
function rate(grade) {
  if (!revealed || grading) return; grading=true;
  const s=state.activeSession, w=currentWord(); if (!s || !w) { grading=false; return; }
  const at=Date.now(), isNew=!state.progress[w.id];
  state.progress[w.id]=schedule(state.progress[w.id],grade,at); state.logs.push({id:w.id,at,grade,isNew});
  s.ratings[grade]++; if (!s.completed.includes(w.id)) s.completed.push(w.id);
  if (grade==='again') { const place=Math.min(s.queue.length,s.index+4); s.queue.splice(place,0,{id:w.id,isNew:s.queue[s.index].isNew,retry:true}); }
  s.index++; revealed=false; spellAnswer=''; save(); render(); autoSpeak();
  if (grade==='again') toast('这个词会在本轮再次出现，稍后再回忆一次。');
  setTimeout(()=>{grading=false;},180);
}
function summary() {
  const s=state.activeSession;
  return `<div class="study-layout"><section class="summary-card"><div class="summary-icon">${icon('sprout')}</div><h3>又给记忆，浇了一点水。</h3><p>本轮练习已完成，复习日期已根据反馈更新。<br>今天的努力，会成为明天的底气。</p><div class="summary-metrics"><div><strong>${new Set(s.completed).size}</strong><small>本轮练习单词</small></div><div><strong>${s.ratings.good}</strong><small>选择“记得”次数</small></div><div><strong>${Math.max(1,Math.round((Date.now()-s.started)/60000))}</strong><small>分钟 · 含暂停</small></div></div><div class="summary-actions"><button class="btn primary" data-action="finish">回到今日学习 ${icon('arrow')}</button><button class="btn secondary" data-nav="stats">查看学习记录</button></div><p style="font-size:10px;margin:24px 0 0">按时复习已经学过的词，比一次塞进太多新词更容易坚持。</p></section></div>`;
}
function statsPage() {
  const all=words(), stats=statsFor(all,state.progress), today=todayStats(state.logs), days=Array.from({length:56},(_,i)=>Date.now()-(55-i)*DAY), counts=logCounts(state.logs);
  const ratings={again:0,hard:0,good:0}; state.logs.forEach(l=>ratings[l.grade]++);
  const recent = state.logs.slice(-12).reverse();
  return `<div class="page-head"><div><div class="eyebrow">SMALL STEPS, REAL PROGRESS</div><h2>看见自己的积累</h2><p>学习过的每一天，都值得被记下来。</p></div></div><div class="stat-grid">${statCard('今天已练习',today.unique,'词',`共 ${today.events} 次记忆反馈`,'target')}${statCard('累计已学',stats.learned,'词',`还有 ${stats.new} 个词待学习`,'book')}${statCard('记忆较稳固',stats.mastered,'词','连续记得且间隔达到21天','leaf')}${statCard('易忘词',stats.difficult,'词','曾选择过“忘了”的词','reset')}</div><div class="two-columns"><section class="panel"><h3>最近 8 周的学习足迹</h3><p class="desc">颜色越深，当天练习的不同单词越多。</p><div class="history-grid">${days.map(d=>{ const count=counts.get(dayKey(d))?.size || 0; const level=count===0?0:count<10?1:count<20?2:count<40?3:4; return `<div class="history-cell ${level?'l'+level:''}" role="img" aria-label="${dayKey(d)}，练习${count}个词" title="${dayKey(d)} · ${count} 词"></div>`; }).join('')}</div><div class="history-legend">少 ${[0,1,2,3,4].map(n=>`<i style="background:${['#f0f3e9','#dbe5cb','#a9be90','#789966','#406742'][n]}"></i>`).join('')}多</div><div class="setting-row"><div><strong>累计记忆反馈</strong><p>包括同一个词在本轮中的再次练习。</p></div><strong>${state.logs.length} 次</strong></div><div class="setting-row"><div><strong>记得 / 模糊 / 忘了</strong><p>诚实反馈，才能安排合适的复习间隔。</p></div><strong>${ratings.good} / ${ratings.hard} / ${ratings.again}</strong></div></section><section class="panel"><h3>最近练习</h3><p class="desc">记录最近12次反馈，学习日期按北京时间统计。</p>${recent.length?recent.map(l=>{const w=all.find(x=>x.id===l.id);return `<div class="setting-row" style="padding:10px 0"><div><strong>${e(w?.term||l.id)}</strong><p style="margin-top:3px">${formatDate(l.at,{hour:'2-digit',minute:'2-digit'})}</p></div><span class="state-chip ${l.grade==='again'?'due':''}">${{again:'忘了',hard:'模糊',good:'记得'}[l.grade]}</span></div>`;}).join(''):`<div class="empty">${icon('sprout')}<p>从今天的第一个词开始，<br>你的学习足迹会出现在这里。</p><button class="btn primary" data-action="start">开始学习</button></div>`}</section></div>`;
}
function importPage() {
  return `<div class="page-head"><div><div class="eyebrow">BUILD YOUR OWN WORD BOOK</div><h2>把要学的词，放进来</h2><p>真题生词、老师整理的词表，都能加入自己的复习计划。</p></div></div><div class="two-columns"><section class="panel"><h3>添加一个单词</h3><p class="desc">释义填你需要掌握的词义，例句和搭配可以之后补充。</p><form id="add-form"><div class="field"><label for="add-term">英文单词 / 短语 *</label><input id="add-term" name="term" required maxlength="120" placeholder="例如：make a difference"></div><div class="field"><label for="add-meaning">中文释义 *</label><input id="add-meaning" name="meaning" required maxlength="500" placeholder="例如：产生影响；起作用"></div><div class="field"><label for="add-example">英文例句（选填）</label><input id="add-example" name="example" maxlength="1500" placeholder="Small actions can make a difference."></div><div class="field"><label for="add-translation">例句翻译（选填）</label><input id="add-translation" name="translation" maxlength="1500" placeholder="小小的行动也能产生影响。"></div><div class="field"><label for="add-tip">搭配 / 记忆笔记（选填）</label><input id="add-tip" name="tip" maxlength="1500" placeholder="记录易错点或常用搭配"></div><button class="btn primary" type="submit">${icon('plus')}加入我的词库</button></form></section><section class="panel"><h3>批量导入词表</h3><p class="desc">支持 CSV / TSV / TXT。每行一个词，至少包含英文和中文释义；用逗号、Tab 或竖线分隔。</p><div class="field"><label for="import-text">粘贴你的词表</label><textarea id="import-text" placeholder="单词,释义,英文例句,例句翻译,记忆笔记&#10;ambition,志向；抱负&#10;persist,坚持&#10;make a difference,产生影响"></textarea><div class="help">可选列顺序：英文例句、例句翻译、记忆笔记。包含逗号的内容请用英文双引号包起来。已有单词会自动跳过。</div></div><label class="file-drop" for="words-file">${icon('upload')}选择本地词表文件<small>CSV / TSV / TXT · 最大 4 MB · UTF-8 编码</small></label><input class="sr-only" id="words-file" type="file" accept=".csv,.tsv,.txt"><button class="btn primary" data-action="import-text">导入到词库 ${icon('arrow')}</button><div id="import-message" class="import-message" role="status">${e(importMessage)}</div>${vocabularySource()}</section></div>`;
}
function settingsPage() {
  return `<div class="page-head"><div><div class="eyebrow">FIND YOUR OWN RHYTHM</div><h2>找到适合自己的节奏</h2><p>新词量可以调整，到期复习会优先安排。</p></div></div><div class="two-columns"><section class="panel"><h3>学习偏好</h3><div class="setting-row"><div><strong>每日新词目标</strong><p>每天 5–100 个。先保持稳定，再逐渐增加。</p></div><label><span class="sr-only">每日新词数量</span><input id="daily-new" type="number" min="5" max="100" step="1" value="${state.settings.dailyNew}"></label></div><div class="setting-row"><div><strong>认词时自动朗读</strong><p>使用设备自带的英文语音，具体音色由浏览器决定。</p></div><input id="auto-audio" class="toggle" type="checkbox" ${state.settings.autoAudio?'checked':''} aria-label="自动朗读单词"></div><button class="btn secondary" data-action="test-audio" style="margin-top:18px">${icon('audio')}测试英文发音</button><div class="disclaimer">复习安排采用简化的间隔重复规则，根据“忘了 / 模糊 / 记得”更新每个词的日期。它帮助你形成复习习惯，记忆效果仍取决于持续练习。</div><div class="info-steps"><div class="info-step"><span class="step-num">1</span><div><strong>忘了 → 尽快再回忆</strong>本轮稍后再次出现，暂时安排1分钟后复习。</div></div><div class="info-step"><span class="step-num">2</span><div><strong>模糊 → 缩短增长速度</strong>至少隔1天复习，间隔增长较慢。</div></div><div class="info-step"><span class="step-num">3</span><div><strong>记得 → 逐渐拉长间隔</strong>首次1天，再次3天，此后根据反馈增长。</div></div></div><div class="memory-map"><span>学习</span>${icon('arrow')}<span>1天</span>${icon('arrow')}<span>3天</span>${icon('arrow')}<span>约7天</span>${icon('arrow')}<span>更长间隔</span></div></section><section class="panel"><h3>记录与备份</h3><p class="desc">单词、记忆反馈和学习记录保存在当前浏览器。关闭网页后仍会保留；更换设备或清除浏览器数据前，请导出备份。</p><div class="setting-row"><div><strong>个人词库</strong><p>自建单词 ${state.customWords.length} 个 · 收藏 ${state.favorites.length} 个</p></div>${icon('book')}</div><div class="setting-row"><div><strong>复习记录</strong><p>已学 ${Object.keys(state.progress).length} 个词 · 共 ${state.logs.length} 次反馈</p></div>${icon('save')}</div><div class="backup-buttons"><button class="btn primary" data-action="export">${icon('download')}导出完整备份</button><label class="btn secondary" for="backup-file">${icon('upload')}导入备份</label><input class="sr-only" id="backup-file" type="file" accept=".json"></div><p class="desc">导入备份会先展示文件内容摘要，确认后才替换当前记录。手机和电脑之间可用备份手动迁移，目前没有自动云同步。</p><div class="tip-card">${icon('bulb')}<div><strong>让复习成为每天的小习惯</strong><p>可以把网站加入浏览器收藏夹。打开后会显示到期单词；关闭网页时不会发送推送提醒。</p></div></div><div class="disclaimer">每日统计使用北京时间（Asia/Shanghai）。预计用时仅供规划；“较稳固”是复习间隔达到21天且连续记得的状态标签。</div></section></div>`;
}
function render() {
  $('#app').innerHTML=shell(({home,book,study,stats:statsPage,import:importPage,settings:settingsPage}[view]||home)());
  bind();
  if (modalId) { $('.modal')?.focus(); }
  if (view==='study' && mode==='spell' && !revealed) $('#spell-input')?.focus();
}
function bind() {
  $('#search')?.addEventListener('input',event=>{search=event.target.value;page=1;$('#book-results').innerHTML=bookResults();});
  $('#word-filter')?.addEventListener('change',event=>{filter=event.target.value;page=1;$('#book-results').innerHTML=bookResults();});
  $('#group-filter')?.addEventListener('change',event=>{group=event.target.value;page=1;$('#book-results').innerHTML=bookResults();});
  $('#spell-input')?.addEventListener('input',event=>{spellAnswer=event.target.value;});
  $('#daily-new')?.addEventListener('change',event=>{const n=Math.round(Number(event.target.value));if(!Number.isFinite(n)||n<5||n>100){event.target.value=state.settings.dailyNew;toast('每日新词请设置为5到100之间的整数。');return;}state.settings.dailyNew=n;save();toast(`每日新词目标已设为 ${n} 个。`);});
  $('#auto-audio')?.addEventListener('change',event=>{state.settings.autoAudio=event.target.checked;save();if(event.target.checked)speak('Welcome to Wordleaf.');});
  $('#add-form')?.addEventListener('submit',event=>{
    event.preventDefault();const values=Object.fromEntries(new FormData(event.target));
    const line=[values.term,values.meaning,values.example,values.translation,values.tip].map(x=>`"${String(x).replace(/"/g,'""')}"`).join(',');
    const result=addImported(line);if(result?.added.length){event.target.reset();$('#add-term').focus();}
  });
  $('#words-file')?.addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;if(file.size>4*1024*1024){toast('文件超过4 MB，请拆分后导入。');return;}
    try{const content=await file.text();if(content.includes('\uFFFD'))throw new Error('文件编码可能不是UTF-8，请转为UTF-8后再导入。');const result=addImported(content);if(result){importMessage=`已从 ${file.name} 导入 ${result.added.length} 个词，跳过重复 ${result.skipped} 个，无效行 ${result.invalid} 行。`;$('#import-message').textContent=importMessage;}}catch(err){toast(err.message);}event.target.value='';
  });
  $('#backup-file')?.addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;if(file.size>20*1024*1024){toast('备份文件过大（最多20 MB）。');return;}
    try{const restored=validateBackup(JSON.parse(await file.text()));const answer=window.confirm(`导入备份：${restored.customWords.length}个自建词，${Object.keys(restored.progress).length}个词的学习进度，${restored.logs.length}次反馈。\n\n这会替换当前浏览器中的学习记录。建议先导出当前备份。确定导入吗？`);if(answer){state=restored;search='';filter='all';group='all';save();render();toast('备份恢复成功。');}}catch(err){toast(`无法导入备份：${err.message}`);}event.target.value='';
  });
}
function addImported(content) {
  try{const result=importWords(content,words());if(!result.added.length){toast(result.skipped?'这些单词已经在词库里。':'未找到有效单词，请按“英文,中文释义”格式填写。');return result;}state.customWords.push(...result.added);save();importMessage=`成功导入 ${result.added.length} 个词；跳过重复 ${result.skipped} 个，无效行 ${result.invalid} 行。`;if($('#import-message'))$('#import-message').textContent=importMessage;toast(`已将 ${result.added.length} 个单词加入词库。`);return result;}catch(err){toast(err.message);return null;}
}
function exportBackup() { const blob=new Blob([JSON.stringify({app:'wordleaf',version:1,exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`拾词备份-${dayKey()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('备份已导出，请妥善保存。'); }
document.addEventListener('click',event=>{
  const target=event.target.closest('[data-nav],[data-action],[data-grade],[data-audio],[data-detail],[data-favorite],[data-page],[data-mode]');
  if(!target){if(event.target.matches('[data-dismiss]')){modalId=null;render();}return;}
  if(target.dataset.nav){go(target.dataset.nav);return;}
  if(target.dataset.grade){rate(target.dataset.grade);return;}
  if(target.dataset.audio){const w=words().find(x=>x.id===target.dataset.audio);if(w)speak(w.term);return;}
  if(target.dataset.detail){modalId=target.dataset.detail;render();return;}
  if(target.dataset.favorite){const id=target.dataset.favorite;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();if(view==='book'&&!modalId)$('#book-results').innerHTML=bookResults();else render();return;}
  if(target.dataset.page){page=Number(target.dataset.page);$('#book-results').innerHTML=bookResults();return;}
  if(target.dataset.mode){mode=target.dataset.mode;revealed=false;spellAnswer='';render();autoSpeak();return;}
  const action=target.dataset.action;
  if(action==='start')startSession();
  else if(action==='reveal'){if(view==='study'&&state.activeSession){revealed=true;render();}}
  else if(action==='pause'){go('home');toast('已暂停，本轮进度会保留。');}
  else if(action==='finish'){state.activeSession=null;save();go('home');}
  else if(action==='close-modal'){modalId=null;render();}
  else if(action==='import-text')addImported($('#import-text').value);
  else if(action==='export')exportBackup();
  else if(action==='test-audio')speak('Every word is a small step forward.');
});
document.addEventListener('keydown',event=>{
  if(modalId){if(event.key==='Escape'){modalId=null;render();}else if(event.key==='Tab'){const focusable=[...$('.modal').querySelectorAll('button,input,a')];const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===$('.modal'))){event.preventDefault();first?.focus();}}return;}
  if(view!=='study'||!currentWord())return;
  if(event.target.matches('input,textarea,select')){if(event.key==='Enter'&&event.target.id==='spell-input'){event.preventDefault();revealed=true;render();}return;}
  if(event.target.matches('button,a'))return;
  if(event.code==='Space'&&!revealed){event.preventDefault();revealed=true;render();}
  else if(revealed&&['1','2','3'].includes(event.key)){event.preventDefault();rate({1:'again',2:'hard',3:'good'}[event.key]);}
});
window.addEventListener('storage',event=>{if(event.key===KEY&&event.newValue){try{const loaded=JSON.parse(event.newValue);state={...validateBackup({app:'wordleaf',version:1,state:loaded}),activeSession:loaded.activeSession||null};revealed=false;render();toast('已更新为其他标签页的最新学习记录。');}catch{toast('其他标签页的记录读取失败。');}}});
window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);if(['home','book','stats','import','settings'].includes(next))go(next);});
setInterval(()=>{if(view==='home')render();},60000);
render();if(startupMessage)toast(startupMessage);
