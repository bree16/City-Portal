import React from 'react';

export default function OneQuestion() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white px-8 md:px-20 font-['DM_Sans']">
      {/* Top-left corner */}
      <div className="absolute top-8 left-8 text-sm tracking-widest uppercase text-[#0A0A0A] font-['DM_Sans']">
        Housing Hub
      </div>

      {/* Bottom-right corner */}
      <div className="absolute bottom-8 right-8 text-xs text-gray-400 font-['DM_Sans']">
        (757) 933-2311
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-16 md:gap-20">
        {/* LEFT column */}
        <div className="flex-1">
          <div className="w-[28px] h-[28px] rounded-full bg-[#0A8F7E] text-white text-xs font-bold flex items-center justify-center mb-8">
            01
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-['DM_Sans'] leading-[1.05] text-[#0A0A0A] tracking-tight">
            What's your housing goal?
          </h1>
        </div>

        {/* RIGHT column */}
        <div className="w-full md:w-80 shrink-0">
          <div className="flex flex-col gap-3">
            {[
              "Buy my first home",
              "Find a rental I can afford",
              "Get emergency help now",
              "Learn about assistance programs",
              "Just exploring for now",
            ].map((option, index) => (
              <button
                key={index}
                className="w-full text-left py-4 px-5 border-l-4 border-l-[#0A8F7E] border-y border-y-gray-100 border-r border-r-gray-100 bg-white font-['DM_Sans'] text-base font-medium text-[#0A0A0A] cursor-pointer hover:bg-[#F0FAF9] transition-none focus:outline-none"
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-6 text-xs text-gray-400 font-['DM_Sans']">
            No account needed · Free · Takes 30 seconds
          </div>
        </div>
      </div>
    </div>
  );
}
