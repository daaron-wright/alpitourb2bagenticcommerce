/* ============================================================
   AgenticPipeline — global right-edge tab + slide-in panel.
   Shows the 11-workflow catalog (active highlighted) and renders
   the active workflow's agent chain as a node-library DAG (rich
   cards, top accent, metrics, status pill, expandable Input/Output/
   Logs/Config sections) wired with bezier splines + port circles.
   Streams step-by-step: agents light up, PAC gates resolve.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const Icon = UI.Icon || function ({ name, size = 16, style }) {
    return React.createElement("svg", { className: "ki", style: { width: size, height: size, ...style }, "aria-hidden": "true" },
      React.createElement("use", { href: `#icon-${name}` }));
  };
  const Stroke = UI.Stroke || function ({ size = 16, sw = 2, vb = 24, children, style, className }) {
    return React.createElement("svg", { className, width: size, height: size, viewBox: `0 0 ${vb} ${vb}`, fill: "none", stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round", style }, children);
  };
  const AiSpinner = UI.AiSpinner || function ({ size = 24, style }) {
    const thick = Math.max(2, Math.round(size * 0.11));
    return React.createElement("span", { className: "ai-spinner", style: { width: size, height: size, "--thick": thick + "px", ...style } });
  };

  const PAC = {
    allow: { l: "Allow", cls: "allow", ic: "checkmark-filled" },
    pass:  { l: "Pass",  cls: "allow", ic: "checkmark-filled" },
    flag:  { l: "Flag",  cls: "flag",  ic: "warning-alt" },
    route: { l: "Route to human", cls: "route", ic: "group" },
    deny:  { l: "Deny",  cls: "deny",  ic: "error-filled" },
  };
  const STATE = {
    pending: { t: "Idle", bg: "var(--bg-3)", c: "var(--fg-muted)" },
    active:  { t: "Running", bg: "var(--k-ai-spruce-06)", c: "var(--k-spruce-70)" },
    done:    { t: "Complete", bg: "var(--k-status-success-10)", c: "var(--k-status-success-110)" },
  };
  const LOGC = { INFO: "var(--k-status-info-100)", WARN: "var(--k-status-warning-100)", ERROR: "var(--k-status-error-100)" };

  function useActiveWf() {
    const [id, setId] = React.useState(() => window.AgenticBus.get());
    React.useEffect(() => window.AgenticBus.subscribe(setId), []);
    return [id, (v) => window.AgenticBus.set(v)];
  }
  UI.useActiveWf = useActiveWf;

  function useStream(stepCount, runKey, playing) {
    const [step, setStep] = React.useState(stepCount);
    const timers = React.useRef([]);
    React.useEffect(() => {
      timers.current.forEach(clearTimeout); timers.current = [];
      if (!playing) { setStep(stepCount); return; }
      setStep(-1);
      for (let i = 0; i <= stepCount; i++) timers.current.push(setTimeout(() => setStep(i), 350 + i * 950));
      return () => timers.current.forEach(clearTimeout);
    }, [runKey, playing, stepCount]);
    return step;
  }

  // ----- build the node model from a workflow -----
  function buildNodes(wf, agents) {
    const list = [];
    list.push({ key: "trigger", kind: "trigger", color: "#5B6B7B", tint: "#EEF1F4", icon: "anomaly", title: "Trigger", desc: wf.trigger });
    wf.steps.forEach((s, i) => {
      const ag = agents[s.agent];
      const tool = s.tool;
      list.push({
        key: "s" + i, kind: "step", idx: i, color: ag.c, tint: ag.tint, icon: ag.icon,
        title: ag.name, desc: s.action, tool, pac: s.pac,
        bullets: [
          ["Tool", tool],
          ["Systems", wf.systems.join(" · ")],
          s.pac ? ["PAC gate", `${s.pac.rule} → ${PAC[s.pac.outcome].l}`] : ["PAC gate", "no gate on this step"],
        ],
        metrics: [["Step", `${i + 1} / ${wf.steps.length}`], ["PAC", s.pac ? PAC[s.pac.outcome].l : "—"]],
        pt: 1 + (i % 3),
        nodeId: tool.toUpperCase(),
        input: i === 0 ? "{ case_id, account, intent }" : "{ case_id, upstream_result }",
        output: `{ ${tool.split(".").pop()}_result: object, status }`,
        logs: (() => {
          const L = [["INFO", s.action], ["INFO", `tool ${tool} invoked`]];
          if (s.pac) L.push([s.pac.outcome === "deny" ? "ERROR" : (s.pac.outcome === "flag" || s.pac.outcome === "route") ? "WARN" : "INFO", `PAC ${s.pac.rule} → ${PAC[s.pac.outcome].l}`]);
          return L;
        })(),
        config: { tool, gate: wf.gate, handoff: wf.touchless ? "touchless" : wf.human },
      });
    });
    list.push({ key: "outcome", kind: "outcome", color: "#29707A", tint: "var(--k-spruce-10)", icon: "checkmark-filled", title: "Customer outcome", desc: wf.outcome, foot: wf.touchless ? "Touchless — no human in the loop" : wf.human });
    return list;
  }

  function Section({ label, icon, children }) {
    const [open, setOpen] = React.useState(false);
    return (
      <div className={`wf-sec ${open ? "open" : ""}`}>
        <button className="wf-sec-h" onClick={() => setOpen(o => !o)}>
          <Icon name={icon} size={11} /> {label}
          <Stroke className="wf-sec-chev" size={12} sw={2.4} children={<polyline points="6 9 12 15 18 9" />} />
        </button>
        {open && <div className="wf-sec-b">{children}</div>}
      </div>
    );
  }

  function ApNode({ n, state, expanded, onToggle, nodeRef }) {
    const isStep = n.kind === "step";
    const st = STATE[state] || STATE.pending;
    return (
      <div className={`apw-node ${state} ${expanded ? "ex" : ""}`} ref={nodeRef} style={{ background: n.tint }}>
        <span className="apw-accent" style={{ background: n.color }} />
        <button className="wf-n-hd" onClick={onToggle}>
          <span className="wf-n-sq" style={{ background: n.color }}><Icon name={n.icon} size={11} /></span>
          <span className="apw-title" style={{ color: n.color }}>{n.title}</span>
          {isStep && state === "active" && <span className="apw-livedot" />}
          {isStep && <Stroke className="wf-n-chev" size={12} sw={2.4} children={<polyline points="6 9 12 15 18 9" />} />}
        </button>
        <div className="wf-n-desc">{n.desc}</div>
        {n.foot && <div className="apw-foot"><Icon name="information" size={11} /> {n.foot}</div>}

        {isStep && expanded && (
          <React.Fragment>
            <ul className="apw-bullets">
              {n.bullets.map((b, i) => (
                <li key={i}><span className="apw-b-dot" style={{ background: n.color }} /><span className="apw-b-k">{b[0]}:</span> {b[1]}</li>
              ))}
            </ul>
            <div className="wf-n-metrics">
              {n.metrics.map((m, i) => (
                <div className="wf-n-metric" key={i}><span className="wm-k">{m[0]}</span><span className="wm-v">{m[1]}</span></div>
              ))}
            </div>
            <div className="wf-n-pt">Processing time: {n.pt}s</div>
            <div className="wf-n-idrow">
              <span className="wf-n-id">Node ID: {n.nodeId}</span>
              <span className="wf-n-state" style={{ background: st.bg, color: st.c }}>{st.t}</span>
            </div>
            <div className="wf-n-body">
              <Section label="Input schema" icon="document-chart"><pre className="wf-code">{n.input}</pre></Section>
              <Section label="Output schema" icon="document-chart"><pre className="wf-code">{n.output}</pre></Section>
              <Section label="Processing logs" icon="document-chart">
                {n.logs.map((l, i) => <div className="wf-logline" key={i}><span className="wf-lvl" style={{ color: LOGC[l[0]] }}>{l[0]}</span> {l[1]}</div>)}
              </Section>
              <Section label="Configuration" icon="information">
                {Object.keys(n.config).map(k => <div className="wf-cfg" key={k}><span className="wf-cfg-k">{k}</span><span className="wf-cfg-v">{n.config[k]}</span></div>)}
              </Section>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }

  const NW = 258, GAP = 70, X0 = 22, Y0 = 18;

  function ApChain({ wf, step, agents }) {
    const nodes = React.useMemo(() => buildNodes(wf, agents), [wf.id]);
    const total = wf.steps.length;
    const stateOf = (n) => {
      if (n.kind === "trigger") return step >= 0 ? "done" : "pending";
      if (n.kind === "outcome") return step >= total ? "done" : "pending";
      return step > n.idx ? "done" : step === n.idx ? "active" : "pending";
    };
    const activeIdx = step < 0 ? -1 : Math.min(step, total - 1);
    const [expanded, setExpanded] = React.useState({});
    const [userTouched, setUserTouched] = React.useState(false);
    // auto-expand the active step as the trace streams
    React.useEffect(() => { setExpanded({}); setUserTouched(false); }, [wf.id]);
    React.useEffect(() => {
      if (userTouched) return;
      if (activeIdx >= 0) setExpanded({ ["s" + activeIdx]: true });
    }, [activeIdx, userTouched]);
    const toggle = (key) => { setUserTouched(true); setExpanded(e => ({ ...e, [key]: !e[key] })); };

    // measure heights to place ports + splines at vertical centers
    const refs = React.useRef({});
    const [heights, setHeights] = React.useState({});
    const expKey = nodes.map(n => (expanded[n.key] ? 1 : 0)).join("") + ":" + step;
    React.useLayoutEffect(() => {
      const h = {};
      nodes.forEach(n => { const el = refs.current[n.key]; if (el) h[n.key] = el.offsetHeight; });
      setHeights(h);
    }, [expKey, wf.id]);

    const xOf = (i) => X0 + i * (NW + GAP);
    const hOf = (n) => heights[n.key] || (n.kind === "step" ? 150 : 110);
    const portY = (n) => Y0 + hOf(n) / 2;
    const CW = X0 * 2 + nodes.length * NW + (nodes.length - 1) * GAP;
    const CH = Y0 * 2 + Math.max(...nodes.map(hOf), 160);

    const wrapRef = React.useRef(null);
    const vpRef = React.useRef(null);
    const [zoom, setZoom] = React.useState(0.92);
    const zoomRef = React.useRef(zoom); zoomRef.current = zoom;
    const interactedRef = React.useRef(false); // user took manual control of the view
    const pendingScroll = React.useRef(null);
    const computeFit = React.useCallback(() => {
      const el = wrapRef.current; if (!el || !el.clientWidth) return 0.92;
      const avail = el.clientWidth - 32;
      return Math.max(0.32, +Math.min(1, avail / CW).toFixed(3));
    }, [CW]);
    const fit = () => { interactedRef.current = false; setZoom(computeFit()); if (vpRef.current) { vpRef.current.scrollLeft = 0; vpRef.current.scrollTop = 0; } };

    // after a cursor-anchored zoom, restore scroll so the point under the
    // pointer stays fixed (applied synchronously before paint)
    React.useLayoutEffect(() => {
      if (pendingScroll.current && vpRef.current) {
        vpRef.current.scrollLeft = pendingScroll.current.l;
        vpRef.current.scrollTop = pendingScroll.current.t;
        pendingScroll.current = null;
      }
    }, [zoom]);

    // zoom toward a screen point (cursor or viewport center)
    const zoomAt = React.useCallback((factor, clientX, clientY) => {
      const vp = vpRef.current; if (!vp) return;
      const r = vp.getBoundingClientRect();
      const ox = clientX - r.left, oy = clientY - r.top;
      const z0 = zoomRef.current;
      const z1 = Math.max(0.3, Math.min(1.8, +(z0 * factor).toFixed(3)));
      if (z1 === z0) return;
      const cx = (vp.scrollLeft + ox) / z0, cy = (vp.scrollTop + oy) / z0;
      pendingScroll.current = { l: cx * z1 - ox, t: cy * z1 - oy };
      interactedRef.current = true;
      setZoom(z1);
    }, []);
    const zoomCenter = (factor) => { const vp = vpRef.current; if (!vp) return; const r = vp.getBoundingClientRect(); zoomAt(factor, r.left + r.width / 2, r.top + r.height / 2); };

    // pinch / ctrl-wheel = zoom to cursor (plain two-finger scroll pans natively)
    React.useEffect(() => {
      const vp = vpRef.current; if (!vp) return;
      const onWheel = (e) => {
        if (!(e.ctrlKey || e.metaKey)) return;
        e.preventDefault();
        zoomAt(Math.exp(-e.deltaY * 0.0016), e.clientX, e.clientY);
      };
      vp.addEventListener("wheel", onWheel, { passive: false });
      return () => vp.removeEventListener("wheel", onWheel);
    }, [zoomAt]);

    // drag anywhere to pan; a tap that doesn't move still toggles a node
    const onPointerDown = React.useCallback((e) => {
      if (e.button !== 0) return;
      const vp = vpRef.current; if (!vp) return;
      const start = { x: e.clientX, y: e.clientY, sl: vp.scrollLeft, st: vp.scrollTop };
      let moved = false;
      const move = (ev) => {
        const dx = ev.clientX - start.x, dy = ev.clientY - start.y;
        if (!moved && Math.hypot(dx, dy) > 4) { moved = true; interactedRef.current = true; vp.classList.add("grabbing"); }
        if (moved) { vp.scrollLeft = start.sl - dx; vp.scrollTop = start.st - dy; ev.preventDefault(); }
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        vp.classList.remove("grabbing");
        if (moved) { const supp = (ev) => ev.stopPropagation(); window.addEventListener("click", supp, true); setTimeout(() => window.removeEventListener("click", supp, true), 0); }
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    }, []);


    // open zoomed out so the WHOLE workflow is visible (re-fit per workflow)
    React.useEffect(() => {
      interactedRef.current = false;
      requestAnimationFrame(() => setZoom(computeFit()));
    }, [wf.id, computeFit]);
    // keep it fitted across resizes
    React.useEffect(() => {
      const onResize = () => setZoom(computeFit());
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [computeFit]);

    // follow the active node as the trace streams — only when the DAG overflows
    // the viewport AND the user hasn't taken manual control of the view.
    const activeOrder = step < 0 ? 0 : step >= total ? nodes.length - 1 : step + 1;
    React.useEffect(() => {
      if (interactedRef.current) return;
      const vp = vpRef.current; if (!vp) return;
      const z = zoomRef.current;
      if (CW * z <= vp.clientWidth + 1) { vp.scrollLeft = 0; return; }
      const target = xOf(activeOrder) * z - vp.clientWidth / 2 + (NW * z) / 2;
      vp.scrollLeft = Math.max(0, target);
    }, [activeOrder, wf.id]);

    return (
      <div className="ap-rf" ref={wrapRef}>
        <div className="apw-viewport" ref={vpRef} onPointerDown={onPointerDown}>
        <div className="apw-canvas" style={{ width: CW * zoom, height: CH * zoom }}>
          <div className="apw-scale" style={{ width: CW, height: CH, transform: `scale(${zoom})` }}>
            <svg className="apw-edges" width={CW} height={CH}>
              {nodes.slice(0, -1).map((n, i) => {
                const a = n, b = nodes[i + 1];
                const sx = xOf(i) + NW, sy = portY(a), tx = xOf(i + 1), ty = portY(b);
                const mx = (sx + tx) / 2;
                const reached = step >= (b.kind === "outcome" ? total : b.idx);
                return <path key={i} d={`M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`} fill="none" stroke={reached ? "#29707A" : "#CBD5E1"} strokeWidth={reached ? 2 : 1.5} />;
              })}
              {nodes.map((n, i) => {
                const y = portY(n);
                return (
                  <g key={n.key}>
                    <circle cx={xOf(i)} cy={y} r="5.5" fill="#fff" stroke={n.color} strokeWidth="2" />
                    <circle cx={xOf(i) + NW} cy={y} r="5.5" fill="#fff" stroke={n.color} strokeWidth="2" />
                  </g>
                );
              })}
            </svg>
            {nodes.map((n, i) => (
              <div key={n.key} className="apw-pos" style={{ left: xOf(i), top: Y0 }}>
                <ApNode n={n} state={stateOf(n)} expanded={!!expanded[n.key]} onToggle={() => n.kind === "step" && toggle(n.key)} nodeRef={el => (refs.current[n.key] = el)} />
              </div>
            ))}
          </div>
        </div>
        </div>
        <div className="wf-zoom">
          <button onClick={() => zoomCenter(1.2)} aria-label="Zoom in"><Stroke size={15} sw={2.4} children={<g><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></g>} /></button>
          <button onClick={() => zoomCenter(1 / 1.2)} aria-label="Zoom out"><Stroke size={15} sw={2.4} children={<line x1="5" y1="12" x2="19" y2="12" />} /></button>
          <button onClick={fit} aria-label="Fit"><Stroke size={14} sw={2.4} children={<g><polyline points="4 9 4 4 9 4" /><polyline points="20 9 20 4 15 4" /><polyline points="4 15 4 20 9 20" /><polyline points="20 15 20 20 15 20" /></g>} /></button>
        </div>
      </div>
    );
  }

  function Catalog({ active, onPick, agents }) {
    return (
      <div className="ap-cat">
        <div className="ap-cat-h">Agentic capabilities · {window.D.agenticWorkflows.length} workflows</div>
        <div className="ap-cat-list">
          {window.D.agenticWorkflows.map(w => (
            <button key={w.id} className={`ap-cat-row ${w.id === active ? "on" : ""}`} onClick={() => onPick(w.id)}>
              <span className="ap-cat-n">{String(w.n).padStart(2, "0")}</span>
              <span className="ap-cat-main">
                <span className="ap-cat-name">{w.name}</span>
                <span className="ap-cat-chain">
                  {w.chain.map((aid, i) => (
                    <React.Fragment key={aid}>
                      <span className="ap-chip" style={{ background: agents[aid].tint, color: agents[aid].c }} title={agents[aid].name}><Icon name={agents[aid].icon} size={10} /></span>
                      {i < w.chain.length - 1 && <span className="ap-chain-arr">›</span>}
                    </React.Fragment>
                  ))}
                </span>
              </span>
              {w.touchless ? <span className="ap-tag touchless">Touchless</span> : <span className="ap-tag human">Human</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function AgenticPipeline() {
    const agents = window.D.agenticAgents;
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = useActiveWf();
    const [playing, setPlaying] = React.useState(true);
    const [runKey, setRunKey] = React.useState(0);
    const wf = window.D.agenticWorkflowById[active] || window.D.agenticWorkflows[0];
    const step = useStream(wf.steps.length, `${wf.id}:${runKey}:${open}`, open && playing);
    React.useEffect(() => { if (open) { setPlaying(true); setRunKey(k => k + 1); } }, [active, open]);
    // allow other UI (e.g. the RegRadar alert) to open the pipeline directly
    React.useEffect(() => window.AgenticBus.onOpen(() => setOpen(true)), []);

    // Sit just to the left of the open ChemAssist side panel when the chat is
    // open (so the pipeline stays reachable), else just left of the bottom-right
    // primary action (ChemAssist launcher / NBA rail FAB), else the corner.
    const [rightOffset, setRightOffset] = React.useState(22);
    React.useEffect(() => {
      function place() {
        const chat = document.querySelector(".dx-agent.on");
        if (chat) {
          // offsetWidth is transform-independent, so this is correct even while
          // the panel is mid-slide; the panel hugs the right edge (right:0), so
          // the FAB just needs to clear its width.
          const w = chat.offsetWidth;
          if (w > 0 && w < window.innerWidth - 40) { setRightOffset(w + 14); return; }
          if (w > 0) { setRightOffset(22); return; } // fullscreen chat → corner, above it
        }
        const anchor = document.querySelector(".dx-launcher") || document.querySelector(".nba-fab");
        if (anchor) {
          const r = anchor.getBoundingClientRect();
          if (r.width > 0) { setRightOffset(Math.round(window.innerWidth - r.left + 14)); return; }
        }
        setRightOffset(22);
      }
      place();
      window.addEventListener("resize", place);
      const t = setInterval(place, 600);
      // react the instant the chat panel opens / docks / expands / closes
      let mo;
      const chatEl = document.querySelector(".dx-agent");
      if (chatEl && window.MutationObserver) {
        mo = new MutationObserver(place);
        mo.observe(chatEl, { attributes: true, attributeFilter: ["class"] });
      }
      return () => { window.removeEventListener("resize", place); clearInterval(t); mo && mo.disconnect(); };
    }, []);

    const total = wf.steps.length;
    const shown = Math.max(0, Math.min(step + 1, total));
    const liveAgent = step >= 0 && step < total ? agents[wf.steps[step].agent] : null;

    return (
      <React.Fragment>
        <button className={`ap-fabicon ${open ? "open" : ""}`} onClick={() => setOpen(true)} aria-label="Open the Agentic Workflow Pipeline" title="Agentic Workflow Pipeline" style={{ right: rightOffset }}>
          <Icon name="network" size={20} />
        </button>

        <div className={`ap-scrim ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
        <aside className={`ap-panel ${open ? "open" : ""}`} aria-hidden={!open}>
          <header className="ap-head">
            <span className="ap-bulb"><Icon name="network" size={16} /></span>
            <div className="ap-head-t">
              <span className="ap-h1">Agentic Workflow Pipeline</span>
              <span className="ap-h2">What's running in this experience — agents, actions, and the PAC gates they ask</span>
            </div>
            <button className="ap-close" onClick={() => setOpen(false)} aria-label="Collapse">
              <Stroke size={16} sw={2.4} children={<g><polyline points="13 6 19 12 13 18" /><polyline points="5 6 11 12 5 18" /></g>} />
            </button>
          </header>

          <div className="ap-body">
            <div className="ap-main">
              <div className="ap-active-head">
                <span className="ap-active-n">{String(wf.n).padStart(2, "0")}</span>
                <div className="ap-active-t">
                  <span className="ap-active-name">{wf.name}</span>
                  <span className="ap-active-sub">Trigger · {wf.trigger} → {wf.outcome}</span>
                </div>
                <div className="ap-ctrl">
                  {playing && shown < total
                    ? <span className="ap-status live"><span className="nd" /> Tracing · {Math.max(shown, 1)} of {total}</span>
                    : <span className="ap-status done"><Icon name="checkmark-filled" size={12} /> {total} steps · {wf.gate !== "—" ? wf.gate : "no PAC gate"}</span>}
                  <button className="ap-replay" onClick={() => { setPlaying(true); setRunKey(k => k + 1); }}>
                    <Stroke size={13} sw={2.4} children={<g><polyline points="1 4 1 10 7 10" /><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" /></g>} /> Replay
                  </button>
                </div>
              </div>

              <div className="ap-livebanner"><span className="nd" /> Live — this is the one workflow running right now on the customer front-end. It changes automatically as the customer interacts.</div>

              <div className="ap-meta">
                <span className="ap-meta-k">Systems · MCP</span>
                {wf.systems.map((s, i) => <span className="ap-meta-chip" key={i}>{s}</span>)}
                <span className="ap-meta-sep" />
                <span className="ap-meta-k">Human handoff</span>
                <span className="ap-meta-human">{wf.touchless ? "Touchless — no human in the loop" : wf.human}</span>
              </div>

              <div className="ap-explain"><span className="ai-glyph" style={{ width: 13, height: 13 }} /> Explainable — each node is one agent doing one thing. Click a node to expand its input/output schema, processing logs and configuration; the PAC gate shows the exact policy check it asked and how it resolved before acting.</div>

              <ApChain wf={wf} step={step} agents={agents} />

              <div className="ap-legend">
                <span className="ap-leg-k">Agents in this chain</span>
                {wf.chain.map(aid => (
                  <span className={`ap-leg ${liveAgent && liveAgent.id === aid ? "live" : ""}`} key={aid}>
                    <span className="ap-leg-dot" style={{ background: agents[aid].c }} /> {agents[aid].name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </React.Fragment>
    );
  }
  UI.AgenticPipeline = AgenticPipeline;
})();
