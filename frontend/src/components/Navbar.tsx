'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

const AnimatedNavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode, isActive?: boolean }) => {
  const defaultTextColor = isActive ? 'text-white font-semibold' : 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm uppercase tracking-wider';

  return (
    <Link href={href} className={`group relative inline-block overflow-hidden h-5 flex items-center shrink-0 whitespace-nowrap ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  
  const [cartCount, setCartCount] = useState(0);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [categories, setCategories] = useState<string[]>(["All Collections"]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }
    if (isOpen) {
      setHeaderShapeClass('rounded-2xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }
    return () => {
      if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const logoElement = (
    <Link href="/" className="flex items-center gap-3 mr-4">
      <div className="w-9 h-9 min-w-9 flex items-center justify-center bg-white rounded-full overflow-hidden">
        <img src="/logo.jpg" alt="AMP Ceylon Logo" className="w-full h-full object-contain" />
      </div>
      <span className="font-playfair font-bold text-white tracking-wide text-lg hidden lg:block whitespace-nowrap shrink-0">AMP Ceylon</span>
    </Link>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       pl-4 pr-8 py-3 backdrop-blur-md
                       ${headerShapeClass}
                       border border-[#333] bg-[rgba(15,15,15,0.75)]
                       w-[calc(100%-2rem)] max-w-5xl sm:w-auto
                       transition-all duration-400 ease-in-out
                       ${hidden ? '-translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>

      <div className="flex items-center justify-between w-full gap-x-8 sm:gap-x-12">
        <div className="flex items-center">
           {logoElement}
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          <AnimatedNavLink href="/" isActive={pathname === '/'}>Home</AnimatedNavLink>
          <AnimatedNavLink href="/about" isActive={pathname === '/about'}>About Us</AnimatedNavLink>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer py-2">
              <AnimatedNavLink href="/collections" isActive={pathname === '/collections'}>Catalog</AnimatedNavLink>
              <ChevronDown size={14} className="text-gray-300" />
            </div>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-[rgba(20,20,20,0.95)] backdrop-blur-xl border border-[#333] rounded-xl overflow-hidden shadow-2xl flex flex-col py-2"
                >
                  {categories.map((cat, idx) => (
                    <Link 
                      key={idx} 
                      href={`/collections?category=${encodeURIComponent(cat)}`} 
                      className="px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatedNavLink href="/manufacturing" isActive={pathname === '/manufacturing'}>Manufacturing</AnimatedNavLink>
          <AnimatedNavLink href="/contact" isActive={pathname === '/contact'}>Contact</AnimatedNavLink>
        </nav>

        <div className="flex items-center gap-4 ml-auto md:ml-0">
          <Link href="/cart" className="relative flex items-center p-1 text-white hover:text-gray-200 transition-colors shrink-0">
            <motion.div
              key={animationTrigger}
              initial={{ scale: 1, y: 0 }}
              animate={animationTrigger > 1 ? { scale: [1, 1.25, 0.9, 1.1, 1], y: [0, -8, 2, -3, 0] } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex items-center"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.div>
          </Link>
          
          <button className="md:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
            {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </div>

      <div className={`md:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-6 pb-2' : 'max-h-0 opacity-0 pt-0 pb-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-5 text-base w-full">
          <Link href="/" className="text-gray-300 hover:text-white uppercase tracking-widest text-sm transition-colors w-full text-center">Home</Link>
          <Link href="/about" className="text-gray-300 hover:text-white uppercase tracking-widest text-sm transition-colors w-full text-center">About Us</Link>
          
          <div className="flex flex-col items-center w-full">
            <div className="text-gray-500 uppercase tracking-widest text-xs mb-3 font-semibold">Catalog</div>
            <div className="flex flex-col items-center space-y-3 w-full border-l-2 border-[#333] ml-4">
              {categories.map((cat, idx) => (
                <Link key={idx} href={`/collections?category=${encodeURIComponent(cat)}`} className="text-white hover:text-gray-200 transition-colors w-full text-center text-sm">
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/manufacturing" className="text-gray-300 hover:text-white uppercase tracking-widest text-sm transition-colors w-full text-center">Manufacturing</Link>
          <Link href="/contact" className="text-gray-300 hover:text-white uppercase tracking-widest text-sm transition-colors w-full text-center">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
