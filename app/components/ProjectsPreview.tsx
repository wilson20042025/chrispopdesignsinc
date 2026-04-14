import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface FeaturedProject {
  id: string;
  title: string;
  image: any;
  slug: string;
  category?: string;
}

export default async function ProjectsPreview() {
  const featuredProjects: FeaturedProject[] = await client.fetch(`*[_type == "project"] | order(select(category == "fabrication" => 1, 0) desc, _createdAt desc)[0...6] {
    "id": _id,
    title,
    "image": images[0],
    "slug": slug.current,
    category
  }`) || [];

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

  // Merge projects, prioritizing fetched ones but ensuring our new high-tech images are included
  const allProjects = [...featuredProjects, ...staticProjects].slice(0, 7);

  return (
    <section id="projects" className="py-10 md:py-14 px-6 xs:px-12 md:px-24 bg-surface relative overflow-hidden">
      {/* Decorative Grid Line */}
      <div className="absolute top-0 right-1/2 w-px h-full bg-outline-variant/10 hidden md:block" />

      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-14 gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] tracking-[0.5em] font-medium text-primary uppercase block">
              Our Portfolio
            </span>
            <h2 className="text-4xl md:text-7xl font-thin tracking-tighter text-on-surface leading-[0.85] uppercase">
              3D Fabrications & <br />
              <span className="font-light italic text-outline">Architectural</span> Designs
            </h2>
          </div>
        </div>

        {/* Staggered Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-12 md:gap-y-20">
          {allProjects.map((project: FeaturedProject, index: number) => {
            const isWide = index === 0 || index === 3;
            const isTall = index === 1 || index === 4;

            return (
              <div
                key={project.id}
                className={`group relative ${isWide ? "md:col-span-12 lg:col-span-8" :
                  isTall ? "md:col-span-6 lg:col-span-4" :
                    "md:col-span-6 lg:col-span-4"
                  } ${index % 2 !== 0 ? "md:mt-12" : ""}`}
              >
                <div className="relative overflow-hidden">
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`block relative overflow-hidden bg-surface-container-high transition-all duration-700 ease-out cursor-pointer ${isWide ? "aspect-[21/9]" : "aspect-[4/3]"
                      }`}
                  >
                    <Image
                      alt={project.title}
                      src={typeof project.image === 'string' ? project.image : (project.image ? urlFor(project.image).url() : "")}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-105 group-hover:opacity-90 grayscale-0 group-hover:grayscale"
                    />

                    {/* Hover Overlay Text */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8 md:p-12">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                        <span className="text-[10px] tracking-[0.5em] font-medium text-white/50 uppercase block mb-3">
                          {project.title}
                        </span>
                        <h4 className="text-2xl md:text-4xl font-thin text-white tracking-tighter uppercase leading-none">
                          EXPLORE THIS PROJECT
                        </h4>
                      </div>
                    </div>
                  </Link>

                  {/* Desktop Metadata Floating alongside - Hidden on desktop to prioritize hover state */}
                  <div className="mt-8 md:hidden flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline-variant/20 pb-6 gap-4">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        <h3 className="text-xl md:text-2xl font-light tracking-tighter text-on-surface uppercase group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
