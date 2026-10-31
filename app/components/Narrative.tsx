"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Narrative() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const stories = [
    {
      title: "Design Philosophy",
      text: "We are a team of passionate architects and precision fabricators. We believe that the most inspiring spaces are born from the perfect synergy between architectural design and fabrication technologies."
    },
    {
      title: "Advanced Fabrication",
      text: "By prioritizing 3D fabrication, we bring an unprecedented level of detail to our work. Our approach blends digital precision with artisanal care to create high-impact prototypes, models, and spatial elements."
    },
    {
      title: "Strategic Partnerships",
      text: "Whether you're developing a complex architectural project or require expert 3D fabrication and prototyping solutions, we're ready to translate your vision into a physical masterpiece."
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % stories.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);

  return (
    <section className="lg:hidden relative pt-28 pb-16 md:pt-36 md:pb-32 px-6 xs:px-12 md:px-24 bg-[#fafafa]  overflow-hidden border-t border-black/10 ">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] "
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Title Area */}
          <div className="lg:col-span-7 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <div className="flex flex-col gap-6">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-thin tracking-tighter leading-[0.9] text-black  uppercase pr-4">
                    {stories[currentSlide].title}
                  </h2>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-between h-full mt-4 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="mb-6"
              >
                <p className="text-sm md:text-base font-light text-black/60  leading-relaxed">
                  {stories[currentSlide].text}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-end border-t border-black/10  pt-8 mt-auto">
              {/* Call to action */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide < 2 ? "about" : "contact"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {currentSlide < 2 ? (
                    <Link
                      href="/about"
                      className="group flex items-center gap-4 text-[10px] tracking-widest uppercase font-semibold text-black  relative"
                    >
                      <span>About Us</span>
                      <span className="w-8 h-[1px] bg-black  group-hover:w-16 transition-all duration-500 ease-out"></span>
                    </Link>
                  ) : (
                    <Link
                      href="/contact"
                      className="group flex items-center gap-4 text-[10px] tracking-widest uppercase font-semibold text-black  relative"
                    >
                      <span>Inquire // Contact</span>
                      <span className="w-8 h-[1px] bg-black  group-hover:w-16 transition-all duration-500 ease-out"></span>
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls (Custom SVGs) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 border border-black/20  flex items-center justify-center hover:bg-black hover:text-white   transition-all duration-300"
                  aria-label="Previous section"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <div className="text-[10px] font-mono mx-2 text-black  hidden md:block">
                  0{currentSlide + 1} / 0{stories.length}
                </div>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 border border-black/20  flex items-center justify-center hover:bg-black hover:text-white   transition-all duration-300"
                  aria-label="Next section"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
