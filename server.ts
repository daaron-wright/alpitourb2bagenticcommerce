/**
 * server.ts — Production server for alpitour-demo
 *
 * Serves the Vite-built static files from ./dist and exposes a
 * server-side proxy endpoint at POST /api/claude/complete so the
 * browser never needs to hold the Anthropic API key.
 *
 * Usage:
 *   node --import tsx/esm server.ts
 *   (or compiled: node dist-server/server.js)
 *
 * Environment variables:
 *   PORT                  — HTTP port (default 3000)
 *   ANTHROPIC_API_KEY      — Anthropic secret key (required)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT ?? 3000);
const MODEL = 'claude-sonnet-4-6';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ---- MIME types for static file serving ----
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.otf':  'font/otf',
  '.txt':  'text/plain; charset=utf-8',
  '.map':  'application/json',
};

function mime(filePath: string): string {
  return MIME[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';
}

// ---- collect request body as string ----
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// ---- /api/claude/complete handler ----
async function handleClaudeComplete(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body: { messages?: Anthropic.MessageParam[]; max_tokens?: number };
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  const messages = body.messages ?? [];
  const max_tokens = body.max_tokens ?? 1024;

  if (!messages.length) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'messages array is required' }));
    return;
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens,
      messages,
    });

    const text =
      response.content?.[0]?.type === 'text' ? response.content[0].text : '';

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ content: [{ type: 'text', text }] }));
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? 'Anthropic API error';
    res.writeHead(status >= 400 && status < 600 ? status : 500, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ error: { message } }));
  }
}

// ---- static file handler ----
function serveStatic(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  // Strip query string
  const urlPath = (req.url ?? '/').split('?')[0];

  // Try exact file, then index.html fallback (SPA routing)
  const candidates = [
    path.join(DIST, urlPath),
    path.join(DIST, urlPath, 'index.html'),
    path.join(DIST, 'index.html'), // SPA fallback
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      res.writeHead(200, { 'Content-Type': mime(candidate) });
      fs.createReadStream(candidate).pipe(res);
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
}

// ---- main server ----
const server = http.createServer(async (req, res) => {
  // CORS headers (permissive for demo)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url ?? '/';

  if (url.startsWith('/api/claude/complete')) {
    await handleClaudeComplete(req, res);
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[server] WARNING: ANTHROPIC_API_KEY is not set — Claude API calls will fail');
  }
});
