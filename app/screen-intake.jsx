/* ============================================================
   Screen — Intent capture (HERO). 3 layout variations: A/B/C
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Badge, Packet, AgentStatusBar, StepTimeline, ToolCallCard, Button, SourceAttribution, Eyebrow } = UI;

  const BRIEF = `Meridian needs a cold-weather TPO for the NA-2027 front bumper fascia — hard TPO, injection molded at-press. Priority is superior impact with −40 °C ductility so we can down-gauge the wall and save weight. Ship to their Saltillo plant, ~18 t qualification lot, need it by mid-July.`;

  function useAgentRun(steps) {
    const [phase, setPhase] = React.useState("idle"); // idle | running | done
    const [idx, setIdx] = React.useState(0);
    const timers = React.useRef([]);
    const run = React.useCallback(() => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setPhase("running"); setIdx(0);
      const n = steps.length;
      for (let i = 1; i <= n; i++) {
        timers.current.push(setTimeout(() => setIdx(i), i * 720));
      }
      timers.current.push(setTimeout(() => setPhase("done"), n * 720 + 500));
    }, [steps.length]);
    React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
    return { phase, idx, run, setPhase };
  }

  function ExtractedFields({ k }) {
    const fields = [
      { l: "Customer", v: k.customer, icon: "group" },
      { l: "Ship-to", v: k.shipTo, icon: "network" },
      { l: "Program", v: k.program },
      { l: "Application", v: k.application },
      { l: "Process", v: k.process },
      { l: "Quantity", v: k.quantity },
      { l: "Requested date", v: k.requestedDate },
      { l: "Incoterm", v: k.incoterm },
    ];
    return (
      <div className="field-grid">
        {fields.map((f, i) => (
          <div className="field" key={i}>
            <span className="fl">{f.icon && <Icon name={f.icon} size={14} style={{ color: "var(--fg-subtle)" }} />}{f.l}</span>
            <span className="fv">{f.v}</span>
          </div>
        ))}
        <div className="field span2">
          <span className="fl">Performance priorities</span>
          <div className="rec-tags" style={{ margin: "2px 0 0" }}>
            {k.priorities.map((p, i) => <Badge key={i} tone="spruce">{p}</Badge>)}
          </div>
        </div>
      </div>
    );
  }

  function Completeness({ pct }) {
    return (
      <div>
        <div className="completeness">
          <div className="comp-bar"><div className="comp-fill" style={{ width: pct + "%" }} /></div>
          <span className="tnum" style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--fg-1)" }}>{pct}%</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 6 }}>
          {pct === 100 ? "All required fields extracted — intent packet ready for triage" : "Extracting structured criteria…"}
        </div>
      </div>
    );
  }

  function ResultTiles({ done, goPolicy, goRec }) {
    const k = window.DATA.kase;
    return (
      <div className="grid-3">
        <div className="feas-card" style={{ background: "var(--k-status-success-10)", border: "1px solid var(--k-status-success-20)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="eyebrow" style={{ color: "var(--k-status-success-110)" }}>Feasibility</span>
            <Icon name="checkmark-filled" size={16} style={{ color: "var(--k-status-success-100)" }} />
          </div>
          <div className="fc-val" style={{ color: "var(--k-status-success-110)" }}>Feasible</div>
          <div style={{ fontSize: 11.5, color: "var(--k-status-success-110)", marginTop: 2 }}>4 ENGAGE grades match · stock available</div>
          <span className="spruce-link" style={{ fontSize: 11.5, marginTop: 8, display: "inline-block", color: "var(--k-status-success-110)" }} onClick={goRec}>View recommendation →</span>
        </div>
        <div className="feas-card" style={{ background: "var(--k-status-warning-10)", border: "1px solid var(--k-status-warning-20)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="eyebrow" style={{ color: "var(--k-status-warning-110)" }}>Policy precheck</span>
            <Icon name="warning-alt" size={16} style={{ color: "var(--k-status-warning-100)" }} />
          </div>
          <div className="fc-val" style={{ color: "var(--k-status-warning-110)" }}>1 review</div>
          <div style={{ fontSize: 11.5, color: "var(--k-status-warning-110)", marginTop: 2 }}>PFAS attestation · new ship-to</div>
          <span className="spruce-link" style={{ fontSize: 11.5, marginTop: 8, display: "inline-block", color: "var(--k-status-warning-110)" }} onClick={goPolicy}>Open policy gate →</span>
        </div>
        <div className="predict-hero">
          <span className="ph-lbl">Predicted delivery</span>
          <div className="ph-date">08-Jul</div>
          <div style={{ fontSize: 11.5, opacity: .85, marginTop: 2 }}>2 days ahead of the 10-Jul request</div>
          <div style={{ fontSize: 10.5, opacity: .7, marginTop: 8, fontFamily: "var(--font-mono)" }}>2d lab prep · DAP Saltillo transit</div>
        </div>
      </div>
    );
  }

  // ---------- Layout A · Split ----------
  function LayoutA({ run, ui }) {
    const k = window.DATA.kase;
    const done = run.phase === "done";
    return (
      <div className="intake-split">
        <div className="stack">
          <UI.Panel title="Rep brief" meta="natural language → structured intent" pad={true}>
            <textarea className="brief-input" rows={5} defaultValue={BRIEF} />
            <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
              <Button variant="dark" icon="chat-bot" onClick={run.run}>{done ? "Re-capture intent" : "Capture intent"}</Button>
              <span style={{ fontSize: 11.5, color: "var(--fg-muted)" }}>or paste an email, quote request, or portal form</span>
            </div>
          </UI.Panel>

          {run.phase !== "idle" && (
            <div className="fade-in">
              <AgentStatusBar
                state={done ? "done" : "thinking"}
                label={done ? "Intent captured · 5 steps in 4.1s" : "ChemAssist · qualifying the order"}
                meta={done ? "2 tools · 1 policy precheck · 0 errors" : `step ${run.idx} of ${window.DATA.agentSteps.length}`}
                controls={true} onPause={() => {}} onCancel={() => {}}
              />
            </div>
          )}

          {done && (
            <UI.Panel className="fade-in" head={<><Packet>Intent packet</Packet><span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg-1)", marginLeft: 8 }}>Extracted criteria</span></>} meta="OC-2026-04817">
              <ExtractedFields k={k} />
            </UI.Panel>
          )}
        </div>

        <div className="stack" style={{ position: "sticky", top: 0 }}>
          <UI.Panel title="Agent run" pad={true}>
            <StepTimeline steps={window.DATA.agentSteps.map((s, i) => ({
              ...s, state: run.phase === "idle" ? "pending" : i < run.idx ? "done" : i === run.idx ? "active" : "pending",
            }))} />
          </UI.Panel>
          {done && (
            <div className="fade-in">
              <Eyebrow>Completeness</Eyebrow>
              <div style={{ height: 8 }} />
              <Completeness pct={100} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- Layout B · Conversational ----------
  function LayoutB({ run, ui }) {
    const k = window.DATA.kase;
    const done = run.phase === "done";
    return (
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <AgentStatusBar
          state={done ? "done" : run.phase === "idle" ? "thinking" : "thinking"}
          label={done ? "Done · intent packet ready" : "ChemAssist · qualifying the order"}
          meta={done ? "2 tools · 1 precheck" : `step ${Math.max(run.idx, 0)} of 5`}
          onPause={() => {}} onCancel={() => {}}
        />
        <div style={{ height: 16 }} />
        <div className="stream">
          <div className="msg user"><div className="bubble">{BRIEF}</div></div>

          {run.phase !== "idle" && (
            <React.Fragment>
              {run.idx >= 2 && <ToolCallCard state="ok" title="Matched" tool="catalog.match" meta="4 ENGAGE grades · cold-weather fascia profile" statusText="OK · used in fit" />}
              {run.idx >= 3 && <ToolCallCard state="ok" title="Evaluated" tool="policy.evaluate" meta="bundle v4.2.1 · 4 rules · 1 review" statusText="OK · amber" />}
            </React.Fragment>
          )}

          {done && (
            <div className="msg fade-in">
              <div className="av-dot" />
              <div>
                <div className="bubble">
                  I've turned the brief into a structured intent packet for <strong>{k.customer}</strong>. This reads as a <span className="hl">hard-TPO injection-molded fascia</span> with a <span className="hl">−40 °C impact priority</span> and a lightweighting goal — so I prioritised cold-weather impact grades. Stock is available and I can hit <strong>08-Jul</strong>, two days ahead of the request. One policy item needs review.
                </div>
                <div className="snap">
                  <div className="ico"><Icon name="recommend" size={16} /></div>
                  <div><p className="t">ENGAGE XLT 8677 · 94% confidence</p><p className="s">superior impact · −40 °C · thin-wall</p></div>
                  <span className="arr">View fit →</span>
                </div>
                <div className="snap" style={{ background: "linear-gradient(135deg, rgba(230,138,0,.06), rgba(230,138,0,.04)) padding-box, linear-gradient(135deg, rgba(230,138,0,.35), rgba(230,138,0,.2)) border-box" }}>
                  <div className="ico" style={{ background: "var(--k-status-warning-10)", color: "var(--k-status-warning-110)" }}><Icon name="warning-alt" size={16} /></div>
                  <div><p className="t">Policy · PFAS attestation required</p><p className="s">new ship-to · 1 obligation</p></div>
                  <span className="arr" style={{ color: "var(--k-status-warning-110)" }}>Review →</span>
                </div>
                <div style={{ marginTop: 10 }}><SourceAttribution when="just now">ChemAssist · grounded in Dow product data</SourceAttribution></div>
              </div>
            </div>
          )}
        </div>
        {run.phase === "idle" && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Button variant="dark" icon="chat-bot" onClick={run.run}>Capture intent</Button>
          </div>
        )}
      </div>
    );
  }

  // ---------- Layout C · Cockpit ----------
  function LayoutC({ run, goPolicy, goRec }) {
    const k = window.DATA.kase;
    const done = run.phase === "done";
    return (
      <div className="stack">
        <UI.Panel pad={true} className="ai-edge tint">
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span className="ai-glyph" style={{ width: 20, height: 20, marginTop: 4 }} />
            <div style={{ flex: 1 }}>
              <Eyebrow tone="ai">ChemAssist intent cockpit</Eyebrow>
              <textarea className="brief-input" rows={3} defaultValue={BRIEF} style={{ marginTop: 8, border: "none", padding: "8px 0", fontSize: 15 }} />
            </div>
            <Button variant="dark" icon="chat-bot" onClick={run.run}>{done ? "Re-run" : "Capture"}</Button>
          </div>
        </UI.Panel>

        {run.phase !== "idle" && (
          <AgentStatusBar className="fade-in" state={done ? "done" : "thinking"}
            label={done ? "Intent captured · ready for triage" : "Qualifying"} meta={done ? "4.1s" : `step ${run.idx} of 5`}
            onPause={() => {}} onCancel={() => {}} />
        )}

        {done && (
          <React.Fragment>
            <div className="fade-in"><ResultTiles done goPolicy={goPolicy} goRec={goRec} /></div>
            <div className="grid-2 fade-in">
              <UI.Panel head={<><Packet>Intent packet</Packet><span style={{ fontSize: 12.5, fontWeight: 600, marginLeft: 8 }}>Extracted criteria</span></>}>
                <ExtractedFields k={k} />
              </UI.Panel>
              <UI.Panel title="Agent run">
                <StepTimeline steps={window.DATA.agentSteps.map(s => ({ ...s, state: "done" }))} />
                <div className="divider" style={{ margin: "12px 0" }} />
                <Completeness pct={100} />
              </UI.Panel>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }

  function ScreenIntake({ layout = "A", setScreen, toast }) {
    const run = useAgentRun(window.DATA.agentSteps);
    const auto = React.useRef(false);
    React.useEffect(() => {
      if (!auto.current) { auto.current = true; const t = setTimeout(run.run, 650); return () => clearTimeout(t); }
    }, []);
    const goPolicy = () => setScreen("policy");
    const goRec = () => setScreen("recommend");

    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Customer experience · capture intent once</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Intent capture</h1>
            <div className="ph-sub">A rep describes the order in plain language. ChemAssist qualifies it the way a senior technical expert would — extracting structured criteria, checking feasibility and policy inline, and predicting a delivery date before anyone touches SAP.</div>
          </div>
          <div className="ph-spacer" />
          <Badge tone="violet" dot="#8A4FBF">Layout {layout} · {layout === "A" ? "Split" : layout === "B" ? "Conversational" : "Cockpit"}</Badge>
        </div>

        {layout === "A" && <LayoutA run={run} />}
        {layout === "B" && <LayoutB run={run} />}
        {layout === "C" && <LayoutC run={run} goPolicy={goPolicy} goRec={goRec} />}
      </div>
    );
  }
  UI.ScreenIntake = ScreenIntake;
})();
