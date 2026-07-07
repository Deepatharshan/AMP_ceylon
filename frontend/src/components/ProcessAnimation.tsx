'use client';

import { Scissors, Droplets, Flame, Sparkles, CheckCircle, Package, Truck } from 'lucide-react';
import styles from './ProcessAnimation.module.css';
import { useScrollFade } from '@/hooks/useScrollFade';
import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';

const steps = [
  { 
    title: 'Precision Cutting', 
    description: 'Every petal and leaf is meticulously cut from high-grade silk and polyester blends, ensuring the natural shape and texture are perfectly replicated.',
    icon: Scissors 
  },
  { 
    title: 'Custom Dyeing', 
    description: 'Our proprietary dyeing process involves hand-dipping materials into custom color baths to achieve natural gradients and lifelike hues.',
    icon: Droplets 
  },
  { 
    title: 'Thermal Setting', 
    description: 'Using specialized heat molds, each piece is pressed to create the delicate veins and curves found in real botanical specimens.',
    icon: Flame 
  },
  { 
    title: 'Artistic Design', 
    description: 'Skilled artisans hand-assemble the components into complete blooms and foliage, securing them to flexible, durable stems.',
    icon: Sparkles 
  },
  { 
    title: 'Quality Check', 
    description: 'Every arrangement undergoes a strict 10-point inspection to ensure structural integrity and visual perfection before leaving our facility.',
    icon: CheckCircle 
  },
  { 
    title: 'Secure Packing', 
    description: 'Products are carefully boxed in custom-fitted packaging designed to protect delicate petals from crushing during international transit.',
    icon: Package 
  },
  { 
    title: 'Global Shipping', 
    description: 'Our dedicated logistics team coordinates freight forwarding to over 40 countries, ensuring timely and pristine delivery to your retail locations.',
    icon: Truck 
  },
];

// A sub-component to handle intersection observation per step
function TimelineStep({ step }: { step: typeof steps[0] }) {
  const { ref, isVisible } = useScrollFade(0.4); // Trigger when 40% of the item is visible

  return (
    <div ref={ref} className={`${styles.stepWrapper} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.stepContent}>
        <h4 className={styles.stepTitle}>{step.title}</h4>
        <p className={styles.stepDescription}>{step.description}</p>
      </div>
      <div className={styles.circle}>
        <step.icon size={30} />
      </div>
      <div className={styles.stepEmpty}></div>
    </div>
  );
}

export default function ProcessAnimation() {
  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollFade();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section className={styles.process}>
      <div ref={headerRef} className={`fade-in ${isHeaderVisible ? 'visible' : ''}`}>
        <p className={styles.preTitle}>Our Process</p>
        <h2 className={styles.title}>From Raw Material to Masterpiece</h2>
      </div>
        
      <div ref={containerRef} className={styles.timeline}>
        <motion.div 
          className={styles.animatedLine}
          style={{ scaleY: scrollYProgress }}
        />
        {steps.map((step) => (
          <TimelineStep key={step.title} step={step} />
        ))}
      </div>
    </section>
  );
}
