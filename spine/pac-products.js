/* ============================================================
   PAC · product inventory + per-application compliance data.
   The six exemplified customer-experience grades, each mapped
   to its application's real compliance story (documents →
   requirements → rules → purchase decision).
   Loaded plain (no JSX) before screen-governance.jsx.
   ============================================================ */
(function () {
  // Seven rule categories, fixed order. Each app fills the descriptions.
  var RULE_TITLES = [
    "Permitted geography",
    "Intended application / use",
    "Buyer type / industry",
    "Storage & handling",
    "Shipping / destination",
    "Documentation before purchase",
    "Specialist review / approval",
  ];

  function rules(xs) { return RULE_TITLES.map(function (t, i) { return { t: t, x: xs[i] }; }); }

  var APPS = {
    /* ---- Flexible food packaging (AFFINITY plastomers) ---- */
    packaging: {
      label: "Food-contact packaging",
      docs: [
        { c: "SDS", name: "Safety Data Sheet", x: "Non-hazardous solid · handling, dust, storage" },
        { c: "TDS", name: "Technical Data Sheet", x: "Seal temp, density, melt index, shelf life" },
        { c: "FCS", name: "Food-Contact Statement", x: "EU 10/2011 + FDA 21 CFR 177.1520 status" },
      ],
      reqs: [
        ["FCS", "Food-contact compliant — EU 10/2011 & FDA 21 CFR 177.1520"],
        ["FCS", "Overall migration within EU limits for the intended use"],
        ["TDS", "Seal-initiation below the converter's documented line max"],
        ["TDS", "Moisture-controlled storage · documented shelf life"],
        ["SDS", "Non-hazardous solid — standard handling & freight"],
        ["FCS", "Non-EU/US market → local food-contact documentation"],
      ],
      rules: rules([
        "Authorised food-contact markets (EU / US documented)",
        "Food-contact packaging seal layers — as documented",
        "Verified film / packaging converter account",
        "Dry, moisture-controlled storage; FIFO within shelf life",
        "Non-hazardous — standard freight, any lane",
        "Food-contact statement + REACH declaration on file",
        "New region or large volume → product-steward review",
      ]),
      scns: [
        { id: "a", out: "allow", title: "Repeat EU packaging converter", sub: "Existing account · Germany (EU) · 12 t",
          ev: ["pass", "pass", "pass", "pass", "pass", "pass", "pass"],
          verdict: "Order released to fulfilment.",
          body: "Food-contact documentation is already on file for the EU and the converter is verified — every applicable rule clears with no human step.",
          req: [["checkmark-filled", "EU 10/2011 + FDA food-contact statement — on file"], ["checkmark-filled", "REACH declaration — on file"]],
          rule: "food_contact ∧ buyer.verified ∧ docs.complete → allow" },
        { id: "b", out: "cond", title: "New converter, non-EU market", sub: "New buyer · Brazil · 8 t",
          ev: ["cond", "pass", "cond", "pass", "pass", "block", "cond"],
          verdict: "Held pending local food-contact docs & sign-off.",
          body: "The grade is food-contact compliant, but Brazil needs local (ANVISA) documentation and the buyer is not yet verified. It clears automatically once both are on file.",
          req: [["document-chart", "Brazil (ANVISA) food-contact documentation"], ["document-chart", "Buyer verification"], ["group", "Product-steward sign-off (new region)"]],
          rule: "region.docs.missing ∨ ¬buyer.verified → require(evidence) ∧ route(steward)" },
        { id: "c", out: "declined", title: "Unverified, undisclosed use", sub: "Unverified buyer · undisclosed application · restricted market",
          ev: ["block", "block", "block", "pass", "pass", "block", "block"],
          verdict: "Purchase blocked.",
          body: "A food-contact grade cannot be released to an unverified buyer for an undisclosed application in a non-authorised market. Buyer is referred to Dow account verification.",
          req: [["error-filled", "Undisclosed application — food-contact use cannot be certified"], ["error-filled", "Market not authorised / buyer unverified"]],
          rule: "application.undisclosed ∨ ¬geography.authorised → deny" },
      ],
    },

    /* ---- Performance footwear foam (INFUSE OBCs) ---- */
    footwear: {
      label: "Consumer footwear foam",
      docs: [
        { c: "SDS", name: "Safety Data Sheet", x: "Non-hazardous solid · dust control on compounding" },
        { c: "TDS", name: "Technical Data Sheet", x: "Foam density, rebound, Shore A, processing window" },
        { c: "SCD", name: "Skin-Contact Declaration", x: "REACH SVHC screen + consumer-goods RSL" },
      ],
      reqs: [
        ["SCD", "Skin-contact safe — REACH SVHC screen clear"],
        ["SCD", "No restricted substances on the consumer-goods RSL"],
        ["TDS", "Foaming / processing window documented"],
        ["TDS", "Density & compression-set spec maintained"],
        ["SDS", "Non-hazardous; dust control during compounding"],
      ],
      rules: rules([
        "Consumer-goods markets (REACH / RSL documented)",
        "Footwear & consumer foamed components",
        "Verified footwear brand or foam compounder",
        "Dry storage; standard handling",
        "Non-hazardous — standard freight",
        "Skin-contact declaration + REACH on file",
        "New brand or large volume → product-steward review",
      ]),
      scns: [
        { id: "a", out: "allow", title: "Footwear brand, live program", sub: "Existing brand · EU · 6 t",
          ev: ["pass", "pass", "pass", "pass", "pass", "pass", "pass"],
          verdict: "Order released to fulfilment.",
          body: "Skin-contact and RSL documentation are on file and the brand account is verified — the grade ships against the qualified program with no human step.",
          req: [["checkmark-filled", "Skin-contact declaration — on file"], ["checkmark-filled", "Consumer-goods RSL screen — clear"]],
          rule: "skin_contact ∧ buyer.verified ∧ rsl.clear → allow" },
        { id: "b", out: "cond", title: "New compounder, first order", sub: "New foam compounder · US · 10 t",
          ev: ["pass", "pass", "cond", "pass", "pass", "block", "cond"],
          verdict: "Held pending declaration & sign-off.",
          body: "Market and application are fine, but a first-time compounder needs verification and the skin-contact declaration is not yet on file. The request parks until both clear.",
          req: [["document-chart", "Signed skin-contact declaration"], ["document-chart", "Compounder verification"], ["group", "Product-steward sign-off (new account)"]],
          rule: "docs.missing ∨ ¬buyer.verified → require(evidence) ∧ route(steward)" },
        { id: "c", out: "declined", title: "Consumer reseller, no RSL", sub: "Unverified reseller · no RSL compliance · undisclosed use",
          ev: ["block", "block", "block", "pass", "pass", "block", "block"],
          verdict: "Purchase blocked.",
          body: "An unverified reseller with no restricted-substances compliance cannot be supplied a skin-contact grade for an undisclosed use. Buyer is referred to Dow account verification.",
          req: [["error-filled", "No RSL compliance — skin-contact use cannot be certified"], ["error-filled", "Buyer unverified / use undisclosed"]],
          rule: "¬rsl.clear ∨ ¬buyer.verified → deny" },
      ],
    },

    /* ---- Automotive TPO (ENGAGE elastomers) ---- */
    auto: {
      label: "Automotive TPO",
      docs: [
        { c: "SDS", name: "Safety Data Sheet", x: "Non-hazardous solid · handling & storage" },
        { c: "TDS", name: "Technical Data Sheet", x: "Loading range, melt temp, Tg, Shore A" },
        { c: "RDS", name: "Regulatory Data Sheet", x: "REACH registration + IMDS automotive" },
      ],
      reqs: [
        ["RDS", "REACH registered; IMDS / declarable substances reported"],
        ["TDS", "Documented loading range + melt-compounding temp"],
        ["TDS", "Low-temperature impact (Tg) spec maintained"],
        ["SDS", "Non-hazardous solid — standard handling & freight"],
        ["RDS", "OEM material approval may be required for the program"],
      ],
      rules: rules([
        "Authorised automotive markets",
        "Automotive TPO compounding",
        "Verified Tier-1 / OEM-approved supplier",
        "Dry storage; standard handling",
        "Non-hazardous — standard freight",
        "REACH + IMDS declaration on file",
        "New OEM program / IMDS pending → product-steward review",
      ]),
      scns: [
        { id: "a", out: "allow", title: "Tier-1 automotive supplier", sub: "Existing account · Germany (EU) · 22 t",
          ev: ["pass", "pass", "pass", "pass", "pass", "pass", "pass"],
          verdict: "Order released to fulfilment.",
          body: "REACH and IMDS declarations are on file and the supplier is OEM-approved for the program — every rule clears against the verified account.",
          req: [["checkmark-filled", "REACH registration — on file"], ["checkmark-filled", "IMDS declaration — submitted"]],
          rule: "reach.registered ∧ buyer.verified ∧ imds.filed → allow" },
        { id: "b", out: "cond", title: "New OEM program, IMDS pending", sub: "New supplier · US · 15 t",
          ev: ["pass", "pass", "cond", "pass", "pass", "block", "cond"],
          verdict: "Held pending IMDS & approval.",
          body: "Market and application are in scope, but the new program's IMDS report and OEM material approval are not yet complete. The order clears once both are filed.",
          req: [["document-chart", "IMDS declarable-substances report"], ["document-chart", "OEM material approval"], ["group", "Product-steward sign-off (new program)"]],
          rule: "imds.pending ∨ approval.missing → require(evidence) ∧ route(steward)" },
        { id: "c", out: "declined", title: "Restricted destination, unverified", sub: "Unverified buyer · non-authorised market · no IMDS",
          ev: ["block", "block", "block", "pass", "pass", "block", "block"],
          verdict: "Purchase blocked.",
          body: "An unverified buyer in a non-authorised market with no declarable-substances reporting cannot be supplied for automotive compounding. Buyer is referred to Dow account verification.",
          req: [["error-filled", "No IMDS / REACH evidence for automotive supply"], ["error-filled", "Market not authorised / buyer unverified"]],
          rule: "¬geography.authorised ∨ ¬reach.evidence → deny" },
      ],
    },
  };

  var PRODUCTS = [
    { id: "affinity-1881", name: "AFFINITY™ PL 1881G", fam: "AFFINITY", family: "Polyolefin Plastomer (POP)", app: "packaging",
      accent: "#0F766E", logo: "assets/affinity-logo.png",
      tagline: "Low-temperature heat-seal resin for flexible food packaging.",
      meta: "SKU 31881 · CAS 26221-73-8 · non-hazardous · food-contact",
      props: [["Seal init.", "88 °C"], ["Density", "0.904 g/cm³"], ["Melt index", "1.0"]] },
    { id: "affinity-1140", name: "AFFINITY™ PF 1140G", fam: "AFFINITY", family: "Polyolefin Plastomer (POP)", app: "packaging",
      accent: "#0E7490", logo: "assets/affinity-logo.png",
      tagline: "Broad-availability seal resin with strong EU stock.",
      meta: "SKU 31140 · CAS 26221-73-8 · non-hazardous · food-contact",
      props: [["Seal init.", "96 °C"], ["Density", "0.897 g/cm³"], ["Melt index", "1.6"]] },
    { id: "infuse-9107", name: "INFUSE™ 9107", fam: "INFUSE", family: "Olefin Block Copolymer (OBC)", app: "footwear",
      accent: "#E11B22", logo: "assets/infuse-logo.png",
      tagline: "High-rebound foam for performance footwear midsoles.",
      meta: "SKU 49107 · CAS 25087-34-7 · non-hazardous · skin-contact",
      props: [["Rebound", "62 %"], ["Density", "0.866 g/cm³"], ["Shore A", "75"]] },
    { id: "infuse-9007", name: "INFUSE™ 9007", fam: "INFUSE", family: "Olefin Block Copolymer (OBC)", app: "footwear",
      accent: "#C2185B", logo: "assets/infuse-logo.png",
      tagline: "Soft, flexible foam for plush cushioning.",
      meta: "SKU 49007 · CAS 25087-34-7 · non-hazardous · skin-contact",
      props: [["Rebound", "54 %"], ["Density", "0.866 g/cm³"], ["Shore A", "60"]] },
    { id: "engage-7467", name: "ENGAGE™ 7467", fam: "ENGAGE", family: "Polyolefin Elastomer (POE)", app: "auto",
      accent: "#1E5BB8", logo: "assets/engage-logo.png",
      tagline: "Cold-temperature impact modifier for automotive TPO.",
      meta: "SKU 27467 · CAS 26221-73-8 · non-hazardous · REACH reg.",
      props: [["Tg", "−58 °C"], ["Density", "0.862 g/cm³"], ["Melt index", "1.2"]] },
    { id: "engage-8842", name: "ENGAGE™ 8842", fam: "ENGAGE", family: "Polyolefin Elastomer (POE)", app: "auto",
      accent: "#2563EB", logo: "assets/engage-logo.png",
      tagline: "High-rubber POE for soft-touch automotive TPO.",
      meta: "SKU 28842 · CAS 26221-73-8 · non-hazardous · REACH reg.",
      props: [["Shore A", "54"], ["Density", "0.857 g/cm³"], ["Melt index", "1.0"]] },
  ];

  window.PAC_APPS = APPS;
  window.PAC_PRODUCTS = PRODUCTS;
})();
