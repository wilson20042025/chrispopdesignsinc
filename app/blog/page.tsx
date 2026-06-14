import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import NewsletterForm from "../components/NewsletterForm";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  image: any;
  excerpt: string;
  slug: string;
}

export const revalidate = 10;

export default async function JournalPage() {
  const sanityPosts: BlogPost[] = await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    "id": _id,
    title,
    "date": publishedAt,
    category,
    "image": mainImage,
    excerpt,
    "slug": slug.current
  }`) || [];

  const allPosts = sanityPosts;

  return (
    <>
      <main className="pt-24 xs:pt-32 md:pt-32 pb-32 px-6 xs:px-12 md:px-24 bg-white relative min-h-screen">
        <div className="">
          {/* Header Section */}
          <header className="max-w-[1400px] mx-auto mb-10 md:mb-16">

            <h1 className="text-4xl md:text-7xl font-thin tracking-tighter text-black leading-[0.85] uppercase">
              Latest <br />
              <span className="font-light italic opacity-50">Insights</span>
            </h1>
            <div className="mt-12 max-w-lg">
              <p className="text-sm font-light text-black/60 leading-relaxed">
                A collection of stories and ideas about how we use technology to design better homes and buildings for everyone.
              </p>
            </div>
          </header>

          {/* Posts Grid */}
          <section className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {allPosts.map((post) => (
                <article key={post.id} className="group flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block space-y-8 flex-1">
                    <div className="aspect-[16/10] overflow-hidden bg-surface-container-high relative">
                      <Image
                        src={typeof post.image === 'string' ? post.image : (post.image ? urlFor(post.image).url() : "")}
                        alt={post.title}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1">
                        <span className="text-[9px] tracking-widest font-medium text-black uppercase">
                          {post.date ? new Date(post.date).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">

                      <h2 className="text-2xl md:text-3xl font-light tracking-tight text-black uppercase leading-[1.1] group-hover:opacity-60 transition-opacity">
                        {post.title}
                      </h2>
                      <p className="text-[13px] font-light text-black/60 leading-relaxed max-w-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] tracking-[0.3em] font-medium text-black uppercase">Read Full Insight</span>
                        <div className="w-8 h-px bg-black group-hover:w-16 transition-all duration-500" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-48 md:mt-24 bg-[#faf9f6] py-32 px-6 xs:px-12 md:px-24 text-center">
          <NewsletterForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
