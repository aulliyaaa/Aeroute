import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AeroRoute - Navigasi Bersih Berbasis AI',
  description: 'Smart clean-air routing tailored for sensitive respiratory profiles in urban environments.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AeroRoute',
  },
};

export const viewport: Viewport = {
  themeColor: '#F8FAF8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="bg-[#F8FAF8] text-[#192A24] antialiased">
      <head>
        <link rel="icon" href="/icons/logo.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-[#F8FAF8] text-[#192A24] selection:bg-[#245C49] selection:text-white">
        {children}
      </body>
    </html>
  );
}
