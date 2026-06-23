/* ============================================================
   AgenticBus — a tiny shared store for the "active workflow".
   Lets RegRadar, the spine matrix and the floating pipeline stay
   in sync, and persists across the operator + customer apps.
   ============================================================ */
(function () {
  const KEY = "alpitour.agentic.activeWf";
  let active = null;
  try { active = localStorage.getItem(KEY); } catch (e) {}
  if (!active) active = "disruption-to-reaccommodation";
  const subs = new Set();
  const openSubs = new Set();
  window.AgenticBus = {
    get() { return active; },
    set(id) {
      if (!id || id === active) return;
      active = id;
      try { localStorage.setItem(KEY, id); } catch (e) {}
      subs.forEach(fn => { try { fn(id); } catch (e) {} });
    },
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    open() { openSubs.forEach(fn => { try { fn(); } catch (e) {} }); },
    onOpen(fn) { openSubs.add(fn); return () => openSubs.delete(fn); },
  };
  // Cross-tab realtime: when the customer front-end (another tab/app) sets the
  // active workflow, propagate it here so the operator pipeline updates live.
  try {
    window.addEventListener("storage", function (e) {
      if (e.key === KEY && e.newValue && e.newValue !== active) {
        active = e.newValue;
        subs.forEach(fn => { try { fn(active); } catch (err) {} });
      }
    });
  } catch (e) {}
})();
