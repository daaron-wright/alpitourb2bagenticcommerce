/* ============================================================
   EasyBook Next — B2B Storefront · app shell + deterministic flow
   Migrated from alpitour/storefront/app.jsx
   browse → parsing → blockers → searching → ranked → drafting →
   proposal → holding → held → repricing → v2 → completed
   ============================================================ */
import React, { useState, useRef, useEffect } from 'react';
import { fmtEUR, products, SHELVES, STAGE_LABEL, blockers as BLOCKERS, tredi } from './data';
import { bus } from '@/shared/bus';
import { DemoBus } from '@/alpitour/demo/beats';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } from './TweaksPanel';
import { Ki, Inf, Stars, Badge, Allot, Fresh, SrcChip, SourceCard, Toast, AiRender } from './Primitives';
import {
  ProductCard, Hero, DeskStrip, BrandBand, ShelfRow, ChipsBar,
  SoldOutBanner, CompareTray, CompareOverlay, DeskBoard,
} from './Shelf';
import { Rail } from './Rail';
import { Drawer, PackagePanel, HoldReceipt, DeflectionCard } from './Detail';
import { PulseBand, FitMatrix, PriceCalendarChart, DeltaWaterfall, MilestoneBars } from './Charts';
import { JourneyGraph } from './Journey';
import { AgentStatusBar, ToolCallCard, HandoffCard, OvernightPanel } from './Agentic';
import {
  JourneyStrip, RequestPick, ClusterMatch, ClusterProgram,
  MapPanel, ChoicesTimeline, BrandPick, LiveFeed, NextBestAction,
  MdPreview, TurisandaPanel, JourneyBoard,
} from './Tredi';

const TWEAK_DEFAULTS = {
  density: 'comfortable',
  customerSafe: false,
  showPhotos: true,
  liveAuto: true,
};

let tick = 0;
const stamp = () => {
  tick++;
  const m = 10 + Math.floor(tick / 9);
  return `${String(m).padStart(2, '0')}:${String(12 + (tick * 7) % 48).padStart(2, '0')}`;
};

export const App: React.FC = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stage, setStage] = useState('browse');
  const [railOpen, setRailOpen] = useState(true);
  const [tab, setTab] = useState('chat');
  const [msgs, setMsgs] = useState<any[]>(() => [
    { role: 'agent', skill: 'Tredi · supervisor', html: "Buongiorno Giulia. I'm <b>Tredi</b> — the intelligent supervisor inside AlpiConcierge. I sit between you and the specialist experts — <b>Esperto Hotel</b>, <b>Esperto Tour</b> and <b>Esperto Destinazioni</b> — coordinate them, and present you with the most relevant actions. I see you've just completed a call with the <b>Carter family</b> — would you like to review the transcript? If so, <b>attach the inquiry</b> and I'll begin." },
  ]);
  const [inquiryShown, setInquiryShown] = useState(false);
  const [working, setWorking] = useState<string | null>(null);
  const [homeView, setHomeView] = useState(false);
  const [quick, setQuick] = useState<any[]>([{ id: 'attach', label: 'Attach the inquiry', kind: 'primary' }]);
  const [blk, setBlk] = useState<any[]>(BLOCKERS);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [cmpOpen, setCmpOpen] = useState(false);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [selAddons, setSelAddons] = useState(['insurance', 'transfer']);
  const [selected, setSelected] = useState<string | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [activeVer, setActiveVer] = useState<string | null>(null);
  const [holdRef, setHoldRef] = useState<string | null>(null);
  const [approval, setApproval] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [srcIds, setSrcIds] = useState<string[]>([]);
  const [toast, setToast] = useState<any>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [request, setRequest] = useState<string | null>(null);
  const [choices, setChoices] = useState<any[]>([]);
  const [busState, setBusState] = useState<any>(bus ? { ...bus.state } : null);
  const [live, setLive] = useState<any[]>([]);
  const [liveSticky, setLiveSticky] = useState<any>(null);
  const [turiPrice, setTuriPrice] = useState(tredi.japan.basePrice);
  const [turiRepriced, setTuriRepriced] = useState(false);
  const [mdOpen, setMdOpen] = useState(false);
  const [mdSent, setMdSent] = useState(false);
  const [mdGen, setMdGen] = useState(false);

  const liveStarted = useRef(false);
  const liveIdx = useRef(0);
  const liveT = useRef<any>(null);
  const liveAutoRef = useRef(true);
  const mdGenerated = useRef(false);
  const toastT = useRef<any>(null);
  liveAutoRef.current = t.liveAuto !== false;
  const pendingApprove = useRef<(() => void) | null>(null);
  const shelfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bus) return bus.on((s: any) => setBusState({ ...s }));
  }, []);

  useEffect(() => {
    if (DemoBus) DemoBus.set({ stage, approval: !!approval, request: !!request });
  }, [stage, approval, request]);

  const awaitingInquiry = !!bus && busState && !busState.handoff;
  const pbFeed = (t: string) => bus && bus.push('feed', { who: 'agent', t });

  const showToast = (x: any) => {
    setToast(x);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 3000);
  };
  const showDelta = (x: string) => {
    setToast({ delta: true, text: x });
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 4200);
  };
  const pushAgent = (html: string, skill?: string, sticky?: any) =>
    setMsgs((m) => [...m, { role: 'agent', html, skill, sticky }]);
  const pushNba = (n: any) => setMsgs((m) => [...m, { role: 'nba', n }]);
  const pushUser = (html: string) => setMsgs((m) => [...m, { role: 'user', html }]);
  const pushTool = (t: any) => setMsgs((m) => [...m, { role: 'tool', t }]);
  const logEv = (actor: string, summary: string) =>
    setTimeline((x) => [...x, { ts: stamp(), actor, summary }]);
  const logChoice = (c: any) => setChoices((x) => [...x, { ...c, ts: stamp() }]);
  const addSrc = (ids: string[]) =>
    setSrcIds((s) => [...s, ...ids.filter((i) => !s.includes(i))]);
  const scrollTop = () => { if (shelfRef.current) shelfRef.current.scrollTop = 0; };

  function orchestrate({ user, status, delay = 1100, then }: { user?: string; status?: string; delay?: number; then: () => void }) {
    if (user) pushUser(user);
    setQuick([]); setRailOpen(true); setTab('chat');
    setWorking(status || 'AlpiConcierge is working…');
    setTimeout(() => { setWorking(null); then(); }, delay);
  }

  function startLive(id: string) {
    if (liveStarted.current) return;
    liveStarted.current = true;
    const evs = (tredi.liveEvents as any)[id] || tredi.liveEvents.bravo;
    const fire = () => {
      if (liveIdx.current >= evs.length) return;
      if (!liveAutoRef.current) { liveT.current = setTimeout(fire, 4000); return; }
      const ev = evs[liveIdx.current++];
      setLive((l) => [{ ...ev, ts: 'now' }, ...l.map((x: any, i: number) => ({ ...x, ts: `${(i + 1) * 2}m` }))].slice(0, 4));
      logEv('api', `${ev.t}: ${ev.s}`);
      if (liveIdx.current === 1) setLiveSticky(tredi.stickies.s3);
      if (ev.priceDelta) { setTuriPrice((p: number) => p + ev.priceDelta); setTuriRepriced(true); showDelta(ev.delta); }
      liveT.current = setTimeout(fire, 14000);
    };
    liveT.current = setTimeout(fire, 7000);
  }

  function workRequest(id: string) {
    if (request) return;
    if (id === 'bianchi' && awaitingInquiry) return showToast('The Carter inquiry is still in progress on Alpitour.it — switch to the Traveler view to send it.');
    const rq = tredi.requests.find((r: any) => r.id === id);
    const cl = tredi.clusters.find((c: any) => c.id === rq.cluster);
    setRequest(id);
    setBrand(cl.brand);
    startLive(cl.brand);
    pushUser(`Work the ${rq.who} request.`);
    logChoice({ label: `Worked the ${rq.who} request`, s: rq.meta, icon: 'group' });
    setQuick([]); setRailOpen(true); setTab('chat');
    setWorking('Reading the customer\'s words — matching against the 8 personalization clusters…');
    setTimeout(() => {
      setWorking(null);
      pushTool({ tool: 'cluster.match', title: 'Semantic cluster match', icon: 'group', status: 'ok', meta: 'personalization engine · 8 clusters · read-only', args: { signals: rq.signals.join(' · '), corpus: 'B2C personalization program · alpitour.it' }, result: `Cluster ${cl.n}/8 · ${cl.name} → ${cl.brandName} · ${rq.conf}% — the brand is dictated by intent, never picked by hand.` });
      setMsgs((m) => [...m, { role: 'cluster', c: rq }]);
      logEv('agent', `Semantic match: cluster ${cl.n}/8 ${cl.name} → ${cl.brandName} · ${rq.conf}%`);
      logChoice({ label: `Cluster ${cl.n}/8 — ${cl.name} → ${cl.brandName}`, s: 'matched from the customer\'s words · no manual brand pick', icon: 'recommend' });
      if (cl.brand === 'bravo') {
        pushAgent('<b>Bravo — family experience</b>, dictated by the Carters\' own words: a 2-year-old, food, history, slow mornings. Same cluster their web visit personalizes on. The consumer concierge already sent their full context — accepting the handoff now.', 'Brand Curator', tredi.stickies.s2);
        setBrandFilter('bravo');
        setTimeout(acceptHandoff, 1100);
      } else {
        pushAgent('<b>Turisanda — itinerari d\'autore</b>, dictated by the Ferrantes\' own words: ryokan, omakase, \'itinerario d\'autore\'. Curating the shelf in the brand\'s voice now.', 'Brand Curator', tredi.stickies.s2);
        setBrandFilter('turisanda');
        setTimeout(curateTurisanda, 900);
      }
    }, 1500);
  }

  function curateTurisanda() {
    orchestrate({
      status: 'Curating the Turisanda shelf — itinerari d\'autore, live Neos/JAL fares…', delay: 1500,
      then: () => {
        setStage('turisanda'); scrollTop();
        addSrc(['cat2', 'prc1', 'inv1']);
        logEv('agent', 'Brand curation: Turisanda — itinerari d\'autore, sharp luxury voice');
        logEv('api', 'Turisanda catalogue 2026/3 + live Neos/JAL fares loaded · synced overnight');
        pushAgent('<b>Giappone d\'Autore</b> is on the shelf — and on the map: Tokyo, Hakone, Kyoto, Nara, Osaka. 10 nights, ryokan with private onsen, omakase booked. Sharp copy, no filler — the brand\'s voice. Live quote: <b>€9,840</b> per couple, fares watched in real time.', 'Brand Curator');
        pushNba({
          title: 'Write it up — generate proposal.md',
          reason: 'Itinerary verified against live fares and the 2026/3 catalogue. The strongest next move is the written proposal — the Ferrantes asked to see it on paper.',
          includes: tredi.includes.turisanda,
          cta: { id: 'genmd', label: 'Generate proposal via .md' },
        });
        setQuick([{ id: 'genmd', label: 'Generate proposal via .md', kind: 'primary' }]);
      },
    });
  }

  function pickBrand(id: string) {
    if (brand) return;
    setBrand(id);
    startLive(id);
    if (id === 'bravo') {
      pushUser('Bravo — the Carter family, 10 days around Italy in August.');
      pushAgent('<b>Bravo — family experience.</b> Curating for the Carters: family rooms, air-con and short transfers weighted first, Rome–Florence–Amalfi priced as one family bundle. The consumer concierge already sent their full context — accepting the handoff now.', 'Brand Curator', tredi.stickies.s2);
      setBrandFilter('bravo');
      setTimeout(acceptHandoff, 1100);
    } else {
      pushUser('Turisanda — the Ferrantes, Japan in October.');
      orchestrate({
        status: 'Curating the Turisanda shelf — itinerari d\'autore, live Neos/JAL fares…', delay: 1500,
        then: () => {
          setStage('turisanda'); scrollTop();
          setBrandFilter('turisanda');
          addSrc(['cat2', 'prc1', 'inv1']);
          logEv('agent', 'Brand curation: Turisanda — itinerari d\'autore, sharp luxury voice');
          logEv('api', 'Turisanda catalogue 2026/3 + live Neos/JAL fares loaded · synced overnight');
          pushAgent('<b>Turisanda — itinerari d\'autore.</b> I\'ve curated <b>Giappone d\'Autore</b> for the Ferrantes on the shelf: Tokyo, Hakone, Kyoto, Osaka — 10 nights, ryokan with private onsen, omakase booked. Sharp copy, no filler — the brand\'s voice. Live quote: <b>€9,840</b> per couple, fares watched in real time.', 'Brand Curator', tredi.stickies.s2);
          pushNba({
            title: 'Write it up — generate proposal.md',
            reason: 'Itinerary verified against live fares and the 2026/3 catalogue. The strongest next move is the written proposal — the Ferrantes asked to see it on paper.',
            includes: tredi.includes.turisanda,
            cta: { id: 'genmd', label: 'Generate proposal via .md' },
          });
          setQuick([{ id: 'genmd', label: 'Generate proposal via .md', kind: 'primary' }]);
        },
      });
    }
  }

  function genMd() {
    if (mdGenerated.current) return setMdOpen(true);
    mdGenerated.current = true;
    const turi = brand === 'turisanda';
    orchestrate({
      user: 'Write the proposal as a document (.md).', status: 'Writing proposal.md — itinerary, quote, conditions…', delay: 1400,
      then: () => {
        pushTool({ tool: 'proposal.write', title: 'Write proposal document', icon: 'document-chart', status: 'ok', meta: 'markdown writer · 1.2s · read-only', args: { format: '.md', language: 'en', file: turi ? 'proposal-ferrante.md' : 'proposal-carter.md' }, result: 'Document written from live facts — rendered preview opened. The quote stays wired to the live price watch.' });
        logEv('agent', 'proposal.md written — rendered preview ready to send');
        pushAgent(`Here it is — <b>${turi ? 'proposal-ferrante.md' : 'proposal-carter.md'}</b>, rendered for a quick skim. The quota in the doc is wired to the live price watch, so it never goes stale. Send it, or keep working the package.`, 'Markdown Writer', tredi.stickies.s4);
        logChoice({ label: `Generated ${turi ? 'proposal-ferrante.md' : 'proposal-carter.md'}`, s: 'written proposal · quota wired to live price watch', icon: 'document-chart' });
        setMdGen(true);
        setMdOpen(true);
        setQuick([{ id: 'sendmd', label: 'Send to Agent', kind: 'primary' }, { id: 'openmd', label: 'Reopen preview' }]);
      },
    });
  }

  function sendMd() {
    setMdOpen(false);
    setMdSent(true);
    const turi = brand === 'turisanda';
    logEv('user', 'Sent proposal.md to the customer');
    logChoice({ label: 'Sent proposal.md to the customer', s: turi ? 'Coppia Ferrante · rendered page, live quote' : 'The Carter family · rendered page with hold reference', icon: 'arrow-up-right' });
    if (!turi) { bus && bus.emit('proposal', { file: 'proposal-carter.md' }); pbFeed('Proposal sent — it\'s on your trip page'); }
    pushHandoff({
      dir: 'out', from: `${turi ? 'Super TREDI' : 'AlpiConcierge'} · Rossi Travel`, to: turi ? 'Coppia Ferrante · proposal page' : 'The Carter family · proposal page',
      meta: 'proposal.dispatched · .md',
      payload: ['Rendered proposal doc', 'Live-verified quote', 'Price-watch subscription', "Giulia's contact details"],
      note: 'The customer reads a clean rendered page — the .md stays the single source, repriced in real time.',
    });
    showDelta(turi ? 'proposal-ferrante.md sent · the Ferrantes see the rendered itinerary with a live quote' : 'proposal-carter.md sent · the Carters see the rendered package with the hold reference');
    if (turi) setQuick([{ id: 'openmd', label: 'Reopen proposal.md' }, { id: 'restart', label: 'Back to the storefront' }]);
    else setQuick([{ id: 'openmd', label: 'Reopen proposal.md' }]);
  }

  const pushHandoff = (h: any) => setMsgs((m) => [...m, { role: 'handoff', h }]);

  function acceptHandoff() {
    if (stage !== 'browse') return;
    if (awaitingInquiry) return showToast("Nothing on the desk yet — the Carter inquiry is still open on Alpitour.it. Switch to the Traveler view.");
    bus && bus.emit('accepted');
    pbFeed('Giulia has picked up your request');
    if (!brand) { setBrand('bravo'); startLive('bravo'); }
    tick = 0; setStage('parsing'); scrollTop();
    pushHandoff({
      dir: 'in', from: 'AlpiConcierge · consumer concierge', to: 'EasyBook agent · Rossi Travel',
      meta: 'handoff.received · wp-2231',
      payload: ['Structured trip context · 6 fields', "Customer's own words", 'Detected signals · family rooms, short transfers', 'Consumer hold · 24h'],
      note: "The customer spoke to AlpiConcierge on Alpitour.it. Their concierge agent dispatched the full TravelWorkContext — nothing needs re-typing.",
    });
    orchestrate({
      status: 'Validating the handed-off context against live systems…', delay: 1300,
      then: () => {
        setStage('blockers');
        logEv('agent', 'Handoff received from consumer concierge · TravelWorkContext wp-2231 attached');
        logEv('agent', 'Context validated → 6 structured requirements, 2 blocking questions');
        pushAgent('Handoff accepted — the Carter context arrived structured, so there\'s nothing to re-ask except <b>the two things AlpiConcierge couldn\'t know</b>: arrival gateway into Italy, and date flexibility if a hotel is unavailable. I\'ve pre-filled the likely answers on the amber chips.', 'Tredi · supervisor');
        setQuick([{ id: 'fixall', label: 'Confirm: Rome Fiumicino · ±1 week flexible', kind: 'primary' }]);
      },
    });
  }

  function onParse(text: string) {
    if (stage !== 'browse') return showToast('This guided demo runs one brief at a time — restart to try another.');
    if (!brand) { setBrand('bravo'); startLive('bravo'); }
    tick = 0; setStage('parsing'); scrollTop();
    orchestrate({
      user: text, status: 'Reading the brief and structuring requirements…', delay: 1200,
      then: () => {
        setStage('blockers');
        logEv('user', 'Pasted the Carter brief into the storefront');
        logEv('agent', 'Brief parsed → 6 structured requirements, 2 blocking questions');
        pushAgent("I've structured the Carter brief into the requirement chips above the shelf. <b>Two questions still block the search</b>: arrival gateway into Italy, and date flexibility if a hotel is unavailable. Tap the amber chips — I've pre-filled the most likely answers.", 'Requirement Extractor');
        setQuick([{ id: 'fixall', label: 'Confirm: Rome Fiumicino · ±1 week flexible', kind: 'primary' }]);
      },
    });
  }

  function fixBlocker(b: any) {
    pushUser(`${b.q.replace('?', '')}: ${b.fix}.`);
    logEv('user', `Resolved blocker: ${b.q} → ${b.fix}`);
    logChoice({ label: `Confirmed: ${b.fix}`, icon: 'checkmark-filled' });
    const rest = blk.filter((x: any) => x.id !== b.id);
    setBlk(rest);
    if (rest.length === 0) runSearch();
  }

  function fixAll() {
    pushUser('Rome Fiumicino, and ±1 week is fine if the hotel is full.');
    logEv('user', 'Resolved blockers: Rome FCO arrival · ±1 week flexibility');
    logChoice({ label: 'Confirmed: Rome Fiumicino · ±1 week flexible', s: "the two questions AlpiConcierge couldn't answer", icon: 'checkmark-filled' });
    setBlk([]);
    runSearch();
  }

  function runSearch() {
    setStage('searching');
    orchestrate({
      status: 'Pulling hotel facts, checking live availability and Gold-tier pricing…', delay: 1500,
      then: () => {
        setStage('ranked'); scrollTop();
        pbFeed('Availability checked live — the Positano hotel is full on your dates; 3 family alternatives found');
        addSrc(['inv1', 'prc1', 'pm1', 'cat1']);
        logEv('api', 'Product master: Positano Signature facts verified · updated 12 May');
        logEv('api', 'Inventory API: Positano Signature sold out 12–22 Aug · live, 43s ago');
        logEv('agent', 'Sold-out recovery: 3 alternatives ranked — Family Select 94%, Premium 91%, Smart Value 88%');
        pushTool({ tool: 'hotel.search', title: 'Esperto Hotel · live availability', icon: 'network', status: 'err', meta: 'Esperto Hotel · allotment API · 480ms', args: { hotel: 'POSITANO_SIGNATURE', window: '2026-08-12 → 2026-08-22', party: '2A+1C' }, result: '0 allotment on the requested window — sold-out branch triggered.' });
        pushTool({ tool: 'destinazioni.notes', title: 'Esperto Destinazioni · country & culture notes', icon: 'document-chart', status: 'ok', meta: 'Esperto Destinazioni · travel notes · read-only', args: { country: 'Italy', focus: 'family · food · history · Amalfi in August' }, result: 'Mid-August is Ferragosto — book ahead, allotments burn fast. Afternoons are hot for a toddler: favour slow mornings and short city-to-city transfers. Folded into the ranking.' });
        pushTool({ tool: 'tour.compile', title: 'Esperto Tour · compile alternatives', icon: 'recommend', status: 'ok', meta: 'Esperto Tour · 3 candidates · read-only', args: { keep: 'three cities, budget_cap', weight_first: 'family_rooms, short_transfers' }, result: 'Family Select 94% · Premium (Ravello) 91% · Smart Value (Sorrento) 88% — packages compiled and ranked; see the fit matrix on the shelf.' });
        pushAgent('<b>The Positano Signature is sold out for those dates</b> — <b>Esperto Hotel</b> confirmed it on live inventory, not the catalogue. <b>Esperto Destinazioni</b> flagged the Ferragosto peak and the toddler-heat note, and <b>Esperto Tour</b> compiled the alternatives keeping every hard constraint: <b>Roma · Firenze · Amalfi — Family Select is the closest match</b> (family rooms + short transfers, €250 under cap). The Ravello Premium is stronger but €180 over budget — flagged on the card and in the fit matrix.', 'Tredi · supervisor');
        setQuick([{ id: 'opencoral', label: 'Open Family Select details', kind: 'primary' }, { id: 'cmp3', label: 'Compare all three' }]);
      },
    });
  }

  function selectOffer(id: string) {
    const p = (products as any)[id];
    setSelected(id); setDrawerId(null); setCmpOpen(false); setCompareIds([]);
    if (id === 'coral') pbFeed('Giulia chose the Amalfi Family Select — family rooms and short transfers confirmed');
    setStage('drafting');
    logChoice({ label: `Selected ${p.name} for the package`, s: 'sold-out recovery · best match 94%', icon: 'recommend' });
    orchestrate({
      user: `Select ${p.name} — draft the proposal.`, status: 'Composing the package and drafting proposal V1…', delay: 1300,
      then: () => {
        setStage('proposal'); scrollTop();
        addSrc(['pol1']);
        const total = p.price + 215, comm = p.commission + 26;
        const v1 = { versionId: 'V1', status: 'draft', offerId: id, dates: '12–22 Aug', hotelFlight: p.price, total, commission: comm, delta: null };
        setVersions([v1]); setActiveVer('V1');
        logEv('agent', `Proposal V1 composed · ${fmtEUR(total)} incl. insurance + private transfers · policy validated`);
        pushAgent(`Proposal <b>V1 is drafted</b> by <b>Esperto Tour</b> — ${p.name} with insurance and private transfers: <b>${fmtEUR(total)}</b>, your commission <b class="num">${fmtEUR(comm)}</b>. Placing a hold locks the allotment — <b>destructive tools always gate</b>, so it needs your approval.`, 'Esperto Tour');
        setApproval({
          actionType: 'place hold',
          tool: { tool: 'booking.hold', title: 'Place hold', icon: 'anomaly', meta: 'booking platform · write · reversible', gate: 'destructive · always gates', args: { offer: p.name.toUpperCase().replace(/ /g, '_'), version: 'V1', total, expires: 'tomorrow 18:00' }, result: 'Locks the allotment under proposal V1. You can release the hold anytime — the action is reversible.' },
        });
        pendingApprove.current = confirmHold;
      },
    });
  }

  function confirmHold() {
    setApproval(null);
    orchestrate({
      user: 'Approve — place the hold.', status: 'Placing hold via the booking platform…', delay: 1100,
      then: () => {
        setStage('held'); setHoldRef('AT-88421');
        bus && bus.emit('hold', { ref: 'AT-88421', until: 'tomorrow 6:00 PM', total: 7365 });
        pbFeed('Hold AT-88421 placed — room and flights locked until tomorrow 6:00 PM');
        logChoice({ label: 'Approved hold AT-88421', s: 'allotment locked until tomorrow 18:00 · reversible', icon: 'checkmark-filled' });
        setVersions((v) => v.map((x: any) => x.versionId === 'V1' ? { ...x, status: 'held' } : x));
        logEv('api', 'Hold AT-88421 confirmed · expires tomorrow 18:00');
        logEv('agent', 'Hold receipt issued · proposal V1 → held');
        pushTool({ tool: 'booking.hold', title: 'Place hold', icon: 'anomaly', status: 'ok', meta: 'booking platform · 920ms · human-approved', args: { version: 'V1', expires: 'tomorrow 18:00' }, result: 'Hold AT-88421 confirmed — allotment locked until tomorrow 18:00.' });
        showDelta("hold AT-88421 placed · the customer's page now says 'reserved until tomorrow 18:00'");
        pushAgent('<b>Hold placed.</b> The option is locked under proposal <b>V1</b> until 18:00 tomorrow — reference <b>AT-88421</b>. Share it with the family, or service changes right here on the shelf.', 'Hold/Servicing Executor');
        pushNba({
          title: 'Send it as a written doc — proposal.md',
          reason: 'The hold is confirmed and every fact is live-verified. A written proposal closes faster than a link — and it stays repriced in real time.',
          includes: tredi.includes.bravo,
          cta: { id: 'genmd', label: 'Generate proposal via .md' },
        });
        setQuick([]);
      },
    });
  }

  function requestChange() {
    setStage('repricing');
    orchestrate({
      user: 'The Carters ask: can we start three days later — 15–25 August instead?',
      status: 'Re-checking availability and repricing 15–25 August across all three cities…', delay: 1500,
      then: () => {
        setStage('v2'); scrollTop();
        const p = (products as any)[selected!];
        const v2 = { versionId: 'V2', status: 'draft', offerId: selected, dates: '15–25 Aug', hotelFlight: p.price - 90, total: p.price + 125, commission: p.commission + 26, delta: { vs: 'V1', amount: -90, reason: 'the later week eases past the Ferragosto peak — a small saving; same three hotels, family rooms and air-con held' } };
        setVersions((v) => [...v, v2]); setActiveVer('V2');
        logEv('api', 'Availability + pricing re-checked for 15–25 Aug · all three hotels reconfirmed · −€90');
        logEv('agent', 'V2 drafted with diff · V1 kept immutable');
        pushTool({ tool: 'pricing.reprice', title: 'Reprice date change', icon: 'analytics', status: 'ok', meta: 'pricing API · 640ms · read-only', args: { version: 'V1', new_window: '2026-08-15 → 2026-08-25' }, result: '−€90 — the later week eases past Ferragosto. Same rooms, same itinerary, all three hotels reconfirmed.' });
        pushAgent('<b>Your change is ready.</b> Version <b>V2</b> moves the trip to <b>15–25 August</b> — all three hotels reconfirmed, family rooms and air-con held. It\'s <b>€90 lower</b> as the later week eases past the Ferragosto peak; nothing else changes. Committing updates the hold — destructive, so it gates on you. V1 stays revertible.', 'Modification/Reprice');
        setApproval({
          actionType: 'commit change to V2',
          tool: { tool: 'booking.amend', title: 'Commit change to V2', icon: 'anomaly', meta: 'booking platform · write · reversible', gate: 'destructive · always gates', args: { hold: 'AT-88421', from: 'V1 · 12–22 Aug', to: 'V2 · 15–25 Aug', delta: -90 }, result: 'Updates hold AT-88421 to V2. V1 stays in the version history.' },
        });
        pendingApprove.current = approveV2;
      },
    });
  }

  function approveV2() {
    setApproval(null);
    orchestrate({
      user: 'Approve V2 and update the hold.', status: 'Committing V2 and updating the hold…', delay: 1000,
      then: () => {
        setStage('v2'); scrollTop();
        logChoice({ label: 'Approved change to V2 · 15–25 Aug', s: '−€90 · V1 revertible', icon: 'checkmark-filled' });
        bus && bus.emit('v2', { total: 7275, window: '15–25 August' });
        pbFeed('Dates updated as you asked — 15–25 August, all three hotels reconfirmed');
        setVersions((v) => v.map((x: any) => x.versionId === 'V2' ? { ...x, status: 'held' } : { ...x, status: 'superseded' }));
        logEv('api', 'Hold AT-88421 updated to V2 · V1 superseded (revertible)');
        logEv('agent', 'Hold receipt reissued · proposal V2 → held');
        pushTool({ tool: 'booking.amend', title: 'Commit change to V2', icon: 'anomaly', status: 'ok', meta: 'booking platform · 840ms · human-approved', args: { hold: 'AT-88421', to: 'V2 · 15–25 Aug' }, result: 'Hold updated to V2 · V1 superseded and revertible.' });
        showDelta("proposal → V2 · the family's page updates to 15–25 August");
        pushAgent('Done — the hold now covers <b>15–25 August</b>. The trip\'s locked in. If anything shifts once they\'re travelling, just message me here and I\'ll handle it live.', 'Tredi · supervisor');
        setQuick([{ id: 'share', label: 'Share proposal V2', kind: 'primary' }]);
      },
    });
  }

  function handleDisruption() {
    setStage('repricing');
    pushTool({ tool: 'disruption.detect', title: 'Mid-trip disruption detected', icon: 'warning-alt', status: 'err', meta: 'disruption watch · live · day 6', args: { event: 'SS163 Amalfi coast road closed (rockfall)', leg: 'Florence → Amalfi Coast transfer', date: '2026-08-20' }, result: "A rockfall closed the Amalfi coast road on the Carters' transfer day — they're already travelling. Their Florence → Amalfi transfer and check-in are at risk." });
    logEv('api', 'Disruption signal · SS163 Amalfi coast road closed · transfer day · live');
    orchestrate({
      status: 'Disruption caught mid-trip — re-routing the transfer and protecting the Amalfi nights…', delay: 1700,
      then: () => {
        setStage('completed'); scrollTop();
        const p = (products as any)[selected!];
        const v3 = { versionId: 'V3', status: 'draft', offerId: selected, dates: '15–25 Aug', hotelFlight: p.price - 90, total: p.price + 35, commission: p.commission + 26, delta: { vs: 'V2', amount: -90, reason: 're-routed via Salerno with a private ferry to the Amalfi Coast (arrives an hour earlier by sea) · goodwill upgrade night in Ravello + €90 transfer credit — trip protected, nothing lost' } };
        setVersions((v) => [...v, v3]); setActiveVer('V3');
        logEv('api', 'Re-routing searched · best: Salerno + private ferry · within disruption-recovery policy');
        logEv('agent', 'Recovery V3 drafted · trip protected · V2 kept immutable');
        logEv('system', 'Deflection signals: sold-out recovered · hold self-served · date change self-served · disruption auto-recovered');
        pushTool({ tool: 'transfer.research', title: 'Search live re-routing', icon: 'network', status: 'ok', meta: 'multi-modal search · 880ms · read-only', args: { around: 'SS163 closure', to: 'Amalfi Coast', date: '2026-08-20', rule: 'fastest · family-friendly · disruption-recovery' }, result: 'Best: drive to Salerno + private ferry to the coast — arrives 1h earlier by sea, avoids the closed road. Within disruption-recovery policy, no cost to the family.' });
        pushAgent('<b>Handled before the family noticed.</b> A rockfall closed the Amalfi coast road on their transfer day — mid-trip — and I caught it on the live disruption watch. <b>Version V3</b> re-routes them <b>via Salerno with a private ferry to the coast</b>: they arrive an hour earlier by sea instead of sitting in a road closure. I\'ve added a <b>goodwill upgrade night in Ravello + €90 credit</b>. Net: <b>the trip is protected and better than planned</b>. Committing it rebooks the transfer — destructive, so it gates on you. V2 stays revertible.', 'Disruption recovery');
        setApproval({
          actionType: 'commit recovery to V3',
          tool: { tool: 'booking.amend', title: 'Commit recovery to V3', icon: 'anomaly', meta: 'booking platform · write · reversible', gate: 'destructive · always gates', args: { hold: 'AT-88421', from: 'V2 · road transfer (closed)', to: 'V3 · Salerno + private ferry + Ravello upgrade', delta: -90 }, result: 'Rebooks the transfer via ferry, applies the upgrade and credit. V2 stays in the version history.' },
        });
        pendingApprove.current = approveV3;
      },
    });
  }

  function approveV3() {
    setApproval(null);
    orchestrate({
      user: 'Approve V3 — re-route the transfer and confirm the recovery.', status: 'Committing the recovery and confirming the new transfer…', delay: 1000,
      then: () => {
        setStage('completed'); scrollTop();
        logChoice({ label: 'Approved recovery V3 · Salerno + ferry + upgrade', s: 'trip protected · −€90 · V2 revertible', icon: 'checkmark-filled' });
        bus && bus.emit('v2', { total: 7185, window: '15–25 August · Amalfi by ferry' });
        pbFeed('Sorted before you even noticed — private ferry to the coast, an upgrade night on us');
        setVersions((v) => v.map((x: any) => x.versionId === 'V3' ? { ...x, status: 'held' } : { ...x, status: 'superseded' }));
        logEv('api', 'Booking AT-88421 rebooked · Salerno + private ferry · upgrade + credit applied · V2 superseded (revertible)');
        pushTool({ tool: 'booking.amend', title: 'Commit recovery to V3', icon: 'anomaly', status: 'ok', meta: 'booking platform · 910ms · human-approved', args: { hold: 'AT-88421', to: 'V3 · Salerno + private ferry' }, result: 'Rebooked · Ravello upgrade night + €90 credit applied · V2 superseded and revertible.' });
        showDelta("recovery → V3 · the family's page now shows the ferry re-route, the Ravello upgrade and the credit — with the disruption explained in plain words");
        pushAgent('Done — the family is <b>re-routed by private ferry to the Amalfi Coast</b>, arriving earlier, with the <b>Ravello upgrade night</b> and credit applied. End to end on one shelf: sold-out recovered, proposal written, hold placed, dates changed, and a mid-trip disruption resolved before the customer even saw it — <b>without a single support contact</b>. The timeline has the full audit trail.', 'Tredi · supervisor');
        setQuick([{ id: 'share', label: 'Share updated proposal V3', kind: 'primary' }, { id: 'restart', label: 'Back to the storefront' }]);
      },
    });
  }

  function rejectApproval() {
    setApproval(null);
    pushAgent("Understood — nothing committed. The draft stays on the shelf; approve whenever you're ready.", 'Tredi · supervisor');
    logEv('user', 'Deferred pending approval — no commercial action taken');
    setQuick([{ id: 'reapprove', label: 'Approve now', kind: 'primary' }]);
  }

  function onQuick(q: any) {
    if (q.id === 'attach') {
      setQuick([]); setRailOpen(true); setTab('chat');
      setMsgs((m) => [...m, { role: 'attachment', file: 'carter-family-call.txt', meta: '4:12 · call transcript · just now' }]);
      setTimeout(() => { setWorking('Reading the call transcript'); }, 500);
      setTimeout(() => {
        setWorking(null);
        setMsgs((m) => [...m, { role: 'agent', skill: 'Tredi · supervisor', html: "I've read the call. Here's the <b>Carter family</b> inquiry, structured straight from the transcript — nothing re-typed. It's on your desk now. <b>Accept it</b> to start and I'll bring in the experts." }, { role: 'inquiry' }]);
        setInquiryShown(true);
      }, 3000);
      return;
    }
    if (q.id === 'brief') return onParse((window as any).__SF_BRIEF || '');
    if (q.id === 'fixall') return fixAll();
    if (q.id === 'genmd') return genMd();
    if (q.id === 'openmd') return setMdOpen(true);
    if (q.id === 'sendmd') return sendMd();
    if (q.id === 'opencoral') return setDrawerId('coral');
    if (q.id === 'cmp3') { setCompareIds(['coral', 'sinai', 'redsea']); return setCmpOpen(true); }
    if (q.id === 'modify') return requestChange();
    if (q.id === 'share') {
      logEv('user', 'Shared active proposal with customer (simulated)');
      logChoice({ label: 'Shared the proposal with the customer', icon: 'arrow-up-right' });
      pushHandoff({
        dir: 'out', from: 'EasyBook agent · Rossi Travel', to: 'The Carter family · proposal page',
        meta: 'handoff.dispatched · 2231-V2',
        payload: ['Active proposal version', 'Hold AT-88421 · expiry', 'Live-verified price', "Giulia's contact details"],
        note: "The customer sees the simple Rossi Travel page — no agent chrome, no commission. Preview it from the proposal panel.",
      });
      return showDelta("proposal → shared · the customer's page now shows the held trip and Giulia's contacts");
    }
    if (q.id === 'restart') return location.reload();
    if (q.id === 'reapprove') { const f = pendingApprove.current; if (f) return f(); }
  }

  function onSend(text: string) {
    const low = text.toLowerCase();
    if (stage === 'browse') return onParse(text);
    if (stage === 'blockers' && blk.length) return fixAll();
    if (mdSent && stage === 'held') return requestChange();
    if (stage === 'v2') return handleDisruption();
    if ((low.includes('md') || low.includes('propost') || low.includes('write')) && (stage === 'turisanda' || stage === 'held' || stage === 'completed')) return genMd();
    if ((low.includes('earlier') || low.includes('change') || low.includes('move')) && stage === 'held') return requestChange();
    if (low.includes('compare') && stage === 'ranked') return onQuick({ id: 'cmp3' });
    pushUser(text);
    const primary = quick.find((x: any) => x.kind === 'primary');
    if (primary) return setTimeout(() => onQuick(primary), 400);
    pushAgent('This prototype follows a guided journey — use the suggested actions, the amber chips above the shelf, or ask about availability and changes.', 'Tredi · supervisor');
  }

  const onSource = () => { setRailOpen(true); setTab('sources'); };
  const toggleCompare = (id: string) => setCompareIds((c) => c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? (showToast('Compare holds up to three products.'), c) : [...c, id]);
  const toggleAddon = (id: string) => {
    if (versions.length) return showToast('Add-ons are locked into V1 — ask AlpiConcierge for a change instead.');
    setSelAddons((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  const planIdx = ({ browse: [-1, -1], parsing: [-1, 0], blockers: [0, 1], searching: [1, 3], ranked: [4, 5], drafting: [4, 5], proposal: [5, 6], holding: [6, 6], held: [6, 7], repricing: [6, 7], v2: [6, 7], completed: [7, -1] } as any)[stage] || [-1, -1];
  const confidence = stage === 'completed'
    ? { level: 'high', rationale: 'All commercial facts came from live inventory and pricing APIs; both commits were human-approved.' }
    : { level: 'high', rationale: 'Live inventory and product-master facts agree; no stale sources in use.' };
  const asb = working
    ? { state: 'thinking', label: working.replace(/…$/, ''), meta: `step ${Math.max(planIdx[1] + 1, 1)}/8 · run wp-2231` }
    : approval
    ? { state: 'waiting', label: 'Waiting on your approval', meta: approval.tool ? approval.tool.tool : 'gated action' }
    : stage === 'completed'
    ? { state: 'done', label: 'Run complete · 2 approvals · 0 escalations', meta: '12 events · audited' }
    : { state: 'idle' };

  let drawerCta: string | null = null, drawerAction: (() => void) | null = null;
  if (drawerId) {
    const p = (products as any)[drawerId];
    if (stage === 'ranked' && p.allotment.status !== 'sold_out' && p.match) {
      drawerCta = 'Select for package · draft V1'; drawerAction = () => selectOffer(drawerId);
    } else if (stage === 'browse' && p.allotment.status !== 'sold_out') {
      drawerCta = 'Quote with AlpiConcierge'; drawerAction = () => { setDrawerId(null); showToast("Pick a request to work in the AlpiConcierge panel — the brand curates itself from the customer's words."); };
    }
  }

  const jstep = stage === 'browse' ? (request ? 3 : 1)
    : ['parsing', 'blockers'].includes(stage) ? 2
    : ['searching', 'ranked'].includes(stage) ? 4
    : stage === 'drafting' ? 5
    : stage === 'turisanda' ? (mdSent ? 7 : mdGen ? 6 : 5)
    : stage === 'proposal' ? 6
    : 7;

  const selling = stage !== 'browse';
  const rankedIds = ['jaz', 'coral', 'sinai', 'redsea'];
  const showRanked = ['ranked', 'drafting'].includes(stage);
  const showPkg = ['proposal', 'held', 'repricing', 'v2', 'completed'].includes(stage);

  return (
    <div className={`sf-app ${t.density === 'dense' ? 'dense' : ''} ${t.customerSafe ? 'safe' : ''} ${t.showPhotos ? '' : 'noimg'}`}>
      <header className="sf-head">
        <div className="sf-brand" onClick={() => stage === 'browse' ? scrollTop() : showToast('Restart to return to the storefront — your work package stays in the timeline.')}>
          <img className="sf-logo" src="assets/alpitour-world.png" alt="Alpitour World" />
          <span className="sf-brand-sep" aria-hidden="true"></span>
          <div className="sf-brand-name"><div className="t">AlpiConcierge</div><div className="s">Travel Advisor Workspace</div></div>
        </div>
        <nav className="sf-nav" aria-label="Primary">
          <button className="sf-home" onClick={() => { if (stage === 'browse') { scrollTop(); } else { setHomeView(true); scrollTop(); } }} aria-label="Home" title="Back to your desk">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" /></svg>
          </button>
        </nav>
        <div className="sf-head-spacer" />
        <div className="sf-agency"><span>Giulia · Rossi Travel</span><span className="gold">Gold</span></div>
        <button className="sf-restart" onClick={() => location.reload()}>↺ Restart</button>
      </header>

      <div className={`sf-main ${railOpen ? '' : 'rail-closed'}`}>
        <div className="sf-shelf-col" ref={shelfRef} data-screen-label={selling ? (stage === 'turisanda' ? 'Turisanda curated' : 'Selling shelf') : 'Storefront'}>
          {selling && !homeView && stage !== 'turisanda' && <ChipsBar blockers={blk} onFix={fixBlocker} stage={stage} />}
          <div className="sf-shelf-in">
            {(!selling || homeView) && (
              <DeskBoard awaiting={awaitingInquiry} busState={busState} onAccept={acceptHandoff} onToast={showToast} stage={stage} onResume={() => { setHomeView(false); scrollTop(); }} showCarter={inquiryShown || stage !== 'browse'} />
            )}
            {!homeView && stage === 'turisanda' && (
              <>
                <TurisandaPanel price={turiPrice} repriced={turiRepriced} onGenMd={() => onQuick({ id: 'genmd' })} onSource={onSource} />
                <JourneyGraph mode="turisanda" turiPrice={turiPrice} turiRepriced={turiRepriced} mdGenerated={mdGen} mdSent={mdSent} />
                <MapPanel mode="turisanda" />
              </>
            )}
            {selling && !homeView && stage !== 'turisanda' && !showRanked && !showPkg && (
              <div className="sf-empty" style={{ paddingTop: 60 }}>
                {stage === 'parsing' ? 'AlpiConcierge is reading the brief…' : stage === 'blockers' ? 'Two blocking questions remain — tap the amber chips above, or confirm in the AlpiConcierge panel.' : 'Checking live availability and pricing across the shelf…'}
              </div>
            )}
            {!homeView && showRanked && (
              <>
                <SoldOutBanner />
                <MapPanel mode="bravo" onOpenPin={(id: string) => { if ((products as any)[id]) setDrawerId(id); }} />
                <FitMatrix onSource={onSource} />
                <section>
                  <div className="sf-shelf-h">
                    <span className="ic"><Ki name="recommend" size={14} /></span>
                    <h2>Ranked for the Carter brief</h2>
                    <span className="sub">Hard constraints kept · family rooms &amp; short transfers weighted first · Gold-tier pricing</span>
                    <span className="sf-stepchip" style={{ marginLeft: 'auto', alignSelf: 'center' }}>Step 4 · Search &amp; Recommend</span>
                  </div>
                  <div className="sf-grid">
                    {rankedIds.map((id) => (
                      <ProductCard key={id} p={(products as any)[id]} ranked soldout={(products as any)[id].allotment.status === 'sold_out'}
                        inCompare={compareIds.includes(id)} onCompare={(products as any)[id].allotment.status === 'sold_out' ? undefined : toggleCompare}
                        onOpen={setDrawerId} onSelect={selectOffer} onSource={onSource} busy={!!working} />
                    ))}
                  </div>
                </section>
              </>
            )}
            {!homeView && showPkg && (
              <>
                {['held', 'v2', 'completed'].includes(stage) && <HoldReceipt version={(versions.find((v: any) => v.status === 'held') || {}).versionId || 'V1'} total={versions.find((v: any) => v.status === 'held')?.total || 0} holdRef={holdRef || ''} />}
                {['v2', 'completed'].includes(stage) && versions.length >= 2 && (() => {
                  const last = versions[versions.length - 1], prev = versions[versions.length - 2];
                  return <DeltaWaterfall v1={prev.total} delta={last.total - prev.total} v2={last.total} prevLabel={prev.versionId} curLabel={last.versionId} reason={last.delta && last.delta.reason} />;
                })()}
                <PackagePanel versions={versions} activeId={activeVer || ''} onSetActive={setActiveVer} selAddons={selAddons}
                  onShare={() => onQuick({ id: 'share' })} onSource={onSource} />
              </>
            )}
          </div>
        </div>

        <Rail open={railOpen} setOpen={setRailOpen} tab={tab} setTab={setTab} msgs={msgs} working={working}
          quick={quick} onQuick={onQuick} onSend={onSend} approval={approval} onAcceptInquiry={acceptHandoff} inquiryDone={selling}
          onApprove={() => pendingApprove.current && pendingApprove.current()} onReject={rejectApproval}
          planDone={planIdx[0]} planActive={planIdx[1]} confidence={confidence} srcIds={srcIds} timeline={timeline}
          asb={asb} onToast={showToast} brand={brand} onPickBrand={pickBrand} live={live} liveSticky={liveSticky}
          request={request} onPickRequest={workRequest} choices={choices} jstep={jstep} />
      </div>

      {compareIds.length > 0 && !cmpOpen && <CompareTray ids={compareIds} onOpen={() => setCmpOpen(true)} onClear={() => setCompareIds([])} />}
      {cmpOpen && <CompareOverlay ids={compareIds} onClose={() => setCmpOpen(false)} canSelect={stage === 'ranked'} onSelect={selectOffer} onSource={onSource} />}
      {drawerId && <Drawer pid={drawerId} onClose={() => setDrawerId(null)} onSource={onSource} selAddons={selAddons}
        onToggleAddon={toggleAddon} cta={drawerCta || undefined} onCta={drawerAction || undefined} busy={!!working} />}
      {toast && <Toast text={typeof toast === 'string' ? toast : toast.text} delta={!!toast.delta} />}
      {mdOpen && <MdPreview brand={brand || 'bravo'} price={brand === 'turisanda' ? turiPrice : ((versions.find((v: any) => v.status === 'held') || versions[0] || {}).total || 3465)} holdRef={holdRef || undefined} onClose={() => setMdOpen(false)} onSend={() => onQuick({ id: 'sendmd' })} />}

      <TweaksPanel>
        <TweakSection label="Shelf" />
        <TweakRadio label="Density" value={t.density} options={['comfortable', 'dense']} onChange={(v) => setTweak('density', v)} />
        <TweakToggle label="Show drawer photo" value={t.showPhotos} onChange={(v) => setTweak('showPhotos', v)} />
        <TweakSection label="Agent economics" />
        <TweakToggle label="Customer-safe mode (hide net & commission)" value={t.customerSafe} onChange={(v) => setTweak('customerSafe', v)} />
        <TweakSection label="AlpiConcierge" />
        <TweakToggle label="Auto-play real-time updates" value={t.liveAuto !== false} onChange={(v) => setTweak('liveAuto', v)} />
      </TweaksPanel>
    </div>
  );
};
