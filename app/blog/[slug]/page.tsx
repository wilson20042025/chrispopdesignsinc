import { getPostBySlug } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Insight Not Found" };
  }

  return {
    title: `${post.title} | Chris Pop Design Innovation`,
    description: post.excerpt || "Architectural design insight.",
    openGraph: {
      title: `${post.title} | Chris Pop Design`,
      description: post.excerpt || "Architectural design insight.",
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = typeof post.body === 'string'
    ? post.body.split('\n\n').filter((p) => p.trim() !== '')
    : [];

  return (
    <>
      <main className="bg-white min-h-screen selection:bg-black selection:text-white">
        {/* Reading Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-[2px] bg-black/5 z-[110]">
          <div className="h-full bg-black w-1/3 transition-all duration-300" id="progress-bar" />
        </div>

        <article className="relative">
          {/* Hero Section */}
          <header className="pt-24 xs:pt-32 md:pt-32 pb-20 container mx-auto px-6 md:px-12">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/blog"
                className="text-[10px] tracking-[0.3em] font-medium text-black/40 hover:text-black transition-colors uppercase flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-xs group-hover:-translate-x-1 transition-transform">west</span>
                Insights
              </Link>
            </div>

            <h1 className="text-4xl md:text-7xl font-thin tracking-tighter text-black leading-[0.85] uppercase mb-12">
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
                <span className="text-sm font-light text-black">
                  {post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="container mx-auto px-6 md:px-12 mb-20 md:mb-32">
            <div className="relative w-full aspect-[21/9] overflow-hidden bg-[#faf9f6]">
              <Image
                src={post.image || "/robotic_fabrication.png"}
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
              {paragraphs.length > 0 ? (
                paragraphs.map((para, i) => (
                  <p key={i} className="text-lg md:text-xl font-light text-black/80 leading-relaxed mb-8">
                    {para}
                  </p>
                ))
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
                  <span className="text-[10px] tracking-widest font-light text-black/60 uppercase px-3 py-1 bg-black/5 rounded-full">
                    #{post.category || 'Architecture'}
                  </span>
                  <span className="text-[10px] tracking-widest font-light text-black/60 uppercase px-3 py-1 bg-black/5 rounded-full">
                    #Innovation
                  </span>
                </div>
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
