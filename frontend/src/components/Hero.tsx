import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import styles from './Hero.module.css';
import HeroText from '@/components/ui/hero-shutter-text';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className={styles.heroVideo}
      >
        {/* Replace this src with your actual video file in the public folder */}
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      
      <div className={styles.content}>
        <div className="min-h-[120px] md:min-h-[180px] w-full relative mb-8">
          <HeroText text="BOTANICALS" />
        </div>
        <p className={styles.subtitle}>
          Perfecting the art of botanical mimicry.
        </p>
        <div className={styles.actions}>
          <Link href="/collections" className={styles.btnPrimary}>
            VIEW CATALOG
          </Link>
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <span>Scroll to Explore</span>
        <ChevronDown size={24} className={styles.bounce} />
      </div>
    </section>
  );
}
