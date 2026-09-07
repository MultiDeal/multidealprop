import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.multidealprop.com'),
  title: {
    default: 'MultiDealProp | Multi-Family Underwriting Suite',
    template: '%s | MultiDealProp',
  },
  description:
    'Instant DSCR underwriting, real Cap Rate analysis, and institutional deal memos for 2-20 unit multi-family real estate investors.',
  keywords: [
    'multi-family underwriting',
    'DSCR calculator',
    'real estate investment software',
    'Cap Rate analyzer',
    'off-market multi family deals',
    'real estate lender memo'
  ],
  authors: [{ name: 'MultiDealProp' }],
  creator: 'MultiDealProp',
  publisher: 'MultiDealProp',
  alternates: {
    canonical: 'https://www.multidealprop.com',
  },
  openGraph: {
    title: 'MultiDealProp | Multi-Family Underwriting Suite',
    description:
      'Instant DSCR underwriting, real Cap Rate analysis, and institutional deal memos for 2-20 unit multi-family real estate investors.',
    url: 'https://www.multidealprop.com',
    siteName: 'MultiDealProp',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'MultiDealProp Underwriting Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MultiDealProp | Multi-Family Underwriting Suite',
    description:
      'Instant DSCR underwriting, real Cap Rate analysis, and institutional deal memos.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=630&q=80',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MultiDealProp',
    url: 'https://www.multidealprop.com',
    description:
      'Institutional underwriting platform for small multi-family properties and DSCR loan qualification.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-[#04060C] text-slate-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
