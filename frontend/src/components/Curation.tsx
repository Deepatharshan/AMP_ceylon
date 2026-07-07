'use client';

import Link from 'next/link';
import styles from './Curation.module.css';
import { useScrollFade } from '@/hooks/useScrollFade';

const collections = [
  {
    title: 'Signature Arrangements',
    category: 'Handcrafted Series',
    image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Home Fragrance',
    category: 'Luxury Scent Profiles',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Seasonal Decor',
    category: 'Global Holiday Themes',
    image: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?q=80&w=800&auto=format&fit=crop',
  }
];

export default function Curation() {
  const { ref, isVisible } = useScrollFade();

  return (
    <section className={styles.curation}>
      <div 
        ref={ref}
        className={`${styles.header} fade-in ${isVisible ? 'visible' : ''}`}
      >
        <div>
          <p className={styles.preTitle}>Collections</p>
          <h2 className={styles.title}>Curation of Excellence</h2>
        </div>
        <Link href="#" className={styles.exploreLink}>
          Explore Full Catalog →
        </Link>
      </div>

      <div className={styles.grid}>
        {collections.map((item, index) => (
          <div 
            key={item.title}
            className={`${styles.card} fade-in delay-${(index + 1) * 100} ${isVisible ? 'visible' : ''}`}
          >
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} className={styles.cardImage} />
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardCategory}>{item.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
