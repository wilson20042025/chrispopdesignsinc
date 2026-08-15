"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const stories = [
    {
      title: "Why Do We Exist?",
      text: "We are a team of passionate architects and precision fabricators. We believe that the most inspiring spaces are born from the perfect synergy between architectural design and fabrication technologies."
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
    <section className="relative min-h-screen w-full overflow-hidden bg-[#fafafa]  pt-24 md:pt-0 flex items-center selection:bg-black selection:text-white  ">

      {/* Architectural Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] "
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}>
      </div>

      {/* Animated Blueprint Lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/3 left-0 w-full h-[1px] bg-black/10  origin-left"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute top-0 left-1/4 w-[1px] h-full bg-black/10  origin-top"
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Typography & Narrative */}
          <div className="lg:col-span-7 space-y-12 h-full flex flex-col justify-center">

            {/* MOBILE ONLY: Original Static Text */}
            <div className="lg:hidden space-y-12">
              <div className="space-y-6">
                <motion.div className="overflow-hidden">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block text-[10px] tracking-[0.3em] font-medium text-black/50  uppercase mb-4"
                  >
                    Project 01 // Masterplan
                  </motion.span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-black  leading-[0.9] uppercase relative">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    className="block"
                  >
                    Crafting
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    className="block font-light italic text-transparent [-webkit-text-stroke:1px_black] "
                  >
                    Digital
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    className="block"
                  >
                    Dimensions
                  </motion.span>
                </h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="max-w-md text-sm md:text-base text-black/60  font-light leading-relaxed border-l border-black/20  pl-6"
              >
                Chris Pop Designs and Innovation is a multi-disciplinary studio specializing in architectural design, rapid prototyping, CNC routing, and advanced 3D fabrication.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex items-center gap-8 pt-4"
              >
                <Link href="#projects" className="group flex items-center gap-4 text-[10px] tracking-widest uppercase font-semibold text-black  relative">
                  <span>View Works</span>
                  <span className="w-8 h-[1px] bg-black  group-hover:w-16 transition-all duration-500 ease-out"></span>

                  {/* Architectural node dot */}
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-black  bg-transparent group-hover:translate-x-8 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100" />
                </Link>
                <div className="h-12 w-[1px] bg-black/20 "></div>
                <div className="text-[10px] tracking-widest uppercase text-black/50  leading-tight font-mono">
                  Est. 2024 <br />
                  Scale 1:100
                </div>
              </motion.div>
            </div>

            {/* DESKTOP ONLY: Narrative Slider */}
            <div className="hidden lg:flex flex-col justify-center h-full gap-6 py-24">
              <div className="relative">
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

              <div className="flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className="mb-6"
                  >
                    <p className="text-sm md:text-base font-light text-black/60  leading-relaxed border-l border-black/20  pl-6 max-w-lg">
                      {stories[currentSlide].text}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between items-end border-t border-black/10  pt-8 mt-auto pr-12">
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
                    <div className="text-[10px] font-mono mx-2 text-black/30  hidden md:block">
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

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative mt-16 lg:mt-0">
            {/* Main structural bounding box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="relative aspect-[4/5] w-full p-4 border border-black/10  group"
            >
              {/* Corner crosshairs */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-black/40 " />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-black/40 " />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-black/40 " />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-black/40 " />

              {/* Main Image */}
              <div className="relative w-full h-full overflow-hidden">
                <motion.div
                  initial={{ scale: 1.2, filter: "blur(10px) grayscale(100%)" }}
                  animate={{ scale: 1, filter: "blur(0px) grayscale(0%)" }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                  className="w-full h-full"
                >
                  <Image
                    src="/digital_fabrication_architectural_robotic_arm_1775931259375.png"
                    alt="Robotic architectural fabrication"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>

                {/* Scanning line animation */}
                <motion.div
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{
                    duration: 3,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 5
                  }}
                  className="absolute left-0 w-full h-[2px] bg-white/50 blur-[1px] shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 mix-blend-overlay hidden group-hover:block"
                />
              </div>

              {/* Technical Detail Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute top-8 -right-12 z-40 bg-white/80  backdrop-blur-md px-4 py-2 border border-black/10  hidden md:block shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] tracking-[0.3em] font-medium text-black  uppercase whitespace-nowrap">
                    Fabrication
                  </span>
                  <span className="text-[10px] font-mono text-black/50 ">
                    STATUS: ACTIVE
                  </span>
                </div>
              </motion.div>

              {/* Secondary Image - overlapping */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute -bottom-12 -left-12 w-2/3 aspect-[4/3] border border-black/10  p-2 bg-[#fafafa]  shadow-xl z-30 hidden md:block"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="/parametric_architectural_texture_detail_1775931276569.png"
                    alt="Parametric texture detail"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
