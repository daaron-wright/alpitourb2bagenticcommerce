/* ============================================================
   AlpiGPT Front Door — data + stages
   Migrated from alpitour/frontdoor2/data.js
   ============================================================ */

export const STAGES = [
  { key: 'inquiry',  label: 'Your request',  warm: 'Reading your request',        agents: ['Intent Agent'], kaf: 'Discover' },
  { key: 'needs',    label: 'The details',   warm: 'Getting the details right',    agents: ['Requirements Agent'], kaf: 'Discover' },
  { key: 'you',      label: 'You',           warm: 'Remembering what you love',    agents: ['Context Agent'], kaf: 'Discover' },
  { key: 'search',   label: 'Search',        warm: 'Searching every brand',        agents: ['Inventory Agent', 'Recommendation Agent', 'Upsell Agent'], kaf: 'Plan' },
  { key: 'compose',  label: 'Your trip',     warm: 'Putting your trip together',    agents: ['Itinerary Agent'], kaf: 'Plan' },
  { key: 'finish',   label: 'Final touches', warm: 'Pricing and final checks',     agents: ['Pricing Agent', 'Proposal Agent'], kaf: 'Validate' },
  { key: 'ready',    label: 'Ready',         warm: 'Ready when you are',            agents: ['Booking Agent', 'Upsell Agent'], kaf: 'Commit' },
];

export const ALL_AGENTS = ['Intent Agent', 'Requirements Agent', 'Context Agent', 'Inventory Agent', 'Recommendation Agent', 'Itinerary Agent', 'Pricing Agent', 'Proposal Agent', 'Booking Agent', 'Upsell Agent'];

export const AGENT_ICON: Record<string, string> = {
  'Intent Agent': 'chat-bot', 'Requirements Agent': 'document-chart', 'Context Agent': 'group',
  'Inventory Agent': 'analytics', 'Recommendation Agent': 'recommend', 'Itinerary Agent': 'network',
  'Pricing Agent': 'analytics', 'Proposal Agent': 'document-chart', 'Booking Agent': 'checkmark-filled', 'Upsell Agent': 'lightbulb',
};

export function twcFor(sc: any, stageIdx: number) {
  const rows: any[] = [];
  if (stageIdx >= 0) rows.push({ k: 'Request', v: sc.twc.request, kind: 'text' });
  if (stageIdx >= 1) rows.push({ k: 'Details', v: sc.twc.details, kind: 'tags' });
  if (stageIdx >= 2) rows.push({ k: 'About you', v: sc.twc.persona, kind: 'tags-warm' });
  if (stageIdx >= 3) rows.push({ k: 'Found', v: sc.twc.found, kind: 'text' });
  if (stageIdx >= 4) rows.push({ k: 'Composed', v: sc.twc.composed, kind: 'text' });
  if (stageIdx >= 5) rows.push({ k: 'Price', v: sc.twc.price, kind: 'text' });
  return rows;
}

export const SCENARIOS: Record<string, any> = {
  puglia: {
    id: 'puglia',
    query: 'Somewhere warm in October, relaxed, good food, not a long flight',
    brand: 'francorosso',
    twc: {
      request: 'Warm · October · relaxed · food-focused · short flight',
      details: ['7 nights', '2 travellers', 'flexible dates', '≤ €2,500pp'],
      persona: ['boutique stays', 'local food', 'slow travel'],
      found: '42 packages across Alpitour, Bravo & Francorosso',
      composed: 'Flight · masseria · car · food tour',
      price: '€2,180 pp · all in',
    },
    soldOut: null,
    result: {
      brand: 'francorosso', brandName: 'Francorosso', name: 'Puglia · 7 nights', sub: 'Masseria San Vito · 12–19 October', match: 94,
      why: [['Warm in October', '24°C average'], ['1h50 from Milan', 'direct · Neos'], ['Itria valley food region', 'orecchiette, burrata, primitivo'], ['Boutique masseria', 'matches your past trips']],
      segs: [['arrow-up-right', 'Flight · Neos', 'Milan MXP → Bari · direct'], ['dashboard', 'Masseria San Vito', '7 nights · breakfast · pool'], ['network', 'Hire car', '7 days · airport pick-up'], ['lightbulb', 'Food & wine day tour', 'Itria valley · small group']],
      price: 2180,
    },
  },
  sharm: {
    id: 'sharm',
    query: 'Family of 3 to Sharm in August, all inclusive, around €3,500 — hoping for Jaz Mirabel Beach',
    brand: 'bravo',
    twc: {
      request: 'Family · Sharm el-Sheikh · August · all inclusive · ~€3,500',
      details: ['2 adults + 1 child (2y)', '7 nights', 'all inclusive', 'from Rome'],
      persona: ['family-friendly', 'baby pool interest', 'beach'],
      found: 'Preferred hotel sold out → comparable alternatives ranked',
      composed: 'Flight · Coral Bay · private transfer',
      price: '€3,250 · family of 3',
    },
    soldOut: { at: 3, hotel: 'Jaz Mirabel Beach', line: 'Sold out for 12–19 August. This isn\'t a dead end — I ranked family villages with the baby pool you wanted.' },
    result: {
      brand: 'bravo', brandName: 'Bravo', name: 'Coral Bay Family Resort', sub: 'Sharm el-Sheikh · 12–19 August · all inclusive', match: 94,
      why: [['Baby pool + kids club', 'your detected preference'], ['Recovered from sold-out', 'closest family match'], ['Direct from Rome', 'Neos · seats confirmed'], ['Within budget', '€250 under your cap']],
      segs: [['arrow-up-right', 'Flight · Neos', 'Rome FCO → Sharm · direct'], ['dashboard', 'Coral Bay Family Resort', '7 nights · all inclusive · family room'], ['network', 'Private transfer', 'baby seat included'], ['lightbulb', "Kids club + baby pool", 'on site']],
      price: 3250,
    },
  },
  maldives: {
    id: 'maldives',
    query: 'Maldives over New Year, overwater villa, around €4,000 each',
    brand: 'alpitour',
    twc: {
      request: 'Maldives · New Year · overwater · ~€4,000pp',
      details: ['2 travellers', '7 nights', 'overwater villa', 'honeymoon'],
      persona: ['luxury', 'privacy', 'diving'],
      found: 'Turisanda & Alpitour premium inventory ranked',
      composed: 'Flight · overwater villa · seaplane · full board',
      price: '€3,980 pp',
    },
    soldOut: null,
    result: {
      brand: 'alpitour', brandName: 'Alpitour', name: "Maldives · Bravo Premium Alimatha'", sub: 'Vaavu Atoll · 27 Dec–3 Jan · full board', match: 91,
      why: [['Overwater villa', 'your must-have'], ['New Year availability', 'confirmed · last villas'], ['House reef diving', 'from your profile'], ['Seaplane transfer', 'included']],
      segs: [['arrow-up-right', 'Flight · Neos 787', 'Milan → Malé · direct'], ['dashboard', 'Overwater villa', '7 nights · full board'], ['network', 'Seaplane transfer', 'Malé → Vaavu Atoll'], ['lightbulb', 'Diving package', 'house reef · 5 dives']],
      price: 3980,
    },
  },
};
