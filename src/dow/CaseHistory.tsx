import React from 'react';
import { Icon, Stroke, DocCite } from './Primitives';
import { Footer } from './Chrome';
import { DX } from './data';
import { DXLive } from './live-store';

function ActorAv({ actor }: { actor: string }) {
  const a = DX.actors[actor] || DX.actors.system;
  if (a.kind === "ai") return <span className="dx-h-av ai"><span className="ai-glyph" /></span>;
  if (a.kind === "you") return <span className="dx-h-av you">{DX.account.initials}</span>;
  if (a.kind === "rep") return <span className="dx-h-av rep"><Icon name="group" size={14} /></span>;
  return <span className="dx-h-av sys"><Icon name="document-chart" size={13} /></span>;
}

function HistoryEvent({ ev, dimmed }: { ev: any; dimmed: boolean }) {
  const ch = DX.channels[ev.channel] || DX.channels.portal;
  const actor = DX.actors[ev.actor] || DX.actors.system;
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
            {(ev.cites || []).map((c: string, i: number) => <DocCite key={i} id={c} small />)}
            {ev.policy && <span className="dx-policy-chip"><span className="ai-glyph" style={{ width: 10, height: 10 }} /> {ev.policy}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export function CaseHistory({ code, onNav, onAskAgent, toast }: any) {
  const cases = DX.cases;
  const [active, setActive] = React.useState(code && DX.caseHistory[code] ? code : "CASE-02111");
  const live = DXLive.use();
  const events = [...(DX.caseHistory[active] || []), ...((live.events && live.events[active]) || [])];
  const c = DX.caseByCode(active);
  const [cursor, setCursor] = React.useState(events.length);
  const [playing, setPlaying] = React.useState(false);
  const timer = React.useRef<any>(null);

  React.useEffect(() => { setCursor(events.length); setPlaying(false); }, [active, events.length]);
  React.useEffect(() => () => clearInterval(timer.current), []);
  React.useEffect(() => {
    clearInterval(timer.current);
    if (playing) {
      timer.current = setInterval(() => {
        setCursor((c2: number) => { if (c2 >= events.length) { setPlaying(false); return events.length; } return c2 + 1; });
      }, 900);
    }
    return () => clearInterval(timer.current);
  }, [playing, active]);

  function replay() { setCursor(0); setPlaying(true); }

  const ent = DX.account.entitlements;

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
            <button className="dx-btn ghost sm" onClick={replay}><Stroke size={14}><polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none" /></Stroke> Replay</button>
            <button className="dx-btn ghost sm" onClick={() => { window.location.href = "Dow Supply Chain on KAF.html"; }}><span className="ai-glyph" style={{ width: 13, height: 13 }} /> Operator view</button>
          </div>
        </div>
        <p className="dx-lead" style={{ marginBottom: 18 }}>One replayable record per application case — every channel, every agent and human action, every citation and policy decision. The same case your Dow team works from.</p>

        <div className="dx-hcasebar">
          {cases.map((cc: any) => (
            <button key={cc.code} className={`dx-hcasetab ${active === cc.code ? "on" : ""}`} onClick={() => setActive(cc.code)}>
              <Icon name={cc.icon} size={14} /> <span>{cc.code}</span><small>{cc.appLabel}</small>
            </button>
          ))}
        </div>

        <div className="dx-hgrid">
          <div>
            <div className="dx-shared">
              <span className="si"><Icon name="group" size={15} /></span>
              <div><b>Shared case · {active}</b><span>You and your Dow team (Technical Service · Sales) work this exact record. Replays are identical on both sides.</span></div>
              <span className="dx-livedot"><span className="d" /> live</span>
            </div>

            <div className="dx-scrub">
              <button className="pp" onClick={() => setPlaying((p: boolean) => !p)}>
                {playing ? <Stroke size={14} d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <Stroke size={14}><polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none" /></Stroke>}
              </button>
              <input type="range" min="0" max={events.length} value={cursor} onChange={e => { setPlaying(false); setCursor(+e.target.value); }} />
              <span className="sc">{Math.min(cursor, events.length)} / {events.length}</span>
            </div>

            <div className="dx-htl">
              {events.map((ev: any, i: number) => <HistoryEvent key={i} ev={ev} dimmed={i >= cursor} />)}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <button className="dx-btn ai sm" onClick={() => onAskAgent({ intent: c && c.type === "operator" ? "production" : "selector", text: c && c.prompt, code: c && c.code, fresh: true })}><span className="dx-spark">✦</span> Continue this case</button>
              <button className="dx-btn ghost sm" onClick={() => onNav({ name: "case", code: active })}>Open case</button>
            </div>
          </div>

          <aside>
            <div className="dx-card">
              <div className="ch"><Icon name="document-chart" size={16} style={{ color: "var(--dow-red)" }} /><h3>Your access</h3></div>
              <div className="dx-entrole"><Icon name="group" size={13} /> {ent.role}</div>
              <div className="dx-entgrp"><div className="el">Granted</div>
                {ent.granted.map((g: any, i: number) => (
                  <div className="dx-entrow ok" key={i}><Icon name="checkmark-filled" size={14} /><span><b>{g[0]}</b><small>{g[1]}</small></span></div>
                ))}
              </div>
              <div className="dx-entgrp"><div className="el">Hidden · least-privilege</div>
                {ent.redacted.map((g: any, i: number) => (
                  <div className="dx-entrow no" key={i}><Stroke size={14} d="M2 12s3.5-7 10-7c2 0 3.7.6 5.2 1.5M22 12s-3.5 7-10 7c-2 0-3.7-.6-5.2-1.5M3 3l18 18M9.9 9.9a3 3 0 004.2 4.2" /><span><b>{g[0]}</b><small>{g[1]}</small></span></div>
                ))}
              </div>
            </div>
            <div className="dx-card">
              <div className="ch"><Icon name="network" size={16} style={{ color: "var(--dow-red)" }} /><h3>Channels on this case</h3></div>
              {Object.values(DX.channels).map((ch: any) => {
                const n = events.filter((e: any) => DX.channels[e.channel] === ch).length;
                if (!n) return null;
                return <div className="dx-chanrow" key={ch.label}><span className="ci" style={{ background: ch.tint, color: ch.color }}><Icon name={ch.icon} size={13} /></span><b>{ch.label}</b><span className="cn">{n}</span></div>;
              })}
              <p style={{ fontSize: 11.5, color: "var(--dx-muted)", margin: "8px 0 0", lineHeight: 1.5 }}>Portal, email, sales notes and the plant floor all write to one case — context never resets.</p>
            </div>
          </aside>
        </div>
      </div>
      <Footer onNav={onNav} />
    </div>
  );
}
