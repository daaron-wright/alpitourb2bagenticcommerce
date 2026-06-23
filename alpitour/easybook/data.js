/* ============================================================
   EasyBook Next — Work Package data (TravelWorkContext fixtures)
   Deterministic demo: stages per spec state machine.
   ============================================================ */
window.EB = (function () {
  const fmtEUR = (n) => "€" + n.toLocaleString("en-IE");

  /* ---- source receipts (provenance + freshness + confidence) ---- */
  const receipts = {
    inv1: { id: "inv1", label: "Live inventory · travel-inventory API", sourceKind: "inventory_api", freshness: "live", checked: "43s ago", confidence: "high", reason: "Live allotment response for the exact date range" },
    prc1: { id: "prc1", label: "Pricing API · Gold-tier rules applied", sourceKind: "pricing_api", freshness: "live", checked: "41s ago", confidence: "high", reason: "Repriced against current commercial rules" },
    pm1: { id: "pm1", label: "Product master · hotel facts", sourceKind: "product_master", freshness: "recent", checked: "updated 12 May 2026", confidence: "high", reason: "Structured amenity record, matches catalogue" },
    cat1: { id: "cat1", label: "Bravo catalogue 2026 · descriptive", sourceKind: "catalogue", freshness: "recent", checked: "edition 2026/2", confidence: "medium", reason: "Descriptive enrichment — never overrides live inventory" },
    pol1: { id: "pol1", label: "Policy doc · date-change rules v2026.2", sourceKind: "policy_doc", freshness: "recent", checked: "updated 2 Jun 2026", confidence: "high", reason: "Official rule document for pre-confirmation changes" },
  };

  /* ---- offers ---- */
  const offers = {
    jaz: { offerId: "jaz", hotelName: "Jaz Mirabel Beach", boardBasis: "All inclusive", price: null, availabilityStatus: "sold_out", amenities: ["Baby pool", "Kids club", "Family rooms", "Beach access"], matchReasons: ["Customer's preferred hotel"], receipts: ["inv1", "pm1"] },
    coral: { offerId: "coral", hotelName: "Coral Bay Family Resort", boardBasis: "All inclusive", price: 3250, availabilityStatus: "available", match: 94, rank: "Best match", amenities: ["Baby pool", "Kids club", "Family rooms", "Beach access"], hi: ["Baby pool", "Kids club"], matchReasons: ["Same destination & board basis", "Baby pool + kids club — the stated must-haves", "€250 under budget"], receipts: ["inv1", "prc1", "pm1"] },
    redsea: { offerId: "redsea", hotelName: "Red Sea Palm Village", boardBasis: "All inclusive", price: 3100, availabilityStatus: "available", match: 88, rank: "Best value", amenities: ["Kids club", "Family rooms", "Large pool", "Beach access"], hi: ["Kids club"], matchReasons: ["€400 under budget", "Strong family facilities", "No dedicated baby pool"], receipts: ["inv1", "prc1", "pm1"] },
    sinai: { offerId: "sinai", hotelName: "Sinai Blue Lagoon Resort", boardBasis: "All inclusive", price: 3580, availabilityStatus: "available", match: 91, rank: "Premium", amenities: ["Baby pool", "Water park nearby", "Premium family suite", "Private transfer"], hi: ["Baby pool", "Water park nearby"], matchReasons: ["Strongest family experience", "€80 over budget — flag to customer"], receipts: ["inv1", "prc1", "cat1"] },
  };

  /* ---- seeded work packages for the dashboard ---- */
  const dashboard = {
    resume: [
      { id: "WP-2231", title: "Famiglia Bianchi · Sharm el-Sheikh", meta: "2 adults + 1 child (2y) · 12–19 Aug · ≤ €3,500", stage: "New lead · intake", hot: true },
      { id: "WP-2228", title: "Sig.ra Conti · Santorini", meta: "1 adult · September · boutique · awaiting customer decision", stage: "Proposal shared · V2" },
      { id: "WP-2219", title: "Gruppo Greco · ski week", meta: "12 pax · Cervinia · January", stage: "Quote draft" },
    ],
    holds: [
      { ref: "AT-88102", title: "Ferri · Maldives · V1", expires: "today 18:00", urgent: true },
      { ref: "AT-88097", title: "Romano · Tenerife · V3", expires: "tomorrow 11:30" },
    ],
    signals: [
      { t: "Sold-out recovered", s: "Marchetti · Djerba — alternative accepted", kind: "success" },
      { t: "Modification self-served", s: "Romano · Tenerife — dates moved, repriced −€60", kind: "success" },
      { t: "Escalated with snapshot", s: "Vitale · group fare rule missing", kind: "warn" },
    ],
  };

  /* ---- requirement chips (structured needs) ---- */
  const needs = [
    { id: "dest", label: "Sharm el-Sheikh, Egypt", kind: "ok" },
    { id: "dates", label: "12–19 Aug · 7 nights", kind: "ok" },
    { id: "party", label: "2 adults + 1 child (2y)", kind: "ok" },
    { id: "board", label: "All inclusive", kind: "ok" },
    { id: "budget", label: "≤ €3,500 hard cap", kind: "ok" },
    { id: "hotel", label: "Preferred: Jaz Mirabel Beach", kind: "ok" },
  ];
  const blockers = [
    { id: "airport", label: "Departure airport?", fix: "Rome Fiumicino", severity: "blocking" },
    { id: "flex", label: "Date flexibility if unavailable?", fix: "±1 week acceptable", severity: "blocking" },
  ];

  /* ---- proposal versions ---- */
  const mkVersions = () => ([
    { versionId: "V1", createdAt: "10:18", status: "draft", offerId: "coral", dates: "12–19 Aug", total: 3465, note: "Initial proposal · Coral Bay + insurance + private transfer", delta: null },
  ]);

  /* ---- plan steps (orchestration rail) ---- */
  const PLAN = [
    { id: "p1", label: "Capture & structure the request", stage: "clarifying" },
    { id: "p2", label: "Resolve blocking questions", stage: "enriching" },
    { id: "p3", label: "Pull hotel facts (product master)", stage: "availability_check" },
    { id: "p4", label: "Check live availability & pricing", stage: "sold_out" },
    { id: "p5", label: "Recover alternatives (sold-out plan)", stage: "alternatives_ready" },
    { id: "p6", label: "Compose proposal version", stage: "proposal_ready" },
    { id: "p7", label: "Place hold (needs your approval)", stage: "hold_confirmed" },
    { id: "p8", label: "Service changes & reprice", stage: "completed" },
  ];

  const STAGE_ORDER = ["intake", "clarifying", "enriching", "availability_check", "sold_out", "alternatives_ready", "package_selected", "proposal_draft", "proposal_ready", "hold_pending", "hold_confirmed", "modification_requested", "repricing", "v2_ready", "completed"];
  const STAGE_LABEL = {
    intake: "Intake", clarifying: "Clarifying", enriching: "Enriching", availability_check: "Availability check",
    sold_out: "Sold out", alternatives_ready: "Alternatives ready", package_selected: "Package selected",
    proposal_draft: "Proposal draft", proposal_ready: "Proposal ready", hold_pending: "Hold pending",
    hold_confirmed: "Hold confirmed", modification_requested: "Modification requested", repricing: "Repricing",
    v2_ready: "Version 2 ready", completed: "Self-service complete", support_needed: "Support needed",
  };

  return { fmtEUR, receipts, offers, dashboard, needs, blockers, mkVersions, PLAN, STAGE_ORDER, STAGE_LABEL };
})();
