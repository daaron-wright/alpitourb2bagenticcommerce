/* ============================================================
   Shared primitives — attached to window.UI
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});

  // Inline icon via sprite <use>
  function Icon({ name, size = 16, className = "", style }) {
    const cls = `ki ki-${size} ${className}`.trim();
    return (
      <svg className={cls} style={style} aria-hidden="true">
        <use href={`#icon-${name}`} />
      </svg>
    );
  }
  UI.Icon = Icon;

  // Lucide-style inline strokes for cases the sprite doesn't cover
  function Stroke({ d, size = 16, sw = 2, vb = 24, children, style }) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none"
        stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
        {d ? <path d={d} /> : children}
      </svg>
    );
  }
  UI.Stroke = Stroke;

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

  // Toast host (simple, non-destructive feedback)
  function useToast() {
    const [toast, setToast] = React.useState(null);
    const show = React.useCallback((msg) => {
      setToast(msg);
      clearTimeout(window.__toastT);
      window.__toastT = setTimeout(() => setToast(null), 3200);
    }, []);
    const node = toast ? (
      <div className="agentic-toast" data-show="true">
        <span className="at-dot" />
        <span>{toast}</span>
      </div>
    ) : null;
    return [node, show];
  }
  UI.useToast = useToast;
})();
