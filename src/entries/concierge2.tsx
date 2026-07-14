/* ============================================================
   Entry point · Travel Assistant B2B Concierge v2
   ============================================================ */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/travel/concierge2/App';
import '@/travel/concierge2/styles.css';
import '@/shared/image-slot';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
