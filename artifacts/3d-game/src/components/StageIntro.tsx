import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface StageIntroProps {
  stage: number;
  title: string;
  description: string;
  onComplete: () => void;
}

export function StageIntro({ stage, title, description, onComplete }: StageIntroProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl max-w-md text-center border border-border"
      >
        <div className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-sm font-bold rounded-full mb-4">
          Stage {stage}
        </div>
        <h2 className="text-3xl font-bold mb-3 text-primary">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </motion.div>
    </motion.div>
  );
}
