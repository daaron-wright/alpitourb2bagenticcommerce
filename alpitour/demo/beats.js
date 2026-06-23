/* ============================================================
   AlpiGPT 2.0 — Guided demo · the 12 story beats
   ------------------------------------------------------------
   The narrative the room should leave with:
   "AlpiGPT is not answering questions. It is orchestrating the
    travel-agent sales workflow from request to proposal — fewer
    calls, fewer tickets, less tool-switching — across AlpiGPT,
    LyteAI and Easybooking, governed by policy-as-code."

   Each beat maps to a stage of the live EasyBook Next agent flow.
   The director reads window.DemoBus.stage (broadcast by the
   storefront app) and lights the matching beat.
   ============================================================ */

/* tiny pub/sub the storefront app broadcasts its stage into */
(function () {
  if (window.DemoBus) return;
  window.DemoBus = {
    s: { stage: "browse", approval: false },
    subs: [],
    set(p) { Object.assign(this.s, p); this.subs.forEach((f) => { try { f(this.s); } catch (e) {} }); },
    on(f) { this.subs.push(f); return () => { this.subs = this.subs.filter((x) => x !== f); }; },
  };
})();

window.DEMO_BEATS = (function () {
  const AG = "AlpiGPT", LY = "LyteAI", EB = "Easybooking";

  return [
    /* 1 */ {
      n: 1, kicker: "The environment",
      title: "This is not a chatbot — it's the new workbench",
      point: "The agent isn't opening an assistant on the side. They work inside one guided travel-sales workspace where AI is embedded in the flow.",
      show: ["Agency storefront — Rossi Travel · Gold Partner", "Two live requests on the desk", "Super TREDI panel embedded in the flow, not bolted on"],
      say: "We start in the agent's operating environment. The goal isn't another tool — it's to collapse request-to-proposal into one guided workspace.",
      cap: [AG, LY, EB], stage: "browse",
      agents: ["Session Orchestrator"], you: "Scan the desk · pick the request worth working",
    },
    /* 2 */ {
      n: 2, kicker: "Capture",
      title: "A messy request becomes structured sales context",
      point: "An unstructured customer request is turned into a working sales object — destination, party, dates, budget, preferred hotel, family signals.",
      show: ["Free-text Bianchi brief arrives from Alpitour.it", "AlpiGPT extracts 6 structured requirement chips", "Detected signals: baby pool · kids' club"],
      say: "Don't watch the chat — watch the transformation. Unstructured request becomes a structured work package the rest of the journey runs on.",
      cap: [AG], stage: "parsing",
      agents: ["Intent Agent", "Requirements Agent"], you: "Sanity-check the structured brief — it's right",
    },
    /* 3 */ {
      n: 3, kicker: "Clarify",
      title: "Only the clarifying questions that matter",
      point: "No long form. The system asks just enough to make the quote actionable — the two things the consumer concierge couldn't know.",
      show: ["Two amber blocking chips: departure airport, date flexibility", "Pre-filled most-likely answers", "Everything else already known — not re-asked"],
      say: "This is where AI reduces incomplete requests and rework. It asks just enough to make the quote actionable — and no more.",
      cap: [AG], stage: "blockers",
      agents: ["Requirements Agent"], you: "Answer the two questions only you can",
    },
    /* 4 */ {
      n: 4, kicker: "Commercial context",
      title: "Agency context is applied automatically",
      point: "This is B2B, not a consumer assistant. Tier, commission, preferred brands and channel rules resolve from the agency relationship — never typed by hand.",
      show: ["Gold Partner · 12% commission applied", "Preferred brands weighted", "EasyBook channel rules"],
      say: "It understands the agency relationship and applies the commercial context before it builds anything.",
      cap: [EB], stage: "blockers",
      agents: ["Commercial Rules Agent"], you: "Trust your terms are applied — nothing to key in",
      policy: {
        pkg: "easybook.agency",
        title: "Agency commercial terms — resolved, not typed",
        plain: "Commission, preferred brands and channel come from the agency's tier. The agent never keys them in.",
        rego:
`package easybook.agency

# Commercial terms resolve from the agency tier — never keyed by hand.
commission_pct = 12 { input.agency.tier == "gold" }

preferred_brands = input.agency.preferred_brands
#  -> ["Francorosso", "Alpitour"]   weighted first in ranking

channel = "EasyBook" { input.agency.channel == "easybook" }`,
      },
    },
    /* 5 */ {
      n: 5, kicker: "Retrieval → orchestration",
      title: "Retrieval becomes useful inside the workflow",
      point: "“Does Jaz Mirabel have a baby pool?” The answer doesn't die in the chat — it becomes a ranking signal. Search becomes orchestration.",
      show: ["Product-master hotel facts: baby pool · kids' club · family rooms", "Signal applied → baby-friendly amenities weighted", "Ranking criteria updated"],
      say: "This is the shift from search to orchestration. The answer changes what the system does next.",
      cap: [AG], stage: "searching",
      agents: ["Knowledge Agent · RAG"], you: "Ask the question · let the answer shape the ranking",
    },
    /* 6 */ {
      n: 6, kicker: "Recovery, not dead end",
      title: "Sold-out inventory becomes a recovery moment",
      point: "The preferred hotel is unavailable — today that's where agents call support. Here the journey doesn't stop; it moves straight into guided recovery.",
      show: ["Jaz Mirabel Beach — sold out, 12–19 Aug (live inventory, not catalogue)", "No support ticket needed", "Recovery branch triggered"],
      say: "The preferred option is gone, but the sale doesn't stall. The failure becomes a guided recovery path.",
      cap: [AG, EB], stage: "ranked",
      agents: ["Inventory Agent", "Recovery Planner"], you: "Choose recovery over a support call",
      policy: {
        pkg: "easybook.recovery",
        title: "Sold-out recovery — what alternatives are allowed",
        plain: "On sold-out, every hard constraint is kept. Only amenity weighting shifts — toward the detected signals.",
        rego:
`package easybook.recovery

# On sold_out, keep every hard constraint; only weighting may change.
candidate {
  input.cand.destination == input.brief.destination
  input.cand.board       == input.brief.board
  input.cand.price        <= input.brief.budget_cap
  input.cand.brand in data.alpitour.world.brands
}

# Re-rank toward the signals AlpiGPT detected at capture.
weight_first := ["baby_pool", "kids_club"]`,
      },
    },
    /* 7 */ {
      n: 7, kicker: "Explainable recommendation",
      title: "Alternatives come with reasons, not just results",
      point: "The top recommendation is explainable — it reflects the customer need, availability, budget and the earlier baby-pool signal. It helps the agent sell.",
      show: ["Coral Bay Family Resort · 94% match · €3,250 (€250 under cap)", "Fit matrix across all constraints", "Sinai stronger but €80 over cap — flagged, not hidden"],
      say: "It doesn't just return inventory. It builds a credible alternative story the agent can take back to the customer.",
      cap: [AG], stage: "ranked",
      agents: ["Recommendation Agent", "Pricing Agent"], you: "Judge the options · decide what to sell",
      policy: {
        pkg: "easybook.ranking",
        title: "Budget cap — a hard constraint, enforced in ranking",
        plain: "€3,500 is a hard cap. Over-cap options aren't dropped — they surface flagged, with the overage stated.",
        rego:
`package easybook.ranking

default allow_offer = false
allow_offer {
  input.offer.destination == input.brief.destination
  input.offer.board       == input.brief.board
  input.offer.price        <= input.brief.budget_cap   # €3,500
}

# Over-cap offers surface flagged — never silently hidden.
flag[msg] {
  input.offer.price > input.brief.budget_cap
  over := input.offer.price - input.brief.budget_cap
  msg  := sprintf("€%d over the €%d cap", [over, input.brief.budget_cap])
}`,
      },
    },
    /* 8 */ {
      n: 8, kicker: "One journey, three capabilities",
      title: "LyteAI and Easybooking are orchestrated, not exposed",
      point: "The agent stays in one flow while the system orchestrates the right capability behind the scenes: AlpiGPT interprets, LyteAI composes the itinerary, Easybooking structures the proposal and booking.",
      show: ["Package assembled: Neos flight · hotel · board · transfer · add-ons", "Itinerary composed (LyteAI)", "Proposal + booking path structured (Easybooking)"],
      say: "Conceptually that's three systems. The agent experiences it as one journey.",
      cap: [AG, LY, EB], stage: "drafting",
      agents: ["Itinerary Agent · LyteAI", "Pricing Agent", "Proposal Agent"], you: "Stay in one flow — no tool-switching",
    },
    /* 9 */ {
      n: 9, kicker: "Commercial artifact",
      title: "The proposal is a commercial artifact, not text",
      point: "Not a paragraph — an agency-ready proposal: client price, add-ons, policy validation, commission, version and next actions.",
      show: ["Proposal V1 · client price + add-ons", "Commission computed at Gold tier", "Policy validated · margin floor respected"],
      say: "This is where the workflow becomes commercially useful. The output is an agency-ready proposal.",
      cap: [LY, EB], stage: "proposal",
      agents: ["Proposal Composer", "Pricing Agent"], you: "Review the artifact before it goes out",
      policy: {
        pkg: "easybook.proposal",
        title: "Proposal validation — margin floor & live facts",
        plain: "A proposal is only valid if margin stays above the floor, every fact is live, and commission matches the agency tier exactly.",
        rego:
`package easybook.proposal

default valid = false
valid {
  input.margin_pct >= data.policy.margin_floor_pct  # never below floor
  input.sources.all_live                            # no stale facts
  input.commission == compute_commission            # tier-exact
}`,
      },
    },
    /* 10 */ {
      n: 10, kicker: "Human-in-the-loop",
      title: "Human approval stays at the right moments",
      point: "The AI prepares the action; the human approves the commercial commitment. That's the autonomy boundary — it prepares and guides, it doesn't autonomously book.",
      show: ["Place hold — gated action", "Confirmation step · hold reference + expiry", "Proposal V1 → held"],
      say: "AlpiGPT can prepare and guide, but the agent stays in control when the action has commercial consequence.",
      cap: [EB], stage: "held",
      agents: ["Booking Agent"], you: "Approve the commitment — the network won't commit alone",
      policy: {
        pkg: "easybook.authority",
        title: "Authority boundary — destructive writes gate",
        plain: "Holds, amendments and bookings are writes — they always require a human approver. Discounts beyond delegated margin escalate.",
        rego:
`package easybook.authority

# Destructive writes always require a human approver.
default gate = true
gate { input.action.kind == "write" }   # hold | amend | book

# Discounts beyond delegated margin escalate for approval.
escalate {
  input.discount_pct > input.agency.delegated_margin_pct
}`,
      },
    },
    /* 11 */ {
      n: 11, kicker: "Self-service change",
      title: "The customer changes their mind — no support call",
      point: "The real world doesn't end at proposal generation. The agent services the proposal after creation — re-checks availability, reprices, compares versions — without a ticket.",
      show: ["“Move the trip one week earlier”", "Availability rechecked · repriced −€100 · V2 drafted", "V1 vs V2 compared · V1 stays revertible"],
      say: "One of the most important moments: the agent keeps the customer moving after the proposal — without calling an operator.",
      cap: [AG, EB], stage: "v2",
      agents: ["Reprice Agent", "Booking Agent"], you: "Approve the change · keep the customer moving",
      policy: {
        pkg: "easybook.change",
        title: "Change & reprice — what's allowed after a proposal",
        plain: "Pre-confirmation changes are allowed and reprice from the live API. Prior versions are immutable and revertible.",
        rego:
`package easybook.change

# Pre-confirmation changes allowed; price refreshes from live API.
allow_change { not input.booking.confirmed }
reprice_from := "pricing_api.live"

# Prior versions are immutable and revertible.
immutable[v] {
  v := input.versions[_]
  v.status != "draft"
}`,
      },
    },
    /* 12 */ {
      n: 12, kicker: "The outcome",
      title: "The business outcome is visible",
      point: "The win isn't that the AI answered a question. It's that the agent moved request → proposal → hold → modification in one guided journey — no support call, no ticket, fully versioned and audited.",
      show: ["Sold-out recovered · proposal generated · hold placed · change self-served", "0 support contacts · quote versioned & traceable", "Next-best-actions ready"],
      say: "Faster time to offer, less manual effort, higher quality and relevance, higher conversion — and a full audit trail.",
      cap: [AG, LY, EB], stage: "completed",
      agents: ["Session Orchestrator"], you: "Own the relationship & the next best action",
    },
  ];
})();
