/* ============================================================
   Screen — Planner queue (dashboard)
   The operator's command surface. Posture KPIs (clickable filters),
   weekly throughput, exception routing mix, and a filterable
   exception table — each row opens a detail drawer with the
   evidence already attached. The supply event routes to the flow.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Eyebrow, Button, Badge, Sev, SourceAttribution } = UI;

  const FILTERS = [
    { id: "all", label: "All events" },
    { id: "waiting", label: "Waiting on you" },
    { id: "routed", label: "Routed to a team" },
    { id: "auto", label: "Auto-handled" },
  ];

  function stateTone(state) {
    if (/Blocked/.test(state)) return "var(--k-status-error-110)";
    if (/Awaiting/.test(state)) return "var(--k-status-warning-110)";
    if (/Auto/.test(state)) return "var(--k-status-success-110)";
    return "var(--k-spruce-70)";
  }
  function matches(q, f) {
    if (f === "all") return true;
    if (f === "open") return q.cat !== "auto";
    if (f === "routed") return q.cat === "routed" || q.cat === "waiting";
    return q.cat === f;
  }

  // 12-week stacked throughput bars (Chart.js)
  function Throughput({ data }) {
    const { ChartCard, ChartCanvas, chartTokens } = UI;
    const T = chartTokens;
    return (
      <ChartCard title="Weekly throughput" sub="Events the spine cleared in bounds vs. routed to a human · 12-week trend"
        legend={[{ c: "#29707A", t: "Auto-handled" }, { c: "#F59E0B", t: "Routed" }]}>
        <ChartCanvas type="bar" height={210} sig="qthroughput"
          data={{ labels: data.map(d => d.wk), datasets: [
            { label: "Auto-handled", data: data.map(d => d.auto), backgroundColor: "#29707A", borderRadius: 2, stack: "s" },
            { label: "Routed", data: data.map(d => d.routed), backgroundColor: "#F59E0B", borderRadius: 2, stack: "s" },
          ] }}
          options={{ maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { x: { ...T.GRID, stacked: true, grid: { display: false } }, y: { ...T.GRID, stacked: true, beginAtZero: true } } }} />
      </ChartCard>
    );
  }

  // Routing mix doughnut (Chart.js)
  function RoutingMix({ data }) {
    const { ChartCard, ChartCanvas } = UI;
    return (
      <ChartCard title="Where this week's events went" sub="19 events · only the exceptions reach a person">
        <ChartCanvas type="doughnut" height={210} sig="qrouting"
          data={{ labels: data.map(d => d.label), datasets: [{ data: data.map(d => d.n), backgroundColor: data.map(d => d.color), borderWidth: 0 }] }}
          options={{ maintainAspectRatio: false, cutout: "62%", plugins: { legend: { position: "right", labels: { boxWidth: 9, padding: 10, font: { size: 11 } } } } }} />
      </ChartCard>
    );
  }

  // Events by region — polar area (Chart.js)
  function RegionMix({ data }) {
    const { ChartCard, ChartCanvas } = UI;
    return (
      <ChartCard title="Events by region" sub="Where this month's signals originated">
        <ChartCanvas type="polarArea" height={210} sig="qregion"
          data={{ labels: data.map(d => d.label), datasets: [{ data: data.map(d => d.n), backgroundColor: data.map(d => d.color + "cc"), borderWidth: 0 }] }}
          options={{ maintainAspectRatio: false, plugins: { legend: { position: "right", labels: { boxWidth: 9, padding: 9, font: { size: 10.5 } } } },
            scales: { r: { grid: { color: "#F1F5F9" }, angleLines: { color: "#E2E8F0" }, ticks: { display: false, backdropColor: "transparent" } } } }} />
      </ChartCard>
    );
  }

  function ScreenQueue({ setScreen, toast }) {
    const D = window.D;
    const dash = D.queueDash;
    const [filter, setFilter] = React.useState("all");
    const [openId, setOpenId] = React.useState(null);

    const rows = D.queue.filter(q => matches(q, filter));
    const detail = D.queue.find(q => q.id === openId);

    function openRow(q) {
      setOpenId(q.id);
    }
    function goFlow() {
      setOpenId(null);
      setScreen("flow");
    }

    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Operations · the planner stays in charge</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Planner queue</h1>
            <div className="ph-sub">The platform handles the in-bounds work and routes only the edge cases — each arriving with the cause, the agents that acted, and the evidence already attached. Click a metric to filter, or open any event for the full picture.</div>
          </div>
        </div>

        {/* KPI grid — clickable filters */}
        <div className="dash-kpis">
          {dash.kpis.map(k => {
            const active = filter === k.filter && k.filter !== "all";
            return (
              <button className={`kpi-tile dash-kpi ${active ? "on" : ""}`} key={k.id} onClick={() => setFilter(active ? "all" : k.filter)}>
                <div className="kl">{k.label}</div>
                <div className="kv">{k.val}</div>
                <div className={`kd ${k.good ? "good" : "bad"}`}>
                  <Icon name={k.dir === "up" ? "arrow-up-right" : "arrow-down-right"} size={13} /> {k.delta} <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>WoW</span>
                </div>
                <div className="ks">{k.sub}</div>
                {k.filter !== "all" && <span className="dash-kpi-flt">{active ? "Filtering ·" : "Filter"} <Icon name="filter" size={11} /></span>}
              </button>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="dash-charts">
          <Throughput data={dash.throughput} />
          <RoutingMix data={dash.routing} />
          <RegionMix data={D.spineCharts.regions} />
        </div>

        {/* Exception table */}
        <div className="card dash-table">
          <div className="dash-table-head">
            <div>
              <Eyebrow>Exception queue</Eyebrow>
              <div className="dash-chart-sub">{rows.length} {rows.length === 1 ? "event" : "events"} shown · sorted by attention needed</div>
            </div>
            <div className="dash-filters">
              {FILTERS.map(f => (
                <button key={f.id} className={`dash-flt ${filter === f.id ? "on" : ""}`} onClick={() => setFilter(f.id)}>{f.label}</button>
              ))}
            </div>
          </div>
          <table className="dash-tbl">
            <thead>
              <tr>
                <th>Event</th><th>Severity</th><th>Cause</th><th>State</th><th>Owner</th><th className="num">At stake</th><th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(q => (
                <tr key={q.id} onClick={() => openRow(q)} className={q.primary ? "is-primary" : ""}>
                  <td><span className="dash-evt">{q.title}</span><span className="dash-id">{q.id}</span></td>
                  <td><Sev level={q.sev} /></td>
                  <td className="dash-why">{q.why}</td>
                  <td><span className="dash-state" style={{ color: stateTone(q.state) }}><span className="dash-state-dot" style={{ background: stateTone(q.state) }} />{q.state}</span></td>
                  <td className="dash-owner">{q.owner}</td>
                  <td className="num dash-val">{q.val}</td>
                  <td className="dash-chev"><Icon name="arrow-up-right" size={14} /></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan="7" className="dash-empty">No events match this filter. <button className="link" onClick={() => setFilter("all")}>Clear filter</button></td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="panel ai-edge tint" style={{ marginTop: 18, padding: "13px 16px", display: "flex", gap: 12, alignItems: "center" }}>
          <span className="ai-glyph" style={{ width: 17, height: 17 }} />
          <div style={{ flex: 1, fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.5 }}>
            The supply event is the one decision waiting on you. Everything else either cleared PAC automatically or was routed to the team that holds authority.
          </div>
          <Button variant="prim" onClick={goFlow}>Open EVT-2026-0617 →</Button>
        </div>

        {/* Detail drawer */}
        <div className={`dash-scrim ${detail ? "open" : ""}`} onClick={() => setOpenId(null)} />
        <aside className={`dash-drawer ${detail ? "open" : ""}`}>
          {detail && (
            <React.Fragment>
              <div className="dash-dr-head">
                <span className={`q-bar ${detail.sev}`} style={{ width: 4, borderRadius: 999, alignSelf: "stretch" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="dash-dr-title">{detail.title}</span>
                    <Sev level={detail.sev} />
                  </div>
                  <div className="dash-dr-id">{detail.id} · raised {detail.age} ago</div>
                </div>
                <button className="dash-dr-x" onClick={() => setOpenId(null)} aria-label="Close"><Icon name="log-out" size={16} /></button>
              </div>
              <div className="dash-dr-body">
                <div className="dash-dr-why">{detail.why}</div>

                <div className="dash-prop"><span className="k">State</span><span className="v" style={{ color: stateTone(detail.state) }}>{detail.state}</span></div>
                <div className="dash-prop"><span className="k">Value at stake</span><span className="v">{detail.val}</span></div>
                <div className="dash-prop"><span className="k">Routed to</span><span className="v">{detail.routedTo}</span></div>
                <div className="dash-prop"><span className="k">Owner</span><span className="v">{detail.owner}</span></div>

                <div className="dash-dr-sec">Agents that acted</div>
                <div className="dash-agents">
                  {detail.agents.map((a, i) => <span className="dash-agent" key={i}><Icon name="recommend" size={12} /> {a}</span>)}
                </div>

                <div className="dash-dr-sec">Evidence attached</div>
                <div className="dash-evidence">
                  {detail.evidence.map((e, i) => (
                    <div className="dash-ev" key={i}><Icon name="checkmark-filled" size={13} style={{ color: "var(--k-status-success-100)" }} /> {e}</div>
                  ))}
                </div>
              </div>
              <div className="dash-dr-foot">
                {detail.primary ? (
                  <Button variant="prim" icon="arrow-up-right" onClick={goFlow}>Open in reference flow</Button>
                ) : (
                  <Button variant="prim" icon="checkmark-filled" onClick={() => { toast(`${detail.id} · acknowledged`); setOpenId(null); }}>Acknowledge</Button>
                )}
                <Button variant="ghost" onClick={() => { toast(`${detail.id} · reassigned`); setOpenId(null); }}>Reassign</Button>
                <SourceAttribution when="updated live">Ranked by the agentic spine</SourceAttribution>
              </div>
            </React.Fragment>
          )}
        </aside>
      </div>
    );
  }
  UI.ScreenQueue = ScreenQueue;
})();
