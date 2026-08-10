'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { BlogPost } from '@/lib/mock-blog';
import styles from './BlogArticle.module.css';

export default function BlogPostClientPage({ post }: { post: BlogPost }) {
  return (
    <main className="min-h-screen bg-[#faf9f8] text-[#333]">
      <div className="bg-transparent w-full relative z-20" style={{ height: 'calc(5rem + var(--banner-height, 0px))' }}>
        <Navbar />
      </div>

      <article className="container mx-auto px-6 py-12 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-[#8a385a] hover:text-[#3a081a] transition-colors mb-8 group">
          <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
            <span className="text-[#8a385a]">{post.category}</span>
            <span>•</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3a081a] leading-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            {post.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[#3a081a] font-bold">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm">{post.author}</p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>
        </header>

        <div className="relative w-full h-[40vh] md:h-[60vh] rounded-2xl overflow-hidden mb-12 shadow-lg">
          <Image 
            src={post.image_url} 
            alt={post.title} 
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Blog Content styled via CSS module */}
        <div 
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </article>

      <Footer />
    </main>
  );
}
