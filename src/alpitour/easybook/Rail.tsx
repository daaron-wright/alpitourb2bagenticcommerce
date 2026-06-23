/* ============================================================
   EasyBook Next — right orchestration rail
   Migrated from alpitour/easybook/rail.jsx
   ============================================================ */
import React, { useEffect, useRef, useState } from 'react';
import { receipts, PLAN } from './data';
import { Ki, Fresh } from './Components';

export function OrchestrationRail({ tab, setTab, msgs, working, quick, onQuick, onSend, approval, onApprove, onReject, planDoneIdx, planActiveIdx, confidence, timeline, srcIds, escalation, onEscalate, counts }: any) {
  const TABS: [string, string][] = [['chat', 'Chat'], ['plan', 'Plan'], ['sources', 'Sources'], ['timeline', 'Timeline'], ['support', 'Support']];
  return (
    <aside className="eb-rail-r">
      <div className="eb-tabs" role="tablist">
        {TABS.map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={`eb-tab ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)}>
            {l}{counts[id] ? <span className="n">{counts[id]}</span> : null}
          </button>
        ))}
      </div>
      {approval && (
        <div className="eb-approve" role="alert">
          <div className="t"><Ki name="warning-alt" size={13} /> Approval needed — {approval.actionType}</div>
          <div className="s">{approval.summary}</div>
          <div className="acts">
            <button className="eb-btn primary sm" onClick={onApprove}><Ki name="checkmark-filled" size={12} /> Approve</button>
            <button className="eb-btn sm" onClick={onReject}>Not now</button>
          </div>
        </div>
      )}
      <div className="eb-rail-body">
        {tab === 'chat' && <ChatTab msgs={msgs} working={working} quick={quick} onQuick={onQuick} onSend={onSend} />}
        {tab === 'plan' && <PlanTab doneIdx={planDoneIdx} activeIdx={planActiveIdx} confidence={confidence} />}
        {tab === 'sources' && <SourcesTab ids={srcIds} />}
        {tab === 'timeline' && <TimelineTab items={timeline} />}
        {tab === 'support' && <SupportTab escalation={escalation} onEscalate={onEscalate} />}
      </div>
    </aside>
  );
}

function ChatTab({ msgs, working, quick, onQuick, onSend }: any) {
  const [text, setText] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs, working, quick]);
  function send() { const t = text.trim(); if (!t || working) return; setText(''); onSend(t); }
  return (
    <>
      <div className="eb-msgs" ref={ref}>
        {msgs.map((m: any, i: number) => (
          <div key={i} className={`eb-msg ${m.role}`}>
            {m.role === 'agent' && <div className="who"><Ki name="chat-bot" size={11} /> AlpiGPT{m.skill ? ` · ${m.skill}` : ''}</div>}
            <span dangerouslySetInnerHTML={{ __html: m.html }} />
          </div>
        ))}
        {working && <div className="eb-working"><span className="dots"><i></i><i></i><i></i></span> {working}</div>}
      </div>
      {quick.length > 0 && !working && (
        <div className="eb-quick">
          {quick.map((q: any) => <button key={q.id} className={q.kind || ''} onClick={() => onQuick(q)}>{q.label}</button>)}
        </div>
      )}
      <div className="eb-composer">
        <input className="eb-input" placeholder="Ask, or describe the change…" value={text} disabled={!!working}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} aria-label="Message AlpiGPT" />
        <button className="eb-send" disabled={!!working || !text.trim()} onClick={send} title="Send"><Ki name="arrow-up-right" size={15} /></button>
      </div>
    </>
  );
}

function PlanTab({ doneIdx, activeIdx, confidence }: any) {
  return (
    <>
      <div className="eb-plan">
        {PLAN.map((p, i) => {
          const st = i <= doneIdx ? 'done' : i === activeIdx ? 'active' : 'pending';
          return (
            <div key={p.id} className={`eb-plan-it ${st}`}>
              <span className="dot">{st === 'done' ? '✓' : ''}</span>
              <span>{p.label}</span>
            </div>
          );
        })}
      </div>
      <div className="eb-conf">
        <b>Confidence: {confidence.level}.</b> {confidence.rationale}
      </div>
    </>
  );
}

function SourcesTab({ ids }: { ids: string[] }) {
  if (!ids.length) return <div className="eb-src"><div className="eb-empty-note">Source receipts appear here as AlpiGPT retrieves facts, availability and pricing.</div></div>;
  return (
    <div className="eb-src">
      {ids.map((id) => {
        const r = receipts[id];
        return (
          <div className="eb-src-it" key={id}>
            <div className="t"><Ki name="document-chart" size={13} /> {r.label} <span style={{ marginLeft: 'auto' }}><Fresh kind={r.freshness}>{r.checked}</Fresh></span></div>
            <div className="r"><b style={{ color: 'var(--color-text-primary)' }}>{r.confidence} confidence</b> — {r.reason}</div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineTab({ items }: { items: any[] }) {
  if (!items.length) return <div className="eb-tl"><div className="eb-empty-note" style={{ padding: '4px 0' }}>Every actor, action, result and source lands here — the audit trail for this work package.</div></div>;
  return (
    <div className="eb-tl">
      {items.map((e: any, i: number) => (
        <div className="eb-tl-it" key={i}>
          <span className="ts">{e.ts}</span>
          <div>
            <span className={`who ${e.actor}`}>{e.actor}</span>
            <div className="sum">{e.summary}</div>
            {e.reversible && <button className="undo">Undo</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportTab({ escalation, onEscalate }: any) {
  return (
    <div className="eb-esc">
      <div className="eb-esc-note">
        {escalation.blocked
          ? <><b>I'm missing a confirmed supplier rule for this change.</b> I can package the full work package for support so no one has to start from scratch.</>
          : <>Nothing is blocked right now. If something does block, AlpiGPT prepares a complete escalation packet — context, timeline and sources included — instead of a generic "contact support" link.</>}
      </div>
      <div className="eb-esc-packet">
        <div className="t">Escalation packet · preview</div>
        <ul>
          <li>Work package WP-2231 snapshot — intent, party, dates, budget</li>
          <li>Attempted steps & timeline ({escalation.events} events)</li>
          <li>Source receipts — inventory, pricing, policy versions</li>
          <li>Active proposal {escalation.version} + hold AT-88421 state</li>
          <li>Blocking reason: {escalation.blocked ? escalation.reason : 'none — informational'}</li>
        </ul>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button className="eb-btn primary" onClick={onEscalate}><Ki name="group" size={13} /> Escalate with snapshot</button>
        <button className="eb-btn" onClick={() => onEscalate('copy')}>Copy snapshot link</button>
      </div>
    </div>
  );
}
