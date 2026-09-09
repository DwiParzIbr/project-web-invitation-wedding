import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { DEMO_TEMPLATE_SLUGS } from '@/utils/demoUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DemoIndexPage() {
  let availableSlugs = DEMO_TEMPLATE_SLUGS;

  try {
    const templates = await db.template.findMany({
      select: { slug: true },
    });
    if (templates && templates.length > 0) {
      availableSlugs = templates.map((t) => t.slug);
    }
  } catch (err) {
    console.error('Error fetching templates for demo redirect:', err);
  }

  const randomIndex = Math.floor(Math.random() * availableSlugs.length);
  const randomSlug = availableSlugs[randomIndex] || 'luxury-gold-marble';

  redirect(`/demo/${randomSlug}`);
}
