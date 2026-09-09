import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Weddora AI - AI Wedding Website Designer & Template Marketplace',
  description: 'Platform AI Wedding Invitation Builder premium. Buat website undangan pernikahan digital tanpa coding dengan bantuan kecerdasan buatan, musik, RSVP, dan fitur eksklusif.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Jost:ital,wght@0,300..800;1,300..800&family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400&family=MonteCarlo&family=Montserrat:ital,wght@0,300..800;1,300..800&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Raleway:ital,wght@0,300..800;1,300..800&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
