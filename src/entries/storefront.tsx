/* ============================================================
   Entry point · EasyBook Next — B2B Storefront
   Mounts the same storefront App as the guided demo, but without
   seeding the bus with a handoff — so it opens in "fresh" state.
   ============================================================ */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/alpitour/storefront/App';
import '@/shared/image-slot';
import 'leaflet/dist/leaflet.css';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
