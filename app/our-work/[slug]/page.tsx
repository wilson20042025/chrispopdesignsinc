import Footer from "../../components/Footer";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import ProjectGallery from "./ProjectGallery";
import { Metadata } from "next";

export const revalidate = 0;

interface Photo {
  id: string;
  src: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Chris Pop Design Innovation`,
    description: project.summary || "Explore our architectural and fabrication projects.",
    openGraph: {
      title: `${project.title} | Chris Pop Design`,
      description: project.summary || "Explore our architectural and fabrication projects.",
      images: project.images && project.images[0] ? [project.images[0]] : [],
    },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectData = {
    title: project.title,
    description: project.summary || "",
    category: project.categoryTitle || project.category.toUpperCase() || "Project",
    images: (project.images || []).map((imgSrc: string, idx: number): Photo => ({
      id: `img${idx}`,
      src: imgSrc,
    })).filter((img: Photo) => !!img.src),
    details: project.details || [],
  };

  return (
    <>
      <main className="pt-16 xs:pt-20 md:pt-24 pb-16 bg-white min-h-screen">


        {/* Project Container / Specifications */}
        <section className="px-6 xs:px-12 md:px-24 mb-8 xs:mb-12 md:mb-16">
          <div className="border border-black/10 p-6 bg-[#fafafa]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-black uppercase">
                {projectData.title}
              </h1>
              {projectData.category && (
                <span className="text-[10px] tracking-[0.3em] font-medium text-black/40 uppercase bg-black/5 px-3 py-1 self-start sm:self-auto">
                  {projectData.category}
                </span>
              )}
            </div>
            {projectData.details.length > 0 && (
              <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-4 border-t border-black/5">
                {projectData.details.map((detail, idx) => (
                  <div key={idx} className="border-b border-black/5 pb-2">
                    <dt className="text-[10px] tracking-wider text-black/40 uppercase font-medium">
                      {detail.label}
                    </dt>
                    <dd className="text-sm font-light text-black mt-0.5">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>

        {/* Architectural Gallery */}
        <ProjectGallery
          images={projectData.images}
          title={projectData.title}
          description={projectData.description}
        />

        {/* Bottom Navigation */}
        <section className="mt-20 px-6 xs:px-12 md:px-24 flex justify-between items-center border-t border-black/10 pt-12">
          <Link
            href="/our-work"
            className="text-[10px] tracking-[0.5em] font-light text-black/40 hover:text-black transition-all uppercase flex items-center gap-2"
          >
            <span className="text-lg leading-none">←</span> Back Page
          </Link>
          <span className="hidden xs:block text-[10px] tracking-[0.3em] font-light text-black/20 uppercase">
            ChrisPop Designs Inc.
          </span>
        </section>
      </main>
      <Footer />
    </>
  );
}
