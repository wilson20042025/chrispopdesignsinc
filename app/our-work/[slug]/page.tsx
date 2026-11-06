import Footer from "../../components/Footer";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import ProjectGallery from "./ProjectGallery";
import ProjectSpecs from "./ProjectSpecs";
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
        <ProjectSpecs
          title={projectData.title}
          category={projectData.category}
          details={projectData.details}
        />

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
