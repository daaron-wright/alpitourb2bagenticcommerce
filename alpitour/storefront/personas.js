/* ============================================================
   Synthetic persona cohort — Kyndryl Vital style
   Floating dock → compact Talk popup → full immersive
   Talk / Profile modal. Two synthetic stakeholders you can
   interrogate at any point to validate the AlpiConcierge 2.0 demo.
   Self-contained vanilla JS; chats via window.claude.complete.
   ============================================================ */
(function () {
  if (window.__scpMounted) return;
  window.__scpMounted = true;

  var DEMO = "You are taking part in a live validation of the AlpiConcierge 2.0 demo for Alpitour World. " +
    "AlpiConcierge 2.0 turns AlpiConcierge from a Q&A bot into an agentic system that runs a travel agent's whole sales workflow on one screen. " +
    "Tredi is the intelligent supervisor; it coordinates specialist experts — Esperto Hotel (live availability), Esperto Tour (compiles & prices packages), Esperto Destinazioni (country/culture notes) — over live inventory, pricing and policy. " +
    "Worked example: the Carter family (2 adults + a 2-year-old, from Toronto) want 10 days around Italy in August — Rome, Florence, Amalfi Coast, ~CA$11,000, family rooms + air-con + short transfers. The preferred hotel is sold out, so AlpiConcierge recovers the sale with ranked alternatives, writes a proposal.md (one document rendering to email/SMS/notification/trip-page), places a gated hold, services a date change, and recovers a mid-trip disruption (Amalfi road closed → re-routed via Salerno + private ferry, with a goodwill upgrade). " +
    "It runs on the Kyndryl Agentic Framework (KAF): destructive tools always gate on the human agent, every action has provenance, policy is enforced as code. Capability footer: AlpiConcierge · LyteAI · Easybooking.";

  var PEOPLE = [
    {
      id: "francesco", code: "P-ALP-01", idx: 1,
      name: "Francesco Ciuccarelli", role: "CIO · Alpitour World",
      archetype: "The Platform Steward",
      img: "alpitour/storefront/personas/francesco-ciuccarelli.png",
      tone: "#FF462D", toneSoft: "rgba(255,70,45,.16)",
      moodLine: "MEASURED · COST-AWARE", orbMood: "engaged",
      tags: ["Governance", "Cost"], pron: "he/him · Milano",
      quote: "Speed without a governed operating pattern is just faster risk.",
      greet: "Francesco here. I don't need the pitch — show me where this de-risks the platform and what it costs to run. I'll poke holes.",
      bio: "Francesco owns the platform AlpiConcierge runs on. He judges every initiative by integration risk, reliability, auditability and total cost — and by whether it actually deflects calls and tickets across the Welcome Travel agency network. He wants one governed operating pattern, not ten point integrations.",
      context: [["Reports to", "Group COO"], ["Scope", "Platform · integration · governance"], ["Systems", "EasyBook · LyteAI · Easybooking · Neos · KAF"], ["Owns (R)", "Reliability · security · cost"], ["Loudest in", "Governance · Cost"]],
      goals: [
        ["One governed operating pattern", "Not ten brittle integrations — a reusable substrate the whole network runs on."],
        ["Auditable, reversible actions", "Every agent write gated, logged, and explainable six months later."],
        ["Measurable deflection", "Fewer calls and tickets, shorter quote-cycle time — numbers, not vibes."]
      ],
      frustrations: [
        ["red", "Point integrations as liabilities", "Each new connector is another thing that breaks at month-end."],
        ["amber", "\u201cAI magic\u201d with no provenance", "If it can't show its source or be rolled back, it doesn't ship."],
        ["teal", "Change the network can't absorb", "2,000 agencies can't be retrained on a new tool every quarter."]
      ],
      trust: [["AI may act", "AI suggests only", 38, "automation fine for routine; commercial commits stay human"], ["Trusts defaults", "Demands evidence", 28, "wants the source, the cost line and the rollback path"]],
      moods: [["Engaged", "warm · steady"], ["Cautious", "spruce-led · measured", true], ["Skeptical", "cool · probing"], ["Impatient", "warm flares · time-poor"]],
      sys: ""
    },
    {
      id: "fabio", code: "P-ALP-02", idx: 2,
      name: "Fabio Olgiati", role: "AI Lead · Alpitour World",
      archetype: "The Orchestration Lead",
      img: "alpitour/storefront/personas/fabio-olgiati.png",
      tone: "#29707A", toneSoft: "rgba(41,112,122,.16)",
      moodLine: "CURIOUS · PRECISE", orbMood: "cautious",
      tags: ["AI", "Controls"], pron: "he/him · Torino",
      quote: "A gate that doesn't change behaviour is just a pop-up.",
      greet: "Fabio. Walk me through the orchestration — supervisor, tools, gating. I'll check where the guardrails actually are.",
      bio: "Fabio owns the agent stack — how Tredi supervises Esperto Hotel, Tour and Destinazioni, how tools are gated, how answers stay grounded. He cares about evals, provenance, latency and human-in-the-loop far more than model demos. He wants the agent to earn trust one auditable step at a time.",
      context: [["Reports to", "CIO"], ["Scope", "Agent orchestration · evals"], ["Systems", "Tredi · Esperto agents · KAF"], ["Owns (R)", "Guardrails · grounding · latency"], ["Loudest in", "AI · Controls"]],
      goals: [
        ["Grounded answers, always", "Every claim traceable to live inventory, pricing or a policy doc."],
        ["Destructive tools always gate", "Holds, rebooks and re-prices never fire without the human agent."],
        ["Evals that catch regressions", "Know a release got worse before a customer does."]
      ],
      frustrations: [
        ["red", "Hallucination dressed as confidence", "A fluent wrong answer is worse than no answer."],
        ["amber", "Gates that are theatre", "If the agent rubber-stamps a pop-up, the gate bought nothing."],
        ["teal", "Latency that breaks flow", "If Tredi stalls, the agent reaches for the old tools."]
      ],
      trust: [["AI may act", "AI suggests only", 55, "happy to automate retrieval & drafting; commits stay gated"], ["Trusts defaults", "Demands evidence", 46, "defaults fine when the provenance is one click away"]],
      moods: [["Engaged", "warm · steady", true], ["Probing", "spruce-led · curious"], ["Drifting", "cool · low signal"], ["Agitated", "warm flares · blocked"]],
      sys: ""
    },
    {
      id: "owner", code: "P-ALP-03", idx: 3,
      name: "Agency owner", role: "Independent agency · owner-operator",
      archetype: "The Owner-Operator", init: "AO",
      img: null, tone: "#2C6FA0", toneSoft: "rgba(44,111,160,.16)",
      moodLine: "PRACTICAL · MARGIN-MINDED", orbMood: "cautious",
      tags: ["Value", "People"], pron: "Independent · high street",
      quote: "If it doesn't win me bookings or save me staff hours, it's overhead.",
      greet: "I run an independent agency. Show me how this makes my team faster and keeps the client mine — not Alpitour.it's. Then we'll talk.",
      bio: "Runs a small independent agency on commission and repeat clients. Every tool is judged on whether it wins bookings, trims staff hours, and keeps the customer relationship — and the margin — with the agency rather than the brand's own site.",
      context: [["Reports to", "Themselves"], ["Scope", "Whole agency P&L"], ["Systems", "Easybooking · brand portals"], ["Owns (R)", "Margin · staff · clients"], ["Loudest in", "Value · People"]],
      goals: [["Win and keep bookings", "Faster, sharper quotes that close — and clients who come back to me, not a website."], ["Less time per quote", "Two staff can't spend an afternoon assembling one family trip."], ["Keep the relationship", "The customer stays mine end-to-end, including changes and disruptions."]],
      frustrations: [["red", "Disintermediation by Alpitour.it", "If the brand site does it all, what's my agency for?"], ["amber", "Training overhead", "A new tool every season my staff can't absorb."], ["teal", "Thin, slow margins", "Time spent assembling is margin I never bill."]],
      trust: [["AI may act", "AI suggests only", 48, "automate the assembly; I close the sale"], ["Trusts defaults", "Demands evidence", 40, "show me the price is real and the room is held"]],
      moods: [["Engaged", "warm · steady"], ["Cautious", "spruce-led · measured", true], ["Skeptical", "cool · probing"], ["Impatient", "warm flares · time-poor"]],
      sys: ""
    },
    {
      id: "branch", code: "P-ALP-04", idx: 4,
      name: "Branch agent", role: "High-street branch · counter agent",
      archetype: "The Counter Agent", init: "BA",
      img: null, tone: "#3D8590", toneSoft: "rgba(61,133,144,.16)",
      moodLine: "FAST · WALK-IN READY", orbMood: "engaged",
      tags: ["Speed", "Service"], pron: "High-street branch",
      quote: "I've got a family at my desk in twenty minutes — can it keep up?",
      greet: "I work the counter. Walk-ins, phones, the lot. If this can keep up with a family sitting across from me, I'm interested. If it adds clicks, I'm not.",
      bio: "Works the counter at a high-street branch — walk-ins, phone enquiries, families deciding on the spot. Lives or dies on speed and confidence: a quote assembled while the customer is still in the chair, with no tool-switching and no guesswork on what's available.",
      context: [["Reports to", "Branch manager"], ["Scope", "Counter · walk-ins"], ["Systems", "Easybooking · till"], ["Owns (R)", "The conversation at the desk"], ["Loudest in", "Speed · Service"]],
      goals: [["Quote at the speed of a chat", "Assemble and price while the customer is still talking."], ["One screen, no switching", "Stop hopping between portals mid-conversation."], ["Confidence it's real", "Never quote a room that's gone or a price that moves."]],
      frustrations: [["red", "Tool-switching at the counter", "Every tab change loses the customer's attention."], ["amber", "Stale availability", "Promising something that's actually sold out."], ["teal", "Slow assembly", "The family leaves to 'think about it' and books online."]],
      trust: [["AI may act", "AI suggests only", 60, "let it assemble fast; I confirm before it commits"], ["Trusts defaults", "Demands evidence", 52, "defaults are fine if the live check is right there"]],
      moods: [["Engaged", "warm · steady", true], ["Rushed", "spruce-led · quick"], ["Drifting", "cool · between customers"], ["Agitated", "warm flares · queue building"]],
      sys: ""
    },
    {
      id: "specialist", code: "P-ALP-05", idx: 5,
      name: "Travel specialist", role: "Luxury / tailor-made specialist",
      archetype: "The Tailor-Made Specialist", init: "TS",
      img: null, tone: "#B45309", toneSoft: "rgba(180,83,9,.15)",
      moodLine: "DISCERNING · BESPOKE", orbMood: "engaged",
      tags: ["Craft", "Trust"], pron: "Luxury · tailor-made",
      quote: "My clients pay for judgement, not a package off a shelf.",
      greet: "I build bespoke luxury trips. My clients pay for taste and control. If this flattens everything into a package, it's no use to me — show me where I keep the craft.",
      bio: "Designs high-touch, tailor-made luxury itineraries. Sells judgement and personalization, not catalogue packages, so cares that the tool gives control over every segment, surfaces genuinely premium options, and never makes a discerning client feel mass-produced.",
      context: [["Reports to", "Head of luxury"], ["Scope", "Bespoke itineraries"], ["Systems", "Turisanda · Easybooking"], ["Owns (R)", "Design · client trust"], ["Loudest in", "Craft · Trust"]],
      goals: [["Control every segment", "Hand-pick each stay, transfer and experience — not accept a bundle."], ["Genuinely premium surfacing", "Show the suite and the private transfer, not the entry room."], ["Protect the relationship", "The client trusts me; the tool should make me look sharper, not replaceable."]],
      frustrations: [["red", "Everything flattened to a package", "Bespoke clients notice generic instantly."], ["amber", "Shallow premium inventory", "If it can't reach the good rooms, it can't help me."], ["teal", "Lost personalization", "Automation that strips the touches I'm paid for."]],
      trust: [["AI may act", "AI suggests only", 34, "draft and research, but I curate every choice"], ["Trusts defaults", "Demands evidence", 30, "I want the why behind each recommendation"]],
      moods: [["Engaged", "warm · steady", true], ["Discerning", "spruce-led · exacting"], ["Drifting", "cool · unconvinced"], ["Agitated", "warm flares · generic"]],
      sys: ""
    },
    {
      id: "giuseppe", code: "P-ALP-06", idx: 6,
      name: "Giuseppe Parello", role: "Enterprise Architect · Alpitour World",
      archetype: "The Systems Architect", init: "GP",
      img: "alpitour/storefront/personas/giuseppe-parello.png", tone: "#6B36A8", toneSoft: "rgba(107,54,168,.15)",
      moodLine: "STRUCTURED · LONG-VIEW", orbMood: "cautious",
      tags: ["Architecture", "Integration"], pron: "he/him · Milano",
      quote: "Show me the contracts and the blast radius before you show me the demo.",
      greet: "Giuseppe, enterprise architecture. I care about how this fits the estate — contracts, events, ownership, failure modes. Walk me through the seams, not the screens.",
      bio: "Owns the reference architecture across Alpitour World — how AlpiConcierge, LyteAI, Easybooking, Neos and the agency channels actually interconnect. Judges the design by clean contracts, clear ownership, event flow, observability and graceful failure — and by whether it stays coherent as the estate grows, rather than adding another silo.",
      context: [["Reports to", "CIO"], ["Scope", "Reference architecture · estate"], ["Systems", "KAF · EasyBook · LyteAI · Easybooking · Neos"], ["Owns (R)", "Contracts · integration · standards"], ["Loudest in", "Architecture · Integration"]],
      goals: [["One coherent estate", "AlpiConcierge as a layer on the existing systems — not a parallel stack."], ["Clean, versioned contracts", "Every agent↔system call typed, owned and replayable."], ["Graceful failure & observability", "Know what breaks, where, and how it degrades safely."]],
      frustrations: [["red", "Another silo bolted on", "A clever tool that doesn't honour the estate's contracts."], ["amber", "Hidden coupling", "Integrations that quietly depend on undocumented behaviour."], ["teal", "No observability", "Can't trace a request across the agents and back."]],
      trust: [["AI may act", "AI suggests only", 42, "automate within typed contracts; commits gate"], ["Trusts defaults", "Demands evidence", 26, "show the schema, the event, the failure mode"]],
      moods: [["Engaged", "warm · steady"], ["Cautious", "spruce-led · measured", true], ["Skeptical", "cool · probing"], ["Impatient", "warm flares · time-poor"]],
      sys: ""
    }
  ];
  var ROLE_SYS = {
    francesco: "Be pragmatic, time-poor, strategic and a little skeptical. Care about integration risk, reliability, security, governance/policy-as-code on KAF, total cost, vendor lock-in, change management across the agency network, and measurable ROI. End with one sharp question when it helps. Lightly Italian-inflected professional English.",
    fabio: "Be hands-on and curious. Care about orchestration quality, tool-call gating, grounding/provenance vs hallucination, evals, latency, model routing and human-in-the-loop. Technical but plain; end with one probing follow-up when it helps. Don't oversell.",
    owner: "You are an independent travel-agency owner-operator. Judge everything by bookings won, staff hours saved, margin protected, and whether the customer relationship stays with your agency rather than Alpitour.it. Blunt, commercial, a little wary of being disintermediated. Plain English; end with a practical question when it helps.",
    branch: "You are a high-street branch counter agent. You care about raw speed with a customer in front of you, no tool-switching, and never quoting something that's actually gone. Friendly, fast, practical. Plain English; end with a 'can it keep up?' style question when it helps.",
    specialist: "You are a luxury, tailor-made travel specialist. You sell judgement and personalization, not packages. Care about control over every segment, genuinely premium inventory, and never making a discerning client feel mass-produced. Refined, exacting. Plain English; end with a question about craft or control when it helps.",
    giuseppe: "You are an enterprise architect. Judge the design by how it fits the existing estate — clean versioned contracts, clear ownership, event flow, observability, graceful failure — not by the UI. Wary of new silos and hidden coupling. Structured, precise; end with a question about a seam, contract or failure mode when it helps."
  };
  PEOPLE.forEach(function (p) {
    p.sys = DEMO + " You ARE " + p.name + " (" + p.role + ") \u2014 a synthetic validation persona (\"" + p.archetype + "\") used to stress-test this demo. " +
      "Speak in 2\u20134 sentences, in character, never as an AI. " + (ROLE_SYS[p.id] || ROLE_SYS.owner);
  });
  var BY = {}; PEOPLE.forEach(function (p) { BY[p.id] = p; });
  function initials(n){ var w=n.trim().split(/\s+/); return (w[0][0]+(w[1]?w[1][0]:"")).toUpperCase(); }
  var IMG_CB = "?v=3";
  function av(p, size, cls){
    if (p.img) return '<img class="'+(cls||"")+'" src="'+p.img+IMG_CB+'" alt="">';
    return '<span class="scp-init '+(cls||"")+'" style="width:'+size+'px;height:'+size+'px;font-size:'+Math.round(size*0.4)+'px;background:'+p.toneSoft+';color:'+p.tone+'">'+(p.init||initials(p.name))+'</span>';
  }

  var TRY = {
    francesco: ["Where does this break at scale for you?", "What's the total cost to run, in your view?", "What would you need before approving a pilot?", "How would you keep this auditable six months on?"],
    fabio: ["How would you gate the destructive tools?", "How do you stop it hallucinating availability?", "What would you put in the eval suite?", "Where do you want the human in the loop?"],
    owner: ["Does the sold-out recovery actually save you the booking?", "Does the customer still feel like yours, not the brand's?", "Would the written proposal close faster for you?", "Does this free your staff, or just move the work?"],
    branch: ["Could you run this with a family at the counter?", "Is one screen really enough \u2014 no tab-switching?", "Do you trust the live availability it's showing?", "Is the gated hold quick enough mid-conversation?"],
    specialist: ["Does the ranking respect a bespoke brief?", "Could you hand-pick each segment from this?", "Is the ferry re-route recovery up to your standard?", "Does the proposal read bespoke, not packaged?"],
    giuseppe: ["Does this sit cleanly on the existing estate?", "Are the agent\u2194system contracts clear enough?", "How does it fail, and how does it degrade?", "Is there observability across the agents?"]
  };
  var TRY_DEFAULT = ["Does this read right to you?", "Where does it fall short for you?", "What would you need to trust it?"];
  var TRY_DEFAULT = ["What's the strongest part of this for you?", "Where does it fall short for you?", "What would you need to trust it?"];
  var TRY_DEFAULT = ["What's the strongest part of this?", "Where does it fall short for you?", "What would you need to trust it?"];

  /* ---------------- styles ---------------- */
  var css = ""
    + ".scp-dock{position:fixed;left:16px;bottom:16px;z-index:460;display:flex;flex-direction:column;align-items:center;gap:9px;font-family:var(--font-sans,system-ui,sans-serif)}"
    + ".scp-eyb{font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--fg-muted,#64748B);background:rgba(255,255,255,.86);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);padding:3px 8px;border-radius:999px;border:1px solid var(--border-1,#E2E8F0)}"
    + ".scp-av{position:relative;width:50px;height:50px;border-radius:50%;padding:0;border:2px solid #fff;cursor:pointer;overflow:hidden;box-shadow:0 6px 18px rgba(15,23,42,.22);transition:transform .16s ease,box-shadow .16s ease;background:#fff;display:block}"
    + ".scp-av img{width:100%;height:100%;object-fit:cover;display:block}"
    + ".scp-av::after{content:'';position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 0 2px var(--tone)}"
    + ".scp-av:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 24px rgba(15,23,42,.3)}"
    + ".scp-av .scp-dot{position:absolute;right:-1px;bottom:-1px;width:13px;height:13px;border-radius:50%;background:#1F8A5B;border:2.5px solid #fff}"
    + ".scp-tip{position:absolute;left:60px;top:50%;transform:translateY(-50%);white-space:nowrap;background:#1F2A30;color:#fff;font-size:11px;font-weight:500;padding:5px 9px;border-radius:7px;opacity:0;pointer-events:none;transition:opacity .14s}"
    + ".scp-tip b{font-weight:700}.scp-tip i{font-style:normal;opacity:.7;display:block;font-size:9.5px;letter-spacing:.04em;text-transform:uppercase}"
    + ".scp-av:hover .scp-tip{opacity:1}"

    /* collapsed launcher + expandable cohort box */
    + ".scp-fab-wrap{position:fixed;left:16px;bottom:16px;z-index:460;font-family:var(--font-sans,system-ui,sans-serif);display:flex;flex-direction:column;align-items:flex-start;gap:10px}"
    + ".scp-fab{display:inline-flex;align-items:center;gap:9px;background:#14181B;color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:6px 14px 6px 7px;cursor:pointer;box-shadow:0 8px 22px rgba(15,23,42,.28);font-family:inherit}"
    + ".scp-fab:hover{box-shadow:0 12px 28px rgba(15,23,42,.36)}"
    + ".scp-fab .avs{display:inline-flex}"
    + ".scp-fab .avs img,.scp-fab .avs .scp-init{width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid #14181B;margin-left:-10px}"
    + ".scp-init{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-weight:600;font-family:var(--font-display,system-ui);line-height:1;flex-shrink:0;box-sizing:border-box}"
    + ".scp-fab .avs img:first-child,.scp-fab .avs .scp-init:first-child{margin-left:0}"
    + ".scp-fab .lbl{font-size:12px;font-weight:600;letter-spacing:.02em}"
    + ".scp-fab-wrap.open .scp-fab{display:none}"
    + ".scp-cohort{width:300px;background:#14181B;color:#E8EDEF;border:1px solid rgba(255,255,255,.10);border-radius:16px;box-shadow:0 30px 70px rgba(0,0,0,.45);overflow:hidden;animation:scp-rise .2s cubic-bezier(.4,0,.2,1)}"
    + ".scp-co-h{display:flex;align-items:flex-start;gap:10px;padding:14px 14px 12px;border-bottom:1px solid rgba(255,255,255,.08)}"
    + ".scp-co-t{font-family:var(--font-display,system-ui);font-size:15px;font-weight:500}"
    + ".scp-co-s{font-size:10.5px;color:#8C99A0;margin-top:2px;line-height:1.4}"
    + ".scp-co-x{margin-left:auto;width:26px;height:26px;border-radius:7px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#C7D0D4;cursor:pointer;flex-shrink:0;font-size:12px}"
    + ".scp-co-x:hover{background:rgba(255,255,255,.07)}"
    + ".scp-co-list{padding:8px}"
    + ".scp-co-row{display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:transparent;border:none;border-radius:11px;padding:9px 10px;cursor:pointer;font-family:inherit;color:inherit}"
    + ".scp-co-row:hover{background:rgba(255,255,255,.06)}"
    + ".scp-co-row .ava{position:relative;width:40px;height:40px;border-radius:50%;overflow:hidden;flex-shrink:0;box-shadow:inset 0 0 0 2px var(--tone)}"
    + ".scp-co-row .ava img{width:100%;height:100%;object-fit:cover}"
    + ".scp-co-row .meta{min-width:0;flex:1}"
    + ".scp-co-row .meta b{display:block;font-size:13px;font-weight:600;line-height:1.15}"
    + ".scp-co-row .meta i{display:block;font-style:normal;font-size:11px;color:#8C99A0}"
    + ".scp-co-row .go{font-size:11px;font-weight:600;color:var(--tone);flex-shrink:0}"

    /* compact popup (dark) */
    + ".scp-pop{position:fixed;left:16px;bottom:16px;z-index:461;width:min(384px,calc(100vw - 32px));height:min(560px,calc(100vh - 32px));background:#14181B;color:#E8EDEF;border:1px solid rgba(255,255,255,.10);border-radius:18px;box-shadow:0 36px 80px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;animation:scp-rise .22s cubic-bezier(.4,0,.2,1);font-family:var(--font-sans,system-ui,sans-serif)}"
    + "@keyframes scp-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}"
    + ".scp-pop-h{display:flex;align-items:center;gap:11px;padding:14px 14px 12px;border-bottom:1px solid rgba(255,255,255,.08)}"
    + ".scp-pop-h .ava{position:relative;width:42px;height:42px;border-radius:50%;overflow:hidden;flex-shrink:0;box-shadow:inset 0 0 0 2px var(--tone)}"
    + ".scp-pop-h .ava img{width:100%;height:100%;object-fit:cover}"
    + ".scp-pop-h .nm{font-family:var(--font-display,system-ui);font-size:15.5px;font-weight:500;line-height:1.1}"
    + ".scp-pop-h .rl{font-size:11px;color:#9AA7AD}"
    + ".scp-pop-h .syn{font-size:8.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--tone);margin-top:3px}"
    + ".scp-ico{width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.14);background:transparent;cursor:pointer;color:#C7D0D4;display:flex;align-items:center;justify-content:center;flex-shrink:0}"
    + ".scp-ico:hover{background:rgba(255,255,255,.07)}"
    + ".scp-pop-h .grow{margin-left:auto;display:flex;gap:7px}"

    /* shared chat */
    + ".scp-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin}"
    + ".scp-m{display:flex;gap:8px;max-width:90%}"
    + ".scp-m.p{align-self:flex-start}.scp-m.u{align-self:flex-end;flex-direction:row-reverse}"
    + ".scp-m .ma{width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;align-self:flex-end}"
    + ".scp-who{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px;color:var(--tone)}"
    + ".scp-m.u .scp-who{color:#8DA0A7;text-align:right}"
    + ".scp-bub{font-size:12.5px;line-height:1.55}"
    + ".scp-m.p .scp-bub{color:#DBE3E6}"
    + ".scp-m.u .scp-bub{color:#fff;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.10);padding:8px 11px;border-radius:12px;border-bottom-right-radius:4px}"
    + ".scp-busy{align-self:flex-start;display:inline-flex;gap:4px;padding:4px 2px}"
    + ".scp-busy i{width:6px;height:6px;border-radius:50%;background:var(--tone);animation:scp-b 1.2s ease-in-out infinite}"
    + ".scp-busy i:nth-child(2){animation-delay:.15s}.scp-busy i:nth-child(3){animation-delay:.3s}"
    + "@keyframes scp-b{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-3px);opacity:1}}"
    + ".scp-try{padding:2px 14px 10px;display:flex;flex-wrap:wrap;gap:7px}"
    + ".scp-try .lbl{flex-basis:100%;font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7C8A90;margin-bottom:2px}"
    + ".scp-chip{font-size:11px;color:#CdD6DA;color:#CDD6DA;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:5px 11px;cursor:pointer;font-family:inherit}"
    + ".scp-chip:hover{border-color:var(--tone);color:#fff}"
    + ".scp-foot{padding:11px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:8px;align-items:flex-end}"
    + ".scp-in{flex:1;resize:none;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);border-radius:11px;padding:9px 12px;font-family:inherit;font-size:12.5px;line-height:1.4;max-height:96px;color:#fff}"
    + ".scp-in::placeholder{color:#7C8A90}"
    + ".scp-in:focus{outline:none;border-color:var(--tone);box-shadow:0 0 0 1px var(--tone)}"
    + ".scp-send{flex-shrink:0;height:36px;padding:0 16px;border-radius:9px;border:none;background:var(--tone);color:#fff;cursor:pointer;font-family:inherit;font-size:12.5px;font-weight:600}"
    + ".scp-send:disabled{opacity:.45;cursor:default}"
    + ".scp-note{font-size:9.5px;color:#6E7C82;padding:0 14px 11px}"

    /* full modal */
    + ".scp-scrim{position:fixed;inset:0;z-index:600;background:rgba(8,10,12,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;font-family:var(--font-sans,system-ui,sans-serif);animation:scp-fade .2s}"
    + "@keyframes scp-fade{from{opacity:0}to{opacity:1}}"
    + ".scp-modal{width:min(1280px,100%);height:min(840px,100%);background:#14181B;color:#E8EDEF;border-radius:20px;box-shadow:0 50px 120px rgba(0,0,0,.6);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.08)}"
    + ".scp-bar{display:flex;align-items:center;gap:14px;padding:16px 20px}"
    + ".scp-bar .bn{font-family:var(--font-display,system-ui);font-size:21px;font-weight:600}"
    + ".scp-back{border:1px solid rgba(255,255,255,.16);background:transparent;color:#D4DCDF;font-family:inherit;font-size:12.5px;font-weight:600;padding:7px 12px;border-radius:9px;cursor:pointer;flex-shrink:0}"
    + ".scp-back:hover{background:rgba(255,255,255,.07)}"
    + ".scp-bar .br{font-size:12.5px;color:#9AA7AD}"
    + ".scp-bar .meta{font-size:11px;color:#6E7C82;letter-spacing:.02em}"
    + ".scp-seg{margin-left:auto;display:flex;background:rgba(255,255,255,.07);border-radius:999px;padding:3px}"
    + ".scp-seg button{border:none;background:transparent;color:#AEB9BE;font-family:inherit;font-size:12.5px;font-weight:600;padding:6px 16px;border-radius:999px;cursor:pointer}"
    + ".scp-seg button.on{background:#fff;color:#14181B}"
    + ".scp-nav{display:flex;gap:8px}"
    + ".scp-nav button{border:1px solid rgba(255,255,255,.16);background:transparent;color:#D4DCDF;font-family:inherit;font-size:12.5px;font-weight:600;padding:7px 13px;border-radius:9px;cursor:pointer}"
    + ".scp-nav button:hover{background:rgba(255,255,255,.07)}"
    + ".scp-close{border:none;background:var(--tone);color:#fff;font-family:inherit;font-size:12.5px;font-weight:600;padding:8px 15px;border-radius:9px;cursor:pointer}"
    + ".scp-body{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 20px 20px;min-height:0}"

    /* embodiment (talk left) */
    + ".scp-emb{position:relative;background:#fff;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;color:#1F2A30}"
    + ".scp-emb .ehead{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748B}"
    + ".scp-emb .ehead .dot{display:inline-flex;align-items:center;gap:7px}"
    + ".scp-emb .ehead .dot b{width:7px;height:7px;border-radius:50%;background:var(--tone)}"
    + ".scp-field{position:relative;flex:1;display:grid;place-items:center;overflow:hidden;background:linear-gradient(135deg,#F2F0EB 0%,#F6F8F9 48%,#FBFAF6 100%)}"
    + ".scp-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}"
    + ".scp-field .layer{position:absolute;inset:-15%;background-image:radial-gradient(circle,#94A3B8 1.1px,transparent 1.7px);background-size:15px 15px;opacity:.5;-webkit-mask:radial-gradient(circle at 50% 50%,#000 18%,transparent 62%);mask:radial-gradient(circle at 50% 50%,#000 18%,transparent 62%);animation:scp-drift 7s linear infinite}"
    + ".scp-field .layer.t{background-image:radial-gradient(circle,var(--tone) 1.3px,transparent 1.8px);opacity:.4;-webkit-mask:radial-gradient(circle at var(--bx,38%) var(--by,42%),#000 0,transparent 30%);mask:radial-gradient(circle at var(--bx,38%) var(--by,42%),#000 0,transparent 30%);mix-blend-mode:multiply;animation:scp-drift 7s linear infinite,scp-blob 9s ease-in-out infinite}"
    + ".scp-field .layer.s{background-image:radial-gradient(circle,#29707A 1.3px,transparent 1.8px);opacity:.32;-webkit-mask:radial-gradient(circle at var(--sx,66%) var(--sy,62%),#000 0,transparent 26%);mask:radial-gradient(circle at var(--sx,66%) var(--sy,62%),#000 0,transparent 26%);mix-blend-mode:multiply;animation:scp-drift 7s linear infinite -3s,scp-blob2 11s ease-in-out infinite}"
    + "@keyframes scp-drift{to{background-position:15px 15px}}"
    + "@property --bx{syntax:'<percentage>';inherits:false;initial-value:38%}@property --by{syntax:'<percentage>';inherits:false;initial-value:42%}"
    + "@property --sx{syntax:'<percentage>';inherits:false;initial-value:66%}@property --sy{syntax:'<percentage>';inherits:false;initial-value:62%}"
    + "@keyframes scp-blob{0%{--bx:38%;--by:42%}33%{--bx:60%;--by:30%}66%{--bx:30%;--by:60%}100%{--bx:38%;--by:42%}}"
    + "@keyframes scp-blob2{0%{--sx:66%;--sy:62%}40%{--sx:38%;--sy:72%}70%{--sx:72%;--sy:40%}100%{--sx:66%;--sy:62%}}"
    + ".scp-orbwrap{position:relative;display:grid;place-items:center;z-index:2;pointer-events:none}"
    + ".scp-orbwrap .rr{position:absolute;width:190px;height:190px;border-radius:50%;border:1.5px solid var(--tone);opacity:0;animation:scp-ring 3.2s ease-out infinite}"
    + ".scp-orbwrap .rr.r2{animation-delay:1.05s}.scp-orbwrap .rr.r3{animation-delay:2.1s}"
    + ".scp-orbwrap.live .rr{animation-duration:1.5s}"
    + ".scp-orbwrap.live .scp-orb{animation:scp-pulse 1.5s ease-in-out infinite}"
    + "@keyframes scp-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.7);opacity:0}}"
    + "@keyframes scp-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}"
    + ".scp-orb{position:relative;width:150px;height:150px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px var(--tone),0 0 0 8px rgba(0,0,0,.45),0 0 56px var(--toneSoft);z-index:2}"
    + ".scp-orb img{width:100%;height:100%;object-fit:cover}"
    + ".scp-emb .efoot{padding:14px 16px 16px;border-top:1px solid #EEF2F4}"
    + ".scp-speak{display:flex;align-items:center;gap:11px}"
    + ".scp-pause{width:38px;height:38px;border-radius:50%;border:2px solid var(--tone);background:var(--toneSoft);color:var(--tone);display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer}"
    + ".scp-speak .st{font-size:14px;font-weight:600;color:#1F2A30}"
    + ".scp-speak .sm{font-size:10.5px;color:#64748B;letter-spacing:.04em}"
    + ".scp-moods{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:13px}"
    + ".scp-mood{border:1px solid #E2E8F0;border-radius:10px;padding:7px 9px}"
    + ".scp-mood.on{border-color:var(--tone);box-shadow:inset 0 0 0 1px var(--tone)}"
    + ".scp-mood b{display:block;font-size:11.5px;font-weight:600;color:#1F2A30}"
    + ".scp-mood span{font-size:9px;color:#64748B}"
    + ".scp-pull{padding:13px 16px;border-top:1px solid #EEF2F4;font-size:13px;font-style:italic;color:#334155}"
    + ".scp-pull small{display:block;font-style:normal;font-size:10px;color:#94A3B8;margin-top:5px}"

    /* talk right */
    + ".scp-talk{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;display:flex;flex-direction:column;min-height:0}"
    + ".scp-talk .scp-msgs{padding:18px 18px 8px}"
    + ".scp-talk .scp-m{max-width:92%}"
    + ".scp-talk .scp-foot,.scp-talk .scp-try,.scp-talk .scp-note{border-color:rgba(255,255,255,.07)}"

    /* profile (light) */
    + ".scp-prof{flex:1;overflow-y:auto;background:#F4F7F8;color:#1F2A30;border-radius:0 0 20px 20px;padding:22px 26px 26px}"
    + ".scp-prof .peyb{display:flex;align-items:center;gap:12px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5B7177}"
    + ".scp-prof .peyb .pill{background:var(--toneSoft);color:var(--tone);padding:4px 10px;border-radius:6px}"
    + ".scp-prof h2{font-family:var(--font-display,system-ui);font-size:30px;font-weight:600;margin:10px 0 18px}"
    + ".scp-pcard{display:grid;grid-template-columns:230px 1fr 240px;gap:0;background:#fff;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden}"
    + ".scp-pcard .pl{padding:20px;border-right:1px solid #EEF2F4}"
    + ".scp-pcard .pl .pimg{width:96px;height:96px;border-radius:16px;object-fit:cover;box-shadow:inset 0 0 0 2px var(--tone)}"
    + ".scp-pcard .pl h3{font-family:var(--font-display,system-ui);font-size:21px;font-weight:600;margin:14px 0 2px}"
    + ".scp-pcard .pl .pr{font-size:12px;color:#64748B}"
    + ".scp-pcard .pl .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}"
    + ".scp-pcard .pl .chips span{font-size:11px;color:#334155;border:1px solid #E2E8F0;border-radius:999px;padding:3px 9px}"
    + ".scp-pcard .pl .code{font-size:10px;color:#94A3B8;letter-spacing:.04em;margin-top:12px}"
    + ".scp-pcard .pm{padding:24px}"
    + ".scp-pcard .pm .q{font-family:var(--font-display,system-ui);font-size:24px;font-weight:500;line-height:1.3}"
    + ".scp-pcard .pm .q .mk{color:var(--tone);font-size:30px;vertical-align:-6px;margin-right:4px}"
    + ".scp-pcard .pm .bio{font-size:13.5px;color:#475569;line-height:1.6;margin-top:18px}"
    + ".scp-pcard .pm .bio b{color:#1F2A30}"
    + ".scp-pcard .pr-ctx{background:#F8FAFB;padding:20px;border-left:1px solid #EEF2F4}"
    + ".scp-pcard .pr-ctx .ch{font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94A3B8;margin-bottom:12px}"
    + ".scp-pcard .pr-ctx .row{display:grid;grid-template-columns:84px 1fr;gap:10px;font-size:12px;padding:7px 0;border-bottom:1px solid #EEF2F4}"
    + ".scp-pcard .pr-ctx .row:last-child{border-bottom:none}"
    + ".scp-pcard .pr-ctx .row .k{color:#94A3B8}.scp-pcard .pr-ctx .row .v{color:#1F2A30;font-weight:500;text-align:right}"
    + ".scp-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px}"
    + ".scp-colc{background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:20px}"
    + ".scp-colc .ck{font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94A3B8}"
    + ".scp-colc h4{font-family:var(--font-display,system-ui);font-size:18px;font-weight:600;margin:3px 0 16px}"
    + ".scp-goal{display:grid;grid-template-columns:30px 1fr;gap:8px;padding:11px 0;border-top:1px solid #F1F5F9}"
    + ".scp-goal:first-of-type{border-top:none}"
    + ".scp-goal .n{font-family:var(--font-display,system-ui);font-size:16px;font-weight:600;color:var(--tone)}"
    + ".scp-goal .gt{font-size:13.5px;font-weight:600}.scp-goal .gd{font-size:12px;color:#64748B;margin-top:2px;line-height:1.5}"
    + ".scp-fr{padding:11px 0 11px 13px;border-left:3px solid #CBD5E1;margin-bottom:6px}"
    + ".scp-fr.red{border-color:#D7373F}.scp-fr.amber{border-color:#E6A100}.scp-fr.teal{border-color:#29707A}"
    + ".scp-fr .ft{font-size:13.5px;font-weight:600}.scp-fr .fd{font-size:12px;color:#64748B;margin-top:2px;line-height:1.5}"
    + ".scp-tr{margin-bottom:18px}"
    + ".scp-tr .trl{display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:7px}"
    + ".scp-trk{height:6px;border-radius:999px;background:linear-gradient(90deg,var(--toneSoft),#E2E8F0);position:relative}"
    + ".scp-trk .kb{position:absolute;top:50%;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:#fff;border:2px solid var(--tone)}"
    + ".scp-tr .tn{font-size:11.5px;font-style:italic;color:#64748B;margin-top:8px}"
    + ".scp-prof .pfoot{font-size:11px;color:#94A3B8;margin-top:18px}"
    + "@media(prefers-reduced-motion:reduce){.scp-field .layer{animation-duration:24s,40s}}"
    + "@media(max-width:920px){.scp-body{grid-template-columns:1fr}.scp-pcard,.scp-cols{grid-template-columns:1fr}}";

  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var SEND_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>';
  var EXP_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/></svg>';

  var hist;
  try { hist = JSON.parse(localStorage.getItem("scp_hist_v2")) || null; } catch (e) { hist = null; }
  if (!hist || typeof hist !== "object") hist = {};
  PEOPLE.forEach(function (p) { if (!Array.isArray(hist[p.id])) hist[p.id] = []; });
  function saveHist() { try { localStorage.setItem("scp_hist_v2", JSON.stringify(hist)); } catch (e) {} }
  try { localStorage.removeItem("scp_hist_v1"); } catch (e) {}
  var pop = null, modal = null;

  function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ---- collapsed, expandable cohort box ---- */
  if (!window.__scpNoDock) {
  var coOpen = false;
  var fab = document.createElement("div"); fab.className = "scp-fab-wrap";
  var stack = PEOPLE.slice(0, 3).map(function (p) { return av(p, 30); }).join("");
  fab.innerHTML =
    '<div class="scp-cohort" hidden>'
    + '<div class="scp-co-h"><div><div class="scp-co-t">Synthetic Persona Cohort</div><div class="scp-co-s">Validate the demo · AI stand-ins, not real people</div></div>'
    + '<button class="scp-co-x" aria-label="Collapse">✕</button></div>'
    + '<div class="scp-co-list">' + PEOPLE.map(function (p) {
        return '<button class="scp-co-row" data-id="' + p.id + '" style="--tone:' + p.tone + '">'
          + '<span class="ava">' + av(p, 40) + '</span>'
          + '<span class="meta"><b>' + p.name + '</b><i>' + p.role + '</i></span>'
          + '<span class="go">Talk →</span></button>';
      }).join("") + '</div></div>'
    + '<button class="scp-fab" aria-label="Synthetic persona cohort"><span class="avs">' + stack + '</span><span class="lbl">Synthetic Persona Cohort</span></button>';
  document.body.appendChild(fab);

  var cohort = fab.querySelector(".scp-cohort");
  function setCohort(open) { coOpen = open; cohort.hidden = !open; fab.classList.toggle("open", open); }
  window.__scpReopenCohort = function () { setCohort(true); };
  fab.querySelector(".scp-fab").addEventListener("click", function () { setCohort(!coOpen); });
  fab.querySelector(".scp-co-x").addEventListener("click", function () { setCohort(false); });
  fab.querySelectorAll(".scp-co-row").forEach(function (r) {
    r.addEventListener("click", function () { setCohort(false); openPop(r.getAttribute("data-id")); });
  });
  }

  /* ---- shared chat wiring ---- */
  function wireChat(root, p, onAfter) {
    var msgs = root.querySelector(".scp-msgs");
    var input = root.querySelector(".scp-in");
    var send = root.querySelector(".scp-send");
    var tryWrap = root.querySelector(".scp-try");

    function bubble(kind, text) {
      var row = document.createElement("div"); row.className = "scp-m " + kind;
      var who = kind === "p" ? p.name.split(" ")[0].toUpperCase() : "YOU";
      row.innerHTML = (kind === "p" ? av(p, 24, "ma") : "")
        + '<div><div class="scp-who">' + who + '</div><div class="scp-bub">' + esc(text) + "</div></div>";
      msgs.appendChild(row); msgs.scrollTop = msgs.scrollHeight;
    }
    function paint() {
      msgs.innerHTML = "";
      if (hist[p.id].length === 0) bubble("p", p.greet);
      else hist[p.id].forEach(function (m) { bubble(m.role === "assistant" ? "p" : "u", m.content); });
    }
    paint();

    var busy = false;
    async function ask(q) {
      q = (q != null ? q : input.value).trim(); if (!q || busy) return;
      if (tryWrap) tryWrap.style.display = "none";
      hist[p.id].push({ role: "user", content: q }); saveHist(); bubble("u", q);
      input.value = ""; input.style.height = "auto";
      busy = true; send.disabled = true;
      if (onAfter) onAfter("thinking");
      var bz = document.createElement("div"); bz.className = "scp-busy"; bz.innerHTML = "<i></i><i></i><i></i>";
      msgs.appendChild(bz); msgs.scrollTop = msgs.scrollHeight;
      try {
        var arr = [{ role: "user", content: p.sys + "\n\nStay fully in character as " + p.name + " for the rest of this conversation." }, { role: "assistant", content: p.greet }].concat(hist[p.id]);
        var reply = ((await window.claude.complete({ messages: arr })) || "").trim() || "\u2026";
        bz.remove(); hist[p.id].push({ role: "assistant", content: reply }); saveHist(); bubble("p", reply);
      } catch (e) { bz.remove(); bubble("p", "(Couldn't reach me just now — try again in a moment.)"); }
      busy = false; send.disabled = false; input.focus();
      if (onAfter) onAfter("idle");
    }
    if (input) {
      input.addEventListener("input", function () { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 96) + "px"; });
      input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } });
    }
    send.addEventListener("click", function () { ask(); });
    root.querySelectorAll(".scp-chip").forEach(function (c) { c.addEventListener("click", function () { ask(c.textContent); }); });
    return { ask: ask };
  }

  function tryChipsHTML(id) {
    return '<div class="scp-try"><span class="lbl">Try asking</span>' + TRY[id].map(function (t) { return '<button class="scp-chip">' + t + "</button>"; }).join("") + "</div>";
  }

  /* ---- compact popup ---- */
  function openPop(id) {
    if (pop) pop.remove();
    var p = BY[id];
    pop = document.createElement("div"); pop.className = "scp-pop"; pop.style.setProperty("--tone", p.tone); pop.style.setProperty("--toneSoft", p.toneSoft);
    pop.innerHTML =
      '<div class="scp-pop-h"><span class="ava">' + av(p, 42) + '</span>'
      + '<div><div class="nm">' + p.name + '</div><div class="rl">' + p.role + '</div><div class="syn">Synthetic — not a real person</div></div>'
      + '<div class="grow"><button class="scp-ico scp-popback" title="Back to cohort" aria-label="Back to cohort">‹</button><button class="scp-ico scp-expand" title="Expand" aria-label="Expand">' + EXP_SVG + '</button>'
      + '<button class="scp-ico scp-closepop" title="Close" aria-label="Close">\u2715</button></div></div>'
      + '<div class="scp-msgs"></div>' + tryChipsHTML(id)
      + '<div class="scp-foot"><textarea class="scp-in" rows="1" placeholder="Ask ' + p.name.split(" ")[0] + ' anything\u2026"></textarea><button class="scp-send">Ask</button></div>'
      + '<div class="scp-note">Answers are a synthetic stand-in for validation — not a real person.</div>';
    document.body.appendChild(pop);
    wireChat(pop, p);
    pop.querySelector(".scp-closepop").addEventListener("click", function () { pop.remove(); pop = null; });
    pop.querySelector(".scp-popback").addEventListener("click", function () { pop.remove(); pop = null; if (window.__scpReopenCohort) window.__scpReopenCohort(); });
    pop.querySelector(".scp-expand").addEventListener("click", function () { pop.remove(); pop = null; openModal(id, "talk"); });
    setTimeout(function () { var i = pop && pop.querySelector(".scp-in"); if (i) i.focus(); }, 60);
  }

  /* ---- full modal ---- */
  function openModal(id, view) {
    if (modal) modal.remove();
    var p = BY[id]; view = view || "talk";
    modal = document.createElement("div"); modal.className = "scp-scrim";
    modal.style.setProperty("--tone", p.tone); modal.style.setProperty("--toneSoft", p.toneSoft);
    modal.innerHTML = '<div class="scp-modal"></div>';
    var shell = modal.querySelector(".scp-modal");

    function bar() {
      return '<div class="scp-bar"><button class="scp-back" aria-label="Back to cohort">‹ Cohort</button><span class="bn">' + p.name + '</span><span class="br">' + p.role + '</span>'
        + '<span class="meta">' + p.code + ' \u00b7 synthetic \u00b7 ' + p.idx + '/' + PEOPLE.length + '</span>'
        + '<div class="scp-seg"><button data-v="profile"' + (view === "profile" ? ' class="on"' : "") + '>Profile</button><button data-v="talk"' + (view === "talk" ? ' class="on"' : "") + '>Talk</button></div>'
        + '<div class="scp-nav"><button class="scp-prev">\u2190 Prev</button><button class="scp-next">Next \u2192</button></div>'
        + '<button class="scp-close">Close \u2715</button></div>';
    }

    function talkHTML() {
      return '<div class="scp-body">'
        + '<div class="scp-emb">'
        + '<div class="ehead"><span class="dot"><b></b>' + p.name.toUpperCase() + ' \u00b7 SYNTHETIC EMBODIMENT</span><span>MOOD \u00b7 ' + p.moodLine + '</span></div>'
        + '<div class="scp-field"><canvas class="scp-canvas"></canvas><div class="scp-orbwrap"><div class="scp-orb">' + av(p, 150) + '</div></div></div>'
        + '<div class="efoot"><div class="scp-speak"><button class="scp-pause" aria-label="state"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg></button>'
        + '<div><div class="st">Listening</div><div class="sm">grounded in the brief \u00b7 ' + p.tags.join(" \u00b7 ") + '</div></div></div>'
        + '<div class="scp-moods">' + p.moods.map(function (m) { return '<div class="scp-mood' + (m[2] ? " on" : "") + '"><b>' + m[0] + '</b><span>' + m[1] + "</span></div>"; }).join("") + "</div></div>"
        + '<div class="scp-pull">\u201c' + p.quote + '\u201d<small>Built from the validation brief \u00b7 synthetic, not a real person.</small></div>'
        + "</div>"
        + '<div class="scp-talk"><div class="scp-msgs"></div>' + tryChipsHTML(p.id)
        + '<div class="scp-foot"><textarea class="scp-in" rows="1" placeholder="Ask ' + p.name.split(" ")[0] + ' anything\u2026"></textarea><button class="scp-send">Ask</button></div>'
        + '<div class="scp-note">Answers are a synthetic stand-in grounded in the validation brief.</div></div>'
        + "</div>";
    }

    function profileHTML() {
      return '<div class="scp-prof">'
        + '<div class="peyb"><span class="pill">People</span> Synthetic persona ' + (p.idx < 10 ? "0" : "") + p.idx + ' / ' + PEOPLE.length + ' \u00b7 Composite, not a real person</div>'
        + '<h2>' + p.name + ' \u2014 ' + p.role.split(" \u00b7 ")[0] + '</h2>'
        + '<div class="scp-pcard">'
        + '<div class="pl">' + av(p, 96, "pimg") + '<h3>' + p.name + '</h3><div class="pr">' + p.pron + '</div>'
        + '<div class="chips">' + p.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("") + '<span>' + p.archetype + '</span></div>'
        + '<div class="code">' + p.code + ' \u00b7 v0.1 \u00b7 synthetic</div></div>'
        + '<div class="pm"><div class="q"><span class="mk">\u201c</span>' + p.quote + '</div><div class="bio">' + p.bio + '</div></div>'
        + '<div class="pr-ctx"><div class="ch">Context</div>' + p.context.map(function (r) { return '<div class="row"><span class="k">' + r[0] + '</span><span class="v">' + r[1] + "</span></div>"; }).join("") + "</div>"
        + "</div>"
        + '<div class="scp-cols">'
        + '<div class="scp-colc"><div class="ck">Goals · ranked</div><h4>What ' + p.name.split(" ")[0] + ' wants</h4>'
        + p.goals.map(function (g, i) { return '<div class="scp-goal"><span class="n">0' + (i + 1) + '</span><div><div class="gt">' + g[0] + '</div><div class="gd">' + g[1] + "</div></div></div>"; }).join("") + "</div>"
        + '<div class="scp-colc"><div class="ck">Frustrations</div><h4>What gets in the way</h4>'
        + p.frustrations.map(function (f) { return '<div class="scp-fr ' + f[0] + '"><div class="ft">' + f[1] + '</div><div class="fd">' + f[2] + "</div></div>"; }).join("") + "</div>"
        + '<div class="scp-colc"><div class="ck">AI trust threshold</div><h4>Working with the agent</h4>'
        + p.trust.map(function (t) { return '<div class="scp-tr"><div class="trl"><span>' + t[0] + '</span><span>' + t[1] + '</span></div><div class="scp-trk"><span class="kb" style="left:' + t[2] + '%"></span></div><div class="tn">' + t[3] + "</div></div>"; }).join("") + "</div>"
        + "</div>"
        + '<div class="pfoot">Characteristic composite for demo validation \u2014 Alpitour World \u00b7 Kyndryl Agentic Framework. Not a record of a real person.</div>'
        + "</div>";
    }

    function render() {
      if (modal.__raf) { cancelAnimationFrame(modal.__raf); modal.__raf = null; }
      shell.innerHTML = bar() + (view === "talk" ? talkHTML() : profileHTML());
      shell.querySelectorAll(".scp-seg button").forEach(function (b) { b.addEventListener("click", function () { view = b.getAttribute("data-v"); render(); }); });
      shell.querySelector(".scp-close").addEventListener("click", close);
      shell.querySelector(".scp-back").addEventListener("click", function () { close(); if (window.__scpReopenCohort) window.__scpReopenCohort(); });
      shell.querySelector(".scp-prev").addEventListener("click", function () { id = PEOPLE[(p.idx - 2 + PEOPLE.length) % PEOPLE.length].id; p = BY[id]; modal.style.setProperty("--tone", p.tone); modal.style.setProperty("--toneSoft", p.toneSoft); render(); });
      shell.querySelector(".scp-next").addEventListener("click", function () { id = PEOPLE[p.idx % PEOPLE.length].id; p = BY[id]; modal.style.setProperty("--tone", p.tone); modal.style.setProperty("--toneSoft", p.toneSoft); render(); });
      if (view === "talk") {
        var statusEl = shell.querySelector(".scp-speak .st");
        var subEl = shell.querySelector(".scp-speak .sm");
        var orbwrap = shell.querySelector(".scp-orbwrap");
        var idleSub = subEl ? subEl.textContent : "";
        var artTimer = null;
        function setLive(live) {
          if (orbwrap) orbwrap.classList.toggle("live", live);
          if (statusEl) statusEl.textContent = live ? "Speaking \u00b7 live" : "Listening";
          if (artTimer) { clearInterval(artTimer); artTimer = null; }
          if (live && subEl) {
            artTimer = setInterval(function () {
              subEl.textContent = (28 + Math.round(Math.random() * 46)) + "% articulation \u00b7 " + (380 + Math.round(Math.random() * 150)) + " Hz";
            }, 240);
          } else if (subEl) { subEl.textContent = idleSub; }
        }
        wireChat(shell, p, function (mode) { setLive(mode === "thinking"); });
        startField(shell.querySelector(".scp-canvas"), p, function () { return orbwrap && orbwrap.classList.contains("live"); });
        setTimeout(function () { var i = shell.querySelector(".scp-in"); if (i) i.focus(); }, 60);
      }
    }
    function close() { if (modal.__raf) cancelAnimationFrame(modal.__raf); modal.remove(); modal = null; }
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function esc2(e) { if (e.key === "Escape" && modal) { close(); document.removeEventListener("keydown", esc2); } });
    render();
    document.body.appendChild(modal);
  }

  window.__scpOpen = openModal;
  window.__scpPeople = PEOPLE;
  window.__scpPop = openPop;

  /* ---- canvas particle embodiment — 3D orb (port of Kyndryl Vital PersonaOrb) ---- */
  var ORB_PAL = {
    engaged: { hues: ["#E94B4B", "#FF8766", "#FFB46A", "#E68A00", "#46B7C7", "#3E8AC2", "#5C6A73", "#29707A"], core: "rgba(255,255,255,0.92)", halo: "rgba(255,200,160,0.32)" },
    cautious: { hues: ["#2C6FA0", "#3E8AC2", "#29707A", "#5BA2AE", "#5C6A73", "#3D8590", "#FF6647"], core: "rgba(255,255,255,0.94)", halo: "rgba(91,162,174,0.28)" }
  };
  var GA = Math.PI * (3 - Math.sqrt(5));
  function hexRgba(hex, a) { var h = hex.replace("#", ""); return "rgba(" + parseInt(h.slice(0, 2), 16) + "," + parseInt(h.slice(2, 4), 16) + "," + parseInt(h.slice(4, 6), 16) + "," + a + ")"; }

  function startField(canvas, p, isLive) {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pal = ORB_PAL[p.orbMood] || ORB_PAL.engaged;
    var accent = p.tone;
    var W = 0, H = 0, cx = 0, cy = 0, R = 0, parts = [];
    var DENSITY = 2600, rotY = 0, rotX = -0.25, amp = 0, t0 = 0;
    var mouse = { x: null, y: null, inside: false, hold: false }, pulses = [];
    function size() {
      var r = canvas.getBoundingClientRect(); if (!r.width) return;
      W = r.width; H = r.height; canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2; R = Math.min(W, H) * 0.5 * 0.62;
      if (parts.length !== DENSITY) build();
    }
    function build() {
      parts = []; var N = DENSITY, NS = Math.floor(N * 0.70), NA = Math.floor(N * 0.22), ND = N - NS - NA, i, hi;
      for (i = 0; i < NS; i++) {
        var f = (i + 0.5) / NS, phi = Math.acos(1 - 2 * f), th = i * GA;
        var boost = Math.pow(Math.max(0, Math.cos(th - phi * 4)), 3), rad = 0.86 + boost * 0.18;
        hi = Math.floor((((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI / pal.hues.length));
        parts.push({ x: Math.sin(phi) * Math.cos(th) * rad, y: Math.cos(phi) * rad, z: Math.sin(phi) * Math.sin(th) * rad, kind: 0, hi: hi, color: pal.hues[hi], size: 0.7 + Math.random() * 0.9, ph: Math.random() * 6.28, mx: 0, my: 0 });
      }
      for (i = 0; i < NA; i++) {
        var phiA = Math.PI / 2 + (Math.random() - 0.5) * 1.7, thA = i * GA * 1.7 + Math.random() * 0.4;
        var bA = Math.pow(Math.max(0, Math.cos((thA - phiA * 6) * 0.6)), 2), radA = 1.0 + bA * 0.55 + Math.random() * 0.05;
        hi = Math.floor((((thA % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI / pal.hues.length));
        parts.push({ x: Math.sin(phiA) * Math.cos(thA) * radA, y: Math.cos(phiA) * radA, z: Math.sin(phiA) * Math.sin(thA) * radA, kind: 1, hi: hi, color: pal.hues[hi], size: 0.55 + Math.random() * 0.7, ph: Math.random() * 6.28, mx: 0, my: 0 });
      }
      for (i = 0; i < ND; i++) {
        var a = Math.random() * 6.28, rd = 1.3 + Math.pow(Math.random(), 2) * 0.9;
        hi = Math.floor(Math.random() * pal.hues.length);
        parts.push({ x: Math.cos(a) * rd, y: (Math.random() - 0.5) * 1.6, z: Math.sin(a) * rd, kind: 2, hi: hi, color: pal.hues[hi], size: 0.5 + Math.random() * 0.7, ph: Math.random() * 6.28, mx: 0, my: 0 });
      }
    }
    function sampleAmp(t, live) {
      if (!live) return 0.06 + Math.sin(t * 0.5) * 0.03;
      var lfo = Math.sin(t * 0.8) * 0.5 + 0.5, syll = Math.max(0, Math.sin(t * 5 + Math.sin(t * 1.4) * 2)), burst = Math.pow(Math.max(0, Math.sin(t * 3.2)), 6) * 0.6;
      return Math.min(1, 0.20 + lfo * 0.18 + syll * 0.38 + burst + (Math.random() - 0.5) * 0.05);
    }
    function core(a) {
      var hR = R * (0.62 + a * 0.06), g = ctx.createRadialGradient(cx, cy, 0, cx, cy, hR);
      g.addColorStop(0, pal.halo); g.addColorStop(0.5, pal.halo.replace(/[\d.]+\)$/, "0.10)")); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, hR, 0, 6.2832); ctx.fill();
      var cR = R * (0.16 + a * 0.03), c = ctx.createRadialGradient(cx, cy, 0, cx, cy, cR);
      c.addColorStop(0, pal.core); c.addColorStop(0.55, "rgba(255,255,255,0.55)"); c.addColorStop(0.85, "rgba(255,255,255,0.18)"); c.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy, cR, 0, 6.2832); ctx.fill();
    }
    size();
    function frame(now) {
      if (!modal) return;
      if (!t0) t0 = now; var t = (now - t0) / 1000, live = !!(isLive && isLive());
      amp += (sampleAmp(t, live) - amp) * 0.15;
      rotY += (1 / 60) * (0.12 + amp * 0.10);
      ctx.clearRect(0, 0, W, H);
      core(amp);
      // click pulse rings
      var pr = 0;
      for (var k = pulses.length - 1; k >= 0; k--) {
        pulses[k].t += 1 / 60; if (pulses[k].t > 1.6) { pulses.splice(k, 1); continue; }
        var r0 = R * (0.5 + pulses[k].t * 1.4), aL = Math.max(0, 0.4 - pulses[k].t * 0.3);
        ctx.strokeStyle = hexRgba(accent, aL.toFixed(3)); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(cx, cy, r0, 0, 6.2832); ctx.stroke();
        pr += Math.exp(-Math.pow((pulses[k].t - 0.5) / 0.3, 2)) * 0.18;
      }
      var cY = Math.cos(rotY), sY = Math.sin(rotY), cX = Math.cos(rotX), sX = Math.sin(rotX), focal = 2.4, camZ = 2.6;
      var mInside = mouse.inside, mX = mouse.x, mY = mouse.y, hold = mouse.hold;
      for (var i = 0; i < parts.length; i++) {
        var pt = parts[i], br = 1 + amp * 0.05 + Math.sin(t * 1.2 + pt.ph) * 0.01 + pr;
        var px = pt.x * br, py = pt.y * br, pz = pt.z * br;
        var rx1 = px * cY + pz * sY, rz1 = -px * sY + pz * cY;
        var ry2 = py * cX - rz1 * sX, rz2 = py * sX + rz1 * cX;
        var scale = focal / (camZ - rz2), sx = cx + rx1 * R * scale, sy = cy + ry2 * R * scale;
        if (mInside && mX !== null) {
          var ddx = sx + pt.mx - mX, ddy = sy + pt.my - mY, dd = Math.hypot(ddx, ddy), range = hold ? 220 : 130;
          if (dd < range && dd > 1) { var kk = 1 - dd / range; if (hold) { pt.mx -= (ddx / dd) * kk * 1.6; pt.my -= (ddy / dd) * kk * 1.6; } else { pt.mx += (ddx / dd) * kk * 1.2; pt.my += (ddy / dd) * kk * 1.2; } }
        }
        pt.mx *= 0.92; pt.my *= 0.92; sx += pt.mx; sy += pt.my;
        if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue;
        var depth = (rz2 + 1.4) / 2.8, dot = Math.max(0.06, depth), sz = pt.size * (0.5 + dot * 1.1);
        var df = Math.hypot(sx - cx, sy - cy), cf = Math.min(1, Math.max(0.55, (df - R * 0.12) / (R * 0.18)));
        var base = pt.kind === 2 ? 0.42 : pt.kind === 1 ? 0.78 : 0.92;
        ctx.fillStyle = hexRgba(pt.color, Math.min(0.95, base * dot * cf * (0.65 + amp * 0.25)).toFixed(3));
        ctx.beginPath(); ctx.arc(sx, sy, sz, 0, 6.2832); ctx.fill();
      }
      modal.__raf = requestAnimationFrame(frame);
    }
    if (window.ResizeObserver) { var ro = new ResizeObserver(size); ro.observe(canvas); }
    function pmove(e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.inside = true; }
    function pleave() { mouse.inside = false; }
    function pdown(e) { mouse.hold = true; pulses.push({ t: 0 }); pmove(e); }
    function pup() { mouse.hold = false; }
    canvas.style.cursor = "crosshair"; canvas.style.touchAction = "none";
    canvas.addEventListener("pointermove", pmove);
    canvas.addEventListener("pointerleave", pleave);
    canvas.addEventListener("pointerdown", pdown);
    window.addEventListener("pointerup", pup);
    modal.__raf = requestAnimationFrame(frame);
  }
})();
