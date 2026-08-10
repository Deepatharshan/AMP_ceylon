'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone, MessageCircle, Briefcase, Globe2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WorldMap } from '@/components/ui/map';

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

const mapDots = [
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 30.3753, lng: 69.3451, label: "Pakistan" } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 36.2048, lng: 138.2529, label: "Japan" } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 46.8182, lng: 8.2275, label: "Switzerland", labelOffset: { x: -15, y: -20 } } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 25.2048, lng: 55.2708, label: "Dubai" } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 51.1657, lng: 10.4515, label: "Germany", labelOffset: { x: 20, y: -25 } } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 51.5074, lng: -0.1278, label: "London", labelOffset: { x: -30, y: -20 } } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 20.5937, lng: 78.9629, label: "India" } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: -25.2744, lng: 133.7751, label: "Australia" } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 41.8719, lng: 12.5674, label: "Italy", labelOffset: { x: 25, y: 5 } } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 39.3999, lng: -8.2245, label: "Portugal", labelOffset: { x: -25, y: 10 } } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 35.9078, lng: 127.7669, label: "Korea" } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 61.5240, lng: 105.3188, label: "Russia" } },
  { start: { lat: 7.8731, lng: 80.7718, label: "Sri Lanka" }, end: { lat: 37.0902, lng: -95.7129, label: "USA" } },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 overflow-x-hidden selection:bg-[#3a081a] selection:text-white">
      <Navbar />

      {/* Hero Section (Map Background) */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-16 px-6 border-b border-[#f4f2ee] overflow-hidden bg-white">
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center flex flex-col items-center">
          <motion.div 
            className="max-w-3xl"
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
              Connecting Excellence Across Borders
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
              Our state-of-the-art facility in Export City is the heart of our global floral operations. Reach out to discuss wholesale opportunities and custom manufacturing.
            </motion.p>
          </motion.div>
        </div>

        {/* Abstract Map Animation */}
        <div className="w-full max-w-6xl mx-auto relative z-0 mt-4 opacity-90">
          <WorldMap dots={mapDots} lineColor="#8a385a" showLabels={true} />
        </div>

        {/* Global Destinations */}
        <div className="w-full max-w-6xl mx-auto relative z-10 mt-12 pb-8">
          <motion.div 
            className="text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="text-[10px] font-bold text-[#8a385a] uppercase tracking-widest mb-2">
              Global Reach
            </motion.p>
            <motion.h3 variants={fadeUp} className="text-2xl text-[#3a081a] font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              Where We Export Our Products
            </motion.h3>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-3 md:gap-4 px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              "Australia", "Dubai", "Germany", "India", "Italy", "Japan", 
              "Korea", "London", "Pakistan", "Portugal", "Russia", "Switzerland", "USA"
            ].map((country) => (
              <motion.div
                key={country}
                variants={fadeUp}
                className="px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-all hover:-translate-y-1 cursor-default group"
              >
                <div className="w-2 h-2 rounded-full bg-[#8a385a] group-hover:scale-150 transition-transform"></div>
                <span className="text-sm font-semibold text-gray-700 tracking-wide">{country}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Action Block */}
      <section className="py-24 px-6 bg-[#f4f2ee]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Business Inquiry */}
            <motion.div 
              className="w-full lg:w-7/12 bg-white rounded-2xl p-10 md:p-14 shadow-sm hover:shadow-xl transition-shadow duration-500 border border-gray-100 flex flex-col justify-center relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="absolute -right-10 -top-10 text-[#f4e6ea]/30 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                <Briefcase size={200} strokeWidth={1} />
              </div>
              
              <div className="w-16 h-16 rounded-full bg-[#f4e6ea] text-[#3a081a] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Briefcase size={28} />
              </div>

              <h2 className="text-3xl font-bold mb-6 text-[#3a081a] relative z-10" style={{ fontFamily: 'var(--font-playfair)' }}>
                Business Inquiry
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-10 max-w-lg relative z-10">
                Looking to stock our premium artificial florals or require custom manufacturing for a specific project? Browse our extensive catalog and inquire directly on the products that interest you. Our sales team will get back to you with wholesale pricing and MOQs.
              </p>
              
              <div className="relative z-10">
                <Link href="/collections" className="inline-flex items-center gap-3 bg-[#3a081a] !text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-[#250510] transition-colors shadow-lg shadow-[#3a081a]/20 group/btn">
                  Browse Catalog
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
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
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-500 border border-gray-100 flex-1 flex flex-col group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#3a081a] group-hover:bg-[#f4e6ea] transition-colors">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Factory Location
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Our state-of-the-art manufacturing facility is strategically located to ensure rapid global distribution.
                </p>
                
                {/* Embedded Map */}
                <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden relative mt-auto border border-gray-100 group-hover:shadow-md transition-shadow">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.0203534570076!2d79.88219467576579!3d7.123565092881263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f200508a8d05%3A0x67fa2a8dbadbb0fa!2sKatunayake%20Export%20Processing%20Zone!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="opacity-90 group-hover:opacity-100 transition-opacity duration-500 filter grayscale group-hover:grayscale-0"
                  ></iframe>
                </div>
              </div>

              {/* Export Partnership */}
              <div className="bg-[#3a081a] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 text-white/5 transition-transform duration-700 group-hover:scale-125 pointer-events-none">
                  <Globe2 size={120} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-bold mb-3 relative z-10" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Export Partnership
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-8 relative z-10">
                  Looking to become an official distributor of AMP premium botanicals? We offer competitive pricing for volume partners.
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f4e6ea] hover:text-white transition-colors relative z-10 group/link">
                  View Partner Terms
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Direct Contact & Branches */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="text-[10px] font-bold text-[#8a385a] uppercase tracking-widest mb-3">
              Get in Touch
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl mb-4 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Direct Contact & Branches
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-600 text-sm">
              Connect with us instantly through our social channels or visit our regional branches.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Details */}
            <motion.div 
              className="bg-[#faf9f8] p-10 rounded-xl border border-[#f4f2ee] shadow-sm flex flex-col justify-center"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-8 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Reach Us Digitally
              </h3>
              
              <div className="flex flex-col gap-6">
                <a href="mailto:udeshjv.ampsl@gmail.com" className="flex items-center gap-4 text-gray-700 hover:text-[#8a385a] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Mail size={18} className="text-[#3a081a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Email</p>
                    <p className="text-sm font-semibold">udeshjv.ampsl@gmail.com</p>
                  </div>
                </a>
                
                <a href="tel:+94112251026" className="flex items-center gap-4 text-gray-700 hover:text-[#8a385a] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={18} className="text-[#3a081a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Phone</p>
                    <p className="text-sm font-semibold">+94-11-2251026, +94-77-767-6336</p>
                  </div>
                </a>

                <a href="https://www.ampceylon.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-700 hover:text-[#8a385a] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Globe size={18} className="text-[#3a081a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Website</p>
                    <p className="text-sm font-semibold">www.ampceylon.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-6 mt-4 pt-6 border-t border-gray-200">
                  <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-[#1877F2] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">AMP Ceylon flower Arrangements</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-[#E4405F] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                    <span className="text-sm font-semibold">@amp.ceylon</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Branches */}
            <motion.div 
              className="bg-[#3a081a] p-10 rounded-xl text-white shadow-xl flex flex-col justify-center relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <MapPin size={120} />
              </div>
              
              <h3 className="text-xl font-bold mb-8 relative z-10" style={{ fontFamily: 'var(--font-playfair)' }}>
                Our Facilities
              </h3>
              
              <div className="flex flex-col gap-8 relative z-10">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <MapPin size={20} className="text-[#f4e6ea]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold mb-2 tracking-wide text-[#f4e6ea]">Head Office & Factory</h4>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Ring Road 3, Phase 2, Export Processing Zone,<br />
                      Katunayake, Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-white/10"></div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <MapPin size={20} className="text-[#f4e6ea]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold mb-2 tracking-wide text-[#f4e6ea]">AMP Ceylon Lebanon Factory</h4>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Thawalanthenna, Waththeyama
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
