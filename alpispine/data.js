/* ============================================================
   Alpitour Tour Operations on KAF — the agentic spine
   ONE orchestration record. Back end (planner/ops) and front
   end (traveler / agency) are two lenses on this same record.
   Worked example: an allotment disruption at a Red Sea resort,
   traced end-to-end in under an hour. Anchored on the AlpiGPT
   orchestration blueprint + the Bianchi trip thread. Illustrative data.
   ============================================================ */
(function () {
  const D = {};

  /* ---------- The single orchestration record ---------- */
  D.event = {
    id: "EVT-2026-0810",
    trace: "TRC-2026-0810",
    title: "Allotment disruption · Jaz Mirabel Beach",
    trigger: "Hotelier signal · West-wing closure, August allotment cut 40%",
    severity: "high",
    opened: "10-Jun-2026 06:14 CET",
    status: "Awaiting duty-planner sign-off",
    cracker: "Sharm el-Sheikh, EG · Jaz Mirabel · West wing",
    blast: "14 departures · 2 resorts · 1 carrier · 1 strategic agency",
    atRisk: "Rossi Travel · BK 88412 · Famiglia Bianchi",
    record: "one record · every agent action + every PAC check writes here",
  };

  /* ---------- LAYER 01 · KAF agents (on top) ---------- */
  D.agents = [
    {
      id: "anomaly", n: 1, name: "Disruption agent", verb: "DETECT", icon: "anomaly",
      color: "var(--k-warm-red-50)", tint: "var(--k-warm-red-10)",
      owns: "Neos ops, hotelier, advisory and booking feeds",
      line: "I watch every signal and open a ticket the moment something breaks the plan.",
      status: "done", now: "Opened ticket on Jaz Mirabel allotment cut", asks: "auto-action bounds",
    },
    {
      id: "cost", n: 4, name: "Yield agent", verb: "PRICE", icon: "document-chart",
      color: "#E68A00", tint: "#FCEFD7",
      owns: "Margin-aware package & departure scoring",
      line: "I recompute margin and refund exposure every time supply or demand moves.",
      status: "done", now: "Flagged margin floors on 14 departures", asks: "Finance margin floors",
    },
    {
      id: "inventory", n: 2, name: "Allotment agent", verb: "REBALANCE", icon: "network",
      color: "var(--k-spruce-60)", tint: "var(--k-spruce-10)",
      owns: "Room & seat positioning across brands and resorts",
      line: "I move rooms and seats across the network and keep allotment fill on target.",
      status: "active", now: "Re-pointing West wing → BravoClub guaranteed block", asks: "fill-rate targets + agency covenants",
    },
    {
      id: "demand", n: 3, name: "Demand agent", verb: "FORECAST", icon: "analytics",
      color: "var(--k-blue-60)", tint: "#E3EEF8",
      owns: "Continuous booking forecast · risk per departure/destination",
      line: "I update the forecast as the signals arrive, and I tell you what's at risk.",
      status: "queued", now: "Holding for re-point commit", asks: "forecast version control + audit",
    },
  ];

  /* ---------- Agent run scripts (Layer 01 ↔ PAC round-trips) ----------
     Each agent: plan → dispatch → one or more acts, each gated by a PAC
     check. Outcomes span all four: allow · flag · deny · route-to-human.
     bound ids link to D.bounds for the Layer 01↔02 connection highlight. */
  D.spineRunOrder = ["anomaly", "cost", "inventory", "demand"];
  D.agentRuns = {
    anomaly: {
      bound: "plant",
      steps: [
        { ph: "Plan", t: "Correlate the Jaz Mirabel allotment notice across the hotelier portal, booking platform and Neos feeds." },
        { ph: "Dispatch", t: "Confirm it breaks the planning assumption on August — committed rooms down 40% in one notice." },
      ],
      checks: [{
        act: "Open an incident ticket and alert the duty planner",
        tool: "ops.ticket.create", rule: "OPS-auto-ticket-EG", bound: "plant",
        q: "Open a ticket and notify the planner automatically?",
        outcome: "allow",
        verdict: "Within auto-action bounds — monitoring may open tickets and alert owners without sign-off.",
        result: "Ticket TO-2026-0810 opened · duty planner notified",
      }],
    },
    cost: {
      bound: "finance",
      steps: [
        { ph: "Plan", t: "Recompute margin and refund exposure for every departure touched by the allotment cut." },
        { ph: "Dispatch", t: "Score each departure's margin against the Finance floor, per brand." },
      ],
      checks: [{
        act: "Auto-reprice the 14 departures that fell below the margin floor",
        tool: "pricing.reprice", rule: "FIN-margin-floor-IT", bound: "finance",
        q: "Reprice the below-floor departures automatically?",
        outcome: "flag",
        verdict: "Repricing is not auto-authorized — margin-floor breaches are flagged to the yield desk. An agent never moves price on its own.",
        result: "14 departures flagged to Finance · margins logged, no price changed",
      }],
    },
    inventory: {
      bound: "trade",
      steps: [
        { ph: "Plan", t: "Find covenant-safe ways to cover the August departures while the West wing is closed." },
        { ph: "Dispatch", t: "Score a West wing → BravoClub guaranteed-block re-point on fill rate and agency covenants." },
      ],
      checks: [{
        act: "Commit the re-point for the Rossi Travel covenant booking (Bianchi · 3 pax)",
        tool: "booking.repoint.write", rule: "PROM-covenant-rossi", bound: "trade",
        q: "Commit a re-point that touches a strategic-tier agency covenant?",
        outcome: "route", owner: "Duty planner · summer desk",
        verdict: "Allowed, but a covenant-affecting commit must be confirmed by the planner who owns the desk.",
        result: "Re-point committed · 38 rooms → guaranteed block · Bianchi's 14-Aug date held",
        rejected: "Re-point held · standard allotment kept · exception escalated to Planning",
      }],
    },
    demand: {
      bound: "product",
      steps: [
        { ph: "Plan", t: "Re-forecast August demand for the affected departures as the re-point commits." },
        { ph: "Dispatch", t: "Split the revision into an agency-visible change and an internal update." },
      ],
      checks: [
        {
          act: "Publish the revised confirmations straight to the agency portal",
          tool: "portal.commitment.write", rule: "PROM-agency-commitment", bound: "product",
          q: "Push an agency-visible booking change directly?",
          outcome: "deny",
          verdict: "Denied — an agency-visible commitment can't originate from an agent. Routed to the trade desk to confirm.",
          result: "Agency-facing change blocked · drafted for trade-desk review",
        },
        {
          act: "Update the internal forecast to v2026.33.2 with full audit",
          tool: "forecast.publish", rule: "PROM-forecast-version", bound: "product",
          q: "Bump the internal forecast version with audit attached?",
          outcome: "allow",
          verdict: "Within bounds — internal forecast updates are auto-authorized when versioned and audited.",
          result: "Forecast v2026.33.2 published internally · audit attached",
        },
      ],
    },
  };

  /* ---------- LAYER 02 · PAC bounds (underneath) ---------- */
  D.bounds = [
    { id: "finance", n: 1, name: "Commercial bounds", icon: "document-chart",
      desc: "Refund-exposure limits and margin floors, per brand and season.", rules: 42, owner: "Finance" },
    { id: "trade", n: 2, name: "Travel compliance", icon: "warning-alt",
      desc: "Package Travel Directive, EU261, entry rules, advisories and agency covenants.", rules: 67, owner: "Compliance" },
    { id: "plant", n: 3, name: "Ops SOPs", icon: "network",
      desc: "Neos rotations, crew & slot constraints, hotelier contracts, transfer ops.", rules: 38, owner: "Operations" },
    { id: "product", n: 4, name: "Brand & promise rules", icon: "information",
      desc: "Board, room-type, amenity and price promises per brand and agency tier.", rules: 51, owner: "Product / Brands" },
  ];

  /* ---------- Shared open foundation ---------- */
  D.foundation = ["Containers", "PostgreSQL", "Observability", "Secrets", "Identity"];
  D.connectors = [
    { id: "BOOKING", sub: "EasyBook · system of record", io: "read + write" },
    { id: "AVIATION", sub: "Neos ops · OCC", io: "read" },
    { id: "HOTELIER", sub: "allotments / contracts", io: "read + write" },
    { id: "CRM", sub: "agency + covenants", io: "read" },
  ];

  /* ---------- The reference flow (HERO) ---------- */
  D.flow = [
    {
      t: "T+0 min", at: "06:14", title: "Disruption detected", runBy: "anomaly", packet: "Signal packet",
      desc: "The hotelier portal posts a West-wing closure for August. The disruption agent opens a ticket against the affected resort and departures.",
      pac: [{ rule: "OPS-SOP-rotation", result: "pass", note: "no Neos rotation conflict on the affected dates" }],
      erp: [], surfaces: "Ticket opened on EVT-2026-0810",
    },
    {
      t: "T+5 min", at: "06:19", title: "Yield recomputed", runBy: "cost", packet: "Signal · yield",
      desc: "Yield agent recalculates margin and refund exposure for every departure that depends on this allotment. Margin floors flagged on 14 departures.",
      pac: [{ rule: "FIN-margin-floor-IT", result: "flag", note: "14 departures at or below floor on re-accommodation" }],
      erp: [], surfaces: "Margin recomputed · 14 departures flagged",
    },
    {
      t: "T+12 min", at: "06:26", title: "Policy check", runBy: "pac", packet: "Policy packet",
      desc: "Allotment agent prepares a re-point across two room blocks. PAC evaluates the proposed action before anything commits.",
      pac: [
        { rule: "FIN-refund-exposure-EU", result: "pass", note: "re-point within refund-exposure limit (€310k headroom)" },
        { rule: "TRV-advisory-EG", result: "pass", note: "South Sinai advisory level unchanged · no PTD trigger" },
        { rule: "PROM-covenant-rossi", result: "pass", note: "Rossi covenant: room class + family amenities preserved on re-point" },
      ],
      erp: [], surfaces: "Re-point proposal cleared · allow",
    },
    {
      t: "T+20 min", at: "06:34", title: "Booking platform updated", runBy: "inventory", packet: "Action packet",
      desc: "Allotment agent commits the room re-points and block swaps. Demand agent updates the destination forecast for the affected departures.",
      pac: [{ rule: "FIN-refund-exposure-EU", result: "pass", note: "post-commit exposure re-checked, still in bounds" }],
      erp: [
        "Re-point RP-20814 · West wing → BravoClub guaranteed block (38 rooms)",
        "Booking swap · BK 88412 Bianchi → guaranteed block, room class held",
        "Forecast v2026.33.2 · EG Red Sea, 14 departures",
      ],
      surfaces: "3 booking writes committed · forecast updated",
    },
    {
      t: "T+55 min", at: "07:09", title: "Planner sign-off", runBy: "human", packet: "Promise packet",
      desc: "The duty planner sees a single screen: cause, the agents that acted, every PAC check, every booking write. One click confirms or overrides.",
      pac: [], erp: [], surfaces: "Awaiting one-click confirm / override",
    },
  ];

  /* ---------- BRD · document to code (PAC source layer) ---------- */
  D.brd = {
    name: "Alpitour Tour-Operating Playbook · Summer EU",
    file: "ALP-SOP-TO-EU-v3.1.pdf",
    version: "v3.1", signed: "M. Conti · Compliance · 24-May-2026",
    pages: 84, extracted: 198, compiled: 198, tests: 412,
    summary: "PAC reads the playbook Alpitour already runs the season on, extracts the underlying rules, and compiles them into executable policy — versioned, tested and signed off. The same artefact the reviewer reads is the one the runtime evaluates.",
    // What the playbook configures, in three columns:
    activities: [
      { name: "Continuous allotment rebalancing", from: "§4.2 Room & seat positioning policy", agent: "inventory" },
      { name: "Disruption response", from: "§2.1 Signal monitoring mandate", agent: "anomaly" },
      { name: "Yield & margin recomputation", from: "§6.3 Margin governance", agent: "cost" },
      { name: "Rolling booking forecast & risk scoring", from: "§5.4 Season-planning cadence", agent: "demand" },
    ],
    ontology: [
      { entity: "Resort", rel: "feeds → Allotment", note: "contract graph, 180+ properties" },
      { entity: "Allotment", rel: "sources → Departure", note: "room class + board lineage" },
      { entity: "Departure", rel: "fulfils → Agency covenant", note: "Bravo packages incl. Jaz Mirabel" },
      { entity: "Agency", rel: "holds → Covenant", note: "room class, amenities, price promise" },
    ],
    rights: [
      { actor: "Allotment agent", can: "Propose + commit re-points within bounds", gate: "PAC: refund exposure + covenant" },
      { actor: "Yield agent", can: "Recompute, flag — never commit price", gate: "advisory only" },
      { actor: "Duty planner", can: "Confirm / override any committed action", gate: "human-in-the-loop, logged" },
      { actor: "Compliance", can: "Author & version policy bundles", gate: "sign-off required to publish" },
    ],
    compile: [
      { label: "Read the document", sub: "84 pages · 11 sections parsed", out: "198 candidate rules" },
      { label: "Resolve the ontology", sub: "entities + relationships normalised", out: "9 entity types · 1 decision graph" },
      { label: "Compile policies (PAC)", sub: "prose → executable Rego modules", out: "198 policies · 412 tests pass" },
      { label: "Assign decision rights", sub: "who may propose, commit, override, publish", out: "4 actor roles bound" },
      { label: "Activate agents (KAF)", sub: "business activities → focused agents", out: "4 agents within bounds" },
    ],
  };

  /* ---------- The rule that fired (explainability anchor) ---------- */
  D.firedRule = {
    id: "PROM-covenant-rossi",
    name: "Rossi Travel agency covenant · room class + amenities preserved",
    decision: "allow",
    bound: "product",
    input: { agency: "Rossi Travel", booking: "BK 88412", package: "Jaz Mirabel Beach · Bravo", repoint_to: "BravoClub guaranteed block", amenities_locked: true },
    because: "repoint.room_class == covenant.room_class AND repoint.amenities ⊇ covenant.must_haves",
    source: "Playbook §7.1 — 'A re-accommodation must preserve the booked room class, board and family amenities for strategic-tier agencies.'",
    version: "alp-sop-to-eu-v3.1", at: "06:26 CET",
  };

  /* ---------- Audit-as-query (every decision, reason chain) ---------- */
  D.audit = [
    { id: "DEC-99412", at: "06:26:02", agent: "pac", action: "Evaluate re-point proposal", rule: "PROM-covenant-rossi", result: "allow", chain: "Playbook §7.1 → covenant amenities match → allow", region: "EG", customer: "Rossi Travel", actor: "Allotment agent" },
    { id: "DEC-99411", at: "06:26:01", agent: "pac", action: "Evaluate re-point proposal", rule: "TRV-advisory-EG", result: "allow", chain: "Playbook §3.4 → advisory level unchanged → no PTD trigger", region: "EG", customer: "—", actor: "Allotment agent" },
    { id: "DEC-99410", at: "06:26:00", agent: "pac", action: "Evaluate re-point proposal", rule: "FIN-refund-exposure-EU", result: "allow", chain: "Playbook §4.2 → €310k headroom → in bounds", region: "EU", customer: "—", actor: "Allotment agent" },
    { id: "DEC-99404", at: "06:19:11", agent: "cost", action: "Recompute margin & exposure", rule: "FIN-margin-floor-IT", result: "flag", chain: "Playbook §6.3 → 14 departures ≤ floor → route to yield desk", region: "EU", customer: "multi", actor: "Yield agent" },
    { id: "DEC-99388", at: "06:14:03", agent: "anomaly", action: "Open disruption ticket", rule: "OPS-SOP-rotation", result: "pass", chain: "Playbook §8.1 → no rotation conflict → safe to act", region: "EG", customer: "—", actor: "Disruption agent" },
  ];

  /* ---------- The customer (front-end lens) ---------- */
  D.customer = {
    name: "Famiglia Bianchi",
    site: "Bologna, IT · via Rossi Travel",
    po: "BK 88412 · Jaz Mirabel Beach",
    product: "Jaz Mirabel Beach · Bravo all-inclusive",
    program: "Summer 2026 · Sharm el-Sheikh",
    qty: "2 adults + 1 child (age 2)",
    promised: "14-Aug-2026",
    promisedNow: "14-Aug-2026", // held
    statusHead: "On track — rooms re-secured, your dates are protected",
    contact: "Giulia Rossi · Rossi Travel, Bologna",
  };

  /* ---------- Customer-facing timeline (with explainability) ----------
     Each step's `why` is the reason chain: agent → PAC rule → playbook line. */
  D.customerSteps = [
    {
      key: "ordered", phase: "Booking confirmed", state: "done", at: "21-May",
      plain: "Your week at Jaz Mirabel Beach was confirmed — family room, all inclusive, departing 14 August from Bologna.",
      why: { agent: null, rule: null, brd: "Playbook §7.1 — strategic-tier covenant: room class + amenities locked at booking." },
    },
    {
      key: "signal", phase: "Resort event detected", state: "done", at: "10-Jun 06:14",
      plain: "The resort announced a wing closure that touched the room block your booking sits in. We caught it the moment it was posted.",
      why: { agent: "anomaly", rule: "OPS-SOP-rotation", brd: "Playbook §2.1 — signal-monitoring mandate: watch every feed, open a ticket on a break." },
    },
    {
      key: "cost", phase: "Price & margin checked", state: "done", at: "10-Jun 06:19",
      plain: "We re-checked the price and conditions on your package. Your departure was one of the lines affected by the closure.",
      why: { agent: "cost", rule: "FIN-margin-floor-IT", brd: "Playbook §6.3 — margin governance: recompute exposure when supply is disrupted." },
    },
    {
      key: "reroute", phase: "Rooms re-secured — dates protected", state: "active", at: "10-Jun 06:34",
      plain: "Rather than move your holiday, we re-secured your rooms from our guaranteed BravoClub block. Same resort, same room class, same baby pool, same dates.",
      why: { agent: "inventory", rule: "PROM-covenant-rossi", brd: "Playbook §7.1 — a re-accommodation must preserve room class, board and family amenities for strategic-tier agencies." },
    },
    {
      key: "signoff", phase: "Final planner confirmation", state: "pending", at: "pending",
      plain: "An Alpitour duty planner is giving the adjustment a final one-click confirmation. Rossi Travel sees the locked confirmation the moment they do.",
      why: { agent: null, rule: null, brd: "Playbook §1.4 — human-in-the-loop: a planner confirms or overrides any committed action." },
    },
  ];

  /* ---------- Operator KPI strip ---------- */
  D.kpis = [
    { label: "Allotment fill rate", value: "86.4%", delta: "+2.1", dir: "up", good: true, sub: "summer programme · 12-wk" },
    { label: "Refund exposure avoided", value: "€1.2M", delta: "+€80k", dir: "up", good: true, sub: "season to date · re-accommodation" },
    { label: "Signal → action", value: "55 min", delta: "−4 days", dir: "down", good: true, sub: "vs. weekly ops call" },
    { label: "Auto-action in bounds", value: "84%", delta: "+6.0", dir: "up", good: true, sub: "PAC-cleared, no planner touch" },
  ];

  /* ---------- Anchored outcomes (blueprint targets) ---------- */
  D.outcomes = [
    { n: "01", line: "Quote turnaround", figure: "−50%", src: "AlpiGPT blueprint · Phase 1 target", why: "Automated search, ranking and proposal assembly across the seven-stage journey — quotes in minutes, not hours." },
    { n: "02", line: "Agent productivity", figure: "+30%", src: "AlpiGPT blueprint · target impact", why: "The right information and actions surfaced at each journey stage — more requests handled per agent per day." },
    { n: "03", line: "Proposal acceptance", figure: "+25%", src: "AlpiGPT blueprint · target impact", why: "Context + Recommendation agents apply persona signals — personalised itineraries aligned to client needs." },
    { n: "04", line: "B2B support escalations", figure: "−35%", src: "AlpiGPT blueprint · call-centre deflection", why: "Custom itinerary and modification workflows resolve complex requests without a ticket." },
  ];

  /* ---------- Planner queue dashboard ----------
     The operator's command surface: posture KPIs, weekly throughput,
     where exceptions route, and the filterable exception table. Each
     KPI filters the table; each row opens a detail drawer. */
  D.queueDash = {
    kpis: [
      { id: "waiting", label: "Exceptions waiting", val: "3", delta: "−2", dir: "down", good: true, sub: "need a human this week", filter: "waiting" },
      { id: "risk", label: "Value at risk", val: "€2.6M", delta: "+€0.4M", dir: "up", good: false, sub: "across open exceptions", filter: "open" },
      { id: "auto", label: "Auto-handled in bounds", val: "84%", delta: "+5pp", dir: "up", good: true, sub: "16 of 19 cleared PAC", filter: "auto" },
      { id: "ttr", label: "Avg time to route", val: "12 min", delta: "−7 min", dir: "down", good: true, sub: "signal → planner desk", filter: "all" },
    ],
    // 12 weeks · events split into auto-handled vs routed-to-human
    throughput: [
      { wk: "W01", auto: 11, routed: 4 }, { wk: "W02", auto: 13, routed: 3 }, { wk: "W03", auto: 12, routed: 5 },
      { wk: "W04", auto: 15, routed: 2 }, { wk: "W05", auto: 14, routed: 4 }, { wk: "W06", auto: 16, routed: 3 },
      { wk: "W07", auto: 13, routed: 6 }, { wk: "W08", auto: 17, routed: 2 }, { wk: "W09", auto: 15, routed: 4 },
      { wk: "W10", auto: 18, routed: 3 }, { wk: "W11", auto: 14, routed: 5 }, { wk: "W12", auto: 16, routed: 3 },
    ],
    routing: [
      { label: "Auto-handled in bounds", n: 16, color: "var(--k-status-success-100)" },
      { label: "Planner desk", n: 1, color: "var(--k-status-warning-100)" },
      { label: "Finance", n: 1, color: "var(--k-spruce-60)" },
      { label: "Compliance", n: 1, color: "var(--k-warm-red-50)" },
    ],
  };

  /* ---------- Planner queue · the exceptions, with evidence attached ---------- */
  D.queue = [
    { id: "EVT-2026-0810", title: "Allotment disruption · Jaz Mirabel", sev: "high", cat: "waiting",
      why: "14 departures pushed to margin floor by a resort wing closure", state: "Awaiting sign-off", val: "€1.4M",
      owner: "Duty planner · summer desk", age: "8 min", routedTo: "Planner desk", agents: ["Disruption", "Yield", "Allotment"],
      evidence: ["12 PAC checks passed", "3 booking writes staged", "Covenant + margin floor verified"], primary: true },
    { id: "EVT-2026-0789", title: "Covenant conflict · Marsa Select", sev: "critical", cat: "waiting",
      why: "Proposed re-point would drop the sea-view promise on a Francorosso tier booking", state: "Blocked · planner required", val: "€240k",
      owner: "Compliance + planner", age: "2 h", routedTo: "Planner desk", agents: ["Allotment", "Yield"],
      evidence: ["PAC denied auto-commit", "Covenant CFL-014 cited", "Awaiting override authority"], primary: false },
    { id: "EVT-2026-0796", title: "Fuel surcharge change · EG routes", sev: "medium", cat: "routed",
      why: "Cost-to-serve up 4% on 6 Neos routes after a surcharge revision", state: "Routed to Finance", val: "€180k",
      owner: "Finance · yield desk", age: "1 d", routedTo: "Finance", agents: ["Yield"],
      evidence: ["Recompute logged", "Margin impact modeled", "No covenant breach"], primary: false },
    { id: "EVT-2026-0801", title: "ATC strike · Italian airspace", sev: "medium", cat: "auto",
      why: "Departure re-time of 4 hours across 3 rotations, absorbed within buffer", state: "Auto-handled in bounds", val: "€310k",
      owner: "Allotment agent", age: "3 d", routedTo: "Auto-handled", agents: ["Demand", "Allotment"],
      evidence: ["Within rotation buffer", "Promise dates held", "PAC cleared"], primary: false },
    { id: "EVT-2026-0777", title: "Demand drift · Rodi packages", sev: "low", cat: "auto",
      why: "Booking signal moved 3%, re-pointed within tolerance", state: "Auto-handled in bounds", val: "€85k",
      owner: "Demand agent", age: "4 d", routedTo: "Auto-handled", agents: ["Demand"],
      evidence: ["Inside ±5% tolerance", "Forecast v2026.33 refreshed", "PAC cleared"], primary: false },
    { id: "EVT-2026-0762", title: "Spot-rate dip · SSH hotel beds", sev: "low", cat: "auto",
      why: "Bed-bank rates eased 2%; yield model refreshed, no action needed", state: "Auto-handled in bounds", val: "€95k",
      owner: "Yield agent", age: "5 d", routedTo: "Auto-handled", agents: ["Yield"],
      evidence: ["Advisory only", "Margins above floor", "No write required"], primary: false },
  ];

  /* ---------- Decision Graph · the modeled layer the agents reason over ----------
     One ontology resolved from the playbook. Agency → Covenant → Package → Allotment ← Resort wing,
     plus proposal lineage as first-class entities. */
  D.graph = {
    nodes: [
      { id: "cust", label: "Rossi Travel", type: "Agency", x: 50, y: 50, kind: "customer" },
      { id: "cov", label: "Covenant · room + amenities", type: "Contract", x: 50, y: 150, kind: "policy" },
      { id: "sku", label: "Jaz Mirabel · 7n all-inclusive", type: "Package / departure", x: 50, y: 250, kind: "sku" },
      { id: "plantF", label: "BravoClub guaranteed block", type: "Allotment", x: 250, y: 210, kind: "plant" },
      { id: "plantT", label: "Standard allotment · West wing", type: "Allotment", x: 250, y: 300, kind: "plant" },
      { id: "crack", label: "Jaz Mirabel · West wing", type: "Resort wing", x: 430, y: 300, kind: "cracker" },
      { id: "feed", label: "Hotelier contract", type: "Contract feed", x: 430, y: 390, kind: "signal" },
      { id: "sample", label: "Proposal P-20418", type: "Proposal", x: 250, y: 90, kind: "lims" },
      { id: "test", label: "Family must-have check", type: "Fit result", x: 430, y: 60, kind: "lims" },
    ],
    edges: [
      { from: "cust", to: "cov", label: "holds" },
      { from: "cov", to: "sku", label: "binds" },
      { from: "sku", to: "plantF", label: "sourced from" },
      { from: "sku", to: "plantT", label: "sourced from" },
      { from: "plantT", to: "crack", label: "fed by" },
      { from: "crack", to: "feed", label: "governed by" },
      { from: "cust", to: "sample", label: "requested" },
      { from: "sample", to: "sku", label: "of package" },
      { from: "sample", to: "test", label: "has result" },
    ],
  };

  /* ---------- Proposal lineage (first-class entities) ---------- */
  D.lims = {
    sample: "P-2026-20418",
    grade: "Jaz Mirabel Beach · Bravo",
    lot: "BravoClub block · Sharm el-Sheikh",
    status: "In review",
    lineage: [
      { stage: "Requested", at: "10-Jun 06:35", note: "AlpiGPT · re-accommodation options composed", state: "done" },
      { stage: "Rooms reserved", at: "10-Jun 09:10", note: "Guaranteed block · family room + cot held", state: "done" },
      { stage: "Family must-have check", at: "11-Jun (planned)", note: "baby pool · kids' club · family room verified", state: "active" },
      { stage: "Price & covenant QC", at: "11-Jun (planned)", note: "€3,480 total · covenant price promise held", state: "pending" },
      { stage: "Result → proposal update", at: "12-Jun (planned)", note: "feeds the V2 proposal + audit", state: "pending" },
    ],
  };

  /* ---------- Agency FE · AI-native decision canvas ----------
     The front end the agency drives (EasyBook · AlpiGPT). Plain-language
     intent in; the spine infers everything the old forms asked for and
     returns a decision, not a form. */
  D.cx = {
    greeting: "Ciao Giulia — BK 88412 (Famiglia Bianchi · Jaz Mirabel Beach, departing 14 Aug) is the live booking I'm watching. Ask me about it in plain language, or tell me what the family needs next. No forms.",
    account: "Rossi Travel · Bologna, IT · Welcome Travel Group",
    suggestions: [
      "Is the Bianchi 14-Aug departure still safe after the Jaz Mirabel wing closure?",
      "What's the closest family resort I can switch BK 88412 to without losing the baby pool?",
      "The grandparents want to join — what does a 5-pax option on the same dates look like?",
      "Show me what else in my portfolio is exposed to this allotment cut",
    ],
    exposure: [
      { sku: "Jaz Mirabel Beach", order: "BK 88412 · Bianchi · 3 pax", status: "Re-secured", tone: "spruce", note: "Moved to BravoClub guaranteed block · 14-Aug date held" },
      { sku: "Coral Bay Family Resort", order: "BK 88396 · Ferrari · 4 pax", status: "Monitoring", tone: "amber", note: "Different wing · no action needed yet" },
      { sku: "Jaz Mirabel Beach", order: "Group quote · Q-1182 · 12 pax", status: "At risk", tone: "red", note: "West-wing block · flagged for re-point" },
    ],
    brief: "Family of three — two adults and a two-year-old girl. Mid-August, around €3,500 all-in, all-inclusive. The non-negotiables: a proper baby pool, a kids' club, and a family room. They loved Sharm in 2024.",
    parsed: [
      { k: "Destination", v: "Sharm el-Sheikh, Egypt" },
      { k: "When", v: "mid-August · flexible ±1 week" },
      { k: "Party", v: "2 adults + 1 child (age 2)" },
      { k: "Board", v: "All inclusive" },
      { k: "Budget", v: "≈ €3,500 per family" },
      { k: "Must-haves", v: "Baby pool · kids' club · family room" },
    ],
    thinking: [
      { label: "Read the brief into 6 requirements", sub: "Requirements agent · no forms — inferred", state: "done", ts: "+0.3s" },
      { label: "Matched the brand portfolio to the family", sub: "Inventory + Recommendation · catalog.match · 4 candidates", state: "done", ts: "+1.0s" },
      { label: "Checked entry rules for the destination", sub: "Travel compliance · EG e-visa + passport validity · IT", state: "done", ts: "+1.6s" },
      { label: "Checked availability & allotment risk", sub: "Tour-ops spine · live allotments + disruption alert", state: "done", ts: "+2.2s" },
      { label: "Cleared the answer for agency-facing use", sub: "PAC · policy.evaluate · allow", state: "done", ts: "+2.6s" },
      { label: "Predicted hold and confirmation dates", sub: "sla.predict · live allotment + rotation", state: "done", ts: "+3.0s" },
    ],
    decision: {
      product: "Jaz Mirabel Beach",
      family: "Bravo · all-inclusive family resort",
      confidence: 94,
      fit: "Best fit for a toddler + the budget",
      reasons: [
        "The shallow lagoon pool and shaded baby pool are the strongest toddler setup in the Sharm programme — exactly the family's non-negotiables.",
        "BravoClub kids' club with Italian-speaking staff, family rooms a step from the pool — directly on the 2024 trip they loved.",
        "Guaranteed BravoClub block means the rooms hold even through the West-wing closure, so the hold can be placed now.",
      ],
      regulatory: {
        summary: "Egypt entry: passports valid ≥ 6 months, e-visa issued on our side. South Sinai resort corridor — no advisory above level 2 for the travel window.",
        chips: ["EG e-visa · handled", "Passports ≥ 6 months", "Advisory · level 2 · unchanged"],
        source: "TravelRadar · EG entry bundle v2026.05 · 27-May-2026",
        disclaimer: "Informational guidance — not a formal consular confirmation. The trade desk can issue formal documents.",
      },
      availability: {
        state: "supply-aware",
        line: "Family room held in the BravoClub guaranteed block.",
        risk: "The standard West-wing allotment is under an active disruption — the spine already re-pointed this booking to the guaranteed block, so the dates hold.",
      },
      citations: ["Jaz Mirabel fact sheet · rev 5", "Bravo family-resort selection guide", "TravelRadar · EG entry bundle v2026.05"],
      caveat: "Confirm the cot and high chair for arrival day with the resort — the concierge desk can validate on the rooming list.",
      sampleReady: "72-h hold",
      sampleReadyNote: "option held in the guaranteed block",
      delivery: "14-Aug-2026",
      deliveryNote: "BLQ → SSH · Neos direct · within the family's window",
      pacState: "clear",
      pacNote: "No entry, advisory or brand-promise restrictions for this party. Answer cleared for agency-facing use.",
      alternatives: [
        { name: "Coral Bay Family Resort", note: "Strong kids' club, smaller baby pool" },
        { name: "Crete last minute", note: "Choose if budget becomes critical" },
      ],
    },
    requested: {
      id: "P-2026-20418",
      headline: "Hold placed — we handled the rest",
      did: [
        "Inferred destination, party and must-haves from the brief",
        "Pre-filled the rooming list and documents from the agency account",
        "Ran the entry-rule & policy check inline — cleared",
        "Reserved the family room from the BravoClub guaranteed block",
      ],
    },
  };

  /* ---------- Backtest / Replay lab ----------
     Replay the allotment-disruption event (EVT-2026-0810) under different PAC
     bundle versions. Each version yields different decisions, policy conflicts,
     and a different fill + customer-promise outcome. */
  D.backtest = {
    scenario: "EVT-2026-0810 · Allotment disruption · Jaz Mirabel Beach",
    rules: ["FIN-refund-exposure-EU", "TRV-advisory-EG", "PROM-covenant-rossi", "FIN-margin-floor-IT"],
    versions: [
      {
        id: "v3.0", label: "v3.0", tag: "previous", live: false,
        verdict: "route", verdictLabel: "Route to planner",
        decisions: { "FIN-refund-exposure-EU": "allow", "TRV-advisory-EG": "allow", "PROM-covenant-rossi": "route", "FIN-margin-floor-IT": "route" },
        conflicts: [],
        action: "No auto-action — every covenant-touching re-point waits for manual planner review.",
        doi: 81.3, doiDelta: "+0.0", transfer: "Held — manual queue", promise: "Bianchi family loses the family room", risk: "€1.4M exposed while queued",
        summary: "Safe but slow. The re-point that protects the Bianchi booking sits in a manual queue; rooms stay unsold and the promise is at risk.",
      },
      {
        id: "v3.1", label: "v3.1", tag: "live", live: true,
        verdict: "allow", verdictLabel: "Allow in bounds",
        decisions: { "FIN-refund-exposure-EU": "allow", "TRV-advisory-EG": "allow", "PROM-covenant-rossi": "allow", "FIN-margin-floor-IT": "flag" },
        conflicts: [],
        action: "Allotment agent commits the West wing → guaranteed-block re-point within bounds; planner confirms.",
        doi: 86.4, doiDelta: "+5.1", transfer: "Re-point RP-20814 committed (38 rooms)", promise: "Bianchi date held · 14-Aug", risk: "€0 exposed — promise protected",
        summary: "The balanced bundle. The re-point clears refund-exposure and covenant checks, margin is flagged not blocked, rooms refill and the dates hold.",
      },
      {
        id: "v3.2", label: "v3.2", tag: "draft", live: false,
        verdict: "deny", verdictLabel: "Conflict · blocked",
        decisions: { "FIN-refund-exposure-EU": "allow", "TRV-advisory-EG": "allow", "PROM-covenant-rossi": "allow", "FIN-margin-floor-IT": "deny" },
        conflicts: [
          {
            id: "CFL-014", a: "PROM-covenant-rossi", b: "FIN-margin-floor-IT",
            text: "The covenant requires preserving the Bianchi room class + dates (→ guaranteed-block re-point). Draft v3.2 raises the summer margin floor so the guaranteed-block rooms fall below floor. No action satisfies both rules.",
            resolve: "Route to Compliance + Finance — a covenant override or a margin-floor exception is required before the re-point can commit.",
          },
        ],
        action: "Re-point blocked by the tightened margin floor; the covenant cannot be honoured automatically.",
        doi: 81.3, doiDelta: "+0.0", transfer: "Blocked — conflict unresolved", promise: "Bianchi family loses the family room", risk: "€1.4M exposed · escalation required",
        summary: "The stricter draft protects margin but collides with the agency covenant — a policy conflict that strands rooms and the promise until a human resolves it.",
      },
    ],
  };

  /* ---------- Booking write-preview · staged before commit ----------
     The reference flow stages writes as a reversible preview. Each write
     carries a compensating transaction and a named rollback owner; nothing
     reaches the system of record until the planner confirms. */
  D.writePreview = {
    guard: "These writes are staged, not applied. Each carries a compensating transaction and a named rollback owner. Nothing touches the booking platform until the planner confirms below.",
    kill: "Kill switch · Digital Ops — reverts all staged writes in one action",
    staged: [
      { sys: "EasyBook · booking platform", op: "Re-point RP-20814", detail: "West wing → BravoClub guaranteed block · 38 rooms · 14 departures", comp: "Reverse re-point + restore standard block", owner: "Duty planner · summer desk", risk: "low" },
      { sys: "EasyBook · booking platform", op: "Booking swap · BK 88412", detail: "Bianchi family re-pointed to guaranteed block · room class held", comp: "Revert booking to standard allotment", owner: "Duty planner · summer desk", risk: "med" },
      { sys: "Forecast service", op: "Forecast v2026.33.2", detail: "EG Red Sea · 14 departures re-pointed", comp: "Roll back to forecast v2026.33.1", owner: "Demand planner", risk: "low" },
    ],
  };

  /* ---------- Deployment-gate ladder · shadow → bounded autonomy ----------
     The promotion path the lab governs. Agency-visibility and write-back
     widen one gate at a time, each behind explicit exit criteria. */
  D.gates = {
    current: "g3",
    summary: "The pilot is at gate 3 — internal, human-approved, write-previews only. Agency-visible commitments (gate 4) unlock only after audit completeness holds and Legal + Compliance sign off. Each gate widens write-back by exactly one step.",
    stages: [
      { id: "g1", n: 1, name: "Internal replay", scope: "Backtest fixtures only", visible: "None", writes: "None", state: "passed",
        exit: [{ t: "All must-have policy tests pass", ok: true }, { t: "Masked-log verification clean", ok: true }] },
      { id: "g2", n: 2, name: "Live shadow", scope: "Live events · observe-only", visible: "None", writes: "None", state: "passed",
        exit: [{ t: "No critical false positives", ok: true }, { t: "Planner acceptance ≥ 80%", ok: true }] },
      { id: "g3", n: 3, name: "Human-approved · internal", scope: "Planner confirms every action", visible: "None", writes: "Preview → planner commit", state: "current",
        exit: [{ t: "Approved-action accuracy ≥ target", ok: true }, { t: "Audit completeness = 100%", ok: false }] },
      { id: "g4", n: 4, name: "Agency pilot", scope: "Selected low-risk agencies", visible: "Selected agencies", writes: "Human-approved writes", state: "locked",
        exit: [{ t: "Legal sign-off", ok: false }, { t: "Compliance sign-off", ok: false }, { t: "CX error ≤ threshold", ok: false }] },
      { id: "g5", n: 5, name: "Bounded autonomy", scope: "Expanded auto-action in bounds", visible: "Yes", writes: "Bounded auto-writes", state: "locked",
        exit: [{ t: "Thresholds hold over rolling window", ok: false }, { t: "Governance-board approval", ok: false }] },
    ],
  };

  /* ---------- Three-part accountability spine · named owners ----------
     One role is accountable for the journey, one for the platform, one for
     the guardrails. Maps to the operating-model artefact. */
  D.accountability = [
    { layer: "Commercial journey", owner: "Revenue Ops · trade journey owner", color: "var(--k-spruce-60)", tint: "var(--k-spruce-10)", icon: "recommend",
      owns: "Agency experience, inquiry-to-booking conversion, account orchestration, commercial KPIs", scope: "Owns the inquiry-to-travel journey as a product." },
    { layer: "Operational platform", owner: "Digital Ops · platform owner", color: "#6B36A8", tint: "#F3ECFB", icon: "network",
      owns: "Agent runtime, integrations, event bus, access control, observability, reliability, rollout gates", scope: "Owns the shared spine every lens runs on." },
    { layer: "Decision boundaries", owner: "Domain owners · Planning · Neos Ops · Trade desk · Finance · Compliance", color: "var(--k-warm-red-50)", tint: "var(--k-warm-red-10)", icon: "document-chart",
      owns: "Policy bundles, approval thresholds, exception adjudication, escalation owners", scope: "Own the guardrails the agents act within." },
  ];

  /* ---------- Controls & evidence · backend contracts, cited ----------
     Event taxonomy, data residency / masking, and security controls — each
     traced to the standard it is evidenced against. */
  D.citations = {
    opa: { label: "OPA · Open Policy Agent", note: "Policy decoupled from enforcement; signed + versioned bundles; opa test coverage; decision logs carry bundle revision, path, input, result and a unique decision ID; sensitive fields maskable in logs." },
    nist: { label: "NIST AI RMF", note: "Trustworthiness is incorporated across design, development, use and evaluation — not bolted on after deployment." },
    cloudevents: { label: "CloudEvents", note: "A common event envelope for cross-system routing; booking, aviation and hotelier feeds publish into one envelope." },
    sap: { label: "Integration Suite · Event Mesh", note: "APIs, event-driven integration, centralized governance and hybrid booking-platform + third-party connectivity." },
  };
  D.controls = {
    taxonomy: {
      cite: ["cloudevents", "sap"],
      envelope: "CloudEvents 1.0 · type · source · subject · id · time · traceparent",
      rows: [
        { name: "allotment.disruption.detected", payload: "resort, wing, rooms_pct, window", trace: "required", idem: "wing+window hash" },
        { name: "yield.recomputed", payload: "departures[], margin_floor_breaches[]", trace: "required", idem: "run_id" },
        { name: "inventory.repoint.proposed", payload: "repoints[], affected_covenants[]", trace: "required", idem: "proposal_id" },
        { name: "booking.write.committed", payload: "doc_id, system, compensating_txn", trace: "required", idem: "doc_id" },
        { name: "promise.revised", payload: "agency, booking, old_date, new_date, reason", trace: "required", idem: "booking+rev" },
      ],
    },
    residency: {
      cite: ["opa"],
      rows: [
        { region: "EU", processing: "EU-resident path · Milan", pii: "Traveler names, rooming lists", masked: "Traveler identity masked in decision logs", retention: "Audit 7y · prompts 30d" },
        { region: "Destination", processing: "Destination ops path · EG handling", pii: "Passport numbers, transfer manifests", masked: "Passport numbers hashed in logs", retention: "Audit 7y · prompts 30d" },
      ],
      note: "Region-specific processing paths are selected at deployment; policy decides which fields are masked or erased from the decision log before it is written.",
    },
    security: {
      cite: ["opa", "nist"],
      rows: [
        { area: "Identity & access", impl: "SSO + RBAC and ABAC — agency-specific data and cross-functional exception views gated by role." },
        { area: "Policy integrity", impl: "Signed bundles, explicit approvals, versioned promotion and rollback." },
        { area: "Auditability", impl: "Decision ID, trace ID, bundle revision, approver identity, timestamp, commit status, linked evidence." },
        { area: "Write safety", impl: "Write-preview first, compensating actions, kill switch, named rollback owner." },
        { area: "Model safety", impl: "No unsupported destination claims, no hidden price commitments, mandatory escalation on high-risk questions." },
      ],
    },
  };

  /* ---------- Learning loop · 'Learned from you' inbox + knowledge gaps ----------
     Every override, deny and unsupported answer becomes a teaching signal,
     routed to an owner and shown with the blast radius the agent applied. */
  D.learning = {
    inbox: [
      { id: "LRN-2041", kind: "skill", signal: "Planner override · approved covenant-safe re-point", from: "EVT-2026-0810 · Bianchi swap to guaranteed block", routed: "Policy owner + Digital Ops",
        change: "New reusable skill — auto-approve guaranteed-block re-points when room class + amenities are preserved", blast: "applied to 147 similar re-points · avg planner-touch −38 min", state: "live" },
      { id: "LRN-2038", kind: "policy", signal: "Compliance deny · margin-floor vs covenant conflict", from: "Backtest v3.2 · CFL-014", routed: "Policy owner · Finance",
        change: "Add covenant-override branch to FIN-margin-floor-IT with Finance approval gate", blast: "scoped to 14 summer departures · 1 new test case", state: "in review" },
      { id: "LRN-2034", kind: "content", signal: "Agency asked an unsupported question", from: "AlpiGPT · cot + high-chair availability on arrival day", routed: "Concierge desk + content",
        change: "New knowledge article — infant equipment confirmation on the rooming list", blast: "covers 9 recurring family questions", state: "drafting" },
      { id: "LRN-2029", kind: "skill", signal: "Agent repeated a manual workaround", from: "Trade desk · re-running availability check from email", routed: "Revenue Ops + platform",
        change: "New shortcut skill — re-secure preview surfaced inline on Booking status", blast: "removes a 4-step manual relay for 23 agencies", state: "live" },
    ],
    gaps: [
      { id: "GAP-118", q: "Baby-pool depth + lifeguard cover at Coral Bay", reason: "no validated resort data on file", owner: "Concierge desk", sev: "high" },
      { id: "GAP-117", q: "EG e-visa processing time for non-EU passports", reason: "answer below confidence threshold", owner: "Trade desk", sev: "high" },
      { id: "GAP-112", q: "Guaranteed-block limits for 5+ pax family parties", reason: "unsupported — outside published guidance", owner: "Contracting", sev: "medium" },
    ],
  };

  /* ---------- Group ontology · the generated semantic graph ----------
     The entity-type schema the playbook compiles into — entities (typed by
     domain) and the typed relationships between them. Rendered as a
     force-directed (neo4j-style) graph; the layout is generated, not placed. */
  D.ontologyGraph = {
    cats: {
      commercial: { c: "#334155", label: "Commercial" },
      product: { c: "#475569", label: "Product" },
      ops: { c: "#5B6B7B", label: "Operations" },
      quality: { c: "#64748B", label: "Concierge · proposals" },
      governance: { c: "#94A3B8", label: "Governance" },
      runtime: { c: "#B0BAC6", label: "Runtime" },
    },
    nodes: [
      { id: "Agency", cat: "commercial" },
      { id: "TravelAgent", cat: "commercial" },
      { id: "TripIntent", cat: "commercial" },
      { id: "HoldRequest", cat: "commercial" },
      { id: "Covenant", cat: "commercial" },
      { id: "Departure", cat: "product" },
      { id: "Package", cat: "product" },
      { id: "Document", cat: "product" },
      { id: "Resort", cat: "ops" },
      { id: "Rotation", cat: "ops" },
      { id: "Allotment", cat: "ops" },
      { id: "Route", cat: "ops" },
      { id: "QuoteCase", cat: "quality" },
      { id: "ConciergeTask", cat: "quality" },
      { id: "Proposal", cat: "quality" },
      { id: "FitResult", cat: "quality" },
      { id: "Playbook", cat: "governance" },
      { id: "PolicyBundle", cat: "governance" },
      { id: "PolicyRule", cat: "governance" },
      { id: "DecisionRight", cat: "governance" },
      { id: "UserRole", cat: "governance" },
      { id: "Event", cat: "runtime" },
      { id: "AgentRun", cat: "runtime" },
      { id: "WritePreview", cat: "runtime" },
      { id: "BookingCommit", cat: "runtime" },
      { id: "AuditRecord", cat: "runtime" },
    ],
    links: [
      { source: "TravelAgent", target: "Agency", rel: "member of" },
      { source: "Agency", target: "HoldRequest", rel: "creates" },
      { source: "Agency", target: "TripIntent", rel: "submits" },
      { source: "Agency", target: "Covenant", rel: "holds" },
      { source: "Covenant", target: "Departure", rel: "binds" },
      { source: "HoldRequest", target: "Departure", rel: "requests" },
      { source: "HoldRequest", target: "QuoteCase", rel: "triggers" },
      { source: "QuoteCase", target: "ConciergeTask", rel: "contains" },
      { source: "QuoteCase", target: "Proposal", rel: "uses" },
      { source: "ConciergeTask", target: "FitResult", rel: "produces" },
      { source: "Proposal", target: "Departure", rel: "of departure" },
      { source: "Departure", target: "Package", rel: "in package" },
      { source: "Departure", target: "Resort", rel: "stays at" },
      { source: "Departure", target: "Document", rel: "evidenced by" },
      { source: "Resort", target: "Rotation", rel: "served by" },
      { source: "Rotation", target: "Allotment", rel: "consumes" },
      { source: "Resort", target: "Route", rel: "reached via" },
      { source: "TripIntent", target: "Route", rel: "fulfilled on" },
      { source: "Allotment", target: "Event", rel: "breaks →" },
      { source: "Event", target: "Departure", rel: "affects" },
      { source: "Event", target: "Resort", rel: "affects" },
      { source: "Event", target: "AgentRun", rel: "triggers" },
      { source: "AgentRun", target: "PolicyRule", rel: "checks" },
      { source: "AgentRun", target: "WritePreview", rel: "proposes" },
      { source: "WritePreview", target: "BookingCommit", rel: "becomes" },
      { source: "BookingCommit", target: "AuditRecord", rel: "records" },
      { source: "Playbook", target: "PolicyBundle", rel: "compiles to" },
      { source: "Playbook", target: "DecisionRight", rel: "defines" },
      { source: "PolicyBundle", target: "PolicyRule", rel: "contains" },
      { source: "UserRole", target: "DecisionRight", rel: "holds" },
      { source: "UserRole", target: "WritePreview", rel: "approves" },
    ],
  };

  /* ---------- Next Best Actions · agent-ranked, routed to one screen ----------
     Surfaced through the floating NBA rail. Each item points the user at the
     single screen where they can act, with the reason it is being raised. */
  D.nba = [
    { id: "NBA-1", sev: "high", title: "Sign off the re-accommodation", lens: "ops", screen: "flow", cta: "Review & sign off",
      why: "3 booking writes are staged and reversible. The Bianchi 14-Aug date holds only once you release them." },
    { id: "NBA-2", sev: "high", title: "Resolve policy conflict CFL-014", lens: "ops", screen: "backtest", cta: "Open backtest lab",
      why: "Draft bundle v3.2 strands the re-point — covenant vs margin floor. Route to Compliance + Finance before it can promote." },
    { id: "NBA-3", sev: "med", title: "Close 2 high-severity knowledge gaps", lens: "ops", screen: "learning", cta: "Open inbox",
      why: "Unanswered questions are blocking confident agency answers — route them to the concierge and trade desks." },
    { id: "NBA-4", sev: "med", title: "Gate 4 promotion is blocked", lens: "ops", screen: "backtest", cta: "View deployment gates",
      why: "Audit completeness is below 100%. Close it to unlock agency-visible commitments." },
    { id: "NBA-5", sev: "info", title: "Notify Rossi Travel — rooms re-secured", lens: "cx", screen: "customer", cta: "See customer view",
      why: "The family room is held in the guaranteed block; the agency can update the family with the protected dates." },
  ];

  /* ---------- Business activities · compiled graph ----------
     Playbook → section → business activity → the agent that runs it. */
  D.activityGraph = {
    cats: {
      root: { c: "#5B6B7B", label: "Playbook" },
      source: { c: "#2A6FDB", label: "Playbook section" },
      activity: { c: "#29707A", label: "Business activity" },
      agent: { c: "#FF462D", label: "Agent" },
    },
    nodes: [
      { id: "Playbook", cat: "root" },
      { id: "§2.1", cat: "source" }, { id: "§4.2", cat: "source" }, { id: "§5.4", cat: "source" }, { id: "§6.3", cat: "source" },
      { id: "Disruption response", cat: "activity" }, { id: "Allotment rebalance", cat: "activity" }, { id: "Forecast risk", cat: "activity" }, { id: "Yield to serve", cat: "activity" },
      { id: "Disruption agent", cat: "agent" }, { id: "Allotment agent", cat: "agent" }, { id: "Demand agent", cat: "agent" }, { id: "Yield agent", cat: "agent" },
    ],
    links: [
      { source: "Playbook", target: "§2.1", rel: "defines" }, { source: "Playbook", target: "§4.2", rel: "defines" },
      { source: "Playbook", target: "§5.4", rel: "defines" }, { source: "Playbook", target: "§6.3", rel: "defines" },
      { source: "§2.1", target: "Disruption response", rel: "mandates" },
      { source: "§4.2", target: "Allotment rebalance", rel: "mandates" },
      { source: "§5.4", target: "Forecast risk", rel: "mandates" },
      { source: "§6.3", target: "Yield to serve", rel: "mandates" },
      { source: "Disruption response", target: "Disruption agent", rel: "run by" },
      { source: "Allotment rebalance", target: "Allotment agent", rel: "run by" },
      { source: "Forecast risk", target: "Demand agent", rel: "run by" },
      { source: "Yield to serve", target: "Yield agent", rel: "run by" },
    ],
  };

  /* ---------- Decision rights / access · compiled graph ----------
     Each actor's capability is gated, and every gate is enforced by PAC. */
  D.rightsGraph = {
    cats: {
      pac: { c: "#5B6B7B", label: "PAC runtime" },
      actor: { c: "#29707A", label: "Actor" },
      gate: { c: "#6B36A8", label: "Gate" },
    },
    nodes: [
      { id: "PAC", cat: "pac" },
      { id: "Allotment agent", cat: "actor" }, { id: "Yield agent", cat: "actor" }, { id: "Duty planner", cat: "actor" }, { id: "Compliance", cat: "actor" },
      { id: "Exposure + covenant", cat: "gate" }, { id: "Advisory only", cat: "gate" }, { id: "Human in loop", cat: "gate" }, { id: "Publish sign-off", cat: "gate" },
    ],
    links: [
      { source: "Allotment agent", target: "Exposure + covenant", rel: "propose + commit" },
      { source: "Yield agent", target: "Advisory only", rel: "recompute · flag" },
      { source: "Duty planner", target: "Human in loop", rel: "confirm / override" },
      { source: "Compliance", target: "Publish sign-off", rel: "author bundles" },
      { source: "Exposure + covenant", target: "PAC", rel: "enforced by" },
      { source: "Advisory only", target: "PAC", rel: "enforced by" },
      { source: "Human in loop", target: "PAC", rel: "enforced by" },
      { source: "Publish sign-off", target: "PAC", rel: "enforced by" },
    ],
  };

  /* ---------- Spine posture charts (Shidoka charts kit) ---------- */
  D.spineCharts = {
    gauges: [
      { label: "Auto-handled in bounds", val: 84, target: 90, unit: "%", sub: "16 of 19 events" },
      { label: "Audit completeness", val: 100, target: 100, unit: "%", sub: "every action logged" },
      { label: "PAC checks passed", val: 96, target: 98, unit: "%", sub: "412 of 430" },
      { label: "Acted within the hour", val: 88, target: 80, unit: "%", sub: "signal → action" },
    ],
    // PAC action-level mix (Level 0–4), share of decisions
    actionLevels: [
      { label: "L0 · answer only", n: 41, color: "#BEDDE2" },
      { label: "L1 · recommend", n: 22, color: "#5BA2AE" },
      { label: "L2 · human-approved", n: 19, color: "#29707A" },
      { label: "L3 · bounded auto", n: 16, color: "#1F5A63" },
      { label: "L4 · prohibited", n: 2, color: "#FF462D" },
    ],
    // 12-week trend — % of events actioned within the hour vs target
    trend: { labels: ["W27", "W28", "W29", "W30", "W31", "W32", "W33", "W34", "W35", "W36", "W37", "W38"],
      acted: [62, 64, 63, 68, 71, 73, 74, 79, 82, 84, 86, 88], target: 80 },
    // Event flow (one month) — signals fan out through governance to outcomes
    sankey: [
      { from: "Signals", to: "Auto-handled", flow: 71 },
      { from: "Signals", to: "Planner desk", flow: 7 },
      { from: "Signals", to: "Finance", flow: 4 },
      { from: "Signals", to: "Compliance", flow: 2 },
      { from: "Auto-handled", to: "Committed in bounds", flow: 71 },
      { from: "Planner desk", to: "Approved", flow: 5 },
      { from: "Planner desk", to: "Rejected", flow: 2 },
      { from: "Finance", to: "Approved", flow: 4 },
      { from: "Compliance", to: "Escalated", flow: 2 },
    ],
    // What the Disruption agent watches — signal volume by source feed (one week)
    watch: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [
        { label: "Booking · EasyBook", color: "#29707A", fill: "rgba(41,112,122,.35)", data: [120, 140, 135, 150, 170, 80, 60] },
        { label: "Aviation · Neos OCC", color: "#3E8AC2", fill: "rgba(62,138,194,.30)", data: [80, 95, 90, 110, 120, 55, 40] },
        { label: "Hotelier portals", color: "#5BA2AE", fill: "rgba(91,162,174,.30)", data: [60, 70, 68, 82, 90, 38, 30] },
        { label: "Advisory & market feeds", color: "#E68A00", fill: "rgba(230,138,0,.26)", data: [40, 52, 48, 60, 72, 28, 22] },
      ],
    },
    // Disruption pressure by feed × week — sequential01 heatmap
    heatmap: {
      cols: ["W27", "W28", "W29", "W30", "W31", "W32", "W33", "W34", "W35", "W36", "W37", "W38"],
      rows: [
        { feed: "Allotments", vals: [1, 2, 3, 2, 6, 4, 3, 2, 1, 1, 2, 5] },
        { feed: "Aviation", vals: [0, 1, 2, 1, 2, 3, 2, 4, 3, 2, 1, 2] },
        { feed: "Transfers", vals: [2, 1, 1, 0, 1, 2, 1, 3, 4, 2, 1, 1] },
        { feed: "Resort status", vals: [0, 0, 1, 2, 1, 0, 1, 2, 1, 3, 2, 1] },
        { feed: "Demand", vals: [1, 1, 0, 1, 2, 2, 1, 1, 2, 1, 3, 2] },
        { feed: "Advisories", vals: [3, 2, 2, 1, 4, 3, 2, 2, 1, 2, 2, 4] },
      ],
      max: 6,
    },
    // Events by destination — polar area
    regions: [
      { label: "EG · Red Sea", n: 42, color: "#29707A" },
      { label: "ES · Canaries", n: 28, color: "#3E8AC2" },
      { label: "GR · Islands", n: 19, color: "#8A4FBF" },
      { label: "IT · Mare Italia", n: 9, color: "#E68A00" },
      { label: "Long haul", n: 6, color: "#5C6A73" },
    ],
  };

  /* ---------- Learning-loop bubble — corrections by confidence × blast radius ---------- */
  D.learningChart = {
    // x: agent confidence at correction · y: blast radius (items the change touched) · r: scaled
    series: [
      { kind: "Reusable skill", color: "rgba(41,112,122,.55)", border: "#29707A", points: [
        { x: 92, y: 147, r: 20, label: "Guaranteed-block re-point auto-approve" },
        { x: 88, y: 23, r: 12, label: "Re-secure preview inline" },
        { x: 90, y: 64, r: 15, label: "Covenant-safe swap pattern" } ] },
      { kind: "Policy backlog", color: "rgba(107,54,168,.5)", border: "#6B36A8", points: [
        { x: 74, y: 14, r: 11, label: "Margin-floor covenant branch" },
        { x: 69, y: 9, r: 8, label: "Surcharge exception" } ] },
      { kind: "Content backlog", color: "rgba(154,101,0,.5)", border: "#9A6500", points: [
        { x: 63, y: 9, r: 9, label: "Infant equipment article" },
        { x: 58, y: 6, r: 7, label: "E-visa processing note" } ] },
    ],
  };

  /* ---------- Programme hierarchy — dendrogram (Group ontology alternate lens) ---------- */
  D.supplyHierarchy = {
    name: "Alpitour World · Red Sea",
    children: [
      { name: "Sharm el-Sheikh", kind: "plant", children: [
        { name: "Jaz Mirabel · West wing", kind: "cracker" },
        { name: "Bravo packages", kind: "family", children: [
          { name: "Jaz Mirabel 7n AI", kind: "sku" }, { name: "Jaz Mirabel 10n AI", kind: "sku" } ] },
        { name: "Rossi Travel", kind: "customer" } ] },
      { name: "Marsa Alam", kind: "plant", children: [
        { name: "Coral Bay · main", kind: "cracker" },
        { name: "Eden Viaggi packages", kind: "family", children: [
          { name: "Coral Bay 7n AI", kind: "sku" }, { name: "Coral Bay 9n AI", kind: "sku" } ] },
        { name: "Marsa Select", kind: "customer" } ] },
    ],
  };

  window.D = D;

  /* ---------- Backtest charts — version tradeoffs + decision matrix ---------- */
  D.backtestCharts = {
    radarDims: ["Refund exposure", "Service / promise", "Margin protection", "Covenant safety", "Speed to act", "Auditability"],
    radar: {
      "v3.0": [35, 45, 80, 70, 30, 88],
      "v3.1": [88, 92, 72, 90, 86, 95],
      "v3.2": [38, 42, 95, 55, 35, 90],
    },
    // allotment fill rate by version (higher is better)
    doi: { "v3.0": 81.3, "v3.1": 86.4, "v3.2": 81.3 },
  };

  window.D = D;
})();
