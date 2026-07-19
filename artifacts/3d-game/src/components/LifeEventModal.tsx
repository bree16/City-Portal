import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

const EFFECT_LABELS: Record<string, string> = {
  cash: '💰 Cash',
  savings: '🏦 Savings',
  income: '📈 Monthly Income',
  expenses: '📉 Monthly Expenses',
  credit: '📊 Credit Score',
};

export function LifeEventModal() {
  const { pendingLifeEvent, applyLifeEvent } = useGameStore();

  return (
    <AnimatePresence>
      {pendingLifeEvent && (
        <>
          {/* Backdrop */}
          <motion.div
            key="le-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal card */}
          <motion.div
            key="le-modal"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 61,
              width: '100%',
              maxWidth: 420,
              padding: '0 16px',
              boxSizing: 'border-box',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <div style={{
              background: 'linear-gradient(145deg, #0D2B5E 0%, #0A3A30 100%)',
              borderRadius: 24,
              padding: '28px 24px',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}>
              {/* Icon + title */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 52, marginBottom: 10, lineHeight: 1 }}>
                  {pendingLifeEvent.icon}
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: '3px 12px', borderRadius: 20,
                  background: 'rgba(212,168,67,0.15)',
                  border: '1px solid rgba(212,168,67,0.3)',
                  fontSize: 10, fontWeight: 700, color: '#D4A843',
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
                }}>
                  Life Event
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>
                  {pendingLifeEvent.title}
                </h2>
              </div>

              {/* Description */}
              <p style={{
                fontSize: 13, color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.6, textAlign: 'center', marginBottom: 20,
              }}>
                {pendingLifeEvent.description}
              </p>

              {/* Financial impact */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                padding: '14px 18px', borderRadius: 14, marginBottom: 18,
                background: pendingLifeEvent.effect.delta >= 0
                  ? 'rgba(74,222,128,0.12)'
                  : 'rgba(248,113,113,0.12)',
                border: `1px solid ${pendingLifeEvent.effect.delta >= 0 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
              }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                  {EFFECT_LABELS[pendingLifeEvent.effect.type] || 'Effect'}
                </div>
                <div style={{
                  fontSize: 22, fontWeight: 900,
                  color: pendingLifeEvent.effect.delta >= 0 ? '#4ade80' : '#f87171',
                }}>
                  {pendingLifeEvent.effect.delta >= 0 ? '+' : ''}
                  {pendingLifeEvent.effect.type === 'credit'
                    ? pendingLifeEvent.effect.delta
                    : `$${Math.abs(pendingLifeEvent.effect.delta).toLocaleString()}`}
                </div>
              </div>

              {/* Lesson */}
              <div style={{
                padding: '12px 14px', borderRadius: 12, marginBottom: 22,
                background: 'rgba(212,168,67,0.08)',
                border: '1px solid rgba(212,168,67,0.18)',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#D4A843', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  💡 Financial Tip
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>
                  {pendingLifeEvent.lesson}
                </p>
              </div>

              {/* OK button */}
              <button
                onClick={applyLifeEvent}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: '#D4A843', color: '#0D2B5E',
                  border: 'none', cursor: 'pointer',
                  fontWeight: 800, fontSize: 15,
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 20px rgba(212,168,67,0.35)',
                  transition: 'transform 0.12s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                Got it! Continue →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
