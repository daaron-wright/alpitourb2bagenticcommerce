/* ============================================================
   claude/bridge.ts
   Wires claudeComplete({ messages }) → string
   through the server-side /api/claude/complete endpoint.

   The API key lives server-side only (VITE_ANTHROPIC_API_KEY
   in the server environment). The browser never sees it and
   never calls api.anthropic.com directly, which eliminates
   CORS issues and the need for the dangerous-direct-browser-access
   header.

   Migrated from alpitour/storefront/claude-bridge.js
   ============================================================ */

import type { CompleteOptions } from '@/shared/types';

const API_ENDPOINT = '/api/claude/complete';

// ---- public API ----

/**
 * claudeComplete({ messages: [{role, content}, …] }) → Promise<string>
 *
 * Sends messages to the local backend proxy which forwards them to
 * the Anthropic Messages API server-side. Personas send messages in
 * the format:
 *   [user(system), assistant(greet), …history…, user(question)]
 */
export async function claudeComplete(opts: CompleteOptions): Promise<string> {
  const messages = (opts && opts.messages) || [];
  const max_tokens = (opts && opts.max_tokens) || 1024;

  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, max_tokens }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body.error && body.error.message) ||
      ('Claude proxy error ' + res.status),
    );
  }

  const data = await res.json();
  return (data.content && data.content[0] && data.content[0].text) || '';
}

/**
 * resetClaudeKey — no-op in proxy mode (key lives server-side).
 * Kept for API compatibility with any callers that reference it.
 */
export function resetClaudeKey(): void {
  // Key is managed server-side; nothing to clear in the browser.
}
