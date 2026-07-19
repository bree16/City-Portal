import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface AchievementToastProps {
  isVisible: boolean;
  title: string;
  onClose: () => void;
}

export function AchievementToast({ isVisible, title, onClose }: AchievementToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-navy-900 border-2 border-gold-500 rounded-xl shadow-2xl"
          style={{ backgroundColor: '#0D2B5E', borderColor: '#D4A843' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold-500/20 text-gold-500" style={{ color: '#D4A843', backgroundColor: 'rgba(212, 168, 67, 0.2)' }}>
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gold-500 font-bold uppercase tracking-wider" style={{ color: '#D4A843' }}>Achievement Unlocked</p>
            <p className="text-sm font-semibold text-white">{title}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
