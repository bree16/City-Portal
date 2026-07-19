import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { lifeEvents } from '@/data/events';
import { EventModal } from '@/components/EventModal';
import { StageIntro } from '@/components/StageIntro';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wallet, TrendingUp, PiggyBank, CreditCard } from 'lucide-react';

export function Stage1Renting() {
  const { 
    month, cash, savings, creditScore, debt, monthlyIncome, 
    advanceMonth, updateCash, updateSavings, updateCreditScore, updateDebt, setStage, addAchievement, setLastEvent 
  } = useGameStore();

  const [showIntro, setShowIntro] = useState(true);
  const [activeEvent, setActiveEvent] = useState(null as any);
  
  // Expenses
  const rent = 1150;
  const food = 400;
  const transport = 350;
  const misc = 200;
  const totalExpenses = rent + food + transport + misc;
  const monthlyFreeCash = monthlyIncome - totalExpenses;

  const canAdvance = savings >= 5000 && creditScore >= 650;

  const handleMonthEnd = (choice: 'save' | 'spend' | 'debt') => {
    // 1. Process choice
    let cashChange = monthlyFreeCash;
    let savingsChange = 0;
    
    if (choice === 'save') {
      savingsChange = 200;
      cashChange -= 200;
    } else if (choice === 'spend') {
      cashChange -= 200; // Just lost money
    } else if (choice === 'debt') {
      updateDebt(-200);
      updateCreditScore(5);
      cashChange -= 200;
    }

    // 2. Apply regular monthly changes
    updateCash(cashChange);
    if (savingsChange > 0) updateSavings(savingsChange);
    
    // Auto-save any extra cash over $3000 to keep it clean
    if (cash + cashChange > 3000) {
      const extra = (cash + cashChange) - 3000;
      updateCash(-extra);
      updateSavings(extra);
    }

    // 3. Random event chance (every 3-4 months roughly)
    const shouldHaveEvent = (month % 3 === 0) || (Math.random() < 0.2);
    
    if (shouldHaveEvent) {
      // Pick random event using month as a simple seed proxy or just Math.random since this is local
      const eventIndex = Math.floor(Math.random() * lifeEvents.length);
      const event = lifeEvents[eventIndex];
      setActiveEvent(event);
      setLastEvent(event.id);
      
      // Apply event effects
      if (event.cashEffect) updateCash(event.cashEffect);
      if (event.creditEffect) updateCreditScore(event.creditEffect);
    } else {
      advanceMonth(0); // We already applied cash changes
    }
  };

  const closeEvent = () => {
    setActiveEvent(null);
    advanceMonth(0);
  };

  const finishStage = () => {
    addAchievement('budget_master');
    setStage(2);
  };

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {showIntro && (
          <StageIntro 
            stage={1} 
            title="Renting & Saving" 
            description="Build your down payment and improve your credit score. You need $5,000 in savings and a 650 credit score to start looking for a home!"
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      <EventModal event={activeEvent} onClose={closeEvent} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 flex-1">
        {/* Left Column: Budget */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="text-accent" /> Monthly Budget
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                <div className="text-sm text-green-700 dark:text-green-400 font-semibold mb-1">Income</div>
                <div className="text-2xl font-bold text-green-800 dark:text-green-300">+${monthlyIncome}</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                <div className="text-sm text-red-700 dark:text-red-400 font-semibold mb-1">Expenses</div>
                <div className="text-2xl font-bold text-red-800 dark:text-red-300">-${totalExpenses}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rent</span>
                <span className="font-medium">${rent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Food</span>
                <span className="font-medium">${food}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transport</span>
                <span className="font-medium">${transport}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Misc</span>
                <span className="font-medium">${misc}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-primary">
                <span>Leftover Cash</span>
                <span>${monthlyFreeCash}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <h2 className="text-xl font-bold mb-4">Month {month} Decisions</h2>
            <p className="text-sm text-muted-foreground mb-4">How will you use your extra $200 this month?</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => handleMonthEnd('save')}
                className="p-4 border-2 border-accent/20 rounded-xl hover:bg-accent/5 hover:border-accent transition-colors flex flex-col items-center text-center"
              >
                <PiggyBank className="w-8 h-8 text-accent mb-2" />
                <span className="font-bold text-primary text-sm">Save Extra</span>
                <span className="text-xs text-muted-foreground mt-1">+$200 to Savings</span>
              </button>
              
              <button 
                onClick={() => handleMonthEnd('debt')}
                className="p-4 border-2 border-secondary/20 rounded-xl hover:bg-secondary/5 hover:border-secondary transition-colors flex flex-col items-center text-center"
              >
                <CreditCard className="w-8 h-8 text-secondary mb-2" />
                <span className="font-bold text-primary text-sm">Pay Debt</span>
                <span className="text-xs text-muted-foreground mt-1">-$200 Debt, +5 Credit</span>
              </button>

              <button 
                onClick={() => handleMonthEnd('spend')}
                className="p-4 border-2 border-border rounded-xl hover:bg-muted transition-colors flex flex-col items-center text-center"
              >
                <span className="text-3xl mb-2">🎮</span>
                <span className="font-bold text-primary text-sm">Treat Yourself</span>
                <span className="text-xs text-muted-foreground mt-1">Lose $200, feel good</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Goals */}
        <div className="col-span-1 space-y-6">
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-secondary" /> Stage Goals
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Savings: $5,000</span>
                  <span className="text-sm font-bold text-secondary">${savings}</span>
                </div>
                <div className="h-2 w-full bg-primary-foreground/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (savings / 5000) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Credit Score: 650</span>
                  <span className="text-sm font-bold text-accent">{creditScore}</span>
                </div>
                <div className="h-2 w-full bg-primary-foreground/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((creditScore - 300) / 550) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-primary-foreground/60 mt-2">
                  Current Debt: ${debt.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={finishStage}
                disabled={!canAdvance}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                  canAdvance 
                    ? 'bg-secondary text-primary hover:bg-secondary/90 shadow-lg cursor-pointer' 
                    : 'bg-primary-foreground/10 text-primary-foreground/50 cursor-not-allowed'
                }`}
              >
                {canAdvance ? 'Start House Hunting' : 'Keep Saving'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Educational Tooltip */}
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
            <h3 className="font-bold text-accent mb-2 flex items-center gap-2">
              <span className="bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">i</span>
              Why credit matters
            </h3>
            <p className="text-sm text-muted-foreground">
              Your credit score determines your mortgage interest rate. A score of 620 is the minimum for many loans, but 650+ gets you better rates, saving you thousands over 30 years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
