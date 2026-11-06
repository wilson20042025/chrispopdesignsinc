"use client";

import { useState } from "react";
import { ProjectDetailItem } from "@/lib/types";

interface ProjectSpecsProps {
  title: string;
  category?: string;
  details: ProjectDetailItem[];
}

export default function ProjectSpecs({ title, category, details }: ProjectSpecsProps) {
  // If more than 4 items, collapse the extra items for a compact UI
  const hasManyDetails = details.length > 4;
  const [isExpanded, setIsExpanded] = useState(false);
  // By default, specifications are hidden until clicked
  const [isOpen, setIsOpen] = useState(false);

  // Items to display based on expansion state
  const displayedDetails = hasManyDetails && !isExpanded ? details.slice(0, 4) : details;

  return (
    <section className="px-6 xs:px-12 md:px-24 mb-8 xs:mb-12 md:mb-16">
      <div className="border border-black/10 p-6 bg-[#fafafa] transition-all duration-300">
        {/* Header: Title, Category & Dropdown Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-black uppercase">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {category && (
              <span className="text-[10px] tracking-[0.3em] font-medium text-black/40 uppercase bg-black/5 px-3 py-1.5">
                {category}
              </span>
            )}

            {details.length > 0 && (
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-[10px] tracking-[0.2em] font-medium uppercase px-3 py-1.5 border border-black/15 hover:border-black bg-white hover:bg-black hover:text-white transition-all flex items-center gap-2 cursor-pointer rounded-none group"
                aria-expanded={isOpen}
                aria-label="Toggle project specifications"
              >
                <span>{isOpen ? "Hide Specs" : `View Specs (${details.length})`}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Specifications List */}
        {details.length > 0 && isOpen && (
          <div className="mt-6 pt-6 border-t border-black/10 transition-all duration-300">
            <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {displayedDetails.map((detail, idx) => (
                <div key={idx} className="border-b border-black/5 pb-2.5 transition-all">
                  <dt className="text-[10px] tracking-wider text-black/40 uppercase font-medium">
                    {detail.label}
                  </dt>
                  <dd className="text-sm font-light text-black mt-1 break-words">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Dropdown / Show More Button when details exceed 4 */}
            {hasManyDetails && (
              <div className="mt-6 pt-4 border-t border-black/5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group px-5 py-2 text-[10px] tracking-[0.25em] font-medium uppercase border border-black/10 hover:border-black bg-white hover:bg-black hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>
                    {isExpanded
                      ? "Show Fewer Specifications"
                      : `View All Specifications (+${details.length - 4} more)`}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

