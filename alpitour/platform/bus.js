/* ============================================================
   Alpitour Platform · shared trip thread (window.PlatformBus)
   One Bianchi thread, two lenses: traveler (Alpitour.it) and
   agent (EasyBook Next). In-memory pub/sub — demo theatre.
   ============================================================ */
(function () {
  if (window.PlatformBus) return;
  window.PlatformBus = {
    state: {
      handoff: false,   // traveler sent the inquiry to the agency
      accepted: false,  // Giulia accepted the handoff
      hold: null,       // { ref, until, total }
      v2: null,         // { total, window }
      proposal: null,   // { file }
      brief: null,      // { answers: [{k,v}], cluster, conf } — built by the traveler Q&A
      feed: [],         // [{ who: 'traveler'|'agent', t, ts }] — live two-way activity
    },
    subs: [],
    emit(key, val) {
      this.state[key] = val === undefined ? true : val;
      this.subs.forEach((f) => { try { f(this.state, key); } catch (e) {} });
    },
    on(f) {
      this.subs.push(f);
      return () => { this.subs = this.subs.filter((x) => x !== f); };
    },
    push(key, item) {
      const now = new Date();
      const ts = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
      this.emit(key, [...(this.state[key] || []), { ...item, ts }]);
    },
  };

  /* ---- cross-app bridge: Alpitour Operations on KAF (the spine) ----
     Live, two-way, via localStorage storage events. State is written on
     every emit (so other OPEN tabs stay in sync) but never hydrated on
     load — each fresh load starts the demo clean. */
  var THREAD_KEY = "alpitour.platform.thread";
  var SPINE_KEY = "alpitour.spine.event";
  var WF_KEY = "alpitour.agentic.activeWf";
  // FE milestone → the spine workflow it lights up in the Agentic Pipeline
  var WF_FOR = { handoff: "inquiry-to-requirements", brief: "context-to-persona", accepted: "search-to-recommend", hold: "hold-to-booking", proposal: "quote-to-proposal", v2: "modification-self-service" };
  var _emit = window.PlatformBus.emit.bind(window.PlatformBus);
  window.PlatformBus.emit = function (key, val) {
    _emit(key, val);
    try { localStorage.setItem(THREAD_KEY, JSON.stringify({ state: this.state, key: key, at: Date.now() })); } catch (e) {}
    if (WF_FOR[key]) { try { localStorage.setItem(WF_KEY, WF_FOR[key]); } catch (e) {} }
  };
  // spine → FE: planner actions surface as live feed items (toast)
  try {
    window.addEventListener("storage", function (e) {
      if (e.key !== SPINE_KEY || !e.newValue) return;
      var evt = null; try { evt = JSON.parse(e.newValue); } catch (err) {}
      if (evt && evt.t) window.PlatformBus.push("feed", { who: "agent", t: evt.t });
    });
  } catch (e) {}
})();
