/* ============================================================
   EasyBook Next — B2B Storefront · product drawer + package panel
   ============================================================ */
import React from 'react';
import ReactDOM from 'react-dom';
import { fmtEUR, products, availability, addons, brands, priceCalendar } from './data';
import { Ki, Stars, Allot, SrcChip, Badge, AiRender } from './Primitives';
import { PriceCalendarChart } from './Charts';

/* ---------- detail drawer ---------- */
export function Drawer({ pid, onClose, onSource, selAddons, onToggleAddon, cta, onCta, busy }: {
  pid: string; onClose: () => void; onSource?: (ids: string[]) => void;
  selAddons: string[]; onToggleAddon: (id: string) => void;
  cta?: string; onCta?: () => void; busy?: boolean;
}) {
  const p = (products as any)[pid];
  const b = (brands as any[]).find((x: any) => x.id === p.brand);
  const avail = (availability as any)[pid];
  const addonTotal = (addons as any[]).filter((a: any) => selAddons.includes(a.id)).reduce((s: number, a: any) => s + a.price, 0);

  React.useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      <div className="sf-scrim" onClick={onClose}></div>
      <aside className="sf-drawer" role="dialog" aria-label={`${p.name} details`} data-screen-label="Product detail drawer">
        <div className="sf-drawer-head">
          <div>
            <h2>{p.name}</h2>
            <div className="sub"><Stars n={p.rating} /> {p.dest} · {b.name} · {p.board} <Allot a={p.allotment} /></div>
          </div>
          <button className="x" onClick={onClose}>Close ✕</button>
        </div>
        <div className="sf-drawer-body">
          <div className="sf-sec">
            <h3><Ki name="checkmark-filled" size={14} /> Verified facts <SrcChip ids={p.receipts.filter((r: string) => r !== 'inv1' && r !== 'prc1')} onSource={onSource} /></h3>
            <div className="sf-facts">
              {p.amenities.map((a: string) => <div key={a} className="sf-fact"><Ki name="checkmark-filled" size={13} /> {a}</div>)}
            </div>
            <p style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 7, lineHeight: 1.5 }}>
              Facts come from the structured product master, not the brochure. Catalogue copy is shown as descriptive enrichment only — it never overrides live inventory.
            </p>
          </div>

          {avail && (
            <div className="sf-sec">
              <h3><Ki name="dashboard" size={14} /> August availability <SrcChip ids={['inv1']} onSource={onSource} /></h3>
              <div className="sf-availstrip" role="img" aria-label="Daily availability, August 5 to 19">
                {avail.map((c: any) => <span key={c.d} className={`cell ${c.s} ${c.req ? 'req' : ''}`}>{c.d}</span>)}
              </div>
              <div className="sf-avail-legend">
                <span>■ Available</span><span>■ Low allotment</span><span>■ Sold out</span><span>◻ Requested dates outlined</span>
              </div>
            </div>
          )}

          {(priceCalendar as any)[pid] && p.allotment.status !== 'sold_out' && (
            <div className="sf-sec">
              <PriceCalendarChart pid={pid} />
            </div>
          )}

          <div className="sf-sec">
            <h3><Ki name="analytics" size={14} /> Rate · family 2+1 · {p.nights} nights <SrcChip ids={['prc1']} onSource={onSource} /></h3>
            <div className="sf-rate">
              <div className="row"><span className="l">Package gross (flight + hotel + board)</span><b className="num">{p.allotment.status === 'sold_out' ? '—' : fmtEUR(p.price)}</b></div>
              {(addons as any[]).map((a: any) => selAddons.includes(a.id) && <div className="row" key={a.id}><span className="l">{a.name}</span><b className="num">{fmtEUR(a.price)}</b></div>)}
              <div className="row total"><span className="l">Customer total</span><b className="num">{p.allotment.status === 'sold_out' ? '—' : fmtEUR(p.price + addonTotal)}</b></div>
              <div className="row agent sf-agent-only"><span className="l">Net to agency · your commission</span><b className="num">{p.allotment.status === 'sold_out' ? '—' : `${fmtEUR(p.net)} · ${fmtEUR(p.commission)} (${p.commissionPct}%)`}</b></div>
            </div>
          </div>

          {p.allotment.status !== 'sold_out' && (
            <div className="sf-sec">
              <h3><Ki name="recommend" size={14} /> Suggested add-ons <Badge kind="ai" icon="lightbulb">Ranked for a 2-year-old</Badge></h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {(addons as any[]).map((a: any) => {
                  const sel = selAddons.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      className={`sf-addon ${sel ? 'sel' : ''}`}
                      role="checkbox"
                      aria-checked={sel}
                      tabIndex={0}
                      onClick={() => onToggleAddon(a.id)}
                      onKeyDown={(e) => e.key === 'Enter' && onToggleAddon(a.id)}
                    >
                      <span className="cb">{sel ? '✓' : ''}</span>
                      <span>{a.name} <span className="why">— {a.why}</span></span>
                      <span className="pr num">+{fmtEUR(a.price)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {p.allotment.status === 'sold_out' && (
            <div className="sf-soldout">
              <span className="ic"><Ki name="error-filled" size={15} /></span>
              <div>
                <div className="t">No allotment for the requested dates.</div>
                <div className="s">Live inventory shows the hotel closed from 8 August. Super TREDI has already ranked three close alternatives on the shelf — same destination, board basis and family fit.</div>
              </div>
            </div>
          )}
        </div>
        <div className="sf-drawer-foot">
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', flex: 1 }}>Commercial commits always need your approval.</span>
          <button className="sf-btn" onClick={onClose}>Back to shelf</button>
          {cta && <button className="sf-btn primary" disabled={busy} onClick={onCta}>{cta}</button>}
        </div>
      </aside>
    </>
  );
}

/* ---------- package / proposal panel ---------- */
export function PackagePanel({ versions, activeId, onSetActive, selAddons, onShare, onSource }: {
  versions: any[]; activeId: string; onSetActive: (id: string) => void;
  selAddons: string[]; onShare: () => void; onSource?: (ids: string[]) => void;
}) {
  const [preview, setPreview] = React.useState(false);
  const v = versions.find((x) => x.versionId === activeId) || versions[versions.length - 1];
  const p = (products as any)[v.offerId];
  const adds = (addons as any[]).filter((a: any) => selAddons.includes(a.id));
  return (
    <section className="sf-pkg" data-screen-label="Proposal panel">
      <div className="sf-pkg-h">
        <span className="ic"><Ki name="document-chart" size={15} /></span>
        <div>
          <h3>Proposal · The Carter family</h3>
          <div className="sub">Versions are immutable — changes create a new version, the old one stays revertible.</div>
        </div>
        <div className="right">
          <span className="sf-stepchip">Step 6 · Proposal Preparation</span>
          <SrcChip ids={['prc1', 'pol1']} onSource={onSource} />
          <button className="sf-btn sm" onClick={() => setPreview(true)}>Preview customer view</button>
          <button className="sf-btn sm primary" onClick={onShare}>Share with customer</button>
        </div>
      </div>
      {preview && <CustomerPreview v={v} p={p} onClose={() => setPreview(false)} />}
      <div className="sf-verstrip">
        {versions.map((x) => (
          <button key={x.versionId} className={`sf-ver ${x.versionId === (v && v.versionId) ? 'on' : ''}`} onClick={() => onSetActive(x.versionId)}>
            {x.versionId} · {x.dates} <span className={`st ${x.status}`}>{x.status}</span>
          </button>
        ))}
      </div>
      <div className="sf-lines">
        <div className="sf-line"><Ki name="dashboard" size={14} /> <span>{p.name} · {p.board} · {p.nights} nights <span className="m">{v.dates} · family rooms</span></span><span className="pr num">{fmtEUR(v.hotelFlight)}</span></div>
        <div className="sf-line"><Ki name="arrow-up-right" size={14} /> <span>Flights YYZ → Rome FCO · return <span className="m">{v.dates}</span></span><span className="pr">included</span></div>
        {adds.map((a: any) => <div className="sf-line" key={a.id}><Ki name="recommend" size={14} /> <span>{a.name} <span className="m">{a.why}</span></span><span className="pr num">{fmtEUR(a.price)}</span></div>)}
        <div className="sf-line" style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}><Ki name="checkmark-filled" size={14} /> <b>Customer total</b><span className="pr num" style={{ fontSize: 16 }}>{fmtEUR(v.total)}</span></div>
        <div className="sf-line sf-agent-only" style={{ color: 'var(--k-spruce-80)' }}><Ki name="analytics" size={14} /> <span style={{ fontWeight: 600 }}>Your commission · Gold tier</span><span className="pr num" style={{ color: 'var(--k-spruce-70)' }}>{fmtEUR(v.commission)}</span></div>
      </div>
      {v.delta && (
        <div className="sf-diff" style={{ marginTop: 11 }}>
          <b>{v.versionId} vs {v.delta.vs}:</b> {v.delta.amount < 0 ? '−' : '+'}{fmtEUR(Math.abs(v.delta.amount))} — {v.delta.reason}. Hotel, room type and amenities are identical. <SrcChip ids={['pol1']} onSource={onSource} />
        </div>
      )}
    </section>
  );
}

export function HoldReceipt({ version, total, holdRef }: { version: string; total: number; holdRef: string }) {
  return (
    <div className="sf-holdrcpt" data-screen-label="Hold receipt">
      <span className="ic"><Ki name="checkmark-filled" size={15} /></span>
      <div>
        <div className="t">Hold confirmed · {holdRef} <span className="sf-stepchip">Step 7 · Booking Support</span></div>
        <div className="s">Rome · Florence · Amalfi locked under proposal <b>{version}</b> at <b className="num">{fmtEUR(total)}</b> until tomorrow 18:00. Releasing the hold is reversible from the timeline.</div>
      </div>
    </div>
  );
}

export function DeflectionCard() {
  return (
    <section className="sf-deflect" data-screen-label="Self-service summary">
      <h3><Ki name="recommend" size={15} /> Completed without a single support contact</h3>
      <ul>
        <li><Ki name="checkmark-filled" /> Sold-out recovered into a sale</li>
        <li><Ki name="checkmark-filled" /> Proposal self-served · V1 → V2</li>
        <li><Ki name="checkmark-filled" /> Hold self-served · AT-88421</li>
        <li><Ki name="checkmark-filled" /> Change repriced and committed</li>
        <li><Ki name="checkmark-filled" /> 2 approvals · both human-gated</li>
        <li><Ki name="checkmark-filled" /> Full audit trail in the timeline</li>
      </ul>
    </section>
  );
}

/* ---------- breakout modal: the end-customer's mobile view ---------- */
function CustomerPreview({ v, p, onClose }: { v: any; p: any; onClose: () => void }) {
  const hi = (p.hi && p.hi.length ? p.hi : ['Family rooms', 'Short transfers']).concat(['Air-con']);
  const [rendering, setRendering] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setRendering(false), 2200); return () => clearTimeout(t); }, []);
  return ReactDOM.createPortal((
    <div className="cpv-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} data-screen-label="Customer view preview">
      <div className="cpv-modal" role="dialog" aria-label="Customer view preview">
        <div className="cpv-head">
          <div><span className="eyb">Preview · what the customer sees</span><h3>On the Carter family's phone</h3></div>
          <button className="cpv-x" onClick={onClose} aria-label="Close preview">✕</button>
        </div>
        <div className="cpv-phone">
          <div className="cpv-notch" aria-hidden="true"></div>
          <div className="cpv-screen">
            {rendering && (
              <div className="cpv-render" aria-live="polite">
                <AiRender label="Creating the customer page" />
              </div>
            )}
            <div className="cpv-hero">
              <div className="cpv-hero-top"><span className="cpv-circ">‹</span><span className="cpv-pill">Italy</span></div>
              <div className="cpv-hero-cap">
                <span className="cpv-kick">Your trip · ready to confirm</span>
                <h2>10 Days in Italy</h2>
                <div className="cpv-loc"><Ki name="network" size={12} /> Rome · Florence · Amalfi Coast</div>
              </div>
            </div>
            <div className="cpv-body">
              <div className="cpv-srow">
                <div className="cpv-rate">★ 4.9 <i>family favourite</i></div>
                <div className="cpv-price"><b className="num">{fmtEUR(v.total)}</b><i>family · 10 days</i></div>
              </div>
              <div className="cpv-cta">
                <button className="cpv-btn primary">Confirm my holiday</button>
                <button className="cpv-btn">Ask a question</button>
              </div>
              <div className="cpv-chips">{hi.map((h: string) => <span key={h}>{h}</span>)}</div>
              <p className="cpv-desc">Ten days across Rome, Florence and the Amalfi Coast at a toddler's pace — food, history and slow mornings, with the family rooms, air-con and short transfers you asked for.</p>
              <div className="cpv-trip">
                <div className="cpv-tr"><span className="ic"><Ki name="dashboard" size={13} /></span><span><b>Rome · days 1–4</b><i>central family suite · {v.dates}</i></span></div>
                <div className="cpv-tr"><span className="ic"><Ki name="dashboard" size={13} /></span><span><b>Florence · days 5–7</b><i>air-conditioned, steps from the Duomo</i></span></div>
                <div className="cpv-tr"><span className="ic"><Ki name="network" size={13} /></span><span><b>Amalfi Coast · days 8–10</b><i>family rooms above the sea</i></span></div>
                <div className="cpv-tr"><span className="ic"><Ki name="group" size={13} /></span><span><b>Private transfers</b><i>short hops · child seat included</i></span></div>
              </div>
              <div className="cpv-hold"><Ki name="checkmark-filled" size={14} /> <span>Reserved for you until <b>tomorrow 18:00</b> · ref AT-88421</span></div>
              <div className="cpv-agent">
                <span className="av">G</span>
                <div><b>Giulia Rossi · Rossi Travel</b><i>Your trip, payment and any changes stay with Giulia.</i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="cpv-foot"><Ki name="information" size={12} /> Read-only preview · no agent chrome, no commission shown</div>
      </div>
    </div>
  ), document.body);
}
