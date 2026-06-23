/* ============================================================
   Entry point · EasyBook Next — AlpiGPT Workbench
   ============================================================ */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/alpitour/easybook/App';
import '@/alpitour/easybook/tokens.css';
import '@/alpitour/easybook/styles-shell.css';
import '@/alpitour/easybook/styles-work.css';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
