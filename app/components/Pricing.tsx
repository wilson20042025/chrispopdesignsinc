import Link from "next/link";

const pricingPlans = [
  {
    index: "01",
    name: "Digital Fabrication",
    description: "Advanced prototyping and technical manufacturing solutions.",
    price: "Starting at $1,250",
    features: [
      "Computational Modeling",
      "3D Print Preparation",
      "Material Consulting",
      "Technical Documentation"
    ]
  },
  {
    index: "02",
    name: "Architectural Vision",
    description: "Concept-driven spatial design and architectural strategy.",
    price: "Starting at $3,500",
    features: [
      "Spatial Narrative",
      "Conceptual Blueprints",
      "Lighting & Materiality",
      "Site Analysis"
    ]
  },
  {
    index: "03",
    name: "Strategic Integration",
    description: "Full-scale design and robotic construction management.",
    price: "Custom Quote",
    features: [
      "End-to-End Fabrication",
      "Robotic Assembly",
      "Project Management",
      "Sustainability Audit"
    ]
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-8 md:py-12 px-6 xs:px-12 md:px-24 bg-white relative overflow-hidden">
      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 w-px h-full bg-black/[0.03] hidden lg:block" />

      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 md:mb-14">
          <span className="text-[10px] tracking-[0.5em] font-medium text-black/40 uppercase block mb-4">
            Investment Structure
          </span>
          <h2 className="text-4xl md:text-7xl font-thin tracking-tighter text-black leading-[0.85] uppercase">
            Services & <br />
            <span className="font-light opacity-50">Consultancy</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {pricingPlans.map((plan) => (
            <div key={plan.index} className="group flex flex-col h-full border-t border-black/10 pt-8 md:pt-12">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-light tracking-tight text-black uppercase mb-4 group-hover:opacity-60 transition-opacity">
                  {plan.name}
                </h3>
                <p className="text-sm font-light text-black/70 leading-relaxed mb-10 max-w-[280px]">
                  {plan.description}
                </p>

                <div className="space-y-4 mb-12">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-black/20 rounded-full" />
                      <span className="text-[11px] tracking-wider font-light text-black/80 uppercase">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto space-y-6 pt-8 border-t border-black/[0.05]">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] tracking-widest text-black/50 uppercase">Investment</span>
                  <span className="text-sm md:text-base font-light text-black uppercase">{plan.price}</span>
                </div>

                <Link
                  href="/contact"
                  className="block w-full text-center py-5 border border-black/10 bg-black text-white md:bg-transparent md:text-black text-[10px] tracking-[0.4em] uppercase font-medium hover:bg-black hover:text-white transition-all duration-500"
                >
                  Inquire Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
