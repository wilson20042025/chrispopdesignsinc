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

  const staticPosts: BlogPost[] = [
    {
      id: "post-1",
      title: "The Future of Robotic Fabrication",
      date: "April 12, 2024",
      category: "Innovation",
      image: "/robotic_fabrication.png",
      excerpt: "Exploring how automated assembly lines are redefining precision.",
      slug: "future-of-robotic-fabrication"
    },
    {
      id: "post-2",
      title: "Parametric Design: Beyond Aesthetics",
      date: "March 28, 2024",
      category: "Design",
      image: "/parametric_architectural_texture_detail_1775931276569.png",
      excerpt: "How algorithms optimize environmental performance.",
      slug: "parametric-design-beyond-aesthetics"
    },
    {
      id: "post-3",
      title: "Digital Dimensions: A New Era",
      date: "March 15, 2024",
      category: "Philosophy",
      image: "/modern_architectural_innovation_building_1775931655490.png",
      excerpt: "Bridging the gap between digital models and space.",
      slug: "digital-dimensions-new-era"
    },
    {
      id: "post-4",
      title: "Structural Minimalism: Power of Less",
      date: "March 10, 2024",
      category: "Architecture",
      image: "/gab.jpeg",
      excerpt: "Synthesizing material honesty and spatial clarity.",
      slug: "structural-minimalism-power-of-less"
    }
  ];

  const allPosts = sanityPosts.length > 0 ? sanityPosts : staticPosts;

  return (
    <section className="py-12 md:py-20 px-6 xs:px-12 md:px-24 bg-white relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 md:mb-16">
          <span className="text-[10px] tracking-[0.5em] font-medium text-black/40 uppercase block mb-4">
            Insights & Ideas
          </span>
          <h2 className="text-4xl md:text-7xl font-thin tracking-tighter text-black leading-[0.85] uppercase">
            From the <br />
            <span className="font-light italic opacity-50">Journal</span>
          </h2>
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
