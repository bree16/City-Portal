import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PenTool, CheckCircle, Key, ArrowRight } from 'lucide-react';

const STEPS = [
  { id: 'purchase', label: 'Sign Purchase Agreement' },
  { id: 'loan', label: 'Sign Loan Documents' },
  { id: 'cash', label: 'Wire Closing Costs' },
  { id: 'keys', label: 'Get the Keys!' },
];

export function Stage6Closing() {
  const { selectedHome, cash, updateCash, setStage, addAchievement, updateHomeEquity } = useGameStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    if (stepIndex === 4) {
      // Fire confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#0A8F7E', '#D4A843', '#0D2B5E']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#0A8F7E', '#D4A843', '#0D2B5E']
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      addAchievement('homeowner');
      if (selectedHome) {
        // Simple equity calc: value - loan
        updateHomeEquity(selectedHome.price * 0.05); // 5% down payment becomes equity immediately
      }
    }
  }, [stepIndex, addAchievement, selectedHome, updateHomeEquity]);

  if (!selectedHome) return null;

  const handleNextStep = () => {
    if (stepIndex === 2) {
      // Deduct closing costs + down payment roughly
      updateCash(-5000);
    }

    if (stepIndex < 3) {
      setIsSigning(true);
      setTimeout(() => {
        setIsSigning(false);
        setStepIndex(prev => prev + 1);
      }, 1500);
    } else {
      setStepIndex(4);
    }
  };

  const activeStep = STEPS[Math.min(stepIndex, 3)];

  return (
    <div className="flex flex-col h-full bg-primary text-primary-foreground p-6">
      
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col pt-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-secondary mb-4 drop-shadow-md">Closing Day!</h1>
          <p className="text-xl text-primary-foreground/80">You are at the title company. Just a few more steps.</p>
        </div>

        <div className="flex justify-between relative mb-20 px-8">
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-primary-foreground/20 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-8 h-1 bg-secondary -translate-y-1/2 z-0 transition-all duration-1000"
            style={{ width: `${(Math.min(stepIndex, 3) / 3) * 100}%` }}
          ></div>
          
          {STEPS.map((step, idx) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${
                idx < stepIndex ? 'bg-secondary border-secondary text-primary' :
                idx === stepIndex ? 'bg-primary border-secondary text-secondary' :
                'bg-primary border-primary-foreground/20 text-primary-foreground/20'
              }`}>
                {idx < stepIndex ? <CheckCircle className="w-6 h-6" /> : idx + 1}
              </div>
              <span className={`absolute top-16 text-sm font-bold text-center w-32 -ml-10 transition-colors ${
                idx <= stepIndex ? 'text-white' : 'text-primary-foreground/40'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {stepIndex < 4 ? (
            <motion.div 
              key={stepIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card text-card-foreground p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border-2 border-secondary"
            >
              {isSigning ? (
                <div className="h-32 flex flex-col items-center justify-center">
                  <PenTool className="w-12 h-12 text-primary animate-bounce mb-4" />
                  <div className="w-48 h-2 bg-muted rounded overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-6xl mb-6">
                    {stepIndex === 0 && '📝'}
                    {stepIndex === 1 && '📑'}
                    {stepIndex === 2 && '💸'}
                    {stepIndex === 3 && '🗝️'}
                  </div>
                  <h3 className="text-2xl font-bold mb-8 text-primary">{activeStep.label}</h3>
                  <button 
                    onClick={handleNextStep}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-lg text-lg"
                  >
                    {stepIndex === 2 ? 'Pay $5,000' : 'Sign Here'}
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-secondary/50">
                <Key className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Congratulations!</h2>
              <p className="text-xl text-primary-foreground/80 mb-12">You are officially a homeowner.</p>
              
              <button 
                onClick={() => setStage(7)}
                className="py-4 px-12 bg-white text-primary font-bold rounded-full hover:bg-gray-100 shadow-xl text-xl flex items-center gap-2 mx-auto"
              >
                Move In <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
