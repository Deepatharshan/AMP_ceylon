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
            <li>
              <Link href="/certificates" className="hover:text-[#f4e6ea] transition-colors">
                Certifications
              </Link>
            </li>
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
            <li>
              <Link href="/terms-of-sales" className="hover:text-[#f4e6ea] transition-colors">
                Terms of Sales
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[#f4e6ea] transition-colors">
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        
        <div className={styles.column}>
          <h4>Connect</h4>
          <div className="flex gap-4 mb-6">
            <a href="mailto:udeshjv.ampsl@gmail.com" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#3a081a] transition-all">
              <Mail size={18} />
            </a>
            <a href="tel:+94112251026" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#3a081a] transition-all">
              <Phone size={18} />
            </a>
          </div>
          <p className="text-sm text-[#f4e6ea]/70 leading-relaxed">
            <strong>Head Office:</strong> Ring Road 3, Phase 2, EPZ, Katunayake<br />
            <span className="block mt-2"><strong>Lebanon Factory:</strong> Thawalanthenna, Waththeyama</span>
          </p>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <span><Link href="/admin/login" className="cursor-default text-inherit hover:text-white transition-colors" title="Admin Login">© 2026</Link> AMP pvt ltd. All Rights Reserved. Custom artificial flora from Sri Lanka.</span>
        <ShoppingCart size={20} />
      </div>
    </footer>
  );
}
