import Footer from "../components/Footer";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Our Works | Chris Pop Design Innovation",
  description: "Explore our complete portfolio spanning architectural design and advanced 3D fabrication.",
};

export const revalidate = 10;

interface CategoryData {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  image: string;
}

export default async function ProjectsPage() {
  // Fetch categories and for each category, optionally fetch the latest project image if coverImage is not set
  const categoriesData = await client.fetch(`*[_type == "category"] | order(_createdAt asc) {
    "id": _id,
    title,
    subtitle,
    "slug": slug.current,
    "image": coalesce(
      coverImage,
      *[_type == "project" && references(^._id)] | order(_createdAt desc)[0].images[0]
    )
  }`);

  const categories: CategoryData[] = categoriesData.map((category: any) => ({
    ...category,
    image: category.image ? urlFor(category.image).url() : "",
  }));

  return (
    <main className="min-h-screen pt-20 bg-[#fafafa] dark:bg-[#0a0a0a]">
      <section className="relative pt-8 pb-24 md:pt-12 md:pb-32 px-6 xs:px-12 md:px-24 bg-[#fafafa] dark:bg-[#0a0a0a] overflow-hidden border-t border-black/10 dark:border-white/10">
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
          {/* Staggered Editorial Grid */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-8 md:gap-x-12 md:gap-y-12">
            {categories.map((category: CategoryData, index: number) => {
              const isWide = index % 4 === 0 || index % 4 === 3;
              const columnSpan = isWide ? "md:col-span-8" : "md:col-span-4";

              return (
                <div
                  key={category.id}
                  className={`group relative ${columnSpan}`}
                >
                  <div className="relative overflow-hidden border border-black/10 dark:border-white/10 p-2 sm:p-4 bg-[#fafafa] dark:bg-[#0a0a0a]">
                    <Link
                      href={`/our-work/category/${category.slug}`}
                      className={`block relative overflow-hidden bg-black/5 dark:bg-white/5 transition-all duration-700 ease-out cursor-pointer aspect-square ${isWide ? "md:aspect-[21/9]" : "md:aspect-[4/5]"
                        }`}
                    >
                      {category.image && (
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-cover transition-all duration-1000 group-hover:scale-105"
                        />
                      )}

                      {/* Desktop hover overlay (hidden on mobile) */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 hidden md:flex flex-col justify-end p-4 sm:p-8 md:p-12">
                        <div className="translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700">
                          <span className="text-[10px] tracking-[0.5em] font-medium text-white/80 uppercase block mb-4">
                            {category.subtitle}
                          </span>
                          <h4 className="text-xl sm:text-2xl md:text-4xl font-thin text-white tracking-tighter leading-none">
                            {category.title}
                          </h4>
                          <div className="mt-4 md:mt-6 flex items-center gap-2 text-white/80 md:text-white/60">
                            <span className="text-[10px] tracking-widest uppercase font-light">View Category</span>
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
      <Footer />
    </main>
  );
}
