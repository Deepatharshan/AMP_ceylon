'use client';

import { CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import styles from './CTA.module.css';
import { useScrollFade } from '@/hooks/useScrollFade';

export default function CTA() {
  const { ref, isVisible } = useScrollFade();

  return (
    <section className={styles.ctaWrapper}>
      <div 
        ref={ref}
        className={`${styles.ctaCard} fade-in ${isVisible ? 'visible' : ''}`}
      >
        <p className={styles.preTitle}>Direct from manufacturer</p>
        <h2 className={styles.title}>Ready to elevate your inventory?</h2>
        <p className={styles.description}>
          We offer tiered pricing for bulk international orders and custom OEM design services for major retail chains. Request a customized quote and catalog today.
        </p>
        
        <form className={styles.form} onSubmit={e => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="YOUR WORK EMAIL" 
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>Request Quote</button>
        </form>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <ShieldCheck size={16} />
            <span>Custom Packaging</span>
          </div>
          <div className={styles.feature}>
            <Globe size={16} />
            <span>Global Logistics</span>
          </div>
          <div className={styles.feature}>
            <CheckCircle2 size={16} />
            <span>OEM / ODM</span>
          </div>
        </div>
      </div>
    </section>
  );
}
