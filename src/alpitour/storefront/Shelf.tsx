/* ============================================================
   EasyBook Next — B2B Storefront · shelf surfaces
   Hero + brief box, desk strip, brand band, shelf rows, product
   cards, chips bar, sold-out banner, compare tray + overlay,
   desk board with board/list/calendar views.
   ============================================================ */
import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fmtEUR, brands, products, SHELVES, BRIEF, chips, desk, tredi } from './data';
import { Ki, Inf, Stars, Badge, Allot, SrcChip } from './Primitives';
import { bus } from '@/shared/bus';

const brandOf = (id: string) => (brands as any[]).find((b: any) => b.id === id);

/* ---------- product card ---------- */
export function ProductCard({ p, ranked, soldout, inCompare, onCompare, onOpen, onSelect, onSource, busy }: {
  p: any; ranked?: boolean; soldout?: boolean; inCompare?: boolean;
  onCompare?: (id: string) => void; onOpen: (id: string) => void;
  onSelect?: (id: string) => void; onSource?: (ids: string[]) => void; busy?: boolean;
}) {
  const b = brandOf(p.brand);
  return (
    <article className={`sf-card ${soldout ? 'soldout' : ''} ${ranked && p.rank === 'Best match' ? 'best' : ''}`}>
      <div className="cardtop">
        <span className="picon" style={{ background: `color-mix(in srgb, ${b.tone} 10%, #fff)`, color: b.tone }}>
          {b.logo
            ? <img src={b.logo} alt={b.name} style={{ width: 16, height: 16, objectFit: 'contain', display: 'block' }} />
            : <Ki name="recommend" size={16} />}
        </span>
        <span className="brandtag" style={{ background: b.tone }}>{b.name}</span>
        {ranked && p.rank && (
          <span className="ranktag">
            <Badge kind={p.rank === 'Best match' ? 'ai' : p.rank === 'Best value' ? 'ok' : 'warn'} icon={p.rank === 'Best match' ? 'recommend' : undefined}>
              {p.rank}{p.match ? ` · ${p.match}%` : ''}
            </Badge>
          </span>
        )}
        {soldout && <span className="ranktag"><Badge kind="err" icon="error-filled">Sold out</Badge></span>}
      </div>
      <div className="body">
        <div className="name">{p.name}</div>
        <div className="dest"><Stars n={p.rating} /> {p.dest} · {p.board} · {p.nights} nights</div>
        <div className="dest"><Allot a={p.allotment} /><SrcChip ids={p.receipts} onSource={onSource} /></div>
        {p.expiry && !ranked && <div className="dest"><Badge kind="warn" icon="warning-alt">{p.expiry}</Badge></div>}
        <div className="ams">
          {p.amenities.map((a: string) => <span key={a} className={`sf-am ${ranked && p.hi && p.hi.includes(a) ? 'hi' : ''}`}>{a}</span>)}
        </div>
        {ranked && p.matchReasons && (
          <div className="why">{p.matchReasons.map((r: string, i: number) => <span key={i}>{i > 0 && ' · '}{i === 0 ? <b>{r}</b> : r}</span>)}</div>
        )}
        <div className="sf-commerce">
          {soldout ? (
            <div><span className="gross" style={{ color: 'var(--k-status-error-110)' }}>Unavailable</span><span className="per">12–22 Aug · live inventory</span></div>
          ) : (
            <div><span className="gross num">{fmtEUR(p.price)}</span><span className="per">family 2+1 · flight incl.</span></div>
          )}
          {!soldout && (
            <div className="agentline sf-agent-only">
              <div className="comm num">{fmtEUR(p.commission)} comm. · {p.commissionPct}%</div>
              <div className="net num">net {fmtEUR(p.net)}</div>
            </div>
          )}
        </div>
      </div>
      <div className="foot">
        <button className="sf-btn sm" onClick={() => onOpen(p.id)}>Details</button>
        {!soldout && onCompare && <button className={`sf-btn sm ${inCompare ? 'primary' : ''}`} onClick={() => onCompare(p.id)}>{inCompare ? 'In compare' : 'Compare'}</button>}
        {!soldout && ranked && <button className="sf-btn sm primary" style={{ marginLeft: 'auto' }} disabled={busy} onClick={() => onSelect && onSelect(p.id)}>Select for package</button>}
        {soldout && <button className="sf-btn sm primary" style={{ marginLeft: 'auto' }} onClick={() => onOpen(p.id)}>See why · alternatives</button>}
      </div>
    </article>
  );
}

/* ---------- hero — the use case, stated ---------- */
export function Hero() {
  return (
    <section className="sf-hero">
      <div className="sf-hero-copy">
        <div className="sf-eyebrow" style={{ marginBottom: 8 }}>Use case · AI-Powered B2B Travel Agent Concierge</div>
        <h1>One seamless touchpoint,<br />inquiry to <em>booking</em>.</h1>
        <p>AlpiConcierge, evolved from retrieval into the orchestrating layer — fronted here as Super TREDI. It orchestrates information, recommendations and actions across the full journey for the travel agent, while the customer experiences one continuous thread: speak once, get the right solution at the right time.</p>
        <div className="sf-hero-hint"><Ki name="chat-bot" size={13} /> Step 1 · Inquiry — pick a request in the Super TREDI panel →</div>
      </div>
    </section>
  );
}

/* ---------- desk strip ---------- */
export function DeskStrip({ onToast }: { onToast: (msg: string) => void }) {
  return (
    <section className="sf-desk" aria-label="Agency desk">
      {(desk as any).holds.map((h: any) => (
        <div className={`sf-desk-card ${h.urgent ? 'warn' : ''}`} key={h.ref} role="button" tabIndex={0} onClick={() => onToast(`Hold ${h.ref} — open the Holds view in the full workbench.`)}>
          <span className="ic"><Ki name={h.urgent ? 'warning-alt' : 'checkmark-filled'} size={14} /></span>
          <div><div className="t">{h.title}</div><div className="s">Hold {h.ref} · expires {h.expires}</div></div>
        </div>
      ))}
      {(desk as any).packages.map((w: any) => (
        <div className="sf-desk-card" key={w.id} role="button" tabIndex={0} onClick={() => onToast(`${w.id} — resume from the work-package dashboard.`)}>
          <span className="ic"><Ki name="document-chart" size={14} /></span>
          <div><div className="t">{w.title}</div><div className="s">{w.id} · {w.meta}</div></div>
        </div>
      ))}
    </section>
  );
}

/* ---------- brand band ---------- */
export function BrandBand({ filter, setFilter }: { filter: string | null; setFilter: (id: string | null) => void }) {
  return (
    <section className="sf-brandband" aria-label="Alpitour World brands">
      <span className="sf-eyebrow" style={{ marginRight: 4 }}>Brands</span>
      {(brands as any[]).map((b: any) => (
        <button key={b.id} className={`sf-brandchip ${filter === b.id ? 'on' : ''}`} onClick={() => setFilter(filter === b.id ? null : b.id)}>
          <span className="swatch" style={{ background: b.tone, overflow: 'hidden' }}>
            {b.logo
              ? <img src={b.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              : b.name[0]}
          </span>
          {b.name}
        </button>
      ))}
      {filter && <button className="all" onClick={() => setFilter(null)}>Clear filter</button>}
    </section>
  );
}

/* ---------- shelf row ---------- */
export function ShelfRow({ shelf, filter, compareIds, onCompare, onOpen, onSource }: {
  shelf: any; filter: string | null; compareIds: string[];
  onCompare?: (id: string) => void; onOpen: (id: string) => void; onSource?: (ids: string[]) => void;
}) {
  const items = Object.values(products as any).filter((p: any) => (p.shelf || []).includes(shelf.id) && (!filter || p.brand === filter));
  if (!items.length) return (
    <section>
      <div className={`sf-shelf-h ${shelf.id === 'expiring' ? 'warn' : ''}`}><span className="ic"><Ki name={shelf.icon} size={14} /></span><h2>{shelf.title}</h2></div>
      <div className="sf-empty">No {brandOf(filter!)?.name} product on this shelf right now. Clear the brand filter to see everything.</div>
    </section>
  );
  return (
    <section>
      <div className={`sf-shelf-h ${shelf.id === 'expiring' ? 'warn' : ''}`}>
        <span className="ic"><Ki name={shelf.icon} size={14} /></span>
        <h2>{shelf.title}</h2><span className="sub">{shelf.sub}</span>
      </div>
      <div className="sf-grid">
        {items.map((p: any) => (
          <ProductCard key={p.id} p={p} inCompare={compareIds.includes(p.id)} onCompare={onCompare} onOpen={onOpen} onSource={onSource} />
        ))}
      </div>
    </section>
  );
}

/* ---------- customer reference / chips bar ---------- */
export function ChipsBar({ blockers, onFix, stage }: { blockers: any[]; onFix: (b: any) => void; stage: string }) {
  const rq = ((tredi as any).requests || []).find((r: any) => r.id === 'bianchi') || {};
  const [open, setOpen] = React.useState(false);
  const hasQ = blockers.length > 0;
  const expanded = open || hasQ;

  const acts: any[] = [
    { ic: 'chat-bot', t: 'Spoke to a travel advisor directly', s: 'described the trip in their own words' },
    { ic: 'group', t: 'Told us what matters', s: 'family rooms, air-con and short transfers are non-negotiable' },
    { ic: 'arrow-up-right', t: 'Sent it to Rossi Travel', s: 'full context handed over · 24-hour hold' },
  ];
  if (['held', 'repricing', 'v2', 'completed'].includes(stage)) acts.push({ ic: 'checkmark-filled', t: 'Sees the trip reserved on their page', s: 'updates live while you work — no waiting on a call' });
  if (['v2', 'completed'].includes(stage)) acts.push({ ic: 'analytics', t: 'Watched their page handle a change', s: 'dates moved · a mid-trip disruption fixed · explained plainly' });

  return (
    <div className={`sf-cust ${expanded ? 'open' : ''}`} data-screen-label="Customer brief">
      <button className="sf-cust-bar" onClick={() => setOpen((o) => !o)} aria-expanded={expanded}>
        <span className="av" aria-hidden="true">C</span>
        <div className="who">
          <b>The Carter family</b>
          <i>Two parents and their 2-year-old, from Toronto · 10 slow days around Italy</i>
        </div>
        <span className="src"><Inf size={11} /> via AlpiConcierge · Alpitour.it</span>
        {hasQ && <span className="qn">{blockers.length} to confirm</span>}
        <span className="chev"><Ki name="arrow-down-right" size={14} /></span>
      </button>
      {expanded && (
        <div className="sf-cust-body">
          {hasQ && (
            <div className="sf-cust-q top">
              <div className="qh"><Ki name="warning-alt" size={13} /> Two things the family couldn't answer — confirm to start the search</div>
              <div className="qrow">
                {blockers.map((b) => (
                  <button key={b.id} className="sf-blockerchip" onClick={() => onFix(b)}>
                    <Ki name="warning-alt" size={12} /> {b.q} <u style={{ fontWeight: 700 }}>{b.fix}</u>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="sf-cust-grid">
            <div className="col">
              <h5>In their words</h5>
              <blockquote>"{rq.words}"</blockquote>
              <h5>What matters to them</h5>
              <div className="warmrow">
                {(rq.signals || []).map((s: string, i: number) => <span key={i} className="warm">{s}</span>)}
              </div>
            </div>
            <div className="col">
              <h5>The details, structured</h5>
              <div className="chiprow">
                {(chips as any[]).map((c: any) => <span key={c.id} className="sf-chip fixed"><Ki name={c.icon} size={12} /> {c.label}</span>)}
              </div>
              <h5>What the family did</h5>
              <ul className="acts">
                {acts.map((a, i) => (
                  <li key={i}><span className="ai"><Ki name={a.ic} size={12} /></span><div><b>{a.t}</b><i>{a.s}</i></div></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- sold-out recovery banner ---------- */
export function SoldOutBanner() {
  return (
    <div className="sf-soldout" data-screen-label="Sold-out recovery">
      <span className="ic"><Ki name="error-filled" size={15} /></span>
      <div>
        <div className="t">The Positano Signature is sold out for 12–22 August — live inventory, checked 43s ago.</div>
        <div className="s">AlpiConcierge kept every hard constraint — three cities, family rooms, air-con, short transfers, ≤ €7,400 — and ranked the three closest alternatives below. Family rooms and short transfers were weighted first because of the 2-year-old.</div>
      </div>
    </div>
  );
}

/* ---------- compare tray + overlay ---------- */
export function CompareTray({ ids, onOpen, onClear }: { ids: string[]; onOpen: () => void; onClear: () => void }) {
  if (ids.length < 1) return null;
  const names = ids.map((i) => (products as any)[i].name);
  return (
    <div className="sf-tray">
      <span className="names"><b>{ids.length}</b> to compare — {names.join(' · ')}</span>
      <button className="sf-btn sm primary" disabled={ids.length < 2} onClick={onOpen}>Compare side by side</button>
      <button className="x" onClick={onClear} aria-label="Clear compare">✕</button>
    </div>
  );
}

export function CompareOverlay({ ids, onClose, onSelect, canSelect, onSource }: {
  ids: string[]; onClose: () => void; onSelect?: (id: string) => void;
  canSelect?: boolean; onSource?: (ids: string[]) => void;
}) {
  const items = ids.map((i) => (products as any)[i]);
  const bestPrice = Math.min(...items.map((p: any) => p.price));
  const bestComm = Math.max(...items.map((p: any) => p.commission));
  const row = (label: string, render: (p: any) => React.ReactNode, bestOf?: (p: any) => boolean) => (
    <tr><th>{label}</th>{items.map((p: any) => <td key={p.id} className={bestOf && bestOf(p) ? 'best' : ''}>{render(p)}</td>)}</tr>
  );
  return (
    <div className="sf-overlay" onClick={onClose}>
      <div className="sf-compare" onClick={(e) => e.stopPropagation()} data-screen-label="Compare overlay">
        <button className="sf-cmp-x" onClick={onClose}>Close ✕</button>
        <h2>Side-by-side comparison</h2>
        <div className="sub">Commercial facts from live inventory and pricing APIs · descriptive facts from the product master. Best value per row is tinted.</div>
        <table className="sf-cmp-table">
          <tbody>
            {row('Product', (p) => <><div className="name">{p.name}</div><div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{brandOf(p.brand).name} · {p.dest}</div></>)}
            {row('Gross · family 2+1', (p) => <b className="num">{fmtEUR(p.price)}</b>, (p) => p.price === bestPrice)}
            {row('Your commission', (p) => <b className="num sf-agent-only" style={{ color: 'var(--k-spruce-70)' }}>{fmtEUR(p.commission)} · {p.commissionPct}%</b>, (p) => p.commission === bestComm)}
            {row('Board · nights', (p) => `${p.board} · ${p.nights} nights`)}
            {row('Allotment', (p) => <Allot a={p.allotment} />)}
            {row('Family fit', (p) => (
              <div className="ams">{p.amenities.map((a: string) => <span key={a} className={`sf-am ${p.hi && p.hi.includes(a) ? 'hi' : ''}`}>{a}</span>)}</div>
            ))}
            {row('Match to brief', (p) => p.match ? <Badge kind={p.rank === 'Best match' ? 'ai' : 'neutral'}>{p.match}% · {p.rank}</Badge> : <span style={{ color: 'var(--fg-muted)' }}>—</span>)}
            {row('Sources', (p) => <SrcChip ids={p.receipts} onSource={onSource} />)}
            {canSelect && row('', (p) => <button className="sf-btn sm primary" onClick={() => onSelect && onSelect(p.id)}>Select for package</button>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- desk board — the agent's worklist dashboard ---------- */
function JourneyTakeoff({ awaiting }: { awaiting: boolean }) {
  const ys = [120, 92, 54, 24];
  const stages = [
    { n: 1, label: 'Inquiry', x: 64 },
    { n: 2, label: 'Proposal', x: 318 },
    { n: 3, label: 'Hold', x: 590 },
    { n: 4, label: 'Departure', x: 858 },
  ];
  const active = awaiting ? 0 : 1;
  const dpath = 'M64,120 C180,116 240,102 318,92 C430,79 500,68 590,54 C700,39 786,32 858,24';
  const curIdx = stages.findIndex((s) => s.n === active);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const hostRef = React.useRef<HTMLElement>(null);
  const [loaderPos, setLoaderPos] = React.useState<{ left: number; top: number } | null>(null);

  React.useLayoutEffect(() => {
    if (curIdx < 0) { setLoaderPos(null); return; }
    function place() {
      const svg = svgRef.current, host = hostRef.current;
      if (!svg || !host || !svg.getScreenCTM) return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pt = svg.createSVGPoint();
      pt.x = stages[curIdx].x; pt.y = ys[curIdx];
      const sc = pt.matrixTransform(ctm);
      const hb = host.getBoundingClientRect();
      setLoaderPos({ left: sc.x - hb.left, top: sc.y - hb.top });
    }
    place();
    const ro = new ResizeObserver(place);
    if (svgRef.current) ro.observe(svgRef.current);
    window.addEventListener('resize', place);
    const t = setTimeout(place, 300);
    return () => { ro.disconnect(); window.removeEventListener('resize', place); clearTimeout(t); };
  }, [curIdx]);

  return (
    <section className="bd-takeoff" data-screen-label="Journey take-off" ref={hostRef as any}>
      <div className="tk-h">
        <div className="tk-route"><span className="eyb">In focus · Carter family</span><h3>Toronto YYZ <span>→</span> Rome · Florence · Amalfi</h3></div>
        <span className="tk-meta"><span className="dot" aria-hidden="true" /> Cleared for take-off · departs 12 Aug</span>
      </div>
      <svg className="tk-svg" viewBox="0 0 920 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true" ref={svgRef}>
        <line x1="18" y1="134" x2="150" y2="134" className="tk-runway" />
        <path className="tk-track" d={dpath} />
        {stages.map((s, i) => {
          const done = s.n < active;
          const current = s.n === active;
          if (current) return <g key={s.n} />;
          return (
            <g key={s.n}>
              <circle cx={s.x} cy={ys[i]} r={done ? 8 : 7} className={`tk-dot ${done ? 'done' : ''} ${s.n === 4 ? 'dest' : ''}`} />
              <text x={s.x} y={ys[i] + 3.5} textAnchor="middle" className={done ? 'tk-tick' : 'tk-num'}>{done ? '✓' : s.n}</text>
            </g>
          );
        })}
      </svg>
      {loaderPos && (
        <div className="ai-spinner tk-loader" style={{ left: loaderPos.left + 'px', top: loaderPos.top + 'px' }} aria-hidden="true"></div>
      )}
      <div className="tk-stages">
        {stages.map((s) => <span key={s.n} className={`tk-st ${s.n <= active ? 'done' : s.n === active + 1 ? 'next' : ''}`}>{s.label}</span>)}
      </div>
    </section>
  );
}

function OvDonut({ pct, val, label, tone }: { pct: number; val: string; label: string; tone: string }) {
  const R = 21, C = 2 * Math.PI * R;
  return (
    <div className="ov-donut">
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r={R} className="bg" />
        <circle cx="26" cy="26" r={R} className="fg" style={{ stroke: tone, strokeDasharray: C, strokeDashoffset: C * (1 - pct / 100) }} />
      </svg>
      <span className="dv">{val}</span>
      <i>{label}</i>
    </div>
  );
}

function DeskOverview({ onToast }: { onToast: (msg: string) => void }) {
  const mapEl = React.useRef<HTMLDivElement>(null);
  const dests = [
    { id: 'bianchi', ll: [41.90, 12.50] as [number, number], who: 'Carter', place: 'Italy · Rome', tone: '#0F62FE' },
    { id: 'ferri', ll: [3.2, 73.0] as [number, number], who: 'Ferri', place: 'Maldives', tone: '#7A2048' },
    { id: 'romano', ll: [28.29, -16.62] as [number, number], who: 'Romano', place: 'Tenerife', tone: '#1F8A5B' },
    { id: 'greco', ll: [45.93, 7.63] as [number, number], who: 'Greco', place: 'Cervinia', tone: '#29707A' },
    { id: 'conti', ll: [36.39, 25.46] as [number, number], who: 'Conti', place: 'Santorini', tone: '#8a6116' },
    { id: 'ferrante', ll: [35.68, 139.77] as [number, number], who: 'Ferrante', place: 'Japan', tone: '#FF462D' },
    { id: 'deluca', ll: [39.2, 9.1] as [number, number], who: 'De Luca', place: 'Sardinia', tone: '#0F62FE' },
  ];

  React.useEffect(() => {
    if (!mapEl.current) return;
    const map = L.map(mapEl.current, { attributionControl: false, zoomControl: false, scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { subdomains: 'abcd' }).addTo(map);
    dests.forEach((d) => {
      const icon = L.divIcon({ className: '', html: `<span class="ov-pin" style="background:${d.tone}"></span>`, iconSize: [16, 16] as any, iconAnchor: [8, 8] as any });
      L.marker(d.ll, { icon }).addTo(map).bindTooltip(`${d.who} · ${d.place}`, { direction: 'top', offset: [0, -6] as any });
    });
    map.fitBounds(dests.map((d) => d.ll) as any, { padding: [34, 34] });
    setTimeout(() => map.invalidateSize(), 260);
    return () => { map.remove(); };
  }, []);

  const budget = [
    { who: 'Ferri · Maldives', val: '€713', k: 'warn', s: 'hold' },
    { who: 'Carter · Italy', val: '€1,099', k: 'ai', s: 'proposal' },
    { who: 'Conti · Santorini', val: '€406', k: 'ok', s: 'sent' },
    { who: 'De Luca · Sardinia', val: '€273', k: 'okfill', s: 'booked' },
  ];
  const first = new Date(2026, 7, 1).getDay();
  const evd: Record<number, { c: string; t: string }> = {
    2: { c: '#1F8A5B', t: 'De Luca · Sardinia departs' },
    7: { c: '#E6A100', t: 'Ferri · Maldives hold ends' },
    8: { c: '#0F62FE', t: 'Romano · Tenerife hold ends' },
    12: { c: '#FF462D', t: 'Carter · Italy departs' },
  };
  const WD = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="ov-grid" data-screen-label="Desk overview">
      <section className="ov-card ov-map">
        <div className="ov-h"><Ki name="network" size={14} /> Where your clients are travelling <span className="m">7 trips in play</span></div>
        <div className="ov-mapbox" ref={mapEl}></div>
        <div className="ov-legend">{dests.map((d) => <span key={d.id}><i style={{ background: d.tone }}></i>{d.place}</span>)}</div>
      </section>
      <section className="ov-card ov-stats">
        <div className="ov-h"><Ki name="analytics" size={14} /> This month at a glance</div>
        <div className="ov-donuts">
          <OvDonut pct={100} val="6" label="clients in play" tone="var(--k-spruce-60)" />
          <OvDonut pct={33} val="2" label="on hold" tone="var(--k-warm-red-50)" />
          <OvDonut pct={78} val="78%" label="self-served" tone="#1F8A5B" />
        </div>
        <div className="ov-goal">
          <div className="gl"><span>Monthly commission target</span><b>69%</b></div>
          <div className="gb"><span style={{ width: '69%' }}></span></div>
          <div className="gs">€4,120 of €6,000 · €1,880 to go</div>
        </div>
      </section>
      <section className="ov-card ov-budget">
        <div className="ov-h"><Ki name="document-chart" size={14} /> Expected commission</div>
        <div className="ov-bud">
          {budget.map((b) => (
            <div className="ov-budrow" key={b.who}><span className={`d ${b.k}`}></span><span className="bw">{b.who}</span><span className={`bs ${b.k}`}>{b.s}</span><span className="bv num">{b.val}</span></div>
          ))}
        </div>
        <div className="ov-budtot"><span>Pipeline this month</span><b className="num">€1,808</b></div>
      </section>
      <section className="ov-card ov-cal">
        <div className="ov-h"><Ki name="dashboard" size={14} /> August</div>
        <div className="ov-calgrid">
          {WD.map((w, i) => <span className="ov-wd" key={i}>{w}</span>)}
          {Array.from({ length: first }).map((_, i) => <span key={'p' + i}></span>)}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
            const ev = evd[d];
            return (
              <button type="button" className={`ov-day ${d === 12 ? 'today' : ''} ${ev ? 'has' : ''}`} key={d} title={ev ? ev.t : undefined} onClick={ev ? () => onToast(ev.t) : undefined}>
                {d}{ev && <i style={{ background: ev.c }}></i>}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function DeskBoard({ awaiting, busState, onAccept, onToast, stage, onResume, showCarter }: {
  awaiting: boolean; busState: any; onAccept: () => void;
  onToast: (msg: string) => void; stage: string; onResume: () => void; showCarter?: boolean;
}) {
  const liveTraveler = busState && busState.feed ? busState.feed.filter((f: any) => f.who === 'traveler').slice(-1)[0] : null;
  const [view, setView] = React.useState('board');

  const kpis = [
    { lbl: 'Commission · this month', val: '€4,120', sub: '+8.2% vs last week', up: true },
    { lbl: 'On hold', val: '2', sub: '1 expires today 18:00', tone: 'warn' },
    { lbl: 'Awaiting customer', val: '1', sub: 'Conti · opened 3×' },
    { lbl: 'Self-served in portal', val: '78%', sub: 'target 85%', bar: 78 },
  ];

  const cs = (() => {
    const s = stage || 'browse';
    if (s === 'browse') return { col: 'new', tag: '24h hold', tagk: 'ai', src: 'via AlpiConcierge · Alpitour.it', trip: 'Rome · Florence · Amalfi', val: '≤ CA$11,000', act: 'accept' };
    if (['parsing', 'blockers'].includes(s)) return { col: 'flight', tag: 'Intake', tagk: 'info', src: 'capturing the brief', trip: 'Rome · Florence · Amalfi', val: '≤ CA$11,000', act: 'resume' };
    if (['searching', 'ranked', 'drafting'].includes(s)) return { col: 'flight', tag: 'In progress', tagk: 'live', src: 'building the proposal', trip: 'Sold-out recovered · ranking', val: '≤ CA$11,000', act: 'resume' };
    if (s === 'proposal') return { col: 'flight', tag: 'Proposal drafted', tagk: 'live', src: 'proposal V1 · ready to send', trip: 'Rome · Florence · Amalfi', val: '€7,365', act: 'resume' };
    if (['held', 'repricing'].includes(s)) return { col: 'await', tag: 'Awaiting reply', tagk: 'ok', src: 'proposal sent · hold AT-88421', trip: 'Rome · Florence · Amalfi', val: '€7,365', act: 'resume' };
    if (s === 'v2') return { col: 'await', tag: 'Change in progress', tagk: 'ok', src: 'servicing a change · hold AT-88421', trip: 'Rome · Florence · Amalfi', val: '€7,275', act: 'resume' };
    if (s === 'completed') return { col: 'booked', tag: 'Booked', tagk: 'okfill', src: 'trip confirmed · V3', trip: 'Rome · Florence · Amalfi', val: '€7,185', act: 'open' };
    return { col: 'new', tag: '24h hold', tagk: 'ai', src: 'via AlpiConcierge · Alpitour.it', trip: 'Rome · Florence · Amalfi', val: '≤ CA$11,000', act: 'accept' };
  })();

  const carter: any = { id: 'bianchi', who: 'The Carter family', cat: 'Italy · Bravo', trip: cs.trip, dates: '12–22 Aug', val: cs.val, src: cs.src, srcIcon: 'chat-bot', tag: cs.tag, tagk: cs.tagk, primary: cs.col !== 'booked', cday: 12, cnote: 'departs', act: cs.act };
  const inject = (key: string, arr: any[]) => (showCarter !== false && key === cs.col) ? [carter, ...arr] : arr;

  const cols = [
    { key: 'new', label: 'Incoming', dot: 'new', clients: inject('new', [
      { id: 'ferrante', who: 'Coppia Ferrante', cat: 'Japan · Turisanda', trip: 'Ryokan · omakase · 10 nights', dates: 'October', val: 'no groups', src: 'walk-in · noted by Giulia', srcIcon: 'group', tag: 'New', tagk: 'new' },
    ]) },
    { key: 'flight', label: 'In progress', dot: 'live', clients: inject('flight', [
      { id: 'ferri', who: 'Famiglia Ferri', cat: 'Maldives · overwater', trip: 'Proposal V1 on hold', dates: 'AT-88102', val: '€5,940', src: 'expires today 18:00', srcIcon: 'warning-alt', tag: 'Expiring', tagk: 'warn', urgent: true, cday: 7, cnote: 'hold ends' },
      { id: 'romano', who: 'Sig. Romano', cat: 'Tenerife', trip: 'Proposal V3 on hold', dates: 'AT-88097', val: '€2,180', src: 'expires tomorrow 11:30', srcIcon: 'dashboard', tag: 'On hold', tagk: 'info', cday: 8, cnote: 'hold ends' },
      { id: 'greco', who: 'Gruppo Greco', cat: 'Cervinia · ski', trip: 'Quote draft · 12 pax', dates: '−€480 o/n', val: '12 pax', src: 'ready to re-share', srcIcon: 'analytics', tag: 'Draft', tagk: 'info' },
    ]) },
    { key: 'await', label: 'Awaiting reply', dot: 'wait', clients: inject('await', [
      { id: 'conti', who: 'Sig.ra Conti', cat: 'Santorini · Turisanda', trip: 'Proposal V2 shared', dates: 'opened 3×', val: '€3,120', src: 'follow-up drafted', srcIcon: 'recommend', tag: 'Sent', tagk: 'ok' },
    ]) },
    { key: 'booked', label: 'Booked', dot: 'ok', clients: inject('booked', [
      { id: 'deluca', who: 'Famiglia De Luca', cat: 'Sardinia · Eden', trip: 'Confirmed · PNR issued', dates: '2–9 Aug', val: '€2,480', src: 'booked Tuesday', srcIcon: 'checkmark-filled', tag: 'Booked', tagk: 'okfill', cday: 2, cnote: 'departs' },
    ]) },
  ];

  const allClients = cols.flatMap((col) => col.clients.map((c) => ({ ...c, stage: col.label, dot: col.dot })));

  return (
    <section className="sf-board" data-screen-label="Agent desk">
      <div className="bd-toolbar">
        <div className="bd-title"><h1>Your desk</h1><span className="bd-sub">Giulia · Rossi Travel — today</span></div>
        <div className="bd-views">
          <button className={view === 'board' ? 'on' : ''} onClick={() => setView('board')}><Ki name="dashboard" size={13} /> Board</button>
          <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}><Ki name="document-chart" size={13} /> List</button>
          <button className={view === 'calendar' ? 'on' : ''} onClick={() => setView('calendar')}><Ki name="analytics" size={13} /> Calendar</button>
        </div>
        <div className="bd-actions">
          <button onClick={() => onToast('Filter your desk by brand, status or value.')}><Ki name="filter" size={13} /> Filters</button>
          <button className="primary" onClick={() => onToast('New inquiries arrive from AlpiConcierge, email or walk-in.')}>+ Add inquiry</button>
        </div>
      </div>
      <JourneyTakeoff awaiting={awaiting} />

      {view === 'board' && (
        <React.Fragment>
          <DeskOverview onToast={onToast} />
          <div className="bd-trends" data-screen-label="Trends to pitch">
            <span className="lbl">Trends to pitch</span>
            {[
              { n: 'Italy · family AI', tone: '#0F62FE' },
              { n: 'Maldives · overwater −12%', tone: '#7A2048' },
              { n: 'Tenerife · winter sun', tone: '#1F8A5B' },
              { n: 'Cervinia · ski week', tone: '#29707A' },
              { n: 'Santorini · adults-only', tone: '#8a6116' },
              { n: 'Japan · d\'Autore', tone: '#FF462D' },
              { n: 'Sardinia · last-minute', tone: '#0F62FE' },
            ].map((t) => (
              <button className="bd-trend" key={t.n} style={{ '--tc': t.tone } as any} onClick={() => onToast(`${t.n} — open the storefront to quote this for a client.`)}><span className="d"></span>{t.n}</button>
            ))}
          </div>
          <div className="bd-board">
            {cols.map((col) => (
              <div className={`bd-col ${col.key}`} key={col.key}>
                <div className="bd-col-h">
                  <span className={`dot ${col.dot}`} aria-hidden="true" />
                  <span className="nm">{col.label}</span>
                  <span className="ct">{col.clients.length}</span>
                  <button className="bd-col-add" onClick={() => onToast('Add a client to this column.')} aria-label="Add">+</button>
                </div>
                <div className="bd-col-body">
                  {col.clients.map((c: any) => {
                    const isBianchi = c.id === 'bianchi';
                    const waiting = isBianchi && awaiting;
                    const click = isBianchi ? (waiting ? undefined : (c.act === 'accept' ? onAccept : onResume)) : () => onToast(`${c.who} — open in the full workbench to continue.`);
                    return (
                      <article className={`bd-card ${c.primary ? 'primary' : ''} ${c.urgent ? 'urgent' : ''}`} key={c.id}
                        onClick={click} data-screen-label={isBianchi ? 'Incoming handoff' : undefined}>
                        <div className="bd-card-top">
                          <span className="bd-cat">{c.cat}</span>
                          <span className={`bd-status ${c.tagk}`}>{c.tag}</span>
                          <span className="bd-av" aria-hidden="true">{c.who.startsWith('The ') ? c.who.split(' ')[1][0] : c.who.split(' ').slice(-1)[0][0]}</span>
                        </div>
                        <h4 className="bd-card-title">{c.who}</h4>
                        <p className="bd-card-trip">{c.trip}</p>
                        <div className="bd-meta">
                          <span className="bd-chip"><Ki name="dashboard" size={12} /> {c.dates}</span>
                          <span className="bd-chip"><Ki name="recommend" size={12} /> {c.val}</span>
                        </div>
                        <div className="bd-card-foot">
                          <span className="bd-log">{c.srcIcon === 'chat-bot' ? <Inf size={12} /> : <Ki name={c.srcIcon} size={12} />} {waiting ? 'Live on Alpitour.it' : c.src}</span>
                          {isBianchi
                            ? (waiting ? <span className="bd-livedot"><span className="d" /></span> : <span className="bd-go">{c.act === 'accept' ? 'Accept →' : c.act === 'open' ? 'Open →' : 'Resume →'}</span>)
                            : <span className="bd-open">Open →</span>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}

      {view === 'list' && (
        <div className="bd-list" data-screen-label="Desk list view">
          <div className="bd-list-row head"><span>Status</span><span>Client</span><span>Trip</span><span>Dates</span><span>Value</span><span></span></div>
          {allClients.map((c: any) => {
            const isBianchi = c.id === 'bianchi';
            const waiting = isBianchi && awaiting;
            const click = isBianchi ? (waiting ? undefined : (c.act === 'accept' ? onAccept : onResume)) : () => onToast(`${c.who} — open in the full workbench to continue.`);
            return (
              <button className={`bd-list-row ${c.primary ? 'primary' : ''} ${c.urgent ? 'urgent' : ''}`} key={c.id} onClick={click}>
                <span className="st"><span className={`dot ${c.dot}`} aria-hidden="true" /> {c.stage}</span>
                <span className="cl"><span className="bd-av sm" aria-hidden="true">{c.who.startsWith('The ') ? c.who.split(' ')[1][0] : c.who.split(' ').slice(-1)[0][0]}</span><span className="nm"><b>{c.who}</b><i>{c.cat}</i></span></span>
                <span className="tp">{c.trip}</span>
                <span className="dt">{c.dates}</span>
                <span className="vl num">{c.val}</span>
                <span className="ac">{isBianchi ? (waiting ? 'Live' : (c.act === 'accept' ? 'Accept →' : c.act === 'open' ? 'Open →' : 'Resume →')) : 'Open →'}</span>
              </button>
            );
          })}
        </div>
      )}

      {view === 'calendar' && (() => {
        const first = new Date(2026, 7, 1).getDay();
        const evs: Record<number, any[]> = {};
        allClients.forEach((c: any) => { if (c.cday) (evs[c.cday] = evs[c.cday] || []).push(c); });
        const undated = allClients.filter((c: any) => !c.cday);
        const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const shortName = (n: string) => n.replace(/^(The |Famiglia|Gruppo|Coppia|Sig\.ra|Sig\.) /, '');
        return (
          <div className="bd-cal" data-screen-label="Desk calendar view">
            <div className="bd-cal-top"><b>August 2026</b><span>departures &amp; hold deadlines</span></div>
            <div className="bd-cal-grid">
              {WD.map((w) => <div className="bd-cal-wd" key={w}>{w}</div>)}
              {Array.from({ length: first }).map((_, i) => <div className="bd-cal-cell pad" key={'p' + i} />)}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <div className={`bd-cal-cell ${d === 12 ? 'today' : ''}`} key={d}>
                  <span className="dn">{d}</span>
                  {(evs[d] || []).map((c: any) => {
                    const isBianchi = c.id === 'bianchi';
                    const waiting = isBianchi && awaiting;
                    const click = isBianchi ? (waiting ? undefined : (c.act === 'accept' ? onAccept : onResume)) : () => onToast(`${c.who} — open in the full workbench.`);
                    return <button key={c.id} className={`bd-cal-ev ${c.tagk}`} onClick={click}>{shortName(c.who)} · {c.cnote}</button>;
                  })}
                </div>
              ))}
            </div>
            {undated.length > 0 && (
              <div className="bd-cal-later">
                <span className="lbl">Not yet dated</span>
                {undated.map((c: any) => <button key={c.id} className="bd-cal-chip" onClick={() => onToast(`${c.who} — ${c.trip}.`)}><span className={`d ${c.dot}`} /> {shortName(c.who)} · {c.cat}</button>)}
              </div>
            )}
          </div>
        );
      })()}
    </section>
  );
}
