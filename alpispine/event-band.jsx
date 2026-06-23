/* ============================================================
   EventBand — the live-event posture dashboard.
   Lifted out of the fixed header into a proper dashboard band:
   the active orchestration record (trace + title + severity +
   live status) over a row of business-impact KPI tiles.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Button } = UI;

  function EventBand({ setScreen, compact }) {
    const D = window.D;
    const e = D.event;
    return (
      <div className={`evt-band ${compact ? "compact" : ""}`}>
        <div className="evt-head">
          <span className="evt-live"><span className="evt-dot" /> Live event</span>
          <span className="evt-trace">{e.trace}</span>
          <span className="evt-title">{e.title}</span>
          <span className={`evt-sev sev-${e.severity}`}>{e.severity}</span>
          <span className="evt-trigger"><Icon name="anomaly" size={12} /> {e.trigger}</span>
          {setScreen && (
            <button className="evt-cta" onClick={() => setScreen("flow")}>
              Trace it end-to-end <Stroke size={13} sw={2.4} children={<polyline points="9 6 15 12 9 18" />} />
            </button>
          )}
        </div>
        <div className="evt-kpis">
          {D.kpis.map((k, i) => (
            <div className="kpi-tile evt-kpi" key={i}>
              <div className="kl">{k.label}</div>
              <div className="kv tnum">{k.value}</div>
              <div className={`kd ${k.good ? "good" : "bad"}`}>
                <Icon name={k.dir === "up" ? "arrow-up-right" : "arrow-down-right"} size={13} /> {k.delta}
              </div>
              <div className="ks">{k.sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  UI.EventBand = EventBand;
})();
