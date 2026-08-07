'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

const AnimatedNavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode, isActive?: boolean }) => {
  const defaultTextColor = isActive ? 'text-[#3a081a] font-bold' : 'text-[#3a081a]/80 font-semibold';
  const hoverTextColor = 'text-[#3a081a] font-bold';
  const textSizeClass = 'text-base font-playfair uppercase tracking-widest';

  return (
    <Link href={href} className={`group relative inline-block overflow-hidden h-6 flex items-center shrink-0 whitespace-nowrap ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-none');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wasOpen = useRef(false);
  
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  
  const [cartCount, setCartCount] = useState(0);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [categories, setCategories] = useState<string[]>(["All Collections"]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileFloralOpen, setIsMobileFloralOpen] = useState(false);
  
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
        
        // Fetch only floral categories
        const { data: catData } = await supabase
          .from('categories')
          .select('name')
          .or('business_line.eq.FLORAL,business_line.is.null')
          .order('name', { ascending: true });
          
        if (catData && catData.length > 0) {
          setCategories(["All Collections", ...catData.map(c => c.name)]);
        }
        
        const { data: prodData } = await supabase
          .from('products')
          .select('*')
          .or('business_line.eq.FLORAL,business_line.is.null')
          .limit(3);
          
        if (prodData) {
          setFeaturedProducts(prodData);
        }
      } catch (err) {
        console.error('Failed to load data for navbar', err);
      }
    }
    
    loadCategories();
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 20) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }

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
      setHeaderShapeClass(isAtTop ? 'rounded-none' : 'rounded-2xl');
    } else {
      if (wasOpen.current) {
        shapeTimeoutRef.current = setTimeout(() => {
          setHeaderShapeClass(isAtTop ? 'rounded-none' : 'rounded-full');
        }, 300);
      } else {
        setHeaderShapeClass(isAtTop ? 'rounded-none' : 'rounded-full');
      }
    }
    wasOpen.current = isOpen;
    
    return () => {
      if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
    };
  }, [isOpen, isAtTop]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const logoElement = (
    <Link href="/" className="flex items-center gap-3 mr-4 group">
      <div className="w-20 h-20 min-w-[5rem] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <img src="/amplogo.png" alt="AMP Ceylon Logo" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
      </div>
    </Link>
  );

  return (
    <div className={`fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none transition-transform duration-500 ease-in-out ${hidden ? '-translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
      <header 
        className={`pointer-events-auto flex flex-col items-center w-full relative
                   border-b border-gray-200 bg-[#faf9f6] backdrop-blur-md px-6 md:px-12 py-2.5`}
      >

      <div className="flex items-center justify-between w-full gap-x-8 sm:gap-x-12">
        <div className="flex items-center">
           {logoElement}
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          <AnimatedNavLink href="/" isActive={pathname === '/'}>Home</AnimatedNavLink>
          <AnimatedNavLink href="/about" isActive={pathname === '/about'}>About Us</AnimatedNavLink>
          
          <div 
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer py-2">
              <AnimatedNavLink href="/collections" isActive={pathname === '/collections'}>Floral & Decor</AnimatedNavLink>
              <ChevronDown size={14} className="text-[#3a081a]/80" />
            </div>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-full bg-[#faf9f6] border-t border-gray-200 shadow-2xl overflow-hidden"
                >
                  <div className="max-w-7xl mx-auto px-6 py-10 flex gap-12">
                    {/* Categories Column */}
                    <div className="w-1/4 shrink-0">
                      <h4 className="text-sm font-bold uppercase tracking-widest !text-[#3a081a]/90 mb-6">Collections</h4>
                      <ul className="flex flex-col gap-4">
                        {categories.map((cat, idx) => (
                          <li key={idx}>
                            <Link 
                              href={`/collections?category=${encodeURIComponent(cat)}`} 
                              className="text-base font-medium !text-[#3a081a] hover:opacity-70 transition-opacity"
                            >
                              {cat}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Featured Products Grid */}
                    <div className="flex-1 grid grid-cols-3 gap-6">
                      {featuredProducts.map(product => (
                        <Link 
                          key={product.id} 
                          href={`/product/${product.id}`}
                          className="group block relative rounded-lg overflow-hidden bg-gray-200 aspect-[4/3]"
                        >
                          <img 
                            src={product.image_url || (product.image_urls && product.image_urls[0]) || ''} 
                            alt={product.name}
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">{product.category}</span>
                            <h3 className="text-white font-playfair text-lg font-bold truncate">{product.name}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatedNavLink href="/carton-boxes" isActive={pathname === '/carton-boxes'}>Carton Boxes</AnimatedNavLink>

          <AnimatedNavLink href="/manufacturing" isActive={pathname === '/manufacturing'}>Manufacturing</AnimatedNavLink>
          <AnimatedNavLink href="/contact" isActive={pathname === '/contact'}>Contact</AnimatedNavLink>
        </nav>

        <div className="flex items-center gap-4 ml-auto md:ml-0">
          <Link href="/cart" className="relative flex items-center p-1 !text-[#3a081a] hover:!text-[#3a081a]/80 transition-colors shrink-0">
            <motion.div
              key={animationTrigger}
              initial={{ scale: 1, y: 0 }}
              animate={animationTrigger > 1 ? { scale: [1, 1.25, 0.9, 1.1, 1], y: [0, -8, 2, -3, 0] } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex items-center"
            >
              <ShoppingBag size={20} color="#3a081a" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.div>
          </Link>
          
          <button className="md:hidden flex items-center justify-center w-8 h-8 !text-[#3a081a] focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
            {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="#3a081a" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
                <svg className="w-6 h-6" fill="none" stroke="#3a081a" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden flex flex-col items-center w-full overflow-hidden"
          >
            <div className="pt-6 pb-2 w-full">
              <nav className="flex flex-col items-center gap-6 text-base w-full bg-[#faf9f6] text-[#3a081a]">
                <Link href="/" className="!text-[#3a081a] hover:opacity-80 uppercase tracking-widest text-sm transition-colors w-full text-center font-medium">Home</Link>
                <Link href="/about" className="!text-[#3a081a] hover:opacity-80 uppercase tracking-widest text-sm transition-colors w-full text-center font-medium">About Us</Link>
                
                <div className="flex flex-col items-center w-full">
                  <button 
                    onClick={() => setIsMobileFloralOpen(!isMobileFloralOpen)}
                    className="!text-[#3a081a] hover:opacity-80 uppercase tracking-widest text-sm transition-colors w-full text-center font-bold flex items-center justify-center gap-2"
                  >
                    Floral & Decor
                    <motion.div
                      animate={{ rotate: isMobileFloralOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} className="opacity-50" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isMobileFloralOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden w-full flex justify-center"
                      >
                        <div className="flex flex-col items-center w-full mt-4 bg-gray-50/80 py-4 rounded-xl border border-gray-100 gap-4 max-w-[220px]">
                          {categories.map((cat, idx) => (
                            <Link 
                              key={idx} 
                              href={`/collections?category=${encodeURIComponent(cat)}`} 
                              onClick={() => setIsOpen(false)}
                              className="!text-[#3a081a]/80 hover:!text-[#3a081a] transition-colors w-full text-center text-sm font-medium"
                            >
                              {cat}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/carton-boxes" className="!text-[#3a081a] hover:opacity-80 uppercase tracking-widest text-sm transition-colors w-full text-center font-medium">Carton Boxes</Link>
                <Link href="/manufacturing" className="!text-[#3a081a] hover:opacity-80 uppercase tracking-widest text-sm transition-colors w-full text-center font-medium">Manufacturing</Link>
                <Link href="/contact" className="!text-[#3a081a] hover:opacity-80 uppercase tracking-widest text-sm transition-colors w-full text-center font-medium">Contact</Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </div>
  );
}
