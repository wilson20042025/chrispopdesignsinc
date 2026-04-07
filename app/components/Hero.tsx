import Image from "next/image";

export default function Hero() {
  const images = [
    "https://res.cloudinary.com/diqqmnnkv/image/upload/v1775588960/4-4_dedy35.jpg",
    "https://res.cloudinary.com/diqqmnnkv/image/upload/v1775588190/7-1_mynluc.jpg",
    "https://res.cloudinary.com/diqqmnnkv/image/upload/v1775589810/5-3_tblbu8.jpg",
    "https://res.cloudinary.com/diqqmnnkv/image/upload/v1775589806/2-6_mbftbc.jpg"
  ];

  return (
    <>
      {/* 
        High-Impact Hero Slider 
        - CSS Snap Scroll for 'Zero-JS' performance and native mobile swipe feel.
      */}
      <main className="relative h-auto md:h-screen w-full overflow-hidden bg-white pt-[72px] md:pt-0">
        
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full cursor-grab active:cursor-grabbing">
          {images.map((src, index) => (
            <div key={index} className="min-w-full w-full h-auto md:h-full snap-start snap-always relative">
              {/* Mobile: Natural Image Fit / Desktop: Fullscreen Cover */}
              <div className="relative md:absolute inset-0 z-0 w-full md:h-full">
                <div className="md:hidden block w-full relative bg-[#0a0a0a]">
                  <img 
                    alt={`Architectural work ${index + 1}`} 
                    className="w-full h-auto opacity-65 select-none block" 
                    src={src}
                  />
                </div>
                <div className="hidden md:block absolute inset-0">
                  <Image 
                    alt={`Architectural work ${index + 1}`} 
                    className="w-full h-full object-cover opacity-90 select-none" 
                    src={src}
                    fill
                    priority={index === 0}
                  />
                </div>
              </div>

              {/* Intensified Vignette - Desktop only for branding depth */}
              <div className="hidden md:block absolute inset-0 z-1 pointer-events-none shadow-[inset_0_0_12rem_rgba(47,52,48,0.4)]"></div>

              {/* SWIPE & VIEW Overlay - Mobile Only (Only for first slide) */}
              {index === 0 && (
                <div className="md:hidden absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
                  <span className="text-[10px] tracking-[0.5em] font-light text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                    Swipe & View
                  </span>
                  <div className="w-12 h-px bg-white/40 shadow-sm"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Global Editorial Overlays - Positioned above the slider */}
        <div className="hidden md:flex absolute inset-0 z-10 flex-col justify-center items-center px-6 pointer-events-none">
          <div className="text-center max-w-4xl space-y-4">
            <span className="block text-[10px] tracking-[0.5em] font-light text-white uppercase">
              Vision & Precision
            </span>
            <h1 className="text-8xl font-thin tracking-tight text-white leading-none uppercase">
              CRAFTING SPATIAL SILENCE
            </h1>
          </div>
        </div>

        {/* Desktop Lateral Location Meta */}
        <div className="absolute bottom-12 left-12 z-20 hidden md:block pointer-events-none">
          <p className="text-[10px] tracking-widest font-light text-white leading-relaxed uppercase">
            PROJECT 041 // REYKJAVÍK<br/>
            STATUS: COMPLETED 2024
          </p>
        </div>

        {/* CSS for no-scrollbar across browsers */}
        <style dangerouslySetInnerHTML={{ __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        ` }} />
      </main>
    </>
  );
}
