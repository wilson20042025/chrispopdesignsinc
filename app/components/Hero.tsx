import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-surface pt-24 md:pt-0 flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-surface-container-low/30 -skew-x-12 translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Typography & Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">

              <h1 className="text-5xl md:text-7xl lg:text-7xl font-thin tracking-tighter text-on-surface leading-[0.9] uppercase">
                Crafting <br />
                <span className="font-light italic text-outline">Digital</span> <br />
                Dimensions
              </h1>
            </div>

            <p className="max-w-md text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
              ChrisPop Designs Incorporated and Innovation merges advanced 3D fabrication with avant-garde architectural principles to redefine the limits of space and form.
            </p>

            <div className="flex items-center gap-8 pt-4">
              <a href="#projects" className="group flex items-center gap-4 text-[10px] tracking-widest uppercase font-semibold">
                <span>View Works</span>
                <span className="w-8 h-px bg-on-surface group-hover:w-12 transition-all duration-300"></span>
              </a>
              <div className="h-12 w-px bg-outline-variant/30"></div>
              <div className="text-[10px] tracking-widest uppercase text-on-surface-variant leading-tight">
                Est. 2024 <br />
                Portfolio v2.0
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full">
              {/* Main Image - Robotic Fabrication */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl z-20 animate-float">
                <Image
                  src="/digital_fabrication_architectural_robotic_arm_1775931259375.png"
                  alt="Robotic architectural fabrication"
                  fill
                  className="object-cover grayscale-0 hover:grayscale transition-all duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Secondary Image - Parametric Texture (Glassmorphism overlap) */}
              <div className="absolute -bottom-8 -left-8 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-xl z-30 border-4 border-surface animate-float-delayed">
                <Image
                  src="/parametric_architectural_texture_detail_1775931276569.png"
                  alt="Parametric texture detail"
                  fill
                  className="object-cover grayscale-0 hover:grayscale transition-all duration-700"
                />
              </div>

              {/* Tertiary Image - Architectural Innovation */}
              <div className="absolute -top-12 -right-8 w-2/3 aspect-[3/2] rounded-2xl overflow-hidden shadow-lg z-10 opacity-80 grayscale-0 hover:grayscale transition-all duration-700 animate-float-slow">
                <Image
                  src="/modern_architectural_innovation_building_1775931655490.png"
                  alt="Modern architectural building"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Technical Detail Badge */}
              <div className="absolute top-4 left-4 z-40 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full border border-outline-variant/30">
                <span className="text-[8px] tracking-[0.3em] font-medium text-on-surface uppercase whitespace-nowrap">
                  3D Print Status: Optimal
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Vertical Metadata */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-12 z-20">
        <span className="text-vertical text-[10px] tracking-[0.8em] font-light text-on-surface-variant uppercase">
          Innovation & Design
        </span>
        <div className="w-px h-24 bg-outline-variant/30"></div>
        <span className="text-vertical text-[10px] tracking-[0.8em] font-light text-on-surface-variant uppercase">
          2024 Series
        </span>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; animation-delay: 1s; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; animation-delay: 2s; }
      ` }} />
    </section>
  );
}
