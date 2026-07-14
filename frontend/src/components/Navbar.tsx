'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = React.useRef(0);
  const [cartCount, setCartCount] = useState(0);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [categories, setCategories] = useState<string[]>(["All Collections"]);
  const pathname = usePathname();

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('inquiry_cart') || '[]');
      setCartCount(cart.length);
      setAnimationTrigger(prev => prev + 1);
    }
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('categories').select('name').order('name', { ascending: true });
        if (data && data.length > 0) {
          setCategories(["All Collections", ...data.map(c => c.name)]);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    
    loadCategories();
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const isLightMode = pathname === '/contact' || pathname === '/privacy-policy' || pathname === '/faq';
  
  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''} ${isLightMode && !scrolled ? styles.lightMode : ''}`}>
      <div className={styles.logo}>AMP Ceylon</div>
      <div className={styles.navLinks}>
        <Link href="/" className={pathname === '/' ? styles.active : ''}>Home</Link>
        <Link href="/about" className={pathname === '/about' ? styles.active : ''}>About Us</Link>
        <div className={styles.dropdownContainer}>
          <Link href="/collections" className={pathname === '/collections' ? styles.active : ''}>Catalog</Link>
          <div className={styles.dropdownMenu}>
            {categories.map((cat, idx) => (
              <Link 
                key={idx} 
                href={`/collections?category=${encodeURIComponent(cat)}`} 
                className={styles.dropdownItem}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/manufacturing" className={pathname === '/manufacturing' ? styles.active : ''}>Manufacturing</Link>
        <Link href="/contact" className={pathname === '/contact' ? styles.active : ''}>Contact</Link>
      </div>
      <div className={styles.icons}>
        <Link href="/cart" className={`${styles.iconBtn} relative flex items-center p-1 ${(scrolled || isLightMode) ? 'text-[#333] hover:text-[#8a385a]' : 'text-white hover:text-gray-200'} transition-colors`}>
          <motion.div
            key={animationTrigger}
            initial={{ scale: 1, y: 0 }}
            animate={animationTrigger > 1 ? { 
              scale: [1, 1.25, 0.9, 1.1, 1],
              y: [0, -8, 2, -3, 0] 
            } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex items-center"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3a081a] text-white border border-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.div>
        </Link>
      </div>
    </nav>
  );
}
