import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import type { Plugin, Connect } from 'vite';
import Anthropic from '@anthropic-ai/sdk';

// ---- Dev-server plugin: proxies /api/claude/complete to Anthropic ----
// This runs only during `vite dev` so the browser never needs the API key.
function claudeApiPlugin(): Plugin {
  const MODEL = 'claude-sonnet-4-6';

  return {
    name: 'claude-api-proxy',
    configureServer(server) {
      server.middlewares.use(
        '/api/claude/complete',
        async (
          req: Connect.IncomingMessage,
          res: import('node:http').ServerResponse,
          next: Connect.NextFunction,
        ) => {
          if (req.method !== 'POST') { next(); return; }

          const chunks: Buffer[] = [];
          req.on('data', (c: Buffer) => chunks.push(c));
          req.on('end', async () => {
            let body: { messages?: Anthropic.MessageParam[]; max_tokens?: number };
            try {
              body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              return;
            }

            const apiKey = process.env.VITE_ANTHROPIC_API_KEY;
            if (!apiKey) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: { message: 'VITE_ANTHROPIC_API_KEY is not set on the server' } }));
              return;
            }

            const client = new Anthropic({ apiKey });
            try {
              const response = await client.messages.create({
                model: MODEL,
                max_tokens: body.max_tokens ?? 1024,
                messages: body.messages ?? [],
              });
              const text =
                response.content?.[0]?.type === 'text'
                  ? response.content[0].text
                  : '';
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ content: [{ type: 'text', text }] }));
            } catch (err: any) {
              const status = err?.status ?? 500;
              res.writeHead(status >= 400 && status < 600 ? status : 500, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({ error: { message: err?.message ?? 'Anthropic API error' } }));
            }
          });
        },
      );
    },
  };
}

// https://vitejs.dev/config/
// NOTE: Only HTML files that have been migrated to Vite ESM are included.
// Legacy CDN/Babel HTML files are kept in the repo but not built by Vite —
// they continue to be served as static files. Add them here as they are migrated.
export default defineConfig({
  plugins: [react(), claudeApiPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    // Inline small assets; don't inline large external CSS
    preprocessorOptions: {},
  },
  build: {
    rollupOptions: {
      input: {
        // Root — AlpiGPT 2.0 Guided Demo (served at /)
        'index': resolve(__dirname, 'index.html'),
        // AlpiGPT Guided Demo (also reachable by filename)
        'guided-demo': resolve(__dirname, 'AlpiGPT 2.0 - Guided Demo.html'),
        // Synthetic Cohort — separate deployment
        'cohort': resolve(__dirname, 'Alpitour Synthetic Cohort.html'),
        // Additional migrated apps will be added here as they are completed:
        // 'storefront': resolve(__dirname, 'EasyBook Next - B2B Storefront.html'),
        // 'easybook': resolve(__dirname, 'EasyBook Next - AlpiGPT Workbench.html'),
        // 'platform': resolve(__dirname, 'Alpitour Platform.html'),
        // 'cohort': resolve(__dirname, 'Alpitour Synthetic Cohort.html'),
        // 'frontdoor': resolve(__dirname, 'Alpitour.it - AlpiGPT Front Door.html'),
        // 'frontdoor-simple': resolve(__dirname, 'Alpitour.it - Customer Front Door (Simple).html'),
        // 'concierge': resolve(__dirname, 'AlpiGPT B2B Concierge PoC.html'),
        // 'concierge-v2': resolve(__dirname, 'AlpiGPT B2B Concierge v2.html'),
        // 'spine': resolve(__dirname, 'Alpitour Operations on KAF.html'),
        // 'dow-spine': resolve(__dirname, 'Dow Supply Chain on KAF.html'),
        // 'dow': resolve(__dirname, 'Dow.com Customer Experience.html'),
        // 'dow-o2c': resolve(__dirname, 'Dow Sample-to-Ship Orchestration.html'),
        // 'proposal': resolve(__dirname, 'Bianchi Proposal - Customer View.html'),
        // 'proposal-v1': resolve(__dirname, 'Bianchi Proposal - Customer View v1.html'),
        // 'deck': resolve(__dirname, 'Alpitour AlpiGPT 2.0 - Deck.html'),
        // 'flows': resolve(__dirname, 'Alpitour AlpiGPT 2.0 - Flows & Agentic Inventory.html'),
      },
    },
  },
});
