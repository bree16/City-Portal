import React from 'react';
import { Send, Check, Phone, Search } from 'lucide-react';

export default function ConversationalGuide() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] text-gray-900 flex flex-col">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shadow-sm">
        <div className="text-xl font-bold text-[#0D2B5E] tracking-tight flex items-center gap-2">
          Housing Hub
        </div>
        <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          (757) 933-2311
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        {/* Chat Window */}
        <div className="w-full max-w-2xl mt-12 sm:mt-16 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
          
          {/* Header Bar */}
          <div className="bg-[#0D2B5E] h-16 flex items-center px-6">
            <div className="w-8 h-8 rounded-full bg-[#0A8F7E] flex items-center justify-center text-white font-bold text-sm mr-3 shadow-inner">
              HH
            </div>
            <h2 className="text-white font-semibold text-lg tracking-wide">Your Housing Guide</h2>
          </div>

          {/* Chat Body */}
          <div className="p-6 h-[460px] overflow-y-auto flex flex-col gap-5 bg-white relative">
            
            {/* Message 1: Guide */}
            <div className="flex w-full">
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-sm">
                Hi! I'm here to help you find the right housing path in Newport News. To start — are you currently renting or do you own your home?
              </div>
            </div>

            {/* Message 2: User */}
            <div className="flex w-full justify-end">
              <div className="bg-[#0A8F7E] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-sm">
                I'm renting right now.
              </div>
            </div>

            {/* Message 3: Guide */}
            <div className="flex w-full">
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-sm">
                Got it! And are you thinking about buying, or looking for a more affordable rental?
              </div>
            </div>

            {/* Message 4: User */}
            <div className="flex w-full justify-end">
              <div className="bg-[#0A8F7E] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-sm">
                I'd love to buy eventually but need help with the down payment.
              </div>
            </div>

            {/* Typing Indicator */}
            <div className="flex w-full mt-2">
              <div className="bg-gray-50 border border-gray-100 rounded-full px-4 py-2 flex items-center gap-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>

            {/* Result Card (simulating appearing after typing) */}
            <div className="w-full mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <div className="bg-[#F4F6F9] rounded-xl p-5 border border-blue-50/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-10 -translate-y-10"></div>
                
                <h3 className="text-[#0A8F7E] font-semibold mb-4 text-sm uppercase tracking-wider">
                  Based on what you've shared:
                </h3>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0D2B5E]">First-Time Homebuyer Assistance</div>
                      <div className="text-sm text-gray-500 mt-0.5">Up to $25,000 in down payment grants</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0D2B5E]">VHDA Fixed-Rate Mortgage</div>
                      <div className="text-sm text-gray-500 mt-0.5">Low down payment options for first buyers</div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-[#0D2B5E] hover:bg-[#153a7a] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group">
                  See Your Full Plan
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
            
          </div>

          {/* Input Bar */}
          <div className="border-t border-gray-100 p-4 bg-white">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0A8F7E]/20 focus:border-[#0A8F7E] transition-all"
              />
              <button className="absolute right-2 w-10 h-10 bg-[#0A8F7E] hover:bg-[#087a6b] text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Start Chips below chat */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 w-full max-w-2xl px-4">
          <button className="bg-white border border-gray-200 hover:border-[#0A8F7E] hover:text-[#0A8F7E] text-gray-600 text-sm font-medium py-2 px-4 rounded-full transition-colors shadow-sm">
            I need emergency help
          </button>
          <button className="bg-white border border-gray-200 hover:border-[#0A8F7E] hover:text-[#0A8F7E] text-gray-600 text-sm font-medium py-2 px-4 rounded-full transition-colors shadow-sm">
            I'm looking to rent
          </button>
          <button className="bg-white border border-gray-200 hover:border-[#0A8F7E] hover:text-[#0A8F7E] text-gray-600 text-sm font-medium py-2 px-4 rounded-full transition-colors shadow-sm">
            Tell me about neighborhoods
          </button>
        </div>
        
      </main>
    </div>
  );
}