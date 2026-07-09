'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 overflow-x-hidden selection:bg-[#3a081a] selection:text-white">
      <Navbar />

      {/* Hero Section (Map Background) */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 border-b border-[#f4f2ee] overflow-hidden">
        {/* Abstract Map Background */}
        <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
          <Image 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop"
            alt="Map Background"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="text-[10px] font-bold text-[#8a385a] uppercase tracking-widest mb-4">
              Global HQ & Manufacturing
            </motion.p>
            <motion.h1 
              variants={fadeUp} 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#3a081a]" 
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Connecting Excellence Across Borders.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-600 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              Our state-of-the-art facility in Export City is the heart of our global floral operations. Reach out to discuss wholesale opportunities and custom manufacturing.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="flex flex-col sm:flex-row gap-8">
              <motion.div variants={fadeUp} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f4e6ea] flex items-center justify-center shrink-0 text-[#3a081a]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Address</h4>
                  <p className="text-sm font-semibold text-[#3a081a]">INDUSTRY ZONE B, EXPORT CITY</p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeUp} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f4e6ea] flex items-center justify-center shrink-0 text-[#3a081a]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Email</h4>
                  <p className="text-sm font-semibold text-[#3a081a]">WHOLESALE@AMP-FLORA.COM</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Action Block */}
      <section className="py-24 px-6 bg-[#f4f2ee]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Business Inquiry */}
            <motion.div 
              className="w-full lg:w-7/12 bg-white rounded-xl p-10 md:p-14 shadow-sm border border-gray-100 flex flex-col justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h2 className="text-2xl font-bold mb-4 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Business Inquiry
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-md">
                Looking to stock our premium artificial florals or require custom manufacturing for a specific project? Browse our extensive catalog and inquire directly on the products that interest you. Our sales team will get back to you with wholesale pricing and MOQs.
              </p>
              
              <div>
                <Link href="/collections" className="inline-block bg-[#3a081a] !text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded hover:bg-[#250510] transition-colors shadow-lg shadow-[#3a081a]/20">
                  Browse Catalog
                </Link>
              </div>
            </motion.div>

            {/* Right: Map & Partnership */}
            <motion.div 
              className="w-full lg:w-5/12 flex flex-col gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Factory Map */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-4 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Factory Location
                </h3>
                <p className="text-gray-600 text-xs mb-6 leading-relaxed">
                  Our state-of-the-art manufacturing facility is strategically located to ensure rapid global distribution and optimized logistics.
                </p>
                
                {/* Embedded Map / Image */}
                <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden relative mt-auto">
                  <Image 
                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=800&auto=format&fit=crop"
                    alt="Factory Location Map"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#3a081a] text-white flex items-center justify-center shadow-xl animate-bounce">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Partnership */}
              <div className="bg-[#3a081a] rounded-xl p-8 text-white shadow-xl">
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Export Partnership
                </h3>
                <p className="text-white/80 text-xs leading-relaxed mb-6">
                  Looking to become an official distributor of AMP premium botanicals? We offer competitive pricing for volume partners.
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-[#f4e6ea] transition-colors border-b border-white/30 pb-1">
                  View Partner Terms
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Global Sales Team */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
              Meet Our Experts
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl mb-4 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Global Sales Team
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-600 text-sm">
              Connect with our dedicated regional managers to discuss market-specific floral solutions and logistical support.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Team Member 1 */}
            <motion.div variants={fadeUp} className="group">
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-5">
                <Image 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" 
                  alt="Jillian Vane" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">North America</p>
              <h4 className="text-lg font-bold text-[#3a081a] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Jillian Vane</h4>
              <p className="text-xs text-gray-500">jillian.v@amp-flora.com</p>
            </motion.div>

            {/* Team Member 2 */}
            <motion.div variants={fadeUp} className="group">
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-5">
                <Image 
                  src="/images/floral_gift_decoration.png" 
                  alt="Elena Rossi" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Europe & UK</p>
              <h4 className="text-lg font-bold text-[#3a081a] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Elena Rossi</h4>
              <p className="text-xs text-gray-500">elena.r@amp-flora.com</p>
            </motion.div>

            {/* Team Member 3 */}
            <motion.div variants={fadeUp} className="group">
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-5">
                <Image 
                  src="https://images.unsplash.com/photo-1598550874175-4d0ef436c909?q=80&w=600&auto=format&fit=crop" 
                  alt="Chen Wei" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Asia Pacific</p>
              <h4 className="text-lg font-bold text-[#3a081a] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Chen Wei</h4>
              <p className="text-xs text-gray-500">chen.w@amp-flora.com</p>
            </motion.div>

            {/* Team Member 4 */}
            <motion.div variants={fadeUp} className="group">
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-5">
                <Image 
                  src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop" 
                  alt="Amira Al-Fayed" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Middle East</p>
              <h4 className="text-lg font-bold text-[#3a081a] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Amira Al-Fayed</h4>
              <p className="text-xs text-gray-500">amira.a@amp-flora.com</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
