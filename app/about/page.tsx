import Image from "next/image";
import Link from "next/link";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function AboutPage() {
  const team = [
    {
      name: "Gabriel Himie Wilson",
      role: "Founder / Principal Architect",
      bio: "With over 15 years of experience in structural minimalism, Gabriel has pioneered a unique spatial philosophy that blends silence with material integrity.",
      image: "/gab.jpeg" // Founder Image
    },
    {
      name: "The Collective",
      role: "Specialized Design Team",
      bio: "Our studio is built on collaborative intelligence. We are a group of 12 architects, interior designers, and structural engineers working in unison.",
      image: "https://res.cloudinary.com/diqqmnnkv/image/upload/v1775588190/7-1_mynluc.jpg" // Placeholder for Team
    },
    {
      name: "The Process",
      role: "Digital Precision",
      bio: "Utilizing advanced BIM and generative design workflows to ensure every millimeter of the physical space is optimized for light and silence.",
      image: "https://res.cloudinary.com/diqqmnnkv/image/upload/v1775589810/5-3_tblbu8.jpg" // Placeholder for Process
    }
  ];

  return (
    <>
      <main className="pt-24 xs:pt-32 md:pt-32 pb-32 px-6 xs:px-12 md:px-24 bg-white relative">
        {/* Intro Section */}
        <section className="mb-12 md:mb-8">
          <h1 className="text-3xl xs:text-5xl md:text-7xl font-thin tracking-tighter text-black leading-tight uppercase mb-6">
            Meet Our<br/>Masterminds
          </h1>
        </section>

        {/* Founders and Team Section */}
        <section className="lg:max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-12 lg:gap-8">
            {team.map((member, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-[3/4] bg-[#faf9f6] relative overflow-hidden group">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-all duration-1000 grayscale-0 group-hover:grayscale"
                  />
                  
                  {/* Overlay Meta Inside Container */}
                  <div className="absolute inset-x-0 bottom-0 p-8 pt-24 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                    <p className="text-[10px] tracking-[0.3em] font-medium opacity-60 uppercase mb-2">{member.role}</p>
                    <h3 className="text-2xl font-light uppercase mb-2">{member.name}</h3>
                    <p className="text-[11px] font-light opacity-80 leading-relaxed max-w-xs">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mt-24 md:mt-32">
          <Pricing />
        </section>

        {/* Bottom CTA */}
      </main>
      <Footer />
    </>
  );
}
