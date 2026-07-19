import { useState } from 'react';
import { motion } from 'framer-motion';
import { careers } from '@/data/careers';
import type { Career } from '@/data/careers';
import { useGameStore } from '@/store/gameStore';

export function CareerSelect() {
  const { setCareer, characterAppearance } = useGameStore();
  const [selected, setSelected] = useState<Career | null>(null);
  const playerName = characterAppearance.name?.trim() || 'Player';

  const handleStart = () => {
    if (!selected) return;
    setCareer(selected.id, selected.monthlyIncome, selected.startingBonus);
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D2B5E 0%, #0A3A30 50%, #0D2B5E 100%)',
        padding: '24px 16px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 780 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 38, marginBottom: 6 }}>💼</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>
            What's Your Career, {playerName}?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 8, fontSize: 13, maxWidth: 500, margin: '8px auto 0' }}>
            Your career determines your starting income and gives you a unique advantage.
            Newport News is built on these industries — which one is yours?
          </p>
        </div>

        {/* Career grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 22 }}>
          {careers.map((career) => {
            const isSelected = selected?.id === career.id;
            return (
              <motion.button
                key={career.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(career)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  padding: '18px 16px',
                  borderRadius: 16,
                  border: isSelected ? '2px solid #D4A843' : '2px solid rgba(255,255,255,0.1)',
                  background: isSelected
                    ? 'rgba(212,168,67,0.12)'
                    : 'rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  backdropFilter: 'blur(8px)',
                  boxShadow: isSelected ? '0 0 0 3px rgba(212,168,67,0.25)' : 'none',
                  transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>{career.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: isSelected ? '#D4A843' : '#fff', marginBottom: 4 }}>
                  {career.name}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.45, marginBottom: 12, minHeight: 40 }}>
                  {career.description}
                </div>

                {/* Income + bonus */}
                <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Monthly Income</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#4ade80' }}>
                      ${career.monthlyIncome.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: '#D4A843', fontWeight: 600 }}>
                    🎁 {career.startingBonus.label}
                  </div>
                </div>

                {/* Flavor quote */}
                <div style={{ marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  {career.flavorQuote}
                </div>

                {isSelected && (
                  <div style={{
                    marginTop: 10, width: '100%', textAlign: 'center',
                    fontSize: 11, fontWeight: 800, color: '#D4A843',
                    background: 'rgba(212,168,67,0.15)', borderRadius: 8, padding: '4px 0',
                  }}>
                    ✓ Selected
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Start button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.button
            whileHover={selected ? { scale: 1.02 } : {}}
            whileTap={selected ? { scale: 0.98 } : {}}
            onClick={handleStart}
            disabled={!selected}
            style={{
              padding: '15px 48px',
              borderRadius: 14,
              background: selected ? '#D4A843' : 'rgba(255,255,255,0.1)',
              color: selected ? '#0D2B5E' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: selected ? 'pointer' : 'default',
              fontWeight: 800,
              fontSize: 16,
              fontFamily: 'Inter, sans-serif',
              boxShadow: selected ? '0 4px 24px rgba(212,168,67,0.4)' : 'none',
              transition: 'all 0.2s',
              minWidth: 260,
            }}
          >
            {selected
              ? `Start as a ${selected.name} Worker →`
              : 'Select a career above'}
          </motion.button>
        </div>

        {selected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 12 }}
          >
            Starting income: ${selected.monthlyIncome.toLocaleString()}/month · {selected.startingBonus.label}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
