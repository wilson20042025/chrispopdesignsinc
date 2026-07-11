"use client";

import { useState, useEffect } from "react";

export default function PdfDownloadForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/send-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("PDF sent! Please check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* Initial Download Button */}
      {!isOpen && status !== "success" && (
        <button
          onClick={() => setIsOpen(true)}
          className="block w-full lg:max-w-2xl mx-auto text-center py-6 border border-black text-black bg-transparent md:text-xs text-[10px] tracking-[0.4em] uppercase font-medium hover:bg-black hover:text-white transition-all duration-500"
        >
          Download Full Services PDF
        </button>
      )}

      {/* Persistent Success Banner (after closing modal) */}
      {status === "success" && !isOpen && (
        <div className="block w-full lg:max-w-2xl mx-auto text-center py-6 border border-black/10 bg-[#faf9f6] text-black md:text-xs text-[10px] tracking-[0.2em] uppercase font-medium">
          PDF DELIVERED TO YOUR INBOX
        </div>
      )}

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-lg p-8 md:p-12 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-black/40 hover:text-black transition-colors"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            {status === "success" ? (
              /* Success UI */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-2xl font-light uppercase tracking-tight mb-4">Request Sent</h3>
                <p className="text-black/60 font-light text-sm leading-relaxed max-w-[280px] mx-auto">
                  We've securely delivered the services overview to your email address.
                </p>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="mt-10 px-8 py-5 border border-black/10 bg-transparent text-black text-[10px] tracking-[0.4em] uppercase font-medium hover:border-black transition-all duration-500 w-full"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Email Form UI */
              <div>
                <h3 className="text-2xl md:text-3xl font-light tracking-tight text-black mb-4 uppercase">
                  Download PDF
                </h3>
                <p className="text-sm font-light text-black/60 leading-relaxed mb-10">
                  Please provide your email address below. We'll securely deliver the full services overview directly to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    className="w-full px-6 py-5 border border-black/20 bg-[#faf9f6] text-black placeholder:text-black/40 text-[10px] tracking-[0.2em] focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-5 border border-black bg-black text-white text-[10px] tracking-[0.4em] uppercase font-medium hover:bg-transparent hover:text-black transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "SENDING..." : "SEND TO EMAIL"}
                  </button>

                  {status === "error" && (
                    <div className="text-center text-red-500 text-[10px] tracking-widest uppercase mt-2">
                      {message}
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
