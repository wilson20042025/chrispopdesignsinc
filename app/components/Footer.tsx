import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full rounded-none bg-[#0a0a0a] border-t border-white/5">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center px-6 xs:px-12 pt-12 xs:pt-20 pb-8 xs:pb-12 w-full text-center md:text-left gap-12 md:gap-0">
        <div className="flex flex-col gap-2">
          <span className="font-inter font-light tracking-[0.2em] text-[10px] text-white/80">
            © {currentYear} Chris Pop Designs & Innovation. All rights reserved.
          </span>
          <span className="font-inter font-light tracking-[0.2em] text-[8px] text-white/60">
            Digital Development by Fritzgerald Wilson
          </span>
        </div>
        <div className="flex gap-6 xs:gap-12 transition-all">
          {[
            { name: "INSTAGRAM", href: "https://instagram.com/chrispoparch" },
            { name: "LINKEDIN", href: "https://linkedin.com/in/chris-pop-designs" },
            { name: "WHATSAPP", href: "https://wa.me/231886796691?text=Hello%20Chris%20Pop%20Designs%20%26%20Innovation,%20I'm%20interested%20in%20starting%20a%20project%20together!" }
          ].map((social) => (
            <a 
              key={social.name} 
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter font-medium tracking-[0.2em] text-[10px] text-white/80 hover:text-white transition-all duration-300 uppercase"
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
