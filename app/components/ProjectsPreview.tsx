import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/data";
import { ReactNode } from "react";

interface FeaturedProject {
  id: string;
  title: string;
  image: string;
  slug: string;
  category?: string;
}

interface ProjectsPreviewProps {
  category?: "fabrication" | "architecture" | string;
  title?: ReactNode;
  subtitle?: string;
  isFullList?: boolean;
  id?: string;
  hideHeader?: boolean;
}

export default async function ProjectsPreview({
  category,
  title,
  subtitle,
  isFullList,
  id,
  hideHeader,
}: ProjectsPreviewProps) {
  const allLoaded = await getProjects();

  let filtered = category
    ? allLoaded.filter((p) => p.category?.toLowerCase() === category.toLowerCase())
    : allLoaded;

  const featuredProjects: FeaturedProject[] = filtered.map((p) => ({
    id: p.id,
    title: p.title,
    image: p.images?.[0] || "/modern_architectural_innovation_building_1775931655490.png",
    slug: p.slug,
    category: p.category,
  }));

  const allProjects = isFullList
    ? featuredProjects
    : featuredProjects.slice(0, 4);

  return (
    <section id={id} className="relative pt-8 pb-24 md:pt-12 md:pb-32 bg-[#fafafa] overflow-hidden border-t border-black/10">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative Grid Line */}
      <div className="absolute top-0 right-1/2 w-px h-full bg-black/10 hidden md:block z-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {!hideHeader && (
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-8">
            <div className="space-y-4 max-w-3xl">
              {subtitle !== "" && (
                <span className="text-[10px] tracking-[0.5em] font-medium text-black/40 uppercase block">
                  {subtitle || (category === 'fabrication' ? 'The Workshop' : category === 'architecture' ? 'The Studio' : 'Our Portfolio')}
                </span>
              )}
              <h2 className="text-4xl md:text-7xl font-thin tracking-tighter text-black leading-[0.85] uppercase">
                {title || (
                  <>
                    3D Fabrications & <br />
                    <span className="font-light italic text-transparent [-webkit-text-stroke:1px_black]">Architectural</span> Designs
                  </>
                )}
              </h2>
            </div>
          </div>
        )}

        {/* Staggered Editorial Grid */}
        {allProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-black/15 p-12 bg-white/50">
            <span className="text-[10px] tracking-[0.4em] font-medium text-black/40 uppercase block mb-3">
              Portfolio
            </span>
            <p className="text-sm md:text-base font-light text-black/60">
              No projects published in this section yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-12 md:gap-y-12">
            {allProjects.map((project: FeaturedProject, index: number) => {
              const isWide = index % 4 === 0 || index % 4 === 3;
              const columnSpan = isWide ? "md:col-span-8" : "md:col-span-4";

              return (
                <div
                  key={project.id}
                  className={`group relative ${columnSpan}`}
                >
                  <div className="relative overflow-hidden border border-black/10 p-2 sm:p-4 bg-[#fafafa]">
                    <Link
                      href={`/our-work/${project.slug}`}
                      className={`block relative overflow-hidden bg-black/5 transition-all duration-700 ease-out cursor-pointer ${
                        isWide ? "aspect-[21/9]" : "aspect-[4/5]"
                      }`}
                    >
                      <Image
                        alt={project.title}
                        src={project.image}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-105"
                      />

                      {/* Mobile visible overlay / Desktop hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-4 sm:p-8 md:p-12">
                        <div className="translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700">
                          <h4 className="text-xl sm:text-2xl md:text-4xl font-thin text-white tracking-tighter leading-none">
                            {project.title}
                          </h4>
                          <div className="mt-4 md:mt-6 flex items-center gap-2 text-white/80 md:text-white/60">
                            <span className="text-[10px] tracking-widest uppercase font-light">View</span>
                            <div className="w-8 h-px bg-white/60 md:bg-white/40 md:group-hover:w-12 transition-all duration-700" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
