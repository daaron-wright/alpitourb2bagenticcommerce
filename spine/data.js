/* ============================================================
   Dow Supply Chain on KAF — the agentic spine
   ONE orchestration record. Back end (planner/ops) and front
   end (customer) are two lenses on this same record.
   Worked example: a supply disruption at a European plant,
   traced end-to-end in under an hour. Anchored on the KAF/PAC
   briefing + Dow Q1 2026 disclosures. Illustrative data.
   ============================================================ */
(function () {
  const D = {};

  /* ---------- The single orchestration record ---------- */
  D.event = {
    id: "EVT-2026-0617",
    trace: "TRC-2026-0617",
    title: "Supply disruption · Terneuzen Line 2",
    trigger: "Plant signal · Line 2 outage, output at risk",
    severity: "high",
    opened: "01-Jun-2026 06:14 CET",
    status: "Awaiting planner sign-off",
    cracker: "Terneuzen, NL · Line 2",
    blast: "14 SKUs · 2 plants · 1 DC · 1 strategic customer",
    atRisk: "Brandt · PO 8841 · INFUSE™ 9107",
    record: "one record · every agent action + every PAC check writes here",
  };

  /* ---------- LAYER 01 · KAF agents (on top) ---------- */
  D.agents = [
    {
      id: "anomaly", n: 1, name: "Anomaly agent", verb: "DETECT", icon: "anomaly",
      color: "var(--k-warm-red-50)", tint: "var(--k-warm-red-10)",
      owns: "ERP, MES, TMS and market feeds",
      line: "I watch every signal and open a ticket the moment something breaks the plan.",
      status: "done", now: "Opened ticket on Terneuzen Line 2", asks: "auto-action bounds",
    },
    {
      id: "cost", n: 4, name: "Cost agent", verb: "PRICE", icon: "document-chart",
      color: "#E68A00", tint: "#FCEFD7",
      owns: "Margin-aware lane & plant scoring",
      line: "I recompute cost-to-serve every time supply or freight moves.",
      status: "done", now: "Flagged margin floors on 14 SKUs", asks: "Finance margin floors",
    },
    {
      id: "inventory", n: 2, name: "Inventory agent", verb: "REBALANCE", icon: "network",
      color: "var(--k-spruce-60)", tint: "var(--k-spruce-10)",
      owns: "Stock positioning across plants & DCs",
      line: "I move stock across the network and keep days of inventory on target.",
      status: "active", now: "Rebalancing Terneuzen → Freeport sourcing", asks: "days-of-inventory + customer covenants",
    },
    {
      id: "demand", n: 3, name: "Demand agent", verb: "FORECAST", icon: "analytics",
      color: "var(--k-blue-60)", tint: "#E3EEF8",
      owns: "Continuous forecast · risk per SKU/region",
      line: "I update the forecast as the signals arrive, and I tell you what's at risk.",
      status: "queued", now: "Holding for sourcing commit", asks: "forecast version control + audit",
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
        { ph: "Plan", t: "Correlate the Terneuzen Line 2 outage across ERP, plant MES and telemetry feeds." },
        { ph: "Dispatch", t: "Confirm it breaks the planning assumption on Line 2 — output down 18% in 40 min." },
      ],
      checks: [{
        act: "Open an incident ticket and alert the EU planner",
        tool: "ops.ticket.create", rule: "OPS-auto-ticket-EU", bound: "plant",
        q: "Open a ticket and notify the planner automatically?",
        outcome: "allow",
        verdict: "Within auto-action bounds — monitoring may open tickets and alert owners without sign-off.",
        result: "Ticket SC-2026-0617 opened · EU planner notified",
      }],
    },
    cost: {
      bound: "finance",
      steps: [
        { ph: "Plan", t: "Recompute cost-to-serve for every SKU touched by the disruption." },
        { ph: "Dispatch", t: "Score each SKU's margin against the Finance floor, per region." },
      ],
      checks: [{
        act: "Auto-reprice the 14 SKUs that fell below the margin floor",
        tool: "pricing.reprice", rule: "FIN-margin-floor-EU", bound: "finance",
        q: "Reprice the below-floor SKUs automatically?",
        outcome: "flag",
        verdict: "Repricing is not auto-authorized — margin-floor breaches are flagged to Finance. An agent never moves price on its own.",
        result: "14 SKUs flagged to Finance · margins logged, no price changed",
      }],
    },
    inventory: {
      bound: "trade",
      steps: [
        { ph: "Plan", t: "Find covenant-safe ways to cover EU demand while Terneuzen is constrained." },
        { ph: "Dispatch", t: "Score a Terneuzen → Freeport reroute on days-of-inventory and customer covenants." },
      ],
      checks: [{
        act: "Commit the Freeport reroute for the Brandt covenant volume (42t)",
        tool: "erp.sto.write", rule: "PROD-covenant-brandt", bound: "trade",
        q: "Commit a reroute that touches a strategic-tier customer covenant?",
        outcome: "route", owner: "EU inventory planner",
        verdict: "Allowed, but a covenant-affecting commit must be confirmed by the planner who owns the account.",
        result: "Reroute committed · 42t Freeport → EU DC · Brandt's 18-Jun date held",
        rejected: "Reroute held · Terneuzen sourcing kept · exception escalated to Planning",
      }],
    },
    demand: {
      bound: "product",
      steps: [
        { ph: "Plan", t: "Re-forecast EU demand for the affected SKUs as the reroute commits." },
        { ph: "Dispatch", t: "Split the revision into a customer-visible change and an internal update." },
      ],
      checks: [
        {
          act: "Publish the revised delivery dates straight to the customer portal",
          tool: "portal.commitment.write", rule: "PROD-customer-commitment", bound: "product",
          q: "Push a customer-visible date change directly?",
          outcome: "deny",
          verdict: "Denied — a customer-visible commitment can't originate from an agent. Routed to Sales to confirm.",
          result: "Customer-facing change blocked · drafted for Sales review",
        },
        {
          act: "Update the internal forecast to v2026.22.3 with full audit",
          tool: "forecast.publish", rule: "PROD-forecast-version", bound: "product",
          q: "Bump the internal forecast version with audit attached?",
          outcome: "allow",
          verdict: "Within bounds — internal forecast updates are auto-authorized when versioned and audited.",
          result: "Forecast v2026.22.3 published internally · audit attached",
        },
      ],
    },
  };

  /* ---------- LAYER 02 · PAC bounds (underneath) ---------- */
  D.bounds = [
    { id: "finance", n: 1, name: "Finance bounds", icon: "document-chart",
      desc: "Working-capital limits and margin floors, per region and business unit.", rules: 42, owner: "Finance" },
    { id: "trade", n: 2, name: "Trade compliance", icon: "warning-alt",
      desc: "Sanctions, dual-use, regional trade rules and customer covenants.", rules: 67, owner: "Compliance" },
    { id: "plant", n: 3, name: "Plant SOPs", icon: "network",
      desc: "Turnaround windows, safety constraints, asset reliability rules.", rules: 38, owner: "Operations" },
    { id: "product", n: 4, name: "Product rules", icon: "information",
      desc: "Spec, hazmat, transport and customer-specific product covenants.", rules: 51, owner: "Product / R&D" },
  ];

  /* ---------- Shared open foundation ---------- */
  D.foundation = ["Containers", "PostgreSQL", "Observability", "Secrets", "Identity"];
  D.connectors = [
    { id: "ERP", sub: "SAP S/4 · system of record", io: "read + write" },
    { id: "MES", sub: "plant execution", io: "read" },
    { id: "TMS", sub: "transport / 3PL", io: "read + write" },
    { id: "CRM", sub: "customer + covenants", io: "read" },
  ];

  /* ---------- The reference flow (HERO) ---------- */
  D.flow = [
    {
      t: "T+0 min", at: "06:14", title: "Anomaly detected", runBy: "anomaly", packet: "Signal packet",
      desc: "Plant telemetry shows Line 2 output dropping. The anomaly agent opens a ticket against the affected plant and DCs.",
      pac: [{ rule: "PLANT-SOP-turnaround", result: "pass", note: "no turnaround conflict on Line 2" }],
      erp: [], surfaces: "Ticket opened on EVT-2026-0617",
    },
    {
      t: "T+5 min", at: "06:19", title: "Cost recomputed", runBy: "cost", packet: "Signal · cost",
      desc: "Cost agent recalculates cost-to-serve for every SKU that depends on this line. Margin floors flagged on 14 SKUs.",
      pac: [{ rule: "FIN-margin-floor-EU", result: "flag", note: "14 SKUs at or below floor on EU sourcing" }],
      erp: [], surfaces: "Cost-to-serve recomputed · 14 SKUs flagged",
    },
    {
      t: "T+12 min", at: "06:26", title: "Policy check", runBy: "pac", packet: "Policy packet",
      desc: "Inventory agent prepares a rebalancing across two plants. PAC evaluates the proposed action before anything commits.",
      pac: [
        { rule: "FIN-working-capital-EU", result: "pass", note: "transfer within working-capital limit (€2.1M headroom)" },
        { rule: "TRADE-export-EU-US", result: "pass", note: "Terneuzen → Freeport intra-Dow, no licence" },
        { rule: "PROD-covenant-brandt", result: "pass", note: "Brandt covenant: grade + spec preserved on swap" },
      ],
      erp: [], surfaces: "Rebalance proposal cleared · allow",
    },
    {
      t: "T+20 min", at: "06:34", title: "ERP updated", runBy: "inventory", packet: "Action packet",
      desc: "Inventory agent commits stock transfers and sourcing swaps. Demand agent updates the regional forecast for the affected SKUs.",
      pac: [{ rule: "FIN-working-capital-EU", result: "pass", note: "post-commit position re-checked, still in bounds" }],
      erp: [
        "STO 0049-77123 · Freeport → EU DC (ENGAGE XLT 8677, 42t)",
        "Sourcing swap · Brandt PO 8841 line 10 → Freeport plant",
        "Forecast v2026.22.3 · EU region, 14 SKUs",
      ],
      surfaces: "3 ERP writes committed · forecast updated",
    },
    {
      t: "T+55 min", at: "07:09", title: "Planner sign-off", runBy: "human", packet: "Promise packet",
      desc: "Planner sees a single screen: cause, the agents that acted, every PAC check, every ERP write. One click confirms or overrides.",
      pac: [], erp: [], surfaces: "Awaiting one-click confirm / override",
    },
  ];

  /* ---------- BRD · document to code (PAC source layer) ---------- */
  D.brd = {
    name: "Dow EU Supply-Chain Operating Rules",
    file: "DOW-BRD-SC-EU-v3.1.pdf",
    version: "v3.1", signed: "R. Okafor · Compliance · 24-May-2026",
    pages: 84, extracted: 198, compiled: 198, tests: 412,
    summary: "PAC reads the documents Dow already runs the business on, extracts the underlying rules, and compiles them into executable policy — versioned, tested and signed off. The same artefact the reviewer reads is the one the runtime evaluates.",
    // What the BRD configures, in three columns:
    activities: [
      { name: "Continuous inventory rebalancing", from: "§4.2 Stock-positioning policy", agent: "inventory" },
      { name: "Supply anomaly response", from: "§2.1 Signal monitoring mandate", agent: "anomaly" },
      { name: "Cost-to-serve recomputation", from: "§6.3 Margin governance", agent: "cost" },
      { name: "Rolling forecast & risk scoring", from: "§5.4 S&OP cadence", agent: "demand" },
    ],
    ontology: [
      { entity: "Cracker", rel: "feeds → Plant", note: "asset graph, 201 sites" },
      { entity: "Plant", rel: "sources → SKU", note: "grade + spec lineage" },
      { entity: "SKU", rel: "fulfils → Customer covenant", note: "ENGAGE grades incl. XLT 8677" },
      { entity: "Customer", rel: "holds → Covenant", note: "spec, lead-time, allocation" },
    ],
    rights: [
      { actor: "Inventory agent", can: "Propose + commit transfers within bounds", gate: "PAC: working capital + covenant" },
      { actor: "Cost agent", can: "Recompute, flag — never commit price", gate: "advisory only" },
      { actor: "Planner", can: "Confirm / override any committed action", gate: "human-in-the-loop, logged" },
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
    id: "PROD-covenant-brandt",
    name: "Brandt customer covenant · grade + spec preserved",
    decision: "allow",
    bound: "product",
    input: { customer: "Brandt Automotive", grade: "ENGAGE XLT 8677", swap_to: "Freeport", spec_locked: true },
    because: "swap_to.grade == covenant.grade AND swap_to.spec == covenant.spec",
    source: "BRD §7.1 — 'A sourcing change must preserve the contracted grade and specification for strategic-tier customers.'",
    version: "dow-brd-sc-eu-v3.1", at: "06:26 CET",
  };

  /* ---------- Audit-as-query (every decision, reason chain) ---------- */
  D.audit = [
    { id: "DEC-99412", at: "06:26:02", agent: "pac", action: "Evaluate rebalance proposal", rule: "PROD-covenant-brandt", result: "allow", chain: "BRD §7.1 → covenant.grade match → allow", region: "EU", customer: "Brandt", actor: "Inventory agent" },
    { id: "DEC-99411", at: "06:26:01", agent: "pac", action: "Evaluate rebalance proposal", rule: "TRADE-export-EU-US", result: "allow", chain: "BRD §3.4 → intra-Dow transfer → no licence", region: "EU", customer: "—", actor: "Inventory agent" },
    { id: "DEC-99410", at: "06:26:00", agent: "pac", action: "Evaluate rebalance proposal", rule: "FIN-working-capital-EU", result: "allow", chain: "BRD §4.2 → €2.1M headroom → in bounds", region: "EU", customer: "—", actor: "Inventory agent" },
    { id: "DEC-99404", at: "06:19:11", agent: "cost", action: "Recompute cost-to-serve", rule: "FIN-margin-floor-EU", result: "flag", chain: "BRD §6.3 → 14 SKUs ≤ floor → route to planner", region: "EU", customer: "multi", actor: "Cost agent" },
    { id: "DEC-99388", at: "06:14:03", agent: "anomaly", action: "Open anomaly ticket", rule: "PLANT-SOP-turnaround", result: "pass", chain: "BRD §8.1 → no turnaround window → safe to act", region: "EU", customer: "—", actor: "Anomaly agent" },
  ];

  /* ---------- The customer (front-end lens) ---------- */
  D.customer = {
    name: "Brandt Automotive Systems",
    site: "Ingolstadt, DE · Tier-1",
    po: "PO 8841 · line 10",
    product: "ENGAGE XLT 8677 · polyolefin elastomer",
    program: "EU-2027 crossover · front bumper fascia",
    qty: "42,000 kg",
    promised: "18-Jun-2026",
    promisedNow: "18-Jun-2026", // held
    statusHead: "On track — sourcing adjusted, your date is protected",
    contact: "Lena Brandt · Materials engineering",
  };

  /* ---------- Customer-facing timeline (with explainability) ----------
     Each step's `why` is the reason chain: agent → PAC rule → BRD line. */
  D.customerSteps = [
    {
      key: "ordered", phase: "Order confirmed", state: "done", at: "21-May",
      plain: "Your order for ENGAGE XLT 8677 was confirmed against the EU-2027 program.",
      why: { agent: null, rule: null, brd: "BRD §7.1 — strategic-tier covenant: grade + spec locked at order." },
    },
    {
      key: "signal", phase: "Supply event detected", state: "done", at: "01-Jun 06:14",
      plain: "A supply disruption hit the plant that normally makes your material. We caught it the moment it happened.",
      why: { agent: "anomaly", rule: "PLANT-SOP-turnaround", brd: "BRD §2.1 — signal-monitoring mandate: watch every feed, open a ticket on a break." },
    },
    {
      key: "cost", phase: "Cost & supply checked", state: "done", at: "01-Jun 06:19",
      plain: "We re-checked the cost to serve your order. Your grade was one of the lines affected on European sourcing.",
      why: { agent: "cost", rule: "FIN-margin-floor-EU", brd: "BRD §6.3 — margin governance: recompute cost-to-serve when supply is disrupted." },
    },
    {
      key: "reroute", phase: "Sourcing adjusted — date protected", state: "active", at: "01-Jun 06:34",
      plain: "Rather than delay you, we re-sourced your material from our Freeport (US) plant. Same grade, same specification, same delivery date.",
      why: { agent: "inventory", rule: "PROD-covenant-brandt", brd: "BRD §7.1 — a sourcing change must preserve the contracted grade and specification for strategic-tier customers." },
    },
    {
      key: "signoff", phase: "Final planner confirmation", state: "pending", at: "pending",
      plain: "A Dow planner is giving the adjustment a final one-click confirmation. You'll see the locked ETA the moment they do.",
      why: { agent: null, rule: null, brd: "BRD §1.4 — human-in-the-loop: a planner confirms or overrides any committed action." },
    },
  ];

  /* ---------- Operator KPI strip ---------- */
  D.kpis = [
    { label: "Days of inventory", value: "41.2", delta: "−3.1", dir: "down", good: true, sub: "201-site network · 12-wk" },
    { label: "Working capital released", value: "$312M", delta: "+$12M", dir: "up", good: true, sub: "YoY · continuous rebalance" },
    { label: "Signal → action", value: "55 min", delta: "−4 days", dir: "down", good: true, sub: "vs. Friday meeting" },
    { label: "Auto-action in bounds", value: "84%", delta: "+6.0", dir: "up", good: true, sub: "PAC-cleared, no planner touch" },
  ];

  /* ---------- Anchored outcomes (no invented numbers) ---------- */
  D.outcomes = [
    { n: "01", line: "Working capital released", figure: "+$300M", src: "Dow Q1 2026 results · repeatable", why: "Continuous inventory rebalancing across the 201-site network — the same mechanic, automated." },
    { n: "02", line: "Inventory reduction", figure: "−35%", src: "McKinsey · supply-chain AI study", why: "AI-led rebalancing across multi-plant networks with service levels held flat when bounds are explicit." },
    { n: "03", line: "Forecast accuracy uplift", figure: "+20–40%", src: "SCMR composite · peer-reviewed", why: "Continuous replanning over weekly-cycle baselines; every point unlocks further working capital." },
    { n: "04", line: "AI adoption rate", figure: "2×", src: "Gartner · supply-chain study", why: "Top performers adopt AI at twice the rate of laggards. Dow's footprint puts it in the lead cohort." },
  ];

  /* ---------- Planner queue dashboard ----------
     The operator's command surface: posture KPIs, weekly throughput,
     where exceptions route, and the filterable exception table. Each
     KPI filters the table; each row opens a detail drawer. */
  D.queueDash = {
    kpis: [
      { id: "waiting", label: "Exceptions waiting", val: "3", delta: "−2", dir: "down", good: true, sub: "need a human this week", filter: "waiting" },
      { id: "risk", label: "Value at risk", val: "$3.4M", delta: "+$0.6M", dir: "up", good: false, sub: "across open exceptions", filter: "open" },
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
    { id: "EVT-2026-0617", title: "Supply disruption · Terneuzen", sev: "high", cat: "waiting",
      why: "14 SKUs pushed to margin floor by a supply disruption", state: "Awaiting sign-off", val: "$1.9M",
      owner: "EU inventory planner", age: "8 min", routedTo: "Planner desk", agents: ["Anomaly", "Cost", "Inventory"],
      evidence: ["12 PAC checks passed", "3 ERP writes staged", "Covenant + margin floor verified"], primary: true },
    { id: "EVT-2026-0598", title: "Covenant conflict · Halcyon", sev: "critical", cat: "waiting",
      why: "Proposed reroute would break a spec covenant on grade 8180", state: "Blocked · planner required", val: "$640k",
      owner: "Compliance + planner", age: "2 h", routedTo: "Planner desk", agents: ["Inventory", "Cost"],
      evidence: ["PAC denied auto-commit", "Covenant CFL-014 cited", "Awaiting override authority"], primary: false },
    { id: "EVT-2026-0604", title: "Duty-rate change · MX import", sev: "medium", cat: "routed",
      why: "Cost-to-serve up 4% on 6 SKUs after a tariff revision", state: "Routed to Finance", val: "$210k",
      owner: "Finance · trade", age: "1 d", routedTo: "Finance", agents: ["Cost"],
      evidence: ["Recompute logged", "Margin impact modeled", "No covenant breach"], primary: false },
    { id: "EVT-2026-0611", title: "Port congestion · Rotterdam", sev: "medium", cat: "auto",
      why: "ETA slip of 2 days across 3 lanes, absorbed within buffer", state: "Auto-handled in bounds", val: "$340k",
      owner: "Inventory agent", age: "3 d", routedTo: "Auto-handled", agents: ["Demand", "Inventory"],
      evidence: ["Within lane buffer", "Promise dates held", "PAC cleared"], primary: false },
    { id: "EVT-2026-0589", title: "Forecast drift · ENGAGE family", sev: "low", cat: "auto",
      why: "Demand signal moved 3%, re-pointed within tolerance", state: "Auto-handled in bounds", val: "$95k",
      owner: "Demand agent", age: "4 d", routedTo: "Auto-handled", agents: ["Demand"],
      evidence: ["Inside ±5% tolerance", "Forecast v2026.22 refreshed", "PAC cleared"], primary: false },
    { id: "EVT-2026-0576", title: "Spot-rate dip · NWE polyethylene", sev: "low", cat: "auto",
      why: "Input cost eased 2%; cost model refreshed, no action needed", state: "Auto-handled in bounds", val: "$120k",
      owner: "Cost agent", age: "5 d", routedTo: "Auto-handled", agents: ["Cost"],
      evidence: ["Advisory only", "Margins above floor", "No write required"], primary: false },
  ];

  /* ---------- Decision Graph · the modeled layer the agents reason over ----------
     One ontology resolved from the BRD. Customer → Covenant → SKU → Plant ← Cracker,
     plus LIMS sample lineage as first-class entities. */
  D.graph = {
    nodes: [
      { id: "cust", label: "Brandt Automotive", type: "Customer", x: 50, y: 50, kind: "customer" },
      { id: "cov", label: "Covenant · grade + spec", type: "Contract", x: 50, y: 150, kind: "policy" },
      { id: "sku", label: "ENGAGE XLT 8677", type: "SKU / grade", x: 50, y: 250, kind: "sku" },
      { id: "plantF", label: "Freeport (US)", type: "Plant", x: 250, y: 210, kind: "plant" },
      { id: "plantT", label: "Terneuzen (NL)", type: "Plant", x: 250, y: 300, kind: "plant" },
      { id: "crack", label: "Terneuzen Line 2", type: "Cracker", x: 430, y: 300, kind: "cracker" },
      { id: "feed", label: "Feed line", type: "Feedstock", x: 430, y: 390, kind: "signal" },
      { id: "sample", label: "Sample DR-20418", type: "LIMS sample", x: 250, y: 90, kind: "lims" },
      { id: "test", label: "−40 °C Izod test", type: "Test result", x: 430, y: 60, kind: "lims" },
    ],
    edges: [
      { from: "cust", to: "cov", label: "holds" },
      { from: "cov", to: "sku", label: "binds" },
      { from: "sku", to: "plantF", label: "sourced from" },
      { from: "sku", to: "plantT", label: "sourced from" },
      { from: "plantT", to: "crack", label: "fed by" },
      { from: "crack", to: "feed", label: "consumes" },
      { from: "cust", to: "sample", label: "requested" },
      { from: "sample", to: "sku", label: "of grade" },
      { from: "sample", to: "test", label: "has result" },
    ],
  };

  /* ---------- LIMS sample lineage (first-class entities) ---------- */
  D.lims = {
    sample: "DR-2026-20418",
    grade: "ENGAGE XLT 8677",
    lot: "FP-LOT-77123 · Freeport",
    status: "In test",
    lineage: [
      { stage: "Requested", at: "01-Jun 06:35", note: "ChemAssist · reserved from Freeport stock", state: "done" },
      { stage: "Lot pulled", at: "01-Jun 09:10", note: "FP-LOT-77123 · 42 kg qualification lot", state: "done" },
      { stage: "−40 °C Izod impact", at: "03-Jun (planned)", note: "method ASTM D256 · ductile target", state: "active" },
      { stage: "Melt-flow / density QC", at: "03-Jun (planned)", note: "1.0 g/10min · 0.870 g/cm³", state: "pending" },
      { stage: "Result → recommendation", at: "04-Jun (planned)", note: "feeds qualification decision + audit", state: "pending" },
    ],
  };

  /* ---------- Customer FE · AI-native decision canvas (dema-style) ----------
     The front end the customer drives. Plain-language intent in; the spine
     infers everything the old forms asked for and returns a decision, not a form. */
  D.cx = {
    greeting: "Hi Brandt — your PO 8841 (ENGAGE™ XLT 8677, due 18 Jun) is the live order I'm watching. Ask me about it in plain language, or tell me what you're building next. No forms.",
    account: "Brandt Automotive Systems · Ingolstadt, DE",
    suggestions: [
      "Is my 18-Jun delivery on PO 8841 still safe after the Terneuzen disruption?",
      "What's the fastest in-stock grade I can switch PO 8841 to without re-qualifying?",
      "I'm building a cold-weather bumper fascia, ductile at −40 °C — which ENGAGE grade should my next order use?",
      "Show me what else in my contract is exposed to this supply disruption",
    ],
    exposure: [
      { sku: "ENGAGE XLT 8677", order: "PO 8841 · 42 t", status: "Re-sourced", tone: "spruce", note: "Moved Terneuzen → Freeport · 18-Jun date held" },
      { sku: "ENGAGE 8180", order: "PO 8796 · 18 t", status: "Monitoring", tone: "amber", note: "Within lane buffer · no action needed yet" },
      { sku: "ENGAGE HM 7387", order: "Contract · Q3 call-off", status: "At risk", tone: "red", note: "Terneuzen-sourced · flagged for reroute" },
    ],
    brief: "I'm developing a front bumper fascia for a cold-weather EU vehicle platform. It has to stay ductile at −40 °C, and I want to down-gauge the wall to cut weight. Injection-molded TPO.",
    parsed: [
      { k: "Application", v: "Exterior fascia · hard TPO" },
      { k: "Process", v: "Injection molding" },
      { k: "Climate", v: "−40 °C ductility" },
      { k: "Priority", v: "Down-gauge / lighter wall" },
      { k: "Region", v: "EU platform · ship-to DE" },
      { k: "Volume", v: "42,000 kg qualification lot" },
    ],
    thinking: [
      { label: "Read your brief into 6 requirements", sub: "ChemAssist · no market / application forms — inferred", state: "done", ts: "+0.3s" },
      { label: "Matched the ENGAGE portfolio to your use case", sub: "Product Selector · catalog.match · 4 candidates", state: "done", ts: "+1.0s" },
      { label: "Checked regulatory constraints for your region", sub: "RegRadar · EU REACH + GHS/SDS · DE", state: "done", ts: "+1.6s" },
      { label: "Checked availability & supply risk", sub: "Supply-chain spine · live stock + supply alert", state: "done", ts: "+2.2s" },
      { label: "Cleared the answer for customer-facing use", sub: "PAC · policy.evaluate · allow", state: "done", ts: "+2.6s" },
      { label: "Predicted sample-ready and delivery dates", sub: "sla.predict · live stock + transit", state: "done", ts: "+3.0s" },
    ],
    decision: {
      product: "ENGAGE XLT 8677",
      family: "Polyolefin elastomer · XLT",
      confidence: 94,
      fit: "Best fit for −40 °C + thin-wall",
      reasons: [
        "Highest cold-temperature impact-to-stiffness ratio in the portfolio — holds −40 °C ductile failure while you down-gauge the fascia wall.",
        "Proven in hard-TPO automotive exterior, injection-molded — directly on your process and application.",
        "Qualification lot in stock at Freeport, so your sample moves now.",
      ],
      regulatory: {
        summary: "EU REACH registered · no SVHC above threshold for your use. GHS/CLP classified; SDS rev. 7 (DE) attached.",
        chips: ["EU REACH · registered", "GHS / CLP · SDS rev 7 (DE)", "No SVHC > 0.1%"],
        source: "RegRadar · EU REACH bundle v2026.05 · 27-May-2026",
        disclaimer: "Informational guidance — not a formal compliance certification. Regulatory can issue formal documents.",
      },
      availability: {
        state: "supply-aware",
        line: "Qualification lot in stock at Freeport (US).",
        risk: "EU sourcing (Terneuzen) is under an active supply alert — the spine already re-sourced you to Freeport, so your date holds.",
      },
      citations: ["ENGAGE XLT 8677 TDS · rev 5", "ENGAGE TPO selection guide", "RegRadar · EU REACH bundle v2026.05"],
      caveat: "Confirm the at-press let-down ratio with your PP carrier — Technical Service can validate on the sample.",
      sampleReady: "3 days",
      sampleReadyNote: "qualification lot in stock · Freeport",
      delivery: "18-Jun-2026",
      deliveryNote: "DAP Ingolstadt · within your program window",
      pacState: "clear",
      pacNote: "No trade, hazmat or product restrictions for your DE ship-to. Answer cleared for customer-facing use.",
      alternatives: [
        { name: "ENGAGE 8180", note: "Strong impact, less thin-wall headroom" },
        { name: "ENGAGE HM 7387", note: "Choose if gloss becomes critical" },
      ],
    },
    requested: {
      id: "DR-2026-20418",
      headline: "Sample request placed — we handled the rest",
      did: [
        "Inferred market, submarket and application from your brief",
        "Pre-filled recipient, ship-to and documents from your account",
        "Ran the policy & trade check inline — cleared",
        "Reserved the qualification lot from Freeport stock",
      ],
    },
  };

  /* ---------- Backtest / Replay lab ----------
     Replay the supply-disruption event (EVT-2026-0617) under different PAC bundle
     versions. Each version yields different decisions, policy conflicts,
     and a different inventory + customer-promise outcome. */
  D.backtest = {
    scenario: "EVT-2026-0617 · Supply disruption · Terneuzen Line 2",
    rules: ["FIN-working-capital-EU", "TRADE-export-EU-US", "PROD-covenant-brandt", "FIN-margin-floor-EU"],
    versions: [
      {
        id: "v3.0", label: "v3.0", tag: "previous", live: false,
        verdict: "route", verdictLabel: "Route to planner",
        decisions: { "FIN-working-capital-EU": "allow", "TRADE-export-EU-US": "allow", "PROD-covenant-brandt": "route", "FIN-margin-floor-EU": "route" },
        conflicts: [],
        action: "No auto-action — every covenant-touching swap waits for manual planner review.",
        doi: 44.3, doiDelta: "+0.0", transfer: "Held — manual queue", promise: "Brandt slips ~2 days", risk: "$1.9M exposed while queued",
        summary: "Safe but slow. The reroute that protects Brandt sits in a manual queue; inventory stays trapped and the promise is at risk.",
      },
      {
        id: "v3.1", label: "v3.1", tag: "live", live: true,
        verdict: "allow", verdictLabel: "Allow in bounds",
        decisions: { "FIN-working-capital-EU": "allow", "TRADE-export-EU-US": "allow", "PROD-covenant-brandt": "allow", "FIN-margin-floor-EU": "flag" },
        conflicts: [],
        action: "Inventory agent commits Terneuzen → Freeport sourcing swap within bounds; planner confirms.",
        doi: 41.2, doiDelta: "−3.1", transfer: "STO 0049-77123 committed (42t)", promise: "Brandt date held · 18-Jun", risk: "$0 exposed — promise protected",
        summary: "The balanced bundle. The swap clears working-capital and covenant checks, margin is flagged not blocked, inventory frees up and the date holds.",
      },
      {
        id: "v3.2", label: "v3.2", tag: "draft", live: false,
        verdict: "deny", verdictLabel: "Conflict · blocked",
        decisions: { "FIN-working-capital-EU": "allow", "TRADE-export-EU-US": "allow", "PROD-covenant-brandt": "allow", "FIN-margin-floor-EU": "deny" },
        conflicts: [
          {
            id: "CFL-014", a: "PROD-covenant-brandt", b: "FIN-margin-floor-EU",
            text: "Covenant requires preserving Brandt's grade + date (→ Freeport reroute). Draft v3.2 raises the EU margin floor so the Freeport-sourced lot falls below floor. No action satisfies both rules.",
            resolve: "Route to Compliance + Finance — covenant override or a margin-floor exception is required before the reroute can commit.",
          },
        ],
        action: "Reroute blocked by the tightened margin floor; covenant cannot be honoured automatically.",
        doi: 44.3, doiDelta: "+0.0", transfer: "Blocked — conflict unresolved", promise: "Brandt slips ~2 days", risk: "$1.9M exposed · escalation required",
        summary: "The stricter draft protects margin but collides with the customer covenant — a policy conflict that strands inventory and the promise until a human resolves it.",
      },
    ],
  };

  /* ---------- ERP write-preview · staged before commit ----------
     The reference flow stages writes as a reversible preview. Each write
     carries a compensating transaction and a named rollback owner; nothing
     reaches the system of record until the planner confirms. */
  D.writePreview = {
    guard: "These writes are staged, not applied. Each carries a compensating transaction and a named rollback owner. Nothing touches the system of record until the planner confirms below.",
    kill: "Kill switch · Digital Ops — reverts all staged writes in one action",
    staged: [
      { sys: "SAP S/4 · ERP", op: "STO 0049-77123", detail: "Freeport → EU DC · ENGAGE XLT 8677 · 42t", comp: "Reverse STO + restore EU allocation", owner: "Inventory planner · EU", risk: "low" },
      { sys: "SAP S/4 · ERP", op: "Sourcing swap · PO 8841 line 10", detail: "Brandt order re-pointed to Freeport plant", comp: "Revert source to Terneuzen on PO line", owner: "Inventory planner · EU", risk: "med" },
      { sys: "Forecast service", op: "Forecast v2026.22.3", detail: "EU region · 14 SKUs re-pointed", comp: "Roll back to forecast v2026.22.2", owner: "Demand planner", risk: "low" },
    ],
  };

  /* ---------- Deployment-gate ladder · shadow → bounded autonomy ----------
     The promotion path the lab governs. Customer-visibility and write-back
     widen one gate at a time, each behind explicit exit criteria. */
  D.gates = {
    current: "g3",
    summary: "The pilot is at gate 3 — internal, human-approved, write-previews only. Customer-visible commitments (gate 4) unlock only after audit completeness holds and Legal + Compliance sign off. Each gate widens write-back by exactly one step.",
    stages: [
      { id: "g1", n: 1, name: "Internal replay", scope: "Backtest fixtures only", visible: "None", writes: "None", state: "passed",
        exit: [{ t: "All must-have policy tests pass", ok: true }, { t: "Masked-log verification clean", ok: true }] },
      { id: "g2", n: 2, name: "Live shadow", scope: "Live events · observe-only", visible: "None", writes: "None", state: "passed",
        exit: [{ t: "No critical false positives", ok: true }, { t: "Planner acceptance ≥ 80%", ok: true }] },
      { id: "g3", n: 3, name: "Human-approved · internal", scope: "Planner confirms every action", visible: "None", writes: "Preview → planner commit", state: "current",
        exit: [{ t: "Approved-action accuracy ≥ target", ok: true }, { t: "Audit completeness = 100%", ok: false }] },
      { id: "g4", n: 4, name: "Customer pilot", scope: "Selected low-risk accounts", visible: "Selected accounts", writes: "Human-approved writes", state: "locked",
        exit: [{ t: "Legal sign-off", ok: false }, { t: "Compliance sign-off", ok: false }, { t: "CX error ≤ threshold", ok: false }] },
      { id: "g5", n: 5, name: "Bounded autonomy", scope: "Expanded auto-action in bounds", visible: "Yes", writes: "Bounded auto-writes", state: "locked",
        exit: [{ t: "Thresholds hold over rolling window", ok: false }, { t: "Governance-board approval", ok: false }] },
    ],
  };

  /* ---------- Three-part accountability spine · named owners ----------
     One role is accountable for the journey, one for the platform, one for
     the guardrails. Maps to the operating-model artefact. */
  D.accountability = [
    { layer: "Commercial journey", owner: "Revenue Ops · GTM journey owner", color: "var(--k-spruce-60)", tint: "var(--k-spruce-10)", icon: "recommend",
      owns: "Customer experience, sample-to-opportunity conversion, account orchestration, commercial KPIs", scope: "Owns the sample-to-ship journey as a product." },
    { layer: "Operational platform", owner: "Digital Ops · platform owner", color: "#6B36A8", tint: "#F3ECFB", icon: "network",
      owns: "Agent runtime, integrations, event bus, access control, observability, reliability, rollout gates", scope: "Owns the shared spine every lens runs on." },
    { layer: "Decision boundaries", owner: "Domain owners · Planning · Tech Service · Regulatory · Finance · Compliance", color: "var(--k-warm-red-50)", tint: "var(--k-warm-red-10)", icon: "document-chart",
      owns: "Policy bundles, approval thresholds, exception adjudication, escalation owners", scope: "Own the guardrails the agents act within." },
  ];

  /* ---------- Controls & evidence · backend contracts, cited ----------
     Event taxonomy, data residency / masking, and security controls — each
     traced to the standard it is evidenced against. */
  D.citations = {
    opa: { label: "OPA · Open Policy Agent", note: "Policy decoupled from enforcement; signed + versioned bundles; opa test coverage; decision logs carry bundle revision, path, input, result and a unique decision ID; sensitive fields maskable in logs." },
    nist: { label: "NIST AI RMF", note: "Trustworthiness is incorporated across design, development, use and evaluation — not bolted on after deployment." },
    cloudevents: { label: "CloudEvents", note: "A common event envelope for cross-system routing; many SAP applications publish CloudEvents-compliant events." },
    sap: { label: "SAP Integration Suite · Event Mesh", note: "APIs, event-driven integration, centralized governance and hybrid SAP + third-party connectivity." },
  };
  D.controls = {
    taxonomy: {
      cite: ["cloudevents", "sap"],
      envelope: "CloudEvents 1.0 · type · source · subject · id · time · traceparent",
      rows: [
        { name: "supply.disruption.detected", payload: "plant, line, output_pct, window", trace: "required", idem: "line+window hash" },
        { name: "cost.recomputed", payload: "skus[], margin_floor_breaches[]", trace: "required", idem: "run_id" },
        { name: "inventory.rebalance.proposed", payload: "stos[], affected_covenants[]", trace: "required", idem: "proposal_id" },
        { name: "erp.write.committed", payload: "doc_id, system, compensating_txn", trace: "required", idem: "doc_id" },
        { name: "promise.revised", payload: "account, po, old_eta, new_eta, reason", trace: "required", idem: "po+rev" },
      ],
    },
    residency: {
      cite: ["opa"],
      rows: [
        { region: "EU", processing: "EU-resident path · Frankfurt", pii: "Contact name, ship-to", masked: "Customer contact masked in decision logs", retention: "Audit 7y · prompts 30d" },
        { region: "US", processing: "US-resident path · Freeport adjacency", pii: "Plant operator IDs", masked: "Operator IDs hashed in logs", retention: "Audit 7y · prompts 30d" },
      ],
      note: "Region-specific processing paths are selected at deployment; policy decides which fields are masked or erased from the decision log before it is written.",
    },
    security: {
      cite: ["opa", "nist"],
      rows: [
        { area: "Identity & access", impl: "SSO + RBAC and ABAC — account-specific data and cross-functional exception views gated by role." },
        { area: "Policy integrity", impl: "Signed bundles, explicit approvals, versioned promotion and rollback." },
        { area: "Auditability", impl: "Decision ID, trace ID, bundle revision, approver identity, timestamp, commit status, linked evidence." },
        { area: "Write safety", impl: "Write-preview first, compensating actions, kill switch, named rollback owner." },
        { area: "Model safety", impl: "No unsupported product claims, no hidden pricing commitments, mandatory escalation on high-risk questions." },
      ],
    },
  };

  /* ---------- Learning loop · 'Learned from you' inbox + knowledge gaps ----------
     Every override, deny and unsupported answer becomes a teaching signal,
     routed to an owner and shown with the blast radius the agent applied. */
  D.learning = {
    inbox: [
      { id: "LRN-2041", kind: "skill", signal: "Planner override · approved covenant-safe reroute", from: "EVT-2026-0617 · Brandt swap to Freeport", routed: "Policy owner + Digital Ops",
        change: "New reusable skill — auto-approve Freeport reroutes when grade + spec are preserved", blast: "applied to 147 similar swaps · avg planner-touch −38 min", state: "live" },
      { id: "LRN-2038", kind: "policy", signal: "Compliance deny · margin-floor vs covenant conflict", from: "Backtest v3.2 · CFL-014", routed: "Policy owner · Finance",
        change: "Add covenant-override branch to FIN-margin-floor-EU with Finance approval gate", blast: "scoped to 14 EU SKUs · 1 new test case", state: "in review" },
      { id: "LRN-2034", kind: "content", signal: "Customer asked an unsupported question", from: "ChemAssist · at-press let-down ratio for PP carrier", routed: "Technical Service + content",
        change: "New knowledge article — PP carrier let-down validation on ENGAGE XLT", blast: "covers 9 recurring sample questions", state: "drafting" },
      { id: "LRN-2029", kind: "skill", signal: "Seller repeated a manual workaround", from: "RevOps · re-running supply check from email", routed: "Revenue Ops + platform",
        change: "New shortcut skill — re-source preview surfaced inline on Order status", blast: "removes a 4-step manual relay for 23 sellers", state: "live" },
    ],
    gaps: [
      { id: "GAP-118", q: "−40 °C Izod ductile target for ENGAGE HM 7387", reason: "no validated test data on file", owner: "Technical Service", sev: "high" },
      { id: "GAP-117", q: "REACH SVHC status for substitute 8180 in DE", reason: "answer below confidence threshold", owner: "Regulatory", sev: "high" },
      { id: "GAP-112", q: "Down-gauge limit at 0.870 g/cm³ · 2.0 mm wall", reason: "unsupported — outside published guidance", owner: "R&D", sev: "medium" },
    ],
  };

  /* ---------- Group ontology · the generated semantic graph ----------
     The entity-type schema the BRD compiles into — entities (typed by
     domain) and the typed relationships between them. Rendered as a
     force-directed (neo4j-style) graph; the layout is generated, not placed. */
  D.ontologyGraph = {
    cats: {
      commercial: { c: "#334155", label: "Commercial" },
      product: { c: "#475569", label: "Product" },
      ops: { c: "#5B6B7B", label: "Operations" },
      quality: { c: "#64748B", label: "Quality · LIMS" },
      governance: { c: "#94A3B8", label: "Governance" },
      runtime: { c: "#B0BAC6", label: "Runtime" },
    },
    nodes: [
      { id: "Account", cat: "commercial" },
      { id: "CustomerUser", cat: "commercial" },
      { id: "OrderIntent", cat: "commercial" },
      { id: "SampleRequest", cat: "commercial" },
      { id: "Covenant", cat: "commercial" },
      { id: "SKU", cat: "product" },
      { id: "ProductFamily", cat: "product" },
      { id: "Document", cat: "product" },
      { id: "Plant", cat: "ops" },
      { id: "Cracker", cat: "ops" },
      { id: "Feedstock", cat: "ops" },
      { id: "Lane", cat: "ops" },
      { id: "QualificationCase", cat: "quality" },
      { id: "LabTask", cat: "quality" },
      { id: "Sample", cat: "quality" },
      { id: "TestResult", cat: "quality" },
      { id: "BRD", cat: "governance" },
      { id: "PolicyBundle", cat: "governance" },
      { id: "PolicyRule", cat: "governance" },
      { id: "DecisionRight", cat: "governance" },
      { id: "UserRole", cat: "governance" },
      { id: "Event", cat: "runtime" },
      { id: "AgentRun", cat: "runtime" },
      { id: "WritePreview", cat: "runtime" },
      { id: "ERPCommit", cat: "runtime" },
      { id: "AuditRecord", cat: "runtime" },
    ],
    links: [
      { source: "CustomerUser", target: "Account", rel: "member of" },
      { source: "Account", target: "SampleRequest", rel: "creates" },
      { source: "Account", target: "OrderIntent", rel: "submits" },
      { source: "Account", target: "Covenant", rel: "holds" },
      { source: "Covenant", target: "SKU", rel: "binds" },
      { source: "SampleRequest", target: "SKU", rel: "requests" },
      { source: "SampleRequest", target: "QualificationCase", rel: "triggers" },
      { source: "QualificationCase", target: "LabTask", rel: "contains" },
      { source: "QualificationCase", target: "Sample", rel: "uses" },
      { source: "LabTask", target: "TestResult", rel: "produces" },
      { source: "Sample", target: "SKU", rel: "of grade" },
      { source: "SKU", target: "ProductFamily", rel: "in family" },
      { source: "SKU", target: "Plant", rel: "produced at" },
      { source: "SKU", target: "Document", rel: "evidenced by" },
      { source: "Plant", target: "Cracker", rel: "fed by" },
      { source: "Cracker", target: "Feedstock", rel: "consumes" },
      { source: "Plant", target: "Lane", rel: "ships via" },
      { source: "OrderIntent", target: "Lane", rel: "fulfilled on" },
      { source: "Feedstock", target: "Event", rel: "spikes →" },
      { source: "Event", target: "SKU", rel: "affects" },
      { source: "Event", target: "Plant", rel: "affects" },
      { source: "Event", target: "AgentRun", rel: "triggers" },
      { source: "AgentRun", target: "PolicyRule", rel: "checks" },
      { source: "AgentRun", target: "WritePreview", rel: "proposes" },
      { source: "WritePreview", target: "ERPCommit", rel: "becomes" },
      { source: "ERPCommit", target: "AuditRecord", rel: "records" },
      { source: "BRD", target: "PolicyBundle", rel: "compiles to" },
      { source: "BRD", target: "DecisionRight", rel: "defines" },
      { source: "PolicyBundle", target: "PolicyRule", rel: "contains" },
      { source: "UserRole", target: "DecisionRight", rel: "holds" },
      { source: "UserRole", target: "WritePreview", rel: "approves" },
    ],
  };

  /* ---------- Next Best Actions · agent-ranked, routed to one screen ----------
     Surfaced through the floating NBA rail. Each item points the user at the
     single screen where they can act, with the reason it is being raised. */
  D.nba = [
    { id: "NBA-1", sev: "high", title: "Sign off the supply reroute", lens: "ops", screen: "flow", cta: "Review & sign off",
      why: "3 ERP writes are staged and reversible. Brandt's 18-Jun date holds only once you release them." },
    { id: "NBA-2", sev: "high", title: "Resolve policy conflict CFL-014", lens: "ops", screen: "backtest", cta: "Open backtest lab",
      why: "Draft bundle v3.2 strands the reroute — covenant vs margin floor. Route to Compliance + Finance before it can promote." },
    { id: "NBA-3", sev: "med", title: "Close 2 high-severity knowledge gaps", lens: "ops", screen: "learning", cta: "Open inbox",
      why: "Unanswered questions are blocking confident customer answers — route them to Technical Service and Regulatory." },
    { id: "NBA-4", sev: "med", title: "Gate 4 promotion is blocked", lens: "ops", screen: "backtest", cta: "View deployment gates",
      why: "Audit completeness is below 100%. Close it to unlock customer-visible commitments." },
    { id: "NBA-5", sev: "info", title: "Notify Brandt — sample ready in 3 days", lens: "cx", screen: "customer", cta: "See customer view",
      why: "The qualification lot is reserved at Freeport; the customer can be updated with the protected date." },
  ];

  /* ---------- Business activities · compiled graph ----------
     BRD → section → business activity → the agent that runs it. */
  D.activityGraph = {
    cats: {
      root: { c: "#5B6B7B", label: "BRD" },
      source: { c: "#2A6FDB", label: "BRD section" },
      activity: { c: "#29707A", label: "Business activity" },
      agent: { c: "#FF462D", label: "Agent" },
    },
    nodes: [
      { id: "BRD", cat: "root" },
      { id: "§2.1", cat: "source" }, { id: "§4.2", cat: "source" }, { id: "§5.4", cat: "source" }, { id: "§6.3", cat: "source" },
      { id: "Anomaly response", cat: "activity" }, { id: "Stock rebalance", cat: "activity" }, { id: "Forecast risk", cat: "activity" }, { id: "Cost to serve", cat: "activity" },
      { id: "Anomaly agent", cat: "agent" }, { id: "Inventory agent", cat: "agent" }, { id: "Demand agent", cat: "agent" }, { id: "Cost agent", cat: "agent" },
    ],
    links: [
      { source: "BRD", target: "§2.1", rel: "defines" }, { source: "BRD", target: "§4.2", rel: "defines" },
      { source: "BRD", target: "§5.4", rel: "defines" }, { source: "BRD", target: "§6.3", rel: "defines" },
      { source: "§2.1", target: "Anomaly response", rel: "mandates" },
      { source: "§4.2", target: "Stock rebalance", rel: "mandates" },
      { source: "§5.4", target: "Forecast risk", rel: "mandates" },
      { source: "§6.3", target: "Cost to serve", rel: "mandates" },
      { source: "Anomaly response", target: "Anomaly agent", rel: "run by" },
      { source: "Stock rebalance", target: "Inventory agent", rel: "run by" },
      { source: "Forecast risk", target: "Demand agent", rel: "run by" },
      { source: "Cost to serve", target: "Cost agent", rel: "run by" },
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
      { id: "Inventory agent", cat: "actor" }, { id: "Cost agent", cat: "actor" }, { id: "Planner", cat: "actor" }, { id: "Compliance", cat: "actor" },
      { id: "WC + covenant", cat: "gate" }, { id: "Advisory only", cat: "gate" }, { id: "Human in loop", cat: "gate" }, { id: "Publish sign-off", cat: "gate" },
    ],
    links: [
      { source: "Inventory agent", target: "WC + covenant", rel: "propose + commit" },
      { source: "Cost agent", target: "Advisory only", rel: "recompute · flag" },
      { source: "Planner", target: "Human in loop", rel: "confirm / override" },
      { source: "Compliance", target: "Publish sign-off", rel: "author bundles" },
      { source: "WC + covenant", target: "PAC", rel: "enforced by" },
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
    // What the Anomaly agent watches — signal volume by source feed (one week)
    watch: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [
        { label: "ERP · SAP", color: "#29707A", fill: "rgba(41,112,122,.35)", data: [120, 140, 135, 150, 170, 80, 60] },
        { label: "MES · plants", color: "#3E8AC2", fill: "rgba(62,138,194,.30)", data: [80, 95, 90, 110, 120, 55, 40] },
        { label: "TMS · logistics", color: "#5BA2AE", fill: "rgba(91,162,174,.30)", data: [60, 70, 68, 82, 90, 38, 30] },
        { label: "Market feeds", color: "#E68A00", fill: "rgba(230,138,0,.26)", data: [40, 52, 48, 60, 72, 28, 22] },
      ],
    },
    // Anomaly pressure by feed × week — sequential01 heatmap
    heatmap: {
      cols: ["W27", "W28", "W29", "W30", "W31", "W32", "W33", "W34", "W35", "W36", "W37", "W38"],
      rows: [
        { feed: "Feedstock", vals: [1, 2, 3, 2, 6, 4, 3, 2, 1, 1, 2, 5] },
        { feed: "Freight", vals: [0, 1, 2, 1, 2, 3, 2, 4, 3, 2, 1, 2] },
        { feed: "Logistics", vals: [2, 1, 1, 0, 1, 2, 1, 3, 4, 2, 1, 1] },
        { feed: "Plant status", vals: [0, 0, 1, 2, 1, 0, 1, 2, 1, 3, 2, 1] },
        { feed: "Demand", vals: [1, 1, 0, 1, 2, 2, 1, 1, 2, 1, 3, 2] },
        { feed: "Market price", vals: [3, 2, 2, 1, 4, 3, 2, 2, 1, 2, 2, 4] },
      ],
      max: 6,
    },
    // Events by region — polar area
    regions: [
      { label: "EU · NWE", n: 42, color: "#29707A" },
      { label: "EU · Central", n: 28, color: "#3E8AC2" },
      { label: "US · Gulf", n: 19, color: "#8A4FBF" },
      { label: "LATAM", n: 9, color: "#E68A00" },
      { label: "APAC", n: 6, color: "#5C6A73" },
    ],
  };

  /* ---------- Learning-loop bubble — corrections by confidence × blast radius ---------- */
  D.learningChart = {
    // x: agent confidence at correction · y: blast radius (items the change touched) · r: scaled
    series: [
      { kind: "Reusable skill", color: "rgba(41,112,122,.55)", border: "#29707A", points: [
        { x: 92, y: 147, r: 20, label: "Freeport reroute auto-approve" },
        { x: 88, y: 23, r: 12, label: "Re-source preview inline" },
        { x: 90, y: 64, r: 15, label: "Covenant-safe swap pattern" } ] },
      { kind: "Policy backlog", color: "rgba(107,54,168,.5)", border: "#6B36A8", points: [
        { x: 74, y: 14, r: 11, label: "Margin-floor covenant branch" },
        { x: 69, y: 9, r: 8, label: "Export-rate exception" } ] },
      { kind: "Content backlog", color: "rgba(154,101,0,.5)", border: "#9A6500", points: [
        { x: 63, y: 9, r: 9, label: "PP carrier let-down article" },
        { x: 58, y: 6, r: 7, label: "REACH SVHC substitute note" } ] },
    ],
  };

  /* ---------- Supply hierarchy — dendrogram (Group ontology alternate lens) ---------- */
  D.supplyHierarchy = {
    name: "Dow EU · Elastomers",
    children: [
      { name: "Terneuzen", kind: "plant", children: [
        { name: "Line 2", kind: "cracker" },
        { name: "ENGAGE XLT", kind: "family", children: [
          { name: "XLT 8677", kind: "sku" }, { name: "XLT 8688", kind: "sku" } ] },
        { name: "Brandt", kind: "customer" } ] },
      { name: "Freeport", kind: "plant", children: [
        { name: "Line 5", kind: "cracker" },
        { name: "ENGAGE HM", kind: "family", children: [
          { name: "HM 7387", kind: "sku" }, { name: "HM 7487", kind: "sku" } ] },
        { name: "Halcyon", kind: "customer" } ] },
    ],
  };

  window.D = D;

  /* ---------- Backtest charts — version tradeoffs + decision matrix ---------- */
  D.backtestCharts = {
    radarDims: ["Working capital", "Service / promise", "Margin protection", "Covenant safety", "Speed to act", "Auditability"],
    radar: {
      "v3.0": [35, 45, 80, 70, 30, 88],
      "v3.1": [88, 92, 72, 90, 86, 95],
      "v3.2": [38, 42, 95, 55, 35, 90],
    },
    // days of inventory by version (lower is better)
    doi: { "v3.0": 44.3, "v3.1": 41.2, "v3.2": 44.3 },
  };

  window.D = D;
})();
