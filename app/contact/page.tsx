"use client";

import { useState } from "react";
import Header from "../components/Header";
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
      <Header />
      <main className="pt-20 md:pt-40 pb-20 px-6 xs:px-12 md:px-24 min-h-screen">
        <section className="mb-8 md:mb-24">
          <span className="text-[10px] tracking-[0.5em] font-medium text-black uppercase mb-4 block">Let's build</span>
          <h1 className="text-4xl xs:text-6xl md:text-8xl font-thin tracking-tighter text-black leading-none uppercase">
            CONTACT US
          </h1>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="space-y-8 md:space-y-16">
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-medium text-black uppercase block">Office</span>
              <p className="text-lg md:text-2xl font-light leading-relaxed text-black">
                10000, Paynesville,<br/>
                Monrovia, Liberia
              </p>
            </div>
            
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-medium text-black uppercase block">Global Inquiry</span>
              <p className="text-lg md:text-2xl font-light hover:opacity-60 transition-opacity cursor-pointer">
              chrispopdesignsandinnovations@gmail.com
              </p>
            </div>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="space-y-8 md:bg-surface-container-low p-0 md:p-12 lg:p-20"
          >
            {/* ... form fields remain same ... */}
            <div className="space-y-4">
              <label className="text-[10px] tracking-[0.3em] font-light text-outline uppercase block">Name</label>
              <input 
                name="name"
                type="text" 
                required
                className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors placeholder:text-black/20"
                placeholder="First Last"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] tracking-[0.3em] font-light text-outline uppercase block">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors placeholder:text-black/20"
                placeholder="example@email.com"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] tracking-[0.3em] font-light text-outline uppercase block">Project Type</label>
              <select name="project_type" className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors appearance-none text-black/40">
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="cultural">Cultural</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] tracking-[0.3em] font-light text-outline uppercase block">Message</label>
              <textarea 
                name="message"
                rows={4}
                className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors resize-none placeholder:text-black/20"
                placeholder="Tell us about your vision"
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
