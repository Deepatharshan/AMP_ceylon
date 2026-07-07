'use client';

import Image from 'next/image';
import styles from './Heritage.module.css';
import { useScrollFade } from '@/hooks/useScrollFade';

export default function Heritage() {
  const { ref, isVisible } = useScrollFade(0.2);

  return (
    <section className={`${styles.heritage} fade-in ${isVisible ? 'visible' : ''}`} ref={ref}>
      <div className={styles.textContent}>
        <p className={styles.preTitle}>Our Heritage</p>
        <h2 className={styles.title}>35 Years of Botanical Excellence</h2>
        <p className={styles.description}>
          Founded in 1989, AMP Ceylon pioneered the art of hyper-realistic artificial botanicals in South Asia. What began as a small boutique workshop has blossomed into a global leader in floral design.
        </p>
        <p className={styles.description}>
          Today, we operate a state-of-the-art 100,000+ sq ft manufacturing facility employing over 500 skilled artisans who meticulously hand-assemble every petal and leaf. We are not just manufacturers, we are global export specialists serving 40+ countries with meticulous attention to customs compliance and logistics.
        </p>
      </div>
      
      <div className={styles.imageContent}>
        <img 
          src="/images1.jpg" 
          alt="Manufacturing premium artificial flowers" 
          className={styles.mainImage}
        />
        <img 
          src="/image2.jpg" 
          alt="Artisan detail crafting flowers" 
          className={styles.overlayImage}
        />
      </div>
    </section>
  );
}
