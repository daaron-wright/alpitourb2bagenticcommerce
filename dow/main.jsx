/* ============================================================
   Root — Dow.com routing + ChemAssist orchestration.
   Persona (auto-detected job, demo-forceable) · environment
   (desk/lab/plant) · autonomy · AG-UI overlay · density.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon } = UI;
  const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakButton } = window;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "persona": "explorer",
    "env": "desk",
    "autonomy": "bounds",
    "aguiOverlay": false,
    "density": "comfortable"
  }/*EDITMODE-END*/;

  function RegAlertModal({ a, onClose, onNav, onGoOperator }) {
    const wf = (window.D.agenticWorkflowById || {})["regulatory-change-to-action"];
    const agents = window.D.agenticAgents || {};
    function openPipeline() {
      if (!window.AgenticBus) return;
      window.AgenticBus.set("regulatory-change-to-action");
      onClose();
      setTimeout(() => window.AgenticBus.open(), 60);
    }
    return (
      <div className="dx-modal-scrim" onClick={onClose}>
        <div className="dx-regmodal" onClick={e => e.stopPropagation()}>
          <div className="rh">
            <span className="ri"><Icon name="anomaly" size={17} /></span>
            <div style={{ flex: 1 }}><div className="rk">RegRadar · proactive alert</div><div className="rt">{a.rule}</div></div>
            <button className="rx" onClick={onClose}><Icon name="close" size={16} /></button>
          </div>
          <div className="rb">
            <div className="rgrid">
              <div className="rcell"><span className="k">Jurisdiction</span><span className="v">{a.jurisdiction}</span></div>
              <div className="rcell"><span className="k">Effective</span><span className="v">{a.effective}</span></div>
              <div className="rcell wide"><span className="k">Change</span><span className="v">{a.change}</span></div>
              <div className="rcell wide"><span className="k">Source</span><span className="v mono">{a.version} · published {a.published}</span></div>
            </div>

            <div className="raff">Affects your <b>{a.affects.what}</b> — <a onClick={() => { onClose(); onNav({ name: "case", code: a.affects.case }); }}>{a.affects.case}</a> · {a.affects.product}</div>

            <div className="rimpact"><span className="rlbl">Impact</span><p>{a.impact}</p></div>

            <div className="raction"><span className="ai-glyph" style={{ width: 14, height: 14 }} /><span><b>Recommended action.</b> {a.action}</span></div>

            {wf && (
              <div className="rwf">
                <div className="rwf-h"><span className="rwf-n">{String(wf.n).padStart(2, "0")}</span><span>Produced by the <b>{wf.name}</b> workflow</span></div>
                <div className="rwf-chain">
                  {wf.chain.map((aid, i) => (
                    <React.Fragment key={aid}>
                      <span className="wm-chip" style={{ background: agents[aid].tint, color: agents[aid].c }}><Icon name={agents[aid].icon} size={11} /> {agents[aid].short}</span>
                      {i < wf.chain.length - 1 && <span className="wm-arr">›</span>}
                    </React.Fragment>
                  ))}
                </div>
                <button className="rwf-open" onClick={openPipeline}><Icon name="network" size={13} /> Open in workflow pipeline</button>
              </div>
            )}
          </div>
          <div className="rf">
            <button className="dx-btn red sm" onClick={() => { onClose(); onNav({ name: "case", code: a.affects.case }); }}>Review on the case</button>
            <button className="dx-btn ghost sm" onClick={() => onGoOperator(a.spineScreen, "KAF-9F2A-4471")}><span className="ai-glyph" style={{ width: 13, height: 13 }} /> Open in RegRadar ↗</button>
          </div>
        </div>
      </div>
    );
  }

  function AguiOverlay({ events, onClose }) {
    const ref = React.useRef(null);
    React.useEffect(() => { const el = ref.current; if (el) el.scrollTop = el.scrollHeight; }, [events]);
    return (
      <div className="dx-agui">
        <div className="ah"><span className="ai-glyph" /><b>AG-UI event stream</b><button className="x" onClick={onClose}>×</button></div>
        <div ref={ref}>
          {events.length === 0 && <div className="ev"><span className="ed">Waiting for agent activity…</span></div>}
          {events.map((e, i) => <div className="ev" key={i}><span className="ek">{e.kind}</span><span className="ed">{e.detail}</span><span className="ets">{e.ts}</span></div>)}
        </div>
      </div>
    );
  }

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [route, setRoute] = React.useState({ name: "home" });
    const [agentOpen, setAgentOpen] = React.useState(false);
    const [agentFull, setAgentFull] = React.useState(false);
    const [seed, setSeed] = React.useState(null);
    const [seedKey, setSeedKey] = React.useState(0);
    const [events, setEvents] = React.useState([]);
    const [toastNode, toast] = UI.useToast();
    const [alertOpen, setAlertOpen] = React.useState(false);

    React.useEffect(() => { window.scrollTo(0, 0); }, [route]);

    // deep-link IN from the operator lens (or anywhere): ?screen=… / ?case=… / ?alert=regradar
    React.useEffect(() => {
      const p = new URLSearchParams(window.location.search);
      const screen = p.get("screen"), caseCode = p.get("case");
      if (caseCode) setRoute({ name: "case", code: caseCode });
      else if (screen && ["o2c", "cases", "account", "history", "samplelab"].includes(screen)) setRoute({ name: screen, code: p.get("trace") ? undefined : "CASE-02111" });
      if (p.get("alert") === "regradar") setTimeout(() => setAlertOpen(true), 400);
    }, []);

    const goOperator = React.useCallback((screen, trace) => window.DX.toOperator(screen, trace), []);

    const pushAgui = React.useCallback((kind, detail) => {
      const ts = new Date().toLocaleTimeString("en-GB", { hour12: false });
      setEvents(ev => [...ev.slice(-50), { kind, detail, ts }]);
    }, []);

    const onNav = React.useCallback((r) => { setRoute(r); }, []);
    const onSearch = React.useCallback((query) => { setRoute({ name: "search", query }); }, []);
    const onAskAgent = React.useCallback((s) => {
      const sd = s || { fresh: true };
      if (sd.env) setTweak("env", sd.env);
      if (sd.intent) { const ty = (window.DXA.INTENTS[sd.intent] || {}).type; if (ty) setTweak("persona", ty); }
      setSeed(sd); setSeedKey(k => k + 1); setAgentOpen(true);
    }, [setTweak]);
    const openBlank = React.useCallback(() => { setSeed(null); setSeedKey(k => k + 1); setAgentOpen(true); }, []);
    const closeAgent = React.useCallback(() => { setAgentOpen(false); setAgentFull(false); }, []);
    const setEnv = React.useCallback((v) => setTweak("env", v), [setTweak]);

    const pageProps = { onNav, onSearch, onAskAgent, toast, persona: t.persona };

    return (
      <div className={`dx ${t.density === "compact" ? "compact" : ""}`}>
        <UI.UtilityBar onNav={onNav} onGoOperator={goOperator} onOpenAlert={() => setAlertOpen(true)} />
        <UI.Masthead onNav={onNav} onSearch={onSearch} onAskAgent={onAskAgent} cartCount={2} />

        {route.name === "home" && <UI.Home {...pageProps} />}
        {route.name === "search" && <UI.Search query={route.query} {...pageProps} />}
        {route.name === "product" && <UI.Product id={route.id} {...pageProps} />}
        {route.name === "account" && <UI.Account {...pageProps} />}
        {route.name === "cases" && <UI.CasesHub {...pageProps} />}
        {route.name === "case" && <UI.CaseDetail code={route.code} {...pageProps} />}
        {route.name === "history" && <UI.CaseHistory code={route.code} {...pageProps} />}
        {route.name === "o2c" && <UI.O2C {...pageProps} />}
        {route.name === "samplelab" && <UI.SampleLab code={route.code} {...pageProps} />}

        {!agentOpen && <UI.Launcher onClick={openBlank} />}
        <UI.Agent open={agentOpen} full={agentFull} onClose={closeAgent} onToggleFull={() => setAgentFull(f => !f)}
          onNav={(r) => { onNav(r); if (agentFull) closeAgent(); }} toast={toast}
          intentSeed={seed} seedKey={seedKey} env={t.env} setEnv={setEnv} persona={t.persona} autonomy={t.autonomy} pushAgui={pushAgui} />

        {toastNode}
        {alertOpen && <RegAlertModal a={window.DX.regAlert} onClose={() => setAlertOpen(false)} onNav={onNav} onGoOperator={goOperator} />}
        {t.aguiOverlay && <AguiOverlay events={events} onClose={() => setTweak("aguiOverlay", false)} />}

        <TweaksPanel>
          <TweakSection label="Customer type · job-to-be-done" />
          <TweakRadio label="Active persona" value={t.persona}
            options={window.DX.customerTypes.map(c => ({ value: c.id, label: c.name.replace(" / PO Buyer", "").replace("Plant-Floor ", "").replace(" / Regulatory", "") }))}
            onChange={v => setTweak("persona", v)} />
          <TweakSection label="Environment" />
          <TweakRadio label="Surface" value={t.env}
            options={[{ value: "desk", label: "Desk" }, { value: "lab", label: "Lab" }, { value: "plant", label: "Plant floor" }]}
            onChange={v => setTweak("env", v)} />
          <TweakSection label="Agent autonomy · pilot stage" />
          <TweakRadio label="Mode" value={t.autonomy}
            options={[{ value: "prepare", label: "Prepare-only" }, { value: "bounds", label: "In-bounds" }, { value: "auto", label: "Auto-act" }]}
            onChange={v => setTweak("autonomy", v)} />
          <TweakSection label="Developer view" />
          <TweakToggle label="AG-UI event stream overlay" value={t.aguiOverlay} onChange={v => setTweak("aguiOverlay", v)} />
          <TweakSection label="Density" />
          <TweakRadio label="Display" value={t.density}
            options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]}
            onChange={v => setTweak("density", v)} />
          <TweakSection label="Shortcuts" />
          <TweakButton label="Open ChemAssist" onClick={openBlank} />
          <TweakButton label="My cases" onClick={() => { setRoute({ name: "cases" }); }} />
          <TweakButton label="Back to home" onClick={() => { setRoute({ name: "home" }); }} />
        </TweaksPanel>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
