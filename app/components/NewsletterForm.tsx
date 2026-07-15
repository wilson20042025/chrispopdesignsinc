"use client";

import { useState } from "react";

export default function NewsletterForm() {
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
    <div className="max-w-2xl mx-auto space-y-12 relative">
      <span className="text-[10px] tracking-[0.5em] font-medium text-black/40 uppercase">Stay Connected</span>
      <h2 className="text-3xl md:text-5xl font-thin tracking-tighter text-black leading-tight">
        To Stay Updated
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto relative">
        <input
          type="email"
          name="email"
          required
          placeholder="EMAIL ADDRESS"
          className="w-full bg-transparent border-b border-black/10 py-3 text-[10px] tracking-widest focus:outline-none focus:border-black transition-colors"
        />
        {/* Hidden field to tag it as a newsletter signup */}
        <input type="hidden" name="inquiry_type" value="Newsletter Subscription" />
        <button type="submit" className="whitespace-nowrap text-[10px] tracking-[0.5em] font-bold text-white bg-black px-8 py-4 hover:opacity-70 transition-all uppercase">
          Subscribe
        </button>
        
        {/* Status messages placed absolutely to prevent layout shift */}
        <div className="absolute -bottom-8 left-0 w-full text-center">
          {status === "SUCCESS" && (
            <p className="text-[10px] tracking-[0.2em] text-green-600 uppercase animate-in fade-in">
              Thanks for subscribing!
            </p>
          )}
          {status === "ERROR" && (
            <p className="text-[10px] tracking-[0.2em] text-red-600 uppercase">
              Something went wrong.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
