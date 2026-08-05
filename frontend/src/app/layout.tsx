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
  title: "AMP Ceylon - Artificial Florals & Gifts",
  description: "Global Bloom operates state-of-the-art facilities perfecting the art of botanical mimicry.",
};

import { createClient } from '@/utils/supabase/server';
import GlobalOffer from '@/components/GlobalOffer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppButton from '@/components/WhatsAppButton';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let activeOffer = null;
  try {
    const supabase = await createClient();
    const { data: offers } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'Active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (offers && offers.length > 0) {
      activeOffer = offers[0];
    }
  } catch (err) {
    console.error("Failed to load global offer", err);
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
        {activeOffer && <GlobalOffer offer={activeOffer} />}
        <ScrollToTop />
        <WhatsAppButton />
      </body>
    </html>
  );
}
