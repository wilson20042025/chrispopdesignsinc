import Link from "next/link";
import PdfDownloadForm from "./PdfDownloadForm";

const pricingPlans = [
  {
    index: "01",
    name: "3D Printing &\nRapid Prototyping",
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
    name: "CNC Routing & \nPrecision Machining",
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
    name: "Laser Cutting & \nEngraving",
    description: "Full-scale design and robotic construction management.",
    price: "Custom Quote",
    features: [
      "End-to-End Fabrication",
      "Robotic Assembly",
      "Project Management",
      "Sustainability Audit"
    ]
  },
  {
    index: "04",
    name: "Parametric Design &\nOptimization",
    description: "Algorithmic design generation and structural optimization workflows.",
    price: "Starting at $2,000",
    features: [
      "Algorithmic Generation",
      "Structural Analysis",
      "Performance Optimization",
      "Digital Twin Creation"
    ]
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="pt-8 md:pt-12 pb-2 md:pb-4 px-6 xs:px-12 md:px-24 bg-white relative overflow-hidden">
      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 w-px h-full bg-black/[0.03] hidden lg:block" />

      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 md:mb-10">
          <h2 className="text-4xl md:text-7xl font-thin tracking-tighter text-black leading-[0.85] uppercase">
            Services & <br />
            <span className="font-light opacity-50">Consultancy</span>
          </h2>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16">
          {pricingPlans.map((plan) => (
            <div key={plan.index} className="group flex flex-col h-full border-t border-black/10 pt-6 md:pt-8">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-light tracking-tight text-black mb-4 group-hover:opacity-60 transition-opacity whitespace-pre-line">
                  {plan.name}
                </h3>
                <p className="text-sm font-light text-black/70 leading-relaxed mb-6 md:mb-8 max-w-[280px]">
                  {plan.description}
                </p>

                <div className="space-y-3 mb-8 md:mb-10">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-black/20 rounded-full" />
                      <span className="text-[11px] tracking-wider font-light text-black/80 uppercase">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-12">
          <PdfDownloadForm />
        </div>
      </div>
    </section>
  );
}
