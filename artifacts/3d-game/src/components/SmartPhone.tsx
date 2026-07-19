import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';

type AppId = 'budget' | 'credit' | 'housing' | 'documents' | 'achievements';

const APPS: { id: AppId; icon: string; label: string; color: string }[] = [
  { id: 'budget',       icon: '💰', label: 'Budget',   color: '#0A8F7E' },
  { id: 'credit',       icon: '📊', label: 'Credit',   color: '#0D2B5E' },
  { id: 'housing',      icon: '🏠', label: 'Homes',    color: '#8B4513' },
  { id: 'documents',    icon: '📄', label: 'Docs',     color: '#6B3FA0' },
  { id: 'achievements', icon: '🏆', label: 'Awards',   color: '#C0392B' },
];

const ACHIEVEMENT_DEFS = [
  { id: 'budget_master',   icon: '💰', label: 'Budget Master',  desc: 'Reviewed your finances' },
  { id: 'credit_champion', icon: '🌟', label: 'Credit Champ',   desc: 'Improved your credit' },
  { id: 'deal_maker',      icon: '🤝', label: 'Deal Maker',     desc: 'Negotiated your offer' },
  { id: 'first_mortgage',  icon: '📋', label: 'Pre-Approved',   desc: 'Got mortgage approval' },
  { id: 'homeowner',       icon: '🏡', label: 'Homeowner',      desc: 'Closed on your home' },
  { id: 'dream_home',      icon: '✨', label: 'Dream Home',     desc: 'Furnished your home' },
];

const DOC_LIST = [
  { id: 'paystubs', label: 'Pay Stubs',        detail: '2 most recent' },
  { id: 'bank',     label: 'Bank Statements',  detail: '2 months' },
  { id: 'w2',       label: 'W-2 Forms',        detail: '2 years' },
  { id: 'tax',      label: 'Tax Returns',       detail: '2 years' },
];

function creditTier(score: number) {
  if (score >= 740) return { label: 'Excellent', color: '#22c55e' };
  if (score >= 700) return { label: 'Very Good', color: '#4ade80' };
  if (score >= 660) return { label: 'Good',      color: '#a3e635' };
  if (score >= 620) return { label: 'Fair',      color: '#facc15' };
  return               { label: 'Poor',          color: '#f87171' };
}

/* ── Arc credit score meter ─────────────────────────────────── */
const ARC_R = 72;
const ARC_CX = 110;
const ARC_CY = 110;
const ARC_LEN = Math.PI * ARC_R; // semicircle arc length ≈ 226.2

function CreditArc({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(1, (score - 300) / 550));
  const filled = pct * ARC_LEN;
  const tier = creditTier(score);
  return (
    <svg width={220} height={130} style={{ overflow: 'visible' }}>
      {/* Track */}
      <path
        d={`M ${ARC_CX - ARC_R} ${ARC_CY} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_CX + ARC_R} ${ARC_CY}`}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* Fill */}
      <motion.path
        d={`M ${ARC_CX - ARC_R} ${ARC_CY} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_CX + ARC_R} ${ARC_CY}`}
        fill="none"
        stroke={tier.color}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={`${ARC_LEN} ${ARC_LEN}`}
        initial={{ strokeDashoffset: ARC_LEN }}
        animate={{ strokeDashoffset: ARC_LEN - filled }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      {/* Score text */}
      <text x={ARC_CX} y={ARC_CY - 10} textAnchor="middle" fill="#fff" fontSize={32} fontWeight={800} fontFamily="Inter,sans-serif">
        {score}
      </text>
      <text x={ARC_CX} y={ARC_CY + 14} textAnchor="middle" fill={tier.color} fontSize={13} fontWeight={700} fontFamily="Inter,sans-serif">
        {tier.label}
      </text>
    </svg>
  );
}

/* ── Budget App ──────────────────────────────────────────────── */
function BudgetApp() {
  const { cash, savings, debt, monthlyIncome, monthlyExpenses } = useGameStore();
  const surplus = monthlyIncome - monthlyExpenses;
  const maxBar = Math.max(monthlyIncome, monthlyExpenses) + 200;

  const Bar = ({ value, color, label }: { value: number; color: string; label: string }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color: '#fff' }}>${value.toLocaleString()}/mo</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / maxBar) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 4, background: color }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: '💰 Cash',    value: `$${cash.toLocaleString()}`,    color: '#D4A843' },
          { label: '🏦 Savings', value: `$${savings.toLocaleString()}`, color: '#0A8F7E' },
          { label: '💳 Debt',    value: `$${debt.toLocaleString()}`,    color: '#f87171' },
          { label: '📈 Surplus', value: `$${surplus.toLocaleString()}`, color: surplus >= 0 ? '#4ade80' : '#f87171' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Monthly Budget</div>
      <Bar value={monthlyIncome}   color="#0A8F7E" label="Income" />
      <Bar value={monthlyExpenses} color="#C0392B" label="Expenses" />
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 10,
        background: surplus >= 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
        border: `1px solid ${surplus >= 0 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
        fontSize: 12, color: surplus >= 0 ? '#4ade80' : '#f87171', fontWeight: 700,
      }}>
        {surplus >= 0 ? `✅ $${surplus.toLocaleString()} monthly surplus — keep saving!` : `⚠️ $${Math.abs(surplus).toLocaleString()} over budget — review expenses`}
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
        💡 <em>Tip: The 50/30/20 rule — 50% needs, 30% wants, 20% savings — keeps your finances healthy.</em>
      </div>
    </div>
  );
}

/* ── Credit App ──────────────────────────────────────────────── */
function CreditApp() {
  const { creditScore } = useGameStore();
  const TIPS = [
    { icon: '💳', text: 'Pay every bill on time — payment history is 35% of your score.' },
    { icon: '📉', text: 'Keep credit card balances under 30% of your limit.' },
    { icon: '🚫', text: "Don't apply for new credit before your mortgage — hard pulls lower scores." },
    { icon: '📅', text: 'Longer credit history = higher score. Keep old accounts open.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CreditArc score={creditScore} />
      <div style={{ width: '100%', marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Score Milestones</div>
        {[
          { score: 620, label: 'FHA Loan Minimum', met: creditScore >= 620 },
          { score: 660, label: 'Better Interest Rate', met: creditScore >= 660 },
          { score: 700, label: 'Conventional Loan', met: creditScore >= 700 },
          { score: 740, label: 'Best Rates Available', met: creditScore >= 740 },
        ].map(({ score, label, met }) => (
          <div key={score} style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
            padding: '6px 10px', borderRadius: 8,
            background: met ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
          }}>
            <span style={{ fontSize: 14 }}>{met ? '✅' : '⬜'}</span>
            <span style={{ fontSize: 12, color: met ? '#4ade80' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{score} — {label}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>How to Improve</div>
        {TIPS.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
            <span>{t.icon}</span><span>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Housing Search App ──────────────────────────────────────── */
function HousingApp() {
  const { stage, selectedHomeId, setSelectedHome, setPhoneOpen } = useGameStore();
  if (stage < 3) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
        <span style={{ fontSize: 40 }}>🔒</span>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Unlocks in Stage 3</div>
        <div style={{ fontSize: 11 }}>Visit the counselor first to start your home search.</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {homes.map((h) => {
        const selected = selectedHomeId === h.id;
        return (
          <div key={h.id} style={{
            borderRadius: 12, overflow: 'hidden',
            border: selected ? '2px solid #D4A843' : '2px solid rgba(255,255,255,0.08)',
            background: selected ? 'rgba(212,168,67,0.08)' : 'rgba(255,255,255,0.05)',
          }}>
            {/* Color swatch header */}
            <div style={{ height: 48, background: h.color, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🏠</span>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{h.name}</div>
              {selected && <span style={{ marginLeft: 'auto', fontSize: 10, background: '#D4A843', color: '#0D2B5E', padding: '2px 8px', borderRadius: 20, fontWeight: 800 }}>YOUR PICK ✓</span>}
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>${h.price.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: '#0A8F7E', fontWeight: 700 }}>${h.monthlyPayment}/mo</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
                <span>🛏 {h.beds}bd</span>
                <span>🚿 {h.baths}ba</span>
                <span>📐 {h.sqft.toLocaleString()} sqft</span>
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                <span>🚶 Walk {h.walkability}</span>
                <span>🏫 Schools {h.schools}</span>
                <span>🚗 {h.commute}min</span>
              </div>
              <button
                onClick={() => { setSelectedHome(h.id); setPhoneOpen(false); }}
                style={{
                  width: '100%', padding: '8px', borderRadius: 8,
                  background: selected ? '#D4A843' : '#0D2B5E',
                  color: selected ? '#0D2B5E' : '#fff',
                  border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {selected ? '✓ Selected — Go Negotiate' : 'Select This Home'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Documents App ───────────────────────────────────────────── */
function DocumentsApp() {
  const { stage, completedInteractions } = useGameStore();
  const stageGate = stage >= 5;
  return (
    <div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 14, lineHeight: 1.5 }}>
        {stageGate
          ? "Documents you've submitted to the bank for your mortgage application."
          : "You'll gather these documents at the bank in Stage 5."}
      </div>
      {DOC_LIST.map(({ id, label, detail }) => {
        const done = stageGate && completedInteractions.includes(id);
        return (
          <div key={id} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            borderRadius: 10, marginBottom: 8,
            background: done ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${done ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
          }}>
            <span style={{ fontSize: 22 }}>{done ? '✅' : '📄'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: done ? '#4ade80' : '#fff' }}>{label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{detail}</div>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', fontSize: 11, color: 'rgba(212,168,67,0.9)', lineHeight: 1.5 }}>
        💡 Gather these docs early — missing documents are the #1 cause of mortgage delays.
      </div>
    </div>
  );
}

/* ── Achievements App ────────────────────────────────────────── */
function AchievementsApp() {
  const { achievements } = useGameStore();
  return (
    <div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
        {achievements.length} of {ACHIEVEMENT_DEFS.length} earned
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {ACHIEVEMENT_DEFS.map(({ id, icon, label, desc }) => {
          const earned = achievements.includes(id);
          return (
            <div key={id} style={{
              padding: '12px 10px', borderRadius: 12, textAlign: 'center',
              background: earned ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${earned ? 'rgba(212,168,67,0.5)' : 'rgba(255,255,255,0.08)'}`,
              filter: earned ? 'none' : 'grayscale(1) opacity(0.4)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{earned ? icon : '🔒'}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: earned ? '#D4A843' : 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.3 }}>{desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Phone Shell ─────────────────────────────────────────────── */
const APP_COMPONENTS: Record<AppId, React.ComponentType> = {
  budget:       BudgetApp,
  credit:       CreditApp,
  housing:      HousingApp,
  documents:    DocumentsApp,
  achievements: AchievementsApp,
};

const APP_LABELS: Record<AppId, string> = {
  budget: '💰 Budget',
  credit: '📊 Credit Score',
  housing: '🏠 Home Search',
  documents: '📄 Documents',
  achievements: '🏆 Achievements',
};

export function SmartPhone() {
  const { phoneOpen, setPhoneOpen } = useGameStore();
  const [activeApp, setActiveApp] = useState<AppId | null>(null);

  const AppScreen = activeApp ? APP_COMPONENTS[activeApp] : null;

  return (
    <AnimatePresence>
      {phoneOpen && (
        <>
          {/* Backdrop — click outside to close */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setPhoneOpen(false); setActiveApp(null); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Phone frame */}
          <motion.div
            key="phone"
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 51,
              width: 360,
              maxHeight: '88dvh',
              borderRadius: 44,
              background: '#0e0e16',
              boxShadow: '0 0 0 2px #2a2a3a, 0 32px 80px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* Notch + status bar */}
            <div style={{ background: '#0e0e16', padding: '14px 20px 0', position: 'relative', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                <span>9:41</span>
                <div style={{ width: 100, height: 22, borderRadius: 11, background: '#1a1a2e', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 10 }} />
                <span>●●● 📶 🔋</span>
              </div>
            </div>

            {/* App header bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 18px 8px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0,
            }}>
              {activeApp ? (
                <>
                  <button
                    onClick={() => setActiveApp(null)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                  >
                    ← Home
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{APP_LABELS[activeApp]}</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 18 }}>📱</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', flex: 1 }}>My Phone</span>
                </>
              )}
              <button
                onClick={() => { setPhoneOpen(false); setActiveApp(null); }}
                style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.6)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 24px' }}>
              <AnimatePresence mode="wait">
                {AppScreen ? (
                  <motion.div key={activeApp} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                    <AppScreen />
                  </motion.div>
                ) : (
                  <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                      {APPS.map(({ id, icon, label, color }) => (
                        <button
                          key={id}
                          onClick={() => setActiveApp(id)}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                            padding: '14px 8px', borderRadius: 18,
                            background: color,
                            border: 'none', cursor: 'pointer',
                            boxShadow: `0 4px 16px ${color}55`,
                            transition: 'transform 0.12s',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.07)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                        >
                          <span style={{ fontSize: 28 }}>{icon}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif' }}>{label}</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                      💡 Your phone tracks your entire homebuying journey. Check it anytime for tips and progress.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Home indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 14px', flexShrink: 0 }}>
              <div style={{ width: 100, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
