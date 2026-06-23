/* ============================================================
   Case History — one unified, replayable audit timeline per case.
   Spans discovery → sample → quote → PO → incident → approvals,
   carries omnichannel continuity (portal / email / sales / phone /
   plant), shared-case duality (you ↔ Dow team), versioned
   citations and PAC policy decisions. Governance made legible.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke, DocCite } = UI;

  function ActorAv({ actor }) {
    const a = window.DX.actors[actor] || window.DX.actors.system;
    if (a.kind === "ai") return <span className="dx-h-av ai"><span className="ai-glyph" /></span>;
    if (a.kind === "you") return <span className="dx-h-av you">{window.DX.account.initials}</span>;
    if (a.kind === "rep") return <span className="dx-h-av rep"><Icon name="group" size={14} /></span>;
    return <span className="dx-h-av sys"><Icon name="document-chart" size={13} /></span>;
  }

  function HistoryEvent({ ev, dimmed }) {
    const D = window.DX;
    const ch = D.channels[ev.channel] || D.channels.portal;
    const actor = D.actors[ev.actor] || D.actors.system;
    return (
      <div className={`dx-hstep ${dimmed ? "dim" : ""} ${ev.actor === "system" ? "sys" : ""}`}>
        <div className="rail"><ActorAv actor={ev.actor} /></div>
        <div className="hbody">
          <div className="hmeta">
            <span className="hstage">{ev.stage}</span>
            <span className="hchan" style={{ background: ch.tint, color: ch.color }}><Icon name={ch.icon} size={11} /> {ch.label}</span>
            {ev.locale && <span className="hloc">{ev.locale}</span>}
            <span className="htime">{ev.date} · {ev.t}</span>
          </div>
          <div className="htitle">{ev.title} <span className="hactor">· {actor.label}{actor.sub ? ` (${actor.sub})` : ""}</span></div>
          <div className="hdetail">{ev.detail}</div>
          {(ev.cites || ev.policy) && (
            <div className="hchips">
              {(ev.cites || []).map((c, i) => <DocCite key={i} id={c} small />)}
              {ev.policy && <span className="dx-policy-chip"><span className="ai-glyph" style={{ width: 10, height: 10 }} /> {ev.policy}</span>}
            </div>
          )}
        </div>
      </div>
    );
  }

  function CaseHistory({ code, onNav, onAskAgent, toast }) {
    const D = window.DX;
    const cases = D.cases;
    const [active, setActive] = React.useState(code && D.caseHistory[code] ? code : "CASE-02111");
    const live = window.DXLive.use();
    const events = [...(D.caseHistory[active] || []), ...((live.events && live.events[active]) || [])];
    const c = D.caseByCode(active);
    const [cursor, setCursor] = React.useState(events.length);   // how many events revealed
    const [playing, setPlaying] = React.useState(false);
    const timer = React.useRef(null);

    React.useEffect(() => { setCursor(events.length); setPlaying(false); }, [active, events.length]);
    React.useEffect(() => () => clearInterval(timer.current), []);
    React.useEffect(() => {
      clearInterval(timer.current);
      if (playing) {
        timer.current = setInterval(() => {
          setCursor(c2 => { if (c2 >= events.length) { setPlaying(false); return events.length; } return c2 + 1; });
        }, 900);
      }
      return () => clearInterval(timer.current);
    }, [playing, active]);

    function replay() { setCursor(0); setPlaying(true); }

    const ent = D.account.entitlements;

    return (
      <div className="dx-scroll fade-in">
        <div className="dx-wrap">
          <div className="dx-crumb"><a onClick={() => onNav({ name: "cases" })}>Cases</a> <span className="sep">›</span> <b>Case history</b></div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, margin: "6px 0 6px" }}>
            <div>
              <div className="dx-eyebrow">Unified audit timeline</div>
              <h2 className="dx-h2" style={{ marginTop: 6 }}>Nothing disappears</h2>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button className="dx-btn ghost sm" onClick={replay}><Stroke size={14} children={<polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none" />} /> Replay</button>
              <button className="dx-btn ghost sm" onClick={() => { window.location.href = "Dow Supply Chain on KAF.html"; }}><span className="ai-glyph" style={{ width: 13, height: 13 }} /> Operator view</button>
            </div>
          </div>
          <p className="dx-lead" style={{ marginBottom: 18 }}>One replayable record per application case — every channel, every agent and human action, every citation and policy decision. The same case your Dow team works from.</p>

          {/* case switcher */}
          <div className="dx-hcasebar">
            {cases.map(cc => (
              <button key={cc.code} className={`dx-hcasetab ${active === cc.code ? "on" : ""}`} onClick={() => setActive(cc.code)}>
                <Icon name={cc.icon} size={14} /> <span>{cc.code}</span><small>{cc.appLabel}</small>
              </button>
            ))}
          </div>

          <div className="dx-hgrid">
            <div>
              {/* shared-case duality banner */}
              <div className="dx-shared">
                <span className="si"><Icon name="group" size={15} /></span>
                <div><b>Shared case · {active}</b><span>You and your Dow team (Technical Service · Sales) work this exact record. Replays are identical on both sides.</span></div>
                <span className="dx-livedot"><span className="d" /> live</span>
              </div>

              {/* replay scrubber */}
              <div className="dx-scrub">
                <button className="pp" onClick={() => setPlaying(p => !p)}>
                  {playing ? <Stroke size={14} d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <Stroke size={14} children={<polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none" />} />}
                </button>
                <input type="range" min="0" max={events.length} value={cursor} onChange={e => { setPlaying(false); setCursor(+e.target.value); }} />
                <span className="sc">{Math.min(cursor, events.length)} / {events.length}</span>
              </div>

              {/* timeline */}
              <div className="dx-htl">
                {events.map((ev, i) => <HistoryEvent key={i} ev={ev} dimmed={i >= cursor} />)}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <button className="dx-btn ai sm" onClick={() => onAskAgent({ intent: c.type === "operator" ? "production" : "selector", text: c.prompt, code: c.code, fresh: true })}><span className="dx-spark">✦</span> Continue this case</button>
                <button className="dx-btn ghost sm" onClick={() => onNav({ name: "case", code: active })}>Open case</button>
              </div>
            </div>

            {/* governance sidebar */}
            <aside>
              <div className="dx-card">
                <div className="ch"><Icon name="document-chart" size={16} style={{ color: "var(--dow-red)" }} /><h3>Your access</h3></div>
                <div className="dx-entrole"><Icon name="group" size={13} /> {ent.role}</div>
                <div className="dx-entgrp"><div className="el">Granted</div>
                  {ent.granted.map((g, i) => (
                    <div className="dx-entrow ok" key={i}><Icon name="checkmark-filled" size={14} /><span><b>{g[0]}</b><small>{g[1]}</small></span></div>
                  ))}
                </div>
                <div className="dx-entgrp"><div className="el">Hidden · least-privilege</div>
                  {ent.redacted.map((g, i) => (
                    <div className="dx-entrow no" key={i}><Stroke size={14} d="M2 12s3.5-7 10-7c2 0 3.7.6 5.2 1.5M22 12s-3.5 7-10 7c-2 0-3.7-.6-5.2-1.5M3 3l18 18M9.9 9.9a3 3 0 004.2 4.2" /><span><b>{g[0]}</b><small>{g[1]}</small></span></div>
                  ))}
                </div>
              </div>
              <div className="dx-card">
                <div className="ch"><Icon name="network" size={16} style={{ color: "var(--dow-red)" }} /><h3>Channels on this case</h3></div>
                {Object.values(D.channels).map(ch => {
                  const n = events.filter(e => D.channels[e.channel] === ch).length;
                  if (!n) return null;
                  return <div className="dx-chanrow" key={ch.label}><span className="ci" style={{ background: ch.tint, color: ch.color }}><Icon name={ch.icon} size={13} /></span><b>{ch.label}</b><span className="cn">{n}</span></div>;
                })}
                <p style={{ fontSize: 11.5, color: "var(--dx-muted)", margin: "8px 0 0", lineHeight: 1.5 }}>Portal, email, sales notes and the plant floor all write to one case — context never resets.</p>
              </div>
            </aside>
          </div>
        </div>
        <UI.Footer onNav={onNav} />
      </div>
    );
  }
  UI.CaseHistory = CaseHistory;
})();
