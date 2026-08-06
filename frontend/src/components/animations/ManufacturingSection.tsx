'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ManufacturingSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ManufacturingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const dyeRef = useRef<HTMLDivElement>(null);
  const heatRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);
  const text4Ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%', // 4 stages
          pin: true,
          scrub: 1,
        }
      });

      // Stage 1: White Shape
      tl.to(text1Ref.current, { opacity: 1, duration: 0.5 })
        .to(text1Ref.current, { opacity: 0, duration: 0.5 }, '+=0.5');

      // Stage 2: Dyeing
      tl.to(dyeRef.current, { opacity: 0.8, duration: 1 }, '<')
        .to(text2Ref.current, { opacity: 1, duration: 0.5 }, '<')
        .to(text2Ref.current, { opacity: 0, duration: 0.5 }, '+=0.5');

      // Stage 3: Heating
      tl.to(heatRef.current, { opacity: 1, scale: 1.2, duration: 0.5 }, '<')
        .to(heatRef.current, { opacity: 0, scale: 1.5, duration: 0.5 }, '+=0.5')
        .to(text3Ref.current, { opacity: 1, duration: 0.5 }, '<-0.5')
        .to(text3Ref.current, { opacity: 0, duration: 0.5 }, '+=0.5');

      // Stage 4: Designed
      tl.to(finalRef.current, { opacity: 1, duration: 1 }, '<')
        .to(text4Ref.current, { opacity: 1, duration: 0.5 }, '<');
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.mfgSection}>
      <h2 ref={text1Ref} className={styles.stageText}>1. Base Material Shaping</h2>
      <h2 ref={text2Ref} className={styles.stageText}>2. Precision Dyeing Process</h2>
      <h2 ref={text3Ref} className={styles.stageText}>3. Thermal Setting</h2>
      <h2 ref={text4Ref} className={styles.stageText}>4. Final Artistic Design</h2>

      <div className={styles.mfgContainer}>
        <div ref={baseRef} className={styles.flowerBase}>
          Raw Form
          <div ref={dyeRef} className={styles.dyeOverlay}></div>
          <div ref={heatRef} className={styles.heatEffect}></div>
          <div ref={finalRef} className={styles.designedFlower}></div>
        </div>
      </div>
    </section>
  );
}
