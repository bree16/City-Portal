import React from "react";
import { 
  CheckCircle2, 
  Circle, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Calculator, 
  Map, 
  ClipboardCheck, 
  PhoneCall, 
  BadgeCheck 
} from "lucide-react";

export default function ProgressDashboard() {
  return (
    <div className="min-h-screen bg-[#F4F6F9] font-['Inter',sans-serif]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0D2B5E] flex items-center justify-center">
            <span className="text-white font-bold text-sm">NN</span>
          </div>
          <span className="text-xl font-bold text-[#0D2B5E] tracking-tight">Housing Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Maria's Dashboard</span>
          <div className="w-10 h-10 rounded-full bg-[#D4A843] flex items-center justify-center text-[#0D2B5E] font-bold shadow-sm">
            M
          </div>
        </div>
      </nav>

      {/* Main Content Grid */}
      <main className="max-w-6xl mx-auto mt-8 px-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Card 1: Your Active Path */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-end justify-between mb-2">
              <h2 className="text-xl font-bold text-[#0D2B5E]">First-Time Buyer Journey</h2>
              <span className="text-sm font-bold text-[#0A8F7E]">40% Complete</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8">
              <div className="bg-[#0A8F7E] h-2.5 rounded-full" style={{ width: '40%' }}></div>
            </div>

            {/* Checklist */}
            <div className="space-y-6">
              {/* Step 1: Done */}
              <div className="flex gap-4">
                <div className="mt-1 flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 fill-green-50" />
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>
                <div className="pb-4">
                  <h3 className="font-semibold text-gray-900 text-base">Eligibility quiz completed</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Done · July 14</p>
                </div>
              </div>

              {/* Step 2: Done */}
              <div className="flex gap-4">
                <div className="mt-1 flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 fill-green-50" />
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>
                <div className="pb-4">
                  <h3 className="font-semibold text-gray-900 text-base">Pre-qualification form submitted</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Done · July 16</p>
                </div>
              </div>

              {/* Step 3: Active */}
              <div className="flex gap-4">
                <div className="mt-1 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-2 border-[#0A8F7E] bg-[#0A8F7E]/10 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0A8F7E]"></div>
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>
                <div className="pb-4">
                  <h3 className="font-bold text-[#0D2B5E] text-base">Attend homebuyer workshop</h3>
                  <p className="text-sm font-medium text-[#0A8F7E] mt-0.5">Next step — Aug 3, 2026</p>
                  <button className="mt-4 bg-[#0A8F7E] hover:bg-[#087769] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm">
                    Register for Workshop <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step 4: Pending */}
              <div className="flex gap-4">
                <div className="mt-1">
                  <Circle className="w-6 h-6 text-gray-300 shrink-0" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-400 text-base">Submit down payment assistance application</h3>
                </div>
              </div>
            </div>
          </section>

          {/* Card 2: Upcoming Events */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0D2B5E]">Upcoming Events</h2>
              <button className="text-sm font-medium text-[#0A8F7E] hover:underline">View Calendar</button>
            </div>
            
            <div className="space-y-4">
              {/* Event 1 */}
              <div className="border border-gray-100 rounded-xl p-4 hover:border-[#0A8F7E]/30 transition-colors bg-gray-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Homebuyer Workshop</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Sat Aug 3, 9am–12pm</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> City Hall Room 200</span>
                    </div>
                  </div>
                  <button className="bg-white border border-gray-200 hover:border-[#0D2B5E] text-[#0D2B5E] px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap shadow-sm">
                    Register
                  </button>
                </div>
              </div>

              {/* Event 2 */}
              <div className="border border-gray-100 rounded-xl p-4 hover:border-[#0A8F7E]/30 transition-colors bg-gray-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Free Housing Counseling</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Tue Aug 12, 2pm</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Virtual</span>
                    </div>
                  </div>
                  <button className="bg-white border border-gray-200 hover:border-[#0D2B5E] text-[#0D2B5E] px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap shadow-sm">
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card 4: Your Eligibility Snapshot */}
          <section className="bg-[#0D2B5E] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            {/* Background pattern graphic */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 blur-2xl"></div>
            
            <h2 className="text-xl font-bold mb-1">Your Eligibility Snapshot</h2>
            <p className="text-[#A5B4CB] text-sm mb-5">Based on your profile, you pre-qualify for:</p>
            
            <div className="space-y-3 mb-6 relative z-10">
              <div className="bg-white/10 rounded-xl p-3.5 flex items-start gap-3 backdrop-blur-sm border border-white/5">
                <BadgeCheck className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white leading-tight">First-Time Buyer Assistance</h4>
                  <p className="text-xs text-[#A5B4CB] mt-1">Up to $25,000 down payment grant</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3.5 flex items-start gap-3 backdrop-blur-sm border border-white/5">
                <BadgeCheck className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white leading-tight">VHDA Fixed-Rate Loan</h4>
                  <p className="text-xs text-[#A5B4CB] mt-1">Favorable interest rates for qualifying buyers</p>
                </div>
              </div>
            </div>
            
            <button className="text-[#0A8F7E] hover:text-[#D4A843] font-bold text-sm flex items-center gap-1.5 transition-colors">
              Explore more matched programs <ChevronRight className="w-4 h-4" />
            </button>
          </section>

          {/* Card 3: Quick Resources */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#0D2B5E] mb-4">Quick Resources</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F6F9] text-[#0A8F7E] flex items-center justify-center group-hover:bg-[#0A8F7E] group-hover:text-white transition-colors">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm">Down Payment Calculator</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0D2B5E] transition-colors" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F6F9] text-[#0A8F7E] flex items-center justify-center group-hover:bg-[#0A8F7E] group-hover:text-white transition-colors">
                    <Map className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm">Neighborhood Guide</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0D2B5E] transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F6F9] text-[#0A8F7E] flex items-center justify-center group-hover:bg-[#0A8F7E] group-hover:text-white transition-colors">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm">Program Eligibility Quiz</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0D2B5E] transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F6F9] text-[#0A8F7E] flex items-center justify-center group-hover:bg-[#0A8F7E] group-hover:text-white transition-colors">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm">Contact a Counselor</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0D2B5E] transition-colors" />
              </button>
            </div>
          </section>

          {/* Card 5: Need Help? */}
          <section className="bg-[#0A8F7E] text-white rounded-xl p-5 shadow-sm bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]">
            <h3 className="font-bold text-lg mb-2">Need help navigating?</h3>
            <p className="text-white/80 text-sm mb-4">Our housing counselors are ready to answer your questions.</p>
            <button className="w-full bg-white text-[#0A8F7E] hover:bg-gray-50 font-bold py-2.5 rounded-lg flex justify-center items-center gap-2 text-sm transition-colors shadow-sm">
              <PhoneCall className="w-4 h-4" /> (757) 926-8081
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}