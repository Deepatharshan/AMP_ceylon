"use client";

import React from "react";
import { TestimonialsCarousel, Testimonial } from "@/components/ui/testimonials-carousel";
import { useScrollFade } from "@/hooks/useScrollFade";

const testimonials: Testimonial[] = [
  {
    text: "AMP Ceylon completely elevated our wedding decor inventory. The artificial orchids are indistinguishable from the real thing, and their custom dyeing perfectly matched our pantone requirements.",
    highlight: "indistinguishable from the real thing",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    name: "Sarah Jenkins",
    role: "Event Director, Luxe Weddings",
  },
  {
    text: "As a global retailer, reliable shipping is our top priority. Their packaging is flawless—thousands of delicate petals arrived without a single crush. Truly the best service on flowers we have experienced.",
    highlight: "best service on flowers",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
    name: "Michael Chen",
    role: "Head of Procurement, HomeGoods",
  },
  {
    text: "The fast delivery properly scaled our holiday season. We ordered 10,000 seasonal arrangements and they hit the freight deadline with two days to spare. Incredible manufacturing capability.",
    highlight: "fast delivery properly scaled",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    name: "Elena Rodriguez",
    role: "Supply Chain Manager",
  },
  {
    text: "We switched all our OEM botanical manufacturing to AMP pvt ltd last year. Their quality control process is unmatched. Every single stem is perfectly crafted and thermal set.",
    highlight: "quality control process is unmatched",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    name: "David Sterling",
    role: "CEO, Sterling Botanicals",
  },
  {
    text: "Their design team took our rough sketches and turned them into stunning artificial arrangements. The attention to detail in the foliage and the clay pots was absolutely spectacular.",
    highlight: "attention to detail",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop",
    name: "Chloe Dubois",
    role: "Lead Designer",
  },
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollFade(0.3);

  return (
    <section className="py-24 bg-[#fcfbf9] overflow-hidden border-t border-gray-200">
      <div 
        ref={ref}
        className={`container mx-auto text-center max-w-3xl mb-12 fade-in ${isVisible ? 'visible' : ''}`}
      >
        <p className="text-[0.8rem] uppercase tracking-[2px] text-[#4a0b22] mb-4 font-bold" style={{ fontFamily: 'var(--font-inter)' }}>
          Client Praise
        </p>
        <h2 className="text-4xl md:text-5xl text-[#333]" style={{ fontFamily: 'var(--font-playfair)' }}>
          What Our Global Partners Say
        </h2>
      </div>

      <div className={`mt-10 space-y-6 fade-in delay-200 ${isVisible ? 'visible' : ''}`}>
        <TestimonialsCarousel
          testimonials={testimonials}
          speed={35}
          direction="left"
          cardHeight={220}
        />
        <TestimonialsCarousel
          testimonials={testimonials}
          speed={40}
          direction="right"
          cardHeight={220}
        />
      </div>
    </section>
  );
}
