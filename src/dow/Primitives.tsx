import React from 'react';
import { DX } from './data';

export function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
  const cls = `ki ${className}`.trim();
  return (
    <svg className={cls} style={{ width: size, height: size, ...style }} aria-hidden="true">
      <use href={`#icon-${name}`} />
    </svg>
  );
}

export function Stroke({ d, size = 16, sw = 2, vb = 24, children, style, className = "" }: any) {
  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {d ? <path d={d} /> : children}
    </svg>
  );
}

export function AiSpinner({ size = 24, className = "", style }: any) {
  const thick = Math.max(2, Math.round(size * 0.11));
  return <span className={`ai-spinner ${className}`} style={{ width: size, height: size, "--thick": thick + "px", ...style } as any} />;
}

export function Skel({ w, h = 12, r = 4, style }: any) {
  return <span className="kyn-skel" style={{ display: "block", width: w || "100%", height: h, borderRadius: r, ...style }} />;
}

export function Badge({ tone = "gray", children, dot, className = "" }: any) {
  return (
    <span className={`b ${tone} ${className}`}>
      {dot && <span className="dot" style={{ background: dot }} />}
      {children}
    </span>
  );
}

export function Sev({ level, children }: any) {
  return <span className={`sev ${level}`}>{children || level}</span>;
}

export function Packet({ children }: any) {
  return <span className="packet">{children}</span>;
}

export function Avatar({ initials, color, size = 30 }: any) {
  return (
    <span className="avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.37 }}>
      {initials}
    </span>
  );
}

export function Button({ variant, size, children, onClick, disabled, icon, title }: any) {
  const cls = ["btn", variant, size].filter(Boolean).join(" ");
  return (
    <button className={cls} onClick={onClick} disabled={disabled} title={title}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}

export function AgenticBadge({ tone = "spruce", label, title, meta, actions = [], onAct }: any) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button className={`b ${tone}`} style={{ cursor: "pointer", background: "transparent" }}
        onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span style={{ borderBottom: "1px dotted currentColor" }}>{label}</span>
        <span style={{ opacity: open ? 0.9 : 0.5, fontSize: 9 }}>•••</span>
      </button>
      {open && (
        <div className="agentic-pop" data-open="true" style={{ left: "auto", right: 0 }}>
          <header><span className="ap-title">{title}</span><span className="ap-meta">{meta}</span></header>
          <div className="ap-divider" />
          {actions.map((a: any, i: number) => (
            <button key={i} className={`ap-action ${a.destructive ? "is-destructive" : ""}`}
              onClick={() => { setOpen(false); onAct && onAct(a); }}>
              <span>{a.label}{a.sub && <span className="ap-sub">{a.sub}</span>}</span>
            </button>
          ))}
        </div>
      )}
    </span>
  );
}

export function SourceAttribution({ children, when = "just now" }: any) {
  return (
    <span className="rec-attrib">
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <span className="ai-glyph" style={{ width: 11, height: 11 }} />
        {children || "Powered by agentic AI"} · {when}
      </span>
    </span>
  );
}

export function AgentStatusBar({ state = "thinking", label, meta, controls = true, onPause, onCancel }: any) {
  return (
    <div className={`asb ${state} ai-edge`}>
      <span className="dot" />
      <span className="label">{label}{state === "streaming" && <span className="caret" />}</span>
      {meta && <span className="meta">{meta}</span>}
      {controls && (
        <div className="controls">
          {state !== "done" && <button className="ab" onClick={onPause}>Pause</button>}
          {state !== "done" && <button className="ab" onClick={onCancel}>Inject correction</button>}
          {state === "done" && <button className="ab" onClick={onPause}>View trace</button>}
        </div>
      )}
    </div>
  );
}

export function StepTimeline({ steps }: any) {
  return (
    <div className="stl">
      {steps.map((s: any, i: number) => (
        <div key={i} className={`stl-step ${s.state}`}>
          <div className="rail"><div className="marker" /></div>
          <div>
            <div className="label">{s.label}</div>
            {s.sub && <div className="sub" dangerouslySetInnerHTML={{ __html: s.sub.replace(/`([^`]+)`/g, "<code>$1</code>") }} />}
          </div>
          <span className="ts">{s.ts}</span>
        </div>
      ))}
    </div>
  );
}

export function ToolCallCard({ state = "ok", title, tool, meta, statusText }: any) {
  const okMark = <Stroke size={13} sw={3}><polyline points="20 6 9 17 4 12" /></Stroke>;
  return (
    <div className={`tcc ${state} ai-edge`}>
      <div className="tcc-head">
        <div className="tcc-icon">{state === "ok" ? okMark : <Stroke size={13} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />}</div>
        <div>
          <div className="tcc-title">{title} <span className="tool">{tool}</span></div>
          {meta && <div className="tcc-meta">{meta}</div>}
        </div>
        <div className="tcc-status"><span className="sd" />{statusText || (state === "ok" ? "OK" : "Running")}</div>
      </div>
    </div>
  );
}

export function Panel({ title, meta, children, head, className = "", pad = true }: any) {
  return (
    <div className={`panel ${className}`}>
      {(title || head) && (
        <div className="panel-head">
          {title && <h3>{title}</h3>}
          {head}
          {meta && <span className="ph-meta">{meta}</span>}
        </div>
      )}
      {pad ? <div className="panel-pad">{children}</div> : children}
    </div>
  );
}

export function Eyebrow({ children, tone = "" }: any) {
  return <div className={`eyebrow ${tone}`}>{children}</div>;
}

export function Collapsible({ title, subtitle, badge, defaultOpen = false, children }: any) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={`coll ${open ? "open" : ""}`}>
      <button className="coll-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <Stroke className="coll-chev" size={15} sw={2.4}><polyline points="9 18 15 12 9 6" /></Stroke>
        <span className="coll-title">{title}</span>
        {subtitle && <span className="coll-sub">{subtitle}</span>}
        {badge && <span className="coll-badge">{badge}</span>}
        <span className="coll-state">{open ? "Hide" : "Show"}</span>
      </button>
      {open && <div className="coll-body">{children}</div>}
    </div>
  );
}

export function WhyChip({ why, label = "Why?" }: any) {
  const [open, setOpen] = React.useState(false);
  const [up, setUp] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  function toggle() {
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect();
      setUp(r.bottom > window.innerHeight - 280);
    }
    setOpen(o => !o);
  }
  const agent = why.agent ? DX.agents.find((a: any) => a.id === why.agent) : null;
  const posStyle = up ? { bottom: "calc(100% + 8px)", left: 0 } : { top: "calc(100% + 8px)", left: 0 };
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button className="why-chip" onClick={toggle} aria-expanded={open}>
        <span className="ai-glyph" />{label}
      </button>
      {open && (
        <div className="why-pop fade-in" style={posStyle}>
          <div className="wp-head">
            <div className="wt">Reason chain</div>
            <div className="ws">Every decision points back to the rule it came from.</div>
          </div>
          {agent && (
            <div className="why-layer">
              <span className="wl-num" style={{ background: (agent as any).tint, color: (agent as any).color }}><Icon name={(agent as any).icon} size={14} /></span>
              <span>
                <div className="wl-k">Agent that acted</div>
                <div className="wl-v">{(agent as any).name} <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>· {(agent as any).now}</span></div>
              </span>
            </div>
          )}
          {why.rule && (
            <div className="why-layer">
              <span className="wl-num" style={{ background: "#F0E6FA", color: "#6B36A8" }}><Icon name="document-chart" size={14} /></span>
              <span>
                <div className="wl-k">Policy it checked · PAC</div>
                <div className="wl-v"><span className="mono">{why.rule}</span></div>
              </span>
            </div>
          )}
          <div className="why-layer">
            <span className="wl-num" style={{ background: "var(--k-dark-stone-90)", color: "#fff" }}><Icon name="information" size={13} /></span>
            <span>
              <div className="wl-k">Source rule · in the BRD</div>
              <div className="wl-src">{why.brd}</div>
            </span>
          </div>
        </div>
      )}
    </span>
  );
}

export function useToast(): [React.ReactNode, (msg: string, cta?: any) => void] {
  const [t, setT] = React.useState<any>(null);
  const timerRef = React.useRef<any>(null);
  const show = React.useCallback((msg: string, cta?: any) => {
    setT({ msg, cta });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setT(null), cta ? 6500 : 3200);
  }, []);
  const node = t ? (
    <div className="agentic-toast" data-show="true">
      <span className="at-dot" />
      {t.cta && <span className="at-nba">Next best action</span>}
      <span className="at-msg">{t.msg}</span>
      {t.cta && (
        <button className="at-cta" onClick={() => { clearTimeout(timerRef.current); setT(null); t.cta.onClick && t.cta.onClick(); }}>
          {t.cta.label}
        </button>
      )}
    </div>
  ) : null;
  return [node, show];
}

export function DocCite({ id, small }: any) {
  const d = DX.docRef(id);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  if (!d) return null;
  return (
    <span className="dx-cite-wrap" ref={ref}>
      <button className={`dx-cite ${small ? "sm" : ""}`} onClick={() => setOpen(o => !o)} title="View source provenance">
        <Icon name="document-chart" size={small ? 10 : 11} />
        <span className="ct">{d.kind}</span>
        <span className="cv">{d.rev}</span>
      </button>
      {open && (
        <span className="dx-cite-pop">
          <span className="ch">{d.title}</span>
          <span className="cr"><Icon name="checkmark-filled" size={11} /> Internal source · {d.rev} · {d.date}</span>
          {d.public
            ? <span className="cp"><Icon name="information" size={11} /> Public copy shown: {d.public}</span>
            : <span className="cp restricted"><Icon name="warning-alt" size={11} /> Internal-only — not public</span>}
          {d.lag && <span className="cl">{d.lag}</span>}
        </span>
      )}
    </span>
  );
}

export function RecommendationGraph() {
  return (
    <div className="dx-rec-graph">
      <div className="dx-eyebrow">How ChemAssist recommends</div>
      <h2 className="dx-h2">Every recommendation is grounded and governed</h2>
      <p className="dx-lead">ChemAssist checks the product catalog, application guides, regulatory status and your account entitlements before returning a result — then shows you the reasoning.</p>
    </div>
  );
}
