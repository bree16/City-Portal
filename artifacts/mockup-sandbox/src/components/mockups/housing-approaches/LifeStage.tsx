import React, { useState } from 'react';
import { 
  MapPin, 
  RefreshCw, 
  Home, 
  HandHeart, 
  ArrowRight, 
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

const LifeStage = () => {
  const [activeStage, setActiveStage] = useState('ready-to-own');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#0A8F7E] selection:text-white">
      {/* Soft warm gradient strip */}
      <div className="h-64 w-full absolute top-0 left-0 bg-gradient-to-b from-[#FFF8F0] to-white pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-center mt-12 mb-10">
          <span className="text-xs uppercase tracking-widest text-[#0A8F7E] font-bold">
            Newport News Housing Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D2B5E] mt-4 tracking-tight text-center">
            Where are you in your journey?
          </h1>
          <p className="text-gray-500 text-lg text-center mt-4 max-w-2xl">
            Pick the moment that fits. We'll show you exactly what's available.
          </p>
        </div>

        {/* Life Stage Selector */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 w-full">
          {/* Card 1: Just Arrived */}
          <button 
            onClick={() => setActiveStage('just-arrived')}
            className={`flex flex-col items-start p-6 rounded-2xl w-full sm:w-[calc(50%-1rem)] lg:w-[240px] text-left transition-all duration-300 ${
              activeStage === 'just-arrived' 
                ? 'bg-[#0D2B5E] text-white shadow-xl scale-105 border-[#0D2B5E] ring-4 ring-[#0D2B5E]/10' 
                : 'bg-white text-[#0D2B5E] border-2 border-gray-100 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <MapPin className={`w-8 h-8 mb-4 ${activeStage === 'just-arrived' ? 'text-[#D4A843]' : 'text-[#0A8F7E]'}`} />
            <h3 className="font-bold text-lg leading-tight mb-1">Just Arrived</h3>
            <p className={`text-sm ${activeStage === 'just-arrived' ? 'text-blue-100' : 'text-gray-500'}`}>
              New to Newport News
            </p>
          </button>

          {/* Card 2: Starting Fresh */}
          <button 
            onClick={() => setActiveStage('starting-fresh')}
            className={`flex flex-col items-start p-6 rounded-2xl w-full sm:w-[calc(50%-1rem)] lg:w-[240px] text-left transition-all duration-300 ${
              activeStage === 'starting-fresh' 
                ? 'bg-[#0D2B5E] text-white shadow-xl scale-105 border-[#0D2B5E] ring-4 ring-[#0D2B5E]/10' 
                : 'bg-white text-[#0D2B5E] border-2 border-gray-100 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <RefreshCw className={`w-8 h-8 mb-4 ${activeStage === 'starting-fresh' ? 'text-[#D4A843]' : 'text-[#0A8F7E]'}`} />
            <h3 className="font-bold text-lg leading-tight mb-1">Starting Fresh</h3>
            <p className={`text-sm ${activeStage === 'starting-fresh' ? 'text-blue-100' : 'text-gray-500'}`}>
              Rebuilding or relocating
            </p>
          </button>

          {/* Card 3: Ready to Own */}
          <button 
            onClick={() => setActiveStage('ready-to-own')}
            className={`flex flex-col items-start p-6 rounded-2xl w-full sm:w-[calc(50%-1rem)] lg:w-[240px] text-left transition-all duration-300 ${
              activeStage === 'ready-to-own' 
                ? 'bg-[#0D2B5E] text-white shadow-xl scale-105 border-[#0D2B5E] ring-4 ring-[#0D2B5E]/10' 
                : 'bg-white text-[#0D2B5E] border-2 border-gray-100 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <Home className={`w-8 h-8 mb-4 ${activeStage === 'ready-to-own' ? 'text-[#D4A843]' : 'text-[#0A8F7E]'}`} />
            <h3 className="font-bold text-lg leading-tight mb-1">Ready to Own</h3>
            <p className={`text-sm ${activeStage === 'ready-to-own' ? 'text-blue-100' : 'text-gray-500'}`}>
              First-time buyer
            </p>
          </button>

          {/* Card 4: Need Help Now */}
          <button 
            onClick={() => setActiveStage('need-help-now')}
            className={`flex flex-col items-start p-6 rounded-2xl w-full sm:w-[calc(50%-1rem)] lg:w-[240px] text-left transition-all duration-300 ${
              activeStage === 'need-help-now' 
                ? 'bg-red-600 text-white shadow-xl scale-105 border-red-600 ring-4 ring-red-600/10' 
                : 'bg-red-50 text-red-900 border-2 border-red-100 hover:border-red-200 hover:bg-red-100'
            }`}
          >
            <HandHeart className={`w-8 h-8 mb-4 ${activeStage === 'need-help-now' ? 'text-white' : 'text-red-500'}`} />
            <h3 className="font-bold text-lg leading-tight mb-1">Need Help Now</h3>
            <p className={`text-sm ${activeStage === 'need-help-now' ? 'text-red-100' : 'text-red-600/70'}`}>
              Emergency or crisis
            </p>
          </button>
        </div>

        {/* Revealed Panel */}
        <div className="mt-12 bg-[#F4F6F9] rounded-[2rem] p-8 lg:p-12 max-w-5xl mx-auto shadow-sm border border-gray-200 relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#0A8F7E]/5 rounded-full blur-3xl pointer-events-none" />

          {activeStage === 'ready-to-own' && (
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Left Column (60%) */}
              <div className="flex-1 lg:max-w-[55%]">
                <span className="inline-block bg-[#0A8F7E]/10 text-[#0A8F7E] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-5">
                  First-Time Buyer Path
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0D2B5E] leading-tight mb-4">
                  Your path to homeownership starts here.
                </h2>
                <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                  We believe building equity shouldn't be out of reach. Newport News offers up to <strong className="text-[#0D2B5E]">$25,000 in down payment assistance</strong> and special loan programs to help you plant roots in our neighborhoods.
                </p>

                {/* 3-Step Roadmap */}
                <div className="space-y-3">
                  
                  {/* Step 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex flex-col items-center mt-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A8F7E] text-white shadow-md shadow-[#0A8F7E]/20 shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div className="w-[2px] h-12 bg-[#0A8F7E]/20 mt-3 rounded-full"></div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1 hover:border-[#0A8F7E]/30 transition-colors">
                      <h4 className="font-bold text-[#0D2B5E] mb-1">Check eligibility</h4>
                      <p className="text-sm text-gray-500">Find out if you qualify for Newport News local programs based on income.</p>
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex flex-col items-center mt-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-200 bg-white text-gray-400 shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div className="w-[2px] h-12 bg-gray-200 mt-3 rounded-full"></div>
                    </div>
                    <div className="bg-white/60 p-5 rounded-2xl border border-gray-100 flex-1 hover:bg-white transition-colors">
                      <h4 className="font-bold text-gray-700 mb-1">Apply for assistance</h4>
                      <p className="text-sm text-gray-500">Secure down payment assistance or low-interest loan pre-approval.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex flex-col items-center mt-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-200 bg-white text-gray-400 shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                    </div>
                    <div className="bg-white/60 p-5 rounded-2xl border border-gray-100 flex-1 hover:bg-white transition-colors">
                      <h4 className="font-bold text-gray-700 mb-1">Find your home</h4>
                      <p className="text-sm text-gray-500">From Denbigh to Hilton Village, search approved properties for your budget.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (40%) */}
              <div className="flex-1 lg:min-w-[320px] flex flex-col">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
                  <h3 className="text-sm font-bold text-[#0D2B5E] uppercase tracking-wider">
                    Programs available
                  </h3>
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                </div>
                
                <div className="flex flex-col gap-4 mb-8 flex-grow">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#0A8F7E]/40 hover:shadow-md transition-all cursor-pointer group flex gap-4 items-start">
                    <div className="bg-[#0A8F7E]/10 p-2.5 rounded-xl shrink-0 group-hover:bg-[#0A8F7E] group-hover:text-white transition-colors text-[#0A8F7E]">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D2B5E] text-sm group-hover:text-[#0A8F7E] transition-colors mb-0.5">First-Time Homebuyer</h4>
                      <p className="text-sm text-gray-500 leading-snug">Up to $25,000 down payment match for qualified applicants.</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#D4A843]/40 hover:shadow-md transition-all cursor-pointer group flex gap-4 items-start">
                    <div className="bg-[#D4A843]/10 p-2.5 rounded-xl shrink-0 group-hover:bg-[#D4A843] group-hover:text-white transition-colors text-[#D4A843]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D2B5E] text-sm group-hover:text-[#D4A843] transition-colors mb-0.5">VHDA & VA Loans</h4>
                      <p className="text-sm text-gray-500 leading-snug">Special rates and terms for veterans and state residents.</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#0D2B5E]/40 hover:shadow-md transition-all cursor-pointer group flex gap-4 items-start">
                    <div className="bg-[#0D2B5E]/10 p-2.5 rounded-xl shrink-0 group-hover:bg-[#0D2B5E] group-hover:text-white transition-colors text-[#0D2B5E]">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D2B5E] text-sm transition-colors mb-0.5">Targeted Revitalization</h4>
                      <p className="text-sm text-gray-500 leading-snug">Extra incentives for buying in the Southeast and Denbigh areas.</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#0A8F7E] hover:bg-[#087A6B] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#0A8F7E]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-between group mt-auto">
                  <span className="text-lg">Start My Journey</span>
                  <div className="bg-white/20 p-1 rounded-lg">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeStage !== 'ready-to-own' && (
            <div className="flex flex-col items-center justify-center py-20 text-center relative z-10 animate-in fade-in duration-300">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100">
                <RefreshCw className="w-8 h-8 text-[#0A8F7E]/50 animate-[spin_3s_linear_infinite]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0D2B5E] mb-3">Tailoring your path...</h3>
              <p className="text-gray-500 max-w-sm text-lg">Select <strong className="text-gray-700">"Ready to Own"</strong> to see the full experience for this demo.</p>
              <button 
                onClick={() => setActiveStage('ready-to-own')}
                className="mt-8 text-[#0A8F7E] font-semibold hover:text-[#087A6B] hover:bg-[#0A8F7E]/5 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors border border-[#0A8F7E]/20"
              >
                View First-Time Buyer Path <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LifeStage;
