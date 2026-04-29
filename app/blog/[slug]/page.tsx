import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";
import { notFound } from "next/navigation";

export const revalidate = 10;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
    title,
    excerpt,
    category,
    publishedAt,
    mainImage,
    body
  }`, { slug });

  if (!post) {
    // For now, if Sanity is empty, we show a professional fallback or 404
    notFound(); 
  }

  return (
    <>
      <main className="pt-24 xs:pt-32 md:pt-48 pb-32 bg-white min-h-screen">
        <article className="px-6 xs:px-12 md:px-24">
          {/* Post Header */}
          <header className="max-w-4xl mb-16 md:mb-24 px-0">
            <div className="flex gap-4 mb-6">
              <span className="text-[10px] tracking-[0.3em] font-medium text-black/40 uppercase bg-black/5 px-3 py-1">
                {post.category || 'Journal'}
              </span>
              <span className="text-[10px] tracking-[0.3em] font-light text-black/40 uppercase px-3 py-1">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl md:text-8xl font-thin tracking-tighter text-black leading-none uppercase">
              {post.title}
            </h1>
            <p className="mt-12 text-lg md:text-2xl font-light text-black/60 leading-relaxed italic border-l border-black/10 pl-8">
              {post.excerpt}
            </p>
          </header>

          {/* Main Hero Shot */}
          {post.mainImage && (
            <div className="relative w-full aspect-[21/9] overflow-hidden mb-16 md:mb-32">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Body Content Placeholder - In a real setup, use @portabletext/react */}
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="prose prose-lg font-light text-black/80 leading-relaxed">
               {/* Simple rendering for now - client should install @portabletext/react later */}
               {Array.isArray(post.body) ? (
                 post.body.map((block: any, i: number) => (
                   <div key={i} className="mb-6">
                     {block._type === 'block' && block.children?.map((c: any) => c.text).join('')}
                   </div>
                 ))
               ) : (
                 <p className="text-black/40 italic">Insight synthesis in progress...</p>
               )}
            </div>
          </div>
        </article>

        {/* Bottom Navigation */}
        <section className="mt-32 px-6 xs:px-12 md:px-24 flex justify-between items-center border-t border-black/10 pt-16">
          <Link
            href="/"
            className="text-[10px] tracking-[0.5em] font-light text-black/40 hover:text-black transition-all uppercase flex items-center gap-2"
          >
            <span className="text-lg leading-none">←</span> Back to Journal
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
