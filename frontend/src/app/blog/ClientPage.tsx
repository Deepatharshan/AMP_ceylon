'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_BLOG_POSTS } from '@/lib/mock-blog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function BlogClientPage() {
  return (
    <main className="min-h-screen bg-[#faf9f8] text-[#333]">
      <div className="bg-transparent w-full relative z-20" style={{ height: 'calc(5rem + var(--banner-height, 0px))' }}>
        <Navbar />
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <motion.div 
          className="max-w-2xl mb-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p variants={fadeUp} className="text-[#8a385a] text-xs font-bold uppercase tracking-widest mb-4">
            Industry Insights
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl text-[#3a081a] font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            The AMP Ceylon Journal
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed">
            Expert insights on global floral trends, sustainable manufacturing practices, and B2B wholesale logistics.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {MOCK_BLOG_POSTS.map((post) => (
            <motion.article key={post.id} variants={fadeUp} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <Link href={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden">
                <Image 
                  src={post.image_url} 
                  alt={post.title} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3a081a] rounded">
                  {post.category}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-[#3a081a] mb-3 group-hover:text-[#8a385a] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-800">By {post.author}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
