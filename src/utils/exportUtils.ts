/**
 * Export Utilities for Guest List, RSVPs, and Digital Gift Envelopes
 * Supports UTF-8 BOM for seamless Microsoft Excel compatibility
 */

export interface ExportRsvpItem {
  id: string;
  guestName: string;
  phone?: string | null;
  status: 'ATTENDING' | 'DECLINED' | 'MAYBE' | string;
  guestCount: number;
  message?: string | null;
  createdAt: string | Date;
}

export interface ExportGiftItem {
  id: string;
  senderName: string;
  bankName: string;
  accountNumber?: string;
  amount?: string | number;
  message?: string;
  date: string | Date;
}

/**
 * Downloads a CSV file with UTF-8 BOM for Microsoft Excel compatibility
 */
export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  // Add UTF-8 BOM (\uFEFF) so Microsoft Excel opens special characters correctly
  let csvContent = '\uFEFF';
  
  // Format headers
  csvContent += headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';
  
  // Format rows
  rows.forEach((row) => {
    const rowStr = row.map((cell) => {
      const cellStr = cell !== undefined && cell !== null ? String(cell) : '';
      return `"${cellStr.replace(/"/g, '""')}"`;
    }).join(',');
    csvContent += rowStr + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export RSVP list to CSV
 */
export function exportRsvpsToCSV(rsvps: ExportRsvpItem[], invitationTitle: string = 'Undangan') {
  const headers = ['No', 'Nama Tamu', 'No WhatsApp', 'Status Kehadiran', 'Jumlah Tamu', 'Pesan / Doa Ucapan', 'Waktu Konfirmasi'];
  const rows = rsvps.map((r, index) => [
    index + 1,
    r.guestName || '-',
    r.phone || '-',
    r.status === 'ATTENDING' ? 'Hadir' : r.status === 'DECLINED' ? 'Tidak Hadir' : 'Masih Ragu',
    r.guestCount || 1,
    r.message || '-',
    new Date(r.createdAt).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  ]);

  const sanitizeTitle = invitationTitle.replace(/[^a-zA-Z0-9]+/g, '_');
  downloadCSV(`Rekap_RSVP_${sanitizeTitle}.csv`, headers, rows);
}

/**
 * Export Digital Gift list to CSV
 */
export function exportGiftsToCSV(gifts: ExportGiftItem[], invitationTitle: string = 'Undangan') {
  const headers = ['No', 'Nama Pengirim', 'Bank / E-Wallet', 'Nominal / Hadiah', 'Pesan Ucapan', 'Tanggal'];
  const rows = gifts.map((g, index) => [
    index + 1,
    g.senderName || '-',
    g.bankName || '-',
    g.amount ? `Rp ${Number(g.amount).toLocaleString('id-ID')}` : 'Hadiah / Cash Gift',
    g.message || '-',
    new Date(g.date).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  ]);

  const sanitizeTitle = invitationTitle.replace(/[^a-zA-Z0-9]+/g, '_');
  downloadCSV(`Rekap_Amplop_Digital_${sanitizeTitle}.csv`, headers, rows);
}

/**
 * Triggers Browser Print Dialog for PDF generation
 */
export function printPDFReport() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}

/**
 * Downloads a sample CSV template for guest import
 */
export function downloadGuestTemplateCSV() {
  const headers = ['Nama Tamu', 'No WhatsApp'];
  const rows = [
    ['Bapak H. Budi & Keluarga', '081234567890'],
    ['Dr. Andi Pratama & Istri', '081987654321'],
    ['Keluarga Besar Alm. Ahmad', ''],
    ['Sahabat SMA / Rian & Partner', '085211223344'],
  ];
  downloadCSV('Template_Daftar_Tamu_Undangan.csv', headers, rows);
}
