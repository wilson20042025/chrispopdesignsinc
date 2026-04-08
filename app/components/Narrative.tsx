"use client";

import { useState } from "react";
import Link from "next/link";

export default function Narrative() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const stories = [
    {
      title: "Why ChrisPop Designs Incorporated and Innovation?",
      text: "We are a team of passionate architects and designers who are dedicated to creating beautiful and functional spaces. We believe that everyone deserves to live and work in a space that inspires them and makes them feel happy."
    },
    {
      title: "Our Craft & Core Beliefs",
      text: "Focusing on the intersection of silence and material, we craft spaces that breathe. Our approach blends digital precision with artisanal care to create timeless, high-impact environments."
    },
    {
      title: "Collaborate With Us",
      text: "Every project begins with a simple conversation. Whether you're envisioning a residential refuge or a commercial landmark, we're ready to translate your ambitions into architectural reality."
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % stories.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);

  return (
    <section className="py-16 xs:py-20 md:py-32 px-6 xs:px-12 md:px-24 bg-surface overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Title Column */}
        <div className="md:col-span-6">
          <div className="flex items-start gap-8">
            <span className="hidden md:block text-[10px] tracking-[0.5em] font-light text-black/20 pt-2">
              0{currentSlide + 1}
            </span>
            <h2 key={`title-${currentSlide}`} className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-thin tracking-tighter leading-tight text-on-surface animate-narrative uppercase">
              {currentSlide === 0 ? (
                <>
                  Why ChrisPop Designs <span className="md:hidden">Incorporated?</span><span className="hidden md:inline">Incorporated and Innovation?</span>
                </>
              ) : stories[currentSlide].title}
            </h2>
          </div>
        </div>

        {/* Content Column */}
        <div className="md:col-span-4 md:col-start-9 space-y-12">
          <p key={`text-${currentSlide}`} className="text-sm font-light text-on-surface-variant leading-relaxed animate-narrative">
            {stories[currentSlide].text}
          </p>
          
          <div className="flex justify-between items-center relative">
            <div className="flex items-center gap-12">
                {currentSlide < 2 ? (
                <Link 
                    href="/about"
                    className="inline-block text-[10px] tracking-[0.3em] font-medium border-b border-on-surface pb-2 hover:opacity-60 transition-opacity uppercase animate-narrative"
                >
                    About Us 
                </Link>
                ) : (
                    <Link 
                        href="/contact"
                        className="inline-block text-[10px] tracking-[0.5em] font-bold text-white bg-black px-8 py-3.5 hover:opacity-70 transition-all duration-700 uppercase animate-skate"
                    >
                        Inquire // Contact
                    </Link>
                )}

                {/* Desktop Navigation Arrows */}
                <div className="hidden md:flex items-center gap-4">
                    <button 
                        onClick={prevSlide}
                        className="p-2 text-on-surface/20 hover:text-on-surface transition-colors"
                        aria-label="Previous section"
                    >
                        <span className="material-symbols-outlined text-sm !font-light">west</span>
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="p-2 text-on-surface/20 hover:text-on-surface transition-colors"
                        aria-label="Next section"
                    >
                        <span className="material-symbols-outlined text-sm !font-light">east</span>
                    </button>
                </div>
            </div>

            {/* Mobile-Only Navigation Controls */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={nextSlide}
                className="p-2 -mr-2 text-on-surface/40 hover:text-on-surface transition-colors active:scale-90"
                aria-label="Next section"
              >
                <span className="material-symbols-outlined text-xl !font-light">
                    {currentSlide === 2 ? 'refresh' : 'east'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes narrativeFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes skateIn {
          from { opacity: 0; transform: translateX(20px); letter-spacing: 0.1em; }
          to { opacity: 1; transform: translateX(0); letter-spacing: 0.5em; }
        }
        .animate-narrative {
          animation: narrativeFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-skate {
          animation: skateIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      ` }} />
    </section>
  );
}
