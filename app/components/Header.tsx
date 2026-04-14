"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HeaderContent() {
  const pathname = usePathname();

  // Hide header on studio pages
  if (pathname?.startsWith('/studio')) return null;

  const isActive = (path: string) => {
    return path === pathname;
  };

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "3D FABRICATION", path: "/fabrication" },
    { name: "ARCHITECTURAL DESIGN", path: "/architecture" },
    { name: "ABOUT", path: "/about" },
  ];

  return (
    <header className="fixed top-0 w-full z-[100] border-b border-outline-variant/10 bg-white/90 backdrop-blur-xl">
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 md:py-5 w-full relative">

        {/* PEER TOGGLE: The hidden checkbox that drives the entire visibility logic without JS */}
        <input type="checkbox" id="mobile-menu-checkbox" className="peer hidden" />

        <div className="flex items-center gap-4 z-[120]">
          {/* Label as Burger - Toggles the peer checkbox natively */}
          <label
            htmlFor="mobile-menu-checkbox"
            className="md:hidden flex flex-col gap-1.5 p-3 -ml-3 cursor-pointer group active:scale-95 transition-all"
          >
            <span className="w-6 h-0.5 bg-[#000000] transition-all duration-300 peer-checked:group-[]:rotate-45 peer-checked:group-[]:translate-y-2"></span>
            <span className="w-6 h-0.5 bg-[#000000] transition-all duration-300 peer-checked:group-[]:opacity-0"></span>
            <span className="w-6 h-0.5 bg-[#000000] transition-all duration-300 peer-checked:group-[]:-rotate-45 peer-checked:group-[]:-translate-y-2"></span>
          </label>

          <Link href="/" className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:block">
              <Image
                src="/chrispop(thumbnail).png"
                alt="ChrisPop Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <h1 className="text-[13px] xs:text-base md:text-lg font-medium tracking-tighter text-black uppercase whitespace-nowrap">
              ChrisPop Designs Inc.
            </h1>
          </Link>
        </div>

        {/* Desktop Links - Stays hidden on small screens */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`font-inter font-light tracking-widest uppercase text-[10px] transition-all duration-500 hover:opacity-70 ${isActive(item.path) ? "text-black border-b border-black pb-1" : "text-black/60"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center z-[120]">
          <Link
            href="/contact"
            className={`hidden md:flex font-inter font-light tracking-widest uppercase text-xs border px-5 py-2.5 transition-all duration-500 animate-contact ${isActive("/contact")
              ? "bg-black text-white border-black"
              : "text-black border-black/20 hover:bg-black hover:text-white"
              }`}
          >
            CONTACT US
          </Link>
          <Link
            href="/contact"
            className={`md:hidden font-inter font-light tracking-[0.1em] text-[10px] px-4 py-2 active:scale-95 transition-all ${isActive("/contact")
              ? "bg-white text-black border border-black"
              : "bg-black text-white animate-shake"
              }`}
          >
            CONTACT US
          </Link>
        </div>

        {/* 
          PURE CSS OVERLAY 
          - peer-checked:opacity-100 peer-checked:visible peer-checked:translate-x-0
          - These classes respond to the checkbox state automatically.
        */}
        <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-white transition-all duration-500 ease-in-out opacity-0 invisible -translate-x-full peer-checked:opacity-100 peer-checked:visible peer-checked:translate-x-0 z-[110] flex flex-col p-6 pt-16 box-border overflow-hidden">
          <div className="mb-1">
            <Image
              src="/chrispop(thumbnail).png"
              alt="ChrisPop Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="flex-1 flex flex-col justify-start gap-6 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-3xl xs:text-4xl font-thin tracking-tighter hover:opacity-100 transition-all duration-500 ${isActive(item.path) ? "text-black pl-4 border-l-2 border-black" : "text-black/40"
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`text-3xl xs:text-4xl font-thin tracking-tighter hover:opacity-100 transition-all duration-500 ${isActive("/contact") ? "text-black pl-4 border-l-2 border-black" : "text-black/40"
                }`}
            >
              CONTACT US
            </Link>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col xs:flex-row justify-between items-end gap-8 pb-12">
            <div className="space-y-4 w-full">
              <span className="text-[10px] tracking-[0.3em] font-medium text-black uppercase block">Our Office</span>
              <p className="text-sm font-light text-black">
                Paynesville,<br />
                Monrovia, Liberia
              </p>
            </div>
            <span className="text-[10px] tracking-[0.3em] font-light text-black/30 uppercase">© 2026</span>
          </div>
        </div>

        {/* CSS to handle icon rotation and custom attention animation */}
        <style dangerouslySetInnerHTML={{
          __html: `
          #mobile-menu-checkbox:checked ~ div label span:nth-child(1) { transform: rotate(45deg) translateY(8.5px); }
          #mobile-menu-checkbox:checked ~ div label span:nth-child(2) { opacity: 0; }
          #mobile-menu-checkbox:checked ~ div label span:nth-child(3) { transform: rotate(-45deg) translateY(-8px); }

          @keyframes contactGlow {
            0%, 50%, 100% { background-color: transparent; border-color: rgba(0,0,0,0.2); transform: translateX(0); }
            55% { transform: translateX(-2px); }
            60% { transform: translateX(2px); background-color: rgba(0,0,0,0.03); border-color: rgba(0,0,0,1); }
            65% { transform: translateX(-2px); }
            70% { transform: translateX(0); }
          }
          @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            10%, 30%, 50%, 70%, 90% { transform: rotate(-2deg); }
            20%, 40%, 60%, 80% { transform: rotate(2deg); }
          }
          .animate-shake {
            animation: shake 5s ease-in-out infinite;
            transform-origin: center;
          }
          .animate-contact {
            animation: contactGlow 8s ease-in-out 6s infinite;
          }
        ` }} />
      </nav>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-20 bg-white/90 backdrop-blur-xl" />}>
      <HeaderContent />
    </Suspense>
  );
}
