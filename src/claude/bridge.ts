/* ============================================================
   claude/bridge.ts
   Wires claudeComplete({ messages }) → string
   to the Anthropic Messages API so the synthetic persona
   cohort can have live LLM-powered conversations.

   Priority order for API key:
   1. VITE_ANTHROPIC_API_KEY env var (set in .env)
   2. localStorage (entered via overlay UI)
   3. Overlay UI prompts for key entry

   Migrated from alpitour/storefront/claude-bridge.js
   ============================================================ */

import type { CompleteOptions } from '@/shared/types';

const STORAGE_KEY = 'alpi_anthropic_key';
const MODEL = 'claude-sonnet-4-6';
const API_URL = 'https://api.anthropic.com/v1/messages';

// VITE_ANTHROPIC_API_KEY is injected at build time via import.meta.env
const ENV_KEY: string | undefined =
  typeof import.meta !== 'undefined' && (import.meta as any).env
    ? (import.meta as any).env.VITE_ANTHROPIC_API_KEY
    : undefined;

// ---- API-key collection overlay ----
let pending: Array<(key: string) => void> = [];
let overlayOpen = false;

function injectOverlay(): void {
  if (document.getElementById('cb-overlay')) return;

  const el = document.createElement('div');
  el.id = 'cb-overlay';
  el.innerHTML =
    '<div id="cb-box">' +
    '<div id="cb-eyb">AlpiGPT · Live Mode</div>' +
    '<div id="cb-title">Connect to Claude</div>' +
    '<div id="cb-sub">Enter your Anthropic API key to enable live persona chat. ' +
    'The key is stored only in this browser and sent only to api.anthropic.com.</div>' +
    '<input id="cb-key" type="password" placeholder="sk-ant-\u2026" autocomplete="off" spellcheck="false" />' +
    '<button id="cb-btn">Connect \u2192</button>' +
    '<div id="cb-err"></div>' +
    '<a href="https://console.anthropic.com/settings/keys" target="_blank" id="cb-link">' +
    'Get a key from the Anthropic Console \u2197</a>' +
    '</div>';

  el.style.cssText =
    'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(8,10,12,.78);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
    'font-family:var(--font-sans,system-ui,sans-serif)';

  const box = el.querySelector('#cb-box') as HTMLElement;
  box.style.cssText =
    'background:#1A2027;border:1px solid rgba(255,255,255,.12);border-radius:18px;' +
    'padding:34px 30px 28px;width:min(440px,calc(100vw - 40px));' +
    'box-shadow:0 48px 120px rgba(0,0,0,.65);color:#E8EDEF;box-sizing:border-box';

  const eyb = el.querySelector('#cb-eyb') as HTMLElement;
  eyb.style.cssText =
    'font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;' +
    'color:#FF462D;margin-bottom:11px';

  const title = el.querySelector('#cb-title') as HTMLElement;
  title.style.cssText =
    'font-family:var(--font-display,system-ui);font-size:24px;font-weight:500;' +
    'letter-spacing:-0.01em;margin-bottom:9px';

  const sub = el.querySelector('#cb-sub') as HTMLElement;
  sub.style.cssText = 'font-size:13px;color:#8C99A0;line-height:1.6;margin-bottom:22px';

  const inp = el.querySelector('#cb-key') as HTMLInputElement;
  inp.style.cssText =
    'display:block;width:100%;box-sizing:border-box;' +
    'background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.14);' +
    'border-radius:11px;padding:12px 15px;font-family:inherit;font-size:14px;' +
    'color:#fff;margin-bottom:13px;outline:none;transition:border-color .15s';
  inp.addEventListener('focus', () => { inp.style.borderColor = 'rgba(255,70,45,.7)'; });
  inp.addEventListener('blur', () => { inp.style.borderColor = 'rgba(255,255,255,.14)'; });

  const btn = el.querySelector('#cb-btn') as HTMLButtonElement;
  btn.style.cssText =
    'display:block;width:100%;padding:12px;border:none;border-radius:11px;' +
    'background:#FF462D;color:#fff;font-family:inherit;font-size:14px;' +
    'font-weight:600;cursor:pointer;transition:opacity .15s';
  btn.addEventListener('mouseenter', () => { btn.style.opacity = '.88'; });
  btn.addEventListener('mouseleave', () => { btn.style.opacity = '1'; });

  const errEl = el.querySelector('#cb-err') as HTMLElement;
  errEl.style.cssText = 'font-size:12px;color:#FF8066;margin-top:10px;min-height:18px';

  const link = el.querySelector('#cb-link') as HTMLElement;
  link.style.cssText =
    'display:block;margin-top:16px;font-size:11.5px;color:#5B9FAB;text-decoration:none;' +
    'text-align:center;opacity:.8';

  function submit() {
    const k = inp.value.trim();
    if (!k) { errEl.textContent = 'Please enter your API key.'; return; }
    if (!k.startsWith('sk-ant-')) {
      errEl.textContent = "That doesn\u2019t look like an Anthropic key \u2014 it should start with sk-ant-.";
      return;
    }
    localStorage.setItem(STORAGE_KEY, k);
    el.remove();
    overlayOpen = false;
    const cbs = pending.slice(); pending = [];
    cbs.forEach((r) => r(k));
  }

  btn.addEventListener('click', submit);
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });

  document.body.appendChild(el);
  setTimeout(() => { inp.focus(); }, 80);
}

function requireKey(): Promise<string> {
  // 1. Env var (set in .env as VITE_ANTHROPIC_API_KEY)
  if (ENV_KEY && ENV_KEY.startsWith('sk-ant-')) return Promise.resolve(ENV_KEY);
  // 2. localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return Promise.resolve(stored);
  // 3. Overlay UI
  return new Promise<string>((resolve) => {
    pending.push(resolve);
    if (!overlayOpen) {
      overlayOpen = true;
      if (document.body) {
        injectOverlay();
      } else {
        document.addEventListener('DOMContentLoaded', injectOverlay);
      }
    }
  });
}

// ---- public API ----

/**
 * complete({ messages: [{role, content}, …] }) → Promise<string>
 *
 * Personas send messages in the format:
 *   [user(system), assistant(greet), …history…, user(question)]
 * which is valid for the Anthropic Messages API as-is.
 */
export async function claudeComplete(opts: CompleteOptions): Promise<string> {
  const key = await requireKey();
  const messages = (opts && opts.messages) || [];
  const maxTok = (opts && opts.max_tokens) || 1024;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTok, messages }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (res.status === 401) localStorage.removeItem(STORAGE_KEY);
    throw new Error((body.error && body.error.message) || ('Anthropic API error ' + res.status));
  }

  const data = await res.json();
  return (data.content && data.content[0] && data.content[0].text) || '';
}

/** Forget the stored API key (prompts again on next chat) */
export function resetClaudeKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}
