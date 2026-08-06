'use client';

import { motion, Variants } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './About.module.css';
import { ShieldCheck, Leaf, Globe, Award, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.img 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/aboutusheader.jpg" 
          alt="About Us Hero" 
          className={styles.heroImage} 
        />
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={styles.heroTitle}
        >
          About Us
        </motion.h1>
      </section>

      {/* Intro Section */}
      <section className={styles.section}>
        <motion.div 
          className={styles.twoColumn}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp} className={styles.columnLeft}>
            <h2 className={styles.sectionHeading}>
              Our Story
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className={styles.columnRight}>
            <p className={`${styles.serviceDesc} mb-6 text-lg`}>
              AMP Ceylon (Pvt) Ltd. is one of Sri Lanka's leading manufacturers and exporters of premium artificial decorative products, giftware, and sustainable packaging solutions. Established in 1984, the company has earned an international reputation for quality, innovation, and reliability, supplying customers in more than 50 countries across Europe, North America, Asia, Australia, and other global markets.
            </p>
            <p className={`${styles.serviceDesc} text-lg`}>
              Located in the Export Processing Zone, Katunayake, Sri Lanka, AMP Ceylon combines advanced manufacturing capabilities with skilled craftsmanship to produce world-class products that meet international quality and ethical standards. The company is recognized for its creativity, customer-focused approach, and ability to develop exclusive product collections tailored to global retail and wholesale markets.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Vision & Mission Section */}
      <section className={`${styles.teamSection}`}>
        <motion.div 
          className="max-w-[1400px] mx-auto px-6 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp}>
            <h2 className="font-playfair text-4xl mb-8 text-white uppercase tracking-wider">Our Vision</h2>
            <div className="flex items-start gap-3 mt-6">
              <CheckCircle2 className="mt-1 flex-shrink-0 text-[#fca5a5]" size={20} />
              <p className="text-gray-300 text-lg leading-relaxed">
                To be a globally recognized manufacturer of innovative decorative products, delivering excellence through creativity, quality, and responsible manufacturing.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h2 className="font-playfair text-4xl mb-8 text-white uppercase tracking-wider">Our Mission</h2>
            <ul className="text-gray-300 text-lg leading-relaxed space-y-4 mt-6">
              {[
                "To manufacture products that exceed customer expectations in quality, design, and value.",
                "To build long-term partnerships through trust, reliability, and exceptional service.",
                "To embrace innovation and sustainable manufacturing practices.",
                "To contribute to Sri Lanka's export growth while creating employment and value for our stakeholders."
              ].map((mission, idx) => (
                <motion.li key={idx} variants={fadeUp} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 flex-shrink-0 text-[#fca5a5]" size={20} />
                  {mission}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </section>
      {/* Our Leadership Section */}
      <section className={`${styles.section} bg-white`}>
        <motion.div 
          className="max-w-[1400px] mx-auto px-6 md:px-0"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="font-playfair text-4xl text-gray-900 uppercase tracking-wide">Our Leadership</h2>
            <div className="w-16 h-[2px] bg-[#8a385a] mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            {/* Managing Director */}
            <motion.div variants={fadeUp} className="flex flex-col items-center text-center group">
              <div className="w-64 h-64 mb-8 overflow-hidden rounded-full border-[3px] border-[#8a385a]/20 shadow-lg relative bg-[#f4f4f4]">
                <img 
                  src="/current-owner.jpeg" 
                  alt="Mr. J.V. Udesh - Managing Director" 
                  className="w-full h-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400?text=Managing+Director' }}
                />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-1 uppercase tracking-wide">Managing Director</h3>
              <p className="text-gray-900 font-bold tracking-wider text-sm mb-1">Mr. J.V. Udesh</p>
              <p className="text-[#8a385a] font-medium tracking-wider uppercase text-xs mb-4">AMP Ceylon</p>
              <p className="text-gray-600 leading-relaxed max-w-sm">
                As the owner, leading the company forward with modern innovations and sustainable practices while maintaining our core values and global standards.
              </p>
            </motion.div>

            {/* Consultant */}
            <motion.div variants={fadeUp} className="flex flex-col items-center text-center group">
              <div className="w-64 h-64 mb-8 overflow-hidden rounded-full border-[3px] border-[#8a385a]/20 shadow-lg relative bg-[#f4f4f4]">
                <img 
                  src="/founder.jpg" 
                  alt="Ms. Nancy Liu - Consultant" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400?text=Consultant' }}
                />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-1 uppercase tracking-wide">Consultant</h3>
              <p className="text-gray-900 font-bold tracking-wider text-sm mb-1">Ms. Nancy Liu</p>
              <p className="text-[#8a385a] font-medium tracking-wider uppercase text-xs mb-4">AMP Ceylon</p>
              <p className="text-gray-600 leading-relaxed max-w-sm">
                Providing expert strategic guidance and invaluable industry insights, drawing upon decades of experience to ensure AMP Ceylon's continued global excellence.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>


      {/* Our Products & Excellence Section */}
      <section className={styles.section}>
        <motion.div 
          className={styles.twoColumn}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp} className={styles.columnLeft}>
            <h2 className={styles.sectionHeading}>
              Our Products &<br />
              Excellence
            </h2>
          </motion.div>
          <div className={styles.columnRight}>
            
            <motion.div variants={fadeUp} className="mb-14">
              <h3 className="text-2xl font-semibold mb-8 text-gray-900 font-playfair tracking-wide">Artificial Decorative Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  'Pre-made Floral Arrangements',
                  'Artificial Flowers & Foliage',
                  'Plants & Greenery',
                  'Christmas Decorations',
                  'Holiday Decorations',
                  'Home Décor',
                  'Gift Items',
                  'Candles',
                  'Natural & Preserved Decorative Materials',
                  'Seasonal Decorative Collections'
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="flex items-center gap-3 text-gray-700">
                    <Leaf size={16} className="text-[#8a385a]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h3 className="text-2xl font-semibold mb-8 text-gray-900 font-playfair tracking-wide">Manufacturing Excellence</h3>
              <p className="text-gray-700 leading-relaxed mb-6 mt-6">
                Our modern production facilities combine advanced manufacturing technology with experienced craftsmanship to ensure consistent quality, efficient production, and timely delivery.
              </p>
              <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider">Our Strengths Include:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'In-house product development',
                  'Experienced design team',
                  'Custom product development',
                  'Large-scale production capability',
                  'Strict quality assurance',
                  'Ethical manufacturing practices',
                  'Sustainable production methods',
                  'Reliable global logistics support'
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="flex items-center gap-3 text-gray-700">
                    <Award size={16} className="text-[#8a385a]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`${styles.section} bg-[#faf9f8]`}>
        <motion.div 
          className={styles.twoColumn}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp} className={styles.columnLeft}>
            <p className={styles.preTitle}>Our Advantages</p>
            <h2 className={styles.sectionHeading}>
              Why Choose<br />
              AMP Ceylon
            </h2>
            <p className="mt-8 text-gray-700 leading-relaxed max-w-sm">
              With decades of expertise, we are the trusted partner for premium artificial botanicals and decorative products worldwide.
            </p>
          </motion.div>
          <div className={styles.columnRight}>
            <motion.div 
              className={styles.capabilitiesGrid}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                { icon: Clock, title: "Decades of Experience", desc: "More than four decades of manufacturing experience." },
                { icon: Globe, title: "Global Reach", desc: "Exporting to over 50 countries worldwide." },
                { icon: Sparkles, title: "Customized Development", desc: "Customized product development with innovative designs." },
                { icon: ShieldCheck, title: "International Standards", desc: "International quality standards with strict assurance." },
                { icon: Award, title: "Competitive Value", desc: "Competitive pricing matched with reliable delivery schedules." },
                { icon: Leaf, title: "Sustainable & Ethical", desc: "Sustainable manufacturing approach with professional customer support." }
              ].map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <motion.div key={idx} variants={fadeUp} className={styles.capItem}>
                    <div className={styles.iconWrapper}>
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className={styles.capTitle}>{cap.title}</h3>
                    <p className={styles.capDesc}>{cap.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Commitment Section */}
      <section className="bg-white py-24 px-6 md:px-12 text-center border-t border-gray-100 overflow-hidden">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp}>
            <ShieldCheck size={48} className="text-[#8a385a] mx-auto mb-6" strokeWidth={1} />
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-playfair text-4xl text-gray-900 mb-10 uppercase tracking-wide">
            Our Commitment
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-gray-700 leading-relaxed italic">
            "At AMP Ceylon, customer satisfaction is at the heart of everything we do. We continuously invest in innovation, product development, and manufacturing excellence to provide products that add value to our customers' businesses."
          </motion.p>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
