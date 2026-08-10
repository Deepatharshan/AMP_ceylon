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
      
      <h1 className="sr-only">
        Premium Artificial Flowers Exporter in Sri Lanka
      </h1>
      
      <div className={styles.scrollIndicator}>
        <span>Scroll to Explore</span>
        <ChevronDown size={24} className={styles.bounce} />
      </div>
    </section>
  );
}
