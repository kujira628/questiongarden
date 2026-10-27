// Question Garden — main app (no build step, plain ES modules)
import { db, uid, exportAll, importAll } from './db.js';
import { t, setLang, getLang, fmtDate } from './i18n.js';
import { PRINCIPLES, REFS, TIPS, TIP_CATEGORIES, INVITATIONS, STAGES, PAPERS } from './content.js';
import { callClaude, coachSystem as coachSystemBase, fragmentsBlock, questionBlock, libraryBlock, PROMPTS, parseJSON } from './ai.js';

const APP_VERSION = '1.1.0';
const DATA_STORES = ['questions', 'versions', 'fragments', 'invitations', 'insights', 'library'];
const deviceLang = (navigator.language || 'ja').toLowerCase().startsWith('ja') ? 'ja' : 'en';
const DEFAULTS = {
  uiLang: deviceLang, recLang: deviceLang, coachLang: 'same', theme: 'auto',
  apiKey: '', model: 'claude-sonnet-5-5', anonymize: true, anonNames: '',
  liveTranscribe: true, onboarded: false, hideInstall: false, userName: '', oaKey: '',
};
let S = { ...DEFAULTS };
const state = { questions: [], versions: [], fragments: [], invitations: [], insights: [], library: [] };
const coachSystem = (lang) => coachSystemBase(lang, S.userName);
let tipFilter = 'all';
let audioURLs = [];
const coach = {}; // questionId -> { messages, parsed, fmap }

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const L = (obj) => (obj ? (obj[getLang()] ?? obj.ja ?? obj.en) : '');
const detectLang = (s) => (/[぀-ヿ㐀-鿿]/.test(s || '') ? 'ja' : 'en');
const dayKey = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const startOfTomorrow = () => { const d = new Date(); d.setHours(24, 0, 0, 0); return d.getTime(); };
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------
async function loadSettings() { const m = await db.get('meta', 'settings'); S = { ...DEFAULTS, ...(m ? m.value : {}) }; }
async function saveSettings() { await db.put('meta', { id: 'settings', value: S }); }
async function loadAll() { for (const s of DATA_STORES) state[s] = await db.all(s); }
async function put(store, obj) {
  await db.put(store, obj);
  const arr = state[store]; const i = arr.findIndex((x) => x.id === obj.id);
  if (i >= 0) arr[i] = obj; else arr.push(obj);
  return obj;
}
async function remove(store, id) { await db.del(store, id); state[store] = state[store].filter((x) => x.id !== id); }

const qById = (id) => state.questions.find((q) => q.id === id);
const fragsOf = (qid) => state.fragments.filter((f) => (f.questionIds || []).includes(qid)).sort((a, b) => a.createdAt - b.createdAt);
const versionsOf = (qid) => state.versions.filter((v) => v.questionId === qid).sort((a, b) => a.createdAt - b.createdAt);
const activeQs = () => state.questions.filter((q) => q.status === 'active').sort((a, b) => lastActivity(b) - lastActivity(a));
function lastActivity(q) { const fs = fragsOf(q.id); return Math.max(q.updatedAt || q.createdAt, ...fs.map((f) => f.createdAt)); }

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 2400);
}
let sheetOnClose = null;
function openSheet(html, { onClose = null, full = false } = {}) {
  const sh = $('#sheet');
  $('.sheet-body', sh).innerHTML = html;
  sh.classList.toggle('full', full);
  sh.classList.remove('hidden');
  document.body.classList.add('noscroll');
  sheetOnClose = onClose;
}
function closeSheet() {
  const fn = sheetOnClose; sheetOnClose = null;
  if (fn) fn();
  $('#sheet').classList.add('hidden');
  document.body.classList.remove('noscroll');
}
function confirmDialog(msg) {
  return new Promise((resolve) => {
    const d = $('#dialog');
    d.innerHTML = `<div class="dialog-panel"><p>${esc(msg)}</p><div class="row end"><button class="btn ghost" data-r="0">${t('cancel')}</button><button class="btn danger" data-r="1">${t('delete')}</button></div></div>`;
    d.classList.remove('hidden');
    d.onclick = (e) => { const b = e.target.closest('[data-r]'); if (!b && e.target !== d) return; d.classList.add('hidden'); d.onclick = null; resolve(b ? b.dataset.r === '1' : false); };
  });
}
function evBadge(ev) { return `<span class="badge ev-${ev}">${t('ev_' + ev)}</span>`; }
function stageChip(s, active, action = '') {
  return `<button class="chip stage-${s} ${active ? 'on' : ''}" ${action} data-stage="${s}">${t('stage_' + s)}</button>`;
}
function catIcon(c) { return { body: '🚶', place: '🌳', people: '💬', rest: '🌙', question: '❓' }[c] || '·'; }
function kindIcon(k) { return { walk: '🚶', observation: '👀', conversation: '💬', making: '✋' }[k] || '🌱'; }

async function shareOrDownload(filename, blob) {
  try {
    const file = new File([blob], filename, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: filename }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

// light markdown: escape, bold, bullets, [F#] chips
function richText(text, fmap = {}, lmap = {}) {
  let h = esc(text || '');
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\[L(\d+)\]/g, (m, n) => { const id = lmap['L' + n]; const p = id && state.library.find((x) => x.id === id); return `<button class="fchip lchip" data-action="go" data-to="library" title="${p ? esc(p.title) : ''}">📚${p ? esc((p.authors || '').split(',')[0].split(' ').pop()) + ' ' + (p.year || '') : 'L' + n}</button>`; });
  h = h.replace(/\[F(\d+)\]/g, (m, n) => { const id = fmap['F' + n]; return id ? `<button class="fchip" data-action="goto-frag" data-id="${id}">F${n}</button>` : `<span class="fchip">F${n}</span>`; });
  const lines = h.split('\n'); let out = ''; let inList = false;
  for (const ln of lines) {
    const m = ln.match(/^\s*(?:[-•*]|\d+[.)])\s+(.*)/);
    if (m) { if (!inList) { out += '<ul>'; inList = true; } out += `<li>${m[1]}</li>`; continue; }
    if (inList) { out += '</ul>'; inList = false; }
    if (/^#+\s/.test(ln)) out += `<p><strong>${ln.replace(/^#+\s/, '')}</strong></p>`;
    else if (ln.trim()) out += `<p>${ln}</p>`;
  }
  if (inList) out += '</ul>';
  return out;
}

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------
function visibleInvitations(qid = null) {
  const now = Date.now(); const today = dayKey(now);
  let list = state.invitations.filter((i) => {
    if (qid && i.questionId !== qid) return false;
    if (i.status === 'accepted') return true;
    if (i.status === 'offered') return qid ? true : dayKey(i.offeredAt) === today;
    if (i.status === 'snoozed') return i.snoozeUntil <= now;
    return false;
  }).filter((i) => !i.questionId || qById(i.questionId));
  list.sort((a, b) => (a.status === 'accepted' ? -1 : 0) - (b.status === 'accepted' ? -1 : 0) || b.offeredAt - a.offeredAt);
  return qid ? list : list.slice(0, 2);
}
function pickTemplate(q) {
  const weekAgo = Date.now() - 7 * 864e5;
  const recent = new Set(state.invitations.filter((i) => i.questionId === q.id && i.offeredAt > weekAgo).map((i) => i.templateId));
  let pool = INVITATIONS.filter((x) => x.stages.includes(q.stage) && !recent.has(x.id));
  if (!pool.length) pool = INVITATIONS.filter((x) => x.stages.includes(q.stage));
  // balance categories: prefer a category not offered recently for this question
  const recentCats = state.invitations.filter((i) => i.questionId === q.id).slice(-2).map((i) => i.category);
  const fresh = pool.filter((x) => !recentCats.includes(x.category));
  if (fresh.length) pool = fresh;
  return pool[Math.floor(Math.random() * pool.length)];
}
function invitationFromTemplate(q, tpl) {
  return { id: uid(), questionId: q.id, templateId: tpl.id, category: tpl.category, text: { ja: tpl.ja, en: tpl.en }, tip: tpl.tip, status: 'offered', offeredAt: Date.now() };
}
async function ensureDailyInvitations() {
  const today = dayKey(Date.now());
  const meta = await db.get('meta', 'invDate');
  if (meta && meta.value === today) return;
  if (visibleInvitations().length >= 1) { await db.put('meta', { id: 'invDate', value: today }); return; }
  const qs = activeQs().slice(0, 2);
  for (const q of qs) { const tpl = pickTemplate(q); if (tpl) await put('invitations', invitationFromTemplate(q, tpl)); }
  await db.put('meta', { id: 'invDate', value: today });
}
function invitationCard(i, { showQuestion = true } = {}) {
  const q = qById(i.questionId);
  const tip = i.tip ? TIPS.find((x) => x.id === i.tip) : null;
  const actions = i.status === 'accepted'
    ? `<p class="muted small">${t('acceptedNote')}</p><div class="row"><button class="btn primary" data-action="inv-log" data-id="${i.id}">${t('logIt')}</button><button class="btn ghost" data-action="inv-skip" data-id="${i.id}">${t('skip')}</button></div>`
    : `<div class="row"><button class="btn primary" data-action="inv-accept" data-id="${i.id}">${t('accept')}</button><button class="btn ghost" data-action="inv-snooze" data-id="${i.id}">${t('snooze')}</button><button class="btn ghost" data-action="inv-skip" data-id="${i.id}">${t('skip')}</button></div>`;
  return `<article class="card invitation cat-${i.category}">
    <div class="inv-head"><span class="inv-icon">${catIcon(i.category)}</span><span class="small muted">${t('cat_' + i.category)}</span></div>
    <p class="inv-text">${esc(L(i.text))}</p>
    ${showQuestion && q ? `<p class="small muted inv-q" data-action="open-q" data-id="${q.id}">— ${esc(q.text)}</p>` : ''}
    ${tip ? `<button class="link small" data-action="open-tip" data-id="${tip.id}">💡 ${esc(L(tip).title)}</button>` : ''}
    ${actions}
  </article>`;
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------
function route() { const h = location.hash.replace(/^#\/?/, ''); const [name, id] = h.split('/'); return { name: name || 'home', id }; }
function go(path) { location.hash = '#/' + path; }

function render() {
  audioURLs.forEach((u) => URL.revokeObjectURL(u)); audioURLs = [];
  const r = route();
  const views = { home: viewHome, q: () => viewQuestion(r.id), unsorted: viewUnsorted, review: viewReview, tips: viewTips, papers: () => viewPapers(r.id), library: viewLibrary, about: viewAbout, settings: viewSettings };
  const fn = views[r.name] || viewHome;
  $('#main').innerHTML = fn();
  const navName = { q: 'home', unsorted: 'home', about: 'tips', papers: 'tips', library: 'tips' }[r.name] || r.name;
  document.querySelectorAll('.tabbar a').forEach((a) => {
    a.classList.toggle('on', a.dataset.route === navName);
    $('.lbl', a).textContent = t(a.dataset.label);
  });
  const fab = r.name === 'home' || r.name === 'q' || r.name === 'unsorted';
  $('#capturebar').classList.toggle('hidden', !fab);
  $('#capturebar').innerHTML = fab ? `<button class="cap rec" data-action="record"><span>🎙</span>${t('record')}</button><button class="cap write" data-action="write"><span>✎</span>${t('type')}</button>` : '';
}

function viewHome() {
  const h = new Date().getHours();
  const greet = h < 11 ? t('greetMorning') : h < 18 ? t('greetDay') : t('greetEvening');
  const invs = visibleInvitations();
  const qs = activeQs();
  const unsorted = state.fragments.filter((f) => !(f.questionIds || []).length);
  const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  return `
  <header class="page-head"><p class="eyebrow">${esc(t('appName'))}</p><h1>${esc(greet)}</h1><p class="lead">${esc(t('homeLead'))}</p></header>
  ${!standalone && !S.hideInstall ? `<div class="notice"><span>📲 ${esc(t('installHint'))}</span><button class="x" data-action="hide-install" aria-label="${t('close')}">×</button></div>` : ''}
  <section><h2 class="sec">${t('invitationsTitle')}</h2>
    ${invs.length ? invs.map((i) => invitationCard(i)).join('') : `<p class="muted empty">${t('invitationsEmpty')}</p>`}
  </section>
  <section><div class="sec-row"><h2 class="sec">${t('activeQuestions')}</h2><button class="btn small" data-action="new-q">＋ ${t('newQuestion')}</button></div>
    ${qs.length ? qs.map(questionCard).join('') : `<p class="muted empty">${t('noQuestions')}</p>`}
    ${unsorted.length ? `<button class="card link-card" data-action="go" data-to="unsorted">🍃 ${t('unsortedCount', { n: unsorted.length })}</button>` : ''}
    ${state.questions.some((q) => q.status !== 'active') ? `<details class="others"><summary>${t('status_resting')} / ${t('status_archived')}</summary>${state.questions.filter((q) => q.status !== 'active').map(questionCard).join('')}</details>` : ''}
  </section>
  ${weeklyColumnCard()}`;
}
function questionCard(q) {
  const n = fragsOf(q.id).length; const vs = versionsOf(q.id).length;
  return `<button class="card qcard" data-action="open-q" data-id="${q.id}">
    <div class="row between"><span class="chip stage-${q.stage} on small">${t('stage_' + q.stage)}</span><span class="small muted">${t('fragmentsCount', { n })} · v${vs}</span></div>
    <p class="qtext" lang="${q.lang}">${esc(q.text)}</p>
    ${(q.tags || []).length ? `<p class="tags">${q.tags.map((x) => `<span>#${esc(x)}</span>`).join(' ')}</p>` : ''}
  </button>`;
}

function fragmentCard(f, { showLinks = false } = {}) {
  let audio = '';
  if (f.audio instanceof Blob) { const u = URL.createObjectURL(f.audio); audioURLs.push(u); audio = `<audio controls preload="none" src="${u}"></audio>`; }
  const other = f.lang === 'ja' ? 'en' : 'ja';
  const tr = f.translations && f.translations[other] ? `<details class="tr"><summary>${t('translation')}</summary><p>${esc(f.translations[other])}</p></details>` : '';
  const links = showLinks ? `<p class="small">${(f.questionIds || []).map((id) => qById(id)).filter(Boolean).map((q) => `<span class="mini">${esc(q.text.slice(0, 30))}</span>`).join(' ') || `<span class="mini">${t('noneUnsorted')}</span>`}</p>` : '';
  return `<article class="frag" id="frag-${f.id}">
    <div class="frag-head"><span>${f.type === 'experience' ? kindIcon(f.kind) + ' ' + t('kind_' + f.kind) : f.type === 'voice' ? '🎙' : '✎'}</span><span class="small muted">${fmtDate(f.createdAt)}</span><button class="link small" data-action="edit-frag" data-id="${f.id}">${t('edit')}</button></div>
    ${f.transcript ? `<p class="frag-text" lang="${f.lang}">${esc(f.transcript)}</p>` : `<p class="muted small">${t('audioOnly')}</p>`}
    ${f.note ? `<p class="small muted">📍 ${esc(f.note)}</p>` : ''}
    ${audio}${tr}${links}
  </article>`;
}

function viewQuestion(id) {
  const q = qById(id);
  if (!q) return `<p class="muted">—</p><button class="btn" data-action="go" data-to="home">${t('back')}</button>`;
  const vs = versionsOf(q.id); const fs = fragsOf(q.id).slice().reverse();
  const invs = visibleInvitations(q.id);
  const ins = state.insights.filter((x) => x.questionId === q.id).sort((a, b) => b.createdAt - a.createdAt);
  const other = q.lang === 'ja' ? 'en' : 'ja';
  return `
  <header class="page-head"><button class="link" data-action="go" data-to="home">‹ ${t('back')}</button></header>
  <section class="qhero">
    <div class="stages">${STAGES.map((s) => stageChip(s, q.stage === s, `data-action="set-stage" data-id="${q.id}"`)).join('')}</div>
    <p class="small muted">${t('stageHint_' + q.stage)}</p>
    <h1 class="qtitle" lang="${q.lang}">${esc(q.text)}</h1>
    ${q.translations && q.translations[other] ? `<p class="muted small">${t('translation')}: ${esc(q.translations[other])}</p>` : ''}
    ${(q.tags || []).length ? `<p class="tags">${q.tags.map((x) => `<span>#${esc(x)}</span>`).join(' ')}</p>` : ''}
    <div class="row wrap"><button class="btn primary" data-action="rewrite" data-id="${q.id}">✎ ${t('newVersion')}</button><button class="btn ghost" data-action="edit-q" data-id="${q.id}">${t('edit')}</button><button class="btn ghost" data-action="translate-q" data-id="${q.id}">${t('translate')}</button></div>
  </section>
  <section class="coachbar"><h2 class="sec">${t('aiTools')}</h2>
    <div class="row wrap"><button class="btn coach" data-action="polish" data-id="${q.id}">✨ ${t('polish')}</button><button class="btn" data-action="summarize" data-id="${q.id}">${t('summarize')}</button><button class="btn" data-action="connections" data-id="${q.id}">${t('connections')}</button><button class="btn" data-action="find-papers" data-id="${q.id}">📚 ${t('findPapers')}</button></div>
    ${libraryFor(q.id).length ? `<p class="small muted">${t('usesLibrary', { n: Math.min(15, libraryFor(q.id).length) })}</p>` : ''}
  </section>
  ${state.library.some((p) => (p.questionIds || []).includes(q.id)) ? `<section><h2 class="sec">${t('learnLibrary')}</h2>${state.library.filter((p) => (p.questionIds || []).includes(q.id)).map((p) => `<button class="card small-card paper-mini" data-action="go" data-to="library"><span class="qtext">${esc(p.title)}</span><span class="small muted"> — ${esc((p.authors || '').split(',')[0])} ${p.year || ''}</span></button>`).join('')}</section>` : ''}
  <section><div class="sec-row"><h2 class="sec">${t('invitationsForQ')}</h2><button class="btn small" data-action="new-inv" data-id="${q.id}">＋ ${t('newInvitation')}</button></div>
    ${invs.map((i) => invitationCard(i, { showQuestion: false })).join('')}
  </section>
  <section><h2 class="sec">${t('versions')}</h2>
    <ol class="versions">${vs.map((v, i) => `<li><span class="vnum">v${i + 1}</span><div><p lang="${v.lang}">${esc(v.text)}</p>${v.why ? `<p class="small muted">↳ ${esc(v.why)}</p>` : ''}<p class="small muted">${fmtDate(v.createdAt, false)}${v.stage ? ' · ' + t('stage_' + v.stage) : ''}</p></div></li>`).join('')}</ol>
  </section>
  ${ins.length ? `<section><h2 class="sec">${t('insights')}</h2>${ins.map(insightCard).join('')}</section>` : ''}
  <section><h2 class="sec">${t('fragments')}</h2>
    ${fs.length ? fs.map((f) => fragmentCard(f)).join('') : `<p class="muted empty">${t('noFragments')}</p>`}
  </section>
  <section class="row wrap footer-actions"><button class="btn ghost" data-action="export-md" data-id="${q.id}">⇪ ${t('exportMd')}</button><button class="btn ghost danger-text" data-action="delete-q" data-id="${q.id}">${t('delete')}</button></section>`;
}

function insightCard(x) {
  const label = { summary: t('summarize'), connections: t('connections'), polish: t('polish') }[x.type] || '';
  let body;
  if (x.type === 'polish' && x.parsed) {
    const p = x.parsed;
    body = `<p><strong>${t('coachReflection')}:</strong> ${richText(p.reflection, x.fmap, x.lmap)}</p><p><strong>${t('coachAssumption')}:</strong> ${esc(p.assumption)}</p>${(p.alternatives || []).map((a) => `<p class="alt">→ ${esc(a.text)}</p>`).join('')}`;
  } else body = richText(x.text, x.fmap, x.lmap);
  return `<details class="card insight"><summary><span>${label}</span><span class="small muted">${fmtDate(x.createdAt)}</span></summary><div class="insight-body">${body}</div><button class="link small danger-text" data-action="delete-insight" data-id="${x.id}">${t('delete')}</button></details>`;
}

function viewUnsorted() {
  const fs = state.fragments.filter((f) => !(f.questionIds || []).length).sort((a, b) => b.createdAt - a.createdAt);
  return `<header class="page-head"><button class="link" data-action="go" data-to="home">‹ ${t('back')}</button><h1>${t('unsorted')}</h1></header>
  ${fs.length ? fs.map((f) => fragmentCard(f, { showLinks: true })).join('') : `<p class="muted empty">—</p>`}`;
}

function viewReview() {
  const since = Date.now() - 7 * 864e5;
  const recent = state.fragments.filter((f) => f.createdAt > since);
  const byQ = {};
  for (const f of recent) for (const id of f.questionIds || []) byQ[id] = (byQ[id] || 0) + 1;
  const qs = Object.keys(byQ).map(qById).filter(Boolean);
  const tried = state.invitations.filter((i) => i.status === 'done' && i.doneAt > since);
  const vers = state.versions.filter((v) => v.createdAt > since && versionsOf(v.questionId)[0]?.id !== v.id);
  return `<header class="page-head"><p class="eyebrow">${fmtDate(since, false)} – ${fmtDate(Date.now(), false)}</p><h1>${t('reviewTitle')}</h1><p class="lead">${t('reviewLead')}</p></header>
  <div class="stats"><div><b>${recent.length}</b><span>${t('fragments')}</span></div><div><b>${tried.length}</b><span>${t('reviewInvitations')}</span></div><div><b>${vers.length}</b><span>${t('versions')}</span></div></div>
  ${!recent.length && !tried.length ? `<p class="muted empty">${t('reviewNothing')}</p>` : ''}
  ${qs.length ? `<section><h2 class="sec">${t('reviewQuestions')}</h2><p class="small muted">${t('reviewPolishPrompt')}</p>${qs.map((q) => `<div class="card"><p class="qtext" lang="${q.lang}">${esc(q.text)}</p><p class="small muted">+${byQ[q.id]} · ${t('stage_' + q.stage)}</p><div class="row"><button class="btn coach small" data-action="polish" data-id="${q.id}">✨ ${t('polish')}</button><button class="btn small ghost" data-action="open-q" data-id="${q.id}">${t('fragments')}</button></div></div>`).join('')}</section>` : ''}
  ${tried.length ? `<section><h2 class="sec">${t('reviewInvitations')}</h2>${tried.map((i) => `<div class="card small-card"><span>${catIcon(i.category)}</span> ${esc(L(i.text))}<p class="small muted">${fmtDate(i.doneAt)}${qById(i.questionId) ? ' — ' + esc(qById(i.questionId).text.slice(0, 40)) : ''}</p></div>`).join('')}</section>` : ''}`;
}

function tipCard(tp, open = false) {
  const x = L(tp);
  return `<details class="card tip cat-${tp.category}" id="tip-${tp.id}" ${open ? 'open' : ''}>
    <summary><span class="inv-icon">${catIcon(tp.category)}</span><span class="tip-title">${esc(x.title)}</span>${evBadge(tp.evidence)}</summary>
    <div class="tip-body">
      <h4>${t('keyIdea')}</h4><p>${esc(x.idea)}</p>
      <h4>${t('tryToday')}</h4><p class="try">${esc(x.tryToday)}</p>
      <h4>${t('caveat')}</h4><p class="small muted">${esc(x.caveat)}</p>
      <h4>${t('sources')}</h4>${tp.refs.map((r) => `<p class="ref small"><a href="${REFS[r].url}" target="_blank" rel="noopener">${esc(REFS[r].cite)}</a>${REFS[r].peer ? ` <span class="badge peer">${t('peerReviewed')}</span>` : ''}</p>`).join('')}
      <button class="btn small" data-action="tip-try" data-id="${tp.id}">${t('tryWithQuestion')}</button>
    </div></details>`;
}
function viewTips() {
  const list = TIPS.filter((x) => tipFilter === 'all' || x.category === tipFilter);
  return `${learnTabs('tips')}<header class="page-head"><h1>${t('tipsTitle')}</h1><p class="lead">${t('tipsLead')}</p></header>
  <div class="filters">${['all', ...TIP_CATEGORIES].map((c) => `<button class="chip ${tipFilter === c ? 'on' : ''}" data-action="tip-filter" data-cat="${c}">${c === 'all' ? '' : catIcon(c) + ' '}${t('cat_' + c)}</button>`).join('')}</div>
  ${list.map((x) => tipCard(x)).join('')}
  <button class="card link-card" data-action="go" data-to="about">📚 ${t('aboutMethod')}</button>`;
}
function viewAbout() {
  const used = new Set(); PRINCIPLES.forEach((p) => p.refs.forEach((r) => used.add(r))); TIPS.forEach((x) => x.refs.forEach((r) => used.add(r)));
  const refs = [...used].map((k) => REFS[k]).sort((a, b) => a.cite.localeCompare(b.cite));
  return `<header class="page-head"><button class="link" data-action="go" data-to="tips">‹ ${t('back')}</button><h1>${t('aboutMethod')}</h1><p class="lead">${t('aboutLead')}</p></header>
  ${PRINCIPLES.map((p, i) => `<div class="card principle"><div class="row between"><b>${i + 1}. ${esc(L(p).title)}</b>${evBadge(p.evidence)}</div><p>${esc(L(p).body)}</p><p class="small muted">${p.refs.map((r) => esc(REFS[r].cite.split('.')[0])).join(' · ')}</p></div>`).join('')}
  <h2 class="sec">${t('references')}</h2>
  <ul class="reflist">${refs.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener">${esc(r.cite)}</a>${r.peer ? ` <span class="badge peer">${t('peerReviewed')}</span>` : ''}</li>`).join('')}</ul>`;
}

function seg(name, value, opts) {
  return `<div class="seg" role="radiogroup">${opts.map(([v, label]) => `<button class="${value === v ? 'on' : ''}" data-action="set" data-key="${name}" data-val="${v}">${esc(label)}</button>`).join('')}</div>`;
}
function viewSettings() {
  return `<header class="page-head"><h1>${t('settingsTitle')}</h1></header>
  <div class="card form">
    <label>${t('uiLang')}</label>${seg('uiLang', S.uiLang, [['ja', '日本語'], ['en', 'English']])}
    <label>${t('defaultRecLang')}</label>${seg('recLang', S.recLang, [['ja', '日本語'], ['en', 'English']])}
    <label>${t('coachLang')}</label>${seg('coachLang', S.coachLang, [['same', t('coachSame')], ['ja', '日本語'], ['en', 'English'], ['match', t('coachMatch')]])}
    <label>${t('theme')}</label>${seg('theme', S.theme, [['auto', t('themeAuto')], ['light', t('themeLight')], ['dark', t('themeDark')]])}
    <label class="check"><input type="checkbox" data-setting="liveTranscribe" ${S.liveTranscribe ? 'checked' : ''}> ${t('liveSetting')}</label>
    ${SpeechRec ? '' : `<p class="small muted">${t('liveUnavailable')}</p>`}
  </div>
  <div class="card form">
    <label for="apikey">${t('apiKey')}</label><input id="apikey" type="password" autocomplete="off" data-setting="apiKey" value="${esc(S.apiKey)}" placeholder="sk-ant-...">
    <p class="small muted">${t('apiKeyHint')}</p>
    <label for="model">${t('model')}</label><input id="model" data-setting="model" value="${esc(S.model)}">
    <label for="uname">${t('userName')}</label><input id="uname" data-setting="userName" value="${esc(S.userName)}" placeholder="${esc(t('userNamePlaceholder'))}">
    <label class="check"><input type="checkbox" data-setting="anonymize" ${S.anonymize ? 'checked' : ''}> ${t('anonymize')}</label>
    <label for="anon">${t('anonNames')}</label><input id="anon" data-setting="anonNames" value="${esc(S.anonNames)}" placeholder="田中, Sarah">
    <p class="small muted">${t('anonHint')}</p>
    <label for="oakey">${t('oaKey')}</label><input id="oakey" type="password" autocomplete="off" data-setting="oaKey" value="${esc(S.oaKey)}">
    <p class="small muted">${t('oaKeyHint')}</p>
  </div>
  <div class="card form">
    <label>${t('data')}</label>
    <button class="btn" data-action="export-json">⇪ ${t('exportJson')}</button>
    <label class="btn file-btn">⇩ ${t('importJson')}<input type="file" accept="application/json,.json" data-action-change="import-json" hidden></label>
    <p class="small muted">${t('importMode')}</p>
    <p class="small" id="storage-status">${t('storageStatus')}: …</p>
    <p class="small muted">${t('backupReminder')}</p>
  </div>
  <button class="card link-card" data-action="go" data-to="about">📚 ${t('aboutMethod')}</button>
  <p class="small muted center">${t('appName')} · ${t('version')} ${APP_VERSION}</p>`;
}

// ---------------------------------------------------------------------------
// Learn: paper columns, live search (OpenAlex), bookshelf
// ---------------------------------------------------------------------------
const OA = 'https://api.openalex.org';
const paperSearch = { q: '', minCites: 100, period: 'all', sort: 'relevance', results: null, loading: false, error: null, forQ: null };
const resultsById = {};
let citeCache = { ts: 0, map: {} };
let libFilter = 'all';

function learnTabs(active) {
  const tabs = [['tips', 'learnTips'], ['papers', 'learnPapers'], ['library', 'learnLibrary']];
  return `<nav class="subtabs">${tabs.map(([r, k]) => `<a href="#/${r}" class="${active === r ? 'on' : ''}">${t(k)}${r === 'library' && state.library.length ? ` <span class="count">${state.library.length}</span>` : ''}</a>`).join('')}</nav>`;
}
const paperKey = (doi, fallback) => (doi ? 'doi:' + doi.toLowerCase() : fallback);
const isFav = (id) => state.library.some((p) => p.id === id);
function libraryFor(qid) {
  const linked = state.library.filter((p) => (p.questionIds || []).includes(qid));
  const rest = state.library.filter((p) => !(p.questionIds || []).includes(qid)).sort((a, b) => b.savedAt - a.savedAt);
  return [...linked, ...rest].slice(0, 15);
}
function weekIndex() { const d = new Date(); const start = new Date(d.getFullYear(), 0, 1); return Math.floor((d - start) / (7 * 864e5)); }
function weeklyPaper() { return PAPERS[weekIndex() % PAPERS.length]; }
function weeklyColumnCard() {
  const p = weeklyPaper(); const x = L(p);
  return `<section><h2 class="sec">${t('homeColumn')}</h2><button class="card column-teaser" data-action="go" data-to="papers/${p.id}">
    <span class="small muted">${t('type_' + p.type)} · ${esc(p.venue.split(',')[0])} · ${p.year}</span>
    <span class="teaser-head">${esc(x.headline)}</span>
    <span class="small muted">${esc(p.authors.split(',')[0])}${p.authors.includes(',') ? ' et al.' : ''}</span></button></section>`;
}
function citesOf(doi) { const n = citeCache.map[(doi || '').toLowerCase()]; return typeof n === 'number' ? n : null; }
async function loadCitations() {
  const m = await db.get('meta', 'citeCache'); if (m) citeCache = m.value;
  if (Date.now() - citeCache.ts < 7 * 864e5 && Object.keys(citeCache.map).length) return;
  try {
    const dois = PAPERS.map((p) => p.doi).join('|');
    const r = await fetch(`${OA}/works?filter=doi:${dois}&select=doi,cited_by_count&per_page=50${S.oaKey ? '&api_key=' + encodeURIComponent(S.oaKey) : ''}`);
    if (!r.ok) return;
    const d = await r.json(); const map = {};
    for (const w of d.results || []) if (w.doi) map[w.doi.replace('https://doi.org/', '').toLowerCase()] = w.cited_by_count;
    citeCache = { ts: Date.now(), map }; await db.put('meta', { id: 'citeCache', value: citeCache });
    if (['papers', 'library', 'home'].includes(route().name) && $('#sheet').classList.contains('hidden')) render();
  } catch (e) { /* offline: show without counts */ }
}
function invertAbstract(inv) {
  if (!inv) return ''; const arr = [];
  for (const [w, pos] of Object.entries(inv)) for (const i of pos) arr[i] = w;
  return arr.filter(Boolean).join(' ');
}
function fromOA(w) {
  const doi = w.doi ? w.doi.replace('https://doi.org/', '') : '';
  const au = (w.authorships || []).map((a) => a.author && a.author.display_name).filter(Boolean);
  const loc = w.primary_location || {};
  return {
    id: paperKey(doi, w.id), source: 'openalex', doi, title: w.display_name || '', authors: au.slice(0, 6).join(', ') + (au.length > 6 ? ', et al.' : ''),
    year: w.publication_year, venue: loc.source ? loc.source.display_name : '', citedBy: w.cited_by_count,
    abstract: invertAbstract(w.abstract_inverted_index), url: doi ? 'https://doi.org/' + doi : (loc.landing_page_url || w.id), type: w.type,
  };
}
async function runPaperSearch() {
  const q = paperSearch.q.trim(); if (!q) return;
  paperSearch.loading = true; paperSearch.error = null; paperSearch.results = null; render();
  try {
    const f = [`cited_by_count:>${Math.max(0, paperSearch.minCites - 1)}`, 'type:article|review'];
    if (paperSearch.period === 'recent') f.push(`from_publication_date:${new Date().getFullYear() - 10}-01-01`);
    const sel = 'id,doi,display_name,publication_year,cited_by_count,authorships,primary_location,abstract_inverted_index,type';
    const url = `${OA}/works?search=${encodeURIComponent(q)}&filter=${f.join(',')}&per_page=15&select=${sel}${paperSearch.sort === 'cites' ? '&sort=cited_by_count:desc' : ''}${S.oaKey ? '&api_key=' + encodeURIComponent(S.oaKey) : ''}`;
    const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    paperSearch.results = (d.results || []).map(fromOA);
    paperSearch.results.forEach((x) => { resultsById[x.id] = x; });
  } catch (e) { paperSearch.error = e.message; }
  paperSearch.loading = false; render();
}
function favButton(id) {
  const on = isFav(id);
  return `<button class="btn small ${on ? 'faved' : ''}" data-action="paper-fav" data-id="${esc(id)}">${on ? '★ ' + t('unfav') : '☆ ' + t('fav')}</button>`;
}
function curatedCard(p, open = false) {
  const x = L(p); const id = paperKey(p.doi, p.id); const c = citesOf(p.doi);
  return `<details class="card column" id="col-${p.id}" ${open ? 'open' : ''}>
    <summary><span class="small muted meta">${t('type_' + p.type)} · ${esc(p.venue.split(',')[0])} · ${p.year}${c !== null ? ' · ' + t('citations', { n: c.toLocaleString() }) : ''}</span>
    <span class="col-head">${esc(x.headline)}</span></summary>
    <div class="col-body">
      <p class="paper-title" lang="en">${esc(p.title)}</p><p class="small muted">${esc(p.authors)} — <i>${esc(p.venue)}</i></p>
      <h4>${t('whatStudy')}</h4><p>${esc(x.what)}</p>
      <h4>${t('whyMatters')}</h4><p>${esc(x.why)}</p>
      <h4>${t('implication')}</h4><p class="try">${esc(x.implication)}</p>
      <h4>${t('promptForYou')}</h4><p class="prompt">“${esc(x.prompt)}”</p>
      <div class="row wrap">${favButton(id)}<a class="btn small ghost" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">↗ ${t('openPaper')}</a></div>
    </div></details>`;
}
function resultCard(x) {
  return `<article class="card result">
    <p class="small muted meta">${esc(x.venue || '—')} · ${x.year || ''} · ${t('citations', { n: (x.citedBy || 0).toLocaleString() })}</p>
    <p class="paper-title" lang="en">${esc(x.title)}</p>
    <p class="small muted">${esc(x.authors)}</p>
    <details><summary class="small">${t('abstract')}</summary><p class="small" lang="en">${x.abstract ? esc(x.abstract) : t('noAbstract')}</p></details>
    <div class="row wrap">${favButton(x.id)}<button class="btn small" data-action="paper-column" data-id="${esc(x.id)}">✍️ ${t('makeColumn')}</button><a class="btn small ghost" href="${esc(x.url)}" target="_blank" rel="noopener">↗</a></div>
  </article>`;
}
function viewPapers(openId) {
  const ps = paperSearch; const forQ = ps.forQ ? qById(ps.forQ) : null;
  const weekly = weeklyPaper();
  let results = '';
  if (ps.loading) results = `<div class="thinking"><span class="spinner"></span><p>${t('searching')}</p></div>`;
  else if (ps.error) results = `<p class="error">${t('searchError')}</p><a class="link" href="https://scholar.google.com/scholar?q=${encodeURIComponent(ps.q)}" target="_blank" rel="noopener">${t('scholarLink')} ↗</a>`;
  else if (ps.results) results = ps.results.length ? ps.results.map(resultCard).join('') + `<p class="small muted">${t('citationsNote')} · <a href="https://openalex.org" target="_blank" rel="noopener">OpenAlex</a></p>` : `<p class="muted">${t('noResults')}</p><a class="link" href="https://scholar.google.com/scholar?q=${encodeURIComponent(ps.q)}" target="_blank" rel="noopener">${t('scholarLink')} ↗</a>`;
  const showJaHint = /[぀-ヿ㐀-鿿]/.test(ps.q);
  return `${learnTabs('papers')}<header class="page-head"><h1>${t('learnPapers')}</h1><p class="lead">${t('papersLead')}</p></header>
  <section><h2 class="sec">${t('weeklyColumn')}</h2>${curatedCard(weekly, !openId || openId === weekly.id)}</section>
  <section><h2 class="sec">${t('searchTitle')}</h2>
    <div class="card form search">
      ${forQ ? `<p class="small muted">🌱 ${esc(forQ.text)}</p>` : ''}
      <div class="searchrow"><input id="pq" type="search" enterkeyhint="search" value="${esc(ps.q)}" placeholder="${esc(t('searchPlaceholder'))}"><button class="btn primary" data-action="paper-search">${t('search')}</button></div>
      ${showJaHint ? `<p class="small muted">${t('jaHint')} <button class="link small" data-action="paper-keywords">✨ ${t('aiKeywords')}</button></p>` : ''}
      <div class="filters-grid">
        <label>${t('minCites')}</label>${seg('p-minCites', String(ps.minCites), [['20', '20+'], ['100', '100+'], ['500', '500+'], ['1000', '1000+']])}
        <label>${t('period')}</label>${seg('p-period', ps.period, [['all', t('periodAll')], ['recent', t('periodRecent')]])}
        <label>${t('sortBy')}</label>${seg('p-sort', ps.sort, [['relevance', t('sortRelevance')], ['cites', t('sortCites')]])}
      </div>
    </div>
    ${results}
  </section>
  <section><h2 class="sec">${t('curatedTitle')}</h2>${PAPERS.filter((p) => p.id !== weekly.id).map((p) => curatedCard(p, openId === p.id)).join('')}
  <p class="small muted">${t('citationsNote')}</p></section>`;
}
function viewLibrary() {
  const qs = state.questions.filter((q) => state.library.some((p) => (p.questionIds || []).includes(q.id)));
  let list = state.library.slice().sort((a, b) => b.savedAt - a.savedAt);
  if (libFilter !== 'all') list = list.filter((p) => (p.questionIds || []).includes(libFilter));
  return `${learnTabs('library')}<header class="page-head"><h1>${t('libraryTitle')}</h1><p class="lead">${t('libraryLead')}</p></header>
  ${qs.length ? `<div class="filters"><button class="chip ${libFilter === 'all' ? 'on' : ''}" data-action="lib-filter" data-id="all">${t('filterAll')}</button>${qs.map((q) => `<button class="chip ${libFilter === q.id ? 'on' : ''}" data-action="lib-filter" data-id="${q.id}">${esc(q.text.slice(0, 18))}…</button>`).join('')}</div>` : ''}
  ${list.length ? `<p class="small muted">${t('libraryCount', { n: list.length })}</p>` + list.map(libraryCard).join('') : `<p class="muted empty">${t('libraryEmpty')}</p><button class="btn" data-action="go" data-to="papers">📚 ${t('learnPapers')}</button>`}
  ${state.library.length ? `<div class="row wrap footer-actions"><button class="btn ghost" data-action="export-library">⇪ ${t('exportLibrary')}</button></div>` : ''}`;
}
function libraryCard(p) {
  const c = p.doi ? (citesOf(p.doi) ?? p.citedBy) : p.citedBy;
  const qs = activeQs();
  return `<article class="card libcard">
    <p class="small muted meta">${esc((p.venue || '').split(',')[0] || '—')} · ${p.year || ''}${c != null ? ' · ' + t('citations', { n: Number(c).toLocaleString() }) : ''}</p>
    <p class="paper-title" lang="en">${esc(p.title)}</p>
    <p class="small muted">${esc(p.authors || '')}</p>
    ${p.headline ? `<p class="col-head small-head">${esc(L(p.headline))}</p>` : ''}
    ${p.column ? `<details><summary class="small">${t('columnTitle')}</summary><div class="insight-body small">${richText(p.column)}</div></details>` : ''}
    <label class="small">${t('myNote')}</label><textarea rows="2" data-lib-note="${esc(p.id)}">${esc(p.note || '')}</textarea>
    ${qs.length ? `<p class="small muted lq">${t('linkedQuestions')}</p><div class="qpick">${qs.map((q) => `<button class="chip small ${(p.questionIds || []).includes(q.id) ? 'on' : ''}" data-action="lib-q" data-id="${esc(p.id)}" data-q="${q.id}">${esc(q.text.length > 24 ? q.text.slice(0, 24) + '…' : q.text)}</button>`).join('')}</div>` : ''}
    <div class="row wrap">${favButton(p.id)}${!p.column && p.source === 'openalex' ? `<button class="btn small" data-action="paper-column" data-id="${esc(p.id)}">✍️ ${t('makeColumn')}</button>` : ''}<a class="btn small ghost" href="${esc(p.url)}" target="_blank" rel="noopener">↗ ${t('openPaper')}</a></div>
  </article>`;
}
function paperItem(id) {
  const lib = state.library.find((p) => p.id === id); if (lib) return lib;
  if (resultsById[id]) return resultsById[id];
  const cur = PAPERS.find((p) => paperKey(p.doi, p.id) === id);
  if (cur) return { id, source: 'curated', curatedId: cur.id, doi: cur.doi, title: cur.title, authors: cur.authors, year: cur.year, venue: cur.venue, citedBy: citesOf(cur.doi), url: 'https://doi.org/' + cur.doi, headline: { ja: cur.ja.headline, en: cur.en.headline }, summary: cur.en.what + ' Implication: ' + cur.en.implication, abstract: '' };
  return null;
}
async function toggleFav(id) {
  if (isFav(id)) { await remove('library', id); toast(t('unfaved')); }
  else {
    const it = paperItem(id); if (!it) return;
    const rec = { ...it, note: it.note || '', questionIds: paperSearch.forQ && qById(paperSearch.forQ) ? [paperSearch.forQ] : [], savedAt: Date.now() };
    if (!rec.summary) rec.summary = (rec.column || rec.abstract || '').slice(0, 500);
    await put('library', rec); toast(t('faved'));
  }
  const open = [...document.querySelectorAll('details[open]')].map((d) => d.id).filter(Boolean);
  const y = window.scrollY;
  if ($('#sheet').classList.contains('hidden')) { render(); open.forEach((i) => { const d = document.getElementById(i); if (d) d.open = true; }); window.scrollTo(0, y); }
  else { const b = $('.sheet-body [data-action="paper-fav"]'); if (b) b.outerHTML = favButton(id); }
}
function aiPaperColumn(id) {
  if (!requireKey()) return;
  const it = paperItem(id); if (!it) return;
  const q = paperSearch.forQ ? qById(paperSearch.forQ) : (it.questionIds && it.questionIds[0] ? qById(it.questionIds[0]) : null);
  const anon = makeAnon(); const lang = outLang([]);
  const content = PROMPTS.column(it, q ? anon(q.text) : '');
  previewAndSend({ title: t('makeColumn'), content, system: coachSystem(lang), maxTokens: 1500, full: true, onResult: async (text) => {
    it.column = text; it.summary = text.slice(0, 500);
    if (isFav(id)) await put('library', it);
    openSheet(`<h2>✍️ ${t('columnTitle')}</h2><p class="paper-title" lang="en">${esc(it.title)}</p><p class="small muted">${esc(it.authors)} · ${esc(it.venue || '')} ${it.year || ''}</p>
      <div class="insight-body">${richText(text)}</div><div class="row end">${favButton(id)}<button class="btn" data-action="sheet-close">${t('close')}</button></div>`, { full: true });
  } });
}
function aiKeywords() {
  if (!requireKey()) return;
  const anon = makeAnon(); const content = PROMPTS.keywords(anon(paperSearch.q));
  previewAndSend({ title: t('aiKeywords'), content, system: 'You convert research questions into concise English search keywords. Output only the keywords.', maxTokens: 100, onResult: async (text) => {
    paperSearch.q = text.replace(/["\n]/g, ' ').trim(); closeSheet(); runPaperSearch();
  } });
}
function libraryMarkdown() {
  const lines = [`# ${t('libraryTitle')}`, ''];
  state.library.slice().sort((a, b) => b.savedAt - a.savedAt).forEach((p) => {
    lines.push(`## ${p.title}`, `${p.authors || ''} (${p.year || 'n.d.'}). *${p.venue || ''}*. ${p.url || ''}`);
    const qs = (p.questionIds || []).map(qById).filter(Boolean);
    if (qs.length) lines.push(`- ${t('linkedQuestions')}: ${qs.map((q) => q.text).join(' / ')}`);
    if (p.note) lines.push(`- ${t('myNote')}: ${p.note}`);
    if (p.column) lines.push('', p.column);
    lines.push('');
  });
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Question create / edit / rewrite
// ---------------------------------------------------------------------------
function questionForm(q) {
  const isNew = !q;
  const stage = q ? q.stage : 'why';
  return `<h2>${isNew ? t('newQuestion') : t('edit')}</h2>
  <div class="form" id="qform" data-id="${q ? q.id : ''}" data-stage="${stage}">
    ${isNew ? `<label for="qtext">${t('questionText')}</label><textarea id="qtext" rows="3" placeholder="${esc(t('questionPlaceholder'))}"></textarea>` : `<p class="qtext">${esc(q.text)}</p>`}
    <label>${t('stage')}</label><div class="stages">${STAGES.map((s) => stageChip(s, s === stage, 'data-action="form-stage"')).join('')}</div>
    <label for="qtags">${t('tags')}</label><input id="qtags" value="${esc(q ? (q.tags || []).join(', ') : '')}">
    ${!isNew ? `<label>${t('status')}</label><select id="qstatus">${['active', 'resting', 'archived'].map((s) => `<option value="${s}" ${q.status === s ? 'selected' : ''}>${t('status_' + s)}</option>`).join('')}</select>` : ''}
    <div class="row end"><button class="btn ghost" data-action="sheet-close">${t('cancel')}</button><button class="btn primary" data-action="save-q">${t('save')}</button></div>
  </div>`;
}
function openQuestionForm(q) { openSheet(questionForm(q)); if (!q) $('#qtext').focus(); }
async function saveQuestionForm() {
  const f = $('#qform'); const id = f.dataset.id; const stage = f.dataset.stage;
  const tags = $('#qtags').value.split(/[,、]/).map((s) => s.trim()).filter(Boolean);
  if (!id) {
    const text = $('#qtext').value.trim(); if (!text) return;
    const now = Date.now();
    const q = { id: uid(), text, lang: detectLang(text), stage, status: 'active', tags, createdAt: now, updatedAt: now };
    await put('questions', q);
    await put('versions', { id: uid(), questionId: q.id, text, lang: q.lang, why: '', stage, createdAt: now });
    if (!visibleInvitations().length) { const tpl = pickTemplate(q); if (tpl) await put('invitations', invitationFromTemplate(q, tpl)); }
    closeSheet(); go('q/' + q.id); toast(t('saved'));
  } else {
    const q = qById(id); q.stage = stage; q.tags = tags; q.status = $('#qstatus').value; q.updatedAt = Date.now();
    await put('questions', q); closeSheet(); render(); toast(t('saved'));
  }
}
function openRewrite(qid, draft = null) {
  const q = qById(qid);
  openSheet(`<h2>${t('newVersion')}</h2><div class="form" id="rwform" data-id="${qid}" data-stage="${q.stage}">
    <p class="small muted">v${versionsOf(qid).length}: ${esc(q.text)}</p>
    <label for="rwtext">${t('writeNextVersion')}</label><textarea id="rwtext" rows="4">${esc(draft ?? q.text)}</textarea>
    <label for="rwwhy">${t('whyChanged')}</label><textarea id="rwwhy" rows="2" placeholder="${esc(t('whyChangedPlaceholder'))}"></textarea>
    <label>${t('stage')}</label><div class="stages">${STAGES.map((s) => stageChip(s, s === q.stage, 'data-action="form-stage"')).join('')}</div>
    <div class="row end"><button class="btn ghost" data-action="sheet-close">${t('cancel')}</button><button class="btn primary" data-action="save-rewrite">${t('save')}</button></div></div>`);
  const ta = $('#rwtext'); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
}
async function saveRewrite() {
  const f = $('#rwform'); const q = qById(f.dataset.id);
  const text = $('#rwtext').value.trim(); if (!text) return;
  const why = $('#rwwhy').value.trim(); const now = Date.now();
  q.text = text; q.lang = detectLang(text); q.stage = f.dataset.stage; q.updatedAt = now; q.translations = {};
  await put('questions', q);
  await put('versions', { id: uid(), questionId: q.id, text, lang: q.lang, why, stage: q.stage, createdAt: now });
  closeSheet(); render(); toast(t('versionSaved'));
}

// ---------------------------------------------------------------------------
// Capture (voice / text / experience)
// ---------------------------------------------------------------------------
let cap = null;
function tokenize(s) {
  s = (s || '').toLowerCase(); const out = new Set();
  const ja = s.replace(/[^぀-ヿ㐀-鿿]/g, '');
  for (let i = 0; i < ja.length - 1; i++) out.add(ja.slice(i, i + 2));
  (s.match(/[a-z]{4,}/g) || []).forEach((w) => out.add(w));
  return out;
}
function suggestQuestion(text) {
  const tk = tokenize(text); if (tk.size < 2) return null;
  let best = null, bestScore = 0;
  for (const q of activeQs()) {
    const ref = tokenize(q.text + ' ' + fragsOf(q.id).slice(-8).map((f) => f.transcript || '').join(' '));
    let hit = 0; tk.forEach((x) => { if (ref.has(x)) hit++; });
    const score = hit / Math.sqrt(tk.size);
    if (score > bestScore) { bestScore = score; best = q; }
  }
  return bestScore >= 0.6 ? best : null;
}
function captureHTML() {
  const qs = activeQs();
  const exp = cap.type === 'experience';
  return `<h2>${t('captureTitle')}</h2>
  <div class="form capture">
    ${exp ? `<label>${t('experienceKind')}</label><div class="row wrap">${['walk', 'observation', 'conversation', 'making'].map((k) => `<button class="chip ${cap.kind === k ? 'on' : ''}" data-action="cap-kind" data-kind="${k}">${kindIcon(k)} ${t('kind_' + k)}</button>`).join('')}</div>${cap.kind === 'conversation' ? `<p class="notice small">${t('conversationNote')}</p>` : ''}` : ''}
    ${cap.invitationText ? `<p class="small muted">${esc(cap.invitationText)}</p>` : ''}
    <div class="row between"><label>${t('recLang')}</label>${`<div class="seg">${[['ja', '日本語'], ['en', 'English']].map(([v, l]) => `<button class="${cap.lang === v ? 'on' : ''}" data-action="cap-lang" data-val="${v}">${l}</button>`).join('')}</div>`}</div>
    <textarea id="captext" rows="5" lang="${cap.lang}" placeholder="${esc(exp ? t('expReflectionPlaceholder') : t('textPlaceholder'))}">${esc(cap.text)}</textarea>
    <p class="small muted" id="interim"></p>
    <div id="voicebox">${voiceBoxHTML()}</div>
    <label>${t('linkTo')}</label>
    <div class="qpick">${qs.map((q) => `<button class="chip ${cap.qids.has(q.id) ? 'on' : ''}" data-action="cap-q" data-id="${q.id}">${cap.suggested === q.id ? `<span class="sug">${t('suggested')}</span> ` : ''}${esc(q.text.length > 34 ? q.text.slice(0, 34) + '…' : q.text)}</button>`).join('')}<button class="chip ${cap.qids.size === 0 ? 'on' : ''}" data-action="cap-q" data-id="">${t('noneUnsorted')}</button></div>
    <details><summary class="small">${t('contextNote')}</summary><input id="capnote" value="${esc(cap.note)}"></details>
    <div class="row end"><button class="btn ghost" data-action="sheet-close">${t('cancel')}</button><button class="btn primary" data-action="cap-save">${t('save')}</button></div>
  </div>`;
}
function voiceBoxHTML() {
  if (cap.recording) return `<div class="recbox on"><span class="dot"></span><span>${t('recording')} <span id="rectime">0:00</span></span><button class="btn danger" data-action="cap-stop">■ ${t('stop')}</button></div>`;
  if (cap.blob) { const u = URL.createObjectURL(cap.blob); audioURLs.push(u); return `<div class="recbox"><audio controls src="${u}"></audio><button class="link small danger-text" data-action="cap-discard">${t('discard')}</button></div>`; }
  return `<button class="btn" data-action="cap-rec">🎙 ${t('voiceMemo')}</button>`;
}
function rerenderCapture() {
  if (!cap) return; cap.text = $('#captext')?.value ?? cap.text; cap.note = $('#capnote')?.value ?? cap.note;
  $('.sheet-body').innerHTML = captureHTML();
}
function openCapture({ mode = 'write', questionId = null, invitation = null, kind = 'walk' } = {}) {
  cap = {
    type: invitation ? 'experience' : 'text', kind, lang: S.recLang, text: '', note: '',
    qids: new Set(questionId ? [questionId] : []), touched: !!questionId, suggested: null,
    invitationId: invitation ? invitation.id : null, invitationText: invitation ? L(invitation.text) : '',
    blob: null, mime: '', recording: false,
  };
  if (invitation) { cap.qids = new Set(invitation.questionId ? [invitation.questionId] : []); cap.touched = true; cap.kind = { body: 'walk', place: 'observation', people: 'conversation' }[invitation.category] || 'walk'; }
  openSheet(captureHTML(), { onClose: stopCaptureHard });
  if (mode === 'record') startRecording(); else $('#captext').focus();
}
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const types = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'];
    const mime = window.MediaRecorder ? (types.find((x) => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(x)) || '') : '';
    const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks = [];
    mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = () => {
      stream.getTracks().forEach((tr) => tr.stop());
      if (!cap || cap.discardOnStop) return;
      cap.blob = new Blob(chunks, { type: mr.mimeType || mime || 'audio/mp4' }); cap.mime = cap.blob.type;
      cap.recording = false; if (cap.type === 'text') cap.type = 'voice';
      rerenderCapture();
    };
    mr.start(1000);
    Object.assign(cap, { mr, stream, recording: true, started: Date.now() });
    rerenderCapture();
    cap.timer = setInterval(() => { const el = $('#rectime'); if (!el || !cap) return; const s = Math.floor((Date.now() - cap.started) / 1000); el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }, 500);
    if (S.liveTranscribe) startLive();
  } catch (e) {
    toast(t('micDenied')); if (cap) { cap.recording = false; rerenderCapture(); }
  }
}
function startLive() {
  if (!SpeechRec) { const el = $('#interim'); if (el) el.textContent = t('liveUnavailable'); return; }
  try {
    const r = new SpeechRec(); r.lang = cap.lang === 'en' ? 'en-US' : 'ja-JP'; r.continuous = true; r.interimResults = true;
    r.onresult = (ev) => {
      let interim = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        if (res.isFinal) { const ta = $('#captext'); if (ta) { ta.value = (ta.value ? ta.value + (cap.lang === 'ja' ? '' : ' ') : '') + res[0].transcript.trim(); cap.text = ta.value; } }
        else interim += res[0].transcript;
      }
      const el = $('#interim'); if (el) el.textContent = interim;
    };
    r.onerror = () => { cap && (cap.liveFailed = true); const el = $('#interim'); if (el) el.textContent = t('liveFailed'); };
    r.onend = () => { if (cap && cap.recording && !cap.liveFailed && (cap.liveRestarts = (cap.liveRestarts || 0) + 1) < 20) { try { r.start(); } catch (e) {} } };
    r.start(); cap.recog = r;
  } catch (e) { const el = $('#interim'); if (el) el.textContent = t('liveUnavailable'); }
}
function stopRecording() {
  if (!cap) return; clearInterval(cap.timer);
  try { cap.recog && cap.recog.stop(); } catch (e) {}
  cap.recog = null;
  if (cap.mr && cap.mr.state !== 'inactive') cap.mr.stop();
}
function stopCaptureHard() { if (!cap) return; cap.discardOnStop = true; stopRecording(); if (cap.stream) cap.stream.getTracks().forEach((x) => x.stop()); cap = null; }
async function saveCapture() {
  if (!cap) return;
  if (cap.recording) { // stop first, then save once the blob is ready
    cap.saveAfterStop = true; const c = cap;
    await new Promise((res) => { const orig = c.mr.onstop; c.mr.onstop = (e) => { orig(e); res(); }; stopRecording(); });
  }
  const text = ($('#captext')?.value ?? cap.text).trim(); const note = ($('#capnote')?.value ?? cap.note).trim();
  if (!text && !cap.blob) { closeSheet(); return; }
  const now = Date.now();
  const f = {
    id: uid(), questionIds: [...cap.qids], type: cap.type === 'experience' ? 'experience' : cap.blob ? 'voice' : 'text',
    kind: cap.type === 'experience' ? cap.kind : null, lang: text ? detectLang(text) : cap.lang,
    audio: cap.blob || null, audioMime: cap.mime || null, transcript: text, note, createdAt: now, invitationId: cap.invitationId,
  };
  await put('fragments', f);
  if (cap.invitationId) { const inv = state.invitations.find((i) => i.id === cap.invitationId); if (inv) { inv.status = 'done'; inv.doneAt = now; await put('invitations', inv); } }
  cap.discardOnStop = true; cap = null; sheetOnClose = null; closeSheet(); render(); toast(t('saved'));
}

// fragment edit
function openFragmentEdit(id) {
  const f = state.fragments.find((x) => x.id === id); if (!f) return;
  const qs = state.questions.filter((q) => q.status !== 'archived');
  const sel = new Set(f.questionIds || []);
  let audio = ''; if (f.audio instanceof Blob) { const u = URL.createObjectURL(f.audio); audioURLs.push(u); audio = `<audio controls src="${u}"></audio>`; }
  const other = f.lang === 'ja' ? 'en' : 'ja';
  openSheet(`<h2>${t('editFragment')}</h2><div class="form" id="fform" data-id="${id}">
    <p class="small muted">${fmtDate(f.createdAt)}</p>${audio}
    <label for="ftext">${t('transcript')}</label><textarea id="ftext" rows="5">${esc(f.transcript)}</textarea>
    ${f.translations && f.translations[other] ? `<p class="small muted">${t('translation')}: ${esc(f.translations[other])}</p>` : ''}
    <label for="fnote">${t('contextNote')}</label><input id="fnote" value="${esc(f.note || '')}">
    <label>${t('moveTo')}</label><div class="qpick" id="fq">${qs.map((q) => `<button class="chip ${sel.has(q.id) ? 'on' : ''}" data-action="toggle-chip" data-id="${q.id}">${esc(q.text.length > 34 ? q.text.slice(0, 34) + '…' : q.text)}</button>`).join('')}</div>
    <div class="row between wrap"><div class="row"><button class="btn ghost danger-text" data-action="delete-frag" data-id="${id}">${t('delete')}</button><button class="btn ghost" data-action="translate-frag" data-id="${id}">${t('translate')}</button></div><div class="row"><button class="btn ghost" data-action="sheet-close">${t('cancel')}</button><button class="btn primary" data-action="save-frag">${t('save')}</button></div></div></div>`);
}
async function saveFragmentEdit() {
  const id = $('#fform').dataset.id; const f = state.fragments.find((x) => x.id === id);
  const text = $('#ftext').value.trim();
  if (text !== f.transcript) { f.transcript = text; f.lang = text ? detectLang(text) : f.lang; f.translations = {}; }
  f.note = $('#fnote').value.trim();
  f.questionIds = [...document.querySelectorAll('#fq .chip.on')].map((b) => b.dataset.id);
  await put('fragments', f); closeSheet(); render(); toast(t('saved'));
}

// ---------------------------------------------------------------------------
// AI coach
// ---------------------------------------------------------------------------
function makeAnon() {
  if (!S.anonymize) return (s) => s || '';
  const names = S.anonNames.split(/[,、]/).map((x) => x.trim()).filter(Boolean).sort((a, b) => b.length - a.length);
  const labels = names.map((_, i) => 'Person ' + String.fromCharCode(65 + (i % 26)));
  return (s) => { let out = s || ''; names.forEach((n, i) => { out = out.split(n).join(labels[i]); }); return out; };
}
function outLang(frags = []) {
  if (S.coachLang === 'ja' || S.coachLang === 'en') return S.coachLang;
  if (S.coachLang === 'match' && frags.length) { const ja = frags.filter((f) => f.lang === 'ja').length; return ja >= frags.length / 2 ? 'ja' : 'en'; }
  return S.uiLang;
}
function requireKey() {
  if (S.apiKey) return true;
  openSheet(`<h2>${t('aiTools')}</h2><p>${t('needKey')}</p><div class="row end"><button class="btn ghost" data-action="sheet-close">${t('close')}</button><button class="btn primary" data-action="go" data-to="settings">${t('navSettings')}</button></div>`);
  return false;
}
// Show the user exactly what will be sent, then call Claude.
function previewAndSend({ title, content, system, maxTokens = 1800, onResult, full = false }) {
  openSheet(`<h2>${esc(title)}</h2><p class="small muted">${t('previewLead')}</p><pre class="preview">${esc(content)}</pre>
    <div class="row end"><button class="btn ghost" data-action="sheet-close">${t('cancel')}</button><button class="btn primary" id="sendbtn">${t('send')}</button></div>`, { full });
  $('#sendbtn').onclick = async () => {
    $('.sheet-body').innerHTML = `<div class="thinking"><span class="spinner"></span><p>${t('thinking')}</p></div>`;
    try {
      const text = await callClaude({ apiKey: S.apiKey, model: S.model, system, messages: [{ role: 'user', content }], maxTokens });
      await onResult(text, content);
    } catch (e) {
      $('.sheet-body').innerHTML = `<h2>${esc(title)}</h2><p class="error">${esc(t('aiError', { msg: e.message }))}</p><div class="row end"><button class="btn" data-action="sheet-close">${t('close')}</button></div>`;
    }
  };
}
function citedIds(text, map) { const ids = new Set(); (text.match(/\[F(\d+)\]/g) || []).forEach((m) => { const id = map[m.slice(1, -1)]; if (id) ids.add(id); }); return [...ids]; }

function aiSummarize(qid) {
  if (!requireKey()) return;
  const q = qById(qid); const anon = makeAnon(); const frags = fragsOf(qid).slice(-80);
  const fb = fragmentsBlock(frags, anon); const lang = outLang(frags);
  const lb = libraryBlock(libraryFor(qid), anon);
  const content = PROMPTS.summarize(questionBlock(q, versionsOf(qid), anon), fb.text) + (lb.text ? `\n\nMY LIBRARY (papers I saved; cite as [L#] only if relevant):\n${lb.text}` : '');
  previewAndSend({ title: t('summarize'), content, system: coachSystem(lang), onResult: async (text) => {
    const ins = await put('insights', { id: uid(), questionId: qid, type: 'summary', text, fmap: fb.map, lmap: lb.map, sourceIds: citedIds(text, fb.map), lang, createdAt: Date.now() });
    showInsight(ins);
  } });
}
function aiConnections(qid) {
  if (!requireKey()) return;
  const anon = makeAnon();
  const qs = activeQs(); const qIndex = {}; qs.forEach((q, i) => { qIndex[q.id] = i + 1; });
  const frags = state.fragments.filter((f) => (f.questionIds || []).some((id) => qIndex[id])).sort((a, b) => a.createdAt - b.createdAt).slice(-60)
    .map((f) => ({ ...f, transcript: `(Q${qIndex[f.questionIds.find((id) => qIndex[id])]}) ${f.transcript || ''}` }));
  const qlist = qs.map((q) => `Q${qIndex[q.id]}: ${anon(q.text)}`).join('\n');
  const fb = fragmentsBlock(frags, anon); const lang = outLang(frags);
  const content = `QUESTIONS:\n${qlist}\n\n` + PROMPTS.connections(fb.text);
  previewAndSend({ title: t('connections'), content, system: coachSystem(lang), onResult: async (text) => {
    const ins = await put('insights', { id: uid(), questionId: qid, type: 'connections', text, fmap: fb.map, sourceIds: citedIds(text, fb.map), lang, createdAt: Date.now() });
    showInsight(ins);
  } });
}
function showInsight(ins) {
  openSheet(`<h2>${ins.type === 'summary' ? t('summarize') : t('connections')}</h2><div class="insight-body">${richText(ins.text, ins.fmap, ins.lmap)}</div>
  <p class="small muted">${t('sourceFragments')}: ${ins.sourceIds.length}</p><div class="row end"><button class="btn primary" data-action="sheet-close">${t('close')}</button></div>`, { full: true });
  render();
}

function aiPolish(qid) {
  if (!requireKey()) return;
  const q = qById(qid); const anon = makeAnon(); const frags = fragsOf(qid).slice(-60);
  const fb = fragmentsBlock(frags, anon); const lang = outLang(frags);
  const lb = libraryBlock(libraryFor(qid), anon);
  const content = (lb.text ? `MY LIBRARY (papers I saved; you may cite them as [L#] in reflection, assumption or rationale):\n${lb.text}\n\n` : '') + PROMPTS.polish(questionBlock(q, versionsOf(qid), anon), fb.text);
  previewAndSend({ title: t('polish'), content, system: coachSystem(lang), maxTokens: 2200, full: true, onResult: async (text) => {
    const parsed = parseJSON(text);
    coach[qid] = { messages: [{ role: 'user', content }, { role: 'assistant', content: text }], parsed, fmap: fb.map, lmap: lb.map, lang, replies: [] };
    await put('insights', { id: uid(), questionId: qid, type: 'polish', text, parsed, fmap: fb.map, lmap: lb.map, sourceIds: citedIds(text, fb.map), lang, createdAt: Date.now() });
    renderCoach(qid);
    render();
  } });
}
function renderCoach(qid) {
  const c = coach[qid]; const q = qById(qid); const p = c.parsed;
  const body = p ? `
    <section class="coach-sec"><h4>🪞 ${t('coachReflection')}</h4>${richText(p.reflection, c.fmap, c.lmap)}</section>
    <section class="coach-sec"><h4>🧩 ${t('coachAssumption')}</h4>${richText(p.assumption, c.fmap, c.lmap)}</section>
    <section class="coach-sec"><h4>🌿 ${t('coachAlternatives')}</h4>${(p.alternatives || []).map((a, i) => `<div class="alt-card"><p class="qtext">${esc(a.text)}</p><div class="small">${richText(a.rationale, c.fmap, c.lmap)}</div><p class="small muted">${t('technique')}: ${esc(a.technique)}</p><button class="link small" data-action="coach-draft" data-id="${qid}" data-i="${i}">${t('useAsStart')}</button></div>`).join('')}</section>
    ${p.next_step ? `<section class="coach-sec"><h4>${catIcon(p.next_step.category)} ${t('coachNextStep')}</h4><p>${esc(p.next_step.text)}</p>${p.next_step.tip && TIPS.find((x) => x.id === p.next_step.tip) ? `<button class="link small" data-action="open-tip" data-id="${p.next_step.tip}">💡 ${esc(L(TIPS.find((x) => x.id === p.next_step.tip)).title)}</button>` : ''}<button class="btn small" data-action="coach-inv" data-id="${qid}">＋ ${t('addAsInvitation')}</button></section>` : ''}
    <section class="coach-sec ask"><h4>❓ ${t('coachAsk')}</h4><p>${esc(p.ask)}</p></section>`
    : `<div class="insight-body">${richText(c.messages[1].content, c.fmap, c.lmap)}</div>`;
  const replies = c.replies.map((r) => `<div class="bubble ${r.role}">${r.role === 'user' ? esc(r.content) : richText(r.content, c.fmap, c.lmap)}</div>`).join('');
  openSheet(`<h2>✨ ${t('polish')}</h2><p class="small muted qtext">${esc(q.text)}</p>${body}<div class="chat">${replies}</div>
    <div class="form"><textarea id="coachreply" rows="2" placeholder="${esc(t('replyPlaceholder'))}"></textarea>
    <div class="row between"><button class="btn" data-action="coach-reply" data-id="${qid}">${t('send')}</button><button class="btn primary" data-action="coach-write" data-id="${qid}">✎ ${t('writeNextVersion')}</button></div></div>`, { full: true });
}
async function coachReply(qid) {
  const c = coach[qid]; const ta = $('#coachreply'); const msg = ta.value.trim(); if (!msg) return;
  const anon = makeAnon();
  c.replies.push({ role: 'user', content: msg });
  c.messages.push({ role: 'user', content: anon(msg) + '\n\n(Reply in plain prose, not JSON. Keep it short.)' });
  renderCoach(qid);
  const chat = $('.chat'); chat.insertAdjacentHTML('beforeend', `<div class="bubble assistant"><span class="spinner"></span></div>`);
  try {
    const text = await callClaude({ apiKey: S.apiKey, model: S.model, system: coachSystem(c.lang), messages: c.messages, maxTokens: 1000 });
    c.messages.push({ role: 'assistant', content: text }); c.replies.push({ role: 'assistant', content: text });
  } catch (e) { c.replies.push({ role: 'assistant', content: t('aiError', { msg: e.message }) }); c.messages.pop(); }
  renderCoach(qid);
  const b = $('.sheet-panel'); if (b) b.scrollTop = b.scrollHeight;
}
function aiTranslate(kind, id) {
  if (!requireKey()) return;
  const item = kind === 'q' ? qById(id) : state.fragments.find((x) => x.id === id);
  const text = kind === 'q' ? item.text : item.transcript; if (!text) return;
  const to = item.lang === 'ja' ? 'en' : 'ja'; const anon = makeAnon();
  const content = PROMPTS.translate(anon(text), to);
  previewAndSend({ title: t('translate'), content, system: 'You are a careful translator. Preserve meaning and tone. Output only the translation.', maxTokens: 800, onResult: async (out) => {
    item.translations = { ...(item.translations || {}), [to]: out };
    await put(kind === 'q' ? 'questions' : 'fragments', item);
    openSheet(`<h2>${t('translate')}</h2><p class="small muted">${t('original')}</p><p>${esc(text)}</p><p class="small muted">${t('translation')}</p><p>${esc(out)}</p><div class="row end"><button class="btn primary" data-action="sheet-close">${t('close')}</button></div>`);
    render();
  } });
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
function questionMarkdown(q) {
  const lines = [`# ${q.text}`, '', `- ${t('stage')}: ${t('stage_' + q.stage)}`, `- ${t('status')}: ${t('status_' + q.status)}`];
  if ((q.tags || []).length) lines.push(`- ${t('tags')}: ${q.tags.join(', ')}`);
  lines.push('', `## ${t('versions')}`);
  versionsOf(q.id).forEach((v, i) => { lines.push(`${i + 1}. **v${i + 1}** (${fmtDate(v.createdAt, false)}) ${v.text}`); if (v.why) lines.push(`   - ${t('whyChanged')}: ${v.why}`); });
  lines.push('', `## ${t('fragments')}`);
  fragsOf(q.id).forEach((f) => { lines.push(`- ${fmtDate(f.createdAt)} ${f.type === 'experience' ? '[' + t('kind_' + f.kind) + '] ' : ''}${f.transcript || t('audioOnly')}${f.note ? ` (${f.note})` : ''}`); });
  const ins = state.insights.filter((x) => x.questionId === q.id);
  if (ins.length) { lines.push('', `## ${t('insights')}`); ins.forEach((x) => lines.push('', `### ${fmtDate(x.createdAt)}`, x.text)); }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------
function onboarding(step = 1) {
  const titles = ['ob1Title', 'ob2Title', 'ob3Title']; const bodies = ['ob1', 'ob2', 'ob3']; const icons = ['🌱', '🌿', '🚶'];
  openSheet(`<div class="onboard"><div class="ob-icon">${icons[step - 1]}</div><div class="ob-lang">${seg('uiLang', S.uiLang, [['ja', '日本語'], ['en', 'English']])}</div><h2>${t(titles[step - 1])}</h2><p>${t(bodies[step - 1])}</p>
  <div class="dots">${[1, 2, 3].map((i) => `<span class="${i === step ? 'on' : ''}"></span>`).join('')}</div>
  ${step < 3 ? `<button class="btn primary wide" data-action="ob-next" data-step="${step + 1}">${t('next')}</button>` : `<button class="btn primary wide" data-action="ob-finish">${t('obStart')}</button>`}</div>`);
}

// ---------------------------------------------------------------------------
// Event handling
// ---------------------------------------------------------------------------
const actions = {
  go: (el) => { closeSheet(); go(el.dataset.to); },
  'open-q': (el) => go('q/' + el.dataset.id),
  'new-q': () => openQuestionForm(null),
  'edit-q': (el) => openQuestionForm(qById(el.dataset.id)),
  'save-q': () => saveQuestionForm(),
  'form-stage': (el) => { const f = el.closest('.form'); f.dataset.stage = el.dataset.stage; f.querySelectorAll('[data-action="form-stage"]').forEach((b) => b.classList.toggle('on', b === el)); },
  'set-stage': async (el) => { const q = qById(el.dataset.id); q.stage = el.dataset.stage; q.updatedAt = Date.now(); await put('questions', q); render(); },
  rewrite: (el) => openRewrite(el.dataset.id),
  'save-rewrite': () => saveRewrite(),
  'delete-q': async (el) => { if (!(await confirmDialog(t('confirmDelete')))) return; const id = el.dataset.id; await remove('questions', id); for (const v of versionsOf(id)) await remove('versions', v.id); for (const i of state.invitations.filter((x) => x.questionId === id)) await remove('invitations', i.id); for (const x of state.insights.filter((x) => x.questionId === id)) await remove('insights', x.id); for (const f of state.fragments.filter((f) => (f.questionIds || []).includes(id))) { f.questionIds = f.questionIds.filter((x) => x !== id); await put('fragments', f); } go('home'); },
  record: () => openCapture({ mode: 'record', questionId: route().name === 'q' ? route().id : null }),
  write: () => openCapture({ mode: 'write', questionId: route().name === 'q' ? route().id : null }),
  'cap-rec': () => startRecording(),
  'cap-stop': () => stopRecording(),
  'cap-discard': () => { cap.blob = null; if (cap.type === 'voice') cap.type = 'text'; rerenderCapture(); },
  'cap-lang': (el) => { cap.lang = el.dataset.val; rerenderCapture(); },
  'cap-kind': (el) => { cap.kind = el.dataset.kind; rerenderCapture(); },
  'cap-q': (el) => { cap.touched = true; const id = el.dataset.id; if (!id) cap.qids.clear(); else if (cap.qids.has(id)) cap.qids.delete(id); else cap.qids.add(id); rerenderCapture(); },
  'cap-save': () => saveCapture(),
  'edit-frag': (el) => openFragmentEdit(el.dataset.id),
  'save-frag': () => saveFragmentEdit(),
  'toggle-chip': (el) => el.classList.toggle('on'),
  'delete-frag': async (el) => { if (!(await confirmDialog(t('confirmDelete')))) return; await remove('fragments', el.dataset.id); closeSheet(); render(); },
  'goto-frag': (el) => { closeSheet(); const f = document.getElementById('frag-' + el.dataset.id); if (f) { f.scrollIntoView({ behavior: 'smooth', block: 'center' }); f.classList.add('flash'); setTimeout(() => f.classList.remove('flash'), 1600); } },
  'inv-accept': async (el) => { const i = state.invitations.find((x) => x.id === el.dataset.id); i.status = 'accepted'; i.acceptedAt = Date.now(); await put('invitations', i); render(); },
  'inv-skip': async (el) => { const i = state.invitations.find((x) => x.id === el.dataset.id); i.status = 'skipped'; await put('invitations', i); render(); },
  'inv-snooze': async (el) => { const i = state.invitations.find((x) => x.id === el.dataset.id); i.status = 'snoozed'; i.snoozeUntil = startOfTomorrow(); await put('invitations', i); render(); },
  'inv-log': (el) => openCapture({ mode: 'write', invitation: state.invitations.find((x) => x.id === el.dataset.id) }),
  'new-inv': async (el) => { const q = qById(el.dataset.id); const tpl = pickTemplate(q); if (tpl) await put('invitations', invitationFromTemplate(q, tpl)); render(); },
  'open-tip': (el) => { const tp = TIPS.find((x) => x.id === el.dataset.id); openSheet(`<div class="tipsheet">${tipCard(tp, true)}</div><div class="row end"><button class="btn" data-action="sheet-close">${t('close')}</button></div>`); },
  'tip-filter': (el) => { tipFilter = el.dataset.cat; render(); },
  'tip-try': (el) => {
    const tip = TIPS.find((x) => x.id === el.dataset.id); const qs = activeQs();
    if (!qs.length) { openQuestionForm(null); return; }
    openSheet(`<h2>${t('pickQuestion')}</h2><p class="small muted">${esc(L(tip).tryToday)}</p>${qs.map((q) => `<button class="card qcard" data-action="tip-apply" data-tip="${tip.id}" data-id="${q.id}"><p class="qtext">${esc(q.text)}</p></button>`).join('')}<div class="row end"><button class="btn ghost" data-action="sheet-close">${t('cancel')}</button></div>`);
  },
  'tip-apply': async (el) => {
    const tip = TIPS.find((x) => x.id === el.dataset.tip); const q = qById(el.dataset.id);
    const tpl = INVITATIONS.find((x) => x.tip === tip.id);
    const inv = tpl ? invitationFromTemplate(q, tpl) : { id: uid(), questionId: q.id, templateId: 'tip-' + tip.id, category: tip.category === 'rest' || tip.category === 'question' ? 'body' : tip.category, text: { ja: tip.ja.tryToday, en: tip.en.tryToday }, tip: tip.id, status: 'offered', offeredAt: Date.now() };
    inv.status = 'accepted'; inv.acceptedAt = Date.now();
    await put('invitations', inv); closeSheet(); go('q/' + q.id); toast(t('added'));
  },
  summarize: (el) => aiSummarize(el.dataset.id),
  connections: (el) => aiConnections(el.dataset.id),
  polish: (el) => aiPolish(el.dataset.id),
  'coach-reply': (el) => coachReply(el.dataset.id),
  'coach-write': (el) => openRewrite(el.dataset.id),
  'coach-draft': (el) => { const c = coach[el.dataset.id]; openRewrite(el.dataset.id, c.parsed.alternatives[+el.dataset.i].text); },
  'coach-inv': async (el) => {
    const qid = el.dataset.id; const ns = coach[qid].parsed.next_step;
    const cat = ['body', 'place', 'people'].includes(ns.category) ? ns.category : 'body';
    await put('invitations', { id: uid(), questionId: qid, templateId: 'coach', category: cat, text: { ja: ns.text, en: ns.text }, tip: TIPS.find((x) => x.id === ns.tip) ? ns.tip : null, status: 'accepted', offeredAt: Date.now(), acceptedAt: Date.now() });
    el.textContent = '✓ ' + t('added'); el.disabled = true; render();
  },
  'delete-insight': async (el) => { if (!(await confirmDialog(t('confirmDelete')))) return; await remove('insights', el.dataset.id); render(); },
  'translate-q': (el) => aiTranslate('q', el.dataset.id),
  'translate-frag': (el) => aiTranslate('f', el.dataset.id),
  'export-md': (el) => { const q = qById(el.dataset.id); const name = 'question-' + new Date().toISOString().slice(0, 10) + '.md'; shareOrDownload(name, new Blob([questionMarkdown(q)], { type: 'text/markdown' })); },
  'export-json': async () => { const data = await exportAll(); shareOrDownload(`question-garden-backup-${new Date().toISOString().slice(0, 10)}.json`, new Blob([JSON.stringify(data)], { type: 'application/json' })); },
  set: async (el) => { if (el.dataset.key.startsWith('p-')) { const k = el.dataset.key.slice(2); paperSearch[k] = k === 'minCites' ? +el.dataset.val : el.dataset.val; paperSearch.q = $('#pq') ? $('#pq').value : paperSearch.q; if (paperSearch.q.trim()) runPaperSearch(); else render(); return; } S[el.dataset.key] = el.dataset.val; await saveSettings(); applySettings(); if ($('.onboard')) onboarding(+($('.dots .on') ? [...$('.dots').children].findIndex((x) => x.classList.contains('on')) + 1 : 1)); render(); updateStorageStatus(); },
  'hide-install': async () => { S.hideInstall = true; await saveSettings(); render(); },
  'sheet-close': () => closeSheet(),
  'find-papers': (el) => { const q = qById(el.dataset.id); paperSearch.forQ = q.id; paperSearch.q = q.text; go('papers'); runPaperSearch(); },
  'paper-search': () => { paperSearch.q = $('#pq').value; runPaperSearch(); },
  'paper-keywords': () => { paperSearch.q = $('#pq').value; aiKeywords(); },
  'paper-fav': (el) => toggleFav(el.dataset.id),
  'paper-column': (el) => aiPaperColumn(el.dataset.id),
  'lib-filter': (el) => { libFilter = el.dataset.id; render(); },
  'lib-q': async (el) => { const p = state.library.find((x) => x.id === el.dataset.id); const qid = el.dataset.q; p.questionIds = p.questionIds || []; p.questionIds = p.questionIds.includes(qid) ? p.questionIds.filter((x) => x !== qid) : [...p.questionIds, qid]; await put('library', p); el.classList.toggle('on'); },
  'export-library': () => shareOrDownload(`bookshelf-${new Date().toISOString().slice(0, 10)}.md`, new Blob([libraryMarkdown()], { type: 'text/markdown' })),
  'ob-next': (el) => onboarding(+el.dataset.step),
  'ob-finish': async () => { S.onboarded = true; await saveSettings(); closeSheet(); if (!state.questions.length) openQuestionForm(null); },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const fn = actions[el.dataset.action]; if (!fn) return;
  if (el.tagName === 'A') e.preventDefault();
  fn(el, e);
});
document.addEventListener('change', async (e) => {
  const el = e.target;
  if (el.dataset.libNote) { const p = state.library.find((x) => x.id === el.dataset.libNote); if (p) { p.note = el.value.trim(); await put('library', p); toast(t('saved')); } }
  if (el.dataset.setting) { S[el.dataset.setting] = el.type === 'checkbox' ? el.checked : el.value.trim(); await saveSettings(); }
  if (el.dataset.actionChange === 'import-json' && el.files[0]) {
    try { const data = JSON.parse(await el.files[0].text()); const r = await importAll(data); await loadAll(); render(); toast(t('importDone', { q: r.q, f: r.f })); }
    catch (err) { toast(t('aiError', { msg: err.message })); }
  }
});
let sugTimer;
document.addEventListener('input', (e) => {
  if (e.target.id !== 'captext' || !cap) return;
  cap.text = e.target.value;
  clearTimeout(sugTimer);
  sugTimer = setTimeout(() => {
    if (!cap || cap.touched) return;
    const q = suggestQuestion(cap.text); const id = q ? q.id : null;
    if (id !== cap.suggested) { cap.suggested = id; cap.qids = new Set(id ? [id] : []); const ta = $('#captext'); const pos = ta.selectionStart; rerenderCapture(); const n = $('#captext'); n.focus(); n.setSelectionRange(pos, pos); }
  }, 700);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'pq') { e.preventDefault(); paperSearch.q = e.target.value; runPaperSearch(); } });
window.addEventListener('hashchange', () => { window.scrollTo(0, 0); $('#toast').classList.remove('show'); render(); });

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
function applySettings() {
  setLang(S.uiLang);
  if (S.theme === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = S.theme;
  document.title = t('appName');
}
async function updateStorageStatus() {
  const el = $('#storage-status'); if (!el) return;
  let p = false; try { p = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : false; } catch (e) {}
  el.textContent = `${t('storageStatus')}: ${p ? t('persisted') : t('notPersisted')}`;
}
window.addEventListener('hashchange', updateStorageStatus);

async function boot() {
  await loadSettings(); applySettings(); await loadAll();
  try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) {}
  await ensureDailyInvitations();
  render(); updateStorageStatus(); loadCitations();
  if (!S.onboarded) onboarding(1);
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js').catch(() => {});
}
document.addEventListener('visibilitychange', async () => { if (document.visibilityState === 'visible') { await ensureDailyInvitations(); if (route().name === 'home' && !$('#sheet:not(.hidden)')) render(); } });
boot();
