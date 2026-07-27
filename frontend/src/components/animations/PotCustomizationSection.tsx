'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PotCustomizationSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const pots = [
  { name: 'Clay Pot', color: '#8d6e63' },
  { name: 'Glass Vase', color: 'rgba(255, 255, 255, 0.4)', border: '2px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' },
  { name: 'Bamboo Basket', color: '#dce775', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' },
  { name: 'Modern Plastic', color: '#26c6da' },
];

export default function PotCustomizationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const potRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${pots.length * 100}%`,
          pin: true,
          scrub: 1,
        }
      });

      pots.forEach((pot, index) => {
        tl.to(potRef.current, {
          backgroundColor: pot.color,
          border: pot.border || 'none',
          backdropFilter: pot.backdropFilter || 'none',
          backgroundImage: pot.backgroundImage || 'none',
          duration: 1,
          ease: 'none',
          onStart: () => {
            if (potRef.current) potRef.current.innerText = pot.name;
          },
          onReverseComplete: () => {
            if (potRef.current && index > 0) {
              potRef.current.innerText = pots[index - 1].name;
            }
          }
        });
      });
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.potSection}>
      <h2 className={styles.title}>Versatile Base Designs</h2>
      
      <div className={styles.arrangementContainer}>
        <div className={styles.flowerTop}></div>
        <div ref={potRef} className={styles.potBase}>
          Clay Pot
        </div>
      </div>
    </section>
  );
}
