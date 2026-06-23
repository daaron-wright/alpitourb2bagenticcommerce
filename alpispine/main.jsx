/* ============================================================
   Root — lens state, per-lens routing, tweaks
   ============================================================ */
(function () {
  const UI = window.UI;
  const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakButton } = window;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "autonomy": "bounds",
    "openLens": "ops",
    "severity": "high",
    "season": "summer"
  }/*EDITMODE-END*/;

  const DEFAULT_SCREEN = { ops: "brd", cx: "customer" };

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [lens, setLensRaw] = React.useState(t.openLens);
    const [screen, setScreen] = React.useState(DEFAULT_SCREEN[t.openLens]);
    const [collapsed, setCollapsed] = React.useState(false);
    const [toastNode, toast] = UI.useToast();
    // shared cross-lens state for the disruption event — one record, both lenses
    const [naphtha, setNaphtha] = React.useState({ secured: false, acked: false, samples: [] });
    const [cxLanding, setCxLanding] = React.useState(null); // e.g. "order" when handed off from operator
    const [dataRev, setDataRev] = React.useState(0); // bumps when a scenario tweak patches window.D

    // --- Tweak: disruption severity (patches the live record) ---
    React.useEffect(() => {
      const D = window.D; if (!D) return;
      const crit = t.severity === "critical";
      D.event.severity = crit ? "critical" : "high";
      D.event.blast = crit ? "31 departures · 3 resorts · 2 carriers · 4 agencies" : "14 departures · 2 resorts · 1 carrier · 1 strategic agency";
      D.event.trigger = crit ? "Hotelier signal · full resort closure, August allotment cut 100%" : "Hotelier signal · West-wing closure, August allotment cut 40%";
      const q = D.queue.find(x => x.primary);
      if (q) { q.sev = crit ? "critical" : "high"; q.val = crit ? "€3.1M" : "€1.4M"; q.why = crit ? "31 departures pushed to margin floor by a full resort closure" : "14 departures pushed to margin floor by a resort wing closure"; }
      setDataRev(r => r + 1);
    }, [t.severity]);

    // --- Tweak: season scenario (patches the operator KPI strip) ---
    React.useEffect(() => {
      const D = window.D; if (!D) return;
      const shoulder = t.season === "shoulder";
      D.kpis[0] = shoulder
        ? { label: "Allotment fill rate", value: "73.8%", delta: "+1.0", dir: "up", good: true, sub: "shoulder season · 12-wk" }
        : { label: "Allotment fill rate", value: "86.4%", delta: "+2.1", dir: "up", good: true, sub: "summer programme · 12-wk" };
      D.kpis[1] = shoulder
        ? { label: "Refund exposure avoided", value: "€0.4M", delta: "+€30k", dir: "up", good: true, sub: "shoulder season · re-accommodation" }
        : { label: "Refund exposure avoided", value: "€1.2M", delta: "+€80k", dir: "up", good: true, sub: "season to date · re-accommodation" };
      setDataRev(r => r + 1);
    }, [t.season]);

    // --- Live FE thread (Alpitour Platform.html) → operator toasts ---
    const lastThreadKey = React.useRef(null);
    React.useEffect(() => {
      if (!window.SpineSync) return;
      const MSG = {
        handoff: "Alpitour.it · live — the Bianchi family sent their inquiry to Rossi Travel.",
        brief: "Alpitour.it · live — AlpiGPT structured the family's brief into requirements.",
        accepted: "EasyBook · live — Giulia accepted the Bianchi thread and is working it.",
        hold: "EasyBook · live — a hold was placed on the Bianchi booking.",
        proposal: "EasyBook · live — the proposal went out to the family.",
        v2: "EasyBook · live — V2 proposal sent — the spine repriced it in bounds.",
      };
      return window.SpineSync.onThread((s) => {
        if (!s || !s.key || !MSG[s.key]) return;
        if (lastThreadKey.current === s.key + s.at) return;
        lastThreadKey.current = s.key + s.at;
        toast(MSG[s.key], { label: "Open the pipeline →", onClick: () => { try { window.AgenticBus && window.AgenticBus.open(); } catch (e) {} } });
      });
    }, []);

    // --- Spine → FE: announce planner actions on the shared thread ---
    const announced = React.useRef({});
    React.useEffect(() => {
      if (!window.SpineSync) return;
      if (naphtha.secured && !announced.current.secured) {
        announced.current.secured = true;
        window.SpineSync.announce({ t: "Tour-ops spine · rooms re-secured from the BravoClub guaranteed block — the Bianchi 14-Aug dates hold (TRC-2026-0810)." });
      }
      if (naphtha.acked && !announced.current.acked) {
        announced.current.acked = true;
        window.SpineSync.announce({ t: "Tour-ops spine · the secured plan was accepted — audit sealed on TRC-2026-0810." });
      }
    }, [naphtha.secured, naphtha.acked]);

    const setLens = React.useCallback((l) => {
      if (l === "cx") { window.location.href = "Alpitour Platform.html?lens=cx"; return; }
      setLensRaw(l);
      setScreen(DEFAULT_SCREEN[l]);
    }, []);

    // deep-link IN: ?lens=ops&screen=…&trace=…
    React.useEffect(() => {
      const p = new URLSearchParams(window.location.search);
      const s = p.get("screen");
      const valid = ["brd","spine","ontology","flow","governance","backtest","queue","learning","controls","o2c","udp"];
      if (p.get("lens") === "ops" && s && valid.includes(s)) { setLensRaw("ops"); setScreen(s); }
    }, []);

    const go = React.useCallback((l, s) => {
      setLensRaw(l);
      setScreen(s);
    }, []);

    // operator → customer hand-off: land on the matching order-status view
    const seeCustomer = React.useCallback(() => { setCxLanding("order"); setLensRaw("cx"); setScreen("customer"); }, []);
    // customer → operator: land on the Learned from you page
    const goLearning = React.useCallback(() => { setLensRaw("ops"); setScreen("learning"); }, []);

    // one-time operator notification when the customer provides PAC insight
    const notifiedLearn = React.useRef(false);
    React.useEffect(() => {
      if (naphtha.learned && lens === "ops" && !notifiedLearn.current) {
        notifiedLearn.current = true;
        toast("Rossi Travel sent insight on the resort event — a new policy proposal is in “Learned from you”.", { label: "Review →", onClick: () => setScreen("learning") });
      }
    }, [naphtha.learned, lens]);

    const common = { setScreen, setLens, toast, autonomy: t.autonomy, naphtha, setNaphtha, cxLanding, setCxLanding, seeCustomer, goLearning };

    return (
      <React.Fragment>
        <UI.AppShell key={dataRev} lens={lens} setLens={setLens} screen={screen} setScreen={setScreen} collapsed={collapsed} setCollapsed={setCollapsed}>
          {lens === "ops" && screen === "brd" && <UI.ScreenBrd {...common} />}
          {lens === "ops" && screen === "spine" && <UI.ScreenSpine {...common} />}
          {lens === "ops" && screen === "ontology" && <UI.ScreenOntology {...common} />}
          {lens === "ops" && screen === "flow" && <UI.ScreenFlow {...common} />}
          {lens === "ops" && screen === "governance" && <UI.ScreenGovernance {...common} />}
          {lens === "ops" && screen === "backtest" && <UI.ScreenBacktest {...common} />}
          {lens === "ops" && screen === "queue" && <UI.ScreenQueue {...common} />}
          {lens === "ops" && screen === "learning" && <UI.ScreenLearning {...common} />}
          {lens === "ops" && screen === "controls" && <UI.ScreenControls {...common} />}
          {lens === "ops" && screen === "o2c" && <UI.ScreenO2C {...common} />}
          {lens === "ops" && screen === "udp" && <UI.ScreenUDP {...common} />}
          {lens === "cx" && screen === "customer" && <UI.ScreenCustomer {...common} />}
        </UI.AppShell>

        {toastNode}

        {lens === "ops" && <UI.NbaRail go={go} toast={toast} naphtha={naphtha} />}
        {lens === "ops" && <UI.AgenticPipeline />}

        <TweaksPanel>
          <TweakSection label="Agent autonomy · pilot stage" />
          <TweakRadio label="Mode" value={t.autonomy}
            options={[{ value: "readonly", label: "Read-only" }, { value: "bounds", label: "In-bounds" }, { value: "gated", label: "Planner-gated" }]}
            onChange={(v) => setTweak("autonomy", v)} />
          <TweakSection label="Scenario" />
          <TweakRadio label="Season" value={t.season}
            options={[{ value: "summer", label: "Summer peak" }, { value: "shoulder", label: "Shoulder" }]}
            onChange={(v) => setTweak("season", v)} />
          <TweakRadio label="Disruption severity" value={t.severity}
            options={[{ value: "high", label: "High" }, { value: "critical", label: "Critical" }]}
            onChange={(v) => setTweak("severity", v)} />
          <TweakSection label="Open in lens" />
          <TweakRadio label="Lens" value={lens}
            options={[{ value: "ops", label: "Operator" }, { value: "cx", label: "Customer" }]}
            onChange={(v) => { setTweak("openLens", v); setLens(v); }} />
          <TweakSection label="Demo" />
          <TweakButton label="Reset walkthrough" onClick={() => { setLens("ops"); setTweak("autonomy", "bounds"); setTweak("severity", "high"); setTweak("season", "summer"); }} />
        </TweaksPanel>
      </React.Fragment>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
