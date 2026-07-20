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
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, x: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="glass-panel fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3"
          style={{ borderColor: 'rgba(255, 234, 0, 0.38)', fontFamily: 'var(--display-font)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ color: 'var(--gold)', backgroundColor: 'rgba(255, 234, 0, 0.18)' }}>
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1 }}>Achievement Unlocked</p>
            <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--glass-text)' }}>{title}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
