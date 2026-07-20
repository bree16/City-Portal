import { useRef, useState, useEffect, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';
import { motion, AnimatePresence } from 'framer-motion';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';

const ACHIEVEMENT_META: Record<string, { label: string; icon: GameIconName }> = {
  budget_master:   { label: 'Budget Master',     icon: 'budget' },
  first_mortgage:  { label: 'Mortgage Ready',    icon: 'documents' },
  house_hunter:    { label: 'House Hunter',       icon: 'search' },
  credit_champion: { label: 'Credit Champion',   icon: 'star' },
  deal_maker:      { label: 'Deal Maker',        icon: 'handshake' },
  homeowner:       { label: 'New Homeowner',     icon: 'keys' },
  dream_home:      { label: 'Dream Home Builder', icon: 'sparkles' },
};

const INITIAL_CREDIT = 635;

interface ResultsCardProps {
  visible: boolean;
  onPlayAgain: () => void;
  onClose?: () => void;
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

// ── Confetti celebration ─────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(() =>
    Array.from({ length: 72 }, (_, i) => ({
      id: i,
      color: ['#D4AF37','#14B8A6','#F87171','#60A5FA','#A78BFA','#34D399','#FBBF24','#F472B6'][i % 8],
      left: 4 + (i / 72) * 92,
      delay: (i * 0.063) % 2.4,
      duration: 2.0 + (i % 5) * 0.45,
      size: 5 + (i % 4) * 3,
      isRect: i % 3 !== 0,
    })), []);

  if (!active) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1001, overflow: 'hidden' }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: -18,
            left: `${p.left}%`,
            width: p.size,
            height: p.isRect ? Math.round(p.size * 0.45) : p.size,
            background: p.color,
            borderRadius: p.isRect ? 2 : '50%',
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in both`,
          }}
        />
      ))}
    </div>
  );
}

export function ResultsCard({ visible, onPlayAgain, onClose }: ResultsCardProps) {
  const { month, creditScore, savings, selectedHomeId, achievements, furnitureOwned, characterAppearance, resetGame } = useGameStore();
  const [confettiActive, setConfettiActive] = useState(false);
  const home = homes.find((h) => h.id === selectedHomeId) ?? homes[0];
  const creditGain = creditScore - INITIAL_CREDIT;
  const earnedAchievements = achievements.filter((a) => ACHIEVEMENT_META[a]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  // Fire confetti when card becomes visible
  useEffect(() => {
    if (!visible) { setConfettiActive(false); return; }
    setConfettiActive(true);
    const t = setTimeout(() => setConfettiActive(false), 3600);
    return () => clearTimeout(t);
  }, [visible]);

  // ESC closes the card (without resetting game) if onClose is provided
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
        onClose?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, onClose]);

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    setDownloadError(false);
    const el = cardRef.current;
    const prevTransform = el.style.transform;
    try {
      // Neutralize any in-flight entry animation transform so the capture is never scaled/offset
      el.style.transform = 'none';
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        backgroundColor: '#110e15',
        filter: (node) => !(node instanceof HTMLElement && node.dataset.noExport !== undefined),
      });
      const link = document.createElement('a');
      link.download = 'my-newport-news-homebuying-journey.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export results card:', err);
      setDownloadError(true);
    } finally {
      el.style.transform = prevTransform;
      setDownloading(false);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
  };

  return (
    <>
    <Confetti active={confettiActive} />
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(17, 14, 21, 0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            ref={cardRef}
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
              <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)', letterSpacing: '0.12em' }}>
                Newport News Housing Hub
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 700 }}>Path to Your First Home</span>
                {onClose && (
                  <button
                    data-no-export
                    onClick={onClose}
                    title="Close"
                    style={{
                      background: 'rgba(0,0,0,0.15)', border: 'none', borderRadius: '50%',
                      width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--ink)', fontWeight: 800, fontSize: 16, lineHeight: 1,
                    }}
                  >✕</button>
                )}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px 28px' }}>
              {/* Title + character row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
                {/* Character */}
                <div style={{
                  flexShrink: 0,
                  background: 'rgba(212,168,67,0.1)',
                  borderRadius: 0,
                  padding: '12px 10px 6px',
                  border: 'var(--glass-border-gold)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <MiniCharacter {...characterAppearance} />
                  <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 700 }}>
                    {characterAppearance.name || 'Player'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--glass-text-dim)', fontWeight: 500 }}>
                    {characterAppearance.pronouns || 'they/them'}
                  </span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                    Credit: {creditScore}
                  </span>
                </div>

                {/* Title block */}
                <div style={{ flex: 1, paddingTop: 8 }}>
                  <div style={{ fontSize: 16, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GameIcon name="celebration" size={18} /> Journey Complete!
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--glass-text)', lineHeight: 1.2, marginBottom: 8 }}>
                    You're a Newport News Homeowner!
                  </div>
                  <div style={{
                    background: 'rgba(0,240,255,0.14)', borderRadius: 0, padding: '8px 12px',
                    border: '1px solid rgba(20,184,161,0.3)',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold)' }}>{home.name}</div>
                    <div style={{ fontSize: 17, color: 'var(--glass-text-dim)', marginTop: 2 }}>
                      {home.neighborhood} · ${home.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                <StatBox icon="calendar" label="Months to Close" value={`${month} months`} />
                <StatBox
                  icon="chart"
                  label="Credit Score Journey"
                  value={`${INITIAL_CREDIT} → ${creditScore}`}
                  subValue={creditGain >= 0 ? `+${creditGain} pts` : `${creditGain} pts`}
                  valueColor={creditGain >= 0 ? '#4ade80' : '#f87171'}
                />
                <StatBox
                  icon="bank"
                  label="Savings at Closing"
                  value={savings > 0 ? `${savings.toLocaleString()}` : '$0'}
                  subValue={savings === 0 ? 'Used toward down payment' : undefined}
                />
                <StatBox
                  icon="furniture"
                  label="Furniture Purchased"
                  value={furnitureOwned.length > 0 ? `${furnitureOwned.length} item${furnitureOwned.length !== 1 ? 's' : ''}` : 'None yet'}
                  subValue={furnitureOwned.length === 0 ? 'Ready to furnish!' : undefined}
                />
              </div>

              {/* Achievements */}
              {earnedAchievements.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--glass-text-faint)', letterSpacing: '0.1em', marginBottom: 10 }}>
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
                          <GameIcon name={meta.icon} size={18} />
                          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{meta.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Share */}
              {downloadError && (
                <div data-no-export style={{ fontSize: 14, color: '#f87171', marginBottom: 8, textAlign: 'center' }}>
                  Couldn't create image — try a screenshot instead.
                </div>
              )}

              {/* CTAs */}
              <div data-no-export style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Primary row */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="glass-btn"
                    style={{
                      flex: 1, padding: '11px 14px', fontWeight: 700, fontSize: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      cursor: downloading ? 'wait' : 'pointer',
                    }}
                  >
                    <GameIcon name="camera" size={16} /> {downloading ? 'Creating…' : 'Download Card'}
                  </button>
                  <button
                    onClick={handlePlayAgain}
                    className="glass-btn"
                    style={{
                      flex: 1, padding: '11px 14px', fontWeight: 700, fontSize: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <GameIcon name="replay" size={16} /> New Journey
                  </button>
                </div>
                {/* Secondary row */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="glass-btn"
                      style={{
                        flex: 1, padding: '11px 14px', fontWeight: 700, fontSize: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                      }}
                    >
                      <GameIcon name="home" size={16} /> Continue Journey
                    </button>
                  )}
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn-primary"
                    style={{
                      flex: onClose ? 1 : 2, padding: '11px 14px', fontSize: 14,
                      textDecoration: 'none', textAlign: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <GameIcon name="neighborhood" size={16} /> Return to Housing Hub
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

function StatBox({ icon, label, value, subValue, valueColor }: {
  icon: GameIconName; label: string; value: string; subValue?: string; valueColor?: string;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 0, padding: '12px 14px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <GameIcon name={icon} size={18} />
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--glass-text-faint)', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: valueColor ?? 'var(--glass-text)' }}>{value}</div>
      {subValue && <div style={{ fontSize: 16, color: valueColor ?? 'var(--glass-text-dim)', fontWeight: 600, marginTop: 2 }}>{subValue}</div>}
    </div>
  );
}
