import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";

export const revalidate = 10;

interface Photo {
  id: string;
  src: string;
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log("Fetching project for slug:", slug);

  try {
    const project = await client.fetch(`*[_type == "project" && slug.current == $slug][0] {
      title,
      summary,
      images,
      category,
      type
    }`, { slug });

    if (!project) {
      console.log("Project not found for slug:", slug);
      notFound();
    }

    console.log("Found project:", project.title);

    const projectData = {
      title: project.title,
      description: project.summary || "",
      category: project.category || "architecture",
      type: project.type || "",
      images: (project.images || []).map((img: any, idx: number): Photo => ({
        id: `img${idx}`,
        src: img ? urlFor(img).url() : ""
      })).filter((img: Photo) => img.src !== "")
    };

    return (
      <>
        <main className="pt-24 xs:pt-32 md:pt-48 pb-32 bg-white">
          {/* Project Header Section */}
          <section className="px-6 xs:px-12 md:px-24 mb-16 xs:mb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
              <div className="max-w-4xl">
                <div className="mb-4 flex gap-4">
                  <span className="text-[10px] tracking-[0.3em] font-medium text-black/40 uppercase bg-black/5 px-3 py-1">
                    {projectData.category === 'fabrication' ? '3D Fabrication' : 'Architectural Design'}
                  </span>
                  {projectData.type && (
                    <span className="text-[10px] tracking-[0.3em] font-light text-black/40 uppercase border border-black/10 px-3 py-1">
                      {projectData.type}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl xs:text-5xl md:text-9xl font-thin tracking-tighter text-black leading-[1.1] md:leading-none uppercase">
                  {projectData.title}
                </h1>
              </div>
            </div>
          </section>

          {/* Narrative Description Section */}
          <section className="px-6 xs:px-12 md:px-24 mb-16 xs:mb-32 md:mb-48">
            <div className="max-w-3xl">
              <p className="text-lg md:text-2xl font-thin leading-relaxed text-black/60 italic border-l border-black/10 pl-6 md:pl-12">
                "{projectData.description}"
              </p>
            </div>
          </section>

          {/* Architectural Gallery */}
          <section className="space-y-4 xs:space-y-12 md:space-y-24 px-6 xs:px-12 md:px-24">

            {/* 1. Main Hero Shot - Always first image */}
            {projectData.images.length > 0 && (
              <div className="group">
                <input type="checkbox" id={`lightbox-${projectData.images[0].id}`} className="peer hidden" />
                <label
                  htmlFor={`lightbox-${projectData.images[0].id}`}
                  className="w-full aspect-[4/3] md:aspect-[16/9] bg-surface-container-low relative overflow-hidden group block cursor-zoom-in"
                >
                  <Image
                    src={projectData.images[0].src}
                    alt={projectData.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </label>

                {/* Lightbox for Hero */}
                <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-300 flex items-center justify-center p-4 xs:p-8 md:p-24 cursor-zoom-out">
                  <label htmlFor={`lightbox-${projectData.images[0].id}`} className="absolute inset-0 z-[505]"></label>
                  <label
                    htmlFor={`lightbox-${projectData.images[0].id}`}
                    className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[510] p-4 group cursor-pointer"
                  >
                    <span className="text-[10px] tracking-[0.5em] font-light uppercase block group-hover:translate-x-1 transition-transform">CLOSE ×</span>
                  </label>
                  <div className="relative w-full h-full z-[506] pointer-events-none">
                    <img src={projectData.images[0].src} alt="Lightbox View" className="w-full h-full object-contain select-none shadow-2xl" />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Dynamic Grid for all remaining images */}
            {projectData.images.length > 1 && (
              <div className="grid grid-cols-2 gap-4 xs:gap-12 md:gap-24">
                {projectData.images.slice(1).map((img: Photo, idx: number) => (
                  <div key={img.id} className="group">
                    <input type="checkbox" id={`lightbox-${img.id}`} className="peer hidden" />
                    <label
                      htmlFor={`lightbox-${img.id}`}
                      className="aspect-[3/4] bg-surface-container-low relative overflow-hidden group block cursor-zoom-in"
                    >
                      <Image
                        src={img.src}
                        alt={`Architecture detail ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </label>

                    {/* Lightbox Overlay for each grid item */}
                    <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-300 flex items-center justify-center p-4 xs:p-8 md:p-24 cursor-zoom-out">
                      <label htmlFor={`lightbox-${img.id}`} className="absolute inset-0 z-[505]"></label>
                      <label
                        htmlFor={`lightbox-${img.id}`}
                        className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[510] p-4 group cursor-pointer"
                      >
                        <span className="text-[10px] tracking-[0.5em] font-light uppercase block group-hover:translate-x-1 transition-transform">CLOSE ×</span>
                      </label>
                      <div className="relative w-full h-full z-[506] pointer-events-none">
                        <img src={img.src} alt="Lightbox View" className="w-full h-full object-contain select-none shadow-2xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Bottom Navigation */}
          <section className="mt-32 px-6 xs:px-12 md:px-24 flex justify-between items-center border-t border-black/10 pt-16">
            <Link
              href={`/${projectData.category === 'fabrication' ? 'fabrication' : 'architecture'}`}
              className="text-[10px] tracking-[0.5em] font-light text-black/40 hover:text-black transition-all uppercase flex items-center gap-2"
            >
              <span className="text-lg leading-none">←</span> Back to {projectData.category === 'fabrication' ? 'Fabrication' : 'Architecture'}
            </Link>
            <span className="hidden xs:block text-[10px] tracking-[0.3em] font-light text-black/20 uppercase">
              ChrisPop Designs Inc.
            </span>
          </section>
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    notFound();
  }
}
