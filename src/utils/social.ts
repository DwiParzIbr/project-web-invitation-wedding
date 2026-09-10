/**
 * Weddora VIP Social & Contact URL Helpers
 */

export function formatInstagramUrl(input?: string): string {
  if (!input || !input.trim()) return 'https://instagram.com/weddora.id';
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const username = trimmed.replace(/^@/, '');
  return `https://instagram.com/${username}`;
}

export function formatTiktokUrl(input?: string): string {
  if (!input || !input.trim()) return 'https://tiktok.com/@weddora.id';
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
  return `https://tiktok.com/${handle}`;
}

export function formatWhatsappUrl(phone?: string, customText?: string): string {
  const defaultText =
    'Halo Admin Weddora VIP, saya ingin berkonsultasi mengenai pembuatan dan aktivasi undangan pernikahan digital. Terima kasih! 🙏✨';
  const text = encodeURIComponent(customText || defaultText);
  let cleanPhone = (phone || '6282278765076').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

export function formatMailUrl(email?: string): string {
  const cleanEmail = (email || 'weddorawebsite@gmail.com').trim();
  return `mailto:${cleanEmail}`;
}
