'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Download, Award, ShieldCheck, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CertificatesPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 selection:bg-[#3a081a] selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-48 md:pt-56 pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Our Certifications
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              At AMP Ceylon, we are committed to the highest standards of quality, ethical trading, and sustainability. Our globally recognized certifications reflect our dedication to fair labor practices and excellence in manufacturing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* SMETA Certificate Card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Award size={120} />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#f4e6ea] flex items-center justify-center text-[#3a081a]">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#3a081a]">SMETA Sedex</h2>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Ethical Trade Audit Report</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-600 mb-8 relative z-10">
                <p>
                  We are proudly certified under the <strong>Sedex Members Ethical Trade Audit (SMETA) Version 6.0</strong>. This rigorous audit ensures that our facilities adhere to the highest standards of labor rights, health and safety, environmental compliance, and business ethics.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-[#3a081a]" /> Audited by Intertek Lanka (Private) Limited
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-[#3a081a]" /> 100% compliant with Fair Labor Standards
                  </li>
                </ul>
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#3a081a] bg-[#faf9f8] px-4 py-2 rounded-full border border-gray-100">
                <Award size={16} /> Certified Facility
              </div>
            </motion.div>

            {/* Amfori BSCI Certificate Card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Award size={120} />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#f4e6ea] flex items-center justify-center text-[#3a081a]">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#3a081a]">Amfori BSCI</h2>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Audit Report 2024-2026</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-600 mb-8 relative z-10">
                <p>
                  Our operations are certified by the <strong>Business Social Compliance Initiative (BSCI)</strong>. This certification demonstrates our commitment to improving working conditions in the global supply chain, empowering workers, and driving sustainable trade.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-[#3a081a]" /> Valid through 2026
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-[#3a081a]" /> Global Supply Chain Excellence
                  </li>
                </ul>
              </div>

              <a 
                href="/AMFORI%20BSCI%20AUDIT%20REPORT%202024-2026.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold !text-white bg-[#3a081a] hover:bg-[#2a0512] transition-colors px-6 py-3 rounded-full relative z-10"
                style={{ color: '#ffffff' }}
              >
                <Download size={16} /> <span style={{ color: '#ffffff' }}>View Certificate (PDF)</span>
              </a>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
