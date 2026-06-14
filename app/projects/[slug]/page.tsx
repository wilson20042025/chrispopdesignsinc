import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import ProjectGallery from "./ProjectGallery";

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
        <main className="pt-16 xs:pt-20 md:pt-24 pb-16 bg-white">
          {/* Project Header Section */}
          <section className="px-6 xs:px-12 md:px-24 mb-8 xs:mb-16">
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
                <h1 className="text-3xl xs:text-5xl md:text-7xl lg:text-8xl font-thin tracking-tighter text-black leading-[1.1] md:leading-none uppercase">
                  {projectData.title}
                </h1>
              </div>
            </div>
          </section>

          {/* Narrative Description Section */}
          <section className="px-6 xs:px-12 md:px-24 mb-8 xs:mb-12 md:mb-20">
            <div className="max-w-3xl">
              <p className="text-lg md:text-2xl font-thin leading-relaxed text-black/60 italic border-l border-black/10 pl-6 md:pl-12">
                "{projectData.description}"
              </p>
            </div>
          </section>

          {/* Architectural Gallery */}
          <ProjectGallery images={projectData.images} title={projectData.title} />

          {/* Bottom Navigation */}
          <section className="mt-20 px-6 xs:px-12 md:px-24 flex justify-between items-center border-t border-black/10 pt-12">
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
