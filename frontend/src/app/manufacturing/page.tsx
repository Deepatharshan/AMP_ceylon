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
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function ManufacturingPage() {
  return (
    <div className="bg-[#fcfbf9] min-h-screen text-[#3a081a]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="https://images.unsplash.com/photo-1563241598-646bc5683794?q=80&w=2000&auto=format&fit=crop"
            alt="Manufacturing Facility Background"
            fill
            className="object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 container mx-auto max-w-5xl">
          <motion.p 
            variants={fadeUp} 
            initial="hidden" 
            animate="visible"
            className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-6"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Our Facility & Process
          </motion.p>
          <motion.h1 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl text-white leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            25,000+ m² of Industrial <br /> Excellence
          </motion.h1>
        </div>
      </section>

      {/* Chapter 1: Artisanal Craftsmanship */}
      <section className="py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Text Content */}
            <motion.div 
              className="lg:w-1/2 space-y-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div>
                <motion.p variants={fadeUp} className="text-[#3a081a] text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                  Chapter I
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Artisanal Craftsmanship
                </motion.h2>
              </div>
              
              <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed text-sm md:text-base">
                At the heart of our facility, master artisans preserve the legacy of floral design. Every petal of our hand-painted silk undergoes a rigorous bothen-dyeing process to achieve nature's true gradient.
              </motion.p>

              <motion.ul variants={staggerContainer} className="space-y-4 pt-4">
                {[
                  "Proprietary Custom Dyeing Systems",
                  "Eco-Friendly Hand-Painted Silk Components",
                  "Meticulous Hand-Assembly Quality Control"
                ].map((item, idx) => (
                  <motion.li key={idx} variants={fadeUp} className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3a081a]"></span>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Image Grid */}
            <div className="lg:w-1/2 flex gap-4 md:gap-8 h-[500px]">
              <motion.div 
                className="w-1/2 h-[90%] relative mt-auto rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Image 
                  src="/images/artisan_arranging_flowers.jpg" 
                  alt="Artisan arranging floral components" 
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div 
                className="w-1/2 h-[90%] relative mb-auto rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Image 
                  src="/images/meticulous_floral_assembly.jpg" 
                  alt="Meticulous assembly process" 
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section className="bg-[#3a081a] text-white py-16 px-6 relative z-10 -mt-16 mx-6 rounded-2xl shadow-2xl mb-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="text-3xl md:text-5xl font-bold mb-2 text-[#f4e6ea]">25,000+</h3>
              <p className="text-xs md:text-sm text-white/70 uppercase tracking-widest font-semibold">Sq. Meters Space</p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <h3 className="text-3xl md:text-5xl font-bold mb-2 text-[#f4e6ea]">100</h3>
              <p className="text-xs md:text-sm text-white/70 uppercase tracking-widest font-semibold">TEU's Yearly Capacity</p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h3 className="text-3xl md:text-5xl font-bold mb-2 text-[#f4e6ea]">5,000+</h3>
              <p className="text-xs md:text-sm text-white/70 uppercase tracking-widest font-semibold">SKU Collection</p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <h3 className="text-3xl md:text-5xl font-bold mb-2 text-[#f4e6ea]">100%</h3>
              <p className="text-xs md:text-sm text-white/70 uppercase tracking-widest font-semibold">Exclusive Designs</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Production Capabilities */}
      <section className="py-24 bg-[#f4f2ee] px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Scalable Production Capabilities
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-600 text-sm">
              Engineered for global supply chains, our facility balances volume with precision.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Packing */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-1 w-full">
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Packing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Automated and manual bespoke packaging ensuring global transit safety and pristine unboxing experiences. We can also provide mail order packing at an additional cost.
                </p>
              </div>
              <div className="w-full sm:w-40 h-28 relative rounded-lg overflow-hidden shrink-0">
                <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>

            {/* Card 2: Designing Products */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-1 w-full">
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Designing Products</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We have in-house professional designers and accept customer designs. Our exclusive designs are protected by copyright, and we renew our collection yearly with new designs.
                </p>
              </div>
              <div className="w-full sm:w-40 h-28 relative rounded-lg overflow-hidden shrink-0">
                <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>

            {/* Card 3: Heating */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-1 w-full">
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Heating & Molding</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Precision thermal molding processes that permanently set the lifelike curves and textures of our petals.
                </p>
              </div>
              <div className="w-full sm:w-40 h-28 relative rounded-lg overflow-hidden shrink-0">
                <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>

            {/* Card 4: Dyeing */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-1 w-full">
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Dyeing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Proprietary custom dyeing systems to achieve nature's true gradient and exact Pantone color matching.
                </p>
              </div>
              <div className="w-full sm:w-40 h-28 relative rounded-lg overflow-hidden shrink-0">
                <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>

            {/* Card 5: Inventory Management */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-1 w-full">
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Inventory Management</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Advanced ERP-integrated warehousing allowing for real-time stock monitoring and rapid order fulfillment.
                </p>
              </div>
              <div className="w-full sm:w-40 h-28 relative rounded-lg overflow-hidden shrink-0">
                <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>

            {/* Card 6: Shipping */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-1 w-full">
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Shipping</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Global logistics network with rapid prototyping to shipping cycles of 45-60 days for commercial contracts.
                </p>
              </div>
              <div className="w-full sm:w-40 h-28 relative rounded-lg overflow-hidden shrink-0">
                <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Global Reach & Exhibitions */}
      <section className="py-24 px-6 mb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="relative rounded-2xl overflow-hidden min-h-[600px] flex items-center bg-gray-900"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Background Image */}
            <Image 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop"
              alt="Global Trade Show Exhibition"
              fill
              className="object-cover opacity-60"
            />
            
            {/* Content Box */}
            <div className="relative z-10 w-full md:w-[500px] bg-white/95 backdrop-blur-md p-10 md:p-16 m-6 md:ml-16 rounded-xl shadow-2xl">
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.p variants={fadeUp} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Global Presence
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Trade Shows & Exhibitions
                </motion.h2>
                <motion.p variants={fadeUp} className="text-sm text-gray-600 leading-relaxed mb-8">
                  We proudly showcase our premium floral collections at major international trade shows. From Europe to the Middle East, our botanical creations have left a lasting impression on buyers and distributors worldwide.
                </motion.p>
                
                <motion.div variants={staggerContainer} className="flex flex-wrap gap-2 mb-10">
                  {[
                    "Ambiente Frankfurt",
                    "Dubai World Trade Centre",
                    "Canton Fair",
                    "Maison&Objet Paris",
                    "Exporting to 40+ Countries"
                  ].map((pill, i) => (
                    <motion.span key={i} variants={fadeUp} className="bg-[#fcf5f7] text-[#8a385a] text-[11px] font-semibold px-3 py-1.5 rounded-sm border border-[#f5e1e6]">
                      {pill}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Link href="#" className="inline-block bg-[#3a081a] !text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded hover:bg-[#250510] transition-colors">
                    View Event Calendar
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quality & Compliance */}
      <section className="py-24 bg-[#faf9f8] px-6 border-t border-[#f4f2ee]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Left Column */}
            <motion.div 
              className="lg:w-1/3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h2 className="text-3xl font-bold mb-6 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Quality & Compliance
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We adhere to the highest international standards of safety and ethical manufacturing.
              </p>
            </motion.div>

            {/* Right Column - Grid */}
            <motion.div 
              className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Item 1 */}
              <motion.div variants={fadeUp}>
                <div className="flex items-center gap-3 mb-3 text-[#3a081a]">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h4 className="font-bold text-[15px]">ISO 9001:2015 Certified</h4>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Our Quality Management Systems ensure consistent output that meets regulatory requirements and customer satisfaction.
                </p>
              </motion.div>

              {/* Item 2 */}
              <motion.div variants={fadeUp}>
                <div className="flex items-center gap-3 mb-3 text-[#3a081a]">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9a3.5 3.5 0 100 6" />
                  </svg>
                  <h4 className="font-bold text-[15px]">Copyright Protection</h4>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Exclusive designs are protected through robust legal frameworks, ensuring your custom collections remain unique to your brand.
                </p>
              </motion.div>

              {/* Item 3 */}
              <motion.div variants={fadeUp}>
                <div className="flex items-center gap-3 mb-3 text-[#3a081a]">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <h4 className="font-bold text-[15px]">Ethical Sourcing</h4>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  100% audit-compliant facility focusing on fair labor practices and worker safety across all production tiers.
                </p>
              </motion.div>

              {/* Item 4 */}
              <motion.div variants={fadeUp}>
                <div className="flex items-center gap-3 mb-3 text-[#3a081a]">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h4 className="font-bold text-[15px]">REACH Compliance</h4>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  All materials and dyes used in our manufacturing process are certified for chemical safety and environmental standards.
                </p>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
