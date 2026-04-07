import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface FeaturedProject {
  id: string;
  title: string;
  image: any;
  slug: string;
}

export default async function ProjectsPreview() {
  const featuredProjects: FeaturedProject[] = await client.fetch(`*[_type == "project"] | order(_createdAt desc)[0...6] {
    "id": _id,
    title,
    "image": images[0],
    "slug": slug.current
  }`);

  return (
    <section className="py-16 xs:py-20 md:pt-16 md:pb-32 px-6 xs:px-12 md:px-24 bg-white">
      <div className="flex justify-between items-end mb-12 xs:mb-24">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-medium tracking-tight text-black leading-none">
          Recent Works
        </h2>
      </div>

      {/* Architectural Preview Grid - Pure CSS Checkbox logic */}
      <div className="grid grid-cols-2 gap-4 xs:gap-12 md:gap-24">
        {featuredProjects.map((project: FeaturedProject, index: number) => (
          <div key={index} className="group overflow-hidden">
            {/* HIDDEN CHECKBOX TRIGGER */}
            <input type="checkbox" id={`home-lightbox-${project.id}`} className="peer hidden" />

            <label 
              htmlFor={`home-lightbox-${project.id}`}
              className="aspect-[3/4] md:aspect-[3/2] bg-[#faf9f6] overflow-hidden relative cursor-zoom-in block"
            >
              <Image 
                alt={project.title} 
                src={project.image ? urlFor(project.image).url() : ""}
                fill
                className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${
                  index < 2 ? "grayscale-0 contrast-100" : "grayscale hover:grayscale-0 contrast-110"
                }`}
              />
            </label>
            
            <div className="mt-4 xs:mt-8">
              <Link href={`/projects/${project.slug}`} className="block group/link">
                <div className="flex flex-col xs:flex-row justify-between items-baseline border-b border-black/10 pb-4 gap-2">
                  <h3 className="text-lg xs:text-2xl font-light tracking-tight text-black leading-tight group-hover/link:opacity-60 transition-opacity">
                    {project.title}
                  </h3>
                </div>
              </Link>
            </div>

            {/* LIGHTBOX OVERLAY (RESET ON REFRESH) */}
            <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-300 flex items-center justify-center p-4 xs:p-8 md:p-24 cursor-zoom-out">
              <label 
                htmlFor={`home-lightbox-${project.id}`}
                className="absolute inset-0 z-[505] cursor-zoom-out"
              ></label>
              
              <label 
                htmlFor={`home-lightbox-${project.id}`}
                className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[510] p-4 group cursor-pointer"
              >
                <span className="text-[10px] tracking-[0.5em] font-light uppercase block group-hover:translate-x-1 transition-transform">CLOSE ×</span>
              </label>

              <div className="relative w-full h-full z-[506] pointer-events-none">
                <img 
                  src={project.image ? urlFor(project.image).url() : ""} 
                  alt={project.title} 
                  className="w-full h-full object-contain select-none shadow-2xl" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 xs:mt-24 flex justify-center">
        <Link 
          href="/projects"
          className="text-[10px] tracking-[0.5em] font-light text-black/40 hover:text-black transition-all duration-500 uppercase border-b border-transparent hover:border-black pb-2"
        >
          VIEW ARCHIVE // ALL PROJECTS
        </Link>
      </div>
    </section>
  );
}
