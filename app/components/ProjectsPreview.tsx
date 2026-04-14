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
}

export default async function ProjectsPreview({ category, title, subtitle, isFullList, id }: ProjectsPreviewProps) {
  const query = category 
    ? `*[_type == "project" && category == "${category}"] | order(_createdAt desc)${isFullList ? "" : "[0...6]"} {
        "id": _id,
        title,
        "image": images[0],
        "slug": slug.current,
        category
      }`
    : `*[_type == "project"] | order(select(category == "fabrication" => 1, 0) desc, _createdAt desc)[0...7] {
        "id": _id,
        title,
        "image": images[0],
        "slug": slug.current,
        category
      }`;

  const featuredProjects: FeaturedProject[] = await client.fetch(query) || [];

  const staticProjects: FeaturedProject[] = [
    {
      id: "laser-spec-01",
      title: "Laser Precision Fabrication",
      image: "/laser_cutting.png",
      slug: "laser-precision",
      category: "fabrication"
    },
    {
      id: "drone-spec-02",
      title: "Aerial Architectural Survey",
      image: "/architectural_drone.png",
      slug: "drone-survey",
      category: "architecture"
    },
    {
      id: "robot-spec-03",
      title: "Robotic Prototype Assembly",
      image: "/robotic_fabrication.png",
      slug: "robotic-fabrication",
      category: "fabrication"
    },
    {
      id: "parametric-spec-05",
      title: "Parametric Facade Research",
      image: "/parametric_architectural_texture_detail_1775931276569.png",
      slug: "parametric-research",
      category: "fabrication"
    },
    {
      id: "smart-spec-04",
      title: "Smart Building Systems",
      image: "/modern_architectural_innovation_building_1775931655490.png",
      slug: "smart-systems",
      category: "architecture"
    }
  ];

  // Merge projects, filtering static by category if specified
  const filteredStatic = category 
    ? staticProjects.filter(p => p.category === category)
    : staticProjects;

  const allProjects = isFullList 
    ? [...featuredProjects, ...filteredStatic]
    : [...featuredProjects, ...filteredStatic].slice(0, 7);

  return (
    <section id={id} className="py-20 md:py-32 px-6 xs:px-12 md:px-24 bg-surface relative overflow-hidden">
      {/* Decorative Grid Line */}
      <div className="absolute top-0 right-1/2 w-px h-full bg-outline-variant/10 hidden md:block" />

      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div className="space-y-4 max-w-3xl">
            <span className="text-[10px] tracking-[0.5em] font-medium text-primary uppercase block">
              {subtitle || (category === 'fabrication' ? 'The Workshop' : category === 'architecture' ? 'The Studio' : 'Our Portfolio')}
            </span>
            <h2 className="text-4xl md:text-8xl font-thin tracking-tighter text-on-surface leading-[0.85] uppercase">
              {title || (
                <>
                  3D Fabrications & <br />
                  <span className="font-light italic text-outline">Architectural</span> Designs
                </>
              )}
            </h2>
          </div>
        </div>

        {/* Staggered Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-12 md:gap-y-24">
          {allProjects.map((project: FeaturedProject, index: number) => {
            const isWide = index % 3 === 0;
            const columnSpan = isWide ? "md:col-span-12 lg:col-span-8" : "md:col-span-6 lg:col-span-4";

            return (
              <div
                key={project.id}
                className={`group relative ${columnSpan} ${index % 2 !== 0 && !isWide ? "md:mt-24" : ""}`}
              >
                <div className="relative overflow-hidden">
                  <Link 
                    href={`/projects/${project.slug}`}
                    className={`block relative overflow-hidden bg-surface-container-high transition-all duration-700 ease-out cursor-pointer ${isWide ? "aspect-[21/9]" : "aspect-[4/5]"
                      }`}
                  >
                    <Image
                      alt={project.title}
                      src={typeof project.image === 'string' ? project.image : (project.image ? urlFor(project.image).url() : "")}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-105"
                    />

                    {/* Hover Overlay Text */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8 md:p-12">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                        <span className="text-[10px] tracking-[0.5em] font-medium text-white/50 uppercase block mb-3">
                          {project.category === 'fabrication' ? '3D Fabrication' : 'Architectural Design'}
                        </span>
                        <h4 className="text-2xl md:text-4xl font-thin text-white tracking-tighter uppercase leading-none">
                          {project.title}
                        </h4>
                        <div className="mt-6 flex items-center gap-2 text-white/60">
                          <span className="text-[10px] tracking-widest uppercase font-light">Explore Project</span>
                          <div className="w-8 h-px bg-white/40 group-hover:w-12 transition-all duration-700" />
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
