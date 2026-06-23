/* ============================================================
   Spine runner — the live FE↔BE interaction for Layer 01 ↔ PAC.
   Agents plan → dispatch → act; every act asks PAC and gets back
   allow / flag / deny / route-to-human. Autoplay walks the four
   agents through the disruption sequence; the user can pause, step,
   reset, and approve/reject the human-in-the-loop gate. The PAC
   bound an agent is asking lights up in Layer 02.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Button, AiSpinner } = UI;
  const check = <Stroke size={12} sw={3} children={<polyline points="20 6 9 17 4 12" />} />;

  const OUT = {
    allow: { label: "Allowed", cls: "allow", icon: "checkmark-filled", note: "auto-action within bounds" },
    flag:  { label: "Flagged", cls: "flag", icon: "warning-alt", note: "allowed, logged & alerted" },
    deny:  { label: "Denied", cls: "deny", icon: "error-filled", note: "blocked by policy" },
    route: { label: "Routed to human", cls: "route", icon: "group", note: "needs sign-off" },
  };

  // Flatten all agents' runs into an ordered frame list.
  function buildFrames(order, runs) {
    const f = [];
    order.forEach(id => {
      f.push({ id, kind: "plan" });
      f.push({ id, kind: "dispatch" });
      runs[id].checks.forEach((c, ci) => {
        f.push({ id, kind: "act", ci });
        f.push({ id, kind: "pac", ci });
        f.push({ id, kind: "verdict", ci });
      });
      f.push({ id, kind: "end" });
    });
    return f;
  }
  const DELAY = { plan: 750, dispatch: 800, act: 750, pac: 1150, verdict: 700, end: 450 };
  const fkey = (fr) => `${fr.id}:${fr.ci}`;
  const ts = (i) => { const base = 8 * 3600 + 30 * 60; const s = base + i * 7; const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60; return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`; };

  function PacGate({ chk, state, decision, onApprove, onReject, setScreen }) {
    // state: 'evaluating' | 'done'
    const o = OUT[chk.outcome];
    const routed = chk.outcome === "route";
    const settled = routed ? decision : (state === "done");
    return (
      <div className={`pac-gate ${state === "done" ? "settled" : ""}`}>
        <div className="tcc-head">
          <span className="tcc-icon"><Icon name="document-chart" size={13} /></span>
          <span className="tcc-title">asks PAC · <span className="tool">{chk.tool}</span></span>
          {state === "evaluating"
            ? <span className="pac-eval"><AiSpinner size={14} /> evaluating</span>
            : <span className={`pac-out ${decision === "rejected" ? "deny" : o.cls}`}><Icon name={decision === "rejected" ? "error-filled" : o.icon} size={12} /> {decision === "approved" ? "Approved" : decision === "rejected" ? "Rejected" : o.label}</span>}
        </div>
        <div className="pac-q"><span className="pac-rule">{chk.rule}</span> · “{chk.q}”</div>
        {(() => {
          const b = (window.D.bounds || []).find(x => x.id === chk.bound);
          if (!b) return null;
          return (
            <div className="pac-bound">
              <span className="pb-ic"><Icon name={b.icon} size={13} /></span>
              <span className="pb-main">
                <span className="pb-name">Bounds 0{b.n} · {b.name}</span>
                <span className="pb-desc">{b.desc}</span>
              </span>
              <span className="pb-meta"><span className="pb-rules">{b.rules} rules</span><span className="pb-owner">{b.owner}</span></span>
            </div>
          );
        })()}
        {state === "done" && (
          <React.Fragment>
            <div className="pac-verdict">{chk.verdict}</div>
            {routed && !decision && (
              <div className="hir">
                <div className="hir-top"><Icon name="group" size={13} /> Waiting on {chk.owner}</div>
                <div className="hir-body">A covenant-affecting commit needs a human. Approve to let the agent write, or reject to hold.</div>
                <div className="hir-acts">
                  <button className="hir-btn approve" onClick={onApprove}><Icon name="checkmark-filled" size={14} /> Approve &amp; commit</button>
                  <button className="hir-btn reject" onClick={onReject}>Reject</button>
                  {setScreen && <button className="hir-link" onClick={() => setScreen("queue")}>Open in planner queue →</button>}
                </div>
              </div>
            )}
            {(!routed || decision) && (
              <div className={`pac-result ${chk.outcome === "deny" ? "neg" : decision === "rejected" ? "neg" : "pos"}`}>
                <Icon name={chk.outcome === "deny" || decision === "rejected" ? "information" : "checkmark-filled"} size={13} />
                {decision === "rejected" ? chk.rejected : chk.result}
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }

  function StlRow({ state, ph, label, tsv, spin }) {
    return (
      <div className={`stl-step ${state}`}>
        <span className="rail"><span className="marker" /></span>
        <span><span className="label">{ph ? <b style={{ color: "var(--fg-muted)", fontWeight: 700, fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", marginRight: 7 }}>{ph}</b> : null}{label}</span></span>
        <span className="ts">{spin ? <AiSpinner size={13} /> : tsv}</span>
      </div>
    );
  }

  function AgentRunBody({ a, prog, decisions, onApprove, onReject, setScreen }) {
    const run = window.D.agentRuns[a.id];
    // prog: { reveal(kind, ci) -> 'hidden'|'active'|'done', baseTs }
    const rows = [];
    let tsi = prog.base;
    const planSt = prog.state("plan");
    const dispSt = prog.state("dispatch");
    if (planSt !== "hidden") rows.push(<StlRow key="p" state={planSt === "active" ? "active" : "done"} ph="Plan" label={run.steps[0].t} tsv={ts(tsi)} spin={planSt === "active"} />);
    if (dispSt !== "hidden") rows.push(<StlRow key="d" state={dispSt === "active" ? "active" : "done"} ph="Dispatch" label={run.steps[1].t} tsv={ts(tsi + 1)} spin={dispSt === "active"} />);

    const blocks = [];
    run.checks.forEach((chk, ci) => {
      const actSt = prog.state("act", ci);
      const pacSt = prog.state("pac", ci);
      const verSt = prog.state("verdict", ci);
      if (actSt === "hidden") return;
      blocks.push(
        <div className="ac-check" key={ci}>
          <StlRow state={actSt === "active" ? "active" : "done"} ph="Act" label={chk.act} tsv={ts(tsi + 2 + ci * 3)} spin={actSt === "active"} />
          {pacSt !== "hidden" && (
            <PacGate chk={chk}
              state={pacSt === "active" || (pacSt === "done" && verSt === "hidden") ? "evaluating" : "done"}
              decision={decisions[`${a.id}:${ci}`]}
              onApprove={() => onApprove(a.id, ci)} onReject={() => onReject(a.id, ci)}
              setScreen={setScreen} />
          )}
        </div>
      );
    });

    return (
      <div className="ac-run">
        <div className="stl">{rows}</div>
        {blocks}
      </div>
    );
  }

  function AgentSummaryCard({ a, running, statusOverride, outcomes, onOpen, isOpen }) {
    const st = statusOverride || a.status;
    const stateCls = st === "done" ? "done" : st === "waiting" ? "waiting" : st === "active" ? "active" : st === "ready" ? "ready" : "queued";
    const stateTxt = st === "done" ? "Done" : st === "active" ? "Acting now" : st === "waiting" ? "Waiting on a human" : st === "ready" ? "Ready" : "Queued";
    return (
      <div className={`agent-card runnable simple ${st === "active" ? "is-active" : ""} ${running ? "is-running" : ""} ${isOpen ? "is-open" : ""}`}>
        <button className="ac-toggle" onClick={onOpen} aria-expanded={isOpen}>
          <div className="ac-top">
            <span className="ac-ico" style={{ background: a.tint, color: a.color }}><Icon name={a.icon} size={18} /></span>
            <span className="ac-n">AGENT 0{a.n}</span>
            <span className="ac-verb" style={{ background: a.tint, color: a.color }}>{a.verb}</span>
          </div>
          <div className="ac-name">{a.name}</div>
          <div className="ac-line">“{a.line}”</div>
          <div className="ac-now">
            <span className={`nd ${stateCls}`} />
            <span className={`ac-state-${stateCls}`} style={{ fontWeight: 600 }}>{stateTxt}</span>
          </div>
        </button>
        <div className="ac-foot">
          {outcomes.length
            ? <span className="ac-outs">{outcomes.map((o, i) => <span className={`pac-out ${o.cls}`} key={i}><Icon name={o.icon} size={10} /> {o.label}</span>)}</span>
            : <span className="ac-outs-empty">{running ? "running…" : ""}</span>}
          <button className={`ac-invest ${isOpen ? "on" : ""}`} onClick={onOpen}>
            {isOpen ? "Investigating" : "Explain"}
            <Stroke size={13} sw={2.4} children={<polyline points="9 6 15 12 9 18" />} />
          </button>
        </div>
      </div>
    );
  }

  // Side investigation panel — the explainability that used to render inline.
  function InvestigatePanel({ a, status, prog, decisions, onApprove, onReject, onClose, setScreen }) {
    const open = !!a;
    const st = status || (a && a.status);
    const asbCls = st === "active" ? "streaming" : st === "waiting" ? "waiting" : st === "done" ? "done" : "thinking";
    const asbTxt = st === "done" ? "Done" : st === "active" ? "Acting now" : st === "waiting" ? "Waiting on a human" : "Queued";
    return (
      <React.Fragment>
        <div className={`invest-scrim ${open ? "open" : ""}`} onClick={onClose} />
        <aside className={`invest-panel ${open ? "open" : ""}`} aria-hidden={!open}>
          {a && (
            <React.Fragment>
              <header className="invest-head">
                <span className="ac-ico" style={{ background: a.tint, color: a.color }}><Icon name={a.icon} size={18} /></span>
                <div className="invest-h-t">
                  <span className="invest-h1">Agent 0{a.n} · {a.verb}</span>
                  <span className="invest-h2">{a.name}</span>
                </div>
                <button className="invest-x" onClick={onClose} aria-label="Close"><Icon name="close" size={16} /></button>
              </header>
              <div className="invest-sub"><Icon name="lightbulb" size={12} /> Explainability — every step this agent ran, and each policy check it asked PAC.</div>
              <div className="invest-body">
                <div className="invest-about">
                  <div className="ia-line">“{a.line}”</div>
                  <div className="ia-grid">
                    <div className="ia-kv"><span className="ia-k">Owns</span><span className="ia-v">{a.owns}</span></div>
                    <div className="ia-kv"><span className="ia-k">Status</span><span className="ia-v">{asbTxt} · {a.now}</span></div>
                    <div className="ia-kv"><span className="ia-k">Asks PAC</span><span className="ia-v">{a.asks}</span></div>
                  </div>
                </div>
                <div className={`asb ${asbCls}`}>
                  <span className="dot" />
                  <span className="label">{asbTxt}</span>
                  <span className="meta">KAF · {a.id}</span>
                </div>
                <AgentRunBody a={a} prog={prog} decisions={decisions} onApprove={onApprove} onReject={onReject} setScreen={setScreen} />
              </div>
            </React.Fragment>
          )}
        </aside>
      </React.Fragment>
    );
  }

  function BoundCard({ b, linked, linkedBy }) {
    return (
      <div className={`bound-card ${linked ? "is-linked" : ""}`}>
        {linked && <span className="bc-link-tag"><Icon name="arrow-up-right" size={11} /> {linkedBy}</span>}
        <div className="bc-top">
          <span className="bc-ico"><Icon name={b.icon} size={16} /></span>
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".1em", color: "#9A6FC4" }}>BOUNDS 0{b.n}</span>
          <span className="bc-rules">{b.rules} rules</span>
        </div>
        <div className="bc-name">{b.name}</div>
        <div className="bc-desc">{b.desc}</div>
        <div className="bc-owner">{b.owner}</div>
      </div>
    );
  }

  function SpineRunner({ D, setScreen, naphtha = {}, setNaphtha }) {
    const order = D.spineRunOrder, runs = D.agentRuns;
    const frames = React.useMemo(() => buildFrames(order, runs), []);
    const [step, setStep] = React.useState(-1);          // index of latest revealed frame
    const [phase, setPhase] = React.useState("idle");     // idle | playing | paused | waiting | done
    const [rawDecisions, setDecisions] = React.useState({}); // `${id}:${ci}` -> approved|rejected
    const [openAgent, setOpenAgent] = React.useState(null); // side investigation panel
    const [dagOpen, setDagOpen] = React.useState(false); // workflow pipeline panel
    const timer = React.useRef(null);

    const cur = step >= 0 ? frames[step] : null;
    const playing = phase === "playing";
    const live = phase !== "idle";

    // autoplay driver
    React.useEffect(() => {
      if (phase !== "playing") return;
      if (step >= frames.length - 1) { setPhase("done"); return; }
      const nextFr = frames[step + 1];
      const d = DELAY[nextFr.kind] || 700;
      timer.current = setTimeout(() => {
        setStep(s => s + 1);
        if (nextFr.kind === "verdict") {
          const chk = runs[nextFr.id].checks[nextFr.ci];
          if (chk.outcome === "route" && !decisions[fkey(nextFr)]) setPhase("waiting");
        }
        if (step + 1 >= frames.length - 1) setPhase("done");
      }, d);
      return () => clearTimeout(timer.current);
    }, [phase, step]);

    function play() {
      if (phase === "done" || phase === "idle") { setStep(-1); setDecisions({}); setOpenAgent(order[0]); setPhase("playing"); }
      else setPhase("playing");
    }
    function pause() { setPhase("paused"); }
    function reset() { clearTimeout(timer.current); setStep(-1); setPhase("idle"); setDecisions({}); setOpenAgent(null); }
    function stepOnce() {
      if (step >= frames.length - 1) return;
      const nextFr = frames[step + 1];
      setStep(s => s + 1);
      if (phase === "idle") setPhase("paused");
      if (nextFr.kind === "verdict") {
        const chk = runs[nextFr.id].checks[nextFr.ci];
        if (chk.outcome === "route" && !decisions[fkey(nextFr)]) setPhase("waiting");
      }
      if (step + 1 >= frames.length - 1) setPhase("done");
    }
    function decide(id, ci, val) {
      setDecisions(d => ({ ...d, [`${id}:${ci}`]: val }));
      // the inventory route gate IS the planner sign-off — link both surfaces
      if (id === "inventory" && setNaphtha) setNaphtha(n => ({ ...n, secured: val === "approved" }));
      if (phase === "waiting") setPhase("playing");
    }
    // merge the shared sign-off: if the reference flow already signed off, the inventory gate reads approved
    const decisions = React.useMemo(() => {
      if (naphtha.secured && !rawDecisions["inventory:0"]) return { ...rawDecisions, "inventory:0": "approved" };
      return rawDecisions;
    }, [rawDecisions, naphtha.secured]);

    // map global step → per-agent progress descriptor
    function agentProgress(id) {
      const fr = frames;
      const idxOf = (kind, ci) => fr.findIndex(x => x.id === id && x.kind === kind && (ci === undefined || x.ci === ci));
      const base = order.indexOf(id) * 0; // ts handled per-row; keep simple
      const staticAll = phase === "idle" || phase === "done";
      const stateFor = (kind, ci) => {
        if (staticAll) return "done";
        const gi = idxOf(kind, ci);
        if (gi === -1 || step < gi) return "hidden";
        if (gi === step) return "active";
        return "done";
      };
      return { state: stateFor, base: order.indexOf(id) * 8 };
    }

    // which agent is active during a run
    const activeAgent = live && cur ? cur.id : null;
    // active PAC bound (when on a pac/verdict frame)
    let activeBound = null, activeBoundBy = null;
    if (live && cur && (cur.kind === "pac" || cur.kind === "verdict")) {
      const chk = runs[cur.id].checks[cur.ci];
      activeBound = chk.bound;
      activeBoundBy = `Agent 0${D.agents.find(a => a.id === cur.id).n} asks`;
    }

    // follow the active agent in the panel while it's open during a live run
    React.useEffect(() => {
      if ((phase === "playing" || phase === "paused") && openAgent && activeAgent && openAgent !== activeAgent) setOpenAgent(activeAgent);
    }, [activeAgent, phase]);
    // a decision gate forces the panel open so Approve/Reject is reachable
    React.useEffect(() => {
      if (phase === "waiting" && activeAgent) setOpenAgent(activeAgent);
    }, [phase, activeAgent]);
    function statusFor(id) {
      if (!live) return "ready"; // neutral until the spine runs
      const aFrames = frames.filter(f => f.id === id);
      const firstGi = frames.indexOf(aFrames[0]);
      const lastGi = frames.indexOf(aFrames[aFrames.length - 1]);
      if (step < firstGi) return "queued";
      if (step >= lastGi) {
        // settled — if it had a route rejected, still "done" (handled)
        return "done";
      }
      if (id === activeAgent && phase === "waiting") return "waiting";
      return "active";
    }

    const total = order.length;
    const doneCount = order.filter(id => {
      const aFrames = frames.filter(f => f.id === id);
      const lastGi = frames.indexOf(aFrames[aFrames.length - 1]);
      return step >= lastGi;
    }).length;

    const agentsSorted = order.map(id => D.agents.find(a => a.id === id));

    // resolved PAC outcomes per agent (for the compact card chips)
    function agentOutcomes(id) {
      if (phase === "idle") return []; // no use-case outcomes until the spine runs
      const prog = agentProgress(id);
      return runs[id].checks.map((chk, ci) => {
        if (prog.state("verdict", ci) === "hidden") return null;
        const dec = decisions[`${id}:${ci}`];
        if (chk.outcome === "route") {
          if (dec === "approved") return { label: "Approved", cls: "allow", icon: "checkmark-filled" };
          if (dec === "rejected") return { label: "Rejected", cls: "deny", icon: "error-filled" };
          return { label: "Routed", cls: "route", icon: "group" };
        }
        const o = OUT[chk.outcome];
        return { label: o.label, cls: o.cls, icon: o.icon };
      }).filter(Boolean);
    }
    const panelAgent = openAgent ? D.agents.find(a => a.id === openAgent) : null;

    return (
      <div>
        {/* Control bar */}
        <div className="spine-ctrl">
          <div className="sc-left">
            {phase === "playing"
              ? <button className="sc-btn primary" onClick={pause}><Stroke size={14} sw={2.4} children={<g><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></g>} /> Pause</button>
              : <button className="sc-btn primary" onClick={play}><Stroke size={14} sw={2.4} children={<polygon points="6 4 20 12 6 20 6 4" />} /> {phase === "idle" ? "Run the spine" : phase === "done" ? "Replay" : "Resume"}</button>}
            <button className="sc-btn" onClick={stepOnce} disabled={phase === "playing" || phase === "done" || phase === "waiting"}><Stroke size={14} sw={2.4} children={<g><polygon points="5 4 13 12 5 20 5 4" /><line x1="18" y1="4" x2="18" y2="20" /></g>} /> Step</button>
            <button className="sc-btn" onClick={reset} disabled={phase === "idle"}><Stroke size={14} sw={2.4} children={<g><polyline points="1 4 1 10 7 10" /><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" /></g>} /> Reset</button>
          </div>
          <div className="sc-mid">
            {phase === "waiting"
              ? <span className="sc-status waiting"><span className="nd active" /> Paused — a human decision is required below</span>
              : phase === "playing" ? <span className="sc-status live"><span className="nd active" /> Live · agent {Math.min(doneCount + 1, total)} of {total}</span>
              : phase === "done" ? <span className="sc-status done">{check} Sequence complete · {total} agents, 4 PAC outcomes</span>
              : phase === "paused" ? <span className="sc-status">Paused · agent {Math.min(doneCount + 1, total)} of {total}</span>
              : <span className="sc-status idle">Press play — watch the four agents run the Jaz Mirabel allotment cut, each asking PAC before it commits.</span>}
          </div>
          <div className="sc-legend">
            {["allow", "flag", "deny", "route"].map(k => (
              <span className={`sc-leg ${k}`} key={k}><span className="dot" /> {OUT[k].label}</span>
            ))}
          </div>
        </div>

        {/* Layer 01 — agents */}
        <div className="spine-eyebrow">
          <span className="se-l">Agentic workflow</span>
          <span className="se-r">Plan, dispatch, act, stream logs. Click any agent to investigate, or run the whole sequence.</span>
          <button className="wf-open" onClick={() => setDagOpen(true)}><Icon name="network" size={13} /> Workflow pipeline</button>
        </div>
        <div className="agent-grid">
          {agentsSorted.map(a => (
            <AgentSummaryCard key={a.id} a={a}
              running={live && a.id === activeAgent}
              outcomes={agentOutcomes(a.id)}
              onOpen={() => setOpenAgent(openAgent === a.id ? null : a.id)}
              isOpen={openAgent === a.id}
              statusOverride={statusFor(a.id)} />
          ))}
        </div>

        {/* Layer 02 governance — now surfaced per action inside the explain card */}
        <div className={`pac-bridge ${activeBound ? "is-live" : ""}`}>
          <span className="pb-line" />
          <span className="pb-txt"><Icon name="document-chart" size={13} /> Every action checks policy · open an agent to see the bound it asks</span>
          <span className="pb-line" />
        </div>

        {/* Side investigation panel — explainability, not inline */}
        <InvestigatePanel a={panelAgent}
          status={panelAgent ? statusFor(panelAgent.id) : null}
          prog={panelAgent ? agentProgress(panelAgent.id) : null}
          decisions={decisions}
          onApprove={(id, ci) => decide(id, ci, "approved")}
          onReject={(id, ci) => decide(id, ci, "rejected")}
          onClose={() => setOpenAgent(null)}
          setScreen={setScreen} />

        {/* Agentic Workflow Pipeline — static DAG side panel */}
        <UI.WorkflowDAG open={dagOpen} onClose={() => setDagOpen(false)} />
      </div>
    );
  }
  UI.SpineRunner = SpineRunner;
})();
