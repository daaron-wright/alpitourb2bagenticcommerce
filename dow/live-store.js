/* ============================================================
   DXLive — a tiny reactive store so ChemAssist chat actions ripple
   into the rest of the experience (Orders, Sample experiments,
   Case history). Components subscribe with DXLive.use(); chat (and
   the workspaces) call DXLive.dispatch(action, payload).
   ============================================================ */
(function () {
  const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const state = {
    poApproved: false,
    orderStage: null,        // overrides o2c nowStage when set
    invoiceStatus: null,     // 'issued' once approved
    extraOrderEvents: [],    // appended to the O2C live stream
    samples: [],             // [{grade, code, status, caseCode}]
    evidence: {},            // caseCode -> [{round, result, ts}]
    events: {},              // caseCode -> [history timeline events]
  };

  const subs = new Set();
  function emit() { subs.forEach(f => { try { f(); } catch (e) {} }); }
  function pushEvent(cc, ev) { (state.events[cc] = state.events[cc] || []).push(ev); }

  const ACTIONS = {
    "po.approve": (p) => {
      const cc = p.caseCode || "CASE-02111";
      state.poApproved = true;
      state.orderStage = 5;            // advance the O2C spine to "Invoiced"
      state.invoiceStatus = "issued";
      state.extraOrderEvents.push({
        ts: now(), icon: "checkmark-filled", chan: "portal", tone: "ok",
        title: "PO approved in ChemAssist",
        detail: `${p.po || "PO-48261"} approved by you — routed to your Dow rep to place. Fulfilment and the invoice are now tracked automatically.`,
        chain: ["concierge", "deal", "credit"],
      });
      pushEvent(cc, {
        t: now(), date: "Today", stage: "PO", channel: "portal", actor: "you", icon: "checkmark-filled",
        title: "Approved the PO in ChemAssist", detail: `${p.po || "PO-48261"} approved — routed to Dow sales to place on your behalf.`,
        policy: "PAC: least-privilege — placement routed to Dow sales",
      });
    },
    "sample.evidence": (p) => {
      const cc = p.caseCode || "CASE-02111";
      (state.evidence[cc] = state.evidence[cc] || []).push({ round: p.round || 1, result: p.result || "Test data attached", ts: now() });
      pushEvent(cc, {
        t: now(), date: "Today", stage: "Test", channel: "portal", actor: "you", icon: "document-chart",
        title: "Added test evidence in ChemAssist", detail: p.result || "Test data attached to the sample experiment.",
      });
    },
    "sample.order": (p) => {
      const cc = p.caseCode || "CASE-02111";
      state.samples.push({ grade: p.grade || "INFUSE™ 9107", code: "SR-" + (20602 + state.samples.length), status: "Ordered", caseCode: cc });
      pushEvent(cc, {
        t: now(), date: "Today", stage: "Sample", channel: "portal", actor: "chemassist", icon: "lightbulb",
        title: "Next-round sample ordered", detail: `${p.grade || "INFUSE™ 9107"} — added to the experiment and tracked.`,
      });
    },
  };

  window.DXLive = {
    get() { return state; },
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    dispatch(action, payload) { const fn = ACTIONS[action]; if (fn) { fn(payload || {}); emit(); } },
    // React hook — re-renders the caller on any dispatch
    use() {
      const R = window.React;
      const [, force] = R.useState(0);
      R.useEffect(() => window.DXLive.subscribe(() => force(n => n + 1)), []);
      return state;
    },
  };
})();
