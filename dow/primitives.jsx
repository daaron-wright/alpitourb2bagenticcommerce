/* ============================================================
   Shared primitives — attached to window.UI
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});

  // Inline icon via sprite <use>
  function Icon({ name, size = 16, className = "", style }) {
    const cls = `ki ${className}`.trim();
    return (
      <svg className={cls} style={{ width: size, height: size, ...style }} aria-hidden="true">
        <use href={`#icon-${name}`} />
      </svg>
    );
  }
  UI.Icon = Icon;

  // Lucide-style inline strokes for cases the sprite doesn't cover
  function Stroke({ d, size = 16, sw = 2, vb = 24, children, style, className = "" }) {
    return (
      <svg className={className} width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none"
        stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
        {d ? <path d={d} /> : children}
      </svg>
    );
  }
  UI.Stroke = Stroke;

  // Kyndryl DS AI Loader — canonical two-arc conic ring (Warm Red ↔ Spruce)
  function AiSpinner({ size = 24, className = "", style }) {
    const thick = Math.max(2, Math.round(size * 0.11));
    return <span className={`ai-spinner ${className}`} style={{ width: size, height: size, "--thick": thick + "px", ...style }} />;
  }
  UI.AiSpinner = AiSpinner;

  // Skeleton shimmer (loading placeholder, DS kyn-skel)
  function Skel({ w, h = 12, r = 4, style }) {
    return <span className="kyn-skel" style={{ display: "block", width: w || "100%", height: h, borderRadius: r, ...style }} />;
  }
  UI.Skel = Skel;

  function Badge({ tone = "gray", children, dot, className = "" }) {
    return (
      <span className={`b ${tone} ${className}`}>
        {dot && <span className="dot" style={{ background: dot }} />}
        {children}
      </span>
    );
  }
  UI.Badge = Badge;

  function Sev({ level, children }) {
    return <span className={`sev ${level}`}>{children || level}</span>;
  }
  UI.Sev = Sev;

  function Packet({ children }) {
    return <span className="packet">{children}</span>;
  }
  UI.Packet = Packet;

  function Avatar({ initials, color, size = 30 }) {
    return (
      <span className="avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.37 }}>
        {initials}
      </span>
    );
  }
  UI.Avatar = Avatar;

  function Button({ variant, size, children, onClick, disabled, icon, title }) {
    const cls = ["btn", variant, size].filter(Boolean).join(" ");
    return (
      <button className={cls} onClick={onClick} disabled={disabled} title={title}>
        {icon && <Icon name={icon} size={14} />}
        {children}
      </button>
    );
  }
  UI.Button = Button;

  // Agentic primitive: ConfidenceBadge with override popover
  function AgenticBadge({ tone = "spruce", label, title, meta, actions = [], onAct }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
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
            {actions.map((a, i) => (
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
  UI.AgenticBadge = AgenticBadge;

  function SourceAttribution({ children, when = "just now" }) {
    return (
      <span className="rec-attrib">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span className="ai-glyph" style={{ width: 11, height: 11 }} />
          {children || "Powered by agentic AI"} · {when}
        </span>
      </span>
    );
  }
  UI.SourceAttribution = SourceAttribution;

  // AgentStatusBar
  function AgentStatusBar({ state = "thinking", label, meta, controls = true, onPause, onCancel }) {
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
  UI.AgentStatusBar = AgentStatusBar;

  // StepTimeline
  function StepTimeline({ steps }) {
    return (
      <div className="stl">
        {steps.map((s, i) => (
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
  UI.StepTimeline = StepTimeline;

  // ToolCallCard (compact, completed/running)
  function ToolCallCard({ state = "ok", title, tool, meta, statusText }) {
    const okMark = <Stroke size={13} sw={3} children={<polyline points="20 6 9 17 4 12" />} />;
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
  UI.ToolCallCard = ToolCallCard;

  function Panel({ title, meta, children, head, className = "", pad = true }) {
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
  UI.Panel = Panel;

  function Eyebrow({ children, tone = "" }) {
    return <div className={`eyebrow ${tone}`}>{children}</div>;
  }
  UI.Eyebrow = Eyebrow;

  // Collapsible — fold a secondary panel away to condense the page.
  function Collapsible({ title, subtitle, badge, defaultOpen = false, children }) {
    const [open, setOpen] = React.useState(defaultOpen);
    return (
      <div className={`coll ${open ? "open" : ""}`}>
        <button className="coll-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
          <Stroke className="coll-chev" size={15} sw={2.4} children={<polyline points="9 18 15 12 9 6" />} />
          <span className="coll-title">{title}</span>
          {subtitle && <span className="coll-sub">{subtitle}</span>}
          {badge && <span className="coll-badge">{badge}</span>}
          <span className="coll-state">{open ? "Hide" : "Show"}</span>
        </button>
        {open && <div className="coll-body">{children}</div>}
      </div>
    );
  }
  UI.Collapsible = Collapsible;

  // WhyChip — explainability: agent → PAC rule → BRD source line.
  // Opens a popover anchored to the chip. The reason chain back to the rule.
  function WhyChip({ why, label = "Why?" }) {
    const [open, setOpen] = React.useState(false);
    const [up, setUp] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
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
    const D = window.D;
    const agent = why.agent ? D.agents.find(a => a.id === why.agent) : null;
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
                <span className="wl-num" style={{ background: agent.tint, color: agent.color }}><Icon name={agent.icon} size={14} /></span>
                <span>
                  <div className="wl-k">Agent that acted</div>
                  <div className="wl-v">{agent.name} <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>· {agent.now}</span></div>
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
  UI.WhyChip = WhyChip;

  // Toast host — supports an optional Next-Best-Action CTA
  function useToast() {
    const [t, setT] = React.useState(null);
    const show = React.useCallback((msg, cta) => {
      setT({ msg, cta });
      clearTimeout(window.__toastT);
      window.__toastT = setTimeout(() => setT(null), cta ? 6500 : 3200);
    }, []);
    const node = t ? (
      <div className="agentic-toast" data-show="true">
        <span className="at-dot" />
        {t.cta && <span className="at-nba">Next best action</span>}
        <span className="at-msg">{t.msg}</span>
        {t.cta && (
          <button className="at-cta" onClick={() => { clearTimeout(window.__toastT); setT(null); t.cta.onClick && t.cta.onClick(); }}>
            {t.cta.label}
          </button>
        )}
      </div>
    ) : null;
    return [node, show];
  }
  UI.useToast = useToast;

  // Versioned citation chip — internal-source-first, public copy shown
  function DocCite({ id, small }) {
    const d = (window.DX && window.DX.docRef) ? window.DX.docRef(id) : null;
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
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
  UI.DocCite = DocCite;
})();
