/* ============================================================
   Agentic capabilities — the agent roster + the 11 workflows
   that support the new customer experience. Attaches to window.D
   (created in data.js). Each workflow carries an ordered agent
   chain; each step has an action, a tool, and an optional PAC gate
   so RegRadar and the floating pipeline can trace it step-by-step.
   ============================================================ */
(function () {
  const D = (window.D = window.D || {});

  /* ---------- Agent roster (9) — on-brand colors + Shidoka icons ---------- */
  const A = {
    concierge:  { id: "concierge",  name: "Sales Concierge",     short: "Concierge",   icon: "chat-bot",       c: "#29707A", tint: "#E2F0F1", task: "orchestration", owns: "Front-door orchestration — reads intent, opens the case, keeps the customer informed." },
    appspec:    { id: "appspec",    name: "Application Specialist", short: "App Specialist", icon: "lightbulb",  c: "#6B36A8", tint: "#F1E9FB", task: "recommendation", owns: "Matches application requirements to the right grades, with rationale and citations." },
    sample:     { id: "sample",     name: "Sample Coordinator",  short: "Sample Coord.", icon: "document-chart", c: "#0E7490", tint: "#DDF0F4", task: "execution",     owns: "Runs the sample-to-qualification experiment — lot reservation, lab tasks, results." },
    deal:       { id: "deal",       name: "Account & Deal Mgr",  short: "Deal Mgr",     icon: "recommend",      c: "#B45309", tint: "#FBEEDD", task: "analysis",       owns: "Pricing, ATP and account terms — quotes, order changes, re-commits." },
    credit:     { id: "credit",     name: "Credit & Auth",       short: "Credit & Auth", icon: "group",         c: "#2A6FDB", tint: "#E4EDFB", task: "governance",     owns: "Spend authority and least-privilege checks before any order commits." },
    supply:     { id: "supply",     name: "Supply & Fulfilment", short: "Supply",       icon: "network",        c: "#1E4E79", tint: "#E2EAF2", task: "execution",      owns: "Inventory, the supply digital twin, logistics — available-to-promise and delivery." },
    compliance: { id: "compliance", name: "Compliance Officer",  short: "Compliance",   icon: "anomaly",        c: "#15803D", tint: "#E4F4EA", task: "governance",     owns: "Covenants, safety and certification boundaries — the guardrails actions run within." },
    regradar:   { id: "regradar",   name: "RegRadar",            short: "RegRadar",     icon: "warning-alt",    c: "#FF462D", tint: "#FFE6E1", task: "monitoring",     owns: "Watches regulatory change and maps it to the products and accounts it affects." },
    revenue:    { id: "revenue",    name: "Account & Deal Mgr · Revenue", short: "Revenue", icon: "analytics",   c: "#9B1C31", tint: "#F7E1E5", task: "execution",      owns: "Event-driven billing and revenue — invoice to payment, dispute economics." },
  };
  D.agenticAgents = A;
  D.agenticAgentList = ["concierge", "appspec", "sample", "deal", "credit", "supply", "compliance", "regradar", "revenue"].map(id => A[id]);

  /* ---------- PAC outcome vocabulary (mirrors the spine runner) ---------- */
  // pac per step: { rule, q, outcome: allow|flag|route|deny|pass, note }

  /* ---------- The 11 workflows ----------
     chain  : ordered agent ids
     steps  : { agent, action, tool, pac? }  (one per meaningful move)
     systems: MCP / systems touched
     human  : human handoff
     outcome: the customer outcome
     touchless: true when no human is in the loop */
  D.agenticWorkflows = [
    {
      id: "need-to-recommend", n: 1, name: "Need-to-recommend", trigger: "Application brief",
      chain: ["concierge", "appspec"],
      systems: ["Catalog / PIM", "TDS"], gate: "Show-to-customer cleared", human: "— touchless", touchless: true,
      outcome: "Ranked grades + rationale",
      steps: [
        { agent: "concierge", action: "Read the application brief into structured requirements — no forms.", tool: "intent.parse" },
        { agent: "appspec", action: "Match the portfolio to the use case and rank candidate grades with citations.", tool: "catalog.match" },
        { agent: "appspec", action: "Clear the recommendation for customer-facing use.", tool: "policy.evaluate",
          pac: { rule: "PROD-show-to-customer", q: "Is this answer cleared to show the customer?", outcome: "allow", note: "Grounded in approved sources — cleared." } },
      ],
    },
    {
      id: "sample-to-qualification", n: 2, name: "Sample-to-qualification", trigger: "Shortlist accepted",
      chain: ["sample", "appspec"],
      systems: ["Sample workflow", "Lot availability"], gate: "Sample eligibility", human: "Technical Service on escalation", touchless: false,
      outcome: "Tracked sample experiment",
      steps: [
        { agent: "sample", action: "Reserve a qualification lot and open the sample experiment.", tool: "sample.reserve",
          pac: { rule: "SAMPLE-eligibility", q: "Is the requester eligible for this sample lot?", outcome: "allow", note: "Account in good standing — eligible." } },
        { agent: "appspec", action: "Define the lab tasks and acceptance targets for the grade.", tool: "lab.plan" },
        { agent: "sample", action: "Track the experiment to result; escalate novel cases to Technical Service.", tool: "sample.track" },
      ],
    },
    {
      id: "quote-to-order", n: 3, name: "Quote-to-order", trigger: "Proven grade",
      chain: ["concierge", "deal", "credit"],
      systems: ["CRM", "Pricing", "ATP"], gate: "Spend authority · least-privilege", human: "Sales places the PO", touchless: false,
      outcome: "Quote + staged PO",
      steps: [
        { agent: "concierge", action: "Assemble the quote request from the proven grade and account context.", tool: "quote.compose" },
        { agent: "deal", action: "Price against account terms and check available-to-promise.", tool: "pricing.quote" },
        { agent: "credit", action: "Verify spend authority under least-privilege before staging the PO.", tool: "auth.check",
          pac: { rule: "FIN-spend-authority", q: "Is this within the buyer's spend authority?", outcome: "route", note: "Above auto-threshold — routed to Sales to place the PO." } },
      ],
    },
    {
      id: "configure-to-commit", n: 4, name: "Configure-to-commit (ATP)", trigger: "Order placed / changed",
      chain: ["deal", "supply"],
      systems: ["ERP / inventory", "Supply digital twin"], gate: "—", human: "— touchless", touchless: true,
      outcome: "Real-time available-to-promise",
      steps: [
        { agent: "deal", action: "Re-price and re-run ATP against account terms on the order change.", tool: "atp.run" },
        { agent: "supply", action: "Commit the delivery date from the supply digital twin.", tool: "twin.commit" },
      ],
    },
    {
      id: "deliver-to-promise", n: 5, name: "Deliver-to-promise", trigger: "Order in fulfilment",
      chain: ["supply", "concierge"],
      systems: ["ERP", "Logistics / TMS"], gate: "—", human: "— touchless", touchless: true,
      outcome: "Live ETA + proactive notice",
      steps: [
        { agent: "supply", action: "Track the shipment across TMS and predict the live ETA.", tool: "tms.track" },
        { agent: "concierge", action: "Proactively notify the customer of the ETA and any recovery option.", tool: "notify.customer" },
      ],
    },
    {
      id: "allocation-under-constraint", n: 6, name: "Allocation-under-constraint", trigger: "Plant outage / shortage",
      chain: ["supply", "compliance", "concierge"],
      systems: ["ERP", "PAC policy"], gate: "Contract covenant preserved", human: "Planner if covenant-affecting", touchless: false,
      outcome: "Protected allocation, promise held",
      steps: [
        { agent: "supply", action: "Re-allocate stock by ATP and contract priority across the network.", tool: "alloc.rebalance" },
        { agent: "compliance", action: "Check the reallocation preserves the strategic-grade covenant.", tool: "policy.evaluate",
          pac: { rule: "PROD-covenant-brandt", q: "Does the reroute preserve the contracted grade + spec?", outcome: "route", note: "Covenant-affecting — confirmed by the planner who owns the account." } },
        { agent: "concierge", action: "Confirm to the customer that the promise date holds.", tool: "notify.customer" },
      ],
    },
    {
      id: "regulatory-change-to-action", n: 7, name: "Regulatory-change-to-action", trigger: "RegRadar change alert",
      chain: ["regradar", "compliance", "concierge"],
      systems: ["RegRadar KB", "SDS / RDS / REACH"], gate: "Certification boundary", human: "Regulatory issues certification", touchless: false,
      outcome: "Proactive alert + prepared action",
      steps: [
        { agent: "regradar", action: "Detect the regulatory change and map it to affected products and accounts.", tool: "regradar.scan" },
        { agent: "compliance", action: "Classify impact against the certification boundary — informational, not a certification.", tool: "policy.evaluate",
          pac: { rule: "REG-certification-boundary", q: "Can the agent issue a certification?", outcome: "deny", note: "Certification can't originate from an agent — Regulatory issues it." } },
        { agent: "concierge", action: "Surface a proactive alert on the customer's case with the prepared action.", tool: "notify.customer" },
      ],
    },
    {
      id: "incident-to-recovery", n: 8, name: "Incident-to-recovery", trigger: "Production defect (image / voice)",
      chain: ["supply", "compliance", "concierge"],
      systems: ["QMS / CoA", "Inventory", "TMS"], gate: "Safety boundary locked", human: "Technical Service confirms", touchless: false,
      outcome: "Diagnosis + expedite option",
      steps: [
        { agent: "supply", action: "Diagnose the defect from the image/voice report against QMS / CoA.", tool: "qms.diagnose" },
        { agent: "compliance", action: "Lock the safety boundary before proposing any recovery.", tool: "policy.evaluate",
          pac: { rule: "SAFETY-boundary", q: "Is the recovery within the locked safety boundary?", outcome: "flag", note: "Allowed, flagged — Technical Service confirms before action." } },
        { agent: "concierge", action: "Offer the customer an expedite option from available inventory.", tool: "notify.customer" },
      ],
    },
    {
      id: "invoice-to-pay", n: 9, name: "Invoice-to-pay", trigger: "Delivery confirmed",
      chain: ["revenue"],
      systems: ["Finance / billing"], gate: "—", human: "Procurement approves", touchless: false,
      outcome: "Event-driven invoice → payment",
      steps: [
        { agent: "revenue", action: "Raise the event-driven invoice the moment delivery is confirmed.", tool: "billing.invoice" },
        { agent: "revenue", action: "Route to the customer's procurement for approval and payment.", tool: "billing.collect" },
      ],
    },
    {
      id: "dispute-to-resolution", n: 10, name: "Dispute-to-resolution", trigger: "Discrepancy flagged",
      chain: ["concierge", "deal", "compliance"],
      systems: ["Finance", "CRM / case"], gate: "—", human: "Resolution owner assigned", touchless: false,
      outcome: "AI-classified, routed to close",
      steps: [
        { agent: "concierge", action: "Open the dispute case and classify the discrepancy.", tool: "case.classify" },
        { agent: "deal", action: "Reconcile the disputed amount against pricing and ATP records.", tool: "finance.reconcile" },
        { agent: "compliance", action: "Assign a resolution owner and route the case to close.", tool: "case.route" },
      ],
    },
    {
      id: "reorder-to-replenish", n: 11, name: "Reorder / demand-to-replenish", trigger: "Consumption signal",
      chain: ["supply", "concierge", "deal"],
      systems: ["Demand model", "CRM"], gate: "—", human: "Buyer approves", touchless: false,
      outcome: "Prompted reorder in the window",
      steps: [
        { agent: "supply", action: "Read the consumption signal from the demand model digital twin.", tool: "demand.predict" },
        { agent: "concierge", action: "Prompt the customer to reorder inside the replenishment window.", tool: "notify.customer" },
        { agent: "deal", action: "Stage the reorder for buyer approval against account terms.", tool: "order.stage" },
      ],
    },
  ];

  D.agenticWorkflowById = {};
  D.agenticWorkflows.forEach(w => { D.agenticWorkflowById[w.id] = w; });
})();
