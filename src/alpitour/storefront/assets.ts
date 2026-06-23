/* ============================================================
   EasyBook Next — B2B Storefront · image asset registry
   All image paths are root-relative URLs (served as static files).
   The assets/ directory lives at the project root and is served
   directly by the dev server and production host.
   ============================================================ */

/* ---- brand logos ---- */
export const brandLogos: Record<string, string | null> = {
  alpitour:    'assets/alpitour-logo.png',
  francorosso: 'assets/francorosso-logo.png',
  bravo:       'assets/bravo-logo.png',
  eden:        null,                          // eden-logo.png not yet in assets
  turisanda:   'assets/turisanda-logo.png',
};

/* ---- Alpitour World master logo (header) ---- */
export const alpitourWorldLogo = 'assets/alpitour-world.png';

/* ---- partner / platform logos ---- */
export const partnerLogos = {
  kyndryl: 'assets/kyndryl-logo.png',
  dow:     'assets/dow-logo.png',
  engage:  'assets/engage-logo.png',
  infuse:  'assets/infuse-logo.png',
  affinity:'assets/affinity-logo.png',
};

/* ---- icon sprite (Kyndryl DS) ---- */
export const iconSprite = 'assets/ds/icons/sprite.svg';

/* ---- synthetic persona photos ---- */
export const personaPhotos: Record<string, string> = {
  francesco: 'alpitour/storefront/personas/francesco-ciuccarelli.png',
  fabio:     'alpitour/storefront/personas/fabio-olgiati.png',
  giuseppe:  'alpitour/storefront/personas/giuseppe-parello.png',
};

/* ---- Kyndryl Vital logo (used in persona cohort) ---- */
export const kyndrylVitalLogo = 'alpitour/storefront/personas/kyndryl-vital-logo.png';

/* ---- Dow sample / product images ---- */
export const dowSamples = {
  dashboard: 'dow/samples/img-dashboard.png',
  defect:    'dow/samples/img-defect.png',
  label:     'dow/samples/img-label.png',
  plant:     'dow/samples/img-plant.png',
};
