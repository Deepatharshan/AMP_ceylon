'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>AMP Ceylon</div>
      <div className={styles.navLinks}>
        <Link href="/" className={pathname === '/' ? styles.active : ''}>Home</Link>
        <Link href="#">About Us</Link>
        <Link href="/collections" className={pathname === '/collections' ? styles.active : ''}>Catalog</Link>
        <Link href="#">Floral Decor</Link>
        <Link href="#">Manufacturing</Link>
        <Link href="#">Contact</Link>
      </div>
      <div className={styles.icons}>
        <button className={styles.iconBtn}>
          <ShoppingBag size={20} />
        </button>
      </div>
    </nav>
  );
}
