/* ============================================================
   Agentic Workflow Pipeline — LIVE side panel.
   Renders ONLY the workflow currently active on the customer
   front-end (window.AgenticBus), as a real DAG built from that
   workflow's agent chain + PAC governance + audit. Updates in
   real time as the end-customer's interaction changes the active
   workflow (same-document subscribe + cross-tab storage event),
   and streams step-by-step so the running node is always visible.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke } = UI;
  const useActiveWf = UI.useActiveWf;

  const PAC = {
    allow: { l: "Allow", cls: "allow", ic: "checkmark-filled" },
    pass:  { l: "Pass",  cls: "allow", ic: "checkmark-filled" },
    flag:  { l: "Flag",  cls: "flag",  ic: "warning-alt" },
    route: { l: "Route to human", cls: "route", ic: "group" },
    deny:  { l: "Deny",  cls: "deny",  ic: "error-filled" },
  };
  const STATE = {
    pending: { t: "Idle", c: "var(--fg-muted)", bg: "var(--bg-3)" },
    active: { t: "Running", c: "var(--k-spruce-70)", bg: "var(--k-ai-spruce-06)" },
    done: { t: "Complete", c: "var(--k-status-success-110)", bg: "var(--k-status-success-10)" },
  };
  const LOGC = { INFO: "var(--k-status-info-100)", WARN: "var(--k-status-warning-100)", ERROR: "var(--k-status-error-100)" };

  const NW = 210, COLGAP = 268, Y_MAIN = 40, Y_GOV = 250, NMARGIN = 28;

  // ----- build a DAG node/edge model for one workflow -----
  function buildDag(wf, agents) {
    const nodes = [], edges = [];
    const N = wf.steps.length;
    nodes.push({
      id: "TRIGGER", col: 0, lane: 0, color: "#5B6B7B", icon: "anomaly", label: "Trigger", desc: wf.trigger, order: 0,
      metrics: { Trigger: wf.trigger, Mode: wf.touchless ? "touchless" : "human-in-loop" }, pt: 1,
      input: "{ }  // customer interaction", output: "{ case_id, account, intent }",
      logs: [["INFO", "Trigger · " + wf.trigger], ["INFO", "Open / resume the customer case"]],
      config: { trigger: wf.trigger, source: "customer front-end" },
    });
    wf.steps.forEach((s, i) => {
      const ag = agents[s.agent];
      nodes.push({
        id: "S" + i, col: i + 1, lane: 0, color: ag.c, icon: ag.icon, label: ag.name, desc: s.action, order: i + 1,
        tool: s.tool, pac: s.pac, pt: 1 + (i % 3),
        metrics: { Step: (i + 1) + " / " + N, Tool: s.tool },
        input: i === 0 ? "{ case_id, account, intent }" : "{ case_id, upstream_result }",
        output: "{ " + s.tool.split(".").pop() + "_result, status }",
        logs: (() => {
          const L = [["INFO", s.action], ["INFO", "tool " + s.tool + " invoked"]];
          if (s.pac) L.push([s.pac.outcome === "deny" ? "ERROR" : (s.pac.outcome === "flag" || s.pac.outcome === "route") ? "WARN" : "INFO", "PAC " + s.pac.rule + " → " + PAC[s.pac.outcome].l]);
          return L;
        })(),
        config: { tool: s.tool, gate: wf.gate, handoff: wf.touchless ? "touchless" : wf.human },
      });
    });
    const outCol = N + 1;
    nodes.push({
      id: "OUTCOME", col: outCol, lane: 0, color: "#29707A", icon: "checkmark-filled", label: "Customer outcome", desc: wf.outcome, order: N + 1,
      foot: wf.touchless ? "Touchless — no human in the loop" : wf.human, pt: 1,
      metrics: { Outcome: "delivered", Handoff: wf.touchless ? "touchless" : "human" },
      input: "{ all_step_results }", output: "{ customer_outcome }",
      logs: [["INFO", wf.outcome]], config: { handoff: wf.touchless ? "touchless" : wf.human, systems: wf.systems.join(" · ") },
    });
    edges.push(["TRIGGER", "S0"]);
    for (let i = 0; i < N - 1; i++) edges.push(["S" + i, "S" + (i + 1)]);
    edges.push(["S" + (N - 1), "OUTCOME"]);

    // governance lane — PAC checks on gated steps, feeding a single audit node
    const gated = wf.steps.map((s, i) => ({ s, i })).filter(x => x.s.pac);
    if (gated.length) {
      gated.forEach(({ s, i }) => {
        nodes.push({
          id: "PAC" + i, col: i + 1, lane: 1, color: "#DC2626", icon: "document-chart", label: "PAC policy check",
          desc: s.pac.rule + " — " + s.pac.q, order: i + 1, pacOut: s.pac.outcome, pt: 1,
          metrics: { Rule: s.pac.rule, Decision: PAC[s.pac.outcome].l },
          input: "{ action, rule_id, context }", output: "{ decision: " + s.pac.outcome + " }",
          logs: [["INFO", "Evaluate " + s.pac.rule], [s.pac.outcome === "deny" ? "ERROR" : (s.pac.outcome === "flag" || s.pac.outcome === "route") ? "WARN" : "INFO", "Decision · " + PAC[s.pac.outcome].l], ["INFO", s.pac.note]],
          config: { rule: s.pac.rule, bundle: "dow-brd-sc-eu-v3.1", default: "deny" },
        });
        edges.push(["S" + i, "PAC" + i]);
        edges.push(["PAC" + i, "AUDIT"]);
      });
      nodes.push({
        id: "AUDIT", col: outCol, lane: 1, color: "#20B2AA", icon: "document-chart", label: "Audit record",
        desc: "Seal the reason chain for every policy decision.", order: N + 1, pt: 1,
        metrics: { Retention: "7y", Records: String(gated.length) },
        input: "{ decision_chain }", output: "{ audit_record }",
        logs: [["INFO", "Sources · agent decisions · policy checks · approval"]], config: { retention: "7y", masking: "per policy" },
      });
    }
    const cols = outCol + 1;
    nodes.forEach(n => { n.x = NMARGIN + n.col * COLGAP; n.y = n.lane === 0 ? Y_MAIN : Y_GOV; });
    const CW = NMARGIN + (cols - 1) * COLGAP + NW + NMARGIN;
    const CH = (gated.length ? Y_GOV + 150 : Y_MAIN + 240);
    return { nodes: nodes, edges: edges, CW: CW, CH: CH, progressCount: N + 2 };
  }

  function nodeState(n, cursor) {
    // cursor walks the main lane order 0..progressCount-1; governance nodes
    // resolve as their step completes.
    if (cursor < 0) return "pending";
    if (n.id.indexOf("PAC") === 0) return cursor > n.order ? "done" : cursor === n.order ? "active" : "pending";
    if (n.id === "AUDIT") return cursor >= n.order ? "done" : "pending";
    if (n.order < cursor) return "done";
    if (n.order === cursor) return "active";
    return "pending";
  }

  function edgePath(a, b) {
    const sx = a.x + NW, sy = a.y + 30, tx = b.x, ty = b.y + 30;
    const mx = (sx + tx) / 2;
    return `M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`;
  }

  function Section({ label, children }) {
    const [open, setOpen] = React.useState(false);
    return (
      <div className={`wf-sec ${open ? "open" : ""}`}>
        <button className="wf-sec-h" onClick={() => setOpen(o => !o)}>
          <Icon name="document-chart" size={11} /> {label}
          <Stroke className="wf-sec-chev" size={12} sw={2.4} children={<polyline points="6 9 12 15 18 9" />} />
        </button>
        {open && <div className="wf-sec-b">{children}</div>}
      </div>
    );
  }

  function WorkflowNode({ n, state, expanded, onToggle }) {
    const st = STATE[state] || STATE.pending;
    const pac = n.pacOut ? PAC[n.pacOut] : null;
    return (
      <div className={`wf-node ${expanded ? "ex" : ""} st-${state}`} style={{ left: n.x, top: n.y, width: NW, zIndex: expanded ? 6 : (state === "active" ? 3 : 1) }}>
        <span className="wf-n-accent" style={{ background: n.color }} />
        <button className="wf-n-hd" onClick={onToggle}>
          <span className="wf-n-sq" style={{ background: n.color }}><Icon name={n.icon} size={11} /></span>
          <span className="wf-n-title">{n.label}</span>
          {state === "active" && <span className="wf-livedot" />}
          <Stroke className="wf-n-chev" size={12} sw={2.4} children={<polyline points="6 9 12 15 18 9" />} />
        </button>
        <div className="wf-n-desc">{n.desc}</div>
        {pac && <div className={`wf-n-pac ${pac.cls}`}><Icon name={pac.ic} size={11} /> {pac.l}</div>}
        <div className="wf-n-metrics">
          {Object.keys(n.metrics).map(k => (
            <div className="wf-n-metric" key={k}><span className="wm-k">{k}</span><span className="wm-v">{n.metrics[k]}</span></div>
          ))}
        </div>
        <div className="wf-n-idrow">
          <span className="wf-n-id">Node ID: {n.id}</span>
          <span className="wf-n-state" style={{ color: st.c, background: st.bg }}>{st.t}</span>
        </div>
        {expanded && (
          <div className="wf-n-body">
            <Section label="Input schema"><pre className="wf-code">{n.input}</pre></Section>
            <Section label="Output schema"><pre className="wf-code">{n.output}</pre></Section>
            <Section label="Processing logs">
              {n.logs.map((l, i) => <div className="wf-logline" key={i}><span className="wf-lvl" style={{ color: LOGC[l[0]] }}>{l[0]}</span> {l[1]}</div>)}
            </Section>
            <Section label="Configuration">
              {Object.keys(n.config).map(k => <div className="wf-cfg" key={k}><span className="wf-cfg-k">{k}</span><span className="wf-cfg-v">{n.config[k]}</span></div>)}
            </Section>
          </div>
        )}
      </div>
    );
  }

  function WorkflowDAG({ open, onClose }) {
    const D = window.D;
    const agents = D.agenticAgents;
    const [active] = useActiveWf();
    const wf = D.agenticWorkflowById[active] || D.agenticWorkflows[0];
    const dag = React.useMemo(() => buildDag(wf, agents), [wf]);

    const wrapRef = React.useRef(null);
    const [expanded, setExpanded] = React.useState({});
    const [zoom, setZoom] = React.useState(0.74);

    // fit the whole DAG into the visible panel — width is the binding
    // constraint (the chain is wide & short), but contain both axes so
    // nothing is clipped. Clamped so a tiny workflow doesn't balloon.
    const computeFit = React.useCallback(() => {
      const el = wrapRef.current;
      if (!el || !el.clientWidth) return 0.74;
      const pad = 56;
      const z = Math.min((el.clientWidth - pad) / dag.CW, (el.clientHeight - pad) / dag.CH, 1);
      return Math.max(0.28, +z.toFixed(3));
    }, [dag.CW, dag.CH]);
    const fit = React.useCallback(() => {
      requestAnimationFrame(() => setZoom(computeFit()));
    }, [computeFit]);
    const [showLog, setShowLog] = React.useState(false);
    const [playing, setPlaying] = React.useState(true);
    const [cursor, setCursor] = React.useState(dag.progressCount);
    const [runKey, setRunKey] = React.useState(0);
    const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

    // stream the active workflow step-by-step
    const timers = React.useRef([]);
    React.useEffect(() => {
      timers.current.forEach(clearTimeout); timers.current = [];
      if (!open || !playing) { setCursor(dag.progressCount); return; }
      setCursor(-1);
      for (let i = 0; i <= dag.progressCount; i++) timers.current.push(setTimeout(() => setCursor(i), 300 + i * 950));
      return () => timers.current.forEach(clearTimeout);
    }, [runKey, playing, open, dag.progressCount]);

    // when the active workflow changes (customer interaction), replay from the top
    React.useEffect(() => { if (open) { setPlaying(true); setExpanded({}); setRunKey(k => k + 1); fit(); } }, [active, open, fit]);

    // keep the fit correct as the window (and panel) resizes
    React.useEffect(() => {
      if (!open) return;
      const onResize = () => setZoom(computeFit());
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [open, computeFit]);

    const liveStep = cursor >= 1 && cursor <= wf.steps.length ? wf.steps[cursor - 1] : null;
    const liveLabel = cursor < 0 ? "Starting…" : cursor === 0 ? "Trigger received" : liveStep ? agents[liveStep.agent].name : cursor > wf.steps.length ? "Outcome delivered" : "";

    const events = dag.nodes.filter(n => n.lane === 0).map((n, i) => {
      const base = 6 * 3600 + 14 * 60 + i * 6;
      const h = Math.floor(base / 3600), m = Math.floor((base % 3600) / 60), s = base % 60;
      return { id: n.id, label: n.label, state: nodeState(n, cursor), ts: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` };
    });

    return (
      <React.Fragment>
        <div className={`wf-scrim ${open ? "open" : ""}`} onClick={onClose} />
        <aside className={`wf-panel ${open ? "open" : ""}`} aria-hidden={!open}>
          <header className="wf-head">
            <span className="wf-bulb"><Icon name="lightbulb" size={16} /></span>
            <div className="wf-head-t">
              <span className="wf-h1">Agentic Workflow Pipeline</span>
              <span className="wf-h2"><span className="wf-livewrap"><span className="wf-livedot sm" /> Live</span> · {String(wf.n).padStart(2, "0")} {wf.name}</span>
            </div>
            <button className={`wf-log-btn ${showLog ? "on" : ""}`} onClick={() => setShowLog(v => !v)}>{showLog ? "Hide log" : "Show log"}</button>
            <button className="wf-collapse" onClick={onClose} aria-label="Collapse">
              <Stroke size={16} sw={2.4} children={<g><polyline points="13 6 19 12 13 18" /><polyline points="5 6 11 12 5 18" /></g>} />
            </button>
          </header>

          <div className="wf-subbar">
            <span className="wf-trig"><Icon name="anomaly" size={12} /> Triggered by: <b>{wf.trigger}</b></span>
            <span className={`wf-run ${playing ? "on" : ""}`}>
              {playing ? <span className="wf-run-l"><span className="wf-livedot sm" /> {liveLabel}</span> : <span className="wf-run-l done">Sequence complete</span>}
            </span>
            <button className="wf-replay" onClick={() => { setPlaying(true); setRunKey(k => k + 1); }}>
              <Stroke size={12} sw={2.4} children={<g><polyline points="1 4 1 10 7 10" /><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" /></g>} /> Replay
            </button>
          </div>

          <div className="wf-canvas-wrap" ref={wrapRef}>
            <div className="wf-canvas" style={{ width: dag.CW * zoom, height: dag.CH * zoom }}>
              <div className="wf-scale" style={{ width: dag.CW, height: dag.CH, transform: `scale(${zoom})` }}>
                <svg className="wf-edges" width={dag.CW} height={dag.CH}>
                  {dag.edges.map(([f, t], i) => {
                    const a = dag.nodes.find(n => n.id === f), b = dag.nodes.find(n => n.id === t);
                    if (!a || !b) return null;
                    const lit = nodeState(b, cursor) !== "pending";
                    return <path key={i} d={edgePath(a, b)} fill="none" stroke={lit ? "var(--k-spruce-40)" : "#d4dde6"} strokeWidth={lit ? 2 : 1.5} />;
                  })}
                </svg>
                {dag.nodes.map(n => <WorkflowNode key={n.id} n={n} state={nodeState(n, cursor)} expanded={!!expanded[n.id]} onToggle={() => toggle(n.id)} />)}
              </div>
            </div>

            <div className="wf-zoom">
              <button onClick={() => setZoom(z => Math.min(1.4, +(z + 0.15).toFixed(2)))} aria-label="Zoom in"><Stroke size={15} sw={2.4} children={<g><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></g>} /></button>
              <button onClick={() => setZoom(z => Math.max(0.4, +(z - 0.15).toFixed(2)))} aria-label="Zoom out"><Stroke size={15} sw={2.4} children={<line x1="5" y1="12" x2="19" y2="12" />} /></button>
              <button onClick={() => setZoom(computeFit())} aria-label="Fit"><Stroke size={14} sw={2.4} children={<g><polyline points="4 9 4 4 9 4" /><polyline points="20 9 20 4 15 4" /><polyline points="4 15 4 20 9 20" /><polyline points="20 15 20 20 15 20" /></g>} /></button>
            </div>

            {showLog && (
              <div className="wf-logpanel">
                <div className="wf-lp-head">
                  <span className="wf-lp-t">Workflow event log</span>
                  <span className="wf-lp-id">WF-{String(wf.n).padStart(2, "0")}</span>
                </div>
                <div className="wf-lp-user"><Icon name="chat-bot" size={13} /> {wf.touchless ? "Autonomous run" : wf.human} <span className="wf-lp-role">{wf.touchless ? "TOUCHLESS" : "HUMAN-IN-LOOP"}</span></div>
                <div className="wf-lp-stats">
                  <div><span className="wf-lp-n">{dag.nodes.length}</span><span className="wf-lp-l">Nodes</span></div>
                  <div><span className="wf-lp-n">{dag.edges.length}</span><span className="wf-lp-l">Edges</span></div>
                  <div><span className="wf-lp-n">{wf.chain.length}</span><span className="wf-lp-l">Agents</span></div>
                </div>
                <div className="wf-lp-tl-h">Event timeline</div>
                <ul className="wf-lp-tl">
                  {events.map((e) => (
                    <li key={e.id}>
                      <span className="wf-lp-dot" style={{ background: e.state === "done" ? "var(--k-status-success-100)" : e.state === "active" ? "var(--k-spruce-60)" : "var(--k-cool-gray-30)" }} />
                      <div><span className="wf-lp-ev">{e.label}</span><span className="wf-lp-meta"><span className="mono">{e.state}</span> · {e.ts}</span></div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="wf-key">
            <div className="wf-key-h">Agents in this workflow</div>
            <div className="wf-key-grid">
              {wf.chain.map(id => {
                const a = agents[id];
                return (
                  <div className="wf-key-item" key={id}>
                    <span className="wf-key-dot" style={{ background: a.c }} />
                    <span><span className="wf-key-l">{a.name}</span><span className="wf-key-d">{a.owns}</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </React.Fragment>
    );
  }
  UI.WorkflowDAG = WorkflowDAG;
})();
