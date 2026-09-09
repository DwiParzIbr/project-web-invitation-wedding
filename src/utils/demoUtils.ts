/**
 * Utility for rotating and randomizing demo templates across the platform.
 */

export const DEMO_TEMPLATE_SLUGS: string[] = [
  'luxury-gold-marble',
  'pink-botanical-arch',
  'garden-glasshouse',
  'classic-java-bronze',
  'javanese-royal-kraton',
  'sapphire-midnight-stars',
  'golden-palace-baroque',
  'minang-rumah-gadang-luxury',
  'emerald-forest-botanical',
  'islamic-crescent-gold',
  'rose-crimson-romance',
  'minimal-monochrome-black',
  'cinema-premiere-noir',
  'vintage-scrapbook-memories',
  'grand-vernissage-art',
  'love-island-miniworld',
  'celestial-radial-hub',
  'metro-love-express',
];

/**
 * Returns a random demo URL from available templates,
 * ensuring it rotates to a different template than the previously viewed one.
 */
export function getRandomDemoUrl(excludeSlug?: string): string {
  let lastSlug = excludeSlug;
  if (!lastSlug && typeof window !== 'undefined') {
    try {
      lastSlug = sessionStorage.getItem('weddora_last_demo_slug') || undefined;
    } catch {}
  }

  // Filter out the last viewed slug to prevent immediate repetition
  const pool = DEMO_TEMPLATE_SLUGS.filter((slug) => slug !== lastSlug);
  const selectedPool = pool.length > 0 ? pool : DEMO_TEMPLATE_SLUGS;

  const randomIndex = Math.floor(Math.random() * selectedPool.length);
  const pickedSlug = selectedPool[randomIndex];

  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('weddora_last_demo_slug', pickedSlug);
    } catch {}
  }

  return `/demo/${pickedSlug}`;
}
