/* ============================================================
   EasyBook Next — B2B Storefront fixtures (window.SF)
   Agency-grade catalogue: net rates, commission, live allotment,
   provenance receipts. Deterministic demo around WP-2231 (Bianchi).
   ============================================================ */
window.SF = (function () {
  const fmtEUR = (n) => "€" + n.toLocaleString("en-IE");

  /* ---- brands (Alpitour World) ---- */
  const brands = [
    { id: "alpitour", name: "Alpitour", tone: "#FF462D" },
    { id: "francorosso", name: "Francorosso", tone: "#7A2048" },
    { id: "bravo", name: "Bravo", tone: "#0F62FE" },
    { id: "eden", name: "Eden Viaggi", tone: "#1F8A5B" },
    { id: "turisanda", name: "Turisanda", tone: "#8a6116" },
  ];

  /* ---- provenance receipts ---- */
  const receipts = {
    inv1: { id: "inv1", label: "Live inventory · allotment API", kind: "inventory_api", freshness: "live", checked: "43s ago", confidence: "high", reason: "Live allotment response for the exact date range" },
    prc1: { id: "prc1", label: "Pricing API · Gold-tier commercial rules", kind: "pricing_api", freshness: "live", checked: "41s ago", confidence: "high", reason: "Repriced against current rules for Rossi Travel (Gold)" },
    pm1: { id: "pm1", label: "Product master · structured hotel facts", kind: "product_master", freshness: "recent", checked: "updated 12 May 2026", confidence: "high", reason: "Structured amenity record; matches catalogue edition 2026/2" },
    cat1: { id: "cat1", label: "Italy tailor-made catalogue 2026/2 · descriptive", kind: "catalogue", freshness: "recent", checked: "edition 2026/2", confidence: "medium", reason: "Descriptive enrichment only — never overrides live inventory" },
    pol1: { id: "pol1", label: "Policy doc · date-change rules v2026.2", kind: "policy_doc", freshness: "recent", checked: "updated 2 Jun 2026", confidence: "high", reason: "Official rule document for pre-confirmation changes" },
    cat2: { id: "cat2", label: "Turisanda catalogue 2026/3 · signature itineraries", kind: "catalogue", freshness: "recent", checked: "published last night · auto-synced", confidence: "high", reason: "Curated descriptions re-synced in real time — no manual update step" },
  };

  /* ---- catalogue ----
     price = gross package, family 2+1 · 7 nights, flight included.
     net + commission shown only to the agent (customer-safe mode hides). */
  const products = {
    jaz: {
      id: "jaz", brand: "turisanda", name: "Roma · Firenze · Positano — Signature", dest: "Rome · Florence · Amalfi Coast", board: "B&B + 2 dinners",
      nights: 10, rating: 5, price: 7300, net: 6205, commission: 1095, commissionPct: 15,
      allotment: { status: "sold_out", left: 0, checked: "43s ago" },
      amenities: ["Family rooms", "Air-conditioning", "Short transfers", "Central locations"],
      match: null, rank: null, matchReasons: ["Customer's first choice — the Positano sea-view hotel they set their heart on"],
      receipts: ["inv1", "pm1"], shelf: ["top"], departures: ["FCO", "MXP"],
    },
    coral: {
      id: "coral", brand: "alpitour", name: "Roma · Firenze · Amalfi — Family Select", dest: "Rome · Florence · Amalfi Coast", board: "B&B + 2 dinners",
      nights: 10, rating: 4, price: 7150, net: 6080, commission: 1073, commissionPct: 15,
      allotment: { status: "available", left: 6, checked: "43s ago" },
      amenities: ["Family rooms", "Air-conditioning", "Short transfers", "Central locations"],
      match: 94, rank: "Best match", hi: ["Family rooms", "Short transfers"],
      matchReasons: ["Same three cities and slow pace", "Family rooms + air-con — the stated must-haves", "€250 under the budget cap"],
      receipts: ["inv1", "prc1", "pm1"], shelf: ["redsea"], departures: ["FCO", "MXP", "BLQ"],
    },
    sinai: {
      id: "sinai", brand: "francorosso", name: "Roma · Firenze · Ravello — Premium", dest: "Rome · Florence · Amalfi Coast", board: "Half board",
      nights: 10, rating: 5, price: 7580, net: 6440, commission: 1137, commissionPct: 15,
      allotment: { status: "low", left: 2, checked: "43s ago" },
      amenities: ["Family suite", "Air-conditioning", "Private transfers", "Pool at each stay"],
      match: 91, rank: "Premium", hi: ["Family suite", "Private transfers"],
      matchReasons: ["Most spacious family suites · private transfers throughout", "€180 over the hard cap — flag to customer"],
      receipts: ["inv1", "prc1", "cat1"], shelf: ["redsea"], departures: ["FCO", "MXP"],
    },
    redsea: {
      id: "redsea", brand: "eden", name: "Roma · Firenze · Sorrento — Smart Value", dest: "Rome · Florence · Sorrento", board: "B&B",
      nights: 10, rating: 4, price: 6820, net: 5990, commission: 830, commissionPct: 12,
      allotment: { status: "available", left: 11, checked: "43s ago" },
      amenities: ["Family rooms", "Air-conditioning", "Pool in Sorrento", "Train-linked"],
      match: 88, rank: "Best value", hi: ["Family rooms"],
      matchReasons: ["€580 under budget", "Sorrento base for the Amalfi Coast", "Longer transfers to Positano & Ravello"],
      receipts: ["inv1", "prc1", "pm1"], shelf: ["redsea", "expiring"], departures: ["FCO", "VRN"],
    },
    kiwengwa: {
      id: "kiwengwa", brand: "bravo", name: "Bravo Kiwengwa", dest: "Zanzibar, Tanzania", board: "All inclusive",
      nights: 9, rating: 4, price: 4280, net: 3766, commission: 514, commissionPct: 12,
      allotment: { status: "low", left: 3, checked: "2m ago" },
      amenities: ["Bravo entertainment", "Kids club", "Reef snorkelling", "Beach access"],
      receipts: ["inv1", "prc1"], shelf: ["expiring", "top"], departures: ["FCO", "MXP"], expiry: "allotment release Fri 18:00",
    },
    seaclub: {
      id: "seaclub", brand: "francorosso", name: "SeaClub Filitheyo", dest: "Maldives, Faafu Atoll", board: "Full board",
      nights: 7, rating: 5, price: 5940, net: 5108, commission: 832, commissionPct: 14,
      allotment: { status: "available", left: 6, checked: "1m ago" },
      amenities: ["Overwater villas", "House reef", "Seaplane transfer", "Diving centre"],
      receipts: ["inv1", "prc1"], shelf: ["top"], departures: ["MXP"],
    },
    calaserena: {
      id: "calaserena", brand: "eden", name: "Eden Village Calaserena", dest: "Sardinia, Italy", board: "Soft all inclusive",
      nights: 7, rating: 4, price: 2480, net: 2207, commission: 273, commissionPct: 11,
      allotment: { status: "low", left: 4, checked: "5m ago" },
      amenities: ["Direct beach", "Mini club", "Family bungalows", "No flight needed"],
      receipts: ["inv1", "prc1"], shelf: ["expiring", "top"], departures: ["—"], expiry: "summer allotment closes Sun",
    },
    santorini: {
      id: "santorini", brand: "turisanda", name: "Santorini Secret Suites", dest: "Santorini, Greece", board: "Breakfast",
      nights: 5, rating: 5, price: 3120, net: 2714, commission: 406, commissionPct: 13,
      allotment: { status: "on_request", left: null, checked: "12m ago" },
      amenities: ["Caldera view", "Adults preferred", "Boutique", "Infinity pool"],
      receipts: ["inv1", "cat1"], shelf: ["top"], departures: ["FCO", "MXP"],
    },
  };

  const SHELVES = [
    { id: "expiring", title: "Expiring allotments", sub: "Confirmed seats and rooms your agency loses if unsold — live from the allotment API", icon: "warning-alt" },
    { id: "top", title: "Top sellers for your agency mix", sub: "Ranked on what Rossi Travel actually sells — families, sea, summer departures", icon: "analytics" },
  ];

  /* ---- the seeded brief ---- */
  const BRIEF = "The Carter family — 2 adults + 1 child (2 years) from Toronto — 10 days around Italy in August: Rome, Florence and the Amalfi Coast. They love food, history and slow mornings. Budget ≈ CA$11,000 (≤ €7,400 all-in). Non-negotiables: family rooms, air-con and short transfers.";

  const chips = [
    { id: "dest", icon: "network", label: "Rome · Florence · Amalfi Coast" },
    { id: "dates", icon: "dashboard", label: "12–22 Aug · 10 days" },
    { id: "party", icon: "group", label: "2 adults + 1 child (2y) · Toronto" },
    { id: "board", icon: "checkmark-filled", label: "Food · history · slow mornings" },
    { id: "budget", icon: "filter", label: "≈ CA$11,000 · €7,400 cap" },
    { id: "hotel", icon: "recommend", label: "Must-haves: family rooms · air-con · short transfers" },
  ];
  const blockers = [
    { id: "airport", q: "Arrival gateway into Italy?", opts: ["Rome Fiumicino", "Milan Malpensa"], fix: "Rome Fiumicino" },
    { id: "flex", q: "Date flexibility if a hotel is unavailable?", opts: ["±1 week acceptable", "Dates are fixed"], fix: "±1 week acceptable" },
  ];

  const addons = [
    { id: "insurance", name: "Family travel insurance", price: 95, why: "travelling with a 2-year-old" },
    { id: "transfer", name: "Private transfers with child seat", price: 120, why: "short transfers · child seat included" },
  ];

  /* ---- availability strip (Aug, around the request) ---- */
  const availability = {
    coral: [
      { d: "5", s: "ok" }, { d: "6", s: "ok" }, { d: "7", s: "ok" }, { d: "8", s: "low" }, { d: "9", s: "ok" }, { d: "10", s: "ok" }, { d: "11", s: "low" },
      { d: "12", s: "ok", req: true }, { d: "13", s: "ok" }, { d: "14", s: "ok" }, { d: "15", s: "low" }, { d: "16", s: "ok" }, { d: "17", s: "ok" }, { d: "18", s: "ok" }, { d: "19", s: "ok", req: true },
    ],
    jaz: [
      { d: "5", s: "ok" }, { d: "6", s: "ok" }, { d: "7", s: "low" }, { d: "8", s: "no" }, { d: "9", s: "no" }, { d: "10", s: "no" }, { d: "11", s: "no" },
      { d: "12", s: "no", req: true }, { d: "13", s: "no" }, { d: "14", s: "no" }, { d: "15", s: "no" }, { d: "16", s: "no" }, { d: "17", s: "no" }, { d: "18", s: "no" }, { d: "19", s: "no", req: true },
    ],
  };

  /* ---- orchestration plan (rail) ---- */
  const PLAN = [
    { id: "p1", label: "Capture and structure the brief" },
    { id: "p2", label: "Resolve blocking questions" },
    { id: "p3", label: "Pull hotel facts from the product master" },
    { id: "p4", label: "Check live availability and pricing" },
    { id: "p5", label: "Recover sold-out with ranked alternatives" },
    { id: "p6", label: "Compose proposal version" },
    { id: "p7", label: "Place hold — needs your approval" },
    { id: "p8", label: "Service changes and reprice" },
  ];

  const STAGE_LABEL = {
    browse: "Storefront", parsing: "Reading brief", blockers: "Two questions", searching: "Checking availability",
    ranked: "Sold-out recovered", drafting: "Drafting proposal", proposal: "Proposal V1 ready", holding: "Placing hold",
    held: "Hold confirmed", repricing: "Repricing change", v2: "Version 2 ready", completed: "Self-service complete",
    turisanda: "Turisanda · curated",
  };

  /* ---- desk strip (browse mode) ---- */
  const desk = {
    packages: [
      { id: "WP-2228", title: "Sig.ra Conti · Santorini", meta: "Proposal V2 shared · awaiting customer", kind: "info" },
      { id: "WP-2219", title: "Gruppo Greco · ski week", meta: "Quote draft · 12 pax · Cervinia", kind: "info" },
    ],
    holds: [
      { ref: "AT-88102", title: "Ferri · Maldives · V1", expires: "today 18:00", urgent: true },
      { ref: "AT-88097", title: "Romano · Tenerife · V3", expires: "tomorrow 11:30", urgent: false },
    ],
  };

  /* ---- agency pulse (browse-mode visualizations) ---- */
  const pulse = {
    commission: {
      mtd: 4120, deltaPct: 8.2,
      weeks: ["W14", "W15", "W16", "W17", "W18", "W19", "W20", "W21", "W22", "W23", "W24"],
      series: [610, 580, 720, 690, 760, 820, 790, 880, 940, 905, 1030],
    },
    deflection: { current: 78, target: 85, label: "Cases this month resolved in the portal without a support contact" },
    brandMix: {
      labels: ["Alpitour", "Francorosso", "Bravo", "Eden Viaggi", "Turisanda"],
      values: [34, 22, 21, 14, 9],
    },
  };

  /* ---- price by departure date (drawer chart) · 7-night package, family 2+1 ---- */
  const priceCalendar = {
    coral: { labels: ["8 Aug", "10 Aug", "12 Aug", "15 Aug", "17 Aug", "19 Aug", "22 Aug", "24 Aug", "26 Aug", "29 Aug"], values: [7060, 7100, 7150, 7210, 7180, 7150, 7120, 7090, 7040, 6980], requested: 2, note: "Mid-August sits at the Ferragosto peak — the later week eases slightly as Italian demand unwinds." },
    sinai: { labels: ["8 Aug", "10 Aug", "12 Aug", "15 Aug", "17 Aug", "19 Aug", "22 Aug", "24 Aug", "26 Aug", "29 Aug"], values: [7480, 7540, 7580, 7650, 7620, 7580, 7540, 7500, 7440, 7380], requested: 2, note: "Premium line — every August departure prices above the €7,400 cap." },
    redsea: { labels: ["8 Aug", "10 Aug", "12 Aug", "15 Aug", "17 Aug", "19 Aug", "22 Aug", "24 Aug", "26 Aug", "29 Aug"], values: [6720, 6780, 6820, 6890, 6860, 6820, 6790, 6750, 6700, 6640], requested: 2, note: "Best-value line all month — €580 under cap on the requested dates." },
  };

  /* ---- constraint-fit matrix (ranked mode) ---- */
  const fitMatrix = {
    cols: ["Cities", "12–22 Aug", "Family rooms", "≤ €7,400", "Air-con", "Short transfers"],
    rows: [
      { id: "jaz", cells: ["ok", "no", "ok", "na", "ok", "ok"], note: "Sold out on dates" },
      { id: "coral", cells: ["ok", "ok", "ok", "ok", "ok", "ok"], note: "Meets every constraint" },
      { id: "sinai", cells: ["ok", "ok", "ok", "warn", "ok", "ok"], note: "€180 over the cap" },
      { id: "redsea", cells: ["warn", "ok", "ok", "ok", "ok", "no"], note: "Sorrento base · longer Amalfi transfers" },
    ],
  };

  /* ---- time-to-milestone vs manual baseline (completed state) ---- */
  const milestones = {
    labels: ["Brief → proposal-ready", "Hold placed", "Change repriced & committed"],
    alpigpt: [4, 1, 2],
    manual: [38, 12, 25],
  };

  /* ---- overnight agent run (browse mode · ambient autonomy) ---- */
  const overnight = {
    meta: "run complete · 02:14 · 38s · 14 holds checked · 9 quotes repriced · 0 escalations",
    items: [
      {
        id: "ferri", icon: "warning-alt", kind: "gated",
        title: "Ferri · Maldives — hold expires today 18:00",
        detail: "Customer hasn't replied. I drafted a free extension to Thursday with the supplier — approving sends it and notifies the Ferris.",
        meta: "booking.hold.extend · write · needs you",
        approveLabel: "Approve & send",
        delta: "hold AT-88102 extension requested · Ferri notified — expiry pressure off your desk",
      },
      {
        id: "greco", icon: "analytics", kind: "ready",
        title: "Gruppo Greco · ski week — hotel dropped €40 per person",
        detail: "Price alert at 01:50. I repriced the 12-pax draft: −€480 total, your commission holds. The new version is ready to share.",
        meta: "pricing.reprice · read-only · done overnight",
        approveLabel: "Share new price",
        delta: "Greco quote → V2 · −€480 shared with the group lead",
      },
      {
        id: "conti", icon: "group", kind: "ready",
        title: "Sig.ra Conti · Santorini — opened the proposal 3 times, no reply",
        detail: "Engagement signal since Friday. I drafted a gentle follow-up referencing the caldera-view room she lingered on.",
        meta: "crm.followup.draft · read-only · done overnight",
        approveLabel: "Send follow-up",
        delta: "Conti follow-up sent · reply lands in your worklist",
      },
    ],
  };

  /* ============================================================
     Super TREDI — unified agent identity fixtures
     Brand-curated chat selection · workshop receipts (stickies) ·
     real-time updates · next-best-action + package includes ·
     markdown proposal writing.
     ============================================================ */
  const tredi = {
    /* workshop sticky-note receipts — woven into the rail */
    stickies: {
      s1: "Tredi is already the agents' most-used assistant. Super TREDI makes it the single front door — EasyBook + LyteAI + AlpiConcierge behind one identity.",
      s2: "Curated content per brand — Turisanda sharp & luxury, Bravo family experience. Agents sell the brand voice, not a generic shelf.",
      s3: "“To be more timely.” Manual catalogue updates → real-time price, allotment and content events.",
      s4: "“If AlpiConcierge could take one more step: markdown writing.” The proposal arrives as a written doc, ready to send.",
    },

    /* in-chat brand selection tiles */
    brandPick: [
      {
        id: "turisanda", name: "Turisanda", tone: "#8a6116", tag: "Signature itineraries",
        title: "Ferrante couple · Japan, October",
        copy: "Sharp, curated luxury — ryokan, omakase, private guide. Dry tone, no filler.",
        bullets: ["Curated tone of voice", "Live fares · Neos + JAL", "proposal.md included"],
      },
      {
        id: "bravo", name: "Bravo", tone: "#0F62FE", tag: "Family itineraries",
        title: "Carter family · Italy, August",
        copy: "Slow-travel family — Rome, Florence, Amalfi at a toddler's pace. Food, history, family rooms. The trip, told for parents.",
        bullets: ["Family-first ranking", "Live allotment + recovery", "proposal.md included"],
      },
    ],

    /* real-time update events — auto-play, deterministic order per brand */
    liveEvents: {
      turisanda: [
        { icon: "analytics", t: "Live price watch", s: "Neos FCO→HND −€60 per person — proposal repriced automatically", priceDelta: -120, delta: "Ferrante proposal → −€120 · the price on the page is already updated" },
        { icon: "document-chart", t: "Catalogue refresh", s: "Turisanda 2026/3 published overnight — descriptions re-synced, nothing manual" },
        { icon: "warning-alt", t: "Allotment change", s: "Gōra Kadan ryokan · 3 → 2 private-onsen suites left on your window" },
        { icon: "anomaly", t: "Hold expiry watch", s: "AT-88102 Ferri · Maldives expires 18:00 — extension already drafted" },
      ],
      bravo: [
        { icon: "warning-alt", t: "Allotment change", s: "Amalfi — Family Select · 8 → 6 family rooms on 12–22 Aug" },
        { icon: "analytics", t: "Live price watch", s: "Florence high-season uplift steady — no impact on the Carter proposal" },
        { icon: "document-chart", t: "Catalogue refresh", s: "Italy 2026/2 amenity records re-synced — family-room + air-con data verified overnight" },
        { icon: "anomaly", t: "Hold expiry watch", s: "AT-88102 Ferri · Maldives expires 18:00 — extension already drafted" },
      ],
    },

    /* what the package includes — agent deliverables, per brand */
    includes: {
      turisanda: [
        { icon: "document-chart", t: "proposal.md — written proposal", s: "Itinerary, prices and terms in markdown, ready to send" },
        { icon: "analytics", t: "Live price watch", s: "Neos/JAL fares and ryokan rates watched — automatic reprice" },
        { icon: "network", t: "Real-time updates", s: "Allotment, changes and catalogue — live events, no manual updates" },
        { icon: "recommend", t: "Next-best-action", s: "Super TREDI proposes the next move, you approve" },
      ],
      bravo: [
        { icon: "document-chart", t: "proposal.md — written proposal", s: "Itinerary, quotes and hold in markdown, ready to send" },
        { icon: "analytics", t: "Live price watch", s: "Automatic reprice if a hotel rate or train fare moves" },
        { icon: "network", t: "Real-time updates", s: "Live allotment across all three cities — the shelf updates itself" },
        { icon: "recommend", t: "Next-best-action", s: "AlpiConcierge proposes the next move, you approve" },
      ],
    },

    /* B2C personalization program — exactly 8 clusters pushed on alpitour.it.
       The same semantics dictate the B2B brand curation: no manual brand pick. */
    clusters: [
      { id: "fam", n: 1, name: "Slow-Travel Families", brand: "bravo", brandName: "Bravo", tone: "#0F62FE", signals: "toddler · food & history · slow mornings · short transfers", push: "Family-first sort · family rooms + air-con pinned · parent-tone copy", share: 24 },
      { id: "cur", n: 2, name: "Connoisseur Curators", brand: "turisanda", brandName: "Turisanda", tone: "#8a6116", signals: "ryokan · omakase · 'd'autore' · private guide", push: "Editorial hero · long-form itineraries · sharp copy", share: 9 },
      { id: "rom", n: 3, name: "Romance & Milestones", brand: "francorosso", brandName: "Francorosso", tone: "#7A2048", signals: "honeymoon · anniversary · adults only · suite", push: "Couples hero · adults-only filter pinned · premium upsells", share: 13 },
      { id: "deal", n: 4, name: "Smart Deal Hunters", brand: "eden", brandName: "Eden Viaggi", tone: "#1F8A5B", signals: "best price · offers · flexible dates · last minute", push: "Deals rail first · price-drop alerts · countdown banners", share: 19 },
      { id: "sun", n: 5, name: "Sun & Fun Groups", brand: "alpitour", brandName: "Alpitour", tone: "#FF462D", signals: "friends · beach party · entertainment · summer", push: "Group quotes · social proof · playful tone", share: 14 },
      { id: "slow", n: 6, name: "Slow & Silver", brand: "francorosso", brandName: "Francorosso", tone: "#7A2048", signals: "easy pace · culture · assistance · direct flight", push: "Guided tours first · larger type · phone-first CTAs", share: 8 },
      { id: "act", n: 7, name: "Active Explorers", brand: "alpitour", brandName: "Alpitour", tone: "#FF462D", signals: "diving · trekking · safari · adrenaline", push: "Experience-led sort · activity bundles · gear checklists", share: 7 },
      { id: "well", n: 8, name: "Wellness Retreaters", brand: "eden", brandName: "Eden Viaggi", tone: "#1F8A5B", signals: "spa · yoga · detox · quiet", push: "Calm theme · wellness filters · retreat packages", share: 6 },
    ],

    /* incoming requests — customer words only; semantics dictate the brand */
    requests: [
      {
        id: "bianchi", who: "The Carter family", meta: "via AlpiConcierge · Alpitour.it · 24h consumer hold",
        words: "We're two adults with a 2-year-old, flying from Toronto — ten days around Italy in August: Rome, Florence and the Amalfi Coast. We love food, history and slow mornings. Family rooms, air-con and short transfers are non-negotiable, budget about CA$11,000.",
        signals: ["2-year-old · Toronto", "Rome · Florence · Amalfi", "food · history · slow mornings", "family rooms · air-con · short transfers"],
        cluster: "fam", conf: 96,
      },
      {
        id: "ferrante", who: "Coppia Ferrante", meta: "walk-in · Rossi Travel · noted by Giulia",
        words: "Japan in October, about ten nights — a ryokan with a private onsen, one omakase evening, no groups. We want a curated, signature itinerary.",
        signals: ["ryokan · private onsen", "omakase", "‘signature itinerary’", "no groups"],
        cluster: "cur", conf: 94,
      },
    ],

    /* navigable map — brief elements pinned */
    maps: {
      bravo: {
        title: "Rome · Florence · Amalfi — the Carter brief on the map",
        sub: "Three cities, the arrival gateway and ranked alternatives · live prices pinned",
        fit: [[40.45, 11.9], [44.0, 14.8]],
        pins: [
          { id: "jaz", ll: [40.628, 14.485], kind: "sold", label: "Sold out", name: "Positano — Signature", meta: "Requested · Positano sea-view · sold out 12–22 Aug" },
          { id: "coral", ll: [40.634, 14.602], kind: "best", label: "€7,150", name: "Amalfi — Family Select", meta: "Best match 94% · family rooms + short transfers" },
          { id: "sinai", ll: [40.649, 14.612], kind: "price", label: "€7,580", name: "Ravello — Premium", meta: "Premium · €180 over cap" },
          { id: "redsea", ll: [40.626, 14.376], kind: "price", label: "€6,820", name: "Sorrento — Smart Value", meta: "Best value · longer Amalfi transfers" },
          { id: "fco", ll: [41.800, 12.239], kind: "airport", label: "FCO", name: "Roma Fiumicino", meta: "Arrival gateway from Toronto YYZ" },
        ],
      },
      turisanda: {
        title: "Giappone d'Autore — the route on the map",
        sub: "Five stops, Tokyo to Osaka · Shinkansen Green Class between them",
        fit: [[34.2, 134.8], [35.9, 140.1]],
        route: [[35.681, 139.767], [35.232, 139.107], [35.011, 135.768], [34.685, 135.805], [34.694, 135.502]],
        pins: [
          { id: "tokyo", ll: [35.681, 139.767], kind: "stop", label: "1", name: "Tokyo · D1–3", meta: "Otemachi · omakase booked" },
          { id: "hakone", ll: [35.232, 139.107], kind: "stop", label: "2", name: "Hakone · D4–5", meta: "Gōra Kadan · private onsen, Fuji view" },
          { id: "kyoto", ll: [35.011, 135.768], kind: "stop", label: "3", name: "Kyoto · D6–8", meta: "Gion · private tea ceremony" },
          { id: "nara", ll: [34.685, 135.805], kind: "stop", label: "4", name: "Nara & Uji · D9", meta: "Tōdai-ji · matcha tasting" },
          { id: "osaka", ll: [34.694, 135.502], kind: "stop", label: "5", name: "Osaka · D10", meta: "Kuromon · departure from Kansai (KIX)" },
        ],
      },
    },

    /* official use case — the 7-step future user journey, agent + customer lanes */
    useCase: {
      title: "AI-Powered B2B Travel Agent Concierge",
      steps: [
        { n: 1, icon: "chat-bot", label: "Inquiry", agent: "Customer request lands on the desk — nothing re-typed", customer: "They spoke to AlpiConcierge on Alpitour.it, or walked into the agency" },
        { n: 2, icon: "filter", label: "Needs Capture", agent: "Requirement chips + only the blocking questions", customer: "Answers once — never re-asked" },
        { n: 3, icon: "group", label: "Context & Persona Signals", agent: "cluster.match — 1 of 8 clusters dictates the brand", customer: "The same cluster that personalizes alpitour.it for them" },
        { n: 4, icon: "recommend", label: "Search & Recommend", agent: "Live shelf, ranked · sold-out recovery · fit matrix", customer: "Only options that fit their constraints" },
        { n: 5, icon: "network", label: "Itinerary Creation", agent: "Curated itinerary · map · journey graph", customer: "Their trip, in the brand's voice" },
        { n: 6, icon: "document-chart", label: "Proposal Preparation", agent: "proposal.md written — rendered to skim, ready to send", customer: "A clean page with a live quote" },
        { n: 7, icon: "checkmark-filled", label: "Booking Support / Next Best Actions", agent: "Gated holds · repricing · next-best-action", customer: "Their page updates live — reserved, repriced, explained" },
      ],
    },

    /* journey graph — one linear diagram: price timeline + stays, flights,
       changes, session events and market/customer feedback flags */
    journey: {
      bravo: {
        title: "Journey graph — the Carter trip on one line",
        sub: "Package price by departure day · stays & transfers as bands · your portal actions logged as events · feedback flags where the agency should act",
        yMin: 6800, yMax: 7700, cap: 7400, capLabel: "Carter budget cap €7,400",
        priceLabel: "Roma · Firenze · Amalfi — Family Select · family 2+1 · live pricing API",
        labels: ["8 Aug","9 Aug","10 Aug","11 Aug","12 Aug","13 Aug","14 Aug","15 Aug","16 Aug","17 Aug","18 Aug","19 Aug","20 Aug","21 Aug","22 Aug","23 Aug","24 Aug","25 Aug","26 Aug","27 Aug","28 Aug","29 Aug","30 Aug","31 Aug"],
        prices: [7060,7080,7100,7120,7150,7175,7200,7230,7210,7190,7170,7150,7130,7140,7150,7120,7090,7060,7040,7020,7000,6980,6970,6960],
        flags: [
          { from: 7, to: 11, kind: "address", label: "Fare eases −€90 · 15–18 Aug", detail: "The later week eases past the Ferragosto peak — propose starting a few days later. This is the window V2 moves into." },
          { from: 4, to: 4, kind: "consider", label: "Ferragosto peak 15 Aug", detail: "National holiday demand — allotments and trains fill fast around the 15th, confirm holds early." },
          { from: 12, to: 12, kind: "consider", label: "Amalfi coast-road risk", detail: "Single coastal road — a closure can disrupt transfers; ferry re-routes are the fallback (the V3 recovery)." },
          { from: 4, to: 14, kind: "keep", label: "Family rooms & short transfers praised", detail: "Review sentiment 4.6/5 on the stated must-haves — keep them headline in the proposal." },
          { from: 11, to: 14, kind: "consider", label: "Afternoon heat feedback", detail: "Reviews mention hot afternoons in the cities — favour slow mornings for travel with a 2-year-old." },
        ],
      },
      turisanda: {
        title: "Journey graph — Giappone d'Autore on one line",
        sub: "Quota by departure day · route stops as bands · live reprice logged · seasonal flags the agency should weigh",
        yMin: 9400, yMax: 10500, cap: null,
        priceLabel: "Per couple · live Neos/JAL fares",
        labels: ["10 Oct","11 Oct","12 Oct","13 Oct","14 Oct","15 Oct","16 Oct","17 Oct","18 Oct","19 Oct","20 Oct","21 Oct","22 Oct","23 Oct","24 Oct"],
        prices: [9920,9880,9840,9860,9900,9950,9990,10040,10080,10120,10180,10220,10260,10300,10340],
        repriceIdx: 2,
        stops: [
          { from: 2, to: 5, label: "Tokyo", color: "#29707A" },
          { from: 5, to: 7, label: "Hakone", color: "#3E8AC2" },
          { from: 7, to: 10, label: "Kyoto", color: "#8A4FBF" },
          { from: 10, to: 11, label: "Nara", color: "#E68A00" },
          { from: 11, to: 12, label: "Osaka", color: "#FF462D" },
        ],
        flags: [
          { from: 0, to: 3, kind: "consider", label: "Typhoon tail risk · early Oct", detail: "Pacific tails can clip Tokyo arrivals — keep rebooking flexibility on the outbound." },
          { from: 9, to: 12, kind: "keep", label: "Momiji begins in Kyoto", detail: "Foliage season opens — the D6–8 Kyoto window lands exactly on it. Don't move it." },
          { from: 12, to: 14, kind: "address", label: "JAL return fares climbing", detail: "Returns after 22 Oct price up — lock the KIX→FCO leg this week." },
        ],
      },
    },

    /* Turisanda curated scenario — Giappone d'autore */
    japan: {
      title: "Giappone d'Autore", route: "Tokyo · Hakone · Kyoto · Osaka", nights: 10, party: "Ferrante couple · 2 adults",
      window: "12–22 October 2026", basePrice: 9840, commissionPct: 13,
      days: [
        { d: "D1–3", place: "Tokyo", s: "Signature hotel in Otemachi · omakase dinner booked · Tokyo by night with a guide" },
        { d: "D4–5", place: "Hakone", s: "Gōra Kadan ryokan · private-onsen suite · Fuji view, in-room kaiseki" },
        { d: "D6–8", place: "Kyoto", s: "Historic ryokan in the Gion district · private tea ceremony · Fushimi Inari at dawn" },
        { d: "D9", place: "Nara & Uji", s: "Tōdai-ji and the Great Buddha · matcha tasting in Uji" },
        { d: "D10", place: "Osaka", s: "Kuromon market · evening departure from Kansai (KIX)" },
      ],
      logistics: "Neos FCO→HND + JAL KIX→FCO flights · Shinkansen Green Class · private transfers",
    },
  };

  return { fmtEUR, brands, receipts, products, SHELVES, BRIEF, chips, blockers, addons, availability, PLAN, STAGE_LABEL, desk, pulse, priceCalendar, fitMatrix, milestones, overnight, tredi };
})();
