/* ============================================================
   Alpitour Platform · traveler view (Alpitour.it)
   Migrated from alpitour/platform/traveler.jsx
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { categories, packages, agency, visualMatch } from './traveler-data';
import { bus } from '@/shared/bus';

function Ki({ name, size = 16 }: { name: string; size?: number }) {
  return <svg className="ki" style={size !== 16 ? { width: size, height: size } : undefined}><use href={`#icon-${name}`} /></svg>;
}

function Stars({ n }: { n: number }) {
  return <span className="tv-stars num">★ {n.toFixed(1)}</span>;
}

function THeader({ onAlpi }: { onAlpi: () => void }) {
  return (
    <header className="tv-head" data-screen-label="Alpitour.it header">
      <div className="tv-logo"><span className="mark">A</span><div><b>Alpitour.it</b><i>Alpitour World</i></div></div>
      <nav className="tv-nav">
        <button className="on">Holidays</button><button>Resorts</button><button>Tours</button><button>Last minute</button>
      </nav>
      <button className="tv-alpibtn" onClick={onAlpi}><Ki name="chat-bot" size={14} /> AlpiGPT</button>
    </header>
  );
}

function THome({ onSubmit }: { onSubmit: (boot: any) => void }) {
  const [q, setQ] = useState('');
  const go = (boot: any) => onSubmit(boot);
  return (
    <section className="tv-home" data-screen-label="Search window">
      <span className="glyph"><Ki name="chat-bot" size={22} /></span>
      <h1>Where will this summer take you?</h1>
      <p>One question is enough — AlpiGPT searches, asks what matters, and carries the request to your travel agency.</p>
      <div className="ask-box">
        <input value={q} onChange={(e) => setQ(e.target.value)} autoFocus
          onKeyDown={(e) => e.key === 'Enter' && q.trim() && go({ type: 'text', text: q.trim() })}
          placeholder="Tell me about the holiday…" aria-label="Ask AlpiGPT" />
        <button onClick={() => q.trim() ? go({ type: 'text', text: q.trim() }) : go({ type: 'chip', id: 'inq' })} aria-label="Send"><Ki name="arrow-up-right" size={16} /></button>
      </div>
      <div className="sugg">
        <button className="tv-chip" onClick={() => go({ type: 'chip', id: 'inq' })}>We'd like to go back to Egypt in August…</button>
        <button className="tv-chip" onClick={() => go({ type: 'chip', id: 'q-warm' })}>Where's good for a toddler in August?</button>
        <button className="tv-chip" onClick={() => go({ type: 'chip', id: 'q-incl' })}>What does all inclusive include?</button>
      </div>
    </section>
  );
}

function TTrip({ b, onAlpi }: { b: any; onAlpi: () => void }) {
  const steps = [
    { done: true, t: 'Request sent to Rossi Travel', s: 'Your answers, your profile and a 24h price lock — nothing to repeat' },
    { done: b.accepted, t: `Picked up by ${agency.agent}`, s: b.accepted ? 'Your agent is working on it now' : 'Waiting — usually a few minutes' },
    { done: !!b.hold, t: b.hold ? `Option held · ${b.hold.ref}` : 'Option on the trip', s: b.hold ? `Room and flights locked until ${b.hold.until} · no payment taken` : 'The agency checks real availability' },
    { done: !!b.proposal, t: 'Proposal received', s: b.proposal ? "It's below, with the price verified live" : 'Arrives as a simple page — a 2-minute read' },
  ];
  if (b.v2) steps.push({ done: true, t: `Updated as you asked · ${b.v2.window}`, s: `Same trip, €${b.v2.total.toLocaleString('en-GB')} — €100 less` });
  const totalNow = b.v2 ? b.v2.total : b.hold ? b.hold.total : null;
  const agentFeed = (b.feed || []).filter((f: any) => f.who === 'agent');
  return (
    <section className="tv-trip" data-screen-label="Trip status">
      <div className="th">
        <span className="ic"><Ki name="checkmark-filled" size={15} /></span>
        <div><b>Your trip · Sharm el-Sheikh, August</b><i>Looked after by {agency.agent} · {agency.name}, {agency.city}</i></div>
        {totalNow && <span className="tot num">€{totalNow.toLocaleString('en-GB')} <i>per family, all inclusive</i></span>}
      </div>
      <div className="tl">
        {steps.map((s, i) => (
          <div className={`st ${s.done ? 'done' : ''}`} key={i}>
            <span className="ci">{s.done ? <Ki name="checkmark-filled" size={11} /> : i + 1}</span>
            <div><b>{s.t}</b><i>{s.s}</i></div>
          </div>
        ))}
      </div>
      {agentFeed.length > 0 && (
        <div className="feed" data-screen-label="Live updates from the agency">
          <div className="fl"><span className="dot" aria-hidden="true"></span> Live from {agency.name}</div>
          {agentFeed.slice().reverse().map((f: any, i: number) => (
            <div className={`fr ${i === 0 ? 'new' : ''}`} key={agentFeed.length - i}><span className="tx">{f.t}</span><span className="ts num">{f.ts}</span></div>
          ))}
        </div>
      )}
      <div className="ta">
        {b.proposal && <a className="tv-btn primary" href="Bianchi Proposal - Customer View.html">Read the proposal</a>}
        <button className="tv-btn" onClick={onAlpi}><Ki name="chat-bot" size={13} /> A question? AlpiGPT answers</button>
        <span className="hint">…or call {agency.agent}: {agency.phone}</span>
      </div>
    </section>
  );
}

const AGENTIC_STEPS = [
  'Reading your 7 answers and the photo',
  'Matching the 8 travel profiles → Beach & family',
  'Searching live availability · Sharm el-Sheikh · mid-August · 142 stays → 12 match → 3 fit',
  'Locking your price for 24 hours',
];

function AgenticCard() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((x) => (x >= AGENTIC_STEPS.length ? x : x + 1)), 950);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="card agentic" data-screen-label="Agentic search">
      <div className="ch"><span className="aglyph" aria-hidden="true"></span> Agentic search — live, on your behalf</div>
      {AGENTIC_STEPS.map((s, i) => (
        <div key={i} className={`as ${i < n ? 'done' : i === n ? 'on' : ''}`}>
          <span className="ci">{i < n ? <Ki name="checkmark-filled" size={10} /> : i === n ? <span className="spin" aria-hidden="true"></span> : <i className="num">{i + 1}</i>}</span>
          <span className="tx">{s}</span>
        </div>
      ))}
    </div>
  );
}

const QSEQ = [
  { id: 'who', q: "Lovely — welcome back! Seven quick answers and I'll tailor this properly. First: who's traveling this time?", chips: ['2 adults and our 2-year-old girl', 'Just the two of us'], k: "Who's traveling" },
  { id: 'dates', q: 'Noted. When would you like to go — and how flexible are the dates?', chips: ['Mid-August, flexible ±1 week', '12–19 August, fixed'], k: 'When' },
  { id: 'budget', q: 'Great. What budget do you have in mind, all-in, for the whole family?', chips: ['Around €3,500', 'Up to €4,500'], k: 'Budget' },
  { id: 'board', q: 'Last time you went all inclusive — shall we keep that?', chips: ['All inclusive, absolutely', 'Half board works too'], k: 'Board' },
  { id: 'musts', q: "With a 2-year-old: what absolutely can't be missing?", chips: ["Baby pool and kids' club", 'Family room near the beach'], k: 'Must-haves' },
  { id: 'been', q: "You've been to Sharm before — what stayed with you?", chips: ['Jaz Mirabel in 2024 — the kids\' lagoon', 'The beach at Nabq Bay'], k: 'Your history', photo: true },
  { id: 'from', q: 'Last one: where do you fly from?', chips: ['Rome Fiumicino', 'Milan Malpensa'], k: 'Departure' },
];

function TSheet({ open, onClose, b, inline, boot }: any) {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [typing, setTyping] = useState(false);
  const [awaiting, setAwaiting] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [photoCap, setPhotoCap] = useState('');
  const answers = useRef<any[]>([]);
  const started = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const push = (m: any) => setMsgs((x) => [...x, ...(Array.isArray(m) ? m : [m])]);
  const later = (ms: number, fn: () => void) => { setTyping(true); setTimeout(() => { setTyping(false); fn(); }, ms); };
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, typing, open]);

  useEffect(() => {
    if (!open || started.current) return;
    started.current = true;
    if (b.handoff) {
      push({ kind: 'ai', html: `Welcome back! ${agency.agent} is looking after your trip${b.hold ? ` — option <b>${b.hold.ref}</b> is held until ${b.hold.until}` : ''}. Ask me anything.`, chips: supportChips() });
      return;
    }
    if (boot && boot.type === 'text') {
      push({ kind: 'user', html: boot.text });
      bus.push('feed', { who: 'traveler', t: `Opened a request: "${boot.text}"` });
      later(1200, () => askQuestion(0));
      return;
    }
    if (boot && boot.type === 'chip') {
      push({ kind: 'ai', html: "Hello! I'm <b>AlpiGPT</b>. Tell me about the holiday in your own words — I'll build the request for your travel agency." });
      setTimeout(() => onChip({ id: boot.id }), 250);
      return;
    }
    push({ kind: 'ai', html: "Hello! I'm <b>AlpiGPT</b>. Tell me about the holiday in your own words — I'll build the request for your travel agency.", chips: starterChips() });
  }, [open]);

  function starterChips(except?: string) {
    return [
      { id: 'inq', label: "We'd like to go back to Egypt in August…", kind: 'primary' },
      { id: 'q-warm', label: "Where's good for a toddler in August?" },
      { id: 'q-incl', label: 'What does all inclusive include?' },
    ].filter((c) => c.id !== except);
  }

  function supportChips() {
    const c: any[] = [];
    if (b.hold) c.push({ id: 'q-hold', label: 'When does the hold expire?' });
    if (b.proposal) c.push({ id: 'q-prop', label: 'What does the proposal include?' });
    c.push({ id: 'q-change', label: 'Can we still change the dates?' });
    return c;
  }

  function clearChips() { setMsgs((x) => x.map((m) => ({ ...m, chips: null }))); }

  function askQuestion(idx: number) {
    if (idx >= QSEQ.length) return finishCapture();
    const st = QSEQ[idx];
    push({ kind: 'ai', html: `<span class="qn num">${idx + 1}/7</span> ${st.q}`, chips: st.chips.map((label: string, i: number) => ({ id: `${st.id}:${i}`, label })) });
    setAwaiting(idx);
  }

  function answer(idx: number, text: string) {
    const st = QSEQ[idx];
    clearChips(); setAwaiting(null);
    push({ kind: 'user', html: text });
    answers.current = [...answers.current.filter((a) => a.k !== st.k), { k: st.k, v: text }];
    bus.push('feed', { who: 'traveler', t: `${st.k}: ${text}` });
    later(900, () => {
      if ((st as any).photo) {
        push({ kind: 'ai', html: "Do you have a photo from that trip — or of the holiday you're picturing? Show me and tell me what you like about it: <b>I search by likeness</b>, not just by words." });
        push({ kind: 'photo' });
      } else {
        askQuestion(idx + 1);
      }
    });
  }

  function photoDone(skipped: boolean) {
    clearChips();
    setMsgs((x) => x.map((m) => (m.kind === 'photo' ? { ...m, locked: true } : m)));
    const beenIdx = QSEQ.findIndex((s) => (s as any).photo);
    if (skipped) return later(800, () => askQuestion(beenIdx + 1));
    const cap = photoCap.trim() || 'A pool like this for our little girl — this is what we loved.';
    push({ kind: 'user', html: `${cap} <i class="att">· photo attached</i>` });
    bus.push('feed', { who: 'traveler', t: 'Sent a photo with the request — AlpiGPT is reading the preferences' });
    later(1600, () => {
      push({ kind: 'ai', html: 'From your photo I can read: <b>' + visualMatch.extracted.join('</b> · <b>') + '</b>. You\'re not looking for a room — you\'re looking for this lagoon. Here\'s what genuinely looks like it:' });
      push({ kind: 'vmatch' });
    });
  }

  function confirmVisual() {
    clearChips();
    setMsgs((x) => x.map((m) => (m.kind === 'vmatch' ? { ...m, locked: true } : m)));
    answers.current = [...answers.current, { k: 'From the photo', v: "Shallow kids' lagoon — baby pool comes first" }];
    bus.push('feed', { who: 'traveler', t: "Visual preference confirmed: a kids' lagoon like the photo" });
    const beenIdx = QSEQ.findIndex((s) => (s as any).photo);
    later(900, () => askQuestion(beenIdx + 1));
  }

  function finishCapture() {
    push({ kind: 'ai', html: "I have everything. Here's your request as the agency will receive it — tell me it's right:" });
    push({ kind: 'needs' });
  }

  function confirmNeeds() {
    clearChips();
    setMsgs((x) => x.map((m) => (m.kind === 'needs' ? { ...m, locked: true } : m)));
    push({ kind: 'user', html: 'All correct.' });
    bus.emit('brief', { answers: answers.current, cluster: 'fam', conf: 96 });
    bus.push('feed', { who: 'traveler', t: 'Request confirmed — Beach & family profile (1 of 8)' });
    setTimeout(() => push({ kind: 'agentic' }), 700);
    setTimeout(() => { bus.push('feed', { who: 'traveler', t: 'AlpiGPT agentic search · 142 stays → 12 match → 3 fit the family profile' }); }, 3200);
    setTimeout(() => {
      push({ kind: 'ai', html: 'Done — and from your answers I recognize you right away. This is your travel profile, the same one that personalizes Alpitour.it for you:' });
      push({ kind: 'profile' });
      push({ kind: 'reco' });
    }, 5200);
  }

  function sendToAgency() {
    clearChips();
    setMsgs((x) => x.map((m) => (m.kind === 'reco' ? { ...m, locked: true } : m)));
    push({ kind: 'user', html: 'Yes — send everything to our agency.' });
    later(1400, () => {
      bus.emit('handoff');
      bus.push('feed', { who: 'traveler', t: 'Request sent to Rossi Travel — with a 24h price lock' });
      push({ kind: 'handoff' });
      push({ kind: 'ai', html: `That's everything from my side — <b>your request is no longer with me or Alpitour.it: it's with Rossi Travel now</b>. ${agency.agent} has your answers, your profile, the photo and the locked price, and she takes it from here — checking real availability, holding the trip and sending your proposal. <b>There's nothing you need to do.</b> I'll stay here for questions, and you'll see every step from her in your trip page.`, chips: supportChips() });
    });
  }

  function onChip(c: any) {
    if (c.id === 'inq') {
      clearChips();
      push({ kind: 'user', html: "We'd like to go back to Egypt in August, all inclusive. We had a wonderful time at the Jaz Mirabel." });
      bus.push('feed', { who: 'traveler', t: 'Opened a request: Egypt, August, all inclusive' });
      later(1200, () => askQuestion(0));
      return;
    }
    const m = c.id.match(/^(\w+):(\d+)$/);
    if (m) {
      const idx = QSEQ.findIndex((s) => s.id === m[1]);
      return answer(idx, QSEQ[idx].chips[Number(m[2])]);
    }
    if (c.id === 'q-warm') { clearChips(); push({ kind: 'user', html: "Where's good for a toddler in August?" }); later(1000, () => push({ kind: 'ai', html: "With a 2-year-old in August I'd look at the <b>Red Sea</b> — Sharm el-Sheikh above all: a short direct flight from Rome, shallow sandy lagoons and resorts built around families. Tell me about your trip and I'll put the request together:", chips: starterChips('q-warm') })); return; }
    if (c.id === 'q-incl') { clearChips(); push({ kind: 'user', html: 'What does all inclusive include?' }); later(1000, () => push({ kind: 'ai', html: 'Flights, transfers, the room, all meals and snacks, drinks, and the kids\' clubs — <b>one price, no surprises on site</b>. Extras like private excursions stay optional. Ready when you are:', chips: starterChips('q-incl') })); return; }
    if (c.id === 'q-hold') { clearChips(); push({ kind: 'user', html: 'When does the hold expire?' }); later(900, () => push({ kind: 'ai', html: `Option <b>${b.hold.ref}</b> is held until <b>${b.hold.until}</b> — room and flights locked, no payment taken. To confirm it, just tell ${agency.agent}.`, chips: supportChips() })); return; }
    if (c.id === 'q-prop') { clearChips(); push({ kind: 'user', html: 'What does the proposal include?' }); later(900, () => push({ kind: 'ai', html: 'A direct Neos flight from Rome, a family room all inclusive, family insurance and a transfer with a child seat — with the price verified live. The full page is in your <b>Your trip</b> section.', chips: supportChips() })); return; }
    if (c.id === 'q-change') { clearChips(); push({ kind: 'user', html: 'Can we still change the dates?' }); later(900, () => push({ kind: 'ai', html: `Yes — date changes are free until you confirm. Say it here or tell ${agency.agent}: the proposal updates without starting over.`, chips: supportChips() })); return; }
  }

  function sendDraft() {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    if (awaiting !== null) return answer(awaiting, text);
    if (msgs.length === 1 && !b.handoff) return onChip({ id: 'inq' });
  }

  if (!open) return null;
  const inner = (
    <>
      <div className="sh">
        <span className="ic"><Ki name="chat-bot" size={15} /></span>
        <div><b>AlpiGPT</b><i>the Alpitour.it concierge — your agency stays at the center</i></div>
        {!inline && <button className="x" onClick={onClose} aria-label="Close">✕</button>}
      </div>
      <div className="sb" ref={bodyRef}>
        {msgs.map((m: any, i: number) => {
          if (m.kind === 'user') return <div className="m user" key={i} dangerouslySetInnerHTML={{ __html: m.html }} />;
          if (m.kind === 'agentic') return <AgenticCard key={i} />;
          if (m.kind === 'photo') return (
            <div className="card" key={i} data-screen-label="Multimodal photo moment">
              <div className="ch"><Ki name="lightbulb" size={12} /> Search with a photo</div>
              <image-slot id="tv-mm-photo" shape="rounded" radius="8" placeholder="Drop your photo here" style={{ width: '100%', height: '170px' }}></image-slot>
              {!m.locked && (
                <>
                  <input className="cap" value={photoCap} onChange={(e) => setPhotoCap(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && photoDone(false)}
                    placeholder={'What do you like about this photo? E.g. \u201ca pool like this for our girl\u201d'} aria-label="Photo caption" />
                  <div className="chips" style={{ display: 'flex', gap: 7, marginTop: 3 }}>
                    <button className="tv-btn primary sm" onClick={() => photoDone(false)}>Send to AlpiGPT</button>
                    <button className="tv-btn sm" onClick={() => photoDone(true)}>Not now</button>
                  </div>
                </>
              )}
            </div>
          );
          if (m.kind === 'vmatch') return (
            <div className="card" key={i} data-screen-label="Visual match results">
              <div className="ch"><Ki name="recommend" size={12} /> These look like your photo</div>
              <div className="vrow">
                {visualMatch.results.map((r) => {
                  const p = packages.find((x) => x.id === r.pkg);
                  if (!p) return null;
                  return (
                    <div className="vm" key={r.pkg}>
                      <div className="vph"><image-slot id={`tv-vm-${r.pkg}`} shape="rounded" radius="8" placeholder={p.name}></image-slot><span className="match num">{r.match}%</span></div>
                      <b>{p.name}</b>
                      <i>{r.why}</i>
                      <span className="vpr num">from €{p.price.toLocaleString('en-GB')} · {p.brand}</span>
                    </div>
                  );
                })}
              </div>
              {!m.locked && <button className="tv-btn primary sm" onClick={confirmVisual}>Perfect — search like this</button>}
            </div>
          );
          if (m.kind === 'needs') return (
            <div className="card" key={i} data-screen-label="Needs capture">
              <div className="ch"><Ki name="filter" size={12} /> Your request, structured</div>
              <div className="nr"><i>Destination</i><b>Sharm el-Sheikh, Egypt</b></div>
              {answers.current.map((n) => <div className="nr" key={n.k}><i>{n.k}</i><b>{n.v}</b></div>)}
              {!m.locked && <button className="tv-btn primary sm" onClick={confirmNeeds}>All correct</button>}
            </div>
          );
          if (m.kind === 'profile') return (
            <div className="card" key={i} data-screen-label="Travel profile cluster">
              <div className="ch"><Ki name="group" size={12} /> Your travel profile · 1 of 8</div>
              <div className="pgrid">
                {categories.map((c) => (
                  <span key={c.id} className={`pc ${c.id === 'fam' ? 'hit' : ''}`}>{c.id === 'fam' ? <><Ki name="checkmark-filled" size={10} /> {c.label}</> : c.label}</span>
                ))}
              </div>
              <div className="rs"><b>Beach & family</b> — seaside holidays built around little ones. Looked after by <b>Bravo</b>, the Alpitour world for families: it's the same profile your agency receives with the request.</div>
            </div>
          );
          if (m.kind === 'reco') return (
            <div className="card" key={i} data-screen-label="Recommendation confirmation">
              <div className="ch"><Ki name="recommend" size={12} /> Our recommendation</div>
              <div className="rr"><b>Jaz Mirabel Beach</b> — your favorite, with the price locked for 24h</div>
              <div className="rs">If it's full on your dates, {agency.agent} already has two family alternatives on the same beach — using your criteria, not starting over.</div>
              {!m.locked && <button className="tv-btn primary sm" onClick={sendToAgency}>Confirm — send to Rossi Travel</button>}
            </div>
          );
          if (m.kind === 'handoff') return (
            <div className="card hand" key={i} data-screen-label="Handoff">
              <div className="ch"><Ki name="arrow-up-right" size={12} /> Sent to {agency.name} · {agency.city}</div>
              <div className="rs">Structured request · Beach & family profile · photo · 24h price lock · your Jaz Mirabel history. <b>You won't repeat a thing.</b></div>
            </div>
          );
          return (
            <div className="m ai" key={i}>
              <div dangerouslySetInnerHTML={{ __html: m.html }} />
              {m.chips && <div className="chips">{m.chips.map((c: any) => <button key={c.id} className={`tv-btn sm ${c.kind === 'primary' ? 'primary' : ''}`} onClick={() => onChip(c)}>{c.label}</button>)}</div>}
            </div>
          );
        })}
        {typing && <div className="m ai typing"><span></span><span></span><span></span></div>}
      </div>
      <div className="sc">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendDraft()}
          placeholder={awaiting !== null ? '…or answer in your own words' : 'Write to AlpiGPT…'} aria-label="Write to AlpiGPT" />
        <button onClick={sendDraft} aria-label="Send"><Ki name="arrow-up-right" size={14} /></button>
      </div>
    </>
  );
  if (inline) return <section className="tv-sheet inline" data-screen-label="AlpiGPT chat" aria-label="AlpiGPT">{inner}</section>;
  return (
    <div className="tv-scrim" onClick={onClose}>
      <aside className="tv-sheet" onClick={(e) => e.stopPropagation()} data-screen-label="AlpiGPT sheet" aria-label="AlpiGPT">{inner}</aside>
    </div>
  );
}

export function TravelerApp() {
  const [b, setB] = useState<any>(bus ? { ...bus.state } : {});
  const [view, setView] = useState(bus && bus.state.handoff ? 'chat' : 'home');
  const [boot, setBoot] = useState<any>(null);
  useEffect(() => bus.on((s) => setB({ ...s })), []);
  const startChat = (bt: any) => { setBoot(bt); setView('chat'); };
  return (
    <div className="tv-app">
      <THeader onAlpi={() => setView('chat')} />
      {view === 'home' ? (
        <>
          <THome onSubmit={startChat} />
          <footer className="tv-foot">Alpitour World — Alpitour · Francorosso · Bravo · Eden Viaggi · Turisanda. Requests travel to your trusted agency.</footer>
        </>
      ) : (
        <div className={`tv-chatwrap ${b.handoff ? 'with-trip' : ''}`} data-screen-label="Traveler chat page">
          {b.handoff && <TTrip b={b} onAlpi={() => {}} />}
          <TSheet open={true} inline={true} boot={boot} b={b} />
        </div>
      )}
    </div>
  );
}
