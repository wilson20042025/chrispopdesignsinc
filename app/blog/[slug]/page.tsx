import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";
import { notFound } from "next/navigation";

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: any;
  body: any;
  slug: string;
}

export const revalidate = 10;


export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const sanityPost = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
    title,
    excerpt,
    category,
    "date": publishedAt,
    "image": mainImage,
    body,
    "slug": slug.current
  }`, { slug });

  const post = sanityPost;

  if (!post) {
    notFound();
  }

  return (
    <>
      <main className="bg-white min-h-screen selection:bg-black selection:text-white">
        {/* Reading Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-[2px] bg-black/5 z-[110]">
          <div className="h-full bg-black w-1/3 transition-all duration-300" id="progress-bar" />
        </div>

        <article className="relative">
          {/* Hero Section */}
          <header className="pt-24 xs:pt-32 md:pt-32 pb-20 px-6 xs:px-12 md:px-24 max-w-[1400px] mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/blog"
                className="text-[10px] tracking-[0.3em] font-medium text-black/40 hover:text-black transition-colors uppercase flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-xs group-hover:-translate-x-1 transition-transform">west</span>
                Insights
              </Link>
            </div>

            <h1 className="text-4xl xs:text-6xl md:text-8xl lg:text-[10rem] font-thin tracking-tighter text-black leading-[0.85] uppercase mb-12">
              {post.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-t border-black/10 pt-12">
              <div className="max-w-2xl">
                <p className="text-lg md:text-2xl font-light text-black/60 leading-relaxed italic">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-start md:items-end">
                <span className="text-[10px] tracking-[0.3em] font-medium text-black/30 uppercase">Published</span>
                <span className="text-sm font-light text-black">{post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'March 2024'}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="px-6 xs:px-12 md:px-24 mb-20 md:mb-32">
            <div className="relative w-full aspect-[21/9] overflow-hidden bg-[#faf9f6]">
              <Image
                src={typeof post.image === 'string' ? post.image : (post.image ? urlFor(post.image).url() : "/robotic_fabrication.png")}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Article Body */}
          <div className="max-w-3xl mx-auto px-6 mb-32">
            <div className="prose prose-lg">
              {Array.isArray(post.body) ? (
                post.body.map((block: any, i: number) => {
                  if (block.type === 'heading' || block.style === 'h2') {
                    return <h2 key={i} className="text-2xl md:text-4xl font-light tracking-tight text-black uppercase mt-16 mb-8">{block.text || (block.children?.map((c: any) => c.text).join(''))}</h2>;
                  }
                  if (block.type === 'paragraph' || block._type === 'block') {
                    return <p key={i} className="text-lg md:text-xl font-light text-black/80 leading-relaxed mb-8">{block.text || (block.children?.map((c: any) => c.text).join(''))}</p>;
                  }
                  return null;
                })
              ) : (
                <div className="space-y-12">
                  <p className="text-xl font-light text-black/80 leading-relaxed">
                    The discourse surrounding {post.title.toLowerCase()} is evolving rapidly. At ChrisPop Designs Incorporated, we are at the forefront of this transformation, blending advanced computational tools with physical craftsmanship.
                  </p>
                  <div className="h-px w-24 bg-black/10 mx-auto" />
                  <p className="text-center text-black/40 italic font-light">
                    Detailed technical insight is currently being synthesized for digital publication.
                  </p>
                </div>
              )}
            </div>

            {/* Share / Tags */}
            <div className="mt-24 pt-12 border-t border-black/10 flex flex-wrap justify-between items-center gap-8">
              <div className="flex gap-4">
                <span className="text-[10px] tracking-[0.3em] font-medium text-black/40 uppercase">Tags</span>
                <div className="flex gap-2">
                  <span className="text-[10px] tracking-widest font-light text-black/60 uppercase px-3 py-1 bg-black/5 rounded-full">#Innovation</span>
                  <span className="text-[10px] tracking-widest font-light text-black/60 uppercase px-3 py-1 bg-black/5 rounded-full">#Fabrication</span>
                </div>
              </div>
              <div className="flex gap-6">
                <button className="text-black/40 hover:text-black transition-colors" title="Share">
                  <span className="material-symbols-outlined text-xl">share</span>
                </button>
                <button className="text-black/40 hover:text-black transition-colors" title="Bookmark">
                  <span className="material-symbols-outlined text-xl">bookmark_border</span>
                </button>
              </div>
            </div>
          </div>
        </article>


        <Footer />
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        #progress-bar {
            transform-origin: left;
            animation: scroll auto linear;
            animation-timeline: scroll();
        }
      `}} />
    </>
  );
}
