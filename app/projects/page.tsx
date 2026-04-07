import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface Project {
  id: string;
  title: string;
  image: any;
  slug: string;
}

export default async function ProjectsPage() {
  const projects: Project[] = await client.fetch(`*[_type == "project"] | order(_createdAt desc) {
    "id": _id,
    title,
    "image": images[0],
    "slug": slug.current
  }`);

  return (
    <>
      <Header />
      <main className="pt-24 xs:pt-32 md:pt-48 pb-32 px-6 xs:px-12 md:px-24 bg-white relative">
        <section className="mb-12 xs:mb-24">
          <span className="text-[10px] tracking-[0.5em] font-light text-black/40 uppercase mb-4 block">Archive</span>
          <h1 className="text-3xl xs:text-5xl md:text-8xl font-thin tracking-tighter text-black leading-none uppercase">
            SELECTED<br/>PROJECTS
          </h1>
        </section>

        <div className="grid grid-cols-2 gap-4 xs:gap-12 md:gap-24">
          {projects.map((project) => (
            <div key={project.id} className="group overflow-hidden">
              {/* HIDDEN CHECKBOX TRIGGER */}
              <input type="checkbox" id={`lightbox-${project.id}`} className="peer hidden" />

              {/* IMAGE WRAPPER AS LABEL */}
              <label 
                htmlFor={`lightbox-${project.id}`}
                className="aspect-[3/4] bg-surface-container-low overflow-hidden relative cursor-zoom-in block"
              >
                <div className="h-full w-full bg-surface-variant/20 group-hover:scale-105 transition-transform duration-1000 relative">
                  <Image 
                    src={project.image ? urlFor(project.image).url() : ""} 
                    alt={project.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </label>
              
              <div className="mt-4 xs:mt-8">
                {project.slug ? (
                  <Link href={`/projects/${project.slug}`} className="block group/link">
                    <div className="flex flex-col xs:flex-row justify-between items-baseline border-b border-outline-variant/30 pb-4 gap-2">
                      <h3 className="text-lg xs:text-2xl font-light tracking-tight text-black leading-tight uppercase group-hover/link:opacity-60 transition-opacity">
                        {project.title}
                      </h3>
                    </div>
                  </Link>
                ) : (
                  <div className="flex flex-col xs:flex-row justify-between items-baseline border-b border-outline-variant/30 pb-4 gap-2 opacity-40">
                    <h3 className="text-lg xs:text-2xl font-light tracking-tight text-black leading-tight uppercase">
                      {project.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* PURE CSS LIGHTBOX (RESET ON REFRESH BY DEFAULT) */}
              <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-500 flex items-center justify-center p-4 xs:p-8 md:p-24 cursor-zoom-out">
                {/* Background close overlay */}
                <label 
                  htmlFor={`lightbox-${project.id}`}
                  className="absolute inset-0 z-[505]"
                ></label>
                
                {/* Close Button label */}
                <label 
                  htmlFor={`lightbox-${project.id}`}
                  className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[510] p-4 group cursor-pointer"
                >
                  <span className="text-[10px] tracking-[0.5em] font-light uppercase block group-hover:translate-x-1 transition-transform">CLOSE ×</span>
                </label>

                <div className="relative w-full h-full z-[506] pointer-events-none">
                  <img 
                    src={project.image ? urlFor(project.image).url() : ""} 
                    alt="Fullscreen" 
                    className="w-full h-full object-contain select-none shadow-2xl" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
