import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-32 xs:pt-40 pb-32 px-6 xs:px-12 md:px-24 min-h-screen">
        <section className="mb-12 xs:mb-24">
          <span className="text-[10px] tracking-[0.5em] font-medium text-black uppercase mb-4 block">Let's build</span>
          <h1 className="text-4xl xs:text-6xl md:text-8xl font-thin tracking-tighter text-black leading-none uppercase">
            CONTACT US
          </h1>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="space-y-16">
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-medium text-black uppercase block">Office</span>
              <p className="text-2xl font-light leading-relaxed text-black">
                10000, Paynesville,<br/>
                Monrovia, Liberia
              </p>
            </div>
            
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-medium text-black uppercase block">Global Inquiry</span>
              <p className="text-2xl font-light hover:opacity-60 transition-opacity cursor-pointer">
              chrispopdesigninc@gmail.com
              </p>
            </div>
          </div>

          <form className="space-y-8 md:bg-surface-container-low p-0 md:p-12 lg:p-20">
            <div className="space-y-4">
              <label className="text-[10px] tracking-[0.3em] font-light text-outline uppercase block">Name</label>
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors placeholder:text-black/20"
                placeholder="First Last"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] tracking-[0.3em] font-light text-outline uppercase block">Project Type</label>
              <select className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors appearance-none text-black/40">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Cultural</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] tracking-[0.3em] font-light text-outline uppercase block">Message</label>
              <textarea 
                rows={4}
                className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:outline-none focus:border-on-surface transition-colors resize-none placeholder:text-black/20"
                placeholder="Tell us about your vision"
              />
            </div>

            <button type="submit" className="w-full md:w-auto text-[10px] tracking-[0.5em] font-medium text-white bg-black uppercase px-12 py-6 hover:opacity-80 transition-all duration-500">
               Send Inquiry
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
