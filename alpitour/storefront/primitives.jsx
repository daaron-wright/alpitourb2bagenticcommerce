/* ============================================================
   EasyBook Next — B2B Storefront · primitives
   Ki icon, badges, allotment pill, freshness, source chips, stars.
   ============================================================ */
(function () {
  const { fmtEUR, receipts } = window.SF;

  function Ki({ name, size = 16, className = "" }) {
    return <svg className={`ki ${className}`} style={size !== 16 ? { width: size, height: size } : null}><use href={`#icon-${name}`} /></svg>;
  }

  /* AlpiConcierge identity mark — the infinity symbol (Alpitour World) */
  function Inf({ size = 13, className = "" }) {
    return (
      <svg className={`sf-inf ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: size, height: size, display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
        <path d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828" />
      </svg>
    );
  }

  function Stars({ n }) {
    return <span className="stars" aria-label={`${n} star category`}>{"★".repeat(n)}</span>;
  }

  function Badge({ kind = "neutral", icon, children }) {
    return <span className={`sf-badge ${kind}`}>{icon && <Ki name={icon} size={11} />}{children}</span>;
  }

  /* allotment pill — availability is never colour-only: icon + label */
  function Allot({ a }) {
    if (a.status === "sold_out") return <span className="sf-allot no"><Ki name="error-filled" size={11} /> Sold out · live {a.checked}</span>;
    if (a.status === "low") return <span className="sf-allot low"><Ki name="warning-alt" size={11} /> {a.left} left · live {a.checked}</span>;
    if (a.status === "on_request") return <span className="sf-allot req"><Ki name="information" size={11} /> On request</span>;
    return <span className="sf-allot ok"><Ki name="checkmark-filled" size={11} /> {a.left} left · live {a.checked}</span>;
  }

  function Fresh({ f, label }) {
    return <span className={`sf-fresh ${f}`}><span className="d" />{label || (f === "live" ? "Live" : f === "recent" ? "Recent" : "Stale")}</span>;
  }

  /* source chip — clicking routes to the Sources tab in the rail */
  function SrcChip({ ids, onSource }) {
    const rs = ids.map((i) => receipts[i]).filter(Boolean);
    if (!rs.length) return null;
    const kinds = [...new Set(rs.map((r) => r.kind === "inventory_api" ? "inventory" : r.kind === "pricing_api" ? "pricing" : r.kind === "product_master" ? "product master" : r.kind === "policy_doc" ? "policy" : "catalogue"))];
    return (
      <button type="button" className="sf-srcchip" onClick={(e) => { e.stopPropagation(); onSource && onSource(ids); }} title="Open source receipts">
        <Ki name="document-chart" size={11} />
        <span className="u">{kinds.join(" · ")}</span>
      </button>
    );
  }

  /* full receipt card (Sources tab) */
  function SourceCard({ r }) {
    const conf = r.confidence === "high" ? "ok" : r.confidence === "medium" ? "warn" : "err";
    return (
      <div className="sf-src">
        <div className="t"><Ki name="document-chart" size={13} /> {r.label}</div>
        <div className="meta">
          <Fresh f={r.freshness} label={`${r.freshness === "live" ? "Live · checked" : "Updated"} ${r.checked}`} />
          <Badge kind={conf} icon={r.confidence === "high" ? "checkmark-filled" : "warning-alt"}>{r.confidence} confidence</Badge>
        </div>
        <div className="reason">{r.reason}</div>
      </div>
    );
  }

  function Toast({ text, delta }) {
    if (delta) return <div className="sf-toast delta" role="status"><span className="pre">state.delta</span><span>{text}</span></div>;
    return <div className="sf-toast" role="status">{text}</div>;
  }

  /* AlpiConcierge panel-render loader — the DS canonical "Panel render" (ai-loader.html):
     soft dot-grid with Warm-Red + Spruce blob morph + drift, status label with blinking caret.
     Used for every generative loading moment (chat working, search, proposal, customer preview). */
  function AiRender({ label = "Sketching it out", compact = false }) {
    return (
      <div className={`panel-load ${compact ? "compact" : ""}`} aria-live="polite" data-screen-label="AI panel render">
        <span className="label">{label}</span>
        <div className="grid"></div>
        <div className="grid tint"></div>
        <div className="grid spruce"></div>
      </div>
    );
  }

  Object.assign(window, { Ki, SfInf: Inf, SfAiRender: AiRender, SfStars: Stars, SfBadge: Badge, SfAllot: Allot, SfFresh: Fresh, SfSrcChip: SrcChip, SfSourceCard: SourceCard, SfToast: Toast });
})();
