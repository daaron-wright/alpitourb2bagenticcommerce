/* ============================================================
   EasyBook Next — B2B Storefront · Super TREDI surfaces
   Brand-pick tiles (in chat) · workshop sticky receipts ·
   live-updates feed · next-best-action card with package
   includes · rendered proposal.md preview · Turisanda panel.
   ============================================================ */
import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fmtEUR, tredi, products } from './data';
import { Ki, Inf } from './Primitives';
import { bus } from '@/shared/bus';

/* ---------- official 7-step journey strip ---------- */
export function JourneyStrip({ active }: { active: number }) {
  const steps = (tredi as any).useCase.steps;
  const a = steps[active - 1];
  return (
    <div className="sf-jstrip" data-screen-label="Use-case journey">
      <div className="jrowx">
        {steps.map((s: any) => (
          <div key={s.n} className={`st ${s.n < active ? 'done' : s.n === active ? 'on' : ''}`}>
            <span className="ln" aria-hidden="true"></span>
            <span className="ci">{s.n < active ? <Ki name="checkmark-filled" size={11} /> : s.n}</span>
            <span className="lb">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="det">
        <b>Step {a.n} · {a.label}</b>
        <span><i>Agent</i> {a.agent}</span>
        <span><i>Customer</i> {a.customer}</span>
      </div>
    </div>
  );
}

/* ---------- workshop sticky receipt (no-op surface) ---------- */
export function Sticky() {
  return null;
}

/* ---------- in-chat incoming requests ---------- */
export function RequestPick({ chosen, onPick }: { chosen: string | null; onPick: (id: string) => void }) {
  /* platform mode: the Bianchi card reflects the live Q&A from Alpitour.it */
  const busState = bus.state;
  return (
    <div className="sf-rq" data-screen-label="Incoming requests">
      {(tredi as any).requests.map((r: any) => {
        const isB = r.id === 'bianchi';
        const signals = isB && busState.brief ? busState.brief.answers.map((a: any) => a.v) : r.signals;
        const meta = isB && busState.brief ? 'via AlpiConcierge · cluster confirmed during inquiry · 24h hold' : r.meta;
        return (
          <button
            key={r.id}
            className={`sf-rq-card ${chosen === r.id ? 'on' : ''} ${chosen && chosen !== r.id ? 'dim' : ''}`}
            onClick={() => onPick(r.id)}
            disabled={!!chosen}
          >
            <span className="rh"><Ki name="group" size={12} /> <b>{r.who}</b><span className="m">{meta}</span></span>
            <span className="rw">"{r.words}"</span>
            <span className="rs">{signals.map((s: string) => <i key={s}>{s}</i>)}</span>
            {chosen === r.id
              ? <span className="picked"><Ki name="checkmark-filled" size={11} /> Working this request</span>
              : <span className="cta">Work this request →</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- cluster.match result — 8-cell grid, one lit ---------- */
export function ClusterMatch({ c }: { c: any }) {
  const hit = (tredi as any).clusters.find((x: any) => x.id === c.cluster);
  return (
    <div className="sf-cm" data-screen-label="Cluster match">
      <div className="ch"><span className="glyph" aria-hidden="true"></span> Personalization cluster · {c.conf}% semantic match</div>
      <div className="grid8">
        {(tredi as any).clusters.map((x: any) => (
          <span key={x.id} className={`cell ${x.id === c.cluster ? 'hit' : ''}`} style={x.id === c.cluster ? { '--ct': x.tone } as any : undefined} title={x.name}>
            <i className="num">{x.n}</i>{x.id === c.cluster && <b>{x.name}</b>}
          </span>
        ))}
      </div>
      <div className="cr">Cluster <b className="num">{hit.n}/8 · {hit.name}</b> → brand <b style={{ color: hit.tone }}>{hit.brandName}</b> — same cluster that personalizes alpitour.it: <i>{hit.push.toLowerCase()}</i>.</div>
    </div>
  );
}

/* ---------- B2C personalization program panel (browse mode) ---------- */
export function ClusterProgram() {
  return (
    <section className="sf-cp" data-screen-label="B2C personalization program">
      <div className="sf-shelf-h">
        <span className="ic"><Ki name="group" size={14} /></span>
        <h2>B2C personalization program</h2>
        <span className="sub">8 clusters push personalization on alpitour.it — the same semantics curate the brand here, automatically</span>
      </div>
      <div className="cpgrid">
        {(tredi as any).clusters.map((c: any) => (
          <div className="cpcard" key={c.id} style={{ '--ct': c.tone } as any}>
            <div className="h"><span className="n num">{c.n}</span><b>{c.name}</b><span className="share num">{c.share}%</span></div>
            <div className="b"><span className="swatch" style={{ background: c.tone }}></span>{c.brandName}</div>
            <div className="sig">{c.signals}</div>
            <div className="push"><Ki name="arrow-up-right" size={10} /> {c.push}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- navigable map — brief elements pinned, filterable on the customer's preferences (Leaflet) ---------- */
export function MapPanel({ mode, onOpenPin }: { mode: string; onOpenPin?: (id: string) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<any>(null);
  const markersRef = React.useRef<Record<string, any>>({});
  const d = (tredi as any).maps[mode];

  const PREFS = [
    { id: 'baby', label: 'Family rooms', test: (p: any) => p.amenities.includes('Family rooms') || p.amenities.includes('Family suite') },
    { id: 'kids', label: 'Short transfers', test: (p: any) => p.amenities.includes('Short transfers') || p.amenities.includes('Private transfers') },
    { id: 'budget', label: '≤ €7,400', test: (p: any) => p.price <= 7400 },
    { id: 'avail', label: 'Available', test: (p: any) => p.allotment && p.allotment.status !== 'sold_out' },
  ];
  const [filters, setFilters] = React.useState<Record<string, boolean>>({ baby: true, kids: true });

  const pinCls = (p: any) => p.kind === 'sold' ? 'sold' : p.kind === 'best' ? 'best' : p.kind === 'airport' ? 'airport' : p.kind === 'stop' ? 'stop' : 'price';
  const matchPin = (p: any) => {
    if (p.kind === 'airport' || p.kind === 'stop') return true;
    const prod = (products as any)[p.id];
    if (!prod) return true;
    return PREFS.every((pr) => !filters[pr.id] || pr.test(prod));
  };

  React.useEffect(() => {
    if (!ref.current || !d) return;
    const map = L.map(ref.current, { attributionControl: false, scrollWheelZoom: false, zoomSnap: 0.25 });
    mapRef.current = map;
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 18, subdomains: 'abcd' }).addTo(map);
    if (d.route) L.polyline(d.route, { color: '#1A73E8', weight: 4, opacity: 0.85 }).addTo(map);
    d.pins.forEach((p: any) => {
      const icon = L.divIcon({ className: '', html: `<span class="sf-mappin ${pinCls(p)}">${p.label}</span>`, iconSize: undefined as any, iconAnchor: p.kind === 'stop' ? [13, 13] : [28, 30] });
      const mk = L.marker(p.ll, { icon }).addTo(map);
      mk.bindPopup(`<b>${p.name}</b><br/><span style="font-size:11px;color:#555">${p.meta}</span>`, { closeButton: false, offset: [0, -18] as any });
      markersRef.current[p.id] = mk;
    });
    map.fitBounds(d.fit, { padding: [24, 24] });
    setTimeout(() => map.invalidateSize(), 250);
    return () => { map.remove(); mapRef.current = null; markersRef.current = {}; };
  }, [mode]);

  React.useEffect(() => {
    if (!d) return;
    d.pins.forEach((p: any) => {
      const mk = markersRef.current[p.id]; if (!mk || !mk.setOpacity) return;
      mk.setOpacity(matchPin(p) ? 1 : 0.25);
    });
  }, [filters, mode]);

  if (!d) return null;

  const goTo = (p: any) => {
    const map = mapRef.current; if (!map) return;
    map.flyTo(p.ll, p.far ? 11 : Math.max(map.getZoom(), 12), { duration: 0.9 });
    const mk = markersRef.current[p.id]; if (mk) setTimeout(() => mk.openPopup(), 950);
    if (onOpenPin) onOpenPin(p.id);
  };

  const placePins = d.pins.filter((p: any) => p.kind !== 'airport' && p.kind !== 'stop');
  const nMatch = placePins.filter(matchPin).length;

  return (
    <section className="sf-map" data-screen-label="Map window">
      <div className="mph">
        <span className="ic"><Ki name="network" size={14} /></span>
        <div><div className="t">{d.title}</div><div className="s">{d.sub}</div></div>
        <span className="livechip"><span className="dot"></span> prices live</span>
      </div>
      {mode === 'bravo' && (
        <div className="mpfilters" data-screen-label="Preference filters">
          <span className="fl"><Ki name="filter" size={12} /> Customer preferences</span>
          {PREFS.map((pr) => (
            <button key={pr.id} className={`mpf ${filters[pr.id] ? 'on' : ''}`} onClick={() => setFilters((f) => ({ ...f, [pr.id]: !f[pr.id] }))}>
              <Ki name={filters[pr.id] ? 'checkmark-filled' : 'filter'} size={11} /> {pr.label}
            </button>
          ))}
          <span className="mpcount">{nMatch} of {placePins.length} fit</span>
        </div>
      )}
      <div className="mpbody">
        <div className="mpmap" ref={ref} aria-label="Navigable map"></div>
        <aside className="mpside">
          {d.pins.map((p: any) => {
            const ok = matchPin(p);
            const place = p.kind !== 'airport' && p.kind !== 'stop';
            return (
              <button key={p.id} className={`mprow ${place && !ok ? 'dim' : ''}`} onClick={() => goTo(p)}>
                <span className={`sf-mappin inline ${pinCls(p)}`}>{p.label}</span>
                <span className="mt"><b>{p.name}</b><i>{p.meta}</i></span>
                {mode === 'bravo' && place && ok && <span className="mtok"><Ki name="checkmark-filled" size={13} /></span>}
              </button>
            );
          })}
        </aside>
      </div>
    </section>
  );
}

/* ---------- simple linear choices timeline (rail tab) ---------- */
export function ChoicesTimeline({ choices, timeline }: { choices: any[]; timeline: any[] }) {
  const [audit, setAudit] = React.useState(false);
  return (
    <div className="sf-choices" data-screen-label="Choices timeline">
      {choices.length === 0
        ? <div className="sf-empty">Your choices land here — a simple line of what the agency decided in the portal.</div>
        : (
          <div className="cline">
            {choices.map((c, i) => (
              <div className="cnode" key={i}>
                <span className="mk"><Ki name={c.icon || 'checkmark-filled'} size={11} /></span>
                <div><div className="cl">{c.label}</div>{c.s && <div className="cs">{c.s}</div>}</div>
                <span className="ts num">{c.ts}</span>
              </div>
            ))}
          </div>
        )}
      <button className="audit-toggle" onClick={() => setAudit(!audit)}>
        {audit ? 'Hide' : 'Show'} full audit trail · {timeline.length} events
      </button>
      {audit && (
        <div className="sf-tl" style={{ padding: '6px 0 0' }}>
          {timeline.map((e, i) => (
            <div className="sf-ev" key={i}>
              <span className="ts">{e.ts}</span>
              <span className={`actor ${e.actor}`}>{e.actor}</span>
              <span className="s">{e.summary}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- in-chat brand selection ---------- */
export function BrandPick({ chosen, onPick }: { chosen: string | null; onPick: (id: string) => void }) {
  return (
    <div className="sf-bp" data-screen-label="Brand selection">
      {(tredi as any).brandPick.map((b: any) => (
        <button
          key={b.id}
          className={`sf-bp-tile ${chosen === b.id ? 'on' : ''} ${chosen && chosen !== b.id ? 'dim' : ''}`}
          style={{ '--bt': b.tone } as any}
          onClick={() => onPick(b.id)}
          disabled={!!chosen}
        >
          <span className="band" aria-hidden="true"></span>
          <span className="bh"><span className="sw">{b.name[0]}</span><span className="bn">{b.name}</span><span className="tag">{b.tag}</span></span>
          <span className="bt">{b.title}</span>
          <span className="bc">{b.copy}</span>
          <span className="bl">{b.bullets.map((x: string) => <span key={x}><Ki name="checkmark-filled" size={10} /> {x}</span>)}</span>
          {chosen === b.id && <span className="picked"><Ki name="checkmark-filled" size={11} /> Selected</span>}
        </button>
      ))}
    </div>
  );
}

/* ---------- live updates feed (real-time, auto-play) ---------- */
export function LiveFeed({ items, sticky }: { items: any[]; sticky?: string }) {
  if (!items.length) return null;
  return (
    <div className="sf-live" data-screen-label="Real-time updates">
      <div className="lh"><span className="dot" aria-hidden="true"></span> Real-time updates <span className="m num">live · streaming</span></div>
      {items.map((e, i) => (
        <div className={`lr ${i === 0 ? 'new' : ''}`} key={e.t + i}>
          <span className="ic"><Ki name={e.icon} size={12} /></span>
          <span className="tx"><b>{e.t}</b> — {e.s}</span>
          <span className="ts num">{e.ts}</span>
        </div>
      ))}
      {sticky && <Sticky />}
    </div>
  );
}

/* ---------- next-best-action card + package includes ---------- */
export function NextBestAction({ n, onCta }: { n: any; onCta: (cta: any) => void }) {
  return (
    <div className="sf-nba" data-screen-label="Next best action">
      <div className="nh"><span className="glyph" aria-hidden="true"></span> Next best action</div>
      <div className="nt">{n.title}</div>
      <div className="ns">{n.reason}</div>
      <div className="inc">
        <div className="il">The package includes</div>
        {n.includes.map((x: any) => (
          <div className="ir" key={x.t}>
            <span className="ic"><Ki name={x.icon} size={13} /></span>
            <span><b>{x.t}</b><i>{x.s}</i></span>
          </div>
        ))}
      </div>
      {n.cta && <button className="sf-btn sm primary" onClick={() => onCta(n.cta)}>{n.cta.label}</button>}
    </div>
  );
}

/* ---------- rendered proposal.md preview ---------- */
export function MdPreview({ brand, price, holdRef, onClose, onSend }: {
  brand: string; price: number; holdRef?: string; onClose: () => void; onSend: () => void;
}) {
  const turi = brand === 'turisanda';
  const j = (tredi as any).japan;
  const file = turi ? 'proposal-ferrante.md' : 'proposal-carter.md';
  return (
    <div className="sf-overlay" onClick={onClose}>
      <div className="sf-md" onClick={(e) => e.stopPropagation()} data-screen-label="Markdown proposal preview">
        <div className="mh">
          <span className="fic"><Ki name="document-chart" size={14} /></span>
          <div><div className="fn num">{file}</div><div className="fs">Written by {turi ? 'Super TREDI' : 'AlpiConcierge'} · markdown · rendered preview</div></div>
          <span className="sf-stepchip">Step 6 · Proposal Preparation</span>
          <button className="sf-btn sm primary" onClick={onSend}>Send to Agent</button>
          <button className="sf-cmp-x" style={{ position: 'static' }} onClick={onClose}>Close ✕</button>
        </div>
        <div className="mb">
          <div className="mdoc">
            {turi ? (
              <div className="doc">
                <h1>{j.title}</h1>
                <p className="lead">{j.route} · {j.nights} nights · {j.window} · {j.party}</p>
                <h2>Itinerary</h2>
                {j.days.map((d: any) => (
                  <p key={d.d} className="day"><b className="num">{d.d}</b> <b>{d.place}</b> — {d.s}</p>
                ))}
                <h2>Logistics</h2>
                <p>{j.logistics}</p>
                <h2>Price</h2>
                <p><b className="num">{fmtEUR(price)}</b> per couple, all inclusive as itemized. The fare is watched in real time: if the flight drops, the quote drops — it already happened once while we were preparing this proposal (−€120).</p>
                <h2>Terms</h2>
                <p>Free 72-hour option · balance due 30 days before departure · cancellation insurance included.</p>
                <p className="sig">Rossi Travel · Giulia — with Turisanda, signature journeys.</p>
              </div>
            ) : (
              <div className="doc">
                <h1>10 Days in Italy — The Carter Family</h1>
                <p className="lead">Rome · Florence · Amalfi Coast · 10 days · 2 adults + 1 child (age 2)</p>
                <h2>Why this trip</h2>
                <p>The Positano sea-view hotel you first picked is sold out on your dates — verified against live inventory, not the catalogue. This itinerary keeps everything that mattered: <b>family rooms, air-conditioning and short transfers</b>, the same three cities, and a slow, food-and-history pace — €250 under your budget.</p>
                <h2>The itinerary</h2>
                <p className="day"><b>Rome · days 1–4</b> — central family suite, slow mornings, a pasta-making afternoon and the Forum with a family guide</p>
                <p className="day"><b>Florence · days 5–7</b> — air-conditioned rooms steps from the Duomo, a market food walk, the Uffizi early before the heat</p>
                <p className="day"><b>Amalfi Coast · days 8–10</b> — family rooms above the sea, a gentle boat afternoon, lemon-grove lunch</p>
                <h2>Included</h2>
                <p className="day"><b>Stays</b> — three family rooms, all air-conditioned, all central</p>
                <p className="day"><b>Transfers</b> — short private transfers city-to-city, child seat included</p>
                <p className="day"><b>Extras</b> — family travel insurance · two dinners reserved</p>
                <h2>Price</h2>
                <p><b className="num">{fmtEUR(price)}</b> per family, all-in (≈ CA$10,900){holdRef ? <> · hold confirmed <b className="num">{holdRef}</b> until tomorrow 6:00 PM</> : null}.</p>
                <h2>Terms</h2>
                <p>Free date change until confirmation · balance due 30 days before departure · live disruption support throughout the trip.</p>
                <p className="sig">Rossi Travel · Giulia — with Alpitour, Italy made easy.</p>
              </div>
            )}
          </div>
          <aside className="mside" aria-label="Delivery channels">
            <div className="ms-h">One .md → every channel</div>
            <p className="ms-sub">The same source document renders to whichever channel the customer prefers — written once, sent anywhere.</p>
            <div className="ms-src"><span className="fic"><Ki name="document-chart" size={13} /></span><span className="num">{file}</span></div>
            <div className="ms-flow">
              {[
                { n: 'Email', s: 'Full rendered proposal', ic: <path d="M3 5h18v14H3z M3 6l9 7 9-7" /> },
                { n: 'SMS', s: 'Short summary + secure link', ic: <path d="M4 4h16v11H8l-4 4z" /> },
                { n: 'Text notification', s: 'Push alert to the app', ic: <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6 M10 21h4" /> },
                { n: 'Trip page', s: 'Live, repriced web page', ic: <path d="M3 5h18v14H3z M3 9h18 M7 5v4" /> },
              ].map((c) => (
                <div className="ms-chan" key={c.n}>
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{c.ic}</svg>
                  </span>
                  <span className="tx"><b>{c.n}</b><i>{c.s}</i></span>
                  <span className="rdy">Ready</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------- Turisanda curated panel (center, selling mode) ---------- */
export function TurisandaPanel({ price, repriced, onGenMd, onSource }: {
  price: number; repriced: boolean; onGenMd: () => void; onSource: () => void;
}) {
  const j = (tredi as any).japan;
  return (
    <section className="sf-turi" data-screen-label="Turisanda curated itinerary">
      <div className="th" style={{ '--bt': '#8a6116' } as any}>
        <span className="sw">T</span>
        <div>
          <div className="eyebrow">Turisanda · Signature itineraries — curated by Super TREDI</div>
          <h2>{j.title}</h2>
          <div className="sub">{j.route} · {j.nights} nights · {j.window} · {j.party}</div>
        </div>
        <span className="sf-stepchip" style={{ marginLeft: 'auto' }}>Step 5 · Itinerary Creation</span>
        <button type="button" className="sf-srcchip" onClick={() => onSource()}>
          <Ki name="document-chart" size={11} /><span className="u">catalogue · pricing · inventory</span>
        </button>
      </div>
      <div className="tgrid">
        <div className="days">
          {j.days.map((d: any) => (
            <div className="drow" key={d.d}>
              <span className="dd num">{d.d}</span>
              <div><div className="dp">{d.place}</div><div className="ds">{d.s}</div></div>
            </div>
          ))}
          <div className="dlog"><Ki name="network" size={12} /> {j.logistics}</div>
        </div>
        <aside className="side">
          <div className="price">
            <div className="pl">Per couple · all inclusive</div>
            <div className="pv num">{fmtEUR(price)}</div>
            {repriced && <div className="pd"><Ki name="analytics" size={11} /> −€120 — live price watch repriced the Neos fare</div>}
            <div className="pc sf-agent-only num">your commission {fmtEUR(Math.round(price * 0.13))} · 13%</div>
          </div>
          <div className="incl">
            <div className="il">The package includes</div>
            {(tredi as any).includes.turisanda.map((x: any) => (
              <div className="ir" key={x.t}><span className="ic"><Ki name={x.icon} size={12} /></span><span><b>{x.t}</b><i>{x.s}</i></span></div>
            ))}
          </div>
          <button className="sf-btn primary" onClick={onGenMd}>Generate proposal.md</button>
        </aside>
      </div>
    </section>
  );
}

/* ---------- journey board — full-width 7-step use case ---------- */
export function JourneyBoard({ jstep, confidence }: { jstep: number; confidence?: any }) {
  return (
    <section className="sf-jboard" data-screen-label="Journey overview">
      <div className="jb-h">
        <div><span className="jb-eyb">AI-Powered B2B Travel Agent Concierge</span><h3>One seamless touchpoint — the agent works, the customer experiences.</h3></div>
        {confidence && <span className="jb-conf"><b>Confidence: {confidence.level}.</b> {confidence.rationale}</span>}
      </div>
      <div className="jb-steps">
        {(tredi as any).useCase.steps.map((s: any) => (
          <div key={s.n} className={`jb-step ${s.n < jstep ? 'done' : s.n === jstep ? 'on' : ''}`}>
            <div className="jb-top"><span className="ci">{s.n < jstep ? '✓' : s.n}</span><span className="l">{s.label}</span></div>
            <div className="a"><i>Agent</i> {s.agent}</div>
            <div className="a"><i>Customer</i> {s.customer}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
