import { mergeEnvelopes, normaliseEnvelope, stableString } from './sync-state.mjs?v=20261014-cloud';
import { CLOUD_CONFIG } from './cloud-config.mjs?v=20261014-cloud';

async function timedFetch(url, options = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  else options.signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(() => controller.abort(), 20000);
  try { return await fetch(url, { ...options, signal: controller.signal }); }
  finally { clearTimeout(timeout); options.signal?.removeEventListener('abort', abort); }
}

export class CloudSync {
  constructor({ onScope, getLocal, applyLocal, onStatus, createClient = window.supabase?.createClient }) {
    this.onScope = onScope; this.getLocal = getLocal; this.applyLocal = applyLocal; this.onStatus = onStatus;
    this.client = null; this.user = null; this.epoch = 0; this.running = null; this.timer = null; this.rerun = false;
    this.status = { kind: 'starting', message: '正在检查云同步', email: '', lastSync: 0 };
    try {
      if (!createClient) throw new Error('登录组件未加载，仍可离线背词。');
      this.client = createClient(CLOUD_CONFIG.url, CLOUD_CONFIG.publishableKey, {
        auth: { storageKey: 'wordleaf:auth:v1', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
        global: { fetch: timedFetch },
      });
      this.client.auth.onAuthStateChange((_event, session) => {
        // Auth callbacks are synchronous; defer work so refresh locks can finish.
        setTimeout(() => this.setUser(session?.user || null), 0);
      });
    } catch (error) { this.setStatus('error', error.message); }
  }
  setStatus(kind, message, lastSync = this.status.lastSync) {
    this.status = { kind, message, email: this.user?.email || '', lastSync };
    this.onStatus(this.status);
  }
  setUser(user) {
    if (user?.id === this.user?.id) return;
    this.epoch++; this.user = user; clearTimeout(this.timer); this.rerun = false;
    try { this.onScope(user); }
    catch (error) { this.user = null; this.setStatus('error', error.message); return; }
    this.setStatus(user ? 'pending' : 'signed-out', user ? '已登录，等待同步' : '未登录 · 仅保存在本机', 0);
    if (user) this.schedule(0);
  }
  async init() {
    if (!this.client) return;
    const { data, error } = await this.client.auth.getSession();
    if (error) { this.setStatus('error', '登录状态读取失败，请重新登录。'); return; }
    if (data.session?.user) this.setUser(data.session.user);
    else this.setStatus('signed-out', '未登录 · 仅保存在本机', 0);
  }
  async authenticate(email, password, register = false) {
    if (!this.client) throw new Error('登录组件不可用，请重新加载网页；学习记录仍在本机。');
    const response = register
      ? await this.client.auth.signUp({ email, password, options: { emailRedirectTo: CLOUD_CONFIG.siteUrl } })
      : await this.client.auth.signInWithPassword({ email, password });
    if (response.error) throw response.error;
    if (response.data.session?.user) this.setUser(response.data.session.user);
    return !!response.data.session;
  }
  async signOut() {
    if (!this.client) return;
    const { error } = await this.client.auth.signOut({ scope: 'local' });
    if (error) throw error;
    this.setUser(null);
  }
  schedule(delay = 1200) {
    if (!this.user) return;
    clearTimeout(this.timer);
    if (this.running) { this.rerun = true; return; }
    this.timer = setTimeout(() => this.sync(), delay);
  }
  sync() {
    if (!this.user || !this.client) return Promise.resolve(false);
    if (this.running) { this.rerun = true; return this.running; }
    const actor = this.user.id, epoch = this.epoch;
    const current = () => this.epoch === epoch && this.user?.id === actor;
    const run = async () => {
      this.setStatus('syncing', '正在合并云端记录…');
      const response = await this.client.from('wordleaf_profiles').select('revision,payload,updated_at').eq('user_id', actor).maybeSingle();
      if (!current()) return false;
      if (response.error) throw response.error;
      let remote = response.data;
      for (let attempt = 0; attempt < 4; attempt++) {
        const local = this.getLocal();
        const merged = remote?.payload ? mergeEnvelopes(local, remote.payload) : normaliseEnvelope(local);
        if (remote?.payload && stableString(merged) === stableString(normaliseEnvelope(remote.payload))) {
          this.applyLocal(merged); this.setStatus('synced', '已同步 · 本机也有备份', Date.now()); return true;
        }
        const result = await this.client.rpc('wordleaf_sync', { expected_revision: remote?.revision || 0, next_payload: merged, expected_user: actor });
        if (!current()) return false;
        if (result.error) throw result.error;
        if (!result.data || !Number.isInteger(result.data.revision) || !result.data.payload) throw new Error('同步服务返回异常，本机记录未删除。');
        remote = result.data;
        if (!remote.conflict) {
          // Changes made during the request remain local and queue another sync.
          const combined = mergeEnvelopes(this.getLocal(), remote.payload);
          const pending = stableString(combined) !== stableString(normaliseEnvelope(remote.payload));
          if (pending) this.rerun = true;
          this.applyLocal(combined); this.setStatus(pending ? 'pending' : 'synced', pending ? '本机有新记录，继续同步…' : '已同步 · 本机也有备份', Date.now()); return !pending;
        }
      }
      throw new Error('另一台设备正在保存，请稍后点“立即同步”。');
    };
    this.running = run().catch(error => {
      if (current()) this.setStatus('error', cloudError(error));
      return false;
    }).finally(() => {
      this.running = null;
      if (this.rerun && this.user) { this.rerun = false; this.schedule(); }
    });
    return this.running;
  }
}

export function cloudError(error) {
  const code = error?.code || '', message = String(error?.message || error || '');
  if (code === 'email_not_confirmed') return '请先打开邮箱里的确认邮件，再登录。';
  if (code === 'invalid_credentials') return '邮箱或密码不正确，请检查后重试。';
  if (code === 'over_email_send_rate_limit') return '验证邮件发送过于频繁，请稍后再试。';
  if (/email.*not.*allowed|Email address.*invalid|email_address_not_authorized/i.test(message + code)) return '该邮箱不能接收默认验证邮件，请使用项目所有者邮箱，或配置邮件服务。';
  if (/fetch|network|timeout|abort/i.test(message)) return '网络未接通，本机记录已保留；联网后可再同步。';
  if (code === '23514') return '云端记录超出限制或格式不兼容，请导出本机备份并反馈。';
  return message ? '云同步未完成：' + message.slice(0, 160) : '云同步未完成，本机记录仍保留。';
}
