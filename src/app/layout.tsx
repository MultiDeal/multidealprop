import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MultiDealProp | US Real Estate Radar',
  description: 'Under-market plexes, land, and high-yield properties across the US.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
