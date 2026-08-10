'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Ship, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';

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

export default function RegionClientPage({ regionName }: { regionName: string }) {
  return (
    <main className="min-h-screen bg-[#faf9f8] text-[#333]">
      <div className="bg-transparent w-full relative z-20" style={{ height: 'calc(5rem + var(--banner-height, 0px))' }}>
        <Navbar />
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24 max-w-6xl">
        <motion.div 
          className="max-w-3xl mb-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p variants={fadeUp} className="text-[#8a385a] text-xs font-bold uppercase tracking-widest mb-4">
            Global Export Markets
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl text-[#3a081a] font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Premium Artificial Botanicals Exporter for {regionName}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed text-lg mb-8">
            As a global leader in hyper-realistic artificial floral manufacturing, AMP Ceylon is the trusted wholesale supplier for interior designers, luxury retailers, and commercial supply chains across {regionName}. We specialize in bespoke, hand-crafted botanical arrangements designed to meet exacting international standards.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/contact" className="inline-flex items-center justify-center bg-[#3a081a] text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#8a385a] transition-colors rounded-sm shadow-md group">
              Discuss Bulk Import Options
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Value Proposition Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#f4f2ee] rounded-full flex items-center justify-center text-[#3a081a] mb-6">
              <Ship size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#3a081a] mb-4">Optimized Shipping to {regionName}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We manufacture our own custom corrugated carton boxes to maximize volumetric efficiency and protect delicate botanical components during ocean or air freight to {regionName}.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#f4f2ee] rounded-full flex items-center justify-center text-[#3a081a] mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#3a081a] mb-4">Ethical Manufacturing</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Located in Sri Lanka's Export Processing Zone, our facility operates under strict ethical labor practices and sustainable production methodologies.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#f4f2ee] rounded-full flex items-center justify-center text-[#3a081a] mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-xl font-bold text-[#3a081a] mb-4">Wholesale Economics</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              By controlling the entire manufacturing pipeline from design to molding, we offer highly competitive wholesale pricing without compromising on hyper-realistic quality.
            </p>
          </motion.div>
        </motion.div>

      </div>

      <CTA />
      <Footer />
    </main>
  );
}
