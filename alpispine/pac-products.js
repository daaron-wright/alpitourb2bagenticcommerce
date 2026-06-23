/* ============================================================
   PAC · package inventory + per-holiday-type compliance data.
   The six exemplified customer-experience packages, each mapped
   to its holiday type's real compliance story (documents →
   requirements → rules → booking decision).
   Loaded plain (no JSX) before screen-governance.jsx.
   ============================================================ */
(function () {
  // Seven rule categories, fixed order. Each holiday type fills the descriptions.
  var RULE_TITLES = [
    "Destination & advisory status",
    "Intended party / travel type",
    "Agency tier / channel",
    "Health & entry requirements",
    "Carrier & transfer rules",
    "Documents before booking",
    "Specialist review / approval",
  ];

  function rules(xs) { return RULE_TITLES.map(function (t, i) { return { t: t, x: xs[i] }; }); }

  var APPS = {
    /* ---- Family beach holidays (Bravo all-inclusive) ---- */
    family: {
      label: "Family beach holidays",
      docs: [
        { c: "FCT", name: "Resort Fact Sheet", x: "Baby pool depth, kids' club ages, family rooms" },
        { c: "ENT", name: "Entry-Rules Bundle", x: "EG e-visa + passport validity ≥ 6 months" },
        { c: "PTD", name: "Package Travel Info Sheet", x: "PTD Annex I — rights, insolvency protection" },
      ],
      reqs: [
        ["ENT", "Entry rules satisfied — e-visa issued, passports valid ≥ 6 months"],
        ["ENT", "No advisory above level 2 for the resort corridor in the travel window"],
        ["FCT", "Family must-haves documented — baby pool, kids' club, family room"],
        ["FCT", "Infant equipment (cot, high chair) confirmed on the rooming list"],
        ["PTD", "PTD Annex I information sheet delivered before booking"],
        ["PTD", "Non-EU passport holders → local entry documentation"],
      ],
      rules: rules([
        "Authorised destinations · advisory level ≤ 2 documented",
        "Family beach packages — as documented in the fact sheet",
        "Verified Welcome Travel / partner agency account",
        "E-visa + passport validity checked per traveller",
        "Neos or approved carrier · licensed transfer operator",
        "PTD info sheet + insurance terms on file",
        "New agency or 9+ pax group → trade-desk review",
      ]),
      scns: [
        { id: "a", out: "allow", title: "Repeat family, Welcome Travel agency", sub: "Rossi Travel · verified · 2 adults + 1 child · EG",
          ev: ["pass", "pass", "pass", "pass", "pass", "pass", "pass"],
          verdict: "Hold released to booking.",
          body: "Entry documentation is already on file for the party and the agency is a verified Welcome Travel member — every applicable rule clears with no human step.",
          req: [["checkmark-filled", "EG e-visa + passport validity — verified"], ["checkmark-filled", "PTD Annex I info sheet — delivered"]],
          rule: "entry.cleared ∧ agency.verified ∧ docs.complete → allow" },
        { id: "b", out: "cond", title: "New agency, non-EU passports", sub: "New agency · clients with non-EU passports · 4 pax",
          ev: ["cond", "pass", "cond", "block", "pass", "pass", "cond"],
          verdict: "Held pending entry docs & sign-off.",
          body: "The package is in scope, but non-EU passport holders need consulate-issued visas and the agency is not yet verified. It clears automatically once both are on file.",
          req: [["document-chart", "Consulate visa evidence per traveller"], ["document-chart", "Agency verification"], ["group", "Trade-desk sign-off (new agency)"]],
          rule: "entry.docs.missing ∨ ¬agency.verified → require(evidence) ∧ route(tradedesk)" },
        { id: "c", out: "declined", title: "Unverified channel, undisclosed resale", sub: "Unverified channel · undisclosed group resale · advisory breach",
          ev: ["block", "block", "block", "pass", "pass", "block", "block"],
          verdict: "Booking blocked.",
          body: "A family package cannot be released to an unverified channel for an undisclosed group resale into a corridor above the advisory threshold. The channel is referred to Alpitour partner verification.",
          req: [["error-filled", "Undisclosed resale — package terms cannot be honoured"], ["error-filled", "Advisory above threshold / channel unverified"]],
          rule: "resale.undisclosed ∨ ¬advisory.within → deny" },
      ],
    },

    /* ---- Adults-only escapes (Francorosso) ---- */
    couples: {
      label: "Adults-only escapes",
      docs: [
        { c: "FCT", name: "Resort Fact Sheet", x: "Adults-only policy, suite categories, sea-view promise" },
        { c: "ENT", name: "Entry-Rules Bundle", x: "Schengen / GR entry · ID validity" },
        { c: "PRM", name: "Promise Declaration", x: "Sea-view + adults-only covenant per booking" },
      ],
      reqs: [
        ["PRM", "Adults-only covenant — no under-16 travellers on the rooming list"],
        ["PRM", "Sea-view promise preserved on any re-accommodation"],
        ["FCT", "Suite category documented against the brand promise"],
        ["ENT", "ID / passport validity checked per traveller"],
        ["PTD", "PTD information delivered before booking"],
      ],
      rules: rules([
        "Authorised destinations · advisory documented",
        "Adults-only escapes — party of 2, no minors",
        "Verified agency or direct Francorosso channel",
        "Standard Schengen entry · ID validity",
        "Approved carrier · private transfer documented",
        "Promise declaration + insurance terms on file",
        "Honeymoon add-ons or 3+ rooms → trade-desk review",
      ]),
      scns: [
        { id: "a", out: "allow", title: "Couple, verified agency, live season", sub: "Existing agency · Santorini · 2 pax",
          ev: ["pass", "pass", "pass", "pass", "pass", "pass", "pass"],
          verdict: "Hold released to booking.",
          body: "The promise declaration is on file and the party matches the adults-only covenant — the booking ships against the qualified departure with no human step.",
          req: [["checkmark-filled", "Adults-only covenant — party verified"], ["checkmark-filled", "Sea-view promise — suite category locked"]],
          rule: "covenant.match ∧ agency.verified ∧ promise.locked → allow" },
        { id: "b", out: "cond", title: "Minor on the rooming list", sub: "Verified agency · 2 adults + 1 minor · adults-only resort",
          ev: ["pass", "block", "pass", "pass", "pass", "cond", "cond"],
          verdict: "Held — covenant conflict, alternative offered.",
          body: "The resort's adults-only covenant excludes the party as composed. The recommendation agent prepares family-friendly alternatives that preserve budget and dates; trade desk confirms the switch.",
          req: [["document-chart", "Alternative resort proposal (family-friendly)"], ["group", "Trade-desk confirmation of the switch"]],
          rule: "party.minor ∧ resort.adults_only → require(alternative) ∧ route(tradedesk)" },
        { id: "c", out: "declined", title: "Resale into restricted window", sub: "Unverified reseller · blackout window · undisclosed party",
          ev: ["block", "block", "block", "pass", "pass", "block", "block"],
          verdict: "Booking blocked.",
          body: "An unverified reseller cannot place an undisclosed party into a blackout window at a covenant-protected resort. The channel is referred to Alpitour partner verification.",
          req: [["error-filled", "Blackout window — departure not released to resale"], ["error-filled", "Channel unverified / party undisclosed"]],
          rule: "¬window.released ∨ ¬channel.verified → deny" },
      ],
    },

    /* ---- Guided tours (Turisanda / signature journeys) ---- */
    tours: {
      label: "Guided tours",
      docs: [
        { c: "FCT", name: "Tour Fact Sheet", x: "Pace grade, group size, guide language, hotel list" },
        { c: "ENT", name: "Entry-Rules Bundle", x: "JP / multi-country entry · passport validity" },
        { c: "GTE", name: "Departure Guarantee", x: "Minimum group + guaranteed-departure status" },
      ],
      reqs: [
        ["GTE", "Departure guaranteed or minimum group documented"],
        ["ENT", "Multi-country entry rules satisfied per traveller"],
        ["FCT", "Pace grade and mobility requirements acknowledged"],
        ["FCT", "Guide language confirmed for the party"],
        ["PTD", "PTD information delivered before booking"],
      ],
      rules: rules([
        "Authorised itinerary countries · advisories documented",
        "Guided tours — escorted, fixed departures",
        "Verified agency · tour-qualified channel",
        "Passport validity + visas for every country on the route",
        "Approved carriers across all segments · rail/coach licensed",
        "Departure guarantee + insurance terms on file",
        "Itinerary deviation or private guide → specialist review",
      ]),
      scns: [
        { id: "a", out: "allow", title: "Guaranteed departure, verified agency", sub: "Existing agency · Japan · 2 pax · October",
          ev: ["pass", "pass", "pass", "pass", "pass", "pass", "pass"],
          verdict: "Hold released to booking.",
          body: "The October departure is guaranteed, entry rules clear for both travellers, and the agency is tour-qualified — every rule clears against the verified account.",
          req: [["checkmark-filled", "Departure guarantee — confirmed"], ["checkmark-filled", "JP entry rules — cleared per traveller"]],
          rule: "departure.guaranteed ∧ agency.verified ∧ entry.cleared → allow" },
        { id: "b", out: "cond", title: "Below minimum group, season tail", sub: "Verified agency · 2 pax · departure at 6 of 10 minimum",
          ev: ["pass", "pass", "pass", "pass", "pass", "block", "cond"],
          verdict: "Held pending guarantee decision.",
          body: "Entry and agency checks clear, but the departure sits below its minimum group. The yield desk decides whether to guarantee, consolidate, or offer the adjacent date. The hold parks until decided.",
          req: [["document-chart", "Departure-guarantee decision from the yield desk"], ["group", "Specialist sign-off (consolidation option)"]],
          rule: "group.below_minimum → require(guarantee_decision) ∧ route(yield)" },
        { id: "c", out: "declined", title: "Restricted route segment, unverified", sub: "Unverified channel · restricted country segment · no entry evidence",
          ev: ["block", "block", "block", "block", "pass", "block", "block"],
          verdict: "Booking blocked.",
          body: "An unverified channel with no entry evidence cannot book a tour crossing a restricted route segment. The channel is referred to Alpitour partner verification.",
          req: [["error-filled", "Restricted segment — route not authorised for this window"], ["error-filled", "No entry evidence / channel unverified"]],
          rule: "¬route.authorised ∨ ¬entry.evidence → deny" },
      ],
    },
  };

  var PRODUCTS = [
    { id: "jaz-mirabel", name: "Jaz Mirabel Beach", fam: "Bravo", family: "All-inclusive family resort", app: "family",
      accent: "#0F766E", logo: "assets/bravo-logo.png",
      tagline: "Shallow lagoon, shaded baby pool, BravoClub kids' club — the family flagship in Sharm.",
      meta: "PKG 31881 · Sharm el-Sheikh, EG · 7 nights · all inclusive",
      props: [["Rating", "4.6"], ["Nights", "7"], ["Board", "AI"]] },
    { id: "coral-bay", name: "Coral Bay Family Resort", fam: "Bravo", family: "All-inclusive family resort", app: "family",
      accent: "#0E7490", logo: "assets/bravo-logo.png",
      tagline: "Kids' club and family rooms with strong availability across the season.",
      meta: "PKG 31140 · Sharm el-Sheikh, EG · 7 nights · all inclusive",
      props: [["Rating", "4.5"], ["Nights", "7"], ["Board", "AI"]] },
    { id: "santorini-two", name: "Santorini for two", fam: "Francorosso", family: "Adults-only escape", app: "couples",
      accent: "#E11B22", logo: "assets/francorosso-logo.png",
      tagline: "Caldera-view suite, adults only — the signature couples' escape.",
      meta: "PKG 49107 · Cyclades, GR · 5 nights · adults only",
      props: [["Rating", "4.8"], ["Nights", "5"], ["Suite", "Sea view"]] },
    { id: "bali-wellness", name: "Bali wellness retreat", fam: "Francorosso", family: "Adults-only escape", app: "couples",
      accent: "#C2185B", logo: "assets/francorosso-logo.png",
      tagline: "Spa, yoga and quiet — a long-haul recharge for two.",
      meta: "PKG 49007 · Ubud, ID · 9 nights · half board",
      props: [["Rating", "4.8"], ["Nights", "9"], ["Spa", "Daily"]] },
    { id: "giappone-autore", name: "Giappone d'Autore", fam: "Turisanda", family: "Signature guided journey", app: "tours",
      accent: "#1E5BB8", logo: "assets/turisanda-logo.png",
      tagline: "Tokyo to Osaka with ryokan stays, omakase and a private guide.",
      meta: "PKG 27467 · Japan · 10 nights · escorted",
      props: [["Rating", "4.9"], ["Nights", "10"], ["Group", "≤ 16"]] },
    { id: "andalusia-ease", name: "Andalusia at ease", fam: "Turisanda", family: "Signature guided journey", app: "tours",
      accent: "#2563EB", logo: "assets/turisanda-logo.png",
      tagline: "Seville to Granada at an easy pace, with direct flights.",
      meta: "PKG 28842 · Spain · 8 nights · escorted",
      props: [["Rating", "4.7"], ["Nights", "8"], ["Pace", "Easy"]] },
  ];

  window.PAC_APPS = APPS;
  window.PAC_PRODUCTS = PRODUCTS;
})();
