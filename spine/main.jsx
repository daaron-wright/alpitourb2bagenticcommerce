/* ============================================================
   Root — lens state, per-lens routing, tweaks
   ============================================================ */
(function () {
  const UI = window.UI;
  const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakButton } = window;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "autonomy": "bounds",
    "openLens": "ops"
  }/*EDITMODE-END*/;

  const DEFAULT_SCREEN = { ops: "brd", cx: "customer" };

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [lens, setLensRaw] = React.useState(t.openLens);
    const [screen, setScreen] = React.useState(DEFAULT_SCREEN[t.openLens]);
    const [collapsed, setCollapsed] = React.useState(false);
    const [toastNode, toast] = UI.useToast();
    // shared cross-lens state for the supply event — one record, both lenses
    const [naphtha, setNaphtha] = React.useState({ secured: false, acked: false, samples: [] });
    const [cxLanding, setCxLanding] = React.useState(null); // e.g. "order" when handed off from operator

    const setLens = React.useCallback((l) => {
      if (l === "cx") { window.location.href = "Dow.com Customer Experience.html?lens=cx"; return; }
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
        toast("Brandt sent insight on the supply event — a new policy proposal is in “Learned from you”.", { label: "Review →", onClick: () => setScreen("learning") });
      }
    }, [naphtha.learned, lens]);

    const common = { setScreen, setLens, toast, autonomy: t.autonomy, naphtha, setNaphtha, cxLanding, setCxLanding, seeCustomer, goLearning };

    return (
      <React.Fragment>
        <UI.AppShell lens={lens} setLens={setLens} screen={screen} setScreen={setScreen} collapsed={collapsed} setCollapsed={setCollapsed}>
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
          <TweakSection label="Open in lens" />
          <TweakRadio label="Lens" value={lens}
            options={[{ value: "ops", label: "Operator" }, { value: "cx", label: "Customer" }]}
            onChange={(v) => { setTweak("openLens", v); setLens(v); }} />
          <TweakSection label="Demo" />
          <TweakButton label="Reset walkthrough" onClick={() => { setLens("ops"); setTweak("autonomy", "bounds"); }} />
        </TweaksPanel>
      </React.Fragment>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
