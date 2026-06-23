/* ============================================================
   AlpiGPT B2B Concierge — mock data
   Migrated from alpitour/concierge/data.js
   ============================================================ */

export const agency = {
  id: 'agency_rossi_travel',
  name: 'Rossi Travel',
  tier: 'Gold Partner',
  commissionRate: 12,
  preferredBrands: ['Francorosso', 'Alpitour'],
  channel: 'EasyBook',
};

export const customer = {
  type: 'family',
  adults: 2,
  children: 1,
  childAges: [2],
};

export const requirements = {
  destination: 'Egypt · Sharm el-Sheikh',
  departureCity: 'Rome (FCO)',
  dates: '12–19 August',
  durationNights: 7,
  budget: 3500,
  boardBasis: 'All inclusive',
  preferredHotel: 'Jaz Mirabel Beach',
};

export const hotels: Record<string, any> = {
  jaz: {
    id: 'jaz', name: 'Jaz Mirabel Beach', destination: 'Sharm el-Sheikh', brand: 'Alpitour',
    availability: 'sold_out', price: null,
    amenities: ['Baby pool', 'Kids club', 'Family rooms', 'Beach access'],
    tags: ['family-friendly', 'all-inclusive', 'beach'],
  },
  coral: {
    id: 'coral', name: 'Coral Bay Family Resort', destination: 'Sharm el-Sheikh', brand: 'Alpitour',
    availability: 'available', price: 3250, matchScore: 94,
    rank: 'Best match',
    amenities: ['Baby pool', 'Kids club', 'Family rooms', 'Airport transfer', 'Beach access'],
    hi: ['Baby pool', 'Kids club'],
    why: 'Closest match to the original request, with the baby-friendly amenities you asked about.',
  },
  redsea: {
    id: 'redsea', name: 'Red Sea Palm Village', destination: 'Sharm el-Sheikh', brand: 'Francorosso',
    availability: 'available', price: 3100, matchScore: 88,
    rank: 'Best value',
    amenities: ['Kids club', 'Family rooms', 'Large pool', 'Beach access'],
    hi: ['Kids club'],
    why: 'Lower price with strong family facilities — €400 under budget.',
  },
  sinai: {
    id: 'sinai', name: 'Sinai Blue Lagoon Resort', destination: 'Sharm el-Sheikh', brand: 'Alpitour',
    availability: 'available', price: 3580, matchScore: 91,
    rank: 'Premium upgrade',
    amenities: ['Baby pool', 'Water park nearby', 'Premium family suite', 'Private transfer'],
    hi: ['Baby pool', 'Water park nearby'],
    why: 'Slightly above budget but the strongest family experience — flagged by the Upsell Agent.',
  },
};

export const flight = {
  route: 'Rome Fiumicino → Sharm el-Sheikh',
  carrier: 'Neos', code: 'NO 7714 / NO 7715',
  dates: '12–19 August', seats: true,
};

export const addOns = [
  { id: 'insurance', name: 'Family travel insurance', price: 95, why: 'Travelling with a 2-year-old' },
  { id: 'transfer', name: 'Private airport transfer', price: 120, why: 'Baby seat included' },
  { id: 'waterpark', name: 'Water park day pass', price: 160, why: 'Family activity' },
  { id: 'upgrade', name: 'Room upgrade near pool area', price: 280, why: 'Close to the baby pool' },
];

export const policies = {
  holdHours: 24,
  notes: ['Date change allowed before confirmation', 'Price may update after date or hotel changes', 'Commission applied per agency tier (Gold · 12%)'],
};

export const KAF = {
  discover: { phase: 'Discover', comp: 'OrchestrationService' },
  plan: { phase: 'Plan', comp: 'GraphService (DAG)' },
  validate: { phase: 'Validate', comp: 'AgentService + OPA MCP' },
  commit: { phase: 'Commit', comp: 'booking-platform-mcp' },
};

export const fmtEUR = (n: number) => '€' + n.toLocaleString('en-IE');
