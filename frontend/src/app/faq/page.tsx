'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is your minimum order quantity (MOQ) for international shipments?",
    answer: "Our standard MOQ for international wholesale orders is $1,500 USD per shipment, or a minimum of 50 cartons. For custom manufacturing runs, MOQs vary based on the complexity of the design."
  },
  {
    question: "Do you offer custom manufacturing for specific floral designs?",
    answer: "Yes, we specialize in custom manufacturing. You can provide us with reference images, physical samples, or detailed specifications, and our design team will create precise prototypes for your approval before mass production."
  },
  {
    question: "How long does shipping typically take for global exports?",
    answer: "Sea freight shipments generally take 3-6 weeks depending on the destination port. Air freight is available for urgent orders and typically takes 5-10 business days worldwide. All shipments are dispatched from the Port of Colombo."
  },
  {
    question: "Are your artificial flowers UV resistant for outdoor use?",
    answer: "We offer specialized UV-resistant coatings for our botanical decor intended for outdoor or long-term sunny exposure. Please specify this requirement when placing your order, as it requires a specific manufacturing process."
  },
  {
    question: "Can I request a sample box before placing a bulk order?",
    answer: "Absolutely. We encourage all new wholesale partners to request a sample box to verify our premium quality. Sample boxes are charged at a nominal fee, which is fully credited towards your first bulk order."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 selection:bg-[#3a081a] selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-40 pb-24 px-6 relative">
        <div className="container mx-auto max-w-3xl relative z-10">
          
          <div className="text-center mb-12">
            <h3 className="text-xs font-bold text-[#8a385a] uppercase tracking-widest mb-4">FAQ</h3>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-gray-500 text-base md:text-lg">
              Proactively answering FAQs boosts user confidence<br className="hidden md:block" /> and cuts down on support tickets.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg border transition-colors duration-300 ${isOpen ? 'border-[#8a385a]' : 'border-gray-200'} overflow-hidden shadow-sm`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className={`text-base font-medium transition-colors ${isOpen ? 'text-[#8a385a]' : 'text-gray-800'}`}>
                      {faq.question}
                    </span>
                    <span className="text-gray-400 ml-4 shrink-0">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
