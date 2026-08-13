'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.splitContainer}>
        
        {/* Left Side: Text Content */}
        <div className={styles.textContent}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className={styles.mainTitle}>
              PREMIUM ARTIFICIAL FLOWER DECORATIONS
            </h1>
            <h2 className={styles.subTitle}>
              PREMIUM EXPORTER IN SRI LANKA
            </h2>
            <p className={styles.description}>
              Discover hyper-realistic, sustainable botanical decor crafted for global wholesale markets. Perfect for luxury retail, commercial spaces, and bespoke events.
            </p>
            <Link href="/collections" className={styles.ctaButton}>
              Inquiry now
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Image */}
        <div className={styles.imageContent}>
          <motion.div 
            className={styles.imageWrapper}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              className="object-cover w-full h-full absolute inset-0"
            >
              <source src="/headernew1_hq.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
