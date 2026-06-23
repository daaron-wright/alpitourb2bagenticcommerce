/* ============================================================
   AgenticBus — a tiny shared store for the "active workflow".
   Lets RegRadar, the spine matrix and the floating pipeline stay
   in sync, and persists across the operator + customer apps.
   ============================================================ */

const KEY = "alpitour.agentic.activeWf";
let active: string | null = null;
try { active = localStorage.getItem(KEY); } catch (e) {}
if (!active) active = "disruption-to-reaccommodation";

const subs = new Set<(id: string) => void>();
const openSubs = new Set<() => void>();

export const AgenticBus = {
  get(): string { return active as string; },
  set(id: string) {
    if (!id || id === active) return;
    active = id;
    try { localStorage.setItem(KEY, id); } catch (e) {}
    subs.forEach(fn => { try { fn(id); } catch (e) {} });
  },
  subscribe(fn: (id: string) => void): () => void { subs.add(fn); return () => subs.delete(fn); },
  open() { openSubs.forEach(fn => { try { fn(); } catch (e) {} }); },
  onOpen(fn: () => void): () => void { openSubs.add(fn); return () => openSubs.delete(fn); },
};

// Cross-tab realtime: when the customer front-end (another tab/app) sets the
// active workflow, propagate it here so the operator pipeline updates live.
try {
  window.addEventListener("storage", function (e: StorageEvent) {
    if (e.key === KEY && e.newValue && e.newValue !== active) {
      active = e.newValue;
      subs.forEach(fn => { try { fn(active as string); } catch (err) {} });
    }
  });
} catch (e) {}
