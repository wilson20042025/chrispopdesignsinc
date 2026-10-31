import ProjectsPreview from "../../../components/ProjectsPreview";
import Footer from "../../../components/Footer";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug } from "@/lib/data";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  
  const category = await getCategoryBySlug(categorySlug);
  
  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.title} Works | Chris Pop Design Innovation`,
    description: `Explore our portfolio of ${category.title.toLowerCase()}.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;

  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20 flex flex-col">
      <div className="flex-1 bg-[#fafafa]">
        <ProjectsPreview 
          category={category.slug as any} 
          isFullList={true} 
          hideHeader={true}
        />

        {/* Back Button */}
        <section className="container mx-auto px-6 md:px-12 pb-16 pt-8 w-full">
          <Link
            href="/our-work"
            className="text-[10px] tracking-[0.5em] font-light text-black/60 hover:text-black transition-all uppercase flex items-center gap-2 w-max"
          >
            <span className="text-lg leading-none">←</span> Back Page
          </Link>
        </section>
      </div>
      <Footer />
    </main>
  );
}
