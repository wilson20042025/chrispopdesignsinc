import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full rounded-none bg-[#0a0a0a] border-t border-white/5">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center px-6 xs:px-12 pt-12 xs:pt-20 pb-8 xs:pb-12 w-full text-center md:text-left gap-12 md:gap-0">
        <div className="flex flex-col gap-2">
          <span className="font-inter font-light tracking-[0.2em] text-[10px] text-white/80">
            © {currentYear} ChrisPop Designs Incorporated and Innovation. All rights reserved.
          </span>
          <span className="font-inter font-light tracking-[0.2em] text-[8px] text-white/60">
            Digital Development by Fritzgerald Wilson
          </span>
        </div>
        <div className="flex gap-6 xs:gap-12 transition-all">
          {["INSTAGRAM", "LINKEDIN", "WHATSAPP"].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="font-inter font-medium tracking-[0.2em] text-[10px] text-white/80 hover:text-white transition-all duration-300 uppercase"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
