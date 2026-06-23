/* ============================================================
   Screen — The spine (agents on top, PAC underneath)
   The platform on one page.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Eyebrow, Button } = UI;

  function AgentCard({ a, toast }) {
    const stateCls = a.status === "done" ? "done" : a.status === "active" ? "active" : "queued";
    const stateTxt = a.status === "done" ? "Done" : a.status === "active" ? "Acting now" : "Queued";
    return (
      <div className={`agent-card ${a.status === "active" ? "is-active" : ""}`}>
        <div className="ac-top">
          <span className="ac-ico" style={{ background: a.tint, color: a.color }}><Icon name={a.icon} size={18} /></span>
          <span className="ac-n">AGENT 0{a.n}</span>
          <span className="ac-verb" style={{ background: a.tint, color: a.color }}>{a.verb}</span>
        </div>
        <div className="ac-name">{a.name}</div>
        <div className="ac-owns">{a.owns}</div>
        <div className="ac-line">“{a.line}”</div>
        <div className="ac-now">
          <span className={`nd ${stateCls}`} />
          <span className={`ac-state-${stateCls}`} style={{ fontWeight: 600 }}>{stateTxt}</span>
          <span style={{ color: "var(--fg-2)", marginLeft: 2 }}>· {a.now}</span>
        </div>
        <div className="ac-asks"><Icon name="document-chart" size={11} style={{ color: "#8A4FBF" }} /> asks PAC · {a.asks}</div>
      </div>
    );
  }

  function BoundCard({ b }) {
    return (
      <div className="bound-card">
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

  function PostureBand({ D }) {
    const { ChartCard, ChartCanvas, Gauge, chartTokens } = UI;
    const sc = D.spineCharts;
    const T = chartTokens;
    return (
      <div style={{ marginBottom: 22 }}>
        <div className="spine-eyebrow">
          <span className="se-l">Posture · this period</span>
          <span className="se-r">How much the spine handles in bounds, how it acts, and how fast — measured, not asserted.</span>
        </div>

        <ChartCard>
          <div className="spine-gauges">
            {sc.gauges.map((g, i) => <Gauge key={i} value={g.val} target={g.target} color={g.color} label={g.label} sub={g.sub} />)}
          </div>
        </ChartCard>

        <div className="spine-charts" style={{ marginTop: 14 }}>
          {/* Sankey — event flow */}
          <ChartCard title="How a month of signals flows through governance" sub="84 events · most clear PAC automatically; only exceptions reach a person, and each one lands with an owner.">
            <ChartCanvas type="sankey" height={260} sig="spine-sankey"
              data={{ datasets: [{
                data: sc.sankey,
                colorFrom: (c) => sankeyColor(c.dataset.data[c.dataIndex]?.from),
                colorTo: (c) => sankeyColor(c.dataset.data[c.dataIndex]?.to),
                colorMode: "gradient", borderWidth: 0, alpha: 0.55,
                labels: { Signals: "Signals", "Auto-handled": "Auto-handled", "Planner desk": "Planner desk", Finance: "Finance", Compliance: "Compliance", "Committed in bounds": "Committed", Approved: "Approved", Rejected: "Rejected", Escalated: "Escalated" },
                font: { size: 11, family: "Roboto", weight: 500 },
              }] }}
              options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.raw.from} → ${c.raw.to}: ${c.raw.flow}` } } } }} />
          </ChartCard>

          {/* Action-level doughnut */}
          <ChartCard title="How the spine acts" sub="PAC action level · share of decisions">
            <ChartCanvas type="doughnut" height={200} sig="spine-levels"
              data={{ labels: sc.actionLevels.map(a => a.label), datasets: [{ data: sc.actionLevels.map(a => a.n), backgroundColor: sc.actionLevels.map(a => a.color), borderWidth: 0 }] }}
              options={{ maintainAspectRatio: false, cutout: "58%", plugins: { legend: { position: "bottom", labels: { boxWidth: 9, padding: 8, font: { size: 10.5 } } }, tooltip: { callbacks: { label: (c) => `${c.label}: ${c.raw}%` } } } }} />
          </ChartCard>
        </div>

        {/* What the agents watch + anomaly pressure */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: 14, marginTop: 14, alignItems: "stretch" }}>
          <ChartCard title="What the agents watch" sub="Signal volume by source feed · one week. The Disruption agent reads EasyBook, Neos OCC, hotelier portals and advisory feeds together.">
            <ChartCanvas type="line" height={240} sig="spine-watch"
              data={{ labels: sc.watch.labels, datasets: sc.watch.series.map((s, i) => ({
                label: s.label, data: s.data, borderColor: s.color, backgroundColor: s.fill, fill: i === 0 ? "origin" : "-1", tension: .3, pointRadius: 0, borderWidth: 1.5 })) }}
              options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 9, padding: 9, font: { size: 10.5 } } } },
                scales: { x: { ...T.GRID, grid: { display: false } }, y: { ...T.GRID, stacked: true, beginAtZero: true } } }} />
          </ChartCard>
          <ChartCard title="Disruption pressure by feed × week" sub="Where signals broke planning assumptions · 12-week heatmap. Allotments and advisories run hottest.">
            <UI.Heatmap cols={sc.heatmap.cols} rows={sc.heatmap.rows} max={sc.heatmap.max} lowLabel="Calm" highLabel="Hot" />
          </ChartCard>
        </div>

        {/* 12-week trend line */}
        <div style={{ marginTop: 14 }}>
        <ChartCard title="Acted within the hour" sub="Share of events turned into an action inside 60 minutes · 12-week trend vs. 80% target" >
          <ChartCanvas type="line" height={180} sig="spine-trend"
            data={{ labels: sc.trend.labels, datasets: [
              { label: "Acted within the hour", data: sc.trend.acted, borderColor: "#29707A", backgroundColor: "rgba(41,112,122,.12)", fill: true, tension: .35, pointRadius: 2.5, pointBackgroundColor: "#29707A" },
              { label: "Target", data: sc.trend.labels.map(() => sc.trend.target), borderColor: "#94A3B8", borderDash: [4, 4], pointRadius: 0, fill: false },
            ] }}
            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } },
              scales: { x: { ...T.GRID, grid: { display: false } }, y: { ...T.GRID, min: 50, max: 100, ticks: { callback: (v) => v + "%", color: "#64748B" } } } }} />
        </ChartCard>
        </div>
      </div>
    );
  }

  function sankeyColor(node) {
    const map = { "Signals": "#5C6A73", "Auto-handled": "#29707A", "Planner desk": "#F59E0B", "Finance": "#3E8AC2", "Compliance": "#FF462D",
      "Committed in bounds": "#1F5A63", "Approved": "#16A34A", "Rejected": "#B82915", "Escalated": "#FF462D" };
    return map[node] || "#5BA2AE";
  }

  function LiveCustomerEvents({ setScreen }) {
    const AG = {
      concierge: { n: "AlpiGPT Concierge", c: "#6B36A8", t: "#F0E6FA", icon: "chat-bot" },
      deal: { n: "Pricing & Proposal", c: "#B45309", t: "#FEF3E2", icon: "network" },
      supply: { n: "Inventory & Allotment", c: "#0E7490", t: "#E0F2F4", icon: "network" },
      compliance: { n: "Compliance / PAC", c: "#15803D", t: "#E7F6EC", icon: "anomaly" },
      regradar: { n: "TravelRadar", c: "#B45309", t: "#FEF3E2", icon: "anomaly" },
    };
    const EVENTS = [
      { evt: "EVT-7762", trace: "KAF-5B70-1180", cust: "Rossi booking BK 88412 · wing closure hit Jaz Mirabel", ts: "live · 18:42",
        steps: [
          ["supply", "Re-pointed 38 rooms to the guaranteed block by covenant priority"],
          ["compliance", "PAC check: strategic-tier agency covenant preserved — allowed"],
          ["concierge", "Notified Rossi Travel: dates held at 14 Aug"],
        ] },
      { evt: "EVT-7758", trace: "KAF-5B70-1180", cust: "Rossi changed the booking — grandparents joining, +2 pax", ts: "live · 09:21",
        steps: [
          ["concierge", "Received the change, opened the case"],
          ["deal", "Re-priced & re-ran availability against agency terms"],
          ["supply", "Re-committed the rooms — 14 Aug, 92% confidence"],
        ] },
      { evt: "EVT-7770", trace: "KAF-5B70-1180", cust: "ATC strike risk on the Bianchi rotation", ts: "live · 14:05",
        steps: [
          ["supply", "Digital twin predicted a 4-hour re-time"],
          ["regradar", "No entry-rule impact on the re-time"],
          ["concierge", "Proactively notified Rossi Travel with a recovery option"],
        ] },
      { evt: "EVT-7741", trace: "KAF-9F2A-4471", cust: "Rossi entry-rules case · EG e-visa update", ts: "live · 31 May",
        steps: [
          ["regradar", "Detected the e-visa processing change, mapped to the Sharm programme"],
          ["compliance", "PAC: informational — no consular confirmation implied; bundle refresh queued"],
          ["concierge", "Surfaced a proactive alert on the Bianchi booking"],
        ] },
    ];
    const [idx, setIdx] = React.useState(0);
    const [step, setStep] = React.useState(0);
    const [playing, setPlaying] = React.useState(true);
    const tm = React.useRef([]);
    const ev = EVENTS[idx];
    React.useEffect(() => {
      tm.current.forEach(clearTimeout); tm.current = [];
      if (!playing) return;
      setStep(0);
      ev.steps.forEach((_, i) => tm.current.push(setTimeout(() => setStep(i), 900 * i)));
      tm.current.push(setTimeout(() => setIdx(x => (x + 1) % EVENTS.length), 900 * ev.steps.length + 1500));
      return () => tm.current.forEach(clearTimeout);
    }, [idx, playing]);

    return (
      <div className="lce">
        <div className="lce-head">
          <span className="lce-l"><span className="dot" /> Live · customer events through the agents</span>
          <span className="lce-sub">Each event a customer triggers, and exactly what each agent does about it — in real time, governed by PAC.</span>
          <div className="lce-ctl">
            <button onClick={() => setPlaying(p => !p)}>{playing ? "Pause" : "Play"}</button>
            <span className="lce-tabs">{EVENTS.map((e, i) => <button key={i} className={i === idx ? "on" : ""} onClick={() => { setIdx(i); }} title={e.evt} />)}</span>
          </div>
        </div>
        <div className="lce-body">
          <div className="lce-cust">
            <div className="ce-id">{ev.evt} · trace {ev.trace}</div>
            <div className="ce-t"><Icon name="group" size={14} /> {ev.cust}</div>
            <div className="ce-ts">{ev.ts}</div>
            <div className="ce-foot">customer event → agents acting</div>
          </div>
          <div className="lce-arrow">→</div>
          <div className="lce-steps">
            {ev.steps.map((s, i) => {
              const a = AG[s[0]];
              const on = i <= step;
              const cur = i === step;
              return (
                <div className={`lce-step ${on ? "on" : ""} ${cur ? "cur" : ""}`} key={i}>
                  <span className="sa" style={on ? { background: a.t, color: a.c } : null}><Icon name={a.icon} size={14} /></span>
                  <div className="sd"><b>{a.n}</b><span>{s[1]}</span></div>
                  <span className="sp">{on ? <Icon name="checkmark-filled" size={14} /> : <span className="q" />}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lce-foot"><Icon name="information" size={12} /> The same events Rossi Travel sees in their booking experience — one record, both lenses. <a onClick={() => setScreen("flow")}>Open TravelRadar ↗</a> · <a onClick={() => setScreen("governance")}>PAC decisions ↗</a></div>
      </div>
    );
  }

  function AgenticRoster() {
    const D = window.D;
    const agents = D.agenticAgentList;
    const countFor = (id) => D.agenticWorkflows.filter(w => w.chain.includes(id)).length;
    return (
      <div className="ag-roster">
        {agents.map(a => (
          <div className="ag-card" key={a.id} style={{ borderTopColor: a.c }}>
            <div className="ag-top">
              <span className="ag-ico" style={{ background: a.tint, color: a.c }}><Icon name={a.icon} size={17} /></span>
              <span className="ag-name">{a.short}</span>
            </div>
            <div className="ag-full">{a.name}</div>
            <div className="ag-owns">{a.owns}</div>
            <div className="ag-foot"><span className="ag-dot" style={{ background: a.c }} /> in {countFor(a.id)} workflow{countFor(a.id) === 1 ? "" : "s"}</div>
          </div>
        ))}
      </div>
    );
  }

  function WorkflowMatrix({ setScreen }) {
    const D = window.D;
    const agents = D.agenticAgents;
    const [active, setActive] = UI.useActiveWf();
    function trace(id) { setActive(id); setScreen("flow"); }
    const GATE = (g) => g === "—" ? <span className="wm-none">none</span> : g;
    return (
      <div className="wm-wrap">
        <table className="wm-table">
          <thead>
            <tr>
              <th>#</th><th>Workflow</th><th>Trigger</th><th>Agent chain</th><th>Systems · MCP</th><th>PAC gate</th><th>Human handoff</th><th>Customer outcome</th><th></th>
            </tr>
          </thead>
          <tbody>
            {D.agenticWorkflows.map(w => (
              <tr key={w.id} className={w.id === active ? "on" : ""} onClick={() => setActive(w.id)}>
                <td className="wm-n">{String(w.n).padStart(2, "0")}</td>
                <td className="wm-name">{w.name}</td>
                <td className="wm-trig">{w.trigger}</td>
                <td>
                  <span className="wm-chain">
                    {w.chain.map((aid, i) => (
                      <React.Fragment key={aid}>
                        <span className="wm-chip" style={{ background: agents[aid].tint, color: agents[aid].c }} title={agents[aid].name}><Icon name={agents[aid].icon} size={11} /> {agents[aid].short}</span>
                        {i < w.chain.length - 1 && <span className="wm-arr">›</span>}
                      </React.Fragment>
                    ))}
                  </span>
                </td>
                <td className="wm-sys">{w.systems.join(" · ")}</td>
                <td className="wm-gate">{GATE(w.gate)}</td>
                <td className="wm-human">{w.touchless ? <span className="wm-touchless">Touchless</span> : w.human}</td>
                <td className="wm-out">{w.outcome}</td>
                <td><button className="wm-trace" onClick={(e) => { e.stopPropagation(); trace(w.id); }}>Trace <Icon name="arrow-up-right" size={11} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function ScreenSpine({ setScreen, naphtha, setNaphtha }) {
    const D = window.D;
    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Two platforms · one open foundation</Eyebrow>
            <h1 style={{ marginTop: 6 }}>The agentic spine</h1>
            <div className="ph-sub">A small team of agents sits inside Alpitour's season-planning loop, watching every signal and acting only within the bounds Finance, Operations and Compliance have set. KAF runs the agents. PAC holds the rules. Every agent action asks the policy engine before it commits.</div>
          </div>
          <div className="ph-spacer" />
          <Button variant="prim" icon="anomaly" onClick={() => setScreen("flow")}>See it act → allotment disruption</Button>
        </div>

        {/* Posture band — Shidoka charts */}
        <PostureBand D={D} />

        {/* The 11 workflows — the matrix */}
        <div className="spine-eyebrow">
          <span className="se-l">The workflows · {D.agenticWorkflows.length} end-to-end</span>
          <span className="se-r">Trigger → agent chain → systems → PAC gate → human handoff → customer outcome. Select one, or <strong style={{ color: "var(--k-spruce-70)" }}>open it in the floating pipeline</strong> to watch it run.</span>
        </div>
        <WorkflowMatrix setScreen={setScreen} />

        {/* Shared foundation */}
        <div className="foundation">
          <span className="fd-lbl">Shared open spine</span>
          {D.foundation.map((f, i) => <span className="fd-chip" key={i}>{f}</span>)}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-muted)" }}>every action lands in system of record · audit attached</span>
        </div>
        <div className="connector-row">
          {D.connectors.map(c => (
            <div className="connector" key={c.id}>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span className="cn-id">{c.id}</span>
                <span className="cn-sub">{c.sub}</span>
              </span>
              <span className="cn-io">{c.io}</span>
            </div>
          ))}
        </div>

        {/* PAC rules — the policy bundle the agents ask, in plain terms */}
        <div className="spine-eyebrow" style={{ marginTop: 18 }}>
          <span className="se-l">PAC rules · the bundle every action asks</span>
          <span className="se-r">Compiled from the playbook · {window.MACHINE ? "" : ""}198 policies · 412 tests pass</span>
        </div>
        <div className="pacrules">
          {[
            { id: "OPS-auto-ticket-EG", bound: "Ops SOPs", tone: "ops", policy: "Monitoring may open a ticket and alert the owner automatically — no sign-off needed." },
            { id: "FIN-margin-floor-IT", bound: "Commercial", tone: "fin", policy: "Margin-floor breaches are flagged to the yield desk. An agent never moves price on its own." },
            { id: "PROM-covenant-rossi", bound: "Brand & promise", tone: "prod", policy: "A re-accommodation must preserve room class, board and family amenities for strategic-tier agencies." },
            { id: "PROM-agency-commitment", bound: "Brand & promise", tone: "prod", policy: "An agency-visible commitment can't originate from an agent — it routes to the trade desk." },
            { id: "TRV-covenant-EU", bound: "Travel compliance", tone: "trade", policy: "A covenant-affecting commit must be confirmed by the planner who owns the desk." },
            { id: "PROM-forecast-version", bound: "Brand & promise", tone: "prod", policy: "Internal forecast updates are auto-authorized when versioned and audited." },
          ].map(r => (
            <div className="pacrule" key={r.id}>
              <span className={`pr-id ${r.tone}`}>{r.id}</span>
              <span className="pr-policy">{r.policy}</span>
              <span className="pr-bound">{r.bound}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  UI.ScreenSpine = ScreenSpine;
})();
