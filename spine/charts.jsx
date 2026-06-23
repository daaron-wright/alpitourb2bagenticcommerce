/* ============================================================
   Shidoka charts kit — Chart.js 4 wrappers (React)
   Shidoka defaults + palettes + reusable chart primitives:
   ChartCanvas (any Chart.js config), Gauge (semi-circle meter),
   and DonutChart / BarChart / LineChart / RadarChart / SankeyChart
   convenience builders. One source of chart truth for the demo.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});

  // ---- Shidoka Chart.js defaults (set once) ----
  if (window.Chart && !window.__shidokaChartDefaults) {
    const C = window.Chart;
    C.defaults.font.family = "'Roboto', system-ui, sans-serif";
    C.defaults.font.size = 11;
    C.defaults.color = "#64748B";
    C.defaults.borderColor = "#E2E8F0";
    C.defaults.plugins.legend.labels.boxWidth = 10;
    C.defaults.plugins.legend.labels.boxHeight = 10;
    C.defaults.plugins.legend.labels.padding = 12;
    C.defaults.plugins.legend.labels.usePointStyle = true;
    C.defaults.plugins.tooltip.backgroundColor = "#0F172A";
    C.defaults.plugins.tooltip.padding = 10;
    C.defaults.plugins.tooltip.cornerRadius = 4;
    C.defaults.plugins.tooltip.titleFont = { weight: "500", size: 12 };
    C.defaults.plugins.tooltip.bodyFont = { size: 12 };
    window.__shidokaChartDefaults = true;
  }

  // Shidoka palettes
  const CAT = ["#29707A", "#FF462D", "#3E8AC2", "#8A4FBF", "#E68A00", "#5C6A73", "#5BA2AE", "#FF8766", "#1F5580", "#B82915"];
  const RAG3 = ["#16A34A", "#F59E0B", "#DC2626"];
  const SEQ = ["#BEDDE2", "#91C4CC", "#5BA2AE", "#3D8590", "#29707A", "#1F5A63", "#17444B"];
  const GRID = { grid: { color: "#F1F5F9", drawBorder: false, tickColor: "transparent" }, ticks: { color: "#64748B" } };
  UI.chartTokens = { CAT, RAG3, SEQ, GRID };

  // ---- ChartCanvas — mount any Chart.js config; rebuild on `sig` change ----
  function ChartCanvas({ type, data, options, plugins, height = 240, sig }) {
    const ref = React.useRef(null);
    const inst = React.useRef(null);
    React.useEffect(() => {
      if (!window.Chart || !ref.current) return;
      inst.current = new window.Chart(ref.current, { type, data, options, plugins });
      return () => { if (inst.current) inst.current.destroy(); };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, sig]);
    return <div style={{ position: "relative", height }}><canvas ref={ref} /></div>;
  }
  UI.ChartCanvas = ChartCanvas;

  // ---- Gauge — semi-circle meter with target marker + status pill ----
  function Gauge({ value, target, color, label, sub, unit = "%", denom, size = 130 }) {
    const ref = React.useRef(null);
    const inst = React.useRef(null);
    // status vs target: on track / below / gap
    let status = null;
    if (target != null) {
      if (value >= target) status = { t: value > target ? `+${(value - target).toFixed(value % 1 ? 1 : 0)}` : "On target", cls: "ok" };
      else if (value >= target - 8) status = { t: "Below", cls: "warn" };
      else status = { t: "Gap", cls: "bad" };
    }
    const dial = color || (status && status.cls === "bad" ? "#DC2626" : status && status.cls === "warn" ? "#F59E0B" : "#29707A");
    React.useEffect(() => {
      if (!window.Chart || !ref.current) return;
      const targetMarker = {
        id: "tgt" + label,
        afterDraw(chart) {
          if (target == null) return;
          const meta = chart.getDatasetMeta(0); const arc = meta.data[0];
          if (!arc) return;
          const { x, y, innerRadius, outerRadius } = arc;
          const ang = Math.PI + (target / 100) * Math.PI; // 180°→360°
          const ctx = chart.ctx;
          ctx.save(); ctx.strokeStyle = "#0F172A"; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(ang) * (innerRadius - 1), y + Math.sin(ang) * (innerRadius - 1));
          ctx.lineTo(x + Math.cos(ang) * (outerRadius + 3), y + Math.sin(ang) * (outerRadius + 3));
          ctx.stroke(); ctx.restore();
        },
      };
      inst.current = new window.Chart(ref.current, {
        type: "doughnut",
        data: { datasets: [{ data: [value, 100 - value], backgroundColor: [dial, "#E2E8F0"], borderWidth: 0, circumference: 180, rotation: 270, cutout: "70%" }] },
        options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { display: false }, tooltip: { enabled: false } } },
        plugins: [targetMarker],
      });
      return () => { if (inst.current) inst.current.destroy(); };
    }, [value, target, dial]);
    return (
      <div className="ch-gauge">
        <div className="ch-gauge-c" style={{ height: size * 0.6 }}>
          <canvas ref={ref} />
          <div className="ch-gauge-v"><span className="ch-gauge-n">{value}{unit && <span className="ch-gauge-pct">{denom ? "/" + denom : unit}</span>}</span></div>
        </div>
        <div className="ch-gauge-lab">{label}</div>
        {sub && <div className="ch-gauge-sub">{sub}</div>}
        {target != null && (
          <div className="ch-gauge-foot">
            <span className="ch-gauge-tgt">target {target}{denom ? "" : unit}</span>
            {status && <span className={`ch-pill ${status.cls}`}>{status.t}</span>}
          </div>
        )}
      </div>
    );
  }
  UI.Gauge = Gauge;

  // ---- Heatmap — sequential01 matrix (rows × cols) ----
  function Heatmap({ cols, rows, max = 6, valueKey = "vals", rowKey = "feed", lowLabel = "Low", highLabel = "High" }) {
    const SEQ7 = ["#F1F5F9", "#BEDDE2", "#91C4CC", "#5BA2AE", "#3D8590", "#29707A", "#17444B"];
    function bucket(v) { return SEQ7[Math.min(SEQ7.length - 1, Math.round((v / max) * (SEQ7.length - 1)))]; }
    return (
      <div className="hm">
        <div className="hm-grid" style={{ gridTemplateColumns: `90px repeat(${cols.length}, 1fr)` }}>
          <div className="hm-corner" />
          {cols.map((c, i) => <div className="hm-cx" key={i}>{c}</div>)}
          {rows.map((r, ri) => (
            <React.Fragment key={ri}>
              <div className="hm-cy">{r[rowKey]}</div>
              {r[valueKey].map((v, ci) => (
                <div className="hm-cell" key={ci} style={{ background: bucket(v), color: v / max > 0.5 ? "#fff" : "#334155" }} title={`${r[rowKey]} · ${cols[ci]} · ${v}`}>{v || ""}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="hm-legend"><span>{lowLabel}</span>{SEQ7.slice(1).map((c, i) => <i key={i} style={{ background: c }} />)}<span>{highLabel}</span></div>
      </div>
    );
  }
  UI.Heatmap = Heatmap;

  // ---- Dendrogram — d3 cluster (horizontal), reads {name, kind, children} ----
  function Dendrogram({ data, height = 340 }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const d3 = window.d3; const el = ref.current;
      if (!d3 || !el) return;
      const KIND = { root: "#5B6B7B", plant: "#FF462D", cracker: "#9A6500", family: "#6B36A8", sku: "#29707A", customer: "#2A6FDB" };
      const width = el.clientWidth || 760;
      d3.select(el).selectAll("*").remove();
      const root = d3.hierarchy(data);
      const dx = 26, dy = (width - 220) / (root.height + 1);
      d3.cluster().nodeSize([dx, dy])(root);
      let x0 = Infinity, x1 = -Infinity;
      root.each(d => { if (d.x > x1) x1 = d.x; if (d.x < x0) x0 = d.x; });
      const h = Math.max(height, x1 - x0 + dx * 2);
      const svg = d3.select(el).append("svg").attr("width", width).attr("height", h)
        .attr("viewBox", [-110, x0 - dx, width, h]).attr("font-family", "var(--font-sans)").attr("font-size", 11);
      svg.append("g").attr("fill", "none").attr("stroke", "#CBD5E1").attr("stroke-width", 1.3)
        .selectAll("path").data(root.links()).join("path")
        .attr("d", d3.linkHorizontal().x(d => d.y).y(d => d.x));
      const node = svg.append("g").selectAll("g").data(root.descendants()).join("g").attr("transform", d => `translate(${d.y},${d.x})`);
      node.append("circle").attr("r", d => d.depth === 0 ? 6 : d.children ? 5 : 4)
        .attr("fill", d => KIND[d.data.kind] || "#5B6B7B").attr("stroke", "#fff").attr("stroke-width", 1.5);
      node.append("text").attr("dy", "0.32em")
        .attr("x", d => d.children ? -9 : 9).attr("text-anchor", d => d.children ? "end" : "start")
        .attr("fill", "#334155").attr("font-weight", d => d.depth <= 1 ? 600 : 400).text(d => d.data.name)
        .clone(true).lower().attr("stroke", "#fff").attr("stroke-width", 3);
      return () => d3.select(el).selectAll("*").remove();
    }, [data, height]);
    return <div ref={ref} style={{ width: "100%", overflowX: "auto" }} />;
  }
  UI.Dendrogram = Dendrogram;

  // ---- ChartCard — titled container around a chart ----
  function ChartCard({ title, sub, legend, children, pad = true }) {
    return (
      <div className="ch-card">
        {(title || sub) && (
          <div className="ch-card-head">
            <div>
              {title && <div className="ch-card-title">{title}</div>}
              {sub && <div className="ch-card-sub">{sub}</div>}
            </div>
            {legend && <div className="ch-card-legend">{legend.map((l, i) => <span key={i}><i style={{ background: l.c }} />{l.t}</span>)}</div>}
          </div>
        )}
        <div className={pad ? "ch-card-body" : ""}>{children}</div>
      </div>
    );
  }
  UI.ChartCard = ChartCard;
})();
