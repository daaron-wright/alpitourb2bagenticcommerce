// parts.jsx — shared kit for the Alpitour AI Lab workshop walkthrough.
// Calm Kyndryl/Shidoka surfaces; every board is a facilitation frame the
// room fills LIVE. `ex` (example mode) reveals faint reference answers.

const AL_PHASES = [
  { id: "frame",   n: "01", label: "Frame",   time: "00:00–00:20", color: "#29707A" },
  { id: "provoke", n: "02", label: "Provoke", time: "00:20–00:32", color: "#3E8AC2" },
  { id: "enact",   n: "03", label: "Enact",   time: "00:32–01:00", color: "#8A4FBF" },
  { id: "capture", n: "04", label: "Capture", time: "01:00–01:45", color: "#E68A00" },
  { id: "distill", n: "05", label: "Distill", time: "01:45–02:00", color: "#FF462D" },
  { id: "toolkit", n: "06", label: "Toolkit", time: "optional",    color: "#4F5A63" },
];
const AL_PHASE = (id) => AL_PHASES.find((p) => p.id === id) || AL_PHASES[0];

const alHex = (hex, a) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/* ---------- board shell ---------- */
function Board({ phase, time, eyebrow, title, sub, script, scriptK = "Facilitator says", output, children }) {
  const p = AL_PHASE(phase);
  return (
    <div className="al-board" style={{ "--al-accent": p.color, "--al-accent-tint": alHex(p.color, 0.06) }}>
      <div className="al-head">
        <div style={{ minWidth: 0 }}>
          <span className="al-eyebrow" style={{ color: p.color }}>
            <span className="al-dot" style={{ background: p.color }}></span>
            {eyebrow || `${p.n} · ${p.label}`}{time ? ` · ${time}` : ""}
          </span>
          <h1 className="al-title">{title}</h1>
          {sub ? <p className="al-sub">{sub}</p> : null}
        </div>
        {output ? (
          <div className="al-output">
            <div className="al-output-k">Room leaves with</div>
            <div className="al-output-v">{output}</div>
          </div>
        ) : null}
      </div>
      {script ? (
        <div className="al-script">
          <span className="al-script-t">{script}</span>
        </div>
      ) : null}
      <div className="al-body">{children}</div>
    </div>
  );
}

/* ---------- section kicker ---------- */
function Kicker({ children, color }) {
  return <div className="al-kicker" style={color ? { color } : null}>{children}</div>;
}

/* ---------- fill-in slot ---------- */
function Slot({ label, example, ex, minH, style, desc }) {
  return (
    <div className={"al-slot" + (ex && example ? " is-ex" : "")} style={{ minHeight: minH || 60, ...style }}>
      {label ? <span className="al-slot-l">{label}</span> : null}
      {ex && example ? (
        <span className="al-slot-e"><span className="al-eg">e.g.</span>{example}</span>
      ) : null}
      {desc ? <span style={{ fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.4, marginTop: 3 }}>{desc}</span> : null}
    </div>
  );
}

/* ---------- chip ---------- */
function Chip({ children, n, color, style }) {
  return (
    <span className="al-chip" style={{ ...(color ? { borderColor: alHex(color, 0.4), color } : null), ...style }}>
      {n ? <span className="al-chip-n">{n}</span> : null}
      {children}
    </span>
  );
}

/* ---------- inline editable token (lightweight, live-tweakable) ---------- */
function Edit({ children }) {
  return <span className="al-edit" contentEditable suppressContentEditableWarning>{children}</span>;
}

/* ---------- 1–5 score scale ---------- */
function Scale() {
  return (
    <span className="al-scale">
      {[1, 2, 3, 4, 5].map((i) => <span key={i} className="al-pip">{i}</span>)}
    </span>
  );
}

/* ---------- swimlane (orchestration worksheet) ---------- */
function Lane({ label, color, children }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 0, border: "1px solid var(--border-1)", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      <div style={{ flex: "0 0 168px", padding: "12px 14px", background: alHex(color, 0.07), borderRight: `1px solid ${alHex(color, 0.25)}`, display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{label}</span>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 10, padding: 10, minWidth: 0 }}>{children}</div>
    </div>
  );
}

Object.assign(window, { AL_PHASES, AL_PHASE, alHex, Board, Kicker, Slot, Chip, Edit, Scale, Lane });
