"use client";

import { useState } from "react";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [status, setStatus] = useState<"SUCCESS" | "ERROR" | "">("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xzdkwgbk", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("SUCCESS");
        form.reset();
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("ERROR");
      }
    } catch (error) {
      setStatus("ERROR");
    }
  };

  return (
    <>
      <main className="pt-20 md:pt-32 pb-20 px-6 xs:px-12 md:px-24 min-h-screen">
        <section className="mb-8 md:mb-16">
          <h1 className="text-4xl xs:text-6xl md:text-7xl font-thin tracking-tighter text-black leading-none uppercase">
            CONTACT US
          </h1>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="flex flex-col h-full">
            <div className="space-y-8 md:space-y-16">
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.3em] font-medium text-black uppercase block">Global Inquiry</span>
                <p className="text-lg md:text-2xl font-light hover:opacity-60 transition-opacity cursor-pointer">
                  chrispopdesignsinno@gmail.com
                </p>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.3em] font-medium text-black uppercase block">Office</span>
                <p className="text-lg md:text-2xl font-light leading-relaxed text-black">
                  10000, Paynesville,<br />
                  Monrovia, Liberia
                </p>
              </div>
            </div>

            {/* Google Map - Desktop Only */}
            <div className="hidden md:flex flex-1 flex-col pt-16 w-full">
              <div className="flex-1 w-full bg-surface-container-low relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127536.03842106096!2d-10.787754353457182!3d6.281862993888371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf09f0df7e20b601%3A0xe5cdcdb4e073c683!2sPaynesville%2C%20Liberia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 md:bg-surface-container-low p-0 md:p-8 lg:p-12"
          >
            {/* ... form fields remain same ... */}
            <div className="space-y-4">
              <input
                name="name"
                type="text"
                required
                className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors placeholder:text-black/40"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-4">
              <input
                name="email"
                type="email"
                required
                className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors placeholder:text-black/40"
                placeholder="Email Address"
              />
            </div>

            <div className="space-y-4">
              <select name="project_type" required defaultValue="" className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors appearance-none text-black/40">
                <option value="" disabled hidden>Click & Select Project Type</option>
                <option value="3D Printing & Rapid Prototyping">3D Printing & Rapid Prototyping</option>
                <option value="CNC Routing & Precision Machining"> CNC Routing & Precision Machining </option>
                <option value="Laser Cutting & Engraving">Laser Cutting & Engraving </option>
                <option value="Graphic Design & Digital Branding"> Graphic Design & Digital Branding </option>
                <option value="Digital Fabrication & Experimental Media"> Digital Fabrication & Experimental Media </option>
                <option value="Technical Training & CPDI Academy"> Technical Training & CPDI Academy </option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-4">
              <textarea
                name="message"
                rows={4}
                required
                className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors resize-none placeholder:text-black/40"
                placeholder="Leave a message...."
              />
            </div>

            <div className="flex flex-col gap-4">
              <button type="submit" className="w-full md:w-auto text-[10px] tracking-[0.5em] font-medium text-white bg-black uppercase px-12 py-6 hover:opacity-80 transition-all duration-500">
                Send Inquiry
              </button>

              {status === "SUCCESS" && (
                <p className="text-[10px] tracking-[0.2em] text-green-600 uppercase animate-in fade-in slide-in-from-left-2">
                  Thank you. Your inquiry has been sent.
                </p>
              )}
              {status === "ERROR" && (
                <p className="text-[10px] tracking-[0.2em] text-red-600 uppercase">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
