/* ============================================================
   Entry point · EasyBook Next — Travel Assistant Workbench
   ============================================================ */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/travel/easybook/App';
import '@/travel/easybook/tokens.css';
import '@/travel/easybook/styles-shell.css';
import '@/travel/easybook/styles-work.css';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
