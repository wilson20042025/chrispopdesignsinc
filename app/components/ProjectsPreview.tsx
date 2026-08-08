import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { ReactNode } from "react";

interface FeaturedProject {
  id: string;
  title: string;
  image: any;
  slug: string;
  category?: string;
}

interface ProjectsPreviewProps {
  category?: "fabrication" | "architecture";
  title?: ReactNode;
  subtitle?: string;
  isFullList?: boolean;
  id?: string;
  hideHeader?: boolean;
}

export default async function ProjectsPreview({ category, title, subtitle, isFullList, id, hideHeader }: ProjectsPreviewProps) {
  const query = category
    ? `*[_type == "project" && category->slug.current == "${category}"] | order(_createdAt desc)${isFullList ? "" : "[0...6]"} {
        "id": _id,
        title,
        "image": images[0],
        "slug": slug.current,
        "category": category->slug.current
      }`
    : `*[_type == "project"] | order(select(category->slug.current == "fabrication" => 1, 0) desc, _createdAt desc)[0...7] {
        "id": _id,
        title,
        "image": images[0],
        "slug": slug.current,
        "category": category->slug.current
      }`;

  const featuredProjects: FeaturedProject[] = await client.fetch(query) || [];


  const allProjects = isFullList
    ? featuredProjects
    : featuredProjects.slice(0, 4);

  return (
    <section id={id} className="relative pt-8 pb-24 md:pt-12 md:pb-32 px-6 xs:px-12 md:px-24 bg-[#fafafa] dark:bg-[#0a0a0a] overflow-hidden border-t border-black/10 dark:border-white/10">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}>
      </div>

      {/* Decorative Grid Line */}
      <div className="absolute top-0 right-1/2 w-px h-full bg-black/10 dark:bg-white/10 hidden md:block z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {!hideHeader && (
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-8">
            <div className="space-y-4 max-w-3xl">
              {subtitle !== "" && (
                <span className="text-[10px] tracking-[0.5em] font-medium text-black/40 dark:text-white/40 uppercase block">
                  {subtitle || (category === 'fabrication' ? 'The Workshop' : category === 'architecture' ? 'The Studio' : 'Our Portfolio')}
                </span>
              )}
              <h2 className="text-4xl md:text-7xl font-thin tracking-tighter text-black dark:text-white leading-[0.85] uppercase">
                {title || (
                  <>
                    3D Fabrications & <br />
                    <span className="font-light italic text-transparent [-webkit-text-stroke:1px_black] dark:[-webkit-text-stroke:1px_white]">Architectural</span> Designs
                  </>
                )}
              </h2>
            </div>
          </div>
        )}

        {/* Staggered Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-12 md:gap-y-12">
          {allProjects.map((project: FeaturedProject, index: number) => {
            const isWide = index % 4 === 0 || index % 4 === 3;
            const columnSpan = isWide ? "md:col-span-8" : "md:col-span-4";

            return (
              <div
                key={project.id}
                className={`group relative ${columnSpan}`}
              >
                <div className="relative overflow-hidden border border-black/10 dark:border-white/10 p-2 sm:p-4 bg-[#fafafa] dark:bg-[#0a0a0a]">
                  <Link
                    href={`/our-work/${project.slug}`}
                    className={`block relative overflow-hidden bg-black/5 dark:bg-white/5 transition-all duration-700 ease-out cursor-pointer ${isWide ? "aspect-[21/9]" : "aspect-[4/5]"
                      }`}
                  >
                    <Image
                      alt={project.title}
                      src={typeof project.image === 'string' ? project.image : (project.image ? urlFor(project.image).url() : "")}
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
      </div>
    </section>
  );
}
