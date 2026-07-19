import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  School,
  Building,
  DollarSign
} from 'lucide-react';

const neighborhoods = [
  {
    id: "hilton-village",
    name: "Hilton Village",
    priceRange: "$180k–$280k",
    color: "bg-emerald-800",
    stats: {
      homePrice: "$230,000",
      rent: "$1,400",
      walkScore: "85/100",
      schoolRating: "A-"
    },
    programs: [
      "First-Time Homebuyer Assistance",
      "Home Repair Grants",
      "VHDA Loans"
    ]
  },
  {
    id: "denbigh",
    name: "Denbigh",
    priceRange: "$200k–$320k",
    color: "bg-blue-800",
    stats: {
      homePrice: "$260,000",
      rent: "$1,600",
      walkScore: "45/100",
      schoolRating: "B+"
    },
    programs: [
      "First-Time Homebuyer Assistance",
      "FHA Loans",
      "VA Loans"
    ]
  },
  {
    id: "oyster-point",
    name: "Oyster Point",
    priceRange: "$250k–$380k",
    color: "bg-indigo-800",
    stats: {
      homePrice: "$315,000",
      rent: "$1,850",
      walkScore: "70/100",
      schoolRating: "A"
    },
    programs: [
      "Housing Choice Voucher",
      "Emergency Rental Assistance",
      "First-Time Homebuyer Assistance"
    ]
  },
  {
    id: "southeast",
    name: "Southeast",
    priceRange: "$120k–$200k",
    color: "bg-amber-800",
    stats: {
      homePrice: "$160,000",
      rent: "$1,100",
      walkScore: "60/100",
      schoolRating: "B"
    },
    programs: [
      "Home Repair Grants",
      "Emergency Rental Assistance",
      "First-Time Homebuyer Assistance"
    ]
  }
];

export default function NeighborhoodFirst() {
  const [selectedId, setSelectedId] = useState("hilton-village");
  
  const selectedNeighborhood = neighborhoods.find(n => n.id === selectedId) || neighborhoods[0];

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans flex flex-col">
      {/* Header / Nav Strip */}
      <header className="bg-[#0D2B5E] text-white py-4 px-8 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#0A8F7E] flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Newport News Housing</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-white/80">
          <a href="#" className="text-white hover:text-[#D4A843] transition-colors">Neighborhoods</a>
          <a href="#" className="hover:text-white transition-colors">Programs</a>
          <a href="#" className="hover:text-white transition-colors">Eligibility</a>
          <a href="#" className="hover:text-white transition-colors">Resources</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-[#0D2B5E] pt-16 pb-24 px-8 flex flex-col items-center text-center">
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Find Your Neighborhood First.
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Every neighborhood in Newport News offers something different. Start there.
          </p>
        </div>

        {/* Neighborhood Cards Row */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 justify-center w-full max-w-6xl">
          {neighborhoods.map((neighborhood) => {
            const isSelected = selectedId === neighborhood.id;
            return (
              <button
                key={neighborhood.id}
                onClick={() => setSelectedId(neighborhood.id)}
                className={`relative group overflow-hidden rounded-xl text-left transition-all duration-300 w-full md:w-[280px] h-64 focus:outline-none flex-shrink-0 ${
                  isSelected 
                    ? 'ring-4 ring-[#0A8F7E] ring-offset-4 ring-offset-[#0D2B5E] transform scale-[1.02]' 
                    : 'opacity-70 hover:opacity-100 hover:transform hover:scale-[1.01]'
                }`}
              >
                <div className={`absolute inset-0 ${neighborhood.color}`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-2">
                  <span className="inline-flex items-center self-start px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-xs font-semibold text-white">
                    {neighborhood.priceRange}
                  </span>
                  <h3 className="text-2xl font-bold text-white">
                    {neighborhood.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Expanded Panel */}
      <main className="flex-1 flex justify-center -mt-8 px-4 md:px-8 pb-16 z-10">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="p-8 md:p-12 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-8 text-[#0D2B5E]">
              <MapPin className="w-6 h-6 text-[#0A8F7E]" />
              <h2 className="text-3xl font-bold">Living in {selectedNeighborhood.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Left Column: Stats Grid */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Affordability & Snapshot
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#F4F6F9] border border-gray-100 flex flex-col">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                      <Home className="w-5 h-5 text-[#0A8F7E]" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium mb-1">Median Home</span>
                    <span className="text-2xl font-bold text-[#0D2B5E]">{selectedNeighborhood.stats.homePrice}</span>
                  </div>
                  <div className="p-5 rounded-xl bg-[#F4F6F9] border border-gray-100 flex flex-col">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                      <Building className="w-5 h-5 text-[#0A8F7E]" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium mb-1">Average Rent</span>
                    <span className="text-2xl font-bold text-[#0D2B5E]">{selectedNeighborhood.stats.rent}</span>
                  </div>
                  <div className="p-5 rounded-xl bg-[#F4F6F9] border border-gray-100 flex flex-col">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                      <TrendingUp className="w-5 h-5 text-[#0A8F7E]" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium mb-1">Walk Score</span>
                    <span className="text-2xl font-bold text-[#0D2B5E]">{selectedNeighborhood.stats.walkScore}</span>
                  </div>
                  <div className="p-5 rounded-xl bg-[#F4F6F9] border border-gray-100 flex flex-col">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                      <School className="w-5 h-5 text-[#0A8F7E]" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium mb-1">School Rating</span>
                    <span className="text-2xl font-bold text-[#0D2B5E]">{selectedNeighborhood.stats.schoolRating}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Programs Available */}
              <div className="space-y-6 flex flex-col">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Programs available here
                </h3>
                <div className="flex-1 flex flex-col gap-3">
                  {selectedNeighborhood.programs.map((program, idx) => (
                    <div key={idx} className="flex flex-col p-4 rounded-xl border border-gray-200 hover:border-[#0A8F7E]/30 transition-colors group">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0A8F7E] mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-800 group-hover:text-[#0D2B5E] transition-colors block mb-1">
                            {program}
                          </span>
                          <a href="#" className="inline-flex items-center text-sm font-medium text-[#0A8F7E] hover:text-[#0D2B5E] transition-colors">
                            View details <ArrowRight className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 flex justify-end">
            <button className="px-8 py-4 bg-[#0A8F7E] hover:bg-[#087769] text-white rounded-lg font-medium text-lg transition-colors flex items-center gap-2">
              Explore {selectedNeighborhood.name} Programs
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="bg-[#0D2B5E] py-6 px-8 text-center text-white/60 text-sm">
        <p>Newport News Department of Housing · (757) 933-2311</p>
      </footer>
    </div>
  );
}
