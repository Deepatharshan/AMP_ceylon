import { Mail, Phone, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.linksSection}>
        <div className={styles.column} style={{ flex: 1.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="/amplogo.png" 
              alt="AMP Ceylon Logo" 
              className="w-14 h-14 object-contain mix-blend-screen opacity-90" 
            />
            <h3 className={styles.logo} style={{ marginBottom: 0 }}>AMP pvt ltd</h3>
          </div>
          <p>
            Premium manufacturers and global exporter of high-grade artificial flowers, botanical decor, and luxury gift items.
          </p>
        </div>
        
        <div className={styles.column}>
          <h4>Categories</h4>
          <ul>
            <li>Manufacturing</li>
            <li>Floral Orders</li>
            <li>Certifications</li>
          </ul>
        </div>
        
        <div className={styles.column}>
          <h4>Information</h4>
          <ul>
            <li>
              <Link href="/privacy-policy" className="hover:text-[#f4e6ea] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>Terms of Sales</li>
            <li>
              <Link href="/faq" className="hover:text-[#f4e6ea] transition-colors">
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        
        <div className={styles.column}>
          <h4>Connect</h4>
          <div className={styles.socialIcons}>
            <div className={styles.socialIcon}><Mail size={18} /></div>
            <div className={styles.socialIcon}><Phone size={18} /></div>
          </div>
          <p style={{ fontSize: '0.8rem' }}>
            Headquarters: 123 Botanical Ave,<br />
            Colombo, Sri Lanka
          </p>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <span>© 2026 AMP pvt ltd. All Rights Reserved. Custom artificial flora from Sri Lanka.</span>
        <ShoppingCart size={20} />
      </div>
    </footer>
  );
}
