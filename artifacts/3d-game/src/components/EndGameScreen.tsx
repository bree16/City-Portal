import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { GameIcon } from '@/components/ui/GameIcon';

const CAREER_LESSONS: Record<string, string> = {
  teacher:      "As an educator, you proved that patience and steady income beat chasing quick wins. Your home became your greatest classroom.",
  nurse:        "Caring for others every shift, you also cared for your financial future. Your mortgage payments never missed a beat.",
  shipbuilder:  "You built something to last — just like Newport News has for centuries. Your home is your masterwork.",
  government:   "Steady public service, steady homeownership. You showed that discipline and good benefits are a powerful combination.",
  retail:       "Budget-conscious from day one, you turned every dollar into equity. That's a skill no interest rate can take away.",
  entrepreneur: "You took the biggest risks and built equity at the same time. Newport News welcomes its newest owner-operator.",
};

function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(() =>
    Array.from({ length: 90 }, (_, i) => ({
      id: i,
      color: ['#D4AF37','#14B8A6','#F87171','#60A5FA','#A78BFA','#34D399','#FBBF24','#F472B6','#FB923C'][i % 9],
      left: 2 + (i / 90) * 96,
      delay: (i * 0.05) % 2.8,
      duration: 2.2 + (i % 6) * 0.4,
      size: 5 + (i % 5) * 3,
      isRect: i % 3 !== 0,
    })), []);
  if (!active) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1005, overflow: 'hidden' }}>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: 'absolute', top: -18, left: `${p.left}%`,
          width: p.size, height: p.isRect ? Math.round(p.size * 0.4) : p.size,
          background: p.color, borderRadius: p.isRect ? 2 : '50%',
          animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in both`,
        }} />
      ))}
    </div>
  );
}

const INITIAL_CREDIT = 635;

export function EndGameScreen() {
  const {
    showEndGame, homeSold, saleProceeds, homeValue, mortgageBalance,
    totalInterestPaid, creditScore, homeLifeMonths, careerId,
    devMode, resetGame, setDevCash, setDevMode,
  } = useGameStore();

  const [confettiActive, setConfettiActive] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [devCashInput, setDevCashInput] = useState('');

  useEffect(() => {
    if (!showEndGame) { setConfettiActive(false); return; }
    setConfettiActive(true);
    const t = setTimeout(() => setConfettiActive(false), 4500);
    return () => clearTimeout(t);
  }, [showEndGame]);

  const equityBuilt = Math.max(0, homeValue - mortgageBalance);
  const netWorth    = homeSold ? Math.max(saleProceeds, 0) : equityBuilt;
  const creditDelta = creditScore - INITIAL_CREDIT;
  const lesson      = CAREER_LESSONS[careerId ?? ''] ?? "You navigated one of life's biggest financial decisions and came out stronger for it.";

  const handleShare = () => {
    const text =
      `🏡 I just finished Path to Your First Home!\n` +
      `${homeSold
        ? `💰 Sold for ${saleProceeds >= 0 ? '+' : ''}$${saleProceeds.toLocaleString()}`
        : `🏠 Equity built: $${equityBuilt.toLocaleString()}`}\n` +
      `📈 Credit: ${INITIAL_CREDIT} → ${creditScore} (${creditDelta >= 0 ? '+' : ''}${creditDelta} pts)\n` +
      `📅 ${homeLifeMonths} months as a homeowner\n` +
      `Learn your path → newportnewshousinghub.com/simulator`;
    navigator.clipboard?.writeText(text).catch(() => {});
    alert('Results copied to clipboard! Share it anywhere. 🎉');
  };

  const handleDevCash = () => {
    const amt = parseFloat(devCashInput);
    if (!isNaN(amt) && amt >= 0) {
      setDevCash(amt);
      setDevCashInput('');
    }
  };

  if (!showEndGame) return null;

  return (
    <>
      <Confetti active={confettiActive} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'radial-gradient(ellipse at 50% 0%, #1a0e3a 0%, #0d1a2e 45%, #110e15 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '20px', overflowY: 'auto', fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Starfield */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 60 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 2 + (i % 3), height: 2 + (i % 3),
              borderRadius: '50%', background: '#fff',
              opacity: 0.12 + (i % 5) * 0.04,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 13) % 100}%`,
            }} />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.85, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.25 }}
          style={{ maxWidth: 580, width: '100%', position: 'relative', zIndex: 1 }}
        >
          {/* Gold header bar */}
          <div style={{
            background: 'linear-gradient(135deg,#D4AF37,#F5C842)',
            padding: '12px 28px', borderRadius: '12px 12px 0 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <GameIcon name="celebration" size={22} color="#0F172A" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#0F172A', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Journey Complete
            </span>
            <GameIcon name="celebration" size={22} color="#0F172A" />
          </div>

          <div className="glass-panel-strong" style={{ borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '28px 32px 32px' }}>
            {/* Headline */}
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>
                {homeSold ? '🏡 You Sold Your Home!' : '🏠 Your Homeowner Journey'}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
                {homeSold
                  ? `After ${homeLifeMonths} month${homeLifeMonths !== 1 ? 's' : ''} as a Newport News homeowner, you cashed out.`
                  : `You spent ${homeLifeMonths} month${homeLifeMonths !== 1 ? 's' : ''} building equity in Newport News.`}
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              <StatTile
                icon="bank"
                label={homeSold ? 'Sale Proceeds' : 'Equity Built'}
                value={`${netWorth >= 0 ? '+' : ''}$${netWorth.toLocaleString()}`}
                color={netWorth >= 0 ? '#4ade80' : '#f87171'}
              />
              <StatTile
                icon="calendar"
                label="Months as Owner"
                value={`${homeLifeMonths} mo`}
                color="#D4AF37"
              />
              <StatTile
                icon="chart"
                label="Credit Score"
                value={`${INITIAL_CREDIT} → ${creditScore}`}
                sub={`${creditDelta >= 0 ? '+' : ''}${creditDelta} pts`}
                color={creditDelta >= 0 ? '#4ade80' : '#f87171'}
              />
              <StatTile
                icon="wallet"
                label="Total Interest Paid"
                value={`$${totalInterestPaid.toLocaleString()}`}
                color="#fbbf24"
              />
            </div>

            {/* Lesson */}
            <div style={{
              background: 'rgba(212,175,55,0.07)',
              border: '1px solid rgba(212,175,55,0.22)',
              borderRadius: 10, padding: '14px 18px', marginBottom: 22,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#D4AF37', letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>
                What Your Journey Taught You
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, margin: 0 }}>
                {lesson}
              </p>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={resetGame}
                  className="glass-btn"
                  style={{ padding: '12px', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <GameIcon name="replay" size={15} /> Play Again
                </button>
                <button
                  onClick={handleShare}
                  className="glass-btn-primary"
                  style={{ padding: '12px', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <GameIcon name="camera" size={15} /> Copy & Share
                </button>
              </div>
              <a
                href="/"
                className="glass-btn"
                style={{
                  padding: '11px', fontWeight: 700, fontSize: 12,
                  textDecoration: 'none', textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'inherit',
                }}
              >
                <GameIcon name="neighborhood" size={14} /> Return to Housing Hub
              </a>
            </div>
          </div>
        </motion.div>

        {/* Dev panel button */}
        {devMode && (
          <button
            onClick={() => setShowDevPanel((v) => !v)}
            style={{
              position: 'fixed', bottom: 16, left: 16, zIndex: 1010,
              background: 'rgba(20,184,166,0.18)', border: '1px solid rgba(20,184,166,0.4)',
              borderRadius: 8, padding: '7px 12px', cursor: 'pointer',
              color: '#14B8A6', fontWeight: 700, fontSize: 12, fontFamily: 'Inter,sans-serif',
              backdropFilter: 'blur(8px)',
            }}
          >
            ⚙️ Dev
          </button>
        )}

        <AnimatePresence>
          {showDevPanel && devMode && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{
                position: 'fixed', bottom: 56, left: 16, zIndex: 1010,
                background: 'rgba(17,14,21,0.95)', border: '1px solid rgba(20,184,166,0.28)',
                borderRadius: 12, padding: '16px', width: 230,
                fontFamily: 'Inter,sans-serif', backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: '#14B8A6', marginBottom: 10, letterSpacing: '0.08em' }}>🛠 DEV PANEL</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>Set Cash $</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <input
                  type="number"
                  value={devCashInput}
                  onChange={(e) => setDevCashInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDevCash()}
                  placeholder="e.g. 50000"
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 6, padding: '6px 8px', color: '#fff', fontSize: 12,
                    fontFamily: 'Inter,sans-serif', outline: 'none',
                  }}
                />
                <button
                  onClick={handleDevCash}
                  style={{
                    background: '#14B8A6', border: 'none', borderRadius: 6,
                    padding: '6px 10px', color: '#000', fontWeight: 700, fontSize: 11,
                    cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                  }}
                >Set</button>
              </div>
              <button
                onClick={resetGame}
                style={{
                  width: '100%', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.28)',
                  borderRadius: 6, padding: '8px', color: '#D4AF37', fontWeight: 700, fontSize: 11,
                  cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                }}
              >
                🔄 Force New Game
              </button>
              <button
                onClick={() => setDevMode(false)}
                style={{
                  width: '100%', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                  borderRadius: 6, padding: '8px', color: '#f87171', fontWeight: 700, fontSize: 11,
                  cursor: 'pointer', fontFamily: 'Inter,sans-serif', marginTop: 6,
                }}
              >
                🚫 Disable Dev Mode
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function StatTile({ icon, label, value, sub, color }: {
  icon: Parameters<typeof GameIcon>[0]['name'];
  label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10, padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
        <GameIcon name={icon} size={14} color="rgba(255,255,255,0.5)" />
        <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontSize: 19, fontWeight: 900, color }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 2, opacity: 0.85 }}>{sub}</div>}
    </div>
  );
}
