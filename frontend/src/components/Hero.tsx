import { ChevronDown } from 'lucide-react';
import styles from './Hero.module.css';

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
        <source src="https://vjilhfyiupdvtscmwxbt.supabase.co/storage/v1/object/public/headernew1/headernew1_hq.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
        <h1 className="text-white text-3xl md:text-5xl lg:text-7xl font-bold text-center tracking-tight drop-shadow-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
          Premium Artificial Flowers Exporter in Sri Lanka
        </h1>
        <div className={styles.scrollIndicator}>
          <span>Scroll to Explore</span>
          <ChevronDown size={24} className={styles.bounce} />
        </div>
      </div>
    </section>
  );
}
