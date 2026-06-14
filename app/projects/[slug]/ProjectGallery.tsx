"use client";

import { useState } from "react";
import Image from "next/image";

interface Photo {
  id: string;
  src: string;
}

export default function ProjectGallery({ images, title }: { images: Photo[], title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <section className="space-y-6 xs:space-y-8 md:space-y-8 px-6 xs:px-12 md:px-24">
        {/* 1. Main Hero Shot */}
        {images.length > 0 && (
          <div 
            className="w-full aspect-[3/2] md:aspect-[3/1] bg-surface-container-low relative overflow-hidden group block cursor-zoom-in"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={images[0].src}
              alt={title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        )}

        {/* 2. Dynamic Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-4 xs:gap-12 md:gap-12">
            {images.slice(1).map((img, idx) => (
              <div 
                key={img.id}
                className="aspect-[4/5] md:aspect-[4/3] bg-surface-container-low relative overflow-hidden group block cursor-zoom-in"
                onClick={() => openLightbox(idx + 1)}
              >
                <Image
                  src={img.src}
                  alt={`${title} detail ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl transition-all duration-300 flex items-center justify-center p-4 xs:p-8 md:p-8 cursor-zoom-out"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[510] p-4 group cursor-pointer"
          >
            <span className="text-[10px] tracking-[0.5em] font-light uppercase block group-hover:translate-x-1 transition-transform">CLOSE ×</span>
          </button>

          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-[510] p-4"
              >
                <span className="material-symbols-outlined text-4xl font-light">west</span>
              </button>
              
              <button 
                onClick={nextImage}
                className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-[510] p-4"
              >
                <span className="material-symbols-outlined text-4xl font-light">east</span>
              </button>
            </>
          )}

          <div className="relative w-full h-full z-[506] pointer-events-none flex items-center justify-center">
            <img 
              src={images[lightboxIndex].src} 
              alt="Lightbox View" 
              className="max-w-full max-h-full object-contain select-none shadow-2xl" 
            />
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-[10px] tracking-[0.3em] font-light uppercase">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
