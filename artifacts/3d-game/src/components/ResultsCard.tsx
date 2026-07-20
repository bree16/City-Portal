import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';
import { motion, AnimatePresence } from 'framer-motion';

const ACHIEVEMENT_META: Record<string, { label: string; icon: string }> = {
  budget_master:   { label: 'Budget Master',     icon: '💰' },
  first_mortgage:  { label: 'Mortgage Ready',    icon: '📋' },
  house_hunter:    { label: 'House Hunter',       icon: '🔍' },
  credit_champion: { label: 'Credit Champion',   icon: '⭐' },
  deal_maker:      { label: 'Deal Maker',        icon: '🤝' },
  homeowner:       { label: 'New Homeowner',     icon: '🔑' },
  dream_home:      { label: 'Dream Home Builder', icon: '🏡' },
};

const INITIAL_CREDIT = 635;

interface ResultsCardProps {
  visible: boolean;
  onPlayAgain: () => void;
}

function MiniCharacter({ skinTone, hairColor, shirtColor, pantsColor }: {
  skinTone: string; hairColor: string; shirtColor: string; pantsColor: string;
}) {
  return (
    <svg width="72" height="100" viewBox="0 0 72 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair back */}
      <ellipse cx="36" cy="22" rx="16" ry="18" fill={hairColor} />
      {/* Head */}
      <ellipse cx="36" cy="24" rx="14" ry="15" fill={skinTone} />
      {/* Hair top */}
      <ellipse cx="36" cy="11" rx="13" ry="8" fill={hairColor} />
      {/* Eyes */}
      <circle cx="31" cy="23" r="2" fill="#1a1a2e" />
      <circle cx="41" cy="23" r="2" fill="#1a1a2e" />
      <circle cx="31.8" cy="22.3" r="0.7" fill="white" />
      <circle cx="41.8" cy="22.3" r="0.7" fill="white" />
      {/* Smile */}
      <path d="M31 30 Q36 34 41 30" stroke="#c47a5a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Neck */}
      <rect x="32" y="38" width="8" height="6" rx="2" fill={skinTone} />
      {/* Shirt */}
      <path d="M20 44 Q20 42 28 40 L36 43 L44 40 Q52 42 52 44 L54 70 Q54 72 52 72 L20 72 Q18 72 18 70 Z" fill={shirtColor} />
      {/* Collar */}
      <path d="M28 40 L36 47 L44 40" stroke="white" strokeWidth="1.5" fill="none" />
      {/* Arms */}
      <path d="M20 44 L14 62 Q13 65 15 66 L18 55 L20 55 Z" fill={shirtColor} />
      <path d="M52 44 L58 62 Q59 65 57 66 L54 55 L52 55 Z" fill={shirtColor} />
      {/* Hands */}
      <circle cx="15" cy="66" r="4" fill={skinTone} />
      <circle cx="57" cy="66" r="4" fill={skinTone} />
      {/* Pants */}
      <path d="M18 70 L18 72 L28 72 L30 95 L36 95 L36 72 L36 72 L36 95 L42 95 L44 72 L54 72 L54 70 Z" fill={pantsColor} />
      {/* Shoes */}
      <ellipse cx="30" cy="96" rx="6" ry="3" fill="#2a2a2a" />
      <ellipse cx="42" cy="96" rx="6" ry="3" fill="#2a2a2a" />
    </svg>
  );
}

export function ResultsCard({ visible, onPlayAgain }: ResultsCardProps) {
  const { month, creditScore, savings, selectedHomeId, achievements, furnitureOwned, characterAppearance, resetGame } = useGameStore();
  const home = homes.find((h) => h.id === selectedHomeId) ?? homes[0];
  const creditGain = creditScore - INITIAL_CREDIT;
  const earnedAchievements = achievements.filter((a) => ACHIEVEMENT_META[a]);

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(17, 14, 21, 0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            className="glass-panel-strong glass-sheen"
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
            style={{
              maxWidth: 540,
              width: '100%',
              overflow: 'hidden',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* Header band */}
            <div style={{
              background: 'var(--gold-grad)',
              padding: '10px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Newport News Housing Hub
              </span>
              <span style={{ fontSize: 11, color: 'var(--ink)', fontWeight: 700 }}>
                Path to Your First Home
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px 28px' }}>
              {/* Title + character row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
                {/* Character */}
                <div style={{
                  flexShrink: 0,
                  background: 'rgba(255,234,0,0.1)',
                  borderRadius: 0,
                  padding: '12px 10px 6px',
                  border: 'var(--glass-border-gold)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <MiniCharacter {...characterAppearance} />
                  <span style={{ fontSize: 10, color: 'var(--glass-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>Your Player</span>
                </div>

                {/* Title block */}
                <div style={{ flex: 1, paddingTop: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                    🎉 Journey Complete!
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--glass-text)', lineHeight: 1.2, marginBottom: 8 }}>
                    You're a Newport News Homeowner!
                  </div>
                  <div style={{
                    background: 'rgba(0,240,255,0.14)', borderRadius: 0, padding: '8px 12px',
                    border: '1px solid rgba(20,184,161,0.3)',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>{home.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--glass-text-dim)', marginTop: 2 }}>
                      {home.neighborhood} · ${home.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                <StatBox icon="🗓️" label="Months to Close" value={`${month} months`} />
                <StatBox
                  icon="📈"
                  label="Credit Score Journey"
                  value={`${INITIAL_CREDIT} → ${creditScore}`}
                  subValue={creditGain >= 0 ? `+${creditGain} pts` : `${creditGain} pts`}
                  valueColor={creditGain >= 0 ? '#4ade80' : '#f87171'}
                />
                <StatBox icon="🏦" label="Total Savings Built" value={`$${savings.toLocaleString()}`} />
                <StatBox icon="🛋️" label="Furniture Purchased" value={`${furnitureOwned.length} items`} />
              </div>

              {/* Achievements */}
              {earnedAchievements.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--glass-text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Achievements Earned
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {earnedAchievements.map((id) => {
                      const meta = ACHIEVEMENT_META[id];
                      return (
                        <div key={id} className="glass-chip" style={{
                          border: 'var(--glass-border-gold)',
                          padding: '5px 12px',
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                          <span style={{ fontSize: 14 }}>{meta.icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)' }}>{meta.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Screenshot tip */}
              <div style={{
                background: 'rgba(20,184,161,0.12)', borderRadius: 0, padding: '8px 14px',
                border: '1px solid rgba(20,184,161,0.25)', marginBottom: 18,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>📸</span>
                <span style={{ fontSize: 11, color: 'var(--glass-text-dim)', lineHeight: 1.4 }}>
                  Take a screenshot to share your homebuying journey!
                </span>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handlePlayAgain}
                  className="glass-btn"
                  style={{
                    flex: 1, padding: '12px 16px', fontWeight: 700, fontSize: 13,
                  }}
                >
                  🔄 Play Again
                </button>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-btn-primary"
                  style={{
                    flex: 1.4, padding: '12px 16px', fontSize: 13,
                    textDecoration: 'none', textAlign: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  🏠 Visit Newport News Housing Hub
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatBox({ icon, label, value, subValue, valueColor }: {
  icon: string; label: string; value: string; subValue?: string; valueColor?: string;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 0, padding: '12px 14px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--glass-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: valueColor ?? 'var(--glass-text)' }}>{value}</div>
      {subValue && <div style={{ fontSize: 11, color: valueColor ?? 'var(--glass-text-dim)', fontWeight: 600, marginTop: 2 }}>{subValue}</div>}
    </div>
  );
}
