import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeEvent } from '@/data/events';

interface EventModalProps {
  event: LifeEvent | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  const isPositive = (event.cashEffect || 0) > 0 || (event.incomeEffect || 0) > 0;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-card text-card-foreground p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-border relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
          
          <div className="text-5xl mb-4 text-center">{event.icon}</div>
          <h3 className="text-2xl font-bold text-center mb-2 text-primary">{event.title}</h3>
          <p className="text-center text-muted-foreground mb-6">{event.description}</p>
          
          <div className="bg-muted p-4 rounded-xl mb-6">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Effect</h4>
            {event.cashEffect !== undefined && (
              <div className={`flex justify-between font-medium ${event.cashEffect > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>Cash</span>
                <span>{event.cashEffect > 0 ? '+' : ''}{event.cashEffect}</span>
              </div>
            )}
            {event.incomeEffect !== undefined && (
              <div className="flex justify-between font-medium text-green-600 mt-1">
                <span>Monthly Income</span>
                <span>+{event.incomeEffect}</span>
              </div>
            )}
            {event.monthlyExpenseEffect !== undefined && (
              <div className="flex justify-between font-medium text-red-600 mt-1">
                <span>Monthly Expenses</span>
                <span>+{event.monthlyExpenseEffect}</span>
              </div>
            )}
            {event.creditEffect !== undefined && event.creditEffect !== 0 && (
              <div className={`flex justify-between font-medium mt-1 ${event.creditEffect > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>Credit Score</span>
                <span>{event.creditEffect > 0 ? '+' : ''}{event.creditEffect}</span>
              </div>
            )}
          </div>
          
          <div className="bg-secondary/10 border border-secondary/20 p-3 rounded-lg mb-6">
            <p className="text-sm text-primary font-medium italic">"{event.lesson}"</p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
