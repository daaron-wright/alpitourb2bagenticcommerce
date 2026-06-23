/* ============================================================
   EasyBook Next — B2B Storefront · Journey graph
   One Shidoka linear chart (Chart.js line + target marker) that
   carries the whole journey: price timeline, stay/flight bands,
   version changes, live session events, and numbered RAG flags
   for market / customer-feedback variations.
   ============================================================ */
(function () {
  const { fmtEUR, tredi } = window.SF;

  const FLAG_COL = { keep: "#16A34A", consider: "#F59E0B", address: "#DC2626" };
  const FLAG_LBL = { keep: "keep as is", consider: "consider", address: "address" };

  /* custom plugin — stay bands, flight marks, event lines, flag badges */
  const journeyDeco = {
    id: "journeyDeco",
    afterDatasetsDraw(chart, args, opts) {
      const { ctx, chartArea: a, scales: { x } } = chart;
      if (!a) return;
      ctx.save();
      (opts.bands || []).forEach((b) => {
        const x1 = x.getPixelForValue(b.from), x2 = x.getPixelForValue(b.to);
        ctx.fillStyle = b.fill;
        ctx.fillRect(x1, a.top, x2 - x1, a.bottom - a.top);
        ctx.strokeStyle = b.edge; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(x1, a.top); ctx.lineTo(x1, a.bottom); ctx.moveTo(x2, a.top); ctx.lineTo(x2, a.bottom); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = b.text; ctx.font = "600 10px Roboto, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillText(b.label, x1 + 5, b.labelY === "low" ? a.bottom - 22 : a.top + 26);
        if (b.flights) {
          ctx.font = "12px system-ui, sans-serif"; ctx.fillStyle = b.text;
          ctx.fillText("✈", x1 + 4, a.bottom - 7);
          ctx.textAlign = "right"; ctx.fillText("✈", x2 - 4, a.bottom - 7);
          ctx.textAlign = "left";
        }
      });
      (opts.flags || []).forEach((f, i) => {
        const x1 = x.getPixelForValue(f.from), x2 = x.getPixelForValue(f.to ?? f.from);
        const col = FLAG_COL[f.kind] || FLAG_COL.consider;
        ctx.strokeStyle = col; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x1, a.top + 1.5); ctx.lineTo(Math.max(x2, x1 + 4), a.top + 1.5); ctx.stroke();
        const cx = Math.min(Math.max((x1 + x2) / 2, a.left + 9), a.right - 9);
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, a.top + 12, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "700 9px Roboto, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), cx, a.top + 12.5);
      });
      (opts.events || []).forEach((e, i) => {
        const ex = Math.min(Math.max(x.getPixelForValue(e.x), a.left + 12), a.right - 12);
        ctx.strokeStyle = "#0F172A"; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(ex, a.top + 24); ctx.lineTo(ex, a.bottom); ctx.stroke();
        ctx.setLineDash([]);
        const by = a.bottom - 16 - (i % 3) * 17;
        const tag = "E" + (i + 1);
        ctx.font = "700 9px Roboto, system-ui, sans-serif";
        const w = ctx.measureText(tag).width + 10;
        ctx.fillStyle = "#0F172A";
        ctx.beginPath(); ctx.roundRect(ex - w / 2, by - 7, w, 14, 7); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(tag, ex, by + 0.5);
      });
      ctx.restore();
    },
  };

  function JourneyGraph({ mode, versions, holdRef, turiPrice, turiRepriced, mdGenerated, mdSent }) {
    const d = tredi.journey[mode];
    const canvasRef = React.useRef(null);
    const chartRef = React.useRef(null);

    /* ---- derive bands + events from portal state ---- */
    let bands = [], events = [];
    if (mode === "bravo") {
      const hasV2 = (versions || []).some((v) => v.versionId === "V2");
      const v2Held = (versions || []).some((v) => v.versionId === "V2" && v.status === "held");
      if ((versions || []).length > 0) {
        bands.push(hasV2
          ? { from: 4, to: 14, fill: "rgba(92,106,115,.10)", edge: "#94A3B8", text: "#64748B", label: "V1 stay · 12–22 · superseded", labelY: "low" }
          : { from: 4, to: 14, fill: "rgba(41,112,122,.10)", edge: "#29707A", text: "#1F5A63", label: "V1 stay · 12–22 Aug", flights: true });
      }
      if (hasV2) bands.push({ from: 7, to: 17, fill: "rgba(41,112,122,.12)", edge: "#29707A", text: "#1F5A63", label: `V2 stay · 15–25 Aug${v2Held ? " · held" : ""}`, flights: true });
      if (versions && versions.length > 0) events.push({ x: 4, label: "Selected Family Select · drafted V1", icon: "recommend" });
      if (holdRef) events.push({ x: 4, label: `Hold ${holdRef} placed · approved by you`, icon: "checkmark-filled" });
      if (hasV2) events.push({ x: 7, label: "Started three days later · V2 −€90", icon: "analytics" });
      if (mdSent) events.push({ x: 7, label: "proposal.md sent to the Carters", icon: "arrow-up-right" });
    } else {
      bands = d.stops.map((s) => ({ from: s.from, to: s.to, fill: s.color + "1A", edge: s.color, text: s.color, label: s.label }));
      bands[0].flights = true; bands[bands.length - 1].flights = true;
      if (turiRepriced) events.push({ x: d.repriceIdx, label: "Live price watch · Neos −€120, repriced", icon: "analytics" });
      if (mdGenerated) events.push({ x: d.repriceIdx, label: "proposta-ferrante.md written", icon: "document-chart" });
      if (mdSent) events.push({ x: d.repriceIdx, label: "Sent to the Ferrantes", icon: "arrow-up-right" });
    }

    /* ---- price series (turisanda reprices live) ---- */
    let prices = d.prices;
    if (mode === "turisanda" && turiRepriced) {
      prices = d.prices.map((v, i) => (i === d.repriceIdx ? turiPrice : v));
    }

    const depsKey = JSON.stringify([mode, bands.map((b) => b.label), events.map((e) => e.label), prices[d.repriceIdx || 0]]);

    React.useEffect(() => {
      if (!canvasRef.current || !window.Chart) return;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      const datasets = [
        {
          label: d.priceLabel, data: prices,
          borderColor: "#29707A", backgroundColor: "rgba(41,112,122,.12)",
          fill: true, tension: 0.35, pointRadius: prices.map((_, i) => (mode === "turisanda" && turiRepriced && i === d.repriceIdx ? 5 : 0)),
          pointBackgroundColor: "#FF462D", pointBorderColor: "#fff", pointBorderWidth: 1.5, borderWidth: 2,
        },
      ];
      if (d.cap) datasets.push({ label: d.capLabel, data: Array(d.labels.length).fill(d.cap), borderColor: "#94A3B8", borderDash: [4, 4], pointRadius: 0, fill: false, borderWidth: 1.5 });
      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: { labels: d.labels, datasets },
        options: {
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 10, boxHeight: 10, padding: 12, color: "#64748B", font: { size: 11 } } },
            tooltip: { backgroundColor: "#0F172A", padding: 10, cornerRadius: 4, callbacks: { label: (c) => c.dataset.label.split(" · ")[0] + ": " + fmtEUR(c.raw) } },
            journeyDeco: { bands, events, flags: d.flags },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: "#64748B", maxTicksLimit: 8, font: { size: 10 } } },
            y: { min: d.yMin, max: d.yMax, grid: { color: "#F1F5F9" }, ticks: { color: "#64748B", font: { size: 10 }, callback: (v) => "€" + (v >= 1000 ? (v / 1000).toFixed(1).replace(".0", "") + "k" : v) } },
          },
        },
        plugins: [journeyDeco],
      });
      return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
    }, [depsKey]);

    return (
      <section className="sf-journey" data-screen-label="Journey graph">
        <div className="jh">
          <span className="ic"><Ki name="analytics" size={14} /></span>
          <div><div className="t">{d.title}</div><div className="s">{d.sub}</div></div>
          <span className="livechip"><span className="dot"></span> logs your session</span>
        </div>
        <div className="jbody">
          <div className="jchart"><canvas ref={canvasRef} aria-label="Journey graph"></canvas></div>
          <aside className="jside">
            <div className="jl">Market & customer signals</div>
            {d.flags.map((f, i) => (
              <div className="jrow" key={i}>
                <span className="badge" style={{ background: FLAG_COL[f.kind] }}>{i + 1}</span>
                <span className="jt"><b>{f.label} <em className={`k ${f.kind}`}>{FLAG_LBL[f.kind]}</em></b><i>{f.detail}</i></span>
              </div>
            ))}
            <div className="jl" style={{ marginTop: 6 }}>Session log — your actions on this graph</div>
            {events.length === 0
              ? <div className="jempty">Work the package — selections, holds and changes land here as E-markers.</div>
              : events.map((e, i) => (
                <div className="jrow" key={"e" + i}>
                  <span className="badge ev">E{i + 1}</span>
                  <span className="jt"><b>{e.label}</b></span>
                </div>
              ))}
          </aside>
        </div>
      </section>
    );
  }

  Object.assign(window, { SfJourneyGraph: JourneyGraph });
})();
