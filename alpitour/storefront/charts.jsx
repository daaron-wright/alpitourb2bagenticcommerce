/* ============================================================
   EasyBook Next — B2B Storefront · Shidoka data-viz layer
   Chart.js 4 on Shidoka palettes (categorical / sequential / divergent)
   + CSS gauge-bar and constraint-fit matrix per the DS charts kit.
   ============================================================ */
(function () {
  const { fmtEUR, pulse, priceCalendar, fitMatrix, milestones, products, desk } = window.SF;

  /* ---- Shidoka chart defaults ---- */
  if (window.Chart) {
    const C = Chart;
    C.defaults.font.family = "'Roboto', system-ui, sans-serif";
    C.defaults.font.size = 11;
    C.defaults.color = "#64748B";
    C.defaults.borderColor = "#E2E8F0";
    C.defaults.plugins.legend.labels.boxWidth = 10;
    C.defaults.plugins.legend.labels.boxHeight = 10;
    C.defaults.plugins.legend.labels.padding = 12;
    C.defaults.plugins.tooltip.backgroundColor = "#0F172A";
    C.defaults.plugins.tooltip.padding = 10;
    C.defaults.plugins.tooltip.cornerRadius = 4;
    C.defaults.plugins.tooltip.titleFont = { weight: "500", size: 12 };
    C.defaults.plugins.tooltip.bodyFont = { size: 12 };
  }
  const CAT = ["#29707A", "#FF462D", "#3E8AC2", "#8A4FBF", "#E68A00", "#5C6A73", "#5BA2AE", "#FF8766", "#1F5580", "#B82915"];
  const SEQ = ["#E8F2F4", "#BEDDE2", "#91C4CC", "#5BA2AE", "#3D8590", "#29707A", "#1F5A63", "#17444B"];
  const grid = { grid: { color: "#F1F5F9", drawBorder: false, tickColor: "transparent" }, ticks: { color: "#64748B" } };

  function useChart(build, deps) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!ref.current || !window.Chart) return;
      const chart = new Chart(ref.current, build());
      return () => chart.destroy();
    }, deps || []);
    return ref;
  }

  /* chart-card chrome: title + sub + canvas + source line (DS: charts never stand alone) */
  function ChartCard({ title, sub, height = 160, source, children, build, deps, ariaLabel }) {
    const ref = useChart(build, deps);
    return (
      <div className="sf-chartcard">
        <div className="ct">{title}</div>
        {sub && <div className="cs">{sub}</div>}
        <div className="cbox" style={{ height }}><canvas ref={ref} role="img" aria-label={ariaLabel || title}></canvas></div>
        {children}
        {source && <div className="csrc"><span className="d" /> {source}</div>}
      </div>
    );
  }

  /* ---------- 1 · Agency pulse band (browse) ---------- */
  function CommissionKpi() {
    const c = pulse.commission;
    const ref = useChart(() => ({
      type: "line",
      data: { labels: c.weeks, datasets: [{ data: c.series, borderColor: "#29707A", borderWidth: 1.5, pointRadius: 0, fill: true, backgroundColor: "rgba(41,112,122,.08)", tension: 0.35 }] },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => "€" + x.raw } } }, scales: { x: { display: false }, y: { display: false } } },
    }), []);
    return (
      <div className="sf-pulse-card sf-agent-only">
        <div className="lab">Commission · MTD</div>
        <div className="row">
          <span className="big num">{fmtEUR(c.mtd)}</span>
          <span className="sf-delta up"><Ki name="arrow-up-right" size={11} /> +{c.deltaPct}% WoW</span>
        </div>
        <div className="spark"><canvas ref={ref} role="img" aria-label="Commission trend, 11 weeks"></canvas></div>
        <div className="csrc"><span className="d" /> Pricing API · settled bookings · today 09:42</div>
      </div>
    );
  }

  function DeflectionGauge() {
    const g = pulse.deflection;
    const pct = g.current, target = g.target;
    return (
      <div className="sf-pulse-card">
        <div className="lab">Self-service rate · Super TREDI</div>
        <div className="row">
          <span className="big num">{pct}<small>%</small></span>
          <span className="tgt num">Target {target}% · gap {target - pct} pts</span>
        </div>
        <div className="sf-gaugebar" role="img" aria-label={`Self-service rate ${pct} percent, target ${target} percent`}>
          <div className="fill" style={{ width: pct + "%" }}></div>
          <div className="gap" style={{ left: pct + "%", right: (100 - target) + "%" }}></div>
          <div className="marker" style={{ left: target + "%" }}></div>
        </div>
        <div className="glegend num"><span>0%</span><span>current {pct}%</span><span>target {target}%</span></div>
        <div className="csrc"><span className="d" /> {g.label}</div>
      </div>
    );
  }

  function BrandMixDonut() {
    const m = pulse.brandMix;
    const ref = useChart(() => ({
      type: "doughnut",
      data: { labels: m.labels, datasets: [{ data: m.values, backgroundColor: [CAT[0], CAT[3], CAT[2], CAT[4], CAT[6]], borderWidth: 2, borderColor: "#fff" }] },
      options: { maintainAspectRatio: false, cutout: "68%", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => ` ${x.label}: ${x.raw}%` } } } },
    }), []);
    return (
      <div className="sf-pulse-card">
        <div className="lab">Sales mix · by brand · QTD</div>
        <div className="donut-row">
          <div className="dwrap"><canvas ref={ref} role="img" aria-label="Sales mix by brand"></canvas><span className="dmid num">{m.values[0]}%</span></div>
          <div className="dleg">
            {m.labels.map((l, i) => (
              <span key={l}><i style={{ background: [CAT[0], CAT[3], CAT[2], CAT[4], CAT[6]][i] }} /> {l} <b className="num">{m.values[i]}%</b></span>
            ))}
          </div>
        </div>
        <div className="csrc"><span className="d" /> Booking platform · Rossi Travel · 12-week window</div>
      </div>
    );
  }

  function HoldsTile({ onToast }) {
    return (
      <div className="sf-pulse-card">
        <div className="lab">Holds at risk</div>
        {desk.holds.map((h) => (
          <button key={h.ref} className={`sf-holdrow ${h.urgent ? "urgent" : ""}`} onClick={() => onToast(`Hold ${h.ref} — open the Holds view in the full workbench.`)}>
            <Ki name={h.urgent ? "warning-alt" : "checkmark-filled"} size={13} />
            <span className="t">{h.title}</span>
            <span className="e num">{h.expires}</span>
          </button>
        ))}
        {desk.packages.map((w) => (
          <button key={w.id} className="sf-holdrow" onClick={() => onToast(`${w.id} — resume from the work-package dashboard.`)}>
            <Ki name="document-chart" size={13} />
            <span className="t">{w.title}</span>
            <span className="e">{w.id}</span>
          </button>
        ))}
        <div className="csrc"><span className="d" /> Booking platform · live</div>
      </div>
    );
  }

  function PulseBand({ onToast }) {
    return (
      <section className="sf-pulse" aria-label="Agency pulse" data-screen-label="Agency pulse">
        <CommissionKpi />
        <DeflectionGauge />
        <BrandMixDonut />
        <HoldsTile onToast={onToast} />
      </section>
    );
  }

  /* ---------- 2 · constraint-fit matrix (ranked mode) ---------- */
  const CELL = {
    ok: { cls: "ok", icon: "checkmark-filled", word: "Met" },
    warn: { cls: "warn", icon: "warning-alt", word: "Partial" },
    no: { cls: "no", icon: "error-filled", word: "Miss" },
    na: { cls: "na", icon: "information", word: "n/a" },
  };
  function FitMatrix({ onSource }) {
    return (
      <section className="sf-matrixcard" data-screen-label="Constraint-fit matrix">
        <div className="mh">
          <div>
            <div className="ct">Constraint fit · Carter brief</div>
            <div className="cs">Hard constraints from the chips × every candidate. Severity is icon + label, never colour alone.</div>
          </div>
          <SfSrcChip ids={["inv1", "prc1", "pm1"]} onSource={onSource} />
        </div>
        <div className="sf-matrix" style={{ gridTemplateColumns: `170px repeat(${fitMatrix.cols.length}, 1fr) 120px` }}>
          <div className="hcell"></div>
          {fitMatrix.cols.map((c) => <div key={c} className="hcell">{c}</div>)}
          <div className="hcell">Match</div>
          {fitMatrix.rows.map((r) => {
            const p = products[r.id];
            return (
              <React.Fragment key={r.id}>
                <div className="rcell"><b>{p.name}</b><span>{r.note}</span></div>
                {r.cells.map((c, i) => {
                  const m = CELL[c];
                  return <div key={i} className={`cell ${m.cls}`}><Ki name={m.icon} size={12} /> {m.word}</div>;
                })}
                <div className="mcell">
                  {p.match
                    ? <><div className="mbar"><div className="mfill" style={{ width: p.match + "%" }}></div></div><span className="num">{p.match}%</span></>
                    : <span className="soldlbl"><Ki name="error-filled" size={11} /> Sold out</span>}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="csrc"><span className="d" /> Live inventory + pricing APIs · product master facts · checked 43s ago</div>
      </section>
    );
  }

  /* ---------- 3 · price-by-departure chart (drawer) ---------- */
  function PriceCalendarChart({ pid }) {
    const pc = priceCalendar[pid];
    if (!pc) return null;
    const colors = pc.values.map((v, i) => i === pc.requested ? "#29707A" : "#BEDDE2");
    return (
      <ChartCard
        title="Price by departure · 10 nights, family 2+1"
        sub={pc.note}
        height={170}
        deps={[pid]}
        ariaLabel="Package price by departure date"
        source="Pricing API · Gold-tier rules · live, 41s ago"
        build={() => ({
          type: "bar",
          data: {
            labels: pc.labels,
            datasets: [
              { type: "line", label: "Budget cap €3,500", data: pc.labels.map(() => 3500), borderColor: "#FF462D", borderWidth: 1.5, borderDash: [5, 4], pointRadius: 0 },
              { label: "Package price", data: pc.values, backgroundColor: colors, borderRadius: 3, barPercentage: 0.72 },
            ],
          },
          options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => x.datasetIndex === 0 ? "Budget cap €3,500" : " €" + x.raw.toLocaleString("en-IE") + (x.dataIndex === pc.requested ? " · requested window" : "") } } },
            scales: {
              x: { ...grid, grid: { display: false } },
              y: { ...grid, min: 2600, ticks: { color: "#64748B", callback: (v) => "€" + (v / 1000).toFixed(1) + "k" } },
            },
          },
        })}
      >
        <div className="clegend"><span><i style={{ background: "#29707A" }} /> Requested window</span><span><i style={{ background: "#BEDDE2" }} /> Other departures</span><span><i className="dash" /> Budget cap</span></div>
      </ChartCard>
    );
  }

  /* ---------- 4 · V1 → V2 waterfall (modification diff) ---------- */
  function DeltaWaterfall({ v1 = 7365, delta = -90, v2 = 7275, prevLabel = "V1", curLabel = "V2", reason = "Same rooms, cities and pace — only the noted line moved." }) {
    const up = delta >= 0;
    const lo = Math.min(v1, v2) - 120, hi = Math.max(v1, v2) + 120;
    return (
      <ChartCard
        title={`What changed · ${prevLabel} → ${curLabel}`}
        sub={reason}
        height={150}
        deps={[v1, v2]}
        ariaLabel="Price change waterfall between proposal versions"
        source="Booking platform · policy v2026.2 · live"
        build={() => ({
          type: "bar",
          data: {
            labels: [`${prevLabel}`, up ? "Uplift" : "Saving", `${curLabel}`],
            datasets: [{
              data: [[0, v1], up ? [v1, v2] : [v2, v1], [0, v2]],
              backgroundColor: ["#5C6A73", up ? "#B23A2E" : "#3D8590", "#29707A"],
              borderRadius: 3, barPercentage: 0.55,
            }],
          },
          options: {
            indexAxis: "x", maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => x.dataIndex === 1 ? ` ${up ? "+" : "−"}€${Math.abs(delta)}` : " €" + x.raw[1].toLocaleString("en-IE") } } },
            scales: { x: { ...grid, grid: { display: false } }, y: { ...grid, min: lo, max: hi, ticks: { callback: (v) => "€" + v.toLocaleString("en-IE") } } },
          },
        })}
      />
    );
  }

  /* ---------- 5 · time-to-milestone vs manual (completed) ---------- */
  function MilestoneBars() {
    return (
      <ChartCard
        title="Minutes to each milestone · this work package vs manual baseline"
        sub="The pilot metric that matters: quote turnaround, hold latency, change servicing."
        height={150}
        ariaLabel="Time to milestone comparison"
        source="Portal telemetry · WP-2231 vs agency manual median, last 90 days"
        build={() => ({
          type: "bar",
          data: {
            labels: milestones.labels,
            datasets: [
              { label: "With Super TREDI", data: milestones.alpigpt, backgroundColor: "#29707A", borderRadius: 2, barThickness: 13 },
              { label: "Manual median", data: milestones.manual, backgroundColor: "#CBD5E1", borderRadius: 2, barThickness: 13 },
            ],
          },
          options: {
            indexAxis: "y", maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: (x) => ` ${x.dataset.label}: ${x.raw} min` } } },
            scales: { x: { ...grid, beginAtZero: true, ticks: { callback: (v) => v + "m" } }, y: { ...grid, grid: { display: false } } },
          },
        })}
      />
    );
  }

  Object.assign(window, { SfPulseBand: PulseBand, SfFitMatrix: FitMatrix, SfPriceCalendarChart: PriceCalendarChart, SfDeltaWaterfall: DeltaWaterfall, SfMilestoneBars: MilestoneBars });
})();
