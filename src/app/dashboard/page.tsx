import React from 'react';
import Link from 'next/link';
import { cookies, headers } from 'next/headers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { db } from '@/lib/db';
import { getCleanName } from '@/utils/nameUtils';
import { getAppDomain } from '@/utils/domain';
import {
  Sparkles,
  Plus,
  Edit,
  Eye,
  Share2,
  Heart,
  Calendar,
  Users as UsersIcon,
  Crown,
  Palette,
} from 'lucide-react';

export const revalidate = 0;

export default async function DashboardPage() {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host');
  const appDomain = getAppDomain(host);

  const cookieStore = cookies();
  const sessionUserId = cookieStore.get('weddora_session')?.value;

  let user = null;
  if (sessionUserId) {
    user = await db.user.findUnique({
      where: { id: sessionUserId },
      include: {
        invitations: {
          include: {
            template: true,
            rsvps: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  if (!user) {
    user = await db.user.findFirst({
      where: { email: 'andi@example.com' },
      include: {
        invitations: {
          include: {
            template: true,
            rsvps: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Fallback to first user in DB if andi@example.com is missing
  if (!user) {
    user = await db.user.findFirst({
      include: {
        invitations: {
          include: {
            template: true,
            rsvps: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  const rawInvitations = user?.invitations || [];
  const maxInvitations = user?.maxInvitations || 5;

  // Resolve template and RSVP data synchronously for all invitations
  const invitations = await Promise.all(
    rawInvitations.map(async (inv) => {
      let template = inv.template;
      if (!template && inv.templateId) {
        template = (await db.template.findFirst({
          where: { OR: [{ id: inv.templateId }, { slug: inv.templateId }] },
        })) as any;
      }
      const rsvps = inv.rsvps || (await db.rsvp.findMany({ where: { invitationId: inv.id } }));
      return {
        ...inv,
        template,
        rsvps,
      };
    })
  );

  const totalRsvps = invitations.reduce((acc, inv) => acc + (inv.rsvps?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Demo Mode Notice Banner if role is DEMO */}
        {user?.role === 'DEMO' && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold block">✨ Mode Akun Demo / Uji Coba Aktif</span>
                <span>Anda sedang mengeksplorasi dashboard dalam mode demo. Anda dapat mencoba studio editor dan kustomisasi undangan secara leluasa.</span>
              </div>
            </div>
            <a
              href="https://wa.me/6282278765076?text=Halo%20Admin%20Weddora%20VIP,%0A%0ASaya%20telah%20mencoba%20studio%20editor%20Weddora%20dan%20tertarik%20untuk%20mengaktifkan%20akun%20resmi%20undangan%20pernikahan%20kami.%0A%0AMohon%20panduan%20proses%20aktivasi%20dan%20opsi%20paket%20VIP-nya.%20Terima%20kasih!%20%F0%9F%99%8F%F0%9F%92%8D%E2%9C%A8"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-extrabold text-[11px] shrink-0 shadow-md"
            >
              Aktivasi Akun Resmi &rarr;
            </a>
          </div>
        )}

        {/* Header Profile Banner with ScrollReveal */}
        <ScrollReveal direction="up" delay={100}>
          <div className="bg-gradient-to-r from-gold-500/10 via-amber-500/10 to-slate-100 dark:to-slate-900 p-8 rounded-3xl border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-400 text-xs font-bold border border-gold-500/30 uppercase">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Paket {user?.package || 'PREMIUM'} VIP</span>
                </div>
                {user?.role === 'DEMO' && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold border border-amber-500/40 uppercase">
                    <Sparkles className="w-3 h-3" />
                    <span>DEMO TRIAL</span>
                  </div>
                )}
                {(user?.role === 'USER' || user?.role === 'CLIENT') && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-500/40 uppercase">
                    <span>AKUN KLIEN RESMI</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">
                Selamat Datang, {user?.name || 'Client Pengantin'}!
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Kelola website undangan pernikahan Anda, pantau ucapan tamu, & bagikan tautan via WhatsApp.
              </p>
            </div>

            <Link
              href="/#templates"
              className="px-6 py-3.5 rounded-2xl gold-metallic-bg text-slate-950 font-extrabold text-xs shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Undangan Baru ({invitations.length}/{maxInvitations})</span>
            </Link>
          </div>
        </ScrollReveal>

        {/* Counter Grid with Staggered ScrollReveal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ScrollReveal direction="up" delay={150}>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Undangan Dibuat</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{invitations.length} / {maxInvitations}</span>
                <Heart className="w-6 h-6 text-gold-500" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={250}>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Ucapan & RSVP Masuk</span>
              <div className="text-3xl font-extrabold text-gold-600 dark:text-gold-400 flex items-center justify-between">
                <span>{totalRsvps} Ucapan</span>
                <UsersIcon className="w-6 h-6 text-gold-500" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={350}>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Status Kuota Paket</span>
              <div className="text-3xl font-extrabold text-emerald-500 flex items-center justify-between">
                <span>Aktif VIP</span>
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Invitations List with ScrollReveal */}
        <div className="space-y-4">
          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-playfair">Daftar Undangan Pernikahan Anda</h2>
          </ScrollReveal>

          {invitations.length === 0 ? (
            <ScrollReveal direction="zoom" delay={300}>
              <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <Heart className="w-10 h-10 text-gold-500 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Belum Ada Undangan Pernikahan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Pilih template favoritmu dan buat website undangan pernikahan mewah dalam beberapa detik.
                </p>
                <Link
                  href="/#templates"
                  className="inline-block px-5 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs"
                >
                  Pilih Template Sekarang
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invitations.map((inv, idx) => (
                <ScrollReveal key={inv.id} direction="up" delay={(idx % 2) * 150 + 200}>
                  <div
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-lg hover:border-gold-500 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gold-600 dark:text-gold-400 font-mono">{appDomain}/{inv.slug}</span>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">
                          ✓ Terpublikasi
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-playfair">
                        {getCleanName(inv.groomName)} & {getCleanName(inv.brideName)}
                      </h3>

                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        <div className="flex items-center gap-2">
                          <Palette className="w-3.5 h-3.5 text-purple-500" />
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            Template: {inv.template?.name || 'Luxury Gold Marble VIP'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gold-500" />
                          <span>
                            {new Date(inv.weddingDate).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersIcon className="w-3.5 h-3.5 text-gold-500" />
                          <span>{inv.rsvps?.length || 0} Konfirmasi & Doa Restu</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <Link
                        href={`/editor/${inv.slug}`}
                        className="px-3.5 py-2 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-gold-400 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Undangan
                      </Link>

                      <Link
                        href={`/${inv.slug}`}
                        target="_blank"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-gold-500 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5" /> Buka Web
                      </Link>

                      <Link
                        href={`/dashboard/share?slug=${inv.slug}`}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Sebar WA
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
