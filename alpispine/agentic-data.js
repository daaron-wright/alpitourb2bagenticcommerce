/* ============================================================
   Agentic capabilities — the AlpiGPT agent roster + the 11
   workflows that support the B2B concierge experience. Attaches
   to window.D (created in data.js). Each workflow carries an
   ordered agent chain; each step has an action, a tool, and an
   optional PAC gate so TravelRadar and the floating pipeline can
   trace it step-by-step. Agent inventory from the AlpiGPT
   Orchestration Blueprint (eleven specialised agents + TravelRadar).
   ============================================================ */
(function () {
  const D = (window.D = window.D || {});

  /* ---------- Agent roster (12) — on-brand colors + Shidoka icons ---------- */
  const A = {
    intent:     { id: "intent",     name: "Intent Agent",          short: "Intent",      icon: "chat-bot",       c: "#29707A", tint: "#E2F0F1", task: "orchestration", owns: "Front-door intake — parses the request, validates against policy-as-code, opens the KAF work package." },
    requirements:{ id: "requirements", name: "Requirements Agent", short: "Requirements", icon: "lightbulb",     c: "#6B36A8", tint: "#F1E9FB", task: "orchestration", owns: "Guided clarification — turns an ambiguous inquiry into a structured, validated requirements object." },
    context:    { id: "context",    name: "Context Agent",         short: "Context",     icon: "group",          c: "#2A6FDB", tint: "#E4EDFB", task: "analysis",      owns: "Agency tier, client history and persona signals — plus real-time product and destination Q&A." },
    inventory:  { id: "inventory",  name: "Inventory Agent",       short: "Inventory",   icon: "network",        c: "#1E4E79", tint: "#E2EAF2", task: "execution",     owns: "Packages, hotels, Neos flights and allotments — availability, yield status, sold-out detection." },
    recommendation:{ id: "recommendation", name: "Recommendation Agent", short: "Recommend", icon: "recommend",  c: "#B45309", tint: "#FBEEDD", task: "recommendation", owns: "Profile-aware ranking, similarity scoring and alternative matching across the brand portfolio." },
    pricing:    { id: "pricing",    name: "Pricing Agent",         short: "Pricing",     icon: "analytics",      c: "#9B1C31", tint: "#F7E1E5", task: "governance",    owns: "Commission, markup, promotions and dynamic yield — always inside the OPA guardrails." },
    itinerary:  { id: "itinerary",  name: "Itinerary Agent",       short: "Itinerary",   icon: "filter",         c: "#0E7490", tint: "#DDF0F4", task: "execution",     owns: "Multi-segment composition — hotels, flights, transfers and excursions, constraints validated." },
    proposal:   { id: "proposal",   name: "Proposal Agent",        short: "Proposal",    icon: "document-chart", c: "#5B6B7B", tint: "#E8ECEF", task: "execution",     owns: "Agency-branded quote assembly — commission visible, compliance annotations attached." },
    booking:    { id: "booking",    name: "Booking Agent",         short: "Booking",     icon: "checkmark-filled", c: "#15803D", tint: "#E4F4EA", task: "execution",   owns: "Holds, PNRs and confirmations — the handoff into EasyBook and the booking platform APIs." },
    upsell:     { id: "upsell",     name: "Upsell Agent",          short: "Upsell",      icon: "arrow-up-right", c: "#E68A00", tint: "#FCEFD7", task: "recommendation", owns: "Excursions, transfers, insurance, upgrades — contextual next-best-action at search and booking." },
    modification:{ id: "modification", name: "Modification Agent", short: "Modification", icon: "information",   c: "#7C3AED", tint: "#EFE7FD", task: "execution",     owns: "Self-service changes — validates against policy, checks availability, reprices, updates the booking." },
    radar:      { id: "radar",      name: "TravelRadar",           short: "TravelRadar", icon: "warning-alt",    c: "#FF462D", tint: "#FFE6E1", task: "monitoring",    owns: "Watches advisories, entry rules and the Package Travel Directive — maps change to affected bookings." },
  };
  D.agenticAgents = A;
  D.agenticAgentList = ["intent", "requirements", "context", "inventory", "recommendation", "pricing", "itinerary", "proposal", "booking", "upsell", "modification", "radar"].map(id => A[id]);

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
      id: "inquiry-to-requirements", n: 1, name: "Inquiry-to-requirements", trigger: "Natural-language inquiry",
      chain: ["intent", "requirements"],
      systems: ["EasyBook session", "OPA MCP"], gate: "PaC intent validation", human: "— touchless", touchless: true,
      outcome: "Structured requirements object",
      steps: [
        { agent: "intent", action: "Parse the agency's request and validate it against policy-as-code before intent is locked in.", tool: "intent.parse",
          pac: { rule: "PAC-intent-guardrails", q: "Does the request sit inside the behavioural guardrails?", outcome: "allow", note: "Standard package inquiry — cleared, work package opened." } },
        { agent: "requirements", action: "Ask the guided clarifying questions and assemble the requirements object.", tool: "requirements.capture" },
      ],
    },
    {
      id: "context-to-persona", n: 2, name: "Context-to-persona", trigger: "Requirements complete",
      chain: ["context"],
      systems: ["CRM MCP", "Booking history", "RAG catalogues"], gate: "—", human: "— touchless", touchless: true,
      outcome: "Enriched profile + instant answers",
      steps: [
        { agent: "context", action: "Resolve agency tier, commission structure and the client's booking history.", tool: "crm.enrich" },
        { agent: "context", action: "Answer in-conversation product questions in real time — 'does this hotel have a baby pool?'.", tool: "rag.retrieve" },
      ],
    },
    {
      id: "search-to-recommend", n: 3, name: "Search-to-recommend", trigger: "Requirements + context ready",
      chain: ["inventory", "recommendation", "upsell"],
      systems: ["Inventory API", "RAG catalogues"], gate: "Show-to-agency cleared", human: "— touchless", touchless: true,
      outcome: "Ranked shortlist + upsell options",
      steps: [
        { agent: "inventory", action: "Search packages, hotels and Neos flights against the structured requirements.", tool: "inventory.search" },
        { agent: "recommendation", action: "Rank the candidates with persona signals and attach the rationale.", tool: "catalog.rank" },
        { agent: "upsell", action: "Clear the answer and surface contextual upsell candidates.", tool: "policy.evaluate",
          pac: { rule: "PROM-show-to-agency", q: "Is this answer cleared to show the agency?", outcome: "allow", note: "Grounded in approved catalogues — cleared." } },
      ],
    },
    {
      id: "soldout-to-alternative", n: 4, name: "Sold-out-to-alternative", trigger: "Requested property sold out",
      chain: ["inventory", "recommendation"],
      systems: ["Inventory API", "Yield status"], gate: "Brand promise preserved", human: "— touchless", touchless: true,
      outcome: "Alternative proposals — sale saved",
      steps: [
        { agent: "inventory", action: "Detect the sold-out allotment and pull comparable availability.", tool: "inventory.alternatives" },
        { agent: "recommendation", action: "Match alternatives that preserve the must-haves — board, amenities, budget.", tool: "similarity.match",
          pac: { rule: "PROM-brand-promise", q: "Do the alternatives preserve the booked promise level?", outcome: "allow", note: "Same board + family amenities — promise preserved." } },
      ],
    },
    {
      id: "itinerary-composition", n: 5, name: "Itinerary-composition", trigger: "Custom multi-destination request",
      chain: ["itinerary", "inventory"],
      systems: ["Composition rules", "Transfer / excursion catalogues"], gate: "—", human: "Operator on escalation", touchless: false,
      outcome: "Multi-segment itinerary, validated",
      steps: [
        { agent: "itinerary", action: "Compose the multi-segment solution — hotels, flights, transfers, excursions.", tool: "itinerary.compose" },
        { agent: "inventory", action: "Validate every segment against live availability and allotments.", tool: "inventory.validate" },
        { agent: "itinerary", action: "Escalate group / corporate complexity to an internal operator with full context.", tool: "case.escalate" },
      ],
    },
    {
      id: "quote-to-proposal", n: 6, name: "Quote-to-proposal", trigger: "Itinerary accepted",
      chain: ["pricing", "proposal"],
      systems: ["Pricing engine", "OPA MCP", "Brand templates"], gate: "Commission floor · OPA", human: "Agent reviews before the client", touchless: false,
      outcome: "Agency-branded proposal in minutes",
      steps: [
        { agent: "pricing", action: "Apply B2B markup, commission and promotions for the agency tier.", tool: "pricing.quote",
          pac: { rule: "FIN-commission-floor", q: "Is the quote above the commission and margin floors?", outcome: "flag", note: "Within bounds, margin flagged for the yield desk's visibility." } },
        { agent: "proposal", action: "Assemble the branded proposal with commission breakdown and compliance annotations.", tool: "proposal.render" },
      ],
    },
    {
      id: "hold-to-booking", n: 7, name: "Hold-to-booking", trigger: "Client says yes",
      chain: ["booking", "upsell"],
      systems: ["EasyBook APIs", "Notification services"], gate: "Option authority", human: "Agent confirms the booking", touchless: false,
      outcome: "Hold / PNR + upsell attachments",
      steps: [
        { agent: "booking", action: "Place the 72-hour hold against the allotment and stage the PNR.", tool: "booking.hold",
          pac: { rule: "FIN-option-authority", q: "Is the hold within the agency's option authority?", outcome: "route", note: "Above auto-threshold — routed to the travel agent to confirm." } },
        { agent: "upsell", action: "Attach contextual upsells — transfers, excursions, insurance — at point of decision.", tool: "upsell.attach" },
      ],
    },
    {
      id: "disruption-to-reaccommodation", n: 8, name: "Disruption-to-reaccommodation", trigger: "Allotment / rotation disruption",
      chain: ["inventory", "pricing", "booking"],
      systems: ["Booking platform", "PAC policy"], gate: "Agency covenant preserved", human: "Duty planner if covenant-affecting", touchless: false,
      outcome: "Protected booking — dates held",
      steps: [
        { agent: "inventory", action: "Re-point affected bookings to covenant-safe blocks across the network.", tool: "alloc.rebalance" },
        { agent: "pricing", action: "Re-check margin and refund exposure on the re-accommodation.", tool: "yield.recompute",
          pac: { rule: "PROM-covenant-rossi", q: "Does the re-point preserve room class + family amenities?", outcome: "route", note: "Covenant-affecting — confirmed by the planner who owns the desk." } },
        { agent: "booking", action: "Confirm to the agency that the promise dates hold.", tool: "notify.agency" },
      ],
    },
    {
      id: "advisory-to-action", n: 9, name: "Advisory-to-action", trigger: "TravelRadar change alert",
      chain: ["radar", "proposal", "booking"],
      systems: ["TravelRadar KB", "PTD / entry rules"], gate: "Consular boundary", human: "Trade desk issues formal documents", touchless: false,
      outcome: "Proactive alert + prepared action",
      steps: [
        { agent: "radar", action: "Detect the advisory or entry-rule change and map it to affected bookings.", tool: "radar.scan" },
        { agent: "proposal", action: "Classify the impact — informational guidance, never a consular confirmation.", tool: "policy.evaluate",
          pac: { rule: "TRV-consular-boundary", q: "Can the agent issue a formal entry confirmation?", outcome: "deny", note: "Formal documents can't originate from an agent — the trade desk issues them." } },
        { agent: "booking", action: "Surface a proactive alert on every affected booking with the prepared action.", tool: "notify.agency" },
      ],
    },
    {
      id: "modification-self-service", n: 10, name: "Modification self-service", trigger: "Change request after booking",
      chain: ["modification", "pricing", "booking"],
      systems: ["Booking platform APIs", "Fare / contract rules"], gate: "Change within contract rules", human: "Trade desk on exception", touchless: false,
      outcome: "Self-service change — no ticket",
      steps: [
        { agent: "modification", action: "Validate the requested change — dates, flights, hotel, travellers — against policy rules.", tool: "change.validate",
          pac: { rule: "CHG-contract-rules", q: "Is the change inside the fare and contract rules?", outcome: "allow", note: "Date move within the flexible window — allowed." } },
        { agent: "pricing", action: "Recalculate the price difference and commission impact.", tool: "pricing.delta" },
        { agent: "booking", action: "Update the booking records and reissue the confirmation.", tool: "booking.update" },
      ],
    },
    {
      id: "repeat-to-rebook", n: 11, name: "Repeat-to-rebook (NBA)", trigger: "Season / lifecycle signal",
      chain: ["context", "recommendation", "upsell"],
      systems: ["Demand model", "CRM MCP"], gate: "—", human: "Agency approves the outreach", touchless: false,
      outcome: "Prompted rebooking in the window",
      steps: [
        { agent: "context", action: "Read the lifecycle signal — last summer's family is planning again.", tool: "demand.predict" },
        { agent: "recommendation", action: "Compose the rebooking suggestion from history and this season's portfolio.", tool: "catalog.rank" },
        { agent: "upsell", action: "Stage the next-best-action outreach for the agency to approve.", tool: "nba.stage" },
      ],
    },
  ];

  D.agenticWorkflowById = {};
  D.agenticWorkflows.forEach(w => { D.agenticWorkflowById[w.id] = w; });
})();
