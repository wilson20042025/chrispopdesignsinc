"use client";

import { useState } from "react";
import Link from "next/link";

export default function Narrative() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const stories = [
    {
      title: "Design Meets Advanced Fabrication",
      text: "We are a team of passionate architects and precision fabricators. We believe that the most inspiring spaces are born from the perfect synergy between architectural design and advanced 3D fabrication technologies."
    },
    {
      title: "Precision Prototyping & Craft",
      text: "By prioritizing 3D fabrication, we bring an unprecedented level of detail to our work. Our approach blends digital precision with artisanal care to create high-impact prototypes, models, and spatial elements."
    },
    {
      title: "Collaborate With Us",
      text: "Whether you're developing a complex architectural project or require expert 3D fabrication and prototyping solutions, we're ready to translate your vision into a physical masterpiece."
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % stories.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);

  return (
    <section className="py-8 md:py-12 px-6 xs:px-12 md:px-24 bg-surface overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

        {/* Title Column */}
        <div className="md:col-span-6">
          <div className="flex items-start gap-8">
            <span className="hidden md:block text-[10px] tracking-[0.5em] font-light text-black/20 pt-2">
              0{currentSlide + 1}
            </span>
            <h2 key={`title-${currentSlide}`} className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-thin tracking-tighter leading-tight text-on-surface uppercase">
              {currentSlide === 0 ? (
                <>
                  Why Chris Pop Design & Innovations?
                </>
              ) : stories[currentSlide].title}
            </h2>
          </div>
        </div>

        {/* Content Column */}
        <div className="md:col-span-4 md:col-start-9 space-y-12">
          <p key={`text-${currentSlide}`} className="text-sm font-light text-on-surface-variant leading-relaxed">
            {stories[currentSlide].text}
          </p>

          <div className="flex justify-between items-center relative">
            <div className="flex items-center gap-12">
              {currentSlide < 2 ? (
                <Link
                  href="/about"
                  className="inline-block text-[10px] tracking-[0.3em] font-medium border-b border-on-surface pb-2 hover:opacity-60 transition-opacity uppercase"
                >
                  About Us
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="inline-block text-[10px] tracking-[0.5em] font-bold text-white bg-black px-8 py-3.5 hover:opacity-70 transition-all duration-700 uppercase"
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

      <style dangerouslySetInnerHTML={{
        __html: `
      ` }} />
    </section>
  );
}
