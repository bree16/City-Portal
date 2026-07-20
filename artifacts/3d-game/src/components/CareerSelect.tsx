import { useState } from 'react';
import { motion } from 'framer-motion';
import { careers } from '@/data/careers';
import type { Career } from '@/data/careers';
import { useGameStore } from '@/store/gameStore';
import { GameIcon } from '@/components/ui/GameIcon';

export function CareerSelect() {
  const { setCareer, characterAppearance } = useGameStore();
  const [selected, setSelected] = useState<Career | null>(null);
  const playerName = characterAppearance.name?.trim() || 'Player';

  const handleStart = () => {
    if (!selected) return;
    setCareer(selected.id, selected.monthlyIncome, selected.monthlyExpenses, selected.startingBonus);
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
        background: 'linear-gradient(135deg, #09070a 0%, #0A3A30 50%, #09070a 100%)',
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
          <div style={{ fontSize: 38, marginBottom: 6, display: 'flex', justifyContent: 'center' }}><GameIcon name="briefcase" size={48} /></div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>
            What's Your Career, {playerName}?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 8, fontSize: 16, maxWidth: 500, margin: '8px auto 0' }}>
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
                  borderRadius: 'var(--glass-radius-btn)',
                  border: isSelected ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.1)',
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
                <div style={{ fontSize: 32, marginBottom: 10, color: isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.8)' }}>
                  <GameIcon name={career.icon} size={40} color="currentColor" />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: isSelected ? 'var(--gold)' : '#fff', marginBottom: 4 }}>
                  {career.name}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.45, marginBottom: 12, minHeight: 40 }}>
                  {career.description}
                </div>

                {/* Income + bonus */}
                <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.8 }}>Monthly Income</span>
                    <span style={{ fontSize: 17, fontWeight: 800, color: '#4ade80' }}>
                      ${career.monthlyIncome.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.8 }}>Monthly Costs</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#f87171' }}>
                      −${career.monthlyExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.8 }}>Left to Save</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold)' }}>
                      ${(career.monthlyIncome - career.monthlyExpenses).toLocaleString()}/mo
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <GameIcon name="gift" size={12} /> {career.startingBonus.label}
                  </div>
                </div>

                {/* Flavor quote */}
                <div style={{ marginTop: 10, fontSize: 13, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  {career.flavorQuote}
                </div>

                {isSelected && (
                  <div style={{
                    marginTop: 10, width: '100%', textAlign: 'center',
                    fontSize: 14, fontWeight: 800, color: 'var(--gold)',
                    background: 'rgba(212,168,67,0.15)', borderRadius: 'var(--glass-radius-btn)', padding: '4px 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                  }}>
                    <GameIcon name="check" size={12} /> Selected
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
              borderRadius: 'var(--glass-radius-btn)',
              background: selected ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              color: selected ? '#09070a' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: selected ? 'pointer' : 'default',
              fontWeight: 800,
              fontSize: 18,
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
            style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 12 }}
          >
            Starting income: ${selected.monthlyIncome.toLocaleString()}/month · {selected.startingBonus.label}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
