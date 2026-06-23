/* ============================================================
   EasyBook Next — B2B Storefront · agentic interaction states
   AgentStatusBar + ToolCallCard, per the DS live-surface contract:
   AI gradient border, single moving element, destructive tools
   always gate behind human approval.
   ============================================================ */
import React from 'react';
import { Ki } from './Primitives';
import { overnight } from './data';

export function AiGlyph() {
  return <span className="sf-aiglyph" aria-hidden="true"></span>;
}

/* ---------- AgentStatusBar ---------- */
export function AgentStatusBar({ state, label, meta, onToast }: { state: string; label: string; meta?: string; onToast: (msg: string) => void }) {
  if (state === 'idle') return null;
  return (
    <div className={`sf-asb ${state}`} data-screen-label="Agent status bar">
      <span className="dot" aria-hidden="true"></span>
      <span className="label">{label}</span>
      {meta && <span className="meta num">{meta}</span>}
      <span className="controls">
        {state === 'thinking' && (
          <button className="b" onClick={() => onToast('Run paused — resume from the status bar. (Simulated in this prototype.)')}>Pause</button>
        )}
        {state === 'waiting' && <span className="meta">gated · waiting on you</span>}
      </span>
    </div>
  );
}

/* ---------- ToolCallCard ---------- */
function Args({ args }: { args: Record<string, any> }) {
  const lines = Object.entries(args).map(([k, v]) => (
    <div key={k}>
      <span className="k">{k}</span>:{' '}
      {typeof v === 'number' ? <span className="n">{v}</span> : <span className="s">"{v}"</span>}
    </div>
  ));
  return <div className="sf-tcc-args">{lines}</div>;
}

export function ToolCallCard({ t, onApprove, onReject }: { t: any; onApprove?: () => void; onReject?: () => void }) {
  const [open, setOpen] = React.useState(t.status === 'pending');
  const statusLabel =
    t.status === 'running' ? 'Executing'
    : t.status === 'ok' ? 'Completed'
    : t.status === 'err' ? 'Failed'
    : 'Awaiting approval';
  return (
    <div className={`sf-tcc ${t.status}`} data-screen-label={`Tool call ${t.tool}`}>
      <div
        className="head"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
      >
        <span className="ic"><Ki name={t.icon || 'network'} size={13} /></span>
        <div>
          <div className="t">{t.title} <span className="tool num">{t.tool}</span></div>
          {t.meta && <div className="m num">{t.meta}</div>}
        </div>
        <span className="st"><span className="sd" /> {statusLabel}</span>
      </div>
      {open && (
        <div className="body">
          <Args args={t.args} />
          {t.result && <div className="res"><Ki name={t.status === 'err' ? 'error-filled' : 'checkmark-filled'} size={12} /> {t.result}</div>}
          {t.status === 'pending' && (
            <div className="acts">
              <button className="sf-btn sm primary" onClick={onApprove}>Approve & run</button>
              <button className="sf-btn sm" onClick={onReject}>Not now</button>
              <span className="gate num">{t.gate || 'destructive · always gates'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- HandoffCard — agent→agent / agent→human ---------- */
export function HandoffCard({ h }: { h: any }) {
  return (
    <div className={`sf-handoff ${h.dir}`} data-screen-label="Agent handoff">
      <div className="hh">
        <AiGlyph />
        <span className="lbl">{h.dir === 'in' ? 'Handoff received' : 'Handoff dispatched'}</span>
        {h.meta && <span className="meta num">{h.meta}</span>}
      </div>
      <div className="route">
        <span className="node">{h.from}</span>
        <Ki name="arrow-up-right" size={12} />
        <span className="node to">{h.to}</span>
      </div>
      {h.payload && (
        <div className="payload">
          {h.payload.map((p: string) => <span key={p}><Ki name="checkmark-filled" size={10} /> {p}</span>)}
        </div>
      )}
      {h.note && <div className="note">{h.note}</div>}
    </div>
  );
}

/* ---------- OvernightPanel — the agent worked while the agency was closed ---------- */
export function OvernightPanel({ onDelta, onToast }: { onDelta: (delta: any) => void; onToast: (msg: string) => void }) {
  const data = overnight;
  const [state, setState] = React.useState<Record<string, string>>({});
  const open = data.items.filter((i: any) => !state[i.id]);
  const handled = data.items.length - open.length;
  return (
    <section className="sf-ov" data-screen-label="Overnight agent run">
      <div className="sf-asb done" style={{ margin: 0, position: 'static' }}>
        <span className="dot" aria-hidden="true"></span>
        <span className="label">While you were closed — overnight run</span>
        <span className="meta num">{data.meta}</span>
        <span className="controls"><span className="meta">{handled}/{data.items.length} handled</span></span>
      </div>
      {open.length === 0 ? (
        <div className="sf-ov-empty">
          <Ki name="checkmark-filled" size={13} /> Desk clear — every overnight action handled. The agent logged your choices to keep learning your defaults.
        </div>
      ) : (
        <div className="sf-ov-rows">
          {open.map((it: any) => (
            <div key={it.id} className="sf-ov-row">
              <span className={`ic ${it.kind === 'gated' ? 'warn' : ''}`}><Ki name={it.icon} size={14} /></span>
              <div className="bd">
                <div className="t">{it.title} {it.kind === 'gated' && <span className="gatetag">needs approval</span>}</div>
                <div className="s">{it.detail}</div>
                <div className="m num">{it.meta}</div>
              </div>
              <div className="acts">
                <button
                  className="sf-btn sm primary"
                  onClick={() => { setState((s) => ({ ...s, [it.id]: 'done' })); onDelta(it.delta); }}
                >
                  {it.approveLabel}
                </button>
                <button
                  className="sf-btn sm"
                  onClick={() => {
                    setState((s) => ({ ...s, [it.id]: 'dismissed' }));
                    onToast('Dismissed — logged as a teaching signal. The agent will deprioritise similar suggestions.');
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
