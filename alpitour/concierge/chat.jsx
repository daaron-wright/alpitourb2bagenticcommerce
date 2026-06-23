/* ============================================================
   AlpiGPT B2B Concierge — chat panel + agent activity trace
   ============================================================ */
(function () {
  const { useEffect, useRef, useState } = React;

  function ChatPanel({ msgs, busy, chips, onChip, onSend, inputEnabled }) {
    const [text, setText] = useState("");
    const scrollRef = useRef(null);
    useEffect(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, [msgs, busy, chips]);

    function send() {
      const t = text.trim();
      if (!t || busy) return;
      setText("");
      onSend(t);
    }

    return (
      <div className="cg-chat">
        <div className="cg-chat-head">
          <span className="ic"><Ki name="chat-bot" size={15} /></span>
          <div style={{ flex: 1 }}>
            <div className="t">AlpiGPT</div>
            <div className="s">B2B concierge · orchestrated by KAF</div>
          </div>
          <span className="cg-badge ai"><Ki name="network" size={11} /> 10 agents</span>
        </div>

        <div className="cg-msgs" ref={scrollRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`cg-msg ${m.role}`}>
              {m.role === "agent" && <div className="who"><Ki name="chat-bot" size={12} /> AlpiGPT</div>}
              <span dangerouslySetInnerHTML={{ __html: m.html }} />
            </div>
          ))}
          {busy && (
            <div className="cg-busy">
              <span className="dots"><i></i><i></i><i></i></span>
              AlpiGPT is orchestrating…
            </div>
          )}
        </div>

        {chips.length > 0 && !busy && (
          <div className="cg-chips">
            {chips.map((c) => (
              <button key={c.id} className={`cg-chip ${c.kind || ""} ${c.selected ? "sel" : ""}`} onClick={() => onChip(c)}>
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="cg-composer">
          <input
            className="cg-input"
            placeholder={inputEnabled ? "Describe the request, or ask about any hotel or policy…" : "Use the suggested actions above…"}
            value={text}
            disabled={busy}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          />
          <button className="cg-send" disabled={busy || !text.trim()} onClick={send} title="Send">
            <Ki name="arrow-up-right" size={16} />
          </button>
        </div>
      </div>
    );
  }

  /* ---------- agent activity trace (collapsible bottom strip) ---------- */
  function AgentTrace({ items }) {
    const [open, setOpen] = useState(false);
    const last = items[items.length - 1];
    const bodyRef = useRef(null);
    useEffect(() => {
      if (open && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, [items, open]);

    return (
      <div className="cg-trace">
        <div className="cg-trace-bar" onClick={() => setOpen(!open)}>
          <span className="lbl"><Ki name="network" size={13} /> Agent activity</span>
          {last ? (
            <span className="last"><b>{last.agent}</b> — {last.message} <span style={{ color: "var(--fg-subtle)" }}>· KAF {last.phase} · {last.comp}</span></span>
          ) : (
            <span className="last" style={{ color: "var(--fg-subtle)" }}>Waiting for the first request…</span>
          )}
          <span className="count">{items.length} event{items.length === 1 ? "" : "s"}</span>
          <span className="chev">{open ? "▼" : "▲"}</span>
        </div>
        {open && (
          <div className="cg-trace-body" ref={bodyRef}>
            {items.map((it, i) => (
              <div className="cg-trace-row" key={i}>
                <span className="t">{it.t}</span>
                <span className="ag"><Ki name={it.icon || "recommend"} size={12} /> {it.agent}</span>
                <span className="msg">{it.message}</span>
                <span className="st">
                  <span className={`cg-badge ${it.status === "complete" ? "ok" : "info"}`} style={{ fontSize: 9 }}>
                    {it.phase} · {it.comp}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  Object.assign(window, { ChatPanel, AgentTrace });
})();
