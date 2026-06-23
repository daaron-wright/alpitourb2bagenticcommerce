/* ============================================================
   Screen — Unified data platform (operator).
   Executive view: every buyer signal the agentic spine sees feeds
   ONE data platform → predictive analytics + dynamic pricing →
   the operator's next best action when prioritising grades on a
   constrained production line. Live: buyer actions on the customer
   front-end (AgenticBus, cross-tab) feed aggregated demand in real
   time.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Eyebrow, Button, ChartCanvas, ChartCard, chartTokens } = UI;
  const useActiveWf = UI.useActiveWf;

  // ---- The constrained line: Terneuzen (EU) ----
  const PLANT = { name: "Terneuzen", region: "EU", capacity: 1800 };
  const GRADES = [
    { id: "engage-7467", name: "ENGAGE™ 7467", short: "ENGAGE 7467", app: "Automotive · TPO", accent: "#1E5BB8", demand: 920, price: 2380, marginPct: 22, dyn: 4, covenant: true, account: "Brandt · contracted" },
    { id: "affinity-1881", name: "AFFINITY™ PL 1881G", short: "AFFINITY 1881G", app: "Packaging · food-contact", accent: "#0F766E", demand: 760, price: 2520, marginPct: 26, dyn: 3, covenant: false, account: "EU converters" },
    { id: "engage-8842", name: "ENGAGE™ 8842", short: "ENGAGE 8842", app: "Automotive · soft-touch", accent: "#2563EB", demand: 700, price: 2180, marginPct: 18, dyn: 2, covenant: false, account: "Tier-1 suppliers" },
  ];
  const GID = {}; GRADES.forEach(g => GID[g.id] = g);
  const TOTAL_DEMAND = GRADES.reduce((a, g) => a + g.demand, 0); // 2380

  const OPTIONS = [
    { id: "A", rec: true, name: "Protect covenant demand", sub: "Cover Brandt's contracted ENGAGE in full, then highest margin.",
      alloc: { "engage-7467": 920, "affinity-1881": 600, "engage-8842": 280 }, covenant: "held",
      pac: { rule: "PROD-covenant-brandt", outcome: "allow", note: "Brandt's contracted volume fully covered — covenant held, no human gate." } },
    { id: "B", name: "Maximise margin", sub: "Prioritise the highest-margin grades regardless of contract.",
      alloc: { "affinity-1881": 760, "engage-7467": 700, "engage-8842": 340 }, covenant: "at-risk",
      pac: { rule: "PROD-covenant-brandt", outcome: "route", note: "Brandt 220 t short — covenant-affecting, must route to the planner who owns the account." } },
    { id: "C", name: "Balanced — serve most accounts", sub: "Spread capacity to minimise total shortfall.",
      alloc: { "engage-7467": 700, "affinity-1881": 580, "engage-8842": 520 }, covenant: "at-risk",
      pac: { rule: "PROD-covenant-brandt", outcome: "route", note: "Brandt 220 t short — covenant-affecting, routed to the planner." } },
  ];

  const PAC_TONE = { allow: { l: "PAC · allow", cls: "allow", ic: "checkmark-filled" }, route: { l: "PAC · route to planner", cls: "route", ic: "group" } };

  function euro(n) { return "€" + (n / 1e6).toFixed(2) + "M"; }
  function computeImpact(opt) {
    let rev = 0, cap = 0, marginWeighted = 0, dynUplift = 0, fully = 0, shortAccts = 0;
    GRADES.forEach(g => {
      const a = opt.alloc[g.id] || 0;
      rev += a * g.price; cap += a;
      marginWeighted += a * g.price * (g.marginPct / 100);
      dynUplift += a * g.price * (g.dyn / 100);
      if (a >= g.demand) fully++; else shortAccts++;
    });
    const covered = Math.round((cap / TOTAL_DEMAND) * 100);
    const blendedMargin = (marginWeighted / rev) * 100;
    return { rev, cap, covered, blendedMargin, dynUplift, fully, shortAccts };
  }

  // ---- collapsible flow band: spine → platform → analytics → NBA ----
  function FlowBand() {
    const [open, setOpen] = React.useState(false);
    const STAGES = [
      { k: "Agentic spine", d: "Every buyer interaction across the 11 workflows — recommend, sample, quote, order, reorder.", ic: "network", c: "#5B6B7B" },
      { k: "One data platform", d: "Each signal lands once in a unified store — demand, orders, covenants, supply, price.", ic: "analytics", c: "#6B36A8" },
      { k: "Predictive + dynamic pricing", d: "Forecasts demand, scores stockout & lead-time risk, prices to supply tightness.", ic: "recommend", c: "#0E7490" },
      { k: "Operator next best action", d: "Recommends which grades to prioritise on the constrained line — with the trade-off shown.", ic: "lightbulb", c: "#29707A" },
    ];
    return (
      <div className="udp-flow-wrap">
        <button className="udp-flow-toggle" onClick={() => setOpen(o => !o)}>
          <Icon name="network" size={13} /> How it connects · spine → data platform → analytics → next best action
          <span className={`udp-flow-chev ${open ? "open" : ""}`}>›</span>
        </button>
        {open && (
          <div className="udp-flow">
            {STAGES.map((s, i) => (
              <React.Fragment key={i}>
                <div className="udp-fstage">
                  <span className="udp-fic" style={{ background: s.c }}><Icon name={s.ic} size={15} /></span>
                  <div className="udp-fk">{s.k}</div>
                  <div className="udp-fd">{s.d}</div>
                </div>
                {i < STAGES.length - 1 && <span className="udp-farr">→</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }

  function Kpi({ label, value, sub, tone, live }) {
    return (
      <div className={`udp-kpi ${tone || ""}`}>
        <div className="udp-kpi-l">{label}{live && <span className="udp-live-dot" />}</div>
        <div className="udp-kpi-v">{value}</div>
        <div className="udp-kpi-s">{sub}</div>
      </div>
    );
  }

  // map an active workflow → a plausible buyer demand signal
  const WF_SIGNAL = {
    "need-to-recommend": ["affinity-1881", "EU"], "sample-to-qualification": ["engage-7467", "EU"],
    "quote-to-order": ["engage-7467", "EU"], "configure-to-commit": ["engage-8842", "EU"],
    "deliver-to-promise": ["affinity-1881", "US"], "allocation-under-constraint": ["engage-7467", "EU"],
    "reorder-to-replenish": ["engage-8842", "EU"], "regulatory-change-to-action": ["affinity-1881", "EU"],
  };
  const REGIONS = ["EU", "US", "EU", "APAC", "EU"];

  function ScreenUDP({ toast, setScreen, naphtha = {} }) {
    const [sel, setSel] = React.useState("A");
    const opt = OPTIONS.find(o => o.id === sel) || OPTIONS[0];
    const imp = computeImpact(opt);
    const [committed, setCommitted] = React.useState(null);
    React.useEffect(() => { setCommitted(null); }, [sel]);
    // per-account blast radius of the selected allocation
    const accounts = GRADES.map(g => {
      const served = opt.alloc[g.id] || 0;
      return { name: g.account, grade: g.short, accent: g.accent, demand: g.demand, served, short: Math.max(0, g.demand - served), covenant: g.covenant };
    });
    const shortCount = accounts.filter(a => a.short > 0).length;
    const [active] = useActiveWf ? useActiveWf() : [null];

    // live buyer-signal feed → aggregated demand uplift
    const [feed, setFeed] = React.useState(() => ([
      { g: "engage-7467", region: "EU", qty: 18, src: "Sample request", t: "just now" },
      { g: "affinity-1881", region: "EU", qty: 24, src: "Quote → order", t: "1m ago" },
      { g: "engage-8842", region: "APAC", qty: 12, src: "Reorder", t: "2m ago" },
    ]));
    const [pulse, setPulse] = React.useState(0);
    const extra = feed.reduce((a, f) => a + f.qty, 0);

    // a buyer acting on the front-end (any tab) changes the active workflow → register demand
    const lastWf = React.useRef(active);
    React.useEffect(() => {
      if (!active || active === lastWf.current) return;
      lastWf.current = active;
      const sig = WF_SIGNAL[active]; if (!sig) return;
      setFeed(f => [{ g: sig[0], region: sig[1], qty: 8 + Math.round(Math.random() * 20), src: "Front-end · " + active.replace(/-/g, " "), t: "just now", live: true }, ...f].slice(0, 8));
      setPulse(p => p + 1);
    }, [active]);

    // same-doc sample requests from the customer lens
    const sampleCount = (naphtha.samples || []).length;
    const seenSamples = React.useRef(sampleCount);
    React.useEffect(() => {
      if (sampleCount > seenSamples.current) {
        const s = naphtha.samples[naphtha.samples.length - 1];
        seenSamples.current = sampleCount;
        setFeed(f => [{ g: "engage-7467", region: "EU", qty: 10 + Math.round(Math.random() * 16), src: "Sample · " + (s.grade || "ChemAssist"), t: "just now", live: true }, ...f].slice(0, 8));
        setPulse(p => p + 1);
      }
    }, [sampleCount]);

    // ambient buyer activity for the walkthrough
    React.useEffect(() => {
      const id = setInterval(() => {
        const g = GRADES[Math.floor(Math.random() * GRADES.length)];
        const SRC = ["Sample request", "Quote → order", "Reorder", "New brief"];
        setFeed(f => [{ g: g.id, region: REGIONS[Math.floor(Math.random() * REGIONS.length)], qty: 6 + Math.round(Math.random() * 22), src: SRC[Math.floor(Math.random() * SRC.length)], t: "just now", live: true }, ...f].slice(0, 8));
        setPulse(p => p + 1);
      }, 5200);
      return () => clearInterval(id);
    }, []);

    const aggDemand = TOTAL_DEMAND + extra;
    const covered = Math.round((PLANT.capacity / aggDemand) * 100);
    const shortfall = aggDemand - PLANT.capacity;
    const revAtRisk = shortfall * 2400;

    // forecast: 8 weeks, demand rising over flat capacity
    const WEEKS = ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"];
    const demandSeries = [2120, 2210, 2260, 2380, 2440, 2520, 2610, 2700];
    const forecastData = {
      labels: WEEKS,
      datasets: [
        { label: "Aggregated demand", data: demandSeries, borderColor: "#29707A", backgroundColor: "rgba(41,112,122,.08)", fill: true, tension: .35, borderWidth: 2.5, pointRadius: 0 },
        { label: "Covenant-linked demand", data: [760, 800, 820, 920, 940, 980, 1010, 1060], borderColor: "#FF462D", borderDash: [3, 3], fill: false, tension: .35, borderWidth: 1.6, pointRadius: 0 },
        { label: "Terneuzen capacity", data: WEEKS.map(() => PLANT.capacity), borderColor: "#94A3B8", borderDash: [6, 4], fill: false, borderWidth: 1.6, pointRadius: 0 },
      ],
    };
    const forecastOpts = {
      maintainAspectRatio: false, responsive: true, interaction: { mode: "index", intersect: false },
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: false, min: 600, grid: chartTokens.GRID.grid, ticks: { color: "#64748B", callback: v => v + " t" } }, x: chartTokens.GRID },
    };

    // allocation bar: demand vs allocated per grade (rebuilds on option)
    const allocData = {
      labels: GRADES.map(g => g.short),
      datasets: [
        { label: "Aggregated demand", data: GRADES.map(g => g.demand), backgroundColor: "#E2E8F0", borderRadius: 4, barPercentage: .9, categoryPercentage: .7 },
        { label: "Allocated this run", data: GRADES.map(g => opt.alloc[g.id] || 0), backgroundColor: GRADES.map(g => g.accent), borderRadius: 4, barPercentage: .9, categoryPercentage: .7 },
      ],
    };
    const allocOpts = {
      maintainAspectRatio: false, responsive: true, indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: { x: { grid: chartTokens.GRID.grid, ticks: { color: "#64748B", callback: v => v + " t" }, suggestedMax: 1000 }, y: chartTokens.GRID },
    };

    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Unified data platform · demand → supply</Eyebrow>
            <h1 style={{ marginTop: 6 }}>One data platform. Every buyer signal, optimising plant supply.</h1>
            <div className="ph-sub">Everything the agentic spine sees — every recommendation, sample, quote and order across the customer base — lands in one data platform. It forecasts demand, prices to supply tightness, and turns the aggregate into a single next best action for the operator: <strong>which grades to prioritise on a constrained production line</strong>, with the trade-off made explicit before anything commits.</div>
          </div>
        </div>

        <FlowBand />

        {/* live KPI row */}
        <div className="udp-kpis">
          <Kpi label="Aggregated demand" value={aggDemand.toLocaleString() + " t/wk"} sub={`${GRADES.length} grades · live across all accounts`} live />
          <Kpi label="Covered by current plan" value={covered + "%"} sub={`${PLANT.name} capacity ${PLANT.capacity.toLocaleString()} t/wk`} tone={covered < 80 ? "warn" : "ok"} />
          <Kpi label="Plants constrained" value="1 of 2" sub="Terneuzen (EU) over capacity · Freeport healthy" tone="warn" />
          <Kpi label="Revenue at risk" value={euro(revAtRisk) + "/wk"} sub={`${shortfall.toLocaleString()} t of demand unservable as-is`} tone="warn" live />
          <Kpi label="Margin uplift · dynamic pricing" value={"+" + ((imp.dynUplift / imp.rev) * 100).toFixed(1) + "%"} sub="Price moves with supply tightness, per grade" tone="ok" />
        </div>

        {/* THE NEXT BEST ACTION — interactive allocation decision */}
        <div className="spine-eyebrow" style={{ marginTop: 8 }}><span className="se-l">Next best action · prioritise the {PLANT.name} line</span><span className="se-r">Aggregated demand is <b>{aggDemand.toLocaleString()} t/wk</b> against <b>{PLANT.capacity.toLocaleString()} t/wk</b> of capacity. Pick how to allocate the run — the platform shows the downstream impact.</span></div>
        <div className="udp-decision">
          <div className="udp-opts">
            {OPTIONS.map(o => {
              const oi = computeImpact(o);
              return (
                <button key={o.id} className={`udp-opt ${sel === o.id ? "on" : ""} ${o.covenant === "held" ? "safe" : "risk"}`} onClick={() => setSel(o.id)}>
                  <div className="udp-opt-h">
                    <span className="udp-opt-id">{o.id}</span>
                    <span className="udp-opt-name">{o.name}</span>
                    {o.rec && <span className="udp-opt-rec">Agent NBA</span>}
                  </div>
                  <div className="udp-opt-sub">{o.sub}</div>
                  <div className="udp-opt-row">
                    <span className={`udp-cov ${o.covenant === "held" ? "ok" : "risk"}`}><Icon name={o.covenant === "held" ? "checkmark-filled" : "warning-alt"} size={11} /> Covenant {o.covenant === "held" ? "held" : "at risk"}</span>
                    <span className="udp-opt-rev">{euro(oi.rev)}/wk</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="udp-impact-wrap">
            <ChartCard title="Allocation vs demand" sub={`${PLANT.name} run · ${PLANT.capacity.toLocaleString()} t/wk split across grades`}>
              <ChartCanvas type="bar" data={allocData} options={allocOpts} height={150} sig={"alloc-" + sel} />
            </ChartCard>

            <div className="udp-impact">
              <div className="udp-imp-grid">
                <div className="udp-imp"><span className="udp-imp-k">Revenue / wk</span><span className="udp-imp-v">{euro(imp.rev)}</span></div>
                <div className="udp-imp"><span className="udp-imp-k">Blended margin</span><span className="udp-imp-v">{imp.blendedMargin.toFixed(1)}%</span></div>
                <div className="udp-imp"><span className="udp-imp-k">Demand covered</span><span className="udp-imp-v">{imp.covered}%</span></div>
                <div className="udp-imp"><span className="udp-imp-k">Grades fully served</span><span className="udp-imp-v">{imp.fully} of {GRADES.length}</span></div>
              </div>
              <div className={`udp-imp-cov ${opt.covenant === "held" ? "ok" : "risk"}`}>
                <Icon name={opt.covenant === "held" ? "checkmark-filled" : "warning-alt"} size={14} />
                <span>{opt.covenant === "held" ? "Brandt covenant held — contracted ENGAGE volume covered in full." : "Brandt covenant at risk — contracted ENGAGE volume short by 220 t."}</span>
              </div>
              <div className={`udp-imp-pac ${PAC_TONE[opt.pac.outcome].cls}`}>
                <Icon name={PAC_TONE[opt.pac.outcome].ic} size={13} /> <b>{PAC_TONE[opt.pac.outcome].l}</b> · {opt.pac.rule}
                <div className="udp-imp-pac-n">{opt.pac.note}</div>
              </div>
              <div className="udp-imp-acts">
                <Button variant={opt.covenant === "held" ? "primary" : "ghost"} icon={opt.covenant === "held" ? "checkmark-filled" : "group"}
                  onClick={() => { setCommitted(opt.id); toast(opt.covenant === "held" ? `Allocation applied · ${PLANT.name} run committed — covenant held.` : `Routed to the EU planner — covenant-affecting allocation needs sign-off.`); }}>
                  {opt.covenant === "held" ? "Apply allocation" : "Route to planner"}
                </Button>
                {!opt.rec && <button className="udp-revert" onClick={() => setSel("A")}>Use the agent's recommendation →</button>}
              </div>
            </div>
          </div>
        </div>

        {/* WHAT THE ACTION DID — execution confirmation / blast radius */}
        {committed && opt.covenant === "held" && (
          <div className="udp-exec">
            <div className="udp-exec-h">
              <span className="udp-exec-ic"><Icon name="checkmark-filled" size={18} /></span>
              <div className="udp-exec-ht">
                <div className="udp-exec-t">Run committed — {PLANT.name} this week</div>
                <div className="udp-exec-s">{opt.name} · {imp.cap.toLocaleString()} t split across {GRADES.length} grades, written back to the systems of record.</div>
              </div>
              <span className="udp-exec-trace">DEC-99412 · {opt.pac.rule} → allow</span>
            </div>
            <div className="udp-exec-writes">
              {[["analytics", "Plant schedule", "Terneuzen run locked to the split below"], ["document-chart", "ERP order book", "Orders confirmed or re-sourced per account"], ["recommend", "Dynamic pricing", "Per-grade prices set to supply tightness"]].map((w, i) => (
                <div className="udp-write" key={i}><span className="uw-ic"><Icon name={w[0]} size={14} /></span><div className="uw-tx"><div className="uw-t">{w[1]}</div><div className="uw-s">{w[2]}</div></div><Icon name="checkmark-filled" size={15} className="uw-ok" /></div>
              ))}
            </div>
            <div className="udp-exec-blast">
              <div className="udp-blast-h">Who this serves — the blast radius</div>
              {accounts.map((a, i) => (
                <div className="udp-blast-row" key={i}>
                  <span className="ub-dot" style={{ background: a.accent }} />
                  <div className="ub-main"><span className="ub-acct">{a.name}</span><span className="ub-grade">{a.grade}</span></div>
                  <span className="ub-vol">{a.served.toLocaleString()} / {a.demand.toLocaleString()} t</span>
                  <span className={`ub-st ${a.short === 0 ? "full" : a.covenant ? "held" : "short"}`}>
                    <Icon name={a.short === 0 ? "checkmark-filled" : "arrow-up-right"} size={11} />
                    {a.short === 0 ? "Served in full" : `${a.short.toLocaleString()} t → Freeport next run · notified`}
                  </span>
                </div>
              ))}
            </div>
            <div className="udp-exec-foot">
              <span className="udp-exec-note"><Icon name="group" size={12} /> {shortCount} account{shortCount === 1 ? "" : "s"} notified with the re-source plan</span>
              <span className="udp-exec-note"><Icon name="document-chart" size={12} /> Sealed to audit · reason chain attached</span>
              <button className="udp-undo" onClick={() => setCommitted(null)}>Revise — nothing is locked</button>
            </div>
          </div>
        )}
        {committed && opt.covenant !== "held" && (
          <div className="udp-exec routed">
            <div className="udp-exec-h">
              <span className="udp-exec-ic routed"><Icon name="group" size={18} /></span>
              <div className="udp-exec-ht">
                <div className="udp-exec-t">Routed to the EU planner — nothing committed yet</div>
                <div className="udp-exec-s">{opt.name} shorts Brandt's contracted ENGAGE by 220 t. That's covenant-affecting, so the run is held for human sign-off.</div>
              </div>
              <span className="udp-exec-trace">PLN-2026-0412 · {opt.pac.rule} → route</span>
            </div>
            <div className="udp-exec-writes">
              {[["document-chart", "Evidence bundle", "Cause · impact · all three options · the covenant breach"], ["lightbulb", "Recommended alternative", "Option A — protect covenant — attached"], ["group", "Owner", "EU planner · Brandt account"]].map((w, i) => (
                <div className="udp-write" key={i}><span className="uw-ic"><Icon name={w[0]} size={14} /></span><div className="uw-tx"><div className="uw-t">{w[1]}</div><div className="uw-s">{w[2]}</div></div></div>
              ))}
            </div>
            <div className="udp-exec-foot">
              <span className="udp-exec-note"><Icon name="information" size={12} /> The run stays held until the planner approves, modifies or rejects — no order moves until then.</span>
              <button className="udp-undo prim" onClick={() => setScreen && setScreen("queue")}>Open the planner queue →</button>
              <button className="udp-undo" onClick={() => setSel("A")}>Use the agent's recommendation →</button>
            </div>
          </div>
        )}

        {/* supporting: forecast + live buyer feed */}
        <div className="udp-lower">
          <ChartCard title="Demand forecast · next 8 weeks" sub="Aggregated demand crosses Terneuzen capacity in w4 — the constraint is predicted, not discovered"
            legend={[{ c: "#29707A", t: "Aggregated demand" }, { c: "#FF462D", t: "Covenant-linked" }, { c: "#94A3B8", t: "Capacity" }]}>
            <ChartCanvas type="line" data={forecastData} options={forecastOpts} height={220} sig="udp-forecast" />
          </ChartCard>

          <div className="udp-feed">
            <div className="udp-feed-h"><span className="udp-live-dot" /> Live buyer signals <span className="udp-feed-sub">feeding the platform now</span></div>
            <div className="udp-feed-list" key={pulse}>
              {feed.map((f, i) => {
                const g = GID[f.g] || GRADES[0];
                return (
                  <div className={`udp-feed-row ${i === 0 && f.live ? "fresh" : ""}`} key={i}>
                    <span className="udp-feed-dot" style={{ background: g.accent }} />
                    <div className="udp-feed-main">
                      <span className="udp-feed-g">{g.short} <span className="udp-feed-reg">· {f.region}</span></span>
                      <span className="udp-feed-src">{f.src}</span>
                    </div>
                    <span className="udp-feed-qty">+{f.qty} t</span>
                  </div>
                );
              })}
            </div>
            <div className="udp-feed-foot"><Icon name="information" size={11} /> Each buyer action on the front-end lands here once, then flows to demand, pricing and the allocation NBA above.</div>
          </div>
        </div>
      </div>
    );
  }
  UI.ScreenUDP = ScreenUDP;
})();
