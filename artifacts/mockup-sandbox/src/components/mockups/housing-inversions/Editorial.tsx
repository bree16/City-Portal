import React from "react";
import { ArrowRight } from "lucide-react";

export default function Editorial() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] overflow-x-hidden font-['DM_Sans'] text-[#1A1A1A]">
      {/* SECTION 1 - Hero */}
      <section className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Wordmark */}
        <div className="absolute top-8 left-8 z-20 hidden lg:block">
          <span className="text-sm tracking-widest uppercase text-[#1A1A1A]/50">
            Housing Hub
          </span>
        </div>

        {/* Left Column - Imagery */}
        <div className="w-full lg:w-[58%] relative min-h-[50vh] lg:min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 overflow-hidden flex items-center justify-center p-8">
          <div className="lg:hidden absolute top-8 left-8 z-20">
            <span className="text-sm tracking-widest uppercase text-[#1A1A1A]/50 font-medium">
              Housing Hub
            </span>
          </div>
          
          {/* Collage rectangles */}
          <div className="relative w-full max-w-md xl:max-w-lg aspect-[3/4] mt-12 lg:mt-0">
            {/* Layer 1 */}
            <div className="absolute top-4 -left-4 lg:-left-8 w-full h-[110%] bg-[#C4622D]/10 transform -rotate-3 rounded-md shadow-xl mix-blend-multiply border border-[#C4622D]/20"></div>
            {/* Layer 2 */}
            <div className="absolute -top-8 left-2 lg:left-4 w-full h-full bg-white/40 transform rotate-2 rounded-md shadow-2xl backdrop-blur-sm border border-white/60"></div>
            {/* Layer 3 - Main Image Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 via-orange-100 to-yellow-200 transform -rotate-1 rounded-md shadow-md border-[8px] border-white flex items-center justify-center">
               {/* Decorative image-like gradient */}
               <div className="absolute inset-0 bg-[#C4622D]/10"></div>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-0 relative z-10 bg-[#FFF8F0]">
          <div className="max-w-md mx-auto lg:mx-0">
            <h2 className="text-xs tracking-[0.2em] uppercase text-[#C4622D] mb-6 font-semibold">
              Newport News, Virginia
            </h2>
            <h1 className="text-5xl lg:text-6xl font-['Playfair_Display'] font-bold leading-[1.1] text-[#1A1A1A] mb-6">
              Newport News.<br />
              <span className="text-[#C4622D]">Where Home Feels Like Yours.</span>
            </h1>
            <p className="text-lg text-[#5A5A5A] mb-10 max-w-sm leading-relaxed">
              Whether you're planting roots or just beginning to look — this is where your story starts.
            </p>
            
            <button className="bg-[#C4622D] text-white px-8 py-4 rounded-none text-base font-medium hover:bg-[#A8501F] transition-all flex items-center justify-center lg:justify-start gap-3 group w-full lg:w-auto shadow-lg shadow-[#C4622D]/20">
              Find Your Place
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-[#1A1A1A]/40 mt-4 text-center lg:text-left">
              Free · No account needed · Takes 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Stats Band */}
      <section className="w-full bg-[#1A1A1A] text-[#FFF8F0] py-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center space-y-16 lg:space-y-0 px-8">
          
          <div className="flex-1 flex flex-col items-center">
            <h3 className="text-5xl lg:text-7xl font-['Playfair_Display'] font-medium mb-4 text-[#FFF8F0]">14,000<span className="text-[#C4622D]">+</span></h3>
            <p className="text-sm text-[#FFF8F0]/70 tracking-[0.15em] uppercase font-medium">Families Housed</p>
          </div>

          <div className="hidden lg:block w-px h-24 bg-white/10"></div>
          <div className="lg:hidden h-px w-24 bg-white/10"></div>

          <div className="flex-1 flex flex-col items-center">
            <h3 className="text-5xl lg:text-7xl font-['Playfair_Display'] font-medium mb-4 text-[#FFF8F0]">4</h3>
            <p className="text-sm text-[#FFF8F0]/70 tracking-[0.15em] uppercase font-medium">Distinct Neighborhoods</p>
          </div>

          <div className="hidden lg:block w-px h-24 bg-white/10"></div>
          <div className="lg:hidden h-px w-24 bg-white/10"></div>

          <div className="flex-1 flex flex-col items-center">
            <h3 className="text-5xl lg:text-7xl font-['Playfair_Display'] font-medium mb-4 text-[#FFF8F0]">$0</h3>
            <p className="text-sm text-[#FFF8F0]/70 tracking-[0.15em] uppercase font-medium">Down Programs Available</p>
          </div>

        </div>
      </section>
    </div>
  );
}
