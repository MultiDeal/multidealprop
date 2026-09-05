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
    'off market deals'
  ],
  authors: [{ name: 'MultiDealProp' }],
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen flex flex-col justify-between">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
