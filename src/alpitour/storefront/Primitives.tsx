/* ============================================================
   EasyBook Next — B2B Storefront · primitives
   Ki icon, badges, allotment pill, freshness, source chips, stars.
   ============================================================ */
import React from 'react';
import { receipts } from './data';

export function Ki({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <svg className={`ki ${className}`} style={size !== 16 ? { width: size, height: size } : undefined}>
      <use href={`#icon-${name}`} />
    </svg>
  );
}

/* AlpiConcierge identity mark — the infinity symbol (Alpitour World) */
export function Inf({ size = 13, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      className={`sf-inf ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <path d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828" />
    </svg>
  );
}

export function Stars({ n }: { n: number }) {
  return <span className="stars" aria-label={`${n} star category`}>{'★'.repeat(n)}</span>;
}

export function Badge({ kind = 'neutral', icon, children }: { kind?: string; icon?: string; children?: React.ReactNode }) {
  return (
    <span className={`sf-badge ${kind}`}>
      {icon && <Ki name={icon} size={11} />}
      {children}
    </span>
  );
}

/* allotment pill — availability is never colour-only: icon + label */
export function Allot({ a }: { a: any }) {
  if (a.status === 'sold_out') return <span className="sf-allot no"><Ki name="error-filled" size={11} /> Sold out · live {a.checked}</span>;
  if (a.status === 'low') return <span className="sf-allot low"><Ki name="warning-alt" size={11} /> {a.left} left · live {a.checked}</span>;
  if (a.status === 'on_request') return <span className="sf-allot req"><Ki name="information" size={11} /> On request</span>;
  return <span className="sf-allot ok"><Ki name="checkmark-filled" size={11} /> {a.left} left · live {a.checked}</span>;
}

export function Fresh({ f, label }: { f: string; label?: string }) {
  return (
    <span className={`sf-fresh ${f}`}>
      <span className="d" />
      {label || (f === 'live' ? 'Live' : f === 'recent' ? 'Recent' : 'Stale')}
    </span>
  );
}

/* source chip — clicking routes to the Sources tab in the rail */
export function SrcChip({ ids, onSource }: { ids: string[]; onSource?: (ids: string[]) => void }) {
  const rs = ids.map((i) => (receipts as any)[i]).filter(Boolean);
  if (!rs.length) return null;
  const kinds = [...new Set(rs.map((r: any) =>
    r.kind === 'inventory_api' ? 'inventory'
    : r.kind === 'pricing_api' ? 'pricing'
    : r.kind === 'product_master' ? 'product master'
    : r.kind === 'policy_doc' ? 'policy'
    : 'catalogue'
  ))];
  return (
    <button
      type="button"
      className="sf-srcchip"
      onClick={(e) => { e.stopPropagation(); onSource && onSource(ids); }}
      title="Open source receipts"
    >
      <Ki name="document-chart" size={11} />
      <span className="u">{kinds.join(' · ')}</span>
    </button>
  );
}

/* full receipt card (Sources tab) */
export function SourceCard({ r }: { r: any }) {
  const conf = r.confidence === 'high' ? 'ok' : r.confidence === 'medium' ? 'warn' : 'err';
  return (
    <div className="sf-src">
      <div className="t"><Ki name="document-chart" size={13} /> {r.label}</div>
      <div className="meta">
        <Fresh f={r.freshness} label={`${r.freshness === 'live' ? 'Live · checked' : 'Updated'} ${r.checked}`} />
        <Badge kind={conf} icon={r.confidence === 'high' ? 'checkmark-filled' : 'warning-alt'}>{r.confidence} confidence</Badge>
      </div>
      <div className="reason">{r.reason}</div>
    </div>
  );
}

export function Toast({ text, delta }: { text: string; delta?: boolean }) {
  if (delta) return <div className="sf-toast delta" role="status"><span className="pre">state.delta</span><span>{text}</span></div>;
  return <div className="sf-toast" role="status">{text}</div>;
}

/* AlpiConcierge panel-render loader — DS canonical "Panel render":
   soft dot-grid with Warm-Red + Spruce blob morph + drift, status label with blinking caret.
   Used for every generative loading moment (chat working, search, proposal, customer preview). */
export function AiRender({ label = 'Sketching it out', compact = false }: { label?: string; compact?: boolean }) {
  return (
    <div className={`panel-load ${compact ? 'compact' : ''}`} aria-live="polite" data-screen-label="AI panel render">
      <span className="label">{label}</span>
      <div className="grid"></div>
      <div className="grid tint"></div>
      <div className="grid spruce"></div>
    </div>
  );
}
