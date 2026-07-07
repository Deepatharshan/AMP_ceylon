'use client';

import { useEffect, useState } from 'react';
import styles from './StatsSection.module.css';
import { useScrollFade } from '@/hooks/useScrollFade';

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollFade(0.5);

  useEffect(() => {
    if (isVisible) {
      let startTimestamp: number | null = null;
      const duration = 2000; // 2 seconds

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Use an ease-out curve for a natural slowing down effect
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        
        setCount(Math.floor(easeOutProgress * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isVisible, end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const { ref, isVisible } = useScrollFade(0.8);

  useEffect(() => {
    if (isVisible) {
      // Lock the scroll when the component is in view
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Unlock after 2.2 seconds (matching the counter duration + small buffer)
      const timer = setTimeout(() => {
        document.body.style.overflow = originalOverflow;
      }, 2200);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isVisible]);

  return (
    <section className={styles.statsSection}>
      <div className={`${styles.statItem} fade-in ${isVisible ? 'visible' : ''}`} ref={ref}>
        <div className={styles.statNumber}>
          <Counter end={400} suffix="+" />
        </div>
        <div className={styles.statLabel}>Customers</div>
      </div>
      
      <div className={`${styles.statItem} fade-in delay-200 ${isVisible ? 'visible' : ''}`}>
        <div className={styles.statNumber}>
          <Counter end={20} suffix="+" />
        </div>
        <div className={styles.statLabel}>Countries</div>
      </div>
      
      <div className={`${styles.statItem} fade-in delay-300 ${isVisible ? 'visible' : ''}`}>
        <div className={styles.statNumber}>
          <Counter end={45000} suffix="+" />
        </div>
        <div className={styles.statLabel}>Products</div>
      </div>
    </section>
  );
}
