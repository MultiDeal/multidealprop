import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://multidealprop.com'),
  title: 'MultiDealProp | Multi-Family Real Estate Underwriting & DSCR Memo Generator',
  description: 'Instant DSCR underwriting, Cap Rate analysis, and bank-ready lender diligence memos for 2 to 20-unit multi-family properties.',
  keywords: [
    'real estate underwriting',
    'DSCR calculator',
    'lender deal memo',
    'multifamily cash flow',
    'cap rate calculator',
    'commercial loan underwriting',
    'off market multifamily deals',
    'real estate pro forma generator'
  ],
  authors: [{ name: 'MultiDealProp' }],
  alternates: {
    canonical: 'https://multidealprop.com',
  },
  openGraph: {
  ...
  images: [
    {
      url: 'https://multidealprop.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'MultiDealProp Underwriting Suite',
    },
  ],
},
  openGraph: {
    title: 'MultiDealProp | Multi-Family Underwriting Suite',
    description: 'Instant debt underwriting, DSCR validation, and 1-click lender memo generation.',
    url: 'https://multidealprop.com',
    siteName: 'MultiDealProp',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MultiDealProp | Multi-Family Underwriting Suite',
    description: 'Instant quantitative debt underwriting & bank-ready deal memos.',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      'name': 'MultiDealProp Underwriting Suite',
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Web, All',
      'url': 'https://multidealprop.com',
      'description': 'Real estate quantitative debt underwriting engine for 2 to 20-unit multi-family properties. Generates institutional lender diligence memorandums, DSCR analyses, and IRS 27.5-year tax reports.',
      'offers': {
        '@type': 'Offer',
        'price': '9.99',
        'priceCurrency': 'USD',
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'reviewCount': '38',
      },
    },
    {
      '@type': 'Organization',
      'name': 'MultiDealProp',
      'url': 'https://multidealprop.com',
      'logo': 'https://multidealprop.com/badge-underwritten.svg',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen flex flex-col justify-between antialiased">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
