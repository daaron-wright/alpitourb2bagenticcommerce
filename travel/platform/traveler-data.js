/* ============================================================
   Travel Group Platform · traveler-side fixtures (window.TV)
   Consumer Travel Portal — browse-first consumer storefront. Categories
   map 1:1 to the 8 B2C personalization clusters. English copy.
   ============================================================ */
window.TV = (() => {
  const categories = [
    { id: "fam", label: "Beach & family", icon: "group", brand: "Family Travel" },
    { id: "cur", label: "Signature journeys", icon: "document-chart", brand: "Signature Travel" },
    { id: "rom", label: "Just for two", icon: "recommend", brand: "Premium Travel" },
    { id: "deal", label: "Deals", icon: "analytics", brand: "Value Travel" },
    { id: "sun", label: "Summer & friends", icon: "lightbulb", brand: "Travel Group" },
    { id: "slow", label: "Tours at ease", icon: "network", brand: "Premium Travel" },
    { id: "act", label: "Adventure", icon: "anomaly", brand: "Travel Group" },
    { id: "well", label: "Wellness", icon: "checkmark-filled", brand: "Value Travel" },
  ];

  const packages = [
    { id: "jaz", cat: "fam", brand: "Family Travel", name: "Jaz Mirabel Beach", place: "Sharm el-Sheikh, Egypt", meta: "All inclusive · families · baby pool", price: 1180, per: "per person · 7 nights", rating: 4.6, tag: "Your 2024 trip" },
    { id: "coral", cat: "fam", brand: "Family Travel", name: "Coral Bay Family Resort", place: "Sharm el-Sheikh, Egypt", meta: "Family TravelClub · kids' club · family rooms", price: 1090, per: "per person · 7 nights", rating: 4.5 },
    { id: "japan", cat: "cur", brand: "Signature Travel", name: "Japan Signature Journey", place: "Tokyo → Osaka, Japan", meta: "Ryokan · omakase · private guide", price: 4920, per: "per person · 10 nights", rating: 4.9 },
    { id: "santo", cat: "rom", brand: "Premium Travel", name: "Santorini for two", place: "Cyclades, Greece", meta: "Adults only · caldera-view suite", price: 1640, per: "per person · 5 nights", rating: 4.8 },
    { id: "crete", cat: "deal", brand: "Value Travel", name: "Crete last minute", place: "Heraklion, Greece", meta: "Flexible departures · −22%", price: 740, per: "per person · 7 nights", rating: 4.3, tag: "Deal" },
    { id: "ibiza", cat: "sun", brand: "Travel Group", name: "Ibiza with friends", place: "Balearics, Spain", meta: "Beach club · entertainment · groups", price: 980, per: "per person · 7 nights", rating: 4.4 },
    { id: "andal", cat: "slow", brand: "Premium Travel", name: "Andalusia at ease", place: "Seville → Granada, Spain", meta: "Guided tour · direct flights · easy pace", price: 1390, per: "per person · 8 nights", rating: 4.7 },
    { id: "redsea", cat: "act", brand: "Travel Group", name: "Red Sea diving week", place: "Marsa Alam, Egypt", meta: "Dive package · house reef", price: 1120, per: "per person · 7 nights", rating: 4.6 },
    { id: "bali", cat: "well", brand: "Value Travel", name: "Bali wellness retreat", place: "Ubud, Indonesia", meta: "Spa · yoga · quiet", price: 1860, per: "per person · 9 nights", rating: 4.8 },
  ];

  /* needs-capture chips — the vague family request, structured */
  const needs = [
    { k: "Destination", v: "Sharm el-Sheikh, Egypt" },
    { k: "When", v: "mid-August · flexible ±1 week" },
    { k: "Who's traveling", v: "2 adults + 1 girl (age 2)" },
    { k: "Board", v: "All inclusive" },
    { k: "Budget", v: "≈ £3,500 per family" },
    { k: "Must-haves", v: "Baby pool · kids' club · family room" },
  ];

  const agency = { name: "Partner Travel Agency", agent: "Travel Advisor", city: "London", phone: "+44 20 7946 0123" };

  /* multimodal visual match — Travel Assistant answers a photo with lookalike packages */
  const visualMatch = {
    extracted: ["shallow, gently sloping water", "real shade at the pool edge", "toddler slides", "loungers a step away"],
    results: [
      { pkg: "jaz", match: 96, why: "the same shallow lagoon as your photo" },
      { pkg: "coral", match: 93, why: "shaded baby pool + kids' club next to it" },
      { pkg: "crete", match: 88, why: "soft sloping sand, gentle seabed" },
    ],
  };

  return { categories, packages, needs, agency, visualMatch };
})();
