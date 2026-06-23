/* ============================================================
   AlpiGPT B2B Concierge — app shell + scripted state machine
   Stages: inquiry → needs → context → retrieval → availability →
   alternatives → package → addons → proposal → hold → modify →
   compare → hotelswitch (optional) → nba
   ============================================================ */
(function () {
  const { useState, useRef } = React;
  const { fmtEUR, KAF } = window.CG;

  const STAGE_LABEL = {
    inquiry: "1 · Inquiry", needs: "2 · Needs capture", context: "3 · Context & persona",
    retrieval: "3b · Knowledge check", availability: "4 · Availability", alternatives: "4 · Search & recommend",
    package: "5 · Itinerary", addons: "5b · Add-ons", proposal: "6 · Proposal", hold: "7 · On hold",
    modify: "7b · Modification", compare: "7b · Version compare", hotelswitch: "7c · Hotel switch", nba: "7 · Next best actions",
  };

  const DETAIL_CHIPS = [
    { id: "d-dates", label: "Dates: 12–19 August" },
    { id: "d-pax", label: "2 adults + 1 child" },
    { id: "d-age", label: "Child age: 2 years" },
    { id: "d-board", label: "All inclusive" },
    { id: "d-flex", label: "Show alternatives if unavailable" },
  ];

  let tCounter = 0;
  function stamp() { tCounter++; const m = 9, s = 41 + tCounter * 7; return `${String(m).padStart(2, "0")}:${String(41 + Math.floor(tCounter * 0.6)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }

  function App() {
    const [stage, setStage] = useState("inquiry");
    const [ws, setWs] = useState("welcome");
    const [busy, setBusy] = useState(false);
    const [msgs, setMsgs] = useState([{ role: "agent", html: "Welcome back, Marco. I can help you <b>build</b>, <b>check</b>, <b>modify</b>, or <b>hold</b> a travel proposal. What is the customer looking for?" }]);
    const [chips, setChips] = useState([{ id: "start", label: "Start new customer request", kind: "primary" }]);
    const [trace, setTrace] = useState([]);
    const [detailSel, setDetailSel] = useState([]);
    const [signals, setSignals] = useState([]);
    const [hotelId, setHotelId] = useState(null);
    const [addOns, setAddOns] = useState([]);
    const [holdVersion, setHoldVersion] = useState("v1");
    const [acceptedV2, setAcceptedV2] = useState(false);
    const [switched, setSwitched] = useState(false);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    const hotel = hotelId ? window.CG.hotels[hotelId] : window.CG.hotels.coral;

    /* ---------- helpers ---------- */
    function pushUser(text) { setMsgs((m) => [...m, { role: "user", html: text }]); }
    function pushAgent(html) { setMsgs((m) => [...m, { role: "agent", html }]); }
    function addTrace(items) {
      setTrace((t) => [...t, ...items.map((it) => ({ ...it, status: "complete", t: stamp() }))]);
    }
    function showToast(text) {
      setToast(text);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2600);
    }
    function orchestrate({ user, traceItems, reply, nextWs, nextStage, nextChips, delay = 1050, after }) {
      if (user) pushUser(user);
      setChips([]);
      setBusy(true);
      setTimeout(() => {
        if (traceItems) addTrace(traceItems);
        if (reply) pushAgent(reply);
        if (nextWs) setWs(nextWs);
        if (nextStage) setStage(nextStage);
        setBusy(false);
        setChips(nextChips || []);
        if (after) after();
      }, delay);
    }

    function totals(base, adds) {
      const addSum = window.CG.addOns.filter((a) => adds.includes(a.id)).reduce((s, a) => s + a.price, 0);
      const total = base + addSum;
      return { base, addons: addSum, total, commission: Math.round(total * 0.12) };
    }
    const t1 = totals(3250, addOns);
    const v2Total = t1.total - 100;

    /* ---------- scripted actions ---------- */
    function actStart(userText) {
      orchestrate({
        user: userText || "I have a family of 3 looking for an all-inclusive Egypt package from Rome in August, budget around €3,500. They were hoping for Jaz Mirabel Beach.",
        traceItems: [
          { agent: "KAF · WebsiteAPIService", icon: "network", message: "Work package wpkg_alpitour_001 created · session authenticated (EasyBook)", ...KAF.discover },
          { agent: "Intent Agent", icon: "chat-bot", message: "Classified request as standard_package_quote", ...KAF.discover },
        ],
        reply: "I can help build that package. I'll capture the key details, check availability, and suggest alternatives if needed. <b>Can I confirm a few details before searching?</b>",
        nextWs: "captured", nextStage: "needs",
        nextChips: [...DETAIL_CHIPS, { id: "confirm-all", label: "Confirm all details", kind: "primary" }],
      });
    }

    function actConfirmDetails() {
      orchestrate({
        user: "Confirmed: 12–19 August · 2 adults + 1 child (age 2) · all inclusive · show alternatives if unavailable.",
        traceItems: [{ agent: "Requirements Agent", icon: "document-chart", message: "Structured requirements object assembled · constraints validated", ...KAF.discover }],
        reply: "Thanks. I'll search for a <b>7-night all-inclusive family package</b> from Rome to Egypt, with flexibility for similar family-friendly resorts if Jaz Mirabel Beach is unavailable. First, let me apply your agency context.",
        nextWs: "trip", nextStage: "context",
        nextChips: [{ id: "apply-context", label: "Apply agency context", kind: "primary" }],
      });
    }

    function actApplyContext() {
      orchestrate({
        user: "Apply Rossi Travel's agency context.",
        traceItems: [{ agent: "Context Agent", icon: "group", message: "Agency tier resolved via crm-mcp · Gold Partner · commission 12% · preferred brands applied", ...KAF.discover }],
        reply: "I've applied <b>Rossi Travel's Gold Partner context</b> and standard commission rules — pricing and recommendations will reflect your tier automatically.",
        nextWs: "agency", nextStage: "retrieval",
        nextChips: [
          { id: "retrieval-q", label: "Does Jaz Mirabel Beach have a baby pool?" },
          { id: "check-avail", label: "Check availability for Jaz Mirabel Beach" },
        ],
      });
    }

    function actRetrieval(userText) {
      orchestrate({
        user: userText || "Before we search alternatives, does Jaz Mirabel Beach have a baby pool?",
        traceItems: [
          { agent: "Retrieval / Knowledge Agent", icon: "lightbulb", message: "Retrieved hotel amenity data from product catalogue (rag-mcp)", ...KAF.discover },
          { agent: "Context Agent", icon: "group", message: "Added baby-pool interest to Travel Work Context", ...KAF.discover },
          { agent: "Recommendation Agent", icon: "recommend", message: "Search ranking criteria updated — baby-friendly amenities prioritised", ...KAF.plan },
        ],
        reply: "Yes — Jaz Mirabel Beach includes a <b>baby pool</b>, kids club, family rooms, and beach access. Since the customer is travelling with a 2-year-old, <b>I'll prioritise alternatives that also include baby-friendly amenities</b>.",
        nextWs: "knowledge", nextStage: "availability",
        nextChips: [{ id: "check-avail", label: "Check availability · 12–19 August", kind: "primary" }],
        after: () => setSignals((s) => [...s, "baby_pool"]),
      });
    }

    function actAvailability(userText) {
      orchestrate({
        user: userText || "Check availability for Jaz Mirabel Beach, 12–19 August.",
        traceItems: [
          { agent: "Inventory Agent", icon: "analytics", message: "Allotment check via travel-inventory-mcp · Jaz Mirabel Beach sold out for date range", ...KAF.plan },
          { agent: "Recommendation Agent", icon: "recommend", message: "Alternative search triggered (sold-out branch workflow)", ...KAF.plan },
        ],
        reply: "I checked availability for Jaz Mirabel Beach for 12–19 August. <b>It is currently sold out</b> for this party and date range. I'll search comparable family-friendly alternatives within the budget range.",
        nextWs: "soldout", nextStage: "alternatives",
        nextChips: [{ id: "find-alts", label: "Find comparable alternatives", kind: "primary" }],
      });
    }

    function actAlternatives(userText) {
      orchestrate({
        user: userText || "Find comparable family-friendly alternatives.",
        traceItems: [
          { agent: "Inventory Agent", icon: "analytics", message: "3 available properties returned for Sharm el-Sheikh · 12–19 Aug", ...KAF.plan },
          { agent: "Recommendation Agent", icon: "recommend", message: "Ranked on family fit, availability, budget and the baby-pool signal", ...KAF.plan },
          { agent: "Upsell Agent", icon: "lightbulb", message: "Sinai Blue Lagoon flagged as premium upgrade candidate", ...KAF.plan },
        ],
        reply: "I found <b>three strong alternatives</b>, ranked on family fit, availability, budget — and the baby-pool signal from your earlier question. Coral Bay Family Resort is the closest match.",
        nextWs: "alternatives", nextStage: "alternatives",
        nextChips: [],
      });
    }

    function actSelectHotel(id) {
      setHotelId(id);
      const h = window.CG.hotels[id];
      orchestrate({
        user: `Select ${h.name}.`,
        traceItems: [
          { agent: "Itinerary Agent", icon: "document-chart", message: `Composed 7-night package · flight + ${h.name} + transfer`, ...KAF.plan },
          { agent: "Inventory Agent", icon: "analytics", message: "Flight (Neos, FCO→SSH) and hotel availability confirmed", ...KAF.plan },
        ],
        reply: `I've assembled a 7-night package with <b>flights from Rome</b>, <b>${h.name}</b>, all-inclusive board, and standard airport transfer. You can adjust any segment, or review suggested add-ons.`,
        nextWs: "package", nextStage: "package",
        nextChips: [{ id: "review-addons", label: "Review suggested add-ons", kind: "primary" }],
      });
    }

    function actAddons() {
      orchestrate({
        user: "Review suggested add-ons.",
        traceItems: [{ agent: "Upsell Agent", icon: "lightbulb", message: "Contextual add-ons ranked — family with 2-year-old + baby-pool interest", ...KAF.plan }],
        reply: "Because the customer is travelling with a 2-year-old and asked about baby-friendly amenities, <b>you may want to add one of these options</b>. Select any, then generate the proposal.",
        nextWs: "addons", nextStage: "addons",
        nextChips: [],
      });
    }

    function actGenerateProposal() {
      const t = totals(3250, addOns);
      orchestrate({
        user: "Generate the proposal.",
        traceItems: [
          { agent: "Pricing Agent", icon: "analytics", message: `Gold-tier pricing + 12% commission applied (${fmtEUR(t.commission)}) · pricing-mcp`, ...KAF.validate },
          { agent: "OPA Policy Engine", icon: "warning-alt", message: "Commission cap and pricing floor validated — pass", ...KAF.validate },
          { agent: "Proposal Agent", icon: "document-chart", message: "Agency-branded proposal v1 generated · compliance annotations attached", ...KAF.validate },
        ],
        reply: `Your <b>agency-ready proposal</b> is ready — total client price <b>${fmtEUR(t.total)}</b>, your commission <b>${fmtEUR(t.commission)}</b>. Pricing and commission rules have been applied and validated.`,
        nextWs: "proposal", nextStage: "proposal",
        nextChips: [],
      });
    }

    function actPlaceHold() {
      orchestrate({
        user: "Place a 24-hour hold.",
        traceItems: [
          { agent: "Booking Agent", icon: "checkmark-filled", message: "Hold AT-88421 created via booking-platform-mcp → EasyBook", ...KAF.commit },
          { agent: "Notification Agent", icon: "information", message: "Customer follow-up prepared · diary link queued", ...KAF.commit },
        ],
        reply: "The proposal has been placed <b>on hold for 24 hours</b>. Reference: <b>AT-88421</b>. You can confirm, modify, or send it to the customer — no support call needed for any of it.",
        nextWs: "hold", nextStage: "hold",
        nextChips: [{ id: "modify", label: "Modify proposal" }],
      });
    }

    function actModify() {
      orchestrate({
        user: "Modify the proposal.",
        traceItems: [{ agent: "Modification Agent", icon: "recommend", message: "Proposal change session opened — no ticket created", ...KAF.plan }],
        reply: "What would you like to change? <b>Date changes are allowed before confirmation</b>; price may update after date or hotel changes.",
        nextWs: "modify", nextStage: "modify",
        nextChips: [{ id: "change-dates", label: "Move the trip one week earlier", kind: "primary" }],
        delay: 700,
      });
    }

    function actChangeDates(userText) {
      orchestrate({
        user: userText || "Move the trip one week earlier.",
        traceItems: [
          { agent: "Modification Agent", icon: "recommend", message: "Detected date-change request on proposal v1", ...KAF.plan },
          { agent: "Inventory Agent", icon: "analytics", message: "Re-checked hotel + flight for 5–12 August — available", ...KAF.plan },
          { agent: "Pricing Agent", icon: "analytics", message: "Re-priced: −€100 vs original · commission recalculated", ...KAF.validate },
          { agent: "Proposal Agent", icon: "document-chart", message: "Proposal v2 generated · v1 retained for traceability", ...KAF.validate },
        ],
        reply: `Good news — the same hotel and flight route are <b>available one week earlier</b> (5–12 August). The updated package price is <b>${fmtEUR(v2Total)}</b>, which is <b>€100 lower</b> than the original proposal.`,
        nextWs: "compare", nextStage: "compare",
        nextChips: [],
        delay: 1350,
      });
    }

    function actAcceptV2() {
      setAcceptedV2(true);
      setHoldVersion("v2");
      orchestrate({
        user: "Accept the updated proposal.",
        traceItems: [{ agent: "Booking Agent", icon: "checkmark-filled", message: "Hold AT-88421 updated to proposal v2 · 5–12 August", ...KAF.commit }],
        reply: "Proposal <b>v2 accepted</b> — the hold now covers 5–12 August at the lower price. One more idea before we wrap up, or I can show your next best actions.",
        nextWs: "hold", nextStage: "hold",
        nextChips: [
          { id: "waterpark-q", label: "Can we switch to something with a water park nearby?" },
          { id: "show-nba", label: "Wrap up — next best actions", kind: "primary" },
        ],
        delay: 800,
      });
    }
    function actKeepV1() {
      orchestrate({
        user: "Keep the original proposal.",
        traceItems: [{ agent: "Proposal Agent", icon: "document-chart", message: "v1 retained · v2 archived — both traceable", ...KAF.validate }],
        reply: "Understood — keeping <b>v1 (12–19 August)</b>. Both versions stay traceable on the work package.",
        nextWs: "hold", nextStage: "hold",
        nextChips: [
          { id: "waterpark-q", label: "Can we switch to something with a water park nearby?" },
          { id: "show-nba", label: "Wrap up — next best actions", kind: "primary" },
        ],
        delay: 700,
      });
    }

    function actWaterpark(userText) {
      orchestrate({
        user: userText || "Can we switch to something with a water park nearby?",
        traceItems: [
          { agent: "Retrieval / Knowledge Agent", icon: "lightbulb", message: "Checked amenity fit across available inventory", ...KAF.plan },
          { agent: "Recommendation Agent", icon: "recommend", message: "Sinai Blue Lagoon Resort matched — water park nearby + baby pool", ...KAF.plan },
          { agent: "Pricing Agent", icon: "analytics", message: "Price delta computed: +€330 vs current proposal", ...KAF.validate },
        ],
        reply: "Yes — I found <b>one strong alternative with a nearby water park</b>: Sinai Blue Lagoon Resort. It keeps the baby pool and adds a premium family suite. It increases the total by <b>+€330</b>.",
        nextWs: "hotelswitch", nextStage: "hotelswitch",
        nextChips: [],
      });
    }

    function actApplySwitch() {
      setSwitched(true);
      orchestrate({
        user: "Apply the hotel change.",
        traceItems: [
          { agent: "Itinerary Agent", icon: "document-chart", message: "Package recomposed with Sinai Blue Lagoon Resort", ...KAF.plan },
          { agent: "Proposal Agent", icon: "document-chart", message: "Proposal v3 generated · hold updated", ...KAF.commit },
        ],
        reply: `Done — the proposal now uses <b>Sinai Blue Lagoon Resort</b> at <b>${fmtEUR(3795)}</b>. Here's everything you can do next.`,
        nextWs: "nba", nextStage: "nba",
        nextChips: [{ id: "restart", label: "↺ Restart demo" }],
      });
    }
    function actKeepHotel() {
      orchestrate({
        user: "Keep the current hotel.",
        reply: "Keeping <b>Coral Bay Family Resort</b>. Here's everything you can do next.",
        nextWs: "nba", nextStage: "nba",
        nextChips: [{ id: "restart", label: "↺ Restart demo" }],
        delay: 600,
      });
    }
    function actNba() {
      orchestrate({
        user: "Wrap up — show next best actions.",
        traceItems: [{ agent: "Upsell Agent", icon: "lightbulb", message: "Contextual next-best-actions generated for this booking", ...KAF.commit }],
        reply: "Your updated proposal is ready. You can <b>send it to the customer</b>, <b>confirm the hold</b>, or continue refining the package — all from here.",
        nextWs: "nba", nextStage: "nba",
        nextChips: [{ id: "restart", label: "↺ Restart demo" }],
        delay: 800,
      });
    }

    /* ---------- chip + typed routing ---------- */
    function onChip(c) {
      if (busy) return;
      if (c.id === "start") return actStart();
      if (c.id === "confirm-all") return actConfirmDetails();
      if (c.id.startsWith("d-")) {
        const next = detailSel.includes(c.id) ? detailSel : [...detailSel, c.id];
        setDetailSel(next);
        setChips((cs) => cs.map((x) => (x.id === c.id ? { ...x, selected: true } : x)));
        if (next.length >= DETAIL_CHIPS.length) actConfirmDetails();
        return;
      }
      if (c.id === "apply-context") return actApplyContext();
      if (c.id === "retrieval-q") return actRetrieval();
      if (c.id === "check-avail") return actAvailability();
      if (c.id === "find-alts") return actAlternatives();
      if (c.id === "review-addons") return actAddons();
      if (c.id === "modify") return actModify();
      if (c.id === "change-dates") return actChangeDates();
      if (c.id === "waterpark-q") return actWaterpark();
      if (c.id === "show-nba") return actNba();
      if (c.id === "restart") return location.reload();
    }

    function onSend(text) {
      const low = text.toLowerCase();
      if (stage === "inquiry") return actStart(text);
      if (low.includes("baby pool") || low.includes("amenit")) return actRetrieval(text);
      if (low.includes("water park")) return actWaterpark(text);
      if (low.includes("earlier") || low.includes("change date") || low.includes("move the trip")) return actChangeDates(text);
      if (low.includes("availab")) return actAvailability(text);
      if (low.includes("alternat")) return actAlternatives(text);
      // default: advance the primary scripted path
      const primary = chips.find((x) => x.kind === "primary") || chips[0];
      if (primary) { pushUser(text); setTimeout(() => onChip(primary), 50); return; }
      pushUser(text);
      setBusy(true);
      setTimeout(() => { setBusy(false); pushAgent("In this PoC the flow is guided — use the suggested actions, or ask about amenities, availability, dates, or a water park."); }, 700);
    }

    function onPackageEdit(k) {
      if (k === "hotel") return actAlternatives("Show me the alternatives again.");
      if (k === "addons") return actAddons();
      showToast("Available in the full build — this PoC follows the pilot scenario.");
    }
    function onHoldAction(k) {
      if (k === "modify") return actModify();
      if (k === "confirm") return showToast("Booking confirmation is simulated in this PoC — hold AT-88421 remains active.");
      if (k === "send") return showToast("Proposal emailed to the customer (simulated).");
      if (k === "remind") return showToast("Follow-up reminder added for tomorrow 09:00 (simulated).");
    }
    function onModPick(k) {
      if (k === "dates") return actChangeDates();
      if (k === "hotel") return actWaterpark("Can we switch to something with a water park nearby?");
      showToast("Available in the full build — try a date change or hotel switch.");
    }
    function onNba(k, label) {
      if (k === "confirm") return showToast("Booking confirmed (simulated) · PNR generation handed to booking-platform-mcp.");
      showToast(`"${label}" — queued (simulated).`);
    }

    /* ---------- workspace router ---------- */
    const showStrip = !["welcome", "captured"].includes(ws);
    let view = null;
    if (ws === "welcome") view = <WelcomeCard />;
    if (ws === "captured") view = <RequestCapturedCard />;
    if (ws === "trip") view = <TripContextCard signals={signals} />;
    if (ws === "agency") view = <AgencyContextCard />;
    if (ws === "knowledge") view = <HotelKnowledgeCard />;
    if (ws === "soldout") view = <AvailabilityCard />;
    if (ws === "alternatives") view = <AlternativesGrid onSelect={actSelectHotel} busy={busy} />;
    if (ws === "package") view = <PackageBuilder hotel={hotel} addOns={addOns} onEdit={onPackageEdit} />;
    if (ws === "addons") view = (
      <>
        <PackageBuilder hotel={hotel} addOns={addOns} compact onEdit={onPackageEdit} />
        <AddOnsPanel selected={addOns} onToggle={(id) => setAddOns((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))} onGenerate={actGenerateProposal} busy={busy} />
      </>
    );
    if (ws === "proposal") view = <ProposalPreview hotel={hotel} addOns={addOns} totals={t1} onHold={actPlaceHold} onRevise={actAddons} busy={busy} version="v1" />;
    if (ws === "hold") view = (
      <>
        <BookingHoldCard version={holdVersion} total={acceptedV2 ? v2Total : t1.total} onAction={onHoldAction} busy={busy} />
        <ProposalPreview hotel={hotel} addOns={addOns} totals={acceptedV2 ? { ...t1, total: v2Total, commission: Math.round(v2Total * 0.12) } : t1} version={holdVersion} dates={acceptedV2 ? "5–12 August" : "12–19 August"} />
      </>
    );
    if (ws === "modify") view = <ModificationPanel onPick={onModPick} busy={busy} />;
    if (ws === "compare") view = <VersionCompareCard onAccept={actAcceptV2} onKeep={actKeepV1} busy={busy} />;
    if (ws === "hotelswitch") view = <HotelSwitchCard onApply={actApplySwitch} onKeep={actKeepHotel} busy={busy} />;
    if (ws === "nba") view = (
      <>
        <NextBestActionsPanel onAction={onNba} />
        <BusinessValueSummary />
      </>
    );

    return (
      <div className="cg-app">
        <header className="cg-head">
          <div className="cg-brand">
            <span className="mark">A</span>
            <div><div className="t">AlpiGPT <span className="psub">· B2B Travel Agent Concierge</span></div><div className="s">Embedded in EasyBook · orchestrated by KAF</div></div>
          </div>
          <span className="cg-env">AI Lab PoC</span>
          <div className="cg-head-spacer" />
          <div className="cg-agency"><span>Rossi Travel</span><span className="gold">Gold Partner</span></div>
          <span className="cg-stagepill"><span className={`dot ${busy ? "busy" : ""}`} /> {STAGE_LABEL[stage]}</span>
          <button className="cg-btn sm" onClick={() => location.reload()} title="Restart demo">↺ Restart</button>
        </header>

        <div className="cg-main">
          <ChatPanel msgs={msgs} busy={busy} chips={chips} onChip={onChip} onSend={onSend} inputEnabled={true} />
          <div className="cg-ws">
            <div className="cg-ws-inner">
              {showStrip && <TripStrip signals={signals} />}
              {view}
            </div>
          </div>
        </div>

        <AgentTrace items={trace} />

        {toast && (
          <div style={{ position: "fixed", bottom: 64, left: "50%", transform: "translateX(-50%)", background: "var(--k-dark-stone-90)", color: "#fff", fontSize: 13, padding: "10px 18px", borderRadius: 8, boxShadow: "var(--shadow-pop)", zIndex: 50 }}>{toast}</div>
        )}
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
