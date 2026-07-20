import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';

const EFFECT_LABELS: Record<string, { label: string; icon: GameIconName }> = {
  cash: { label: 'Cash', icon: 'budget' },
  savings: { label: 'Savings', icon: 'bank' },
  income: { label: 'Monthly Income', icon: 'trend-up' },
  expenses: { label: 'Monthly Expenses', icon: 'trend-down' },
  credit: { label: 'Credit Score', icon: 'chart' },
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
            <div className="glass-panel-strong glass-sheen" style={{
              padding: '28px 24px',
            }}>
              {/* Icon + title */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center', color: 'var(--gold)' }}>
                  <GameIcon name={pendingLifeEvent.icon} size={64} color="currentColor" />
                </div>
                <div className="glass-chip" style={{
                  display: 'inline-block',
                  padding: '3px 12px',
                  border: 'var(--glass-border-gold)',
                  fontSize: 13, fontWeight: 700, color: 'var(--gold)',
                  letterSpacing: 1, marginBottom: 10,
                }}>
                  Life Event
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--glass-text)', margin: 0 }}>
                  {pendingLifeEvent.title}
                </h2>
              </div>

              {/* Description */}
              <p style={{
                fontSize: 16, color: 'var(--glass-text-dim)',
                lineHeight: 1.6, textAlign: 'center', marginBottom: 20,
              }}>
                {pendingLifeEvent.description}
              </p>

              {/* Financial impact */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                padding: '14px 18px', borderRadius: 0, marginBottom: 18,
                background: pendingLifeEvent.effect.delta >= 0
                  ? 'rgba(74,222,128,0.12)'
                  : 'rgba(248,113,113,0.12)',
                border: `1px solid ${pendingLifeEvent.effect.delta >= 0 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
              }}>
                <div style={{ fontSize: 14, color: 'var(--glass-text-dim)', fontWeight: 600, letterSpacing: 0.6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <GameIcon name={EFFECT_LABELS[pendingLifeEvent.effect.type]?.icon || 'warning'} size={14} />
                  {EFFECT_LABELS[pendingLifeEvent.effect.type]?.label || 'Effect'}
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
                padding: '12px 14px', borderRadius: 0, marginBottom: 22,
                background: 'rgba(212,168,67,0.1)',
                border: 'var(--glass-border-gold)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginBottom: 4, letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <GameIcon name="lightbulb" size={12} /> Financial Tip
                </div>
                <p style={{ fontSize: 15, color: 'var(--glass-text-dim)', lineHeight: 1.5, margin: 0 }}>
                  {pendingLifeEvent.lesson}
                </p>
              </div>

              {/* OK button */}
              <button
                onClick={applyLifeEvent}
                className="glass-btn-primary"
                style={{
                  width: '100%', padding: '14px', fontSize: 18,
                }}
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
