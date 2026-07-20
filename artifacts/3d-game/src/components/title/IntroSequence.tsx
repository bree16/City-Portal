import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAudioEngine } from '@/hooks/useGameAudio';

const SLIDES = [
  {
    title: "The Journey Begins",
    text: "Buying your first home isn't just about finding the right house. It's about preparation. Learn how to build your credit, manage your budget, and save for your future.",
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    title: "The House Hunt",
    text: "Explore Newport News, tour open houses, and negotiate offers. Balance your wishlist with your budget, and beware of unexpected expenses along the way.",
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    title: "Closing & Beyond",
    text: "Secure your mortgage, close the deal, and settle into Home Life. Maintain your property, navigate market swings, and build lasting wealth.",
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    )
  }
];

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const engine = getAudioEngine();

  const handleNext = () => {
    engine.play('click');
    if (index < SLIDES.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    engine.play('click');
    onComplete();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#110e15] p-6 text-[#ffffff] overflow-hidden relative">
      <div className="absolute top-6 right-6 z-20">
        <button onClick={handleSkip} className="text-[#a097b6] hover:text-[var(--gold)]  font-bold text-sm tracking-widest transition-colors flex items-center space-x-1" style={{ fontFamily: 'var(--display-font)' }}>
          <span>Skip Intro</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      <div className="max-w-2xl w-full relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass-panel p-10 flex flex-col items-center text-center space-y-6 w-full"
          >
            <div className="p-6 bg-[#09070a] border-2 border-[rgba(255,255,255,0.2)] rounded-full shadow-lg mb-2 transform -rotate-3">
              {SLIDES[index].icon}
            </div>
            
            <h2 className="text-4xl font-extrabold  text-[var(--gold)]" style={{ fontFamily: 'var(--display-font)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {SLIDES[index].title}
            </h2>
            
            <p className="text-xl text-[#e2dced] leading-relaxed font-medium min-h-[120px]">
              {SLIDES[index].text}
            </p>

            <div className="pt-6 w-full flex flex-row items-center justify-between">
              <div className="flex space-x-3 pl-2">
                {SLIDES.map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full border-2 transition-colors ${i === index ? 'bg-[var(--teal)] border-[var(--teal)]' : 'bg-transparent border-[#a097b6]'}`} />
                ))}
              </div>
              
              <button onClick={handleNext} className="glass-btn-accent px-8 py-3 text-lg flex items-center space-x-2">
                <span>{index === SLIDES.length - 1 ? "Start Journey" : "Next"}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}