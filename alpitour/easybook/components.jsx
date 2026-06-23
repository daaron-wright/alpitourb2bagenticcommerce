/* ============================================================
   EasyBook Next — presentational components
   ============================================================ */
(function () {
  const { fmtEUR, receipts } = window.EB;

  function Ki({ name, size = 16 }) {
    return <svg className="ki" style={size !== 16 ? { width: size, height: size } : null}><use href={`#icon-${name}`} /></svg>;
  }

  function Card({ icon, title, sub, badges, children }) {
    return (
      <div className="eb-card">
        {(icon || title) && (
          <div className="eb-card-h">
            {icon && <span className="ic"><Ki name={icon} size={15} /></span>}
            <div><h3>{title}</h3>{sub && <div className="sub">{sub}</div>}</div>
            {badges && <div className="right">{badges}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }

  const Fresh = ({ kind, children }) => <span className={`eb-fresh ${kind}`}><Ki name={kind === "live" ? "checkmark-filled" : kind === "stale" ? "warning-alt" : "information"} size={10} /> {children}</span>;

  function Receipts({ ids }) {
    return (
      <div className="eb-receipts">
        {ids.map((id) => {
          const r = receipts[id];
          return (
            <div className="eb-receipt" key={id}>
              <Ki name="document-chart" size={12} />
              <span style={{ flex: 1, minWidth: 0 }}>{r.label}</span>
              <Fresh kind={r.freshness}>{r.checked}</Fresh>
            </div>
          );
        })}
      </div>
    );
  }

  /* ---------- left summary rail ---------- */
  function SummaryRail({ stageIdx, needs, blockers, signals, selected, onFixBlocker }) {
    const { offers } = window.EB;
    const sel = selected ? offers[selected] : null;
    return (
      <aside className="eb-rail-l">
        <div className="eb-sec">
          <div className="eb-sec-h">Customer intent</div>
          <div className="eb-chips">
            {needs.map((n) => <span className="eb-chip" key={n.id}><Ki name="checkmark-filled" size={12} /> {n.label}</span>)}
            {signals.includes("baby_pool") && <span className="eb-chip signal"><Ki name="recommend" size={12} /> baby-friendly priority</span>}
          </div>
        </div>
        {blockers.length > 0 && (
          <div className="eb-sec">
            <div className="eb-sec-h">Blocking questions <span className="right eb-badge warn">{blockers.length}</span></div>
            <div className="eb-chips">
              {blockers.map((b) => (
                <button className="eb-chip blocker" key={b.id} onClick={() => onFixBlocker(b)} title={`Resolve: ${b.fix}`}>
                  <Ki name="warning-alt" size={12} /> {b.label}
                </button>
              ))}
            </div>
            <div className="eb-empty-note">Tap a question to resolve it — AlpiGPT suggests the customer's answer from the brief.</div>
          </div>
        )}
        <div className="eb-sec">
          <div className="eb-sec-h">Verified facts</div>
          {stageIdx >= 3
            ? <div className="eb-chips"><Fresh kind="live">Inventory · 43s ago</Fresh><Fresh kind="live">Pricing · 41s ago</Fresh><Fresh kind="recent">Hotel facts · 12 May</Fresh></div>
            : <div className="eb-empty-note">Facts appear here with source and freshness once retrieval runs.</div>}
        </div>
        <div className="eb-sec">
          <div className="eb-sec-h">Selected package</div>
          {sel
            ? <div className="eb-selpkg"><div className="t">{sel.hotelName}</div><div className="s">12–19 Aug · 7 nights · all inclusive · Neos FCO→SSH</div><div className="p">{fmtEUR(sel.price)}</div></div>
            : <div className="eb-empty-note">No package selected yet.</div>}
        </div>
      </aside>
    );
  }

  /* ---------- center: intake / facts / soldout / compare ---------- */
  function IntakeCard() {
    return (
      <Card icon="document-chart" title="Work package WP-2231 · Famiglia Bianchi" sub="Seeded lead · natural-language brief captured below" badges={<span className="eb-badge ai"><Ki name="recommend" size={11} /> Requirement Extractor</span>}>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, background: "var(--color-bg-canvas)", borderRadius: 8, padding: "10px 13px", fontStyle: "italic" }}>
          “Family of 3 — two adults and a 2-year-old — wants an all-inclusive week in Sharm el-Sheikh, 12–19 August, budget €3,500 max. They loved Jaz Mirabel Beach and want it again.”
        </div>
        <div style={{ fontSize: 11.5, color: "var(--color-text-muted)", marginTop: 9 }}>Structured into requirement chips on the left — two questions still block the search.</div>
      </Card>
    );
  }

  function FactsCard() {
    const h = window.EB.offers.jaz;
    return (
      <Card icon="lightbulb" title="Jaz Mirabel Beach — verified facts" sub="Product master · structured amenity record" badges={<span className="eb-badge ok"><Ki name="checkmark-filled" size={11} /> Source-backed</span>}>
        <div className="eb-amens">
          {h.amenities.map((a) => <span className="eb-amen hi" key={a}>{a} ✓</span>)}
        </div>
        <Receipts ids={["pm1", "cat1"]} />
      </Card>
    );
  }

  function SoldOutCard() {
    return (
      <>
        <div className="eb-soldout">
          <span className="ic"><Ki name="warning-alt" size={16} /></span>
          <div style={{ flex: 1 }}>
            <div className="t">That preferred option is unavailable for those dates.</div>
            <div className="s">Jaz Mirabel Beach · 12–19 Aug · all allotments consumed — live inventory, checked 43s ago.</div>
          </div>
        </div>
        <Card icon="recommend" title="Sold-out recovery" sub="Sold-out Recovery Planner · same destination, similar board & family amenities">
          <div style={{ fontSize: 12.5, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
            I found <b>three close alternatives</b> with similar family amenities and board basis. Hard constraints kept: dates, party, all-inclusive, ≤ €3,500 (one flagged exception).
          </div>
          <Receipts ids={["inv1", "prc1"]} />
        </Card>
      </>
    );
  }

  function CompareGrid({ onSelect, busy }) {
    const { offers } = window.EB;
    return (
      <div className="eb-compare">
        {[offers.coral, offers.redsea, offers.sinai].map((o) => (
          <div className={`eb-offer ${o.rank === "Best match" ? "best" : ""}`} key={o.offerId}>
            <span className="rank"><span className={`eb-badge ${o.rank === "Best match" ? "info" : o.rank === "Best value" ? "ok" : "warn"}`}>{o.rank}</span></span>
            <h4>{o.hotelName}</h4>
            <div className="price">{fmtEUR(o.price)} <small>family of 3 · 7 nights</small></div>
            <div className="eb-match"><span>Match</span><span className="bar"><i style={{ width: o.match + "%" }} /></span><b>{o.match}%</b></div>
            <div className="eb-amens">{o.amenities.slice(0, 4).map((a) => <span key={a} className={`eb-amen ${(o.hi || []).includes(a) ? "hi" : ""}`}>{a}</span>)}</div>
            <ul className="eb-whys">{o.matchReasons.map((m) => <li key={m}>{m}</li>)}</ul>
            <button className="eb-btn primary" disabled={busy} onClick={() => onSelect(o.offerId)}>Select offer</button>
          </div>
        ))}
      </div>
    );
  }

  /* ---------- proposal + versions + diff ---------- */
  function ProposalCard({ versions, activeId, onSetActive, addons }) {
    const v = versions.find((x) => x.versionId === activeId) || versions[versions.length - 1];
    const o = window.EB.offers[v.offerId];
    return (
      <Card icon="document-chart" title="Proposal" sub="Composed by the Proposal Composer · review before sharing" badges={<><span className="eb-badge ok"><Ki name="checkmark-filled" size={11} /> Policy validated</span><span className="eb-badge info">{v.status}</span></>}>
        <div className="eb-verstrip" style={{ marginBottom: 12 }}>
          {versions.map((ver) => (
            <button key={ver.versionId} className={`eb-verchip ${ver.versionId === v.versionId ? "active" : ""}`} onClick={() => onSetActive(ver.versionId)}>
              {ver.versionId} <span className="st">{ver.status}</span>
            </button>
          ))}
        </div>
        <div className="eb-seg"><span className="ic"><Ki name="arrow-up-right" size={14} /></span><div><div className="t">Flight · Neos</div><div className="s">Rome FCO → Sharm el-Sheikh · {v.dates}</div></div><span className="p"><small>included</small></span></div>
        <div className="eb-seg"><span className="ic"><Ki name="dashboard" size={14} /></span><div><div className="t">{o.hotelName}</div><div className="s">7 nights · all inclusive · family room</div></div><span className="p">{fmtEUR(o.price)}</span></div>
        {addons.map((a) => (
          <div className="eb-seg" key={a.id}><span className="ic"><Ki name="recommend" size={14} /></span><div><div className="t">{a.name}</div><div className="s">Add-on · {a.why}</div></div><span className="p">+{fmtEUR(a.price)}</span></div>
        ))}
        <div className="eb-totals" style={{ marginTop: 12 }}>
          <div className="row"><span>Total client price</span><b style={{ fontFamily: "var(--font-head)", fontSize: 17 }}>{fmtEUR(v.total)}</b></div>
          <div className="row"><span>Agency commission · Gold 12%</span><b>{fmtEUR(Math.round(v.total * 0.12))}</b></div>
          {v.delta && <div className="row"><span>Change vs {v.delta.vs}</span><span className={`eb-delta ${v.delta.amount < 0 ? "down" : "up"}`}>{v.delta.amount < 0 ? "−" : "+"}{fmtEUR(Math.abs(v.delta.amount))} · {v.delta.reason}</span></div>}
        </div>
        <Receipts ids={["prc1", "pol1"]} />
      </Card>
    );
  }

  function DiffCard({ onApprove, onRevert, busy }) {
    return (
      <Card icon="analytics" title="Your change is ready — review the diff" sub="Modification & Reprice skill · V2 draft vs V1 (held)" badges={<span className="eb-badge warn"><Ki name="warning-alt" size={11} /> Awaiting your approval</span>}>
        <table className="eb-diff">
          <thead><tr><th></th><th>V1 · held</th><th>V2 · draft</th></tr></thead>
          <tbody>
            <tr className="changed"><td className="lbl">Dates</td><td>12–19 August</td><td><b>5–12 August</b></td></tr>
            <tr className="changed"><td className="lbl">Total price</td><td>{fmtEUR(3465)}</td><td><b>{fmtEUR(3365)}</b> <span className="eb-delta down">−€100 · flight fare lower</span></td></tr>
            <tr><td className="lbl">Hotel</td><td colSpan="2">Coral Bay Family Resort — unchanged, amenities identical</td></tr>
            <tr><td className="lbl">Flight route</td><td colSpan="2">Rome FCO → Sharm · Neos — same routing, earlier week</td></tr>
            <tr><td className="lbl">Hold</td><td colSpan="2">AT-88421 updates to V2 on approval · V1 kept immutable</td></tr>
          </tbody>
        </table>
        <Receipts ids={["inv1", "prc1", "pol1"]} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <button className="eb-btn" disabled={busy} onClick={onRevert}>Keep V1</button>
          <button className="eb-btn primary" disabled={busy} onClick={onApprove}><Ki name="checkmark-filled" size={13} /> Approve V2 &amp; update hold</button>
        </div>
      </Card>
    );
  }

  function HoldCard({ version, total }) {
    return (
      <Card icon="checkmark-filled" title="Hold placed successfully" sub="Hold/Servicing Executor · confirmed via booking platform" badges={<span className="eb-badge ok">Self-service · no support contact</span>}>
        <div className="eb-holdref">
          <span className="ref">AT-88421</span>
          <span className="eb-badge info">Proposal {version}</span>
          <span className="exp">locked until tomorrow 18:00</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-head)", fontSize: 18 }}>{fmtEUR(total)}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 10, lineHeight: 1.5 }}>
          This option is locked under proposal <b>{version}</b>. Share it, modify it, or release it — all from here. Every action lands in the timeline.
        </div>
      </Card>
    );
  }

  function DeflectionBanner({ items }) {
    return (
      <div className="eb-card" style={{ borderColor: "#BBDFC9", background: "var(--color-success-soft)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "var(--color-success)" }}><Ki name="checkmark-filled" size={15} /> Resolved in workspace — no support contact needed</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginTop: 10 }}>
          {items.map((t) => <div key={t} style={{ display: "flex", gap: 7, fontSize: 12, color: "var(--color-text-secondary)" }}><Ki name="checkmark-filled" size={12} /> {t}</div>)}
        </div>
      </div>
    );
  }

  Object.assign(window, { Ki, EbCard: Card, Fresh, Receipts, SummaryRail, IntakeCard, FactsCard, SoldOutCard, CompareGrid, ProposalCard, DiffCard, HoldCard, DeflectionBanner });
})();
