/* ============================================================
   Entry point · Alpitour Platform — one trip, two sides
   Mounts the traveler (B2C) app to #b2c-root and the agent
   (B2B) storefront App to #root, and wires the PlatformBus
   thread label + cross-view toast in the top bar.
   ============================================================ */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TravelerApp } from '@/alpitour/platform/Traveler';
import { App as StorefrontApp } from '@/alpitour/storefront/App';
import { bus } from '@/shared/bus';
import '@/shared/image-slot';
import 'leaflet/dist/leaflet.css';
import '@/alpitour/platform/traveler.css';

/* ---------- mount B2C traveler view ---------- */
const b2cRoot = document.getElementById('b2c-root');
if (b2cRoot) {
  createRoot(b2cRoot).render(<TravelerApp />);
}

/* ---------- mount B2B storefront view ---------- */
const b2bRoot = document.getElementById('root');
if (b2bRoot) {
  createRoot(b2bRoot).render(<StorefrontApp />);
}

/* ---------- pane switcher (static HTML chrome) ---------- */
(function () {
  const panes = {
    b2c: document.getElementById('pane-b2c'),
    b2b: document.getElementById('pane-b2b'),
  } as Record<string, HTMLElement | null>;
  const btns = {
    b2c: document.getElementById('pl-b2c'),
    b2b: document.getElementById('pl-b2b'),
  } as Record<string, HTMLElement | null>;
  let active = 'b2c';

  function show(which: string) {
    active = which;
    Object.keys(panes).forEach((k) => {
      panes[k]?.classList.toggle('on', k === which);
      btns[k]?.classList.toggle('on', k === which);
      btns[k]?.setAttribute('aria-selected', String(k === which));
    });
    window.dispatchEvent(new Event('resize'));
  }

  btns.b2c?.addEventListener('click', () => show('b2c'));
  btns.b2b?.addEventListener('click', () => show('b2b'));

  /* thread label */
  const txt = document.getElementById('pl-thread-txt');
  const chip = document.getElementById('pl-thread');
  function renderThread(s: any) {
    let m = 'Thread: Famiglia Bianchi — inquiry not sent yet';
    if (s.handoff) { m = 'Thread: Bianchi — handed to Rossi Travel'; chip?.classList.add('live'); }
    if (s.accepted) m = 'Thread: Bianchi — Giulia is working it';
    if (s.hold) m = `Thread: Bianchi — hold ${s.hold.ref} until ${s.hold.until}`;
    if (s.proposal) m = 'Thread: Bianchi — proposal sent to the family';
    if (s.v2) m = `Thread: Bianchi — V2 · €${s.v2.total.toLocaleString('it-IT')}`;
    if (txt) txt.textContent = m;
  }
  bus.on(renderThread);

  /* cross-view toast */
  let toastEl: HTMLElement | null = null;
  let toastT: any = null;
  bus.on(function (s: any, key?: string) {
    if (key !== 'feed' || !s.feed.length) return;
    const item = s.feed[s.feed.length - 1];
    const otherSide = (item.who === 'traveler' && active === 'b2b') || (item.who === 'agent' && active === 'b2c');
    if (!otherSide) return;
    if (toastEl) toastEl.remove();
    toastEl = document.createElement('div');
    toastEl.className = 'pl-toast';
    const who = document.createElement('span');
    who.className = 'who ' + (item.who === 'traveler' ? 'tv' : 'ag');
    who.textContent = item.who === 'traveler' ? 'Alpitour.it · live' : 'EasyBook · Giulia';
    const tx = document.createElement('span');
    tx.textContent = item.t;
    toastEl.appendChild(who); toastEl.appendChild(tx);
    document.body.appendChild(toastEl);
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl && toastEl.remove(); toastEl = null; }, 4200);
  });
})();
