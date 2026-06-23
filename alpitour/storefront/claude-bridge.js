/* ============================================================
   claude-bridge.js
   Wires window.claude.complete({ messages }) → string
   to the Anthropic Messages API so the synthetic persona
   cohort can have live LLM-powered conversations.

   Drop this script before personas.js in any HTML that
   needs live persona chat.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'alpi_anthropic_key';
  var MODEL       = 'claude-sonnet-4-6';
  var API_URL     = 'https://api.anthropic.com/v1/messages';

  /* ---- API-key collection overlay ---- */
  var pending      = [];   // resolve callbacks waiting for a key
  var overlayOpen  = false;

  function injectOverlay() {
    if (document.getElementById('cb-overlay')) return;

    var el = document.createElement('div');
    el.id  = 'cb-overlay';
    el.innerHTML =
      '<div id="cb-box">'
    + '<div id="cb-eyb">AlpiGPT · Live Mode</div>'
    + '<div id="cb-title">Connect to Claude</div>'
    + '<div id="cb-sub">Enter your Anthropic API key to enable live persona chat. '
    +   'The key is stored only in this browser and sent only to api.anthropic.com.</div>'
    + '<input id="cb-key" type="password" placeholder="sk-ant-…" autocomplete="off" spellcheck="false" />'
    + '<button id="cb-btn">Connect \u2192</button>'
    + '<div id="cb-err"></div>'
    + '<a href="https://console.anthropic.com/settings/keys" target="_blank" id="cb-link">'
    +   'Get a key from the Anthropic Console \u2197</a>'
    + '</div>';

    /* scrim */
    el.style.cssText =
      'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;'
    + 'background:rgba(8,10,12,.78);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);'
    + 'font-family:var(--font-sans,system-ui,sans-serif)';

    var box = el.querySelector('#cb-box');
    box.style.cssText =
      'background:#1A2027;border:1px solid rgba(255,255,255,.12);border-radius:18px;'
    + 'padding:34px 30px 28px;width:min(440px,calc(100vw - 40px));'
    + 'box-shadow:0 48px 120px rgba(0,0,0,.65);color:#E8EDEF;box-sizing:border-box';

    el.querySelector('#cb-eyb').style.cssText =
      'font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;'
    + 'color:#FF462D;margin-bottom:11px';

    el.querySelector('#cb-title').style.cssText =
      'font-family:var(--font-display,system-ui);font-size:24px;font-weight:500;'
    + 'letter-spacing:-0.01em;margin-bottom:9px';

    el.querySelector('#cb-sub').style.cssText =
      'font-size:13px;color:#8C99A0;line-height:1.6;margin-bottom:22px';

    var inp = el.querySelector('#cb-key');
    inp.style.cssText =
      'display:block;width:100%;box-sizing:border-box;'
    + 'background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.14);'
    + 'border-radius:11px;padding:12px 15px;font-family:inherit;font-size:14px;'
    + 'color:#fff;margin-bottom:13px;outline:none;transition:border-color .15s';
    inp.addEventListener('focus', function () {
      inp.style.borderColor = 'rgba(255,70,45,.7)';
    });
    inp.addEventListener('blur', function () {
      inp.style.borderColor = 'rgba(255,255,255,.14)';
    });

    var btn = el.querySelector('#cb-btn');
    btn.style.cssText =
      'display:block;width:100%;padding:12px;border:none;border-radius:11px;'
    + 'background:#FF462D;color:#fff;font-family:inherit;font-size:14px;'
    + 'font-weight:600;cursor:pointer;transition:opacity .15s';
    btn.addEventListener('mouseenter', function () { btn.style.opacity = '.88'; });
    btn.addEventListener('mouseleave', function () { btn.style.opacity = '1'; });

    el.querySelector('#cb-err').style.cssText =
      'font-size:12px;color:#FF8066;margin-top:10px;min-height:18px';

    el.querySelector('#cb-link').style.cssText =
      'display:block;margin-top:16px;font-size:11.5px;color:#5B9FAB;text-decoration:none;'
    + 'text-align:center;opacity:.8';

    function submit() {
      var k = inp.value.trim();
      if (!k) {
        el.querySelector('#cb-err').textContent = 'Please enter your API key.';
        return;
      }
      if (!k.startsWith('sk-ant-')) {
        el.querySelector('#cb-err').textContent =
          'That doesn\u2019t look like an Anthropic key \u2014 it should start with sk-ant-.';
        return;
      }
      localStorage.setItem(STORAGE_KEY, k);
      el.remove();
      overlayOpen = false;
      var cbs = pending.slice(); pending = [];
      cbs.forEach(function (r) { r(k); });
    }

    btn.addEventListener('click', submit);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });

    document.body.appendChild(el);
    setTimeout(function () { inp.focus(); }, 80);
  }

  function requireKey() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return Promise.resolve(stored);
    return new Promise(function (resolve) {
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

  /* ---- public API ---- */
  window.claude = {
    /**
     * complete({ messages: [{role, content}, …] }) → Promise<string>
     *
     * Personas send messages in the format:
     *   [user(system), assistant(greet), …history…, user(question)]
     * which is valid for the Anthropic Messages API as-is.
     */
    complete: async function (opts) {
      var key      = await requireKey();
      var messages = (opts && opts.messages) || [];
      var maxTok   = (opts && opts.max_tokens) || 1024;

      var res = await fetch(API_URL, {
        method:  'POST',
        headers: {
          'Content-Type':   'application/json',
          'x-api-key':      key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model:      MODEL,
          max_tokens: maxTok,
          messages:   messages
        })
      });

      if (!res.ok) {
        var body = await res.json().catch(function () { return {}; });
        /* Clear a bad key so the user can re-enter */
        if (res.status === 401) {
          localStorage.removeItem(STORAGE_KEY);
        }
        throw new Error(
          (body.error && body.error.message) || ('Anthropic API error ' + res.status)
        );
      }

      var data = await res.json();
      return (data.content && data.content[0] && data.content[0].text) || '';
    },

    /** Forget the stored API key (prompts again on next chat) */
    resetKey: function () {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

})();
