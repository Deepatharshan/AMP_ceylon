"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, Award, Sparkles, CheckCircle2, ThumbsUp, Heart, TrendingUp, Globe2, PackageCheck } from "lucide-react";
import { useScrollFade } from "@/hooks/useScrollFade";

const reviews = [
  {
    name: "Sarah Jenkins",
    role: "Event Director, Luxe Weddings (USA)",
    rating: 5,
    emoji: "😍",
    quote: "The artificial orchids are indistinguishable from fresh blooms. Custom pantone matching was 100% accurate for all 12 gala events.",
    tag: "Orchid Collection",
  },
  {
    name: "David Sterling",
    role: "CEO, Sterling Botanicals (UK)",
    rating: 5,
    emoji: "🤩",
    quote: "We switched all OEM manufacturing to AMP Ceylon. Their quality control is flawless — every stem is thermal set to perfection.",
    tag: "OEM Manufacturing",
  },
  {
    name: "Michael Chen",
    role: "Head of Procurement, HomeGoods (Canada)",
    rating: 5,
    emoji: "💖",
    quote: "Multi-layer carton packaging arrived without a single crushed petal across 15,000 units. Exceptional logistics reliability.",
    tag: "Global Freight",
  },
  {
    name: "Elena Rodriguez",
    role: "Supply Chain Manager (Australia)",
    rating: 5,
    emoji: "🌸",
    quote: "Hit our freight deadline 2 days early during peak holiday demand. Reliable manufacturing scaling at its finest.",
    tag: "Bulk Export",
  },
];

const emojiStats = [
  { emoji: "😍", label: "Exceeded Expectations", percent: "98.8%" },
  { emoji: "🌟", label: "5-Star Repeat Orders", percent: "99.4%" },
  { emoji: "🌸", label: "Botanical Realism Score", percent: "99.9%" },
  { emoji: "📦", label: "Flawless Delivery Rate", percent: "99.6%" },
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollFade(0.2);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-[#fdfbf9] overflow-hidden border-t border-b border-[#e9e3dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 fade-in ${isVisible ? "visible" : ""}`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4a0b22]/10 border border-[#4a0b22]/20 mb-4">
            <Sparkles className="w-4 h-4 text-[#4a0b22]" />
            <span
              className="text-xs uppercase tracking-[2px] font-bold text-[#4a0b22]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Client Happiness & Trust Metrics
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl text-[#222] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Highest Rated by Global Partners
          </h2>
          <p
            className="text-[#666] text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Delivering excellence in botanical manufacturing and export logistics with verified 5-star customer satisfaction worldwide.
          </p>
        </div>

        {/* 3 Core Highlight Summary Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 fade-in delay-100 ${
            isVisible ? "visible" : ""
          }`}
        >
          {/* Card 1: Client Happiness Level */}
          <div className="relative group bg-white rounded-2xl p-7 border border-[#e8e2da] shadow-[0_10px_30px_-15px_rgba(74,11,34,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(74,11,34,0.15)] transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4a0b22] bg-[#4a0b22]/8 px-3 py-1 rounded-full">
                Happiness Index
              </span>
              <div className="flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                Top 1% Industry
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl sm:text-5xl font-bold text-[#222] tracking-tight">99.8%</span>
              <span className="text-3xl animate-bounce">😍</span>
            </div>

            <h3 className="text-lg font-semibold text-[#222] mb-1">
              Overwhelmingly Delighted
            </h3>
            <p className="text-sm text-[#777] mb-6">
              Positive sentiment based on 500+ global corporate buyer evaluations & reviews.
            </p>

            {/* Emoji Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-gray-100">
              {emojiStats.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-2 text-[#555]">
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </span>
                  <span className="font-semibold text-[#333]">{item.percent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: 5-Star Rating */}
          <div className="relative group bg-white rounded-2xl p-7 border-2 border-[#4a0b22]/20 shadow-[0_15px_35px_-12px_rgba(74,11,34,0.12)] hover:shadow-[0_22px_45px_-15px_rgba(74,11,34,0.2)] transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4a0b22] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
              Global Rating
            </div>

            <div className="flex items-center justify-between mb-4 mt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4a0b22] bg-[#4a0b22]/8 px-3 py-1 rounded-full">
                5-Star Score
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                100% Verified
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl sm:text-5xl font-bold text-[#222] tracking-tight">5.0</span>
              <div className="flex flex-col">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-[#777] mt-0.5">Perfect 5.0 of 5.0</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[#222] mb-1">
              Top Rated by 450+ Importers
            </h3>
            <p className="text-sm text-[#777] mb-6">
              Rated exceptional across 50+ countries for lifelike aesthetics and packaging.
            </p>

            {/* Rating Bar Progress */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#666]">
                  <span className="flex items-center gap-1 font-medium">
                    <span>5 Stars</span>
                    <span className="text-amber-500">★★★★★</span>
                  </span>
                  <span className="font-semibold text-[#333]">98.6%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-[98.6%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#666]">
                  <span className="flex items-center gap-1 font-medium">
                    <span>4 Stars</span>
                    <span className="text-amber-500">★★★★</span>
                  </span>
                  <span className="font-semibold text-[#333]">1.4%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400/60 rounded-full w-[1.4%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Top Trust Level */}
          <div className="relative group bg-white rounded-2xl p-7 border border-[#e8e2da] shadow-[0_10px_30px_-15px_rgba(74,11,34,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(74,11,34,0.15)] transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4a0b22] bg-[#4a0b22]/8 px-3 py-1 rounded-full">
                Reliability
              </span>
              <div className="flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Grade A+ Standard
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl sm:text-5xl font-bold text-[#222] tracking-tight">100%</span>
              <span className="text-2xl text-[#4a0b22] font-semibold">Trust Score</span>
            </div>

            <h3 className="text-lg font-semibold text-[#222] mb-1">
              Certified Global Exporter
            </h3>
            <p className="text-sm text-[#777] mb-6">
              Rigorous thermal-set quality control and multi-tier export packaging standards.
            </p>

            {/* Trust Pillars */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#444]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-Crush Packaging Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#444]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>99.6% On-Time Worldwide Dispatch</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#444]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>OEM / ODM Bespoke Pantone Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Verified Feedback Highlights */}
        <div className={`bg-white rounded-2xl border border-[#e8e2da] p-6 sm:p-8 shadow-sm fade-in delay-200 ${isVisible ? "visible" : ""}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-[#222] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#4a0b22]" />
                Verified Partner Statements
              </h3>
              <p className="text-sm text-[#666]">
                Direct feedback from international event planners, procurement leads, and wholesale retailers.
              </p>
            </div>
            
            {/* Tab navigation */}
            <div className="flex flex-wrap gap-2">
              {reviews.map((rev, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeTab === index
                      ? "bg-[#4a0b22] text-white shadow-sm"
                      : "bg-[#f5f1eb] text-[#666] hover:bg-[#eae3d9] hover:text-[#333]"
                  }`}
                >
                  {rev.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Active Review Spotlight */}
          <div className="mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#faf8f5] rounded-xl p-6 border border-[#ece6de]">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400">
                    {[...Array(reviews[activeTab].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Verified Buyer
                  </span>
                  <span className="text-xl">{reviews[activeTab].emoji}</span>
                </div>
                
                <blockquote className="text-[#333] text-base sm:text-lg italic leading-relaxed">
                  &ldquo;{reviews[activeTab].quote}&rdquo;
                </blockquote>

                <div className="pt-2">
                  <p className="font-bold text-[#222] text-sm">
                    {reviews[activeTab].name}
                  </p>
                  <p className="text-xs text-[#777]">
                    {reviews[activeTab].role}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg border border-[#e4ddd4] min-w-[140px] text-center">
                <span className="text-2xl font-bold text-[#4a0b22]">5.0 / 5.0</span>
                <span className="text-[11px] uppercase tracking-wider text-[#888] font-semibold">
                  Partner Score
                </span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees Strip */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Globe2 className="w-5 h-5 text-[#4a0b22]" />
              <span className="text-xs font-bold text-[#333] mt-1.5">50+ Export Markets</span>
              <span className="text-[11px] text-[#777]">Worldwide Logistics</span>
            </div>
            <div className="flex flex-col items-center">
              <PackageCheck className="w-5 h-5 text-[#4a0b22]" />
              <span className="text-xs font-bold text-[#333] mt-1.5">0% Damage Target</span>
              <span className="text-[11px] text-[#777]">Reinforced Cartons</span>
            </div>
            <div className="flex flex-col items-center">
              <ThumbsUp className="w-5 h-5 text-[#4a0b22]" />
              <span className="text-xs font-bold text-[#333] mt-1.5">100% Quality Check</span>
              <span className="text-[11px] text-[#777]">Thermal-Set Crafting</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-5 h-5 text-[#4a0b22]" />
              <span className="text-xs font-bold text-[#333] mt-1.5">99.8% Delighted</span>
              <span className="text-[11px] text-[#777]">Client Happiness</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
