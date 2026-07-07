'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SeasonalShippingSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const seasons = ['Christmas', 'Valentine\'s Day', 'Autumn', 'Spiritual'];

export default function SeasonalShippingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const themeTextRef = useRef<HTMLHeadingElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lorryRef = useRef<HTMLDivElement>(null);
  
  const [currentSeason, setCurrentSeason] = useState(seasons[0]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%', // 4 seasons + packing + shipping
        pin: true,
        scrub: 1,
      }
    });

    // 1. Cycle through seasons
    seasons.forEach((season, index) => {
      tl.to(sectionRef.current, {
        duration: 1,
        onStart: () => setCurrentSeason(season),
        onReverseComplete: () => {
          if (index > 0) setCurrentSeason(seasons[index - 1]);
        }
      });
    });

    // 2. Packing animation
    tl.to(boxRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'bounce.out'
    });

    // 3. Move box into lorry
    tl.to([productRef.current, boxRef.current], {
      x: '30vw',
      scale: 0.5,
      duration: 1,
      ease: 'power2.inOut'
    });
    
    // 4. Lorry drives in
    tl.to(lorryRef.current, {
      right: '20%',
      duration: 1,
      ease: 'power2.out'
    }, '<'); // Play at same time as box moving

    // 5. Lorry drives away
    tl.to([lorryRef.current, productRef.current, boxRef.current], {
      x: '-150vw',
      duration: 1.5,
      ease: 'power1.in'
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.shippingSection}>
      <h2 ref={themeTextRef} className={styles.themeText}>{currentSeason} Collection</h2>
      
      <div className={styles.sceneContainer}>
        <div ref={productRef} className={styles.product}>
          Gift Arrangement
        </div>
        <div ref={boxRef} className={styles.box}>
          Packaging
        </div>
        
        <div ref={lorryRef} className={styles.lorry}>
          AMP Lorry
        </div>
      </div>
    </section>
  );
}
