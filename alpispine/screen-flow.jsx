/* ============================================================
   Screen — TravelRadar · agentic workflow trace
   Pick any of the eleven agentic workflows and watch its agent
   chain run end-to-end: each agent acts in turn, every action
   checked by PAC before it commits. Shares the active workflow
   with the floating Agentic Workflow Pipeline.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Eyebrow, Button, AiSpinner } = UI;

  const PAC = {
    allow: { l: "Allowed", cls: "allow", ic: "checkmark-filled", note: "auto-action within bounds" },
    pass:  { l: "Pass",    cls: "allow", ic: "checkmark-filled", note: "no conflict — safe to act" },
    flag:  { l: "Flagged", cls: "flag",  ic: "warning-alt", note: "allowed, logged & alerted" },
    route: { l: "Routed to human", cls: "route", ic: "group", note: "needs human sign-off" },
    deny:  { l: "Denied",  cls: "deny",  ic: "error-filled", note: "blocked by policy" },
  };

  function useTrace(total, runKey) {
    const [step, setStep] = React.useState(-1);
    const timers = React.useRef([]);
    React.useEffect(() => {
      timers.current.forEach(clearTimeout); timers.current = [];
      setStep(-1);
      for (let i = 0; i <= total; i++) timers.current.push(setTimeout(() => setStep(i), 300 + i * 1050));
      return () => timers.current.forEach(clearTimeout);
    }, [runKey, total]);
    return step;
  }

  function TraceStep({ s, ag, state, idx, last }) {
    const p = s.pac ? PAC[s.pac.outcome] : null;
    const settled = state === "done";
    return (
      <div className={`rr-step ${state}`}>
        <div className="rr-rail">
          <span className="rr-dot" style={{ background: state === "pending" ? "var(--bg-3)" : ag.tint, color: ag.c, borderColor: ag.c }}>
            {state === "done" ? <Icon name="checkmark-filled" size={14} /> : state === "active" ? <AiSpinner size={14} /> : idx + 1}
          </span>
          {!last && <span className="rr-line" />}
        </div>
        <div className="rr-card">
          <div className="rr-card-hd">
            <span className="rr-ag" style={{ background: ag.tint, color: ag.c }}><Icon name={ag.icon} size={13} /> {ag.name}</span>
            <span className="rr-tool">{s.tool}</span>
          </div>
          <div className="rr-act">{s.action}</div>
          {p && (
            <div className={`rr-gate ${settled ? "settled" : ""}`}>
              <div className="rr-gate-top">
                <span className="rr-gate-ic"><Icon name="document-chart" size={12} /></span>
                <span className="rr-gate-rule">{s.pac.rule}</span>
                {state === "active"
                  ? <span className="rr-gate-eval"><AiSpinner size={13} /> evaluating</span>
                  : settled
                    ? <span className={`rr-gate-out ${p.cls}`}><Icon name={p.ic} size={12} /> {p.l}</span>
                    : <span className="rr-gate-out pending">PAC gate</span>}
              </div>
              <div className="rr-gate-q">"{s.pac.q}"</div>
              {settled && <div className={`rr-gate-note ${p.cls}`}><Icon name={p.ic} size={12} /> {s.pac.note}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  function WorkflowTrace({ setScreen }) {
    const D = window.D;
    const agents = D.agenticAgents;
    const [active, setActive] = UI.useActiveWf();
    const [runKey, setRunKey] = React.useState(0);
    const wf = D.agenticWorkflowById[active] || D.agenticWorkflows[0];
    const total = wf.steps.length;
    const step = useTrace(total, `${wf.id}:${runKey}`);
    React.useEffect(() => { setRunKey(k => k + 1); }, [active]);

    const stateOf = (i) => step > i ? "done" : step === i ? "active" : "pending";
    const shown = Math.min(step + 1, total);
    const complete = step >= total;
    const triggerShown = step >= 0;
    const outcomeShown = step >= total;

    return (
      <div>
        {/* selector */}
        <div className="rr-sel">
          {D.agenticWorkflows.map(w => (
            <button key={w.id} className={`rr-sel-chip ${w.id === active ? "on" : ""}`} onClick={() => setActive(w.id)}>
              <span className="rr-sel-n">{String(w.n).padStart(2, "0")}</span> {w.name}
            </button>
          ))}
        </div>

        {/* active workflow header */}
        <div className="rr-hd">
          <div className="rr-hd-l">
            <span className="rr-hd-n">{String(wf.n).padStart(2, "0")}</span>
            <div>
              <div className="rr-hd-name">{wf.name}</div>
              <div className="rr-hd-chain">
                {wf.chain.map((aid, i) => (
                  <React.Fragment key={aid}>
                    <span className="rr-hd-chip" style={{ background: agents[aid].tint, color: agents[aid].c }}><Icon name={agents[aid].icon} size={11} /> {agents[aid].short}</span>
                    {i < wf.chain.length - 1 && <Stroke size={12} sw={2.4} children={<polyline points="9 6 15 12 9 18" />} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="rr-hd-r">
            {complete
              ? <span className="rr-stat done"><Icon name="checkmark-filled" size={13} /> Trace complete · {total} steps</span>
              : <span className="rr-stat live"><span className="nd" /> Tracing · {Math.max(shown, 1)} of {total}</span>}
            <Button variant="dark" icon="anomaly" onClick={() => setRunKey(k => k + 1)}>Replay the trace</Button>
          </div>
        </div>

        {/* meta strip */}
        <div className="rr-meta">
          <span className="rr-meta-k">Systems</span>
          {wf.systems.map((s, i) => <span className="rr-meta-chip" key={i}>{s}</span>)}
          <span className="rr-meta-k" style={{ marginLeft: 8 }}>PAC gate</span>
          <span className="rr-meta-v">{wf.gate === "—" ? "none" : wf.gate}</span>
          <span className="rr-meta-k" style={{ marginLeft: 8 }}>Human</span>
          <span className="rr-meta-v">{wf.touchless ? "Touchless" : wf.human}</span>
        </div>

        {/* trace timeline */}
        <div className="rr-trace">
          {triggerShown && (
            <div className="rr-step done trigger">
              <div className="rr-rail"><span className="rr-dot trig"><Icon name="anomaly" size={13} /></span><span className="rr-line" /></div>
              <div className="rr-card">
                <div className="rr-card-hd"><span className="rr-eye">Trigger</span></div>
                <div className="rr-act">{wf.trigger}</div>
              </div>
            </div>
          )}
          {wf.steps.map((s, i) => (
            (step >= i) ? <TraceStep key={i} s={s} ag={agents[s.agent]} state={stateOf(i)} idx={i} last={false} /> : null
          ))}
          {outcomeShown && (
            <div className="rr-step done outcome">
              <div className="rr-rail"><span className="rr-dot out"><Icon name="checkmark-filled" size={14} /></span></div>
              <div className="rr-card spruce">
                <div className="rr-card-hd"><span className="rr-eye out">Customer outcome</span></div>
                <div className="rr-out">{wf.outcome}</div>
                <div className="rr-out-foot"><Icon name="information" size={12} /> {wf.touchless ? "Delivered touchless — no human in the loop." : `Human handoff: ${wf.human}.`}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function ScreenFlow({ setScreen }) {
    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Agentic workflow · end-to-end trace</Eyebrow>
            <h1 style={{ marginTop: 6 }}>TravelRadar</h1>
            <div className="ph-sub">Pick any of the eleven agentic workflows and watch its agent chain run end to end — each agent doing a single thing in turn, with PAC checked before any action commits. The selected workflow is the one shown in the floating Workflow pipeline.</div>
          </div>
        </div>
        <WorkflowTrace setScreen={setScreen} />
      </div>
    );
  }
  UI.ScreenFlow = ScreenFlow;
})();
