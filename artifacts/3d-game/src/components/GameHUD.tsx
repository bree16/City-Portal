import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const STAGE_NAMES = [
  "Renting & Saving",
  "Preparing to Buy",
  "House Hunting",
  "Offer & Negotiation",
  "Mortgage Approval",
  "Closing Day",
  "Move In"
];

export function GameHUD() {
  const { stage, month, cash, savings, creditScore } = useGameStore();

  return (
    <div className="sticky top-0 z-40 w-full bg-primary text-primary-foreground shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-md">
            <Home className="w-5 h-5 text-accent" />
          </div>
          <div className="font-bold text-sm tracking-tight leading-tight">
            <div>Newport News</div>
            <div className="text-secondary text-xs">Housing Hub</div>
          </div>
        </div>

        {/* Center: Stage & Month */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-primary-foreground/70 font-medium tracking-wide uppercase">
            Month {month} of 36
          </div>
          <div className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full mt-1">
            Stage {stage}: {STAGE_NAMES[stage - 1]}
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-4 bg-black/20 rounded-xl px-4 py-2 text-sm font-medium">
          <div className="flex items-center gap-1.5" title="Cash">
            <span>💰</span>
            <span>${cash.toLocaleString()}</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <div className="flex items-center gap-1.5" title="Savings">
            <span>🏦</span>
            <span className="text-accent-foreground font-bold">${savings.toLocaleString()}</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <div className="flex items-center gap-1.5" title="Credit Score">
            <span>📊</span>
            <span className={creditScore >= 650 ? "text-green-400" : "text-yellow-400"}>
              {creditScore}
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-primary-foreground/10">
        <motion.div 
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${(stage / 7) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
