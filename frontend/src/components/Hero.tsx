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
        <source src="/headernew1_hq.mp4" type="video/mp4" />
      </video>
      
      <div className={styles.scrollIndicator}>
        <span>Scroll to Explore</span>
        <ChevronDown size={24} className={styles.bounce} />
      </div>
    </section>
  );
}
