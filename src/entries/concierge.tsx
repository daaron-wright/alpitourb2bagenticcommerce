/* ============================================================
   Entry point · AlpiGPT B2B Concierge PoC
   ============================================================ */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/alpitour/concierge/App';
import '@/alpitour/concierge/styles.css';
import '@/shared/image-slot';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
