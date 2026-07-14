/* ============================================================
   Entry point · Travel Assistant 2.0 Guided Demo
   Mounts the storefront App to #root and seeds the PlatformBus
   handoff (replaces inline script in Travel Assistant 2.0 - Guided Demo.html).
   ============================================================ */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/travel/storefront/App';
import { PersonaDock } from '@/travel/storefront/PersonaDock';
import { bus } from '@/shared/bus';
import '@/shared/image-slot';

// Seed the PlatformBus with an initial handoff state
// so the desk shows "Family A inquiry in progress" on load.
bus.emit('handoff', true);
bus.emit('brief', {
  answers: [
    { q: 'Destination', v: 'United Kingdom · London, Bath, Cornwall' },
    { q: 'Duration', v: '10 nights' },
    { q: 'Travel dates', v: '12–22 August 2026' },
    { q: 'Party', v: '2 adults + 1 child (age 2)' },
    { q: 'Budget', v: '≤ CA$11,000' },
    { q: 'Priorities', v: 'Family rooms · air-con · short transfers' },
  ],
});

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
      <PersonaDock />
    </React.StrictMode>
  );
}
