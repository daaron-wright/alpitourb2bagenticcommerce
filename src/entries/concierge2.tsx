/* ============================================================
   Entry point · AlpiGPT B2B Concierge v2
   ============================================================ */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/alpitour/concierge2/App';
import '@/alpitour/concierge2/styles.css';
import '@/shared/image-slot';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
