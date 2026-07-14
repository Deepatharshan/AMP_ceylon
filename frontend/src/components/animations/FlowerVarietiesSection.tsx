'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FlowerVarietiesSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const varieties = [
  { name: 'Orchid', color: '#fce4ec', text: 'Elegant and exotic orchids for premium arrangements.' },
  { name: 'Rose', color: '#ffebee', text: 'Classic roses in every shade imaginable.' },
  { name: 'Tulip', color: '#fff8e1', text: 'Springtime tulips to brighten any room.' },
  { name: 'Lily', color: '#f3e5f5', text: 'Majestic lilies that command attention.' },
  { name: 'Wild Daisy', color: '#e8f5e9', text: 'Rustic wild daisies for a natural feel.' },
  { name: 'Grass', color: '#f1f8e9', text: 'Lush greenery and grasses for perfect volume.' },
];

export default function FlowerVarietiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // Pin the section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${varieties.length * 100}%`, // Scroll length depends on number of varieties
        pin: true,
        scrub: 1,
      }
    });

    // Sequence the animations
    varieties.forEach((variety, index) => {
      const item = itemsRef.current[index];
      
      // Animate background color
      tl.to(sectionRef.current, {
        backgroundColor: variety.color,
        duration: 1,
        ease: 'none',
      }, index * 2);

      // Fade in current item
      tl.fromTo(item, {
        opacity: 0,
        y: 50,
        autoAlpha: 0,
      }, {
        opacity: 1,
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power1.out',
      }, index * 2);

      // Fade out current item (unless it's the last one)
      if (index < varieties.length - 1) {
        tl.to(item, {
          opacity: 0,
          y: -50,
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power1.in',
        }, (index * 2) + 1.5);
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.flowerSection}>
      <div className={styles.flowerContainer}>
        <h2 className={styles.title}>Curation of Excellence</h2>
        
        {varieties.map((variety, index) => (
          <div 
            key={variety.name} 
            ref={el => { itemsRef.current[index] = el }} 
            className={styles.flowerItem}
          >
            <div className={styles.flowerImage}>
              <p>[ {variety.name} 3D Model / Image ]</p>
            </div>
            <div className={styles.flowerInfo}>
              <h3>{variety.name} Varieties</h3>
              <p>{variety.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
