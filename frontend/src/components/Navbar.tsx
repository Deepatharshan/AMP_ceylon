'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('inquiry_cart') || '[]');
      setCartCount(cart.length);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const isLightMode = pathname === '/contact';
  
  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${isLightMode && !scrolled ? styles.lightMode : ''}`}>
      <div className={styles.logo}>AMP Ceylon</div>
      <div className={styles.navLinks}>
        <Link href="/" className={pathname === '/' ? styles.active : ''}>Home</Link>
        <Link href="#">About Us</Link>
        <Link href="/collections" className={pathname === '/collections' ? styles.active : ''}>Catalog</Link>
        <Link href="/manufacturing" className={pathname === '/manufacturing' ? styles.active : ''}>Manufacturing</Link>
        <Link href="/contact" className={pathname === '/contact' ? styles.active : ''}>Contact</Link>
      </div>
      <div className={styles.icons}>
        <Link href="/cart" className={`${styles.iconBtn} relative flex items-center p-1 ${(scrolled || isLightMode) ? 'text-[#333] hover:text-[#8a385a]' : 'text-white hover:text-gray-200'} transition-colors`}>
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#3a081a] text-white border border-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
