import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://www.ampceylon.com'),
  title: {
    template: '%s | AMP Ceylon',
    default: 'AMP Ceylon | Premium Artificial Botanicals',
  },
  description: 'AMP Ceylon pioneers the art of hyper-realistic artificial botanicals, serving global supply chains with meticulous attention to detail and design.',
  openGraph: {
    title: 'AMP Ceylon | Premium Artificial Botanicals',
    description: 'AMP Ceylon pioneers the art of hyper-realistic artificial botanicals, serving global supply chains with meticulous attention to detail and design.',
    url: 'https://www.ampceylon.com',
    siteName: 'AMP Ceylon',
    images: [
      {
        url: '/3221.jpg', // Default OG image fallback
        width: 1200,
        height: 630,
        alt: 'AMP Ceylon Premium Botanicals',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMP Ceylon | Premium Artificial Botanicals',
    description: 'AMP Ceylon pioneers the art of hyper-realistic artificial botanicals.',
    images: ['/3221.jpg'],
  },
};

import { createClient } from '@supabase/supabase-js';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppButton from '@/components/WhatsAppButton';
import GlobalOffersManager from '@/components/GlobalOffersManager';
import SmoothScroll from '@/components/SmoothScroll';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let validOffers: any[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Fetch latest Campaign
    const { data: campaigns } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .eq('type', 'CAMPAIGN')
      .order('created_at', { ascending: false })
      .limit(1);
      
    // Fetch latest non-Campaign
    const { data: offers } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .neq('type', 'CAMPAIGN')
      .order('created_at', { ascending: false })
      .limit(1);

    if (campaigns && campaigns.length > 0) validOffers.push(campaigns[0]);
    if (offers && offers.length > 0) validOffers.push(offers[0]);

    // Sort so newest is first in array
    validOffers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  } catch (err) {
    console.error("Failed to load global offer", err);
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://vjilhfyiupdvtscmwxbt.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vjilhfyiupdvtscmwxbt.supabase.co" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} bg-floral-pattern`}>
        <SmoothScroll>
          {children}
          <GlobalOffersManager offers={validOffers} />
          <ScrollToTop />
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
