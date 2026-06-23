/* ============================================================
   Dow ChemAssist CX — data model, organised by JOB-TO-BE-DONE.
   Central object = the Application Case. The agent auto-detects
   which of 7 customer types (jobs) you're in and adapts; the
   environment (desk / lab / plant-floor) reshapes the surface.
   Commercial spine: Need → Recommend → Sample → Test → Validate
   → Quote → PO → Reorder → Scale.
   ============================================================ */
window.DX = (function () {

  /* ---------------- signed-in customer (one user, many jobs) ---------------- */
  const account = {
    name: "Mara Lin", first: "Mara", initials: "ML",
    role: "Materials Engineering Lead",
    company: "Brandt Industries",
    division: "Advanced Materials Group",
    since: "Customer since 2019", region: "Germany / EU + US",
    email: "mara.lin@brandt-ind.com",
    blurb: "Diversified manufacturer — performance footwear, flexible food packaging and automotive interiors, plus the Terneuzen converting plant.",
    mandate: "Mara leads materials engineering across all three divisions, standardizing them on one Dow polyolefin-elastomer platform — AFFINITY, INFUSE and ENGAGE — where low-temperature performance is the common thread that carries from one application to the next.",
    // least-privilege entitlements (governance realism)
    entitlements: {
      role: "Materials Engineering Lead",
      onlineOrdering: false,           // → PO placement routes to Dow sales / procurement
      pricingVisibility: "list",       // sees list pricing, not contract tiers
      redacted: [
        ["Contract pricing tiers", "Procurement role only"],
        ["Credit limit & balance", "Finance / Procurement only"],
      ],
      granted: [
        ["Technical data & specs", "Full access"],
        ["Sample requests", "Enabled"],
        ["Quote requests", "Enabled"],
        ["PO placement", "Routed to Dow sales — not enabled for this role"],
      ],
    },
  };

  /* ---------------- channels (omnichannel continuity) ---------------- */
  const channels = {
    portal: { label: "Portal", icon: "dashboard", color: "#29707A", tint: "var(--k-ai-spruce-12)" },
    email:  { label: "Email", icon: "document-chart", color: "#1E5BB8", tint: "#E5EEFB" },
    sales:  { label: "Sales note", icon: "group", color: "#B45309", tint: "#FEF3E2" },
    phone:  { label: "Phone", icon: "chat-bot", color: "#6B36A8", tint: "#F0E6FA" },
    plant:  { label: "Plant floor", icon: "warning-alt", color: "#B42318", tint: "#FEE9E7" },
  };
  const actors = {
    you:        { label: "Mara Lin", sub: "you", kind: "you" },
    chemassist: { label: "ChemAssist", sub: "agent", kind: "ai" },
    rep:        { label: "Dow team", sub: "Technical Service / Sales", kind: "rep" },
    system:     { label: "System", sub: "policy / audit", kind: "system" },
  };

  /* ---------------- versioned document registry (internal-first, public citation) ---------------- */
  const documents = {
    "tds-1881":   { title: "AFFINITY™ PL 1881G — Technical Data Sheet", kind: "TDS", rev: "v6.2", date: "14 Apr 2026", source: "internal", public: "dow.com/TDS" },
    "sds-1881":   { title: "AFFINITY™ PL 1881G — Safety Data Sheet", kind: "SDS", rev: "v4.2 (DE)", date: "31 Mar 2026", source: "internal", public: "dow.com/SDS", lag: "public copy 3 days behind internal release" },
    "decl-eu1881":{ title: "EU 10/2011 food-contact declaration", kind: "Declaration", rev: "v3.0", date: "09 Jan 2026", source: "internal", public: "dow.com/REACH" },
    "coa-4471a":  { title: "Certificate of Analysis — lot 4471-A", kind: "CoA", rev: "lot 4471-A", date: "22 May 2026", source: "internal", public: null },
    "tds-9107":   { title: "INFUSE™ 9107 — Technical Data Sheet", kind: "TDS", rev: "v5.1", date: "02 Feb 2026", source: "internal", public: "dow.com/TDS" },
    "guide-foam": { title: "Footwear foaming application guide", kind: "App. guide", rev: "v2.3", date: "18 Nov 2025", source: "internal", public: "dow.com/library" },
    "tds-7467":   { title: "ENGAGE™ 7467 — Technical Data Sheet", kind: "TDS", rev: "v4.0", date: "27 Mar 2026", source: "internal", public: "dow.com/TDS" },
    "guide-tpo":  { title: "TPO interior compounding guide", kind: "App. guide", rev: "v1.4", date: "12 Dec 2025", source: "internal", public: "dow.com/library" },
    "reg-reach":  { title: "REACH registration dossier", kind: "REACH", rev: "2026 update", date: "05 Mar 2026", source: "internal", public: "REACH portal" },
  };
  const docRef = (id) => documents[id] || { title: id, kind: "Doc", rev: "—", date: "", source: "internal", public: null };

  /* ---------------- per-case replayable history (audit + omnichannel) ---------------- */
  const caseHistory = {
    "CASE-02111": [
      { t: "08:14", date: "28 Apr", stage: "Need", channel: "portal", actor: "you", icon: "chat-bot", title: "Described the application", detail: "“High-rebound basketball midsole foam at ≤ 0.18 g/cm³.”" },
      { t: "08:14", date: "28 Apr", stage: "Recommend", channel: "portal", actor: "chemassist", icon: "recommend", title: "Matched & ranked grades", detail: "INFUSE™ 9107 (96% fit) + 9007 — grounded in TDS & foaming guide.", cites: ["tds-9107", "guide-foam"] },
      { t: "08:15", date: "28 Apr", stage: "Recommend", channel: "portal", actor: "system", icon: "anomaly", title: "Compliance pre-check", detail: "Skin-contact & REACH (EU export) cleared.", cites: ["reg-reach"], policy: "PAC: informational — no certification implied" },
      { t: "09:02", date: "28 Apr", stage: "Sample", channel: "portal", actor: "you", icon: "lightbulb", title: "Built a sample experiment", detail: "Round 1: INFUSE™ 9107 100%, chemical blow.", policy: "PAC: sample eligibility — cleared" },
      { t: "11:40", date: "02 May", stage: "Test", channel: "email", actor: "you", icon: "document-chart", title: "Returned test data by email", detail: "Rebound 58% · density 0.20 — folded into the case.", locale: "EN" },
      { t: "11:41", date: "02 May", stage: "Test", channel: "portal", actor: "chemassist", icon: "lightbulb", title: "Suggested Round 2", detail: "9107/9007 80:20 + nucleator to drop density." },
      { t: "14:20", date: "06 May", stage: "Validate", channel: "sales", actor: "rep", icon: "group", title: "Sales note added", detail: "“Customer aligned on Round 2; volume forecast ~25 t/yr.”" },
      { t: "10:05", date: "12 May", stage: "Quote", channel: "portal", actor: "chemassist", icon: "network", title: "Quote prepared", detail: "QR-2026-0488 · tiered pricing · Credit pre-cleared.", policy: "PAC: account standing verified" },
      { t: "10:12", date: "12 May", stage: "PO", channel: "portal", actor: "system", icon: "warning-alt", title: "Entitlement check", detail: "Online ordering not enabled for this role → routed to Dow sales.", policy: "PAC: least-privilege — PO placement gated" },
      { t: "16:30", date: "12 May", stage: "PO", channel: "phone", actor: "rep", icon: "chat-bot", title: "Sales placed the PO", detail: "PO-48261 confirmed on your behalf · 250 kg INFUSE™ 9107." },
    ],
    "CASE-01927": [
      { t: "09:14", date: "Today", stage: "Need", channel: "portal", actor: "you", icon: "chat-bot", title: "Asked for a food-contact seal resin", detail: "“EU food contact, heat-seal below 120 °C.”" },
      { t: "09:14", date: "Today", stage: "Recommend", channel: "portal", actor: "chemassist", icon: "recommend", title: "Ranked candidates", detail: "AFFINITY™ PL 1881G (96%) + PF 1140G.", cites: ["tds-1881"] },
      { t: "09:15", date: "Today", stage: "Validate", channel: "portal", actor: "system", icon: "anomaly", title: "Compliance check (RegRadar)", detail: "EU 10/2011 documented; formal certification → Regulatory review.", cites: ["decl-eu1881", "sds-1881"], policy: "PAC: certification boundary enforced" },
      { t: "09:40", date: "Today", stage: "Sample", channel: "portal", actor: "you", icon: "lightbulb", title: "Sample plan ready", detail: "1 kg qualification packs of both grades." },
    ],
    "CASE-03815": [
      { t: "14:21", date: "Now", stage: "Need", channel: "plant", actor: "you", icon: "warning-alt", title: "Reported a live line failure", detail: "Voice + photo: Line 4 seal-edge delamination at 135 °C." },
      { t: "14:21", date: "Now", stage: "Recommend", channel: "plant", actor: "chemassist", icon: "recommend", title: "Read the defect & lot", detail: "Lot 4471-A detected; likely edge-cooling delamination.", cites: ["tds-1881", "coa-4471a"] },
      { t: "14:22", date: "Now", stage: "Validate", channel: "plant", actor: "system", icon: "anomaly", title: "Safety boundaries locked", detail: "Max process temp & handling from SDS — unalterable.", cites: ["sds-1881"], policy: "PAC: live-line change → human authorisation required" },
      { t: "14:25", date: "Now", stage: "Validate", channel: "phone", actor: "rep", icon: "group", title: "Technical Service engaged", detail: "Full incident packet routed to a Dow specialist." },
    ],
    "CASE-00482": [
      { t: "16:05", date: "Yesterday", stage: "Need", channel: "portal", actor: "you", icon: "chat-bot", title: "Asked about cold-weather TPO", detail: "“Elastomer for a dashboard that performs cold.”" },
      { t: "16:06", date: "Yesterday", stage: "Recommend", channel: "portal", actor: "chemassist", icon: "document-chart", title: "Formulation guidance", detail: "ENGAGE™ 7467 · 15–30 phr starting range.", cites: ["tds-7467", "guide-tpo"] },
      { t: "16:30", date: "Yesterday", stage: "Validate", channel: "email", actor: "rep", icon: "group", title: "TS follow-up by email", detail: "Offered an application-specific review for the exact compound." },
    ],
  };

  /* ---------------- the 7 customer types (jobs-to-be-done) ---------------- */
  const customerTypes = [
    { id: "explorer",  name: "Application Explorer",      job: "Find the right material for an application", mode: "selector",   object: "Application Brief",        outcome: "Product discovery",  env: "desk",  icon: "recommend",     roles: "Product dev · Application eng · R&D lead" },
    { id: "builder",   name: "Experiment Builder",        job: "Create, request, test and iterate samples",   mode: "experiment", object: "Sample Experiment Plan",   outcome: "Faster qualification", env: "lab", icon: "lightbulb",  roles: "Materials eng · R&D scientist · Lab manager" },
    { id: "buyer",     name: "Procurement / PO Buyer",    job: "Convert a proven material into a quote or PO", mode: "order",      object: "Quote / PO Action",        outcome: "Revenue conversion", env: "desk",  icon: "network",       roles: "Procurement · Sourcing · Category mgr" },
    { id: "evaluator", name: "Technical Evaluator",       job: "Know how to formulate and process it",         mode: "formulation",object: "Formulation Guidance",     outcome: "Application success",env: "lab",   icon: "document-chart",roles: "Formulator · Technical service · Lab" },
    { id: "approver",  name: "Quality / Regulatory",      job: "Confirm it can be used safely & legally",      mode: "compliance", object: "Compliance Check",         outcome: "Risk reduction",     env: "desk",  icon: "anomaly",       roles: "Quality · Regulatory · Food-contact lead" },
    { id: "operator",  name: "Plant-Floor Troubleshooter",job: "Diagnose a live failure and keep running",     mode: "production", object: "Production Incident",      outcome: "Retention",          env: "plant", icon: "warning-alt",   roles: "Plant ops · Process eng · Line supervisor" },
    { id: "sponsor",   name: "Business Sponsor",          job: "Decide whether to scale commercially",         mode: "conversion", object: "Opportunity Summary",      outcome: "Sample-to-revenue",  env: "desk",  icon: "analytics",     roles: "BD lead · Program mgr · Eng director" },
  ];
  const typeById = (id) => customerTypes.find(c => c.id === id);

  /* ---------------- modes (agent capabilities) ---------------- */
  const modes = {
    selector:    { label: "Product Selector",         icon: "recommend",      tone: "spruce" },
    specmatch:   { label: "Spec & Document Lookup",    icon: "document-chart", tone: "spruce" },
    image:       { label: "Image Understanding",       icon: "recommend",      tone: "spruce" },
    experiment:  { label: "Sample Experiment",        icon: "lightbulb",      tone: "spruce" },
    order:       { label: "Order Intelligence",       icon: "network",        tone: "spruce" },
    formulation: { label: "Formulation Advisor",      icon: "document-chart", tone: "spruce" },
    compliance:  { label: "Regulatory Fast-Track",    icon: "anomaly",        tone: "amber" },
    production:  { label: "Live Production Support",   icon: "warning-alt",    tone: "red" },
    conversion:  { label: "Commercial Conversion",    icon: "analytics",      tone: "spruce" },
  };

  /* ---------------- environments ---------------- */
  const environments = {
    desk:  { id: "desk",  label: "Desk", icon: "dashboard",  note: "Planning & evaluation — full workbench." },
    lab:   { id: "lab",   label: "Lab",  icon: "lightbulb",  note: "Experimentation — upload test data, iterate." },
    plant: { id: "plant", label: "Plant floor", icon: "warning-alt", note: "In-situ — voice & camera first, safety locked." },
  };

  /* ---------------- Unified agent roster — one identity, both lenses ----------------
     Each agent carries a customer-facing name AND a spine identity: the node it maps
     to, the systems it reads (MCP), the actions it can take, its autonomy bound, and
     the productized team that owns it. The operator registry is the canonical source. */
  const agents = [
    { id: "concierge",   name: "Sales Concierge",       role: "Owns your relationship · greets & routes",  icon: "chat-bot",       color: "#6B36A8", tint: "#F0E6FA",               task: "understanding your request",        reach: "ChemAssist · always on",
      node: "Orchestration", screen: "spine", team: "Customer Ordering", autonomy: "Acts unattended",
      inputs: ["Customer identity & entitlements", "Conversation & intent", "Case / order context"], outputs: ["Routes to the right agent", "Opens / resumes a case", "Surfaces proactive updates"] },
    { id: "application", name: "Application Specialist", role: "Matches inventory to your need",            icon: "recommend",      color: "#29707A", tint: "var(--k-ai-spruce-12)",  task: "matching grades to your brief",     reach: "Dow Application Engineering",
      node: "Discovery / Ontology", screen: "ontology", team: "Customer Ordering", autonomy: "Acts unattended",
      inputs: ["Product catalog & PIM", "TDS / application guides", "Application brief"], outputs: ["Ranked grade recommendations", "Comparison & rationale", "Citations"] },
    { id: "sample",      name: "Sample Coordinator",    role: "Sets up & tracks your samples",             icon: "lightbulb",      color: "#1E5BB8", tint: "#E5EEFB",               task: "preparing your sample experiment",  reach: "Dow Technical Sales",
      node: "Sample Orchestration", screen: "spine", team: "Intelligent Fulfilment", autonomy: "Acts in-bounds",
      inputs: ["Sample workflow & eligibility", "Lot availability", "Test objective"], outputs: ["Sample experiment plan", "Request & tracking", "Next-round suggestion"] },
    { id: "deal",        name: "Account & Deal Manager",role: "Quote, PO, terms & reorder",                icon: "network",        color: "#B45309", tint: "#FEF3E2",               task: "preparing your commercial action",  reach: "Your Dow account manager",
      node: "Commercial Orchestration", screen: "o2c", team: "Revenue Automation", autonomy: "Prepares · human confirms",
      inputs: ["Account terms & history", "Pricing & ATP", "Quote / PO state"], outputs: ["Quote & PO draft", "Reorder prompt", "Order-to-cash actions"] },
    { id: "compliance",  name: "Compliance Officer",    role: "Regulatory & food-contact gate",            icon: "anomaly",        color: "#15803D", tint: "#E7F6EC",               task: "clearing regulatory status",        reach: "Dow Regulatory Affairs",
      node: "Governance / PAC", screen: "governance", team: "Governance", autonomy: "Gated · routes to human",
      inputs: ["RegRadar intelligence", "SDS / RDS / REACH", "Jurisdiction & application"], outputs: ["Compliance check", "Boundary enforcement", "Routes certification to Regulatory"] },
    { id: "credit",      name: "Credit & Authorization",role: "Account standing & spend authority",        icon: "document-chart", color: "#9333EA", tint: "#F0E6FA",               task: "checking account standing",         reach: "Dow Credit",
      node: "Governance / PAC", screen: "governance", team: "Revenue Automation", autonomy: "Gated · policy-checked",
      inputs: ["Credit & balance", "Role entitlements", "Order value"], outputs: ["Account clearance", "Spend-authority decision", "Least-privilege enforcement"] },
    { id: "supply",      name: "Supply & Fulfillment",  role: "Stock, lead time & expedite",               icon: "network",        color: "#0E7490", tint: "#E0F2F4",               task: "checking stock & lead time",        reach: "Dow Supply Chain",
      node: "Fulfilment Orchestration", screen: "spine", team: "Intelligent Fulfilment", autonomy: "Acts in-bounds",
      inputs: ["ERP / inventory & ATP", "Plant schedule & digital twin", "Logistics / TMS"], outputs: ["Available-to-promise", "Allocation & reprioritisation", "Expedite & routing"] },
    { id: "regradar",    name: "RegRadar",              role: "Continuous regulatory intelligence",         icon: "anomaly",        color: "#B45309", tint: "#FEF3E2",               task: "monitoring regulatory change",      reach: "RegRadar knowledge base",
      node: "RegRadar", screen: "flow", team: "Governance", autonomy: "Monitors · alerts proactively",
      inputs: ["Global regulatory feeds", "Jurisdiction rules & SMLs", "Product-to-obligation map"], outputs: ["Change alerts", "Obligation mapping", "Provenance & effective dates"] },
  ];
  const agentById = (id) => agents.find(a => a.id === id);

  /* per-journey flow map — which agent leads each commercial-spine stage */
  const agentFlow = [
    { stage: "Need", agent: "concierge" },
    { stage: "Recommend", agent: "application" },
    { stage: "Sample", agent: "sample" },
    { stage: "Validate", agent: "compliance" },
    { stage: "Quote", agent: "deal" },
    { stage: "PO", agent: "credit" },
    { stage: "Fulfil", agent: "supply" },
    { stage: "Monitor", agent: "regradar" },
  ];

  /* ---------------- gates: inventory → sample → PO ---------------- */
  const gates = {
    eligibility:   { id: "eligibility",   name: "Sample eligibility",     owner: "sample",     clearer: "agent",    transition: "Inventory → Sample", desc: "Your account may receive this sample in this region." },
    compliance:    { id: "compliance",    name: "Compliance clearance",   owner: "compliance", clearer: "agent",    transition: "Spans the deal",     desc: "Region + application cleared. Formal certification routes to Dow Regulatory." },
    qualification: { id: "qualification", name: "Technical qualification",owner: "sample",     clearer: "customer", transition: "Sample → PO",        desc: "Sample passed your testing — your sign-off advances the deal." },
    export:        { id: "export",        name: "Export / trade control", owner: "deal",       clearer: "agent",    transition: "→ PO",               desc: "Trade-control screening for the ship-to country." },
  };
  const gateState = {
    cleared:  { label: "Cleared",            tone: "ok" },
    review:   { label: "Routed to Dow review", tone: "review" },
    pending:  { label: "Awaiting your sign-off", tone: "pending" },
    progress: { label: "In progress",        tone: "progress" },
    na:       { label: "Not yet reached",    tone: "na" },
  };
  const dealFunnel = ["Inventory", "Sample", "PO"];

  /* per-case deal state: phase, deal-team roster, lead, gate states */
  const deals = {
    "CASE-01927": { phase: "sample", lead: "application", team: ["concierge", "application", "compliance", "sample", "supply"],
      gates: { eligibility: "cleared", export: "cleared", compliance: "review", qualification: "na" } },
    "CASE-02111": { phase: "po", lead: "deal", team: ["concierge", "application", "sample", "deal", "credit", "supply"],
      gates: { eligibility: "cleared", export: "cleared", compliance: "cleared", qualification: "pending" } },
    "CASE-00482": { phase: "sample", lead: "sample", team: ["concierge", "application", "sample", "compliance"],
      gates: { eligibility: "cleared", export: "cleared", compliance: "cleared", qualification: "progress" } },
    "CASE-03815": { phase: "support", lead: "concierge", team: ["concierge", "sample", "compliance", "supply"], gates: {} },
  };
  const dealFor = (code) => deals[code];

  /* ---------------- product catalog (covers all 4 applications) ---------------- */
  const products = [
    { id: "affinity-1881", name: "AFFINITY™ PL 1881G", family: "Polyolefin Plastomer (POP)", accent: "#0F766E", icon: "shield-check", logo: "assets/affinity-logo.png",
      tagline: "Low-temperature heat-seal resin for flexible food packaging.",
      blurb: "Polyolefin plastomer engineered for low seal-initiation temperature and high hot-tack in extrusion-coating and cast-film seal layers — documented for EU and FDA food contact.",
      tags: ["Food contact", "Low-temp seal", "Packaging", "High hot-tack"], app: "packaging",
      props: [["Seal initiation", "88", "°C", "internal"], ["Density", "0.904", "g/cm³", "ISO 1183"], ["Melt index", "1.0", "g/10 min", "ISO 1133"], ["Hot-tack", "High", "—", "internal"]],
      bullets: ["Seals at ≈88 °C — clears a <120 °C line with margin", "EU 10/2011 & FDA 21 CFR 177.1520 documentation available", "EU qualification lot in stock"],
      fit: 96 },
    { id: "affinity-1140", name: "AFFINITY™ PF 1140G", family: "Polyolefin Plastomer (POP)", accent: "#0E7490", icon: "shield-check", logo: "assets/affinity-logo.png",
      tagline: "Broad-availability seal resin with strong EU stock.",
      blurb: "Companion seal-layer plastomer with the widest EU on-hand stock of the candidates and comparable optics.",
      tags: ["Food contact", "Seal layer", "In stock"], app: "packaging",
      props: [["Seal initiation", "96", "°C", "internal"], ["Density", "0.897", "g/cm³", "ISO 1183"], ["Melt index", "1.6", "g/10 min", "ISO 1133"]],
      bullets: ["Seals at ≈96 °C — within a <120 °C target", "Largest EU on-hand stock", "EU 10/2011 documentation available"], fit: 88 },
    { id: "infuse-9107", name: "INFUSE™ 9107", family: "Olefin Block Copolymer (OBC)", accent: "#E11B22", icon: "renew", logo: "assets/infuse-logo.png",
      tagline: "High-rebound foam for performance footwear midsoles.",
      blurb: "Olefin block copolymer for low-density, high-resilience foamed midsoles — exceptional energy return and low compression set.",
      tags: ["High rebound", "Lightweight", "Footwear", "Foam"], app: "footwear",
      props: [["Energy return (rebound)", "62", "%", "internal"], ["Density", "0.866", "g/cm³", "ISO 1183"], ["Shore A hardness", "75", "—", "ASTM D2240"], ["Compression set", "18", "%", "ISO 815"]],
      bullets: ["Up to 62% energy return in foamed midsoles", "20–30% lighter than EVA at equal cushioning", "Excellent compression-set retention"], fit: 96, rebound: 62, density: 0.866 },
    { id: "infuse-9007", name: "INFUSE™ 9007", family: "Olefin Block Copolymer (OBC)", accent: "#C2185B", icon: "renew", logo: "assets/infuse-logo.png",
      tagline: "Soft, flexible foam for plush cushioning.",
      blurb: "Lower-modulus OBC for soft, conformable foamed components; pairs with 9107 in dual-density stacks.",
      tags: ["Soft", "Flexible", "Footwear", "Comfort"], app: "footwear",
      props: [["Energy return", "54", "%", "internal"], ["Density", "0.866", "g/cm³", "ISO 1183"], ["Shore A hardness", "60", "—", "ASTM D2240"]],
      bullets: ["Soft hand-feel for plush cushioning", "Pairs with INFUSE™ 9107 for dual-density"], fit: 88, rebound: 54, density: 0.866 },
    { id: "engage-7467", name: "ENGAGE™ 7467", family: "Polyolefin Elastomer (POE)", accent: "#1E5BB8", icon: "network", logo: "assets/engage-logo.png",
      tagline: "Cold-temperature impact modifier for automotive TPO.",
      blurb: "Low-glass-transition ethylene-butene POE that retains impact performance at low temperature — a workhorse for cold-weather automotive TPO interior compounds.",
      tags: ["Cold-weather", "Impact", "Automotive", "TPO"], app: "auto",
      props: [["Density", "0.862", "g/cm³", "ISO 1183"], ["Melt index", "1.2", "g/10 min", "ISO 1133"], ["Tg", "−58", "°C", "DSC"], ["Shore A hardness", "70", "—", "ASTM D2240"]],
      bullets: ["Retains impact strength to −40 °C ductile range", "Excellent low-temp flexibility for dashboards", "Documented for TPO interior compounds"], fit: 94 },
    { id: "engage-8842", name: "ENGAGE™ 8842", family: "Polyolefin Elastomer (POE)", accent: "#2563EB", icon: "network", logo: "assets/engage-logo.png",
      tagline: "High-rubber POE for soft-touch automotive TPO.",
      blurb: "High-octene POE delivering very soft, flexible TPO compounds; common impact modifier and flexibiliser.",
      tags: ["Soft-touch", "Flexibiliser", "Automotive", "TPO"], app: "auto",
      props: [["Density", "0.857", "g/cm³", "ISO 1183"], ["Melt index", "1.0", "g/10 min", "ISO 1133"], ["Shore A hardness", "54", "—", "ASTM D2240"]],
      bullets: ["Very soft for premium-feel interiors", "High flexibiliser efficiency", "Pairs with 7467 for cold-temp balance"], fit: 80 },
  ];
  const productById = (id) => products.find(p => p.id === id);

  /* ---------------- documents shared on products ---------------- */
  const docsFor = (p) => [["Technical Data Sheet (TDS)", "PDF · 240 KB", "EN"], ["Safety Data Sheet (SDS)", "PDF · 180 KB", "EN / multi"], [(p.app === "packaging" ? "EU 10/2011 declaration" : p.app === "auto" ? "Automotive compounding guide" : "Footwear foaming application guide"), "PDF · 1.2 MB", "EN"]];
  const samplesFor = (p) => [["200 g", "Lab evaluation", "In stock · ships in 2 days"], ["2 kg", "Pilot trial", "In stock · ships in 3 days"], ["10 kg", "Pre-production", "Lead time 5–7 days"]];

  /* ---------------- commercial spine stages ---------------- */
  const spine = ["Need", "Recommend", "Sample", "Test", "Validate", "Quote", "PO", "Reorder", "Scale"];

  /* ============================================================
     APPLICATION CASES — the central object
     ============================================================ */
  const cases = [
    /* ---- HERO 1 · Explorer → Sample (food packaging) ---- */
    {
      code: "CASE-01927", trace: "KAF-9F2A-4471",
      title: "Flexible food packaging — low-temp seal resin",
      app: "packaging", appLabel: "Packaging · Food & specialty",
      type: "explorer", env: "desk", icon: "recommend",
      status: "Active", stage: 2, hero: true, opened: "Today · 09:14",
      summary: "Coating resin for flexible food packaging, EU food contact, heat-seal below 120 °C.",
      prompt: "I need a coating resin for flexible food packaging that meets EU food contact regulations, with a heat-seal temperature below 120 °C.",
      brief: [["Application", "Flexible food packaging — seal layer"], ["Performance", "Seal initiation < 120 °C, high hot-tack"], ["Regulatory", "EU 10/2011 food contact, REACH"], ["Region", "European Union · ship-to DE"], ["Form", "Pellet · extrusion coating / cast film"]],
      products: ["affinity-1881", "affinity-1140"],
      compliance: { jurisdiction: "Germany / EU", state: "ok",
        domains: [["EU 10/2011 (food contact)", "Documentation available", true], ["REACH registration", "Registered", true], ["GHS classification", "Not hazardous", true], ["SDS (German)", "Available · v4.2", true], ["Formal food-contact certification", "Requires Regulatory review", false]],
        source: "RegRadar · EU regulatory KB · refreshed 31-05-2026",
        boundary: "Informational guidance, not a formal certification. ChemAssist never implies certification unless the approved process issues it." },
      experiment: { objective: "Confirm seal window < 120 °C on Brandt's FFS line", state: "Plan ready", packs: [["AFFINITY™ PL 1881G", "1 kg"], ["AFFINITY™ PF 1140G", "1 kg"]] },
      contacts: { dow: "Dow Technical Service · Packaging", sales: "Mara's Dow account team" },
    },

    /* ---- HERO 2 · Experiment Builder → PO Buyer (footwear) ---- */
    {
      code: "CASE-02111", trace: "KAF-5B70-1180",
      title: "Footwear foam — impact-rebound experiment",
      app: "footwear", appLabel: "Consumer · Performance footwear",
      type: "builder", env: "lab", icon: "lightbulb",
      status: "In test", stage: 5, hero: true, opened: "28 May · 11:40",
      summary: "Apex Pro basketball midsole — maximise energy return at ≤ 0.18 g/cm³ foam density.",
      prompt: "The Round 1 sample worked well. Help me iterate, and move the proven grade toward a quote.",
      brief: [["Application", "Basketball midsole foam"], ["Goal", "Rebound ≥ 58% at ≤ 0.18 g/cm³"], ["Base grade", "INFUSE™ 9107"], ["Programme", "Apex Pro · footwear division"], ["Region", "US"]],
      products: ["infuse-9107", "infuse-9007"],
      experiment: { objective: "Max energy return at ≤ 0.18 g/cm³ foamed density", state: "Round 2 in test", round: 2,
        rounds: [
          { n: 1, config: "INFUSE™ 9107 · 100% · chemical blow", result: "Rebound 58% · density 0.20 · slight surface coarseness", verdict: "Good rebound, density a touch high", tone: "warn", done: true },
          { n: 2, config: "INFUSE™ 9107/9007 80:20 · co-blow + nucleator", result: "Awaiting your test data", verdict: "In test", tone: "info", done: false },
        ],
        packs: [["INFUSE™ 9107", "2 kg"], ["INFUSE™ 9007", "2 kg"]] },
      commercial: { qualification: 70, blockers: ["Round 2 test data pending", "Volume forecast to confirm with Sales"], next: "Convert Round 1 grade to a quote; PO once Round 2 confirms density", po: { last: "PO-47002", reorder: "INFUSE™ 9107 · 25 kg production" } },
      compliance: { jurisdiction: "US", state: "ok", domains: [["FDA / skin contact", "Documented", true], ["REACH (EU export)", "Registered", true]], source: "RegRadar · refreshed 31-05-2026", boundary: "Informational guidance only." },
      contacts: { dow: "Dow Technical Service · Footwear", sales: "Dow Consumer account team" },
    },

    /* ---- HERO 3 · Plant-floor → Technical Service + Expedite (Line 4) ---- */
    {
      code: "CASE-03815", trace: "KAF-3B90-8812",
      title: "Line 4 — seal-edge delamination (production incident)",
      app: "packaging", appLabel: "Terneuzen plant · Line 4",
      type: "operator", env: "plant", icon: "warning-alt",
      status: "Live · diagnostics", stage: 3, hero: true, opened: "Now · 14:21",
      summary: "Barrier layer delaminating right after the cooling jaw on Line 4 at 135 °C.",
      prompt: "Look at this seal tear on the tracking edge. We're running at 135 °C on Line 4 but the barrier layer is peeling apart right after the cooling jaw. Why is it delaminating?",
      brief: [["Line", "Line 4 · cast-film / lamination"], ["Symptom", "Seal-edge delamination at tracking edge"], ["When", "Right after the cooling jaw"], ["Seal temp", "135 °C"], ["Material lot", "AFFINITY™ PL 1881G · lot 4471-A (detected)"]],
      products: ["affinity-1881"],
      incident: { headline: "Likely seal-edge delamination pattern", confidence: 55, confidenceLabel: "Medium",
        contributors: [["Cooling rate too fast at the edge", "High", "warn"], ["Cooling-jaw pressure uneven across web", "Medium", "warn"], ["Seal temp marginal for full interface bond", "Medium", "warn"], ["Line speed vs. dwell-time window", "Low-medium", "low"]],
        safety: ["Do not exceed the documented max process temperature for this grade.", "Material handling & purge guidance from Dow safety data is fixed and cannot be overridden here."],
        recommended: "Route to Dow Technical Service before any process change. ChemAssist prepares the option; PAC checks safety, authorisation & warranty; you or your Dow rep confirm.",
        boundary: "ChemAssist does not prescribe operating settings for a live, safety-sensitive line. It prepares the option and routes the expert." },
      contacts: { dow: "Dow Technical Service · live", sales: "Brandt account team", supply: "Dow Supply — expedite desk" },
    },

    /* ---- LIGHTER · Technical Evaluator / Explorer (automotive TPO) ---- */
    {
      code: "CASE-00482", trace: "KAF-7C18-2290",
      title: "Automotive dashboard TPO — cold-weather evaluation",
      app: "auto", appLabel: "Mobility · Interior TPO",
      type: "evaluator", env: "lab", icon: "document-chart",
      status: "Active", stage: 3, hero: false, opened: "Yesterday · 16:05",
      summary: "Elastomer for an automotive dashboard TPO that performs in cold weather; loading & processing guidance.",
      prompt: "I need an elastomer for an automotive dashboard that performs in cold weather — and the recommended loading level in our TPO compound.",
      brief: [["Application", "Dashboard skin — TPO"], ["Performance", "Ductile impact to −40 °C"], ["Question", "POE grade + loading level"], ["Region", "EU"]],
      products: ["engage-7467", "engage-8842"],
      guidance: { headline: "Documented starting range — grounded in Dow guidance", confidence: 78, confidenceLabel: "Medium-high",
        ranges: [["ENGAGE™ 7467 loading", "15 – 30 phr", "cold-temp impact modifier in TPO"], ["Polypropylene matrix", "balance", "to stiffness / heat-sag target"], ["Melt-compounding temp", "190 – 210 °C", "twin-screw window"]],
        caveats: ["Documented as a starting range — not a validated formulation for your line.", "Filler & UV package interactions are application-specific.", "Cold-impact and heat-aging must be qualified on your own compound."],
        boundary: "Does not replace application-specific qualification. For your exact formulation I recommend a Technical Service review." },
      compliance: { jurisdiction: "EU", state: "ok", domains: [["REACH", "Registered", true], ["ELV / RoHS", "Compliant", true], ["VOC / fogging", "Data available", true]], source: "RegRadar · refreshed 31-05-2026", boundary: "Informational guidance only." },
      contacts: { dow: "Dow Technical Service · Mobility", sales: "Dow Mobility account team" },
    },
  ];
  const caseByCode = (code) => cases.find(c => c.code === code);

  /* ---------------- per-persona welcome-back suggestions ---------------- */
  const suggestions = {
    explorer:  [ { id: "find", icon: "recommend", title: "Find a material for a new application", body: "Describe what you're building — I'll translate it into a material brief and rank grades.", intent: "selector", compose: true, placeholder: "Describe the application you're building for…" } ],
    builder:   [ { id: "iterate", icon: "lightbulb", title: "Iterate your Apex Pro midsole", body: "Round 1 hit 58% rebound at 0.20 density. I have a blend that should drop density without losing rebound.", intent: "experiment", text: "Improve my Apex Pro midsole foam" } ],
    buyer:     [ { id: "quote", icon: "network", title: "Move the proven grade to a quote", body: "Your INFUSE™ 9107 trial qualified. Want a quote request and a PO draft prepared?", intent: "order", text: "Turn the approved INFUSE™ 9107 sample into a quote and PO" } ],
    operator:  [ { id: "incident", icon: "warning-alt", title: "Line 4 needs attention", body: "A delamination incident is open on Line 4. Open hands-free support.", intent: "production", text: "Line 4 barrier layer is delaminating after the cooling jaw at 135 °C" } ],
    evaluator: [ { id: "formulate", icon: "document-chart", title: "Cold-weather TPO loading", body: "Get the documented ENGAGE™ loading range for your dashboard TPO.", intent: "formulation", text: "Recommended ENGAGE™ loading level in a cold-weather automotive TPO" } ],
    approver:  [ { id: "comply", icon: "anomaly", title: "Check EU food-contact compliance", body: "Confirm the seal resin's EU 10/2011 status for your packaging.", intent: "compliance", text: "Does AFFINITY™ PL 1881G comply with EU food contact?" } ],
    sponsor:   [ { id: "scale", icon: "analytics", title: "Is the footwear programme ready to scale?", body: "See qualification status, blockers and the commercial next action for Apex Pro.", intent: "conversion", text: "Show me where the Apex Pro programme stands and what's needed to scale" } ],
  };

  /* ============================================================
     REIMAGINED ORDER-TO-CASH — customer layer, anchored on PO-48261.
     Customer Intent → AI Commercial Orchestration → Dynamic Supply
     Commitment → Autonomous Fulfilment → Real-Time Visibility →
     Predictive Revenue → Continuous Engagement. Event-driven.
     ============================================================ */
  const o2c = {
    po: "PO-48261", case: "CASE-02111",
    product: "INFUSE™ 9107", productId: "infuse-9107", qty: "250 kg",
    account: "Brandt Footwear · US", shipTo: "Brandt Footwear, Portland OR",
    value: "€1,800.00", incoterms: "DAP", terms: "Net 45", placed: "12 May 2026", lot: "9107-2614",
    // deliver-to-promise
    promise: { committed: "15 May", predicted: "15 May", accuracy: 97, status: "on-track",
      note: "Promised at order; ATP re-checked on every event. Confidence from the supply digital twin." },
    // the reimagined O2C spine, customer-facing
    stages: [
      { k: "Ordered", sub: "PO confirmed", date: "12 May", done: true },
      { k: "Committed", sub: "ATP promise locked", date: "12 May", done: true },
      { k: "In production", sub: "Terneuzen line 2", date: "13 May", done: true },
      { k: "Shipped", sub: "carrier assigned", date: "14 May", now: true },
      { k: "Delivered", sub: "your dock", date: "Est. 15 May" },
      { k: "Invoiced", sub: "event-driven", date: "on delivery" },
      { k: "Paid", sub: "Net 45", date: "—" },
    ],
    nowStage: 3,
    // live event stream (autonomous orchestration made visible)
    events: [
      { ts: "12 May · 16:30", icon: "checkmark-filled", chan: "system", title: "Order confirmed & ATP committed", detail: "Real-time available-to-promise locked 250 kg for 15 May.", tone: "ok", chain: ["deal", "supply", "concierge"] },
      { ts: "13 May · 06:10", icon: "network", chan: "plant", title: "Production scheduled — Terneuzen line 2", detail: "Slotted against contract priority; digital twin confirmed feasibility.", tone: "ok", chain: ["supply"] },
      { ts: "13 May · 18:42", icon: "warning-alt", chan: "plant", title: "Minor upstream delay — auto-reprioritised", detail: "A feedstock hiccup was absorbed by reslotting; promise held at 15 May.", tone: "warn", evt: "EVT-7741", chain: ["supply", "compliance", "concierge"] },
      { ts: "14 May · 09:05", icon: "network", chan: "logistics", title: "Carrier assigned & route optimised", detail: "Mode + carrier auto-selected for cost and on-time; tracking live.", tone: "ok", chain: ["supply"] },
      { ts: "14 May · 09:06", icon: "chat-bot", chan: "portal", title: "Proactive update sent to you", detail: "“Your order shipped — on track for 15 May.”", tone: "ok", chain: ["concierge"] },
    ],
    // simulate-able orchestration events (the doc's examples)
    sim: [
      { id: "change", label: "I changed my order", icon: "recommend", title: "Order change → ATP recalculated instantly", detail: "Quantity raised to 300 kg — supply digital twin re-committed; promise moved to 16 May.", tone: "warn", promise: "16 May", acc: 92, evt: "EVT-7758", chain: ["concierge", "deal", "supply"] },
      { id: "outage", label: "Plant outage", icon: "warning-alt", title: "Plant outage → commitments reprioritised", detail: "Terneuzen line paused; your order auto-reallocated to Tarragona by contract priority. Promise held at 15 May.", tone: "warn", promise: "15 May", acc: 90, evt: "EVT-7762", chain: ["supply", "compliance", "concierge"] },
      { id: "late", label: "Late shipment", icon: "anomaly", title: "Late-shipment risk → proactive notification", detail: "Predicted +1 day from a carrier weather delay. You were notified before it slipped, with a recovery option.", tone: "red", promise: "16 May", acc: 88, evt: "EVT-7770", chain: ["supply", "regradar", "concierge"] },
    ],
    // self-service change (configure-to-commit, ATP)
    atp: { baseQty: 250, baseDate: "15 May", inStock: 420, leadPerExtra: "≈ +1 day / 150 kg over stock" },
    // invoice-to-pay
    invoice: { id: "INV-2026-3318", status: "scheduled", amount: "€1,800.00", terms: "Net 45 · due 29 Jun", issue: "Event-driven — issues automatically on delivery confirmation" },
    // predictive revenue / intelligence surfaced to the customer
    intelligence: [
      { id: "late", icon: "anomaly", title: "Late-shipment risk", value: "Low · 8%", detail: "Digital-twin prediction across plant, carrier and weather signals. You'll be told before any slip.", tone: "ok" },
      { id: "price", icon: "analytics", title: "Dynamic price signal", value: "−3% available", detail: "Order your next 250 kg within the reorder window to lock a volume-tier price.", tone: "spruce" },
      { id: "demand", icon: "recommend", title: "Reorder forecast", value: "~12 days", detail: "Demand model projects your next reorder; a 300 kg lot would consolidate freight.", tone: "spruce" },
      { id: "alloc", icon: "network", title: "Allocation status", value: "Protected", detail: "Under constraint, your contract priority protects this volume — allocation optimises by margin, contract and strategic value.", tone: "ok" },
    ],
  };

  const starters = [
    "I need a material for a new application",
    "Help me iterate my current sample",
    "Turn an approved sample into a quote or PO",
    "Something on Line 4 is failing — show a photo",
  ];

  /* ============================================================
     IMAGE INPUT PIPELINE — image → interpretation → spec/sample
     Each example: classification, an editable Image Interpretation
     Card, an attribute-mapping chain, and the downstream intent it
     resolves into. Image becomes evidence on an existing case.
     ============================================================ */

  // intent chooser offered after every upload (hybrid: auto-propose + confirm)
  const imageIntents = [
    { id: "selector",   label: "Find material",      icon: "recommend",      hint: "Match this to Dow grades" },
    { id: "specmatch",  label: "Match to specs",     icon: "document-chart", hint: "Read the label / spec & look up" },
    { id: "production", label: "Troubleshoot",       icon: "warning-alt",    hint: "Diagnose a failure / defect" },
    { id: "experiment", label: "Sample it",          icon: "lightbulb",      hint: "Build a sample experiment" },
    { id: "compliance", label: "Check compliance",   icon: "anomaly",        hint: "Regulatory / food-contact" },
    { id: "expert",     label: "Ask an expert",      icon: "group",          hint: "Route to Dow Technical Service" },
  ];

  // the 6-step analysis (trust & safety: step-based loading)
  const imageSteps = [
    ["Image received", "uploaded & attached to the case"],
    ["Context interpreted", "what the image shows + the application"],
    ["Attributes mapped", "visible context → material attributes"],
    ["Specs checked", "matched against the Dow product registry"],
    ["Samples checked", "eligibility & lot availability"],
    ["Policy reviewed", "PAC: what may be shown to you"],
  ];

  const imageInputs = {
    dashboard: {
      id: "dashboard", file: "vehicle_interior_2026.jpg", img: "dow/samples/img-dashboard.png",
      tile: { label: "Car dashboard", sub: "application photo", icon: "recommend" },
      detectedType: "Application photo", typeConfidence: 91,
      proposedIntent: "selector", offer: ["selector", "compliance", "experiment", "expert"],
      caseCode: "CASE-00482", env: "desk", resultIntent: "selector",
      interp: {
        application: "Automotive interior — dashboard skin / instrument panel",
        materialSystem: "Thermoplastic polyolefin (TPO): PP matrix + POE impact modifier",
        confidence: 86,
        performance: ["Soft-touch, low-gloss surface", "Low-temperature impact (cold-weather)", "UV & heat-aging stability", "Low fogging / VOC for cabin air"],
        stillNeed: ["Service temperature range", "Target Shore hardness", "Grain / finish spec"],
      },
      mapping: [
        ["Matte grained dashboard skin", "Soft-touch, low-gloss TPO surface", "POE flexibiliser"],
        ["Automotive cabin context", "Cold-impact + heat-aging + low fog", "ENGAGE™ 7467 (low Tg)"],
        ["Large moulded panel", "Flow + stiffness balance", "ENGAGE™ 8842 soft-touch"],
      ],
      noviceSuggest: [
        { say: "I don't want it to crack when it's cold", attr: "Low-temperature impact (low Tg)", spec: "Tg · ductile-brittle transition", grade: "ENGAGE™ 7467" },
        { say: "It should feel soft, not hard plastic", attr: "Low modulus / soft-touch surface", spec: "Shore A hardness", grade: "ENGAGE™ 8842" },
        { say: "It shouldn't smell or fog up the windshield", attr: "Low fogging / low VOC", spec: "fogging · VOC emission", grade: "low-VOC POE grades" },
      ],
    },
    defect: {
      id: "defect", file: "line4_seal_edge_1421.jpg", img: "dow/samples/img-defect.png",
      tile: { label: "Seal defect", sub: "failure photo", icon: "warning-alt" },
      detectedType: "Defect / failure photo", typeConfidence: 88,
      proposedIntent: "production", offer: ["production", "expert", "specmatch", "compliance"],
      caseCode: "CASE-03815", env: "plant", resultIntent: "production",
      interp: {
        application: "Flexible packaging — seal-edge delamination on a barrier film",
        materialSystem: "Heat-seal layer · AFFINITY™ PL 1881G (lot 4471-A, from label)",
        confidence: 74,
        performance: ["Interface bond integrity at the tracking edge", "Even cooling across the web", "Seal temperature within the bonding window"],
        stillNeed: ["Line speed & dwell time", "Cooling-jaw pressure profile", "Substrate / lamination structure"],
      },
      mapping: [
        ["Edge-localised peel after cooling jaw", "Cooling rate too fast at the edge", "review cooling profile"],
        ["Clean delamination, no burn", "Seal temp marginal for full bond", "check vs. TDS window"],
        ["Tracking-edge only", "Uneven jaw pressure across web", "mechanical check"],
      ],
      noviceSuggest: [
        { say: "The seal keeps peeling apart", attr: "Interface bond strength", spec: "seal strength · peel force", grade: "review seal layer" },
        { say: "It only fails on the cold edge", attr: "Edge cooling uniformity", spec: "cooling profile across web", grade: "process check" },
        { say: "I can't slow the line down", attr: "Seal at high line speed", spec: "hot-tack · seal-initiation temp", grade: "AFFINITY™ low-temp seal" },
      ],
    },
    label: {
      id: "label", file: "resin_bag_label.jpg", img: "dow/samples/img-label.png",
      tile: { label: "Product label", sub: "OCR → spec lookup", icon: "document-chart" },
      detectedType: "Product label / spec sheet", typeConfidence: 96,
      proposedIntent: "specmatch", offer: ["specmatch", "compliance", "experiment", "selector"],
      caseCode: "CASE-01927", env: "desk", resultIntent: "specmatch",
      ocr: [["Product", "AFFINITY™ PL 1881G"], ["Grade family", "Polyolefin Plastomer"], ["Lot", "4471-A"], ["Net weight", "25 kg"], ["MFR", "1.0 g/10 min"], ["Marking", "EU 10/2011 · REACH"]],
      interp: {
        application: "Identified product — AFFINITY™ PL 1881G heat-seal resin",
        materialSystem: "Polyolefin plastomer · food-contact seal layer",
        confidence: 95,
        performance: ["Confirm this is the right grade for the application", "Pull current TDS / SDS revision", "Verify regulatory status for the region"],
        stillNeed: ["Your application & region (to confirm fit)"],
      },
      mapping: [
        ["Label text 'PL 1881G'", "Exact grade match in registry", "AFFINITY™ PL 1881G"],
        ["Marking 'EU 10/2011'", "Food-contact documentation set", "TDS · SDS · declaration"],
        ["Lot 4471-A", "Lot-specific CoA on file", "certificate of analysis"],
      ],
      noviceSuggest: [
        { say: "Is this safe to use with food?", attr: "Food-contact compliance", spec: "EU 10/2011 · FDA 21 CFR", grade: "documented for PL 1881G" },
        { say: "Will it seal at a low temperature?", attr: "Low seal-initiation temperature", spec: "seal-initiation temp ≈ 88 °C", grade: "AFFINITY™ PL 1881G" },
        { say: "Is this the latest version of the data?", attr: "Current document revision", spec: "TDS · SDS revision", grade: "registry lookup" },
      ],
    },
    plant: {
      id: "plant", file: "line4_floor_view.jpg", img: "dow/samples/img-plant.png",
      tile: { label: "Production line", sub: "in-situ support", icon: "dashboard" },
      detectedType: "Production environment", typeConfidence: 83,
      proposedIntent: "production", offer: ["production", "expert", "selector"],
      caseCode: "CASE-03815", env: "plant", resultIntent: "production",
      interp: {
        application: "Cast-film / lamination line — Line 4 running context",
        materialSystem: "Web path over cooling rollers · seal & cooling stage",
        confidence: 71,
        performance: ["Locate the stage where the defect appears", "Read line state in context", "Keep within safety boundaries"],
        stillNeed: ["A close-up of the defect itself", "Current setpoints (temp / speed)"],
      },
      mapping: [
        ["Web over multiple chill rollers", "Cooling stage = likely defect zone", "inspect cooling profile"],
        ["Seal station upstream", "Seal-then-cool sequence", "check bond window"],
        ["Operator-floor vantage", "In-situ, hands-free support needed", "voice + camera mode"],
      ],
      noviceSuggest: [
        { say: "Something's tearing on the line", attr: "Defect localisation", spec: "failure mode · stage", grade: "diagnose incident" },
        { say: "I need to keep running safely", attr: "Safe operating window", spec: "max process temp (safety)", grade: "locked boundary" },
      ],
    },
  };

  // free-text "in your words" → material attribute the AI queries the library with
  const noviceLexicon = [
    [/cold|winter|freez|chilly|low temp/, "Low-temperature impact (low Tg)", "Tg · ductile-brittle transition"],
    [/crack|break|shatter|brittle|snap/, "Impact toughness", "notched impact strength"],
    [/soft|cushion|comfort|plush|gentle|squish/, "Low modulus / soft-touch", "Shore hardness · flexural modulus"],
    [/bounc|spring|rebound|energy|responsive/, "High energy return / resilience", "rebound resilience"],
    [/light|lightweight|weigh/, "Low density", "density (g/cm³)"],
    [/smell|odou?r|fog|voc|air|fume/, "Low VOC / low fogging", "fogging · VOC emission"],
    [/sun|uv|fade|weather|yellow/, "UV & weathering stability", "UV resistance · weathering"],
    [/hot|heat|melt|warp|sag/, "Heat resistance / service temp", "Vicat · HDT"],
    [/seal|stick|bond|glue|adhe|peel/, "Seal / bond performance", "seal-initiation temp · hot-tack"],
    [/food|safe|contact|drink|edible/, "Food-contact compliance", "EU 10/2011 · FDA"],
    [/stiff|rigid|strong|hold shape|firm/, "High stiffness / modulus", "flexural modulus"],
    [/grip|slip|tract|skid/, "Surface friction", "coefficient of friction"],
    [/water|moist|wet|humid|barrier/, "Moisture barrier", "water-vapour transmission"],
    [/stretch|flex|bend|elong/, "Flexibility / elongation", "elongation at break"],
    [/scratch|scuff|abras|wear|durab/, "Abrasion & scratch resistance", "abrasion resistance"],
    [/cheap|cost|afford|price/, "Cost-efficiency", "price / performance index"],
    [/recycl|sustainab|green|eco|circular/, "Recyclability / sustainability", "recycled content · recyclability"],
  ];
  const translateNeed = (say, example) => {
    const hit = example && example.noviceSuggest && example.noviceSuggest.find(n => n.say.toLowerCase() === say.toLowerCase());
    if (hit) return { attr: hit.attr, spec: hit.spec, grade: hit.grade };
    const s = (say || "").toLowerCase();
    const lex = noviceLexicon.find(([re]) => re.test(s));
    if (lex) return { attr: lex[1], spec: lex[2], grade: null };
    return { attr: "Captured as a need", spec: "factored into the match", grade: null };
  };

  /* ---------------- cross-lens deep links (operator ↔ customer) ---------------- */
  const OPERATOR_FILE = "Dow Supply Chain on KAF.html";
  const toOperator = (screen, trace) => {
    const p = new URLSearchParams({ lens: "ops", screen: screen || "spine" });
    if (trace) p.set("trace", trace);
    window.location.href = OPERATOR_FILE + "?" + p.toString();
  };
  const spineScreenFor = (intent) => ({
    compliance: "flow", specmatch: "flow",
    order: "spine", quote: "spine", po_draft: "spine", po_approval: "governance", po_placed: "spine",
    production: "spine", expert: "queue", conversion: "spine",
    selector: "ontology", formulation: "ontology", experiment: "spine",
  }[intent] || "spine");

  /* ---------------- RegRadar → customer (proactive regulatory intelligence) ---------------- */
  const regAlert = {
    id: "RR-2026-0412", live: true,
    rule: "EU 10/2011 — food-contact plastics", jurisdiction: "European Union",
    change: "Annex I update — revised specific migration limit (SML) for a stabiliser additive class.",
    effective: "01 Sep 2026", published: "31 May 2026", version: "RegRadar KB v2026.06",
    affects: { case: "CASE-01927", product: "AFFINITY™ PL 1881G", what: "Food-contact seal resin for flexible packaging" },
    impact: "No reformulation expected — your grade's additive package is already within the revised limit. One declaration document needs a version refresh.",
    action: "Refresh the EU 10/2011 declaration to v3.1 before 01 Sep; ChemAssist has prepared it for review.",
    severity: "low", spineScreen: "flow",
  };

  return {
    OPERATOR_FILE, toOperator, spineScreenFor, regAlert,
    imageIntents, imageSteps, imageInputs, noviceLexicon, translateNeed,
    channels, actors, documents, docRef, caseHistory, o2c,
    account, customerTypes, typeById, modes, environments, agents, agentById, agentFlow, salesTeam: agents,
    gates, gateState, dealFunnel, deals, dealFor,
    products, productById, docsFor, samplesFor, spine,
    cases, caseByCode, suggestions, starters,
    industries: [
      { id: "footwear", name: "  Footwear & Apparel", icon: "recommend", blurb: "Midsole foams, outsoles, performance textiles.", accent: "#E11B22" },
      { id: "packaging", name: "  Packaging", icon: "document-chart", blurb: "Flexible & rigid packaging, food-contact resins.", accent: "#0F766E" },
      { id: "auto", name: "  Mobility & Automotive", icon: "network", blurb: "Lightweighting, TPO, interior & under-the-hood.", accent: "#1E5BB8" },
      { id: "construction", name: "  Construction", icon: "dashboard", blurb: "Roofing, insulation, sealants & adhesives.", accent: "#B45309" },
      { id: "electronics", name: "  Electronics", icon: "anomaly", blurb: "Thermal, encapsulation & protection materials.", accent: "#6B36A8" },
      { id: "personal", name: "  Home & Personal Care", icon: "group", blurb: "Formulation ingredients & silicones.", accent: "#C2185B" },
    ],
    DOW_RED: "#E11B22",
  };
})();
