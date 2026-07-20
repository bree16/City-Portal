import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';
import { GameIcon } from '@/components/ui/GameIcon';

// ── Confetti (reuse pattern from ResultsCard) ────────────────────
function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(() =>
    Array.from({ length: 88 }, (_, i) => ({
      id: i,
      color: ['#D4AF37','#14B8A6','#F87171','#60A5FA','#A78BFA','#34D399','#FBBF24','#F472B6'][i % 8],
      left: 2 + (i / 88) * 96,
      delay: (i * 0.055) % 2.8,
      duration: 2.1 + (i % 5) * 0.4,
      size: 5 + (i % 4) * 3,
      isRect: i % 3 !== 0,
    })), []);
  if (!active) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1001, overflow: 'hidden' }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: 'absolute', top: -18, left: `${p.left}%`,
          width: p.size, height: p.isRect ? Math.round(p.size * 0.45) : p.size,
          background: p.color, borderRadius: p.isRect ? 2 : '50%',
          animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in both`,
        }} />
      ))}
    </div>
  );
}

// ── Stat row ──────────────────────────────────────────────────────
function StatRow({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: color ?? 'var(--glass-text)' }}>{value}</span>
        {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Career summary paragraphs ──────────────────────────────────────
const CAREER_LESSONS: Record<string, string> = {
  teacher: "Your dedication to education extended beyond the classroom — you learned that building wealth takes the same patience as teaching: consistent effort, compound interest, and a long-term plan.",
  nurse: "Healthcare taught you that prevention beats cure. The same held true for your finances: maintaining good credit and saving a little every month prevented big financial emergencies.",
  military: "Military discipline gave you a superpower: the ability to follow a budget like a mission. Your financial orders were clear — save, reduce debt, build equity — and you executed.",
  shipbuilder: "You know how a single fastener can make or break a hull. Your homebuying journey showed that every loan payment, every credit improvement, holds the whole financial structure together.",
  government: "Government service taught you that systems work when everyone plays by the rules. You played by the financial rules — steady income, consistent savings, on-time payments — and the system rewarded you.",
  entrepreneur: "Every entrepreneur knows that calculated risk leads to reward. You bet on yourself, managed cash flow under pressure, and turned a mortgage into your most valuable asset.",
  default: "Your journey from renter to homeowner is proof that financial success isn't about luck — it's about learning, planning, and taking one step at a time toward your goal.",
};

function getLesson(careerId: string | null, homeSold: boolean): string {
  const base = CAREER_LESSONS[careerId ?? 'default'] ?? CAREER_LESSONS.default;
  if (homeSold) {
    return base + " And when the time was right, you capitalized on your investment — turning bricks and mortar into financial freedom.";
  }
  return base;
}

// ── Main component ────────────────────────────────────────────────
export function EndGameScreen() {
  const {
    showEndGame, homeSold, homeValue, mortgageBalance, homeLifeMonths,
    creditScore, startCreditScore, totalInterestPaid, savings, cash,
    careerId, selectedHomeId, characterAppearance, improvementsOwned,
    finalSalePrice, finalSaleProceeds, mortgagePayoffAtSale,
    resetGame, setShowEndGame, devMode,
  } = useGameStore();

  const [confetti, setConfetti] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [devCashInput, setDevCashInput] = useState('');
  const { setDevCash, wrapUpJourney, setStage } = useGameStore();

  const home = homes.find((h) => h.id === selectedHomeId) ?? homes[0];

  useEffect(() => {
    if (!showEndGame) { setConfetti(false); return; }
    setConfetti(true);
    const t = setTimeout(() => setConfetti(false), 4200);
    return () => clearTimeout(t);
  }, [showEndGame]);

  // When sold: use persisted finalSaleProceeds (computed once in completeSale from pre-sale balance).
  // When not sold: equity is still in the home (unrealised).
  const equity = homeSold ? 0 : Math.max(0, homeValue - mortgageBalance);
  const creditDelta = creditScore - (startCreditScore ?? 635);
  // Net worth: cash + savings + unrealised equity (if still owned). Post-sale proceeds already in cash.
  const netWorth = savings + cash + equity;
  // Sale display values come from the persisted snapshot, not a recomputation.
  const saleProceeds = homeSold ? finalSaleProceeds : 0;
  const agentFee = homeSold ? Math.round(finalSalePrice * 0.05) : 0;
  const closingCosts = homeSold ? Math.round(finalSalePrice * 0.02) : 0;
  const yearsOwned = Math.floor(homeLifeMonths / 12);
  const monthsRemainder = homeLifeMonths % 12;

  const lesson = getLesson(careerId, homeSold);

  const handlePlayAgain = () => {
    resetGame();
    setShowEndGame(false);
  };

  const handleShare = () => {
    const text = [
      `🏠 I just completed my Newport News homeownership journey!`,
      ``,
      `🏡 Home: ${home.name}`,
      homeSold
        ? `💰 Sale Proceeds: $${saleProceeds.toLocaleString()}`
        : `📈 Home Equity: $${equity.toLocaleString()}`,
      `📊 Credit Score: ${startCreditScore ?? 635} → ${creditScore} (${creditDelta >= 0 ? '+' : ''}${creditDelta} pts)`,
      `📅 Years as Homeowner: ${yearsOwned}y ${monthsRemainder}mo`,
      `💵 Net Worth: $${netWorth.toLocaleString()}`,
      ``,
      `Play at Newport News Housing Hub!`,
    ].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
  };

  // Dev panel helpers
  const devStages = [
    { n: 8, label: 'Home Life', careerId: 'teacher', cash: 5000, savings: 2000, homeId: 1 },
  ] as const;

  return (
    <>
      <Confetti active={confetti} />
      <AnimatePresence>
        {showEndGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1200,
              background: 'rgba(9,7,10,0.96)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px', overflowY: 'auto',
              backdropFilter: 'blur(10px)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <motion.div
              className="glass-panel-strong glass-sheen"
              initial={{ scale: 0.88, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24, delay: 0.1 }}
              style={{ maxWidth: 580, width: '100%', overflow: 'hidden' }}
            >
              {/* ── Gold header ── */}
              <div style={{
                background: 'var(--gold-grad)', padding: '14px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.5)', letterSpacing: 2, textTransform: 'uppercase' }}>
                    Newport News Housing Hub
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink)' }}>
                    {homeSold ? '🎉 Home Sold!' : '🏡 Journey Complete!'}
                  </div>
                </div>
                <div style={{ fontSize: 40 }}>{homeSold ? '🏆' : '🌟'}</div>
              </div>

              <div style={{ padding: '22px 26px 28px' }}>
                {/* ── Player name + home ── */}
                <div style={{ marginBottom: 18, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--glass-text)', marginBottom: 4 }}>
                    {characterAppearance.name || 'Player'}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 700 }}>
                    {home.name} · {home.neighborhood}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {yearsOwned > 0 ? `${yearsOwned} year${yearsOwned !== 1 ? 's' : ''}` : ''}{monthsRemainder > 0 ? ` ${monthsRemainder} month${monthsRemainder !== 1 ? 's' : ''}` : ''} as a homeowner
                  </div>
                </div>

                {/* ── Hero stat: proceeds or equity ── */}
                <div style={{
                  background: homeSold ? 'rgba(74,222,128,0.12)' : 'rgba(212,175,55,0.1)',
                  border: `1px solid ${homeSold ? 'rgba(74,222,128,0.35)' : 'rgba(212,175,55,0.35)'}`,
                  borderRadius: 'var(--glass-radius)', padding: '16px 20px',
                  textAlign: 'center', marginBottom: 18,
                }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: 1, marginBottom: 4 }}>
                    {homeSold ? 'NET SALE PROCEEDS' : 'HOME EQUITY BUILT'}
                  </div>
                  <div style={{ fontSize: 42, fontWeight: 900, color: homeSold ? '#4ade80' : '#D4AF37', lineHeight: 1 }}>
                    ${(homeSold ? saleProceeds : equity).toLocaleString()}
                  </div>
                  {homeSold && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                      After agent fees, closing costs &amp; mortgage payoff
                    </div>
                  )}
                  {!homeSold && mortgageBalance > 0 && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                      Unrealised · Home still owned · ${mortgageBalance.toLocaleString()} remaining
                    </div>
                  )}
                </div>

                {/* ── Stats grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                  {/* Left column */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--glass-radius)', padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 8 }}>FINANCIAL JOURNEY</div>
                    <StatRow label="Credit Score" value={`${startCreditScore ?? 635} → ${creditScore}`} color={creditDelta >= 0 ? '#4ade80' : '#f87171'} sub={`${creditDelta >= 0 ? '+' : ''}${creditDelta} pts`} />
                    <StatRow label="Interest Paid" value={`$${(totalInterestPaid ?? 0).toLocaleString()}`} color="#f87171" />
                    <StatRow label="Cash Savings" value={`$${savings.toLocaleString()}`} color="#D4AF37" />
                    <StatRow label="Net Worth" value={`$${netWorth.toLocaleString()}`} color="#60A5FA" />
                  </div>
                  {/* Right column */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--glass-radius)', padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 8 }}>HOME DETAILS</div>
                    <StatRow label="Purchase Price" value={`${home.price.toLocaleString()}`} />
                    {homeSold ? (
                      <>
                        <StatRow label="Sold For" value={`${finalSalePrice.toLocaleString()}`} color="#4ade80" />
                        <StatRow label="Agent + Closing" value={`${(agentFee + closingCosts).toLocaleString()}`} color="#f87171" />
                        <StatRow label="Mortgage Payoff" value={`${mortgagePayoffAtSale.toLocaleString()}`} color="#f87171" />
                      </>
                    ) : (
                      <>
                        <StatRow label="Current Value" value={`${homeValue.toLocaleString()}`} color="#4ade80" />
                        <StatRow label="Remaining Mortgage" value={`${mortgageBalance.toLocaleString()}`} color="#f87171" />
                        <StatRow label="Equity" value={`${equity.toLocaleString()}`} color="#D4AF37" />
                      </>
                    )}
                    <StatRow label="Improvements" value={improvementsOwned.length > 0 ? `${improvementsOwned.length} project${improvementsOwned.length !== 1 ? 's' : ''}` : 'None'} />
                  </div>
                </div>

                {/* ── What you learned ── */}
                <div style={{
                  background: 'rgba(10,143,126,0.1)', border: '1px solid rgba(10,143,126,0.3)',
                  borderRadius: 'var(--glass-radius)', padding: '14px 16px', marginBottom: 20,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <GameIcon name="lightbulb" size={16} color="#14B8A6" />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#14B8A6', letterSpacing: 1, textTransform: 'uppercase' }}>What Your Journey Taught You</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
                    {lesson}
                  </p>
                </div>

                {/* ── CTAs ── */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={handlePlayAgain}
                    className="glass-btn"
                    style={{ flex: 1, padding: '12px 0', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <GameIcon name="replay" size={16} /> Play Again
                  </button>
                  <button
                    onClick={handleShare}
                    className="glass-btn-primary"
                    style={{ flex: 1, padding: '12px 0', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <GameIcon name="sparkles" size={16} /> Share Results
                  </button>
                </div>
                <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
                  Share copies a summary to your clipboard
                </div>
              </div>
            </motion.div>

            {/* ── In-game Dev Panel (floating ⚙️) ── */}
            {devMode && (
              <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1300 }}>
                <button
                  onClick={() => setDevOpen((o) => !o)}
                  style={{
                    background: 'rgba(255,100,0,0.85)', border: '1px solid rgba(255,100,0,0.5)',
                    color: '#fff', borderRadius: 'var(--glass-radius)', width: 38, height: 38,
                    cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                  }}
                  title="Dev Tools"
                >⚙️</button>
                <AnimatePresence>
                  {devOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', bottom: 44, left: 0,
                        background: 'rgba(9,7,10,0.97)', border: '1px solid rgba(255,100,0,0.4)',
                        borderRadius: 'var(--glass-radius)', padding: '14px 16px', minWidth: 220,
                        fontFamily: 'Inter, sans-serif', color: '#fff',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,100,0,0.9)', letterSpacing: 1, marginBottom: 10 }}>🛠 DEV TOOLS</div>
                      {/* Stats readout */}
                      {[
                        { label: 'Stage', value: `8 (End Game)` },
                        { label: 'Cash', value: `$${cash.toLocaleString()}` },
                        { label: 'Savings', value: `$${savings.toLocaleString()}` },
                        { label: 'Equity', value: `$${equity.toLocaleString()}` },
                      ].map((r) => (
                        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ color: 'rgba(255,255,255,0.45)' }}>{r.label}</span>
                          <span style={{ fontWeight: 700, color: '#D4AF37' }}>{r.value}</span>
                        </div>
                      ))}
                      {/* Set cash */}
                      <div style={{ marginTop: 10, marginBottom: 6 }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>SET CASH $</div>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <input
                            type="number"
                            value={devCashInput}
                            onChange={(e) => setDevCashInput(e.target.value)}
                            placeholder="Amount"
                            style={{
                              flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                              color: '#fff', borderRadius: 4, padding: '4px 8px', fontSize: 12,
                              fontFamily: 'Inter, sans-serif',
                            }}
                          />
                          <button
                            onClick={() => { const v = parseInt(devCashInput, 10); if (!isNaN(v)) { setDevCash(v); setDevCashInput(''); } }}
                            style={{
                              background: 'rgba(255,100,0,0.6)', border: 'none', color: '#fff',
                              borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                            }}
                          >Set</button>
                        </div>
                      </div>
                      {/* Jump back to home life */}
                      <button
                        onClick={() => {
                          useGameStore.setState({
                            showEndGame: false, homeSold: false,
                            currentLocation: 'homelife', stage: 8, gameStarted: true,
                          });
                          setDevOpen(false);
                        }}
                        style={{ width: '100%', padding: '7px', marginTop: 4, borderRadius: 4, background: 'rgba(10,143,126,0.4)', border: '1px solid rgba(10,143,126,0.5)', color: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}
                      >
                        ← Back to Home Life
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
