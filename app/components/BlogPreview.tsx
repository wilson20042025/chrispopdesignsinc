import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  image: any;
  excerpt: string;
  slug: string;
}

export default async function BlogPreview() {
  const sanityPosts: BlogPost[] = await client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...4] {
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
    <section className="py-12 md:py-20 px-6 xs:px-12 md:px-24 bg-white relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>

            <h2 className="text-4xl md:text-7xl font-thin tracking-tighter text-black leading-[0.85] uppercase">
              Our <br />
              <span className="font-light italic opacity-50">Insights</span>
            </h2>
          </div>
          <Link 
            href="/blog" 
            className="group flex items-center gap-4 text-[10px] tracking-[0.5em] font-medium text-black uppercase pb-2 border-b border-black/10 hover:border-black transition-all"
          >
            <span>Read Insights</span>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">east</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {allPosts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <Link href={`/blog/${post.slug}`} className="block space-y-6">
                <div className="aspect-[16/10] overflow-hidden bg-surface-container-high relative">
                  <Image
                    src={typeof post.image === 'string' ? post.image : (post.image ? urlFor(post.image).url() : "")}
                    alt={post.title}
                    fill
                    className="object-cover transition-all duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-2 py-0.5">
                    <span className="text-[8px] tracking-widest font-medium text-black uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[9px] tracking-widest text-black/30 uppercase block">
                    {post.date ? new Date(post.date).toLocaleDateString() : 'Recent'}
                  </span>
                  <h3 className="text-lg font-light tracking-tight text-black uppercase leading-[1.2] group-hover:opacity-60 transition-opacity">
                    {post.title}
                  </h3>
                  <p className="text-[12px] font-light text-black/60 leading-relaxed max-w-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[8px] tracking-[0.3em] font-medium text-black uppercase">Read Insights</span>
                    <div className="w-6 h-px bg-black/20 group-hover:w-10 transition-all duration-500" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
