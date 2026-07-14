import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './About.module.css';
import { ShieldCheck, Leaf, Globe, Award, Sparkles, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <img 
          src="/aboutusheader.jpg" 
          alt="About Us Hero" 
          className={styles.heroImage} 
        />
        <h1 className={styles.heroTitle}>About Us</h1>
      </section>

      {/* Capabilities Section */}
      <section className={styles.section}>
        <div className={styles.twoColumn}>
          <div className={styles.columnLeft}>
            <h2 className={styles.sectionHeading}>
              We Provide<br />
              Various Services
            </h2>
          </div>
          <div className={styles.columnRight}>
            <ul className={styles.serviceList}>
              <li className={styles.serviceItem}>
                <span className={styles.serviceNumber}>01</span>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>Botanical Mimicry</h3>
                  <p className={styles.serviceDesc}>
                    Perfecting the art of lifelike artificial florals. Our state-of-the-art facilities ensure every petal, stem, and leaf looks indistinguishable from nature, offering timeless elegance without maintenance.
                  </p>
                </div>
              </li>
              <li className={styles.serviceItem}>
                <span className={styles.serviceNumber}>02</span>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>Global Export</h3>
                  <p className={styles.serviceDesc}>
                    Delivering unparalleled beauty worldwide. We package and ship our premium artificial botanicals globally, ensuring they arrive in pristine condition for commercial and residential installations.
                  </p>
                </div>
              </li>
              <li className={styles.serviceItem}>
                <span className={styles.serviceNumber}>03</span>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>Custom Arrangements</h3>
                  <p className={styles.serviceDesc}>
                    Tailored floral designs for unique spaces. Our master artisans collaborate with interior designers and architects to curate bespoke arrangements that elevate any environment.
                  </p>
                </div>
              </li>
              <li className={styles.serviceItem}>
                <span className={styles.serviceNumber}>04</span>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>Event Scenography</h3>
                  <p className={styles.serviceDesc}>
                    Transforming venues with breathtaking floral installations. We design large-scale, immersive botanical experiences for weddings, corporate events, and high-end galas.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Artisans (Team) Section */}
      <section className={styles.teamSection}>
        <h2 className={styles.teamHeading}>Professional Team</h2>
        <div className={styles.teamGrid}>
          {/* Team Member 1 */}
          <div className={styles.teamMember}>
            <img src="/images1.jpg" alt="Aria Smith" />
            <div className={styles.teamInfo}>
              <span className={styles.teamRole}>Founder & CEO</span>
              <h3 className={styles.teamName}>Aria Smith</h3>
              <div className={styles.teamSocials}>
                <a href="#">FB</a>
                <a href="#">TW</a>
                <a href="#">IN</a>
              </div>
            </div>
          </div>
          {/* Team Member 2 */}
          <div className={styles.teamMember}>
            <img src="/222.jpeg" alt="Julian Ford" />
            <div className={styles.teamInfo}>
              <span className={styles.teamRole}>Head Artisan</span>
              <h3 className={styles.teamName}>Julian Ford</h3>
              <div className={styles.teamSocials}>
                <a href="#">FB</a>
                <a href="#">TW</a>
                <a href="#">IN</a>
              </div>
            </div>
          </div>
          {/* Team Member 3 */}
          <div className={styles.teamMember}>
            <img src="/image2.jpg" alt="Maya Lin" />
            <div className={styles.teamInfo}>
              <span className={styles.teamRole}>Lead Designer</span>
              <h3 className={styles.teamName}>Maya Lin</h3>
              <div className={styles.teamSocials}>
                <a href="#">FB</a>
                <a href="#">TW</a>
                <a href="#">IN</a>
              </div>
            </div>
          </div>
          {/* Team Member 4 */}
          <div className={styles.teamMember}>
            <img src="/112.jpg" alt="Marcus Chen" />
            <div className={styles.teamInfo}>
              <span className={styles.teamRole}>Export Manager</span>
              <h3 className={styles.teamName}>Marcus Chen</h3>
              <div className={styles.teamSocials}>
                <a href="#">FB</a>
                <a href="#">TW</a>
                <a href="#">IN</a>
              </div>
            </div>
          </div>
          {/* Team Member 5 */}
          <div className={styles.teamMember}>
            <img src="/3221.jpg" alt="Elena Rossi" />
            <div className={styles.teamInfo}>
              <span className={styles.teamRole}>Scenography Lead</span>
              <h3 className={styles.teamName}>Elena Rossi</h3>
              <div className={styles.teamSocials}>
                <a href="#">FB</a>
                <a href="#">TW</a>
                <a href="#">IN</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`${styles.section} ${styles.whyChooseUs}`}>
        <div className={styles.twoColumn}>
          <div className={styles.columnLeft}>
            <p className={styles.preTitle}>Our Promise</p>
            <h2 className={styles.sectionHeading}>
              Why Choose<br />
              AMP Ceylon
            </h2>
            <p className={styles.sectionDesc}>
              Setting the global standard in botanical mimicry and artificial floristry since our inception. We combine traditional craftsmanship with modern innovation to deliver uncompromising excellence.
            </p>
          </div>
          <div className={styles.columnRight}>
            <div className={styles.capabilitiesGrid}>
              
              <div className={styles.capItem}>
                <div className={styles.iconWrapper}>
                  <ShieldCheck size={28} strokeWidth={1.5} />
                </div>
                <h3 className={styles.capTitle}>Uncompromising Quality</h3>
                <p className={styles.capDesc}>
                  Every stem and petal undergoes rigorous quality control to ensure lifelike accuracy and durability.
                </p>
              </div>

              <div className={styles.capItem}>
                <div className={styles.iconWrapper}>
                  <Leaf size={28} strokeWidth={1.5} />
                </div>
                <h3 className={styles.capTitle}>Botanical Authenticity</h3>
                <p className={styles.capDesc}>
                  Our artisans study real flora to replicate the exact colors, textures, and organic movements of nature.
                </p>
              </div>

              <div className={styles.capItem}>
                <div className={styles.iconWrapper}>
                  <Globe size={28} strokeWidth={1.5} />
                </div>
                <h3 className={styles.capTitle}>Global Export Network</h3>
                <p className={styles.capDesc}>
                  Seamless worldwide shipping with specialized packaging to ensure your arrangements arrive pristine.
                </p>
              </div>

              <div className={styles.capItem}>
                <div className={styles.iconWrapper}>
                  <Award size={28} strokeWidth={1.5} />
                </div>
                <h3 className={styles.capTitle}>Award-Winning Design</h3>
                <p className={styles.capDesc}>
                  Recognized internationally for pushing the boundaries of artificial floral arrangements and scenography.
                </p>
              </div>

              <div className={styles.capItem}>
                <div className={styles.iconWrapper}>
                  <Sparkles size={28} strokeWidth={1.5} />
                </div>
                <h3 className={styles.capTitle}>Bespoke Creations</h3>
                <p className={styles.capDesc}>
                  Tailored solutions designed specifically for interior designers, luxury hotels, and high-end retail spaces.
                </p>
              </div>

              <div className={styles.capItem}>
                <div className={styles.iconWrapper}>
                  <Clock size={28} strokeWidth={1.5} />
                </div>
                <h3 className={styles.capTitle}>Timeless Elegance</h3>
                <p className={styles.capDesc}>
                  Invest in beauty that lasts. Our premium products require zero maintenance while providing year-round perfection.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
