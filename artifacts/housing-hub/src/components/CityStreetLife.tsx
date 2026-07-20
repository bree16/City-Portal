/**
 * CityStreetLife — living city-life character overlay.
 * Rendered via React Portal directly on document.body so position:fixed
 * is never broken by parent CSS transforms (e.g. page transition animations).
 * Each page gets max 3 characters at distinct fixed positions.
 * Every character reacts uniquely to hover + click.
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

const SKIP = new Set(['/simulator', '/sign-in', '/sign-up']);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Speech Bubble ────────────────────────────────────────────────────────────

function SpeechBubble({ text, color = '#14B8A6' }: { text: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6, y: 6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{
        position: 'absolute',
        bottom: '112%', left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        border: `2px solid ${color}`,
        borderRadius: 10,
        padding: '7px 13px',
        fontSize: 12,
        fontWeight: 700,
        color: '#0B2146',
        whiteSpace: 'nowrap',
        boxShadow: '0 6px 22px rgba(0,0,0,0.18)',
        zIndex: 10002,
        pointerEvents: 'none',
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.4,
      }}
    >
      {text}
      <span style={{
        position: 'absolute', bottom: -9, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
        borderTop: `8px solid ${color}`,
        display: 'block',
      }} />
    </motion.div>
  );
}

// ─── Confetti burst ───────────────────────────────────────────────────────────

function Confetti() {
  const items = ['🎉', '🏡', '⭐', '🎊', '🔑', '🌟'];
  return (
    <>
      {items.map((emoji, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        return (
          <motion.div key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
            animate={{ x: Math.cos(angle) * 65, y: Math.sin(angle) * 55 - 15, opacity: 0, scale: 1.6 }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: i * 0.04 }}
            style={{ position: 'absolute', top: '50%', left: '50%', fontSize: 17, pointerEvents: 'none', zIndex: 10003 }}
          >{emoji}</motion.div>
        );
      })}
    </>
  );
}

// Characters live only in the two bottom corners, scaled small so they
// never cover readable content.  Scale origin matches the corner so the
// character grows inward (not outward off-screen) on hover.
const POS = {
  BL: { bottom: 92, left: 4 },
  BR: { bottom: 92, right: 4 },
} as const;

// ─── Interactive wrapper ──────────────────────────────────────────────────────

interface CharWrapperProps {
  style: React.CSSProperties;
  bubbleColor?: string;
  bubbleTexts: string[];          // Random one picked on each click
  showConfetti?: boolean;
  children: (hovered: boolean, clicked: boolean) => React.ReactNode;
}

function CharWrapper({ style, bubbleColor = '#14B8A6', bubbleTexts, showConfetti = false, children }: CharWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [bubble, setBubble] = useState('');
  const [confetti, setConfetti] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = useCallback(() => {
    if (clicked) return;
    setBubble(pick(bubbleTexts));
    setClicked(true);
    if (showConfetti) setConfetti(true);
    timerRef.current = setTimeout(() => {
      setClicked(false);
      setConfetti(false);
    }, 2800);
  }, [clicked, bubbleTexts, showConfetti]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const isRight = style != null && 'right' in (style as object);

  return (
    <div
      style={{ position: 'absolute', cursor: 'pointer', pointerEvents: 'auto', userSelect: 'none', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <motion.div
        animate={{ scale: hovered ? 0.72 : 0.60, opacity: hovered || clicked ? 1 : 0.60 }}
        transition={{ duration: 0.2 }}
        style={{ position: 'relative', transformOrigin: isRight ? 'bottom right' : 'bottom left' }}
      >
        {children(hovered, clicked)}
        <AnimatePresence>
          {clicked && <SpeechBubble key="bubble" text={bubble} color={bubbleColor} />}
        </AnimatePresence>
        <AnimatePresence>
          {confetti && <Confetti key="confetti" />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── SVG Primitives ───────────────────────────────────────────────────────────

function Circ({ cx, cy, r = 9, fill = '#FDBCB4' }: { cx: number; cy: number; r?: number; fill?: string }) {
  return <circle cx={cx} cy={cy} r={r} fill={fill} />;
}
function Rect({ x, y, w = 14, h = 20, rx = 4, fill = '#1E3A5F' }: { x: number; y: number; w?: number; h?: number; rx?: number; fill?: string }) {
  return <rect x={x - w / 2} y={y} width={w} height={h} rx={rx} fill={fill} />;
}
function Leg({ x, y, color = '#1A3A6B', dir = 1, angle = 25 }: { x: number; y: number; color?: string; dir?: 1 | -1; angle?: number }) {
  return (
    <motion.g animate={{ rotate: [dir * angle, -dir * angle, dir * angle] }}
      style={{ transformOrigin: `${x}px ${y}px` }}
      transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}>
      <line x1={x} y1={y} x2={x + dir * 3} y2={y + 16} stroke={color} strokeWidth={3} strokeLinecap="round" />
    </motion.g>
  );
}
function Arm({ x, y, color = '#14B8A6', dir = 1, angle = 22 }: { x: number; y: number; color?: string; dir?: 1 | -1; angle?: number }) {
  return (
    <motion.g animate={{ rotate: [-dir * angle, dir * angle, -dir * angle] }}
      style={{ transformOrigin: `${x}px ${y}px` }}
      transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}>
      <line x1={x} y1={y} x2={x + dir * 8} y2={y + 12} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </motion.g>
  );
}

// ─── Character 1: Cyclist ─────────────────────────────────────────────────────

function CharCyclist({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  const speed = clicked ? 0.12 : hovered ? 0.25 : 0.45;
  return (
    <svg width="90" height="70" viewBox="0 0 90 70" style={{ overflow: 'visible' }}>
      {/* Wheels */}
      {[18, 72].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy={54} r={14} fill="none" stroke="#333" strokeWidth={2.5} />
          <motion.g animate={{ rotate: 360 }} style={{ transformOrigin: `${cx}px 54px` }}
            transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}>
            <line x1={cx - 14} y1={54} x2={cx + 14} y2={54} stroke="#555" strokeWidth={1.5} />
            <line x1={cx} y1={40} x2={cx} y2={68} stroke="#555" strokeWidth={1.5} />
          </motion.g>
          <circle cx={cx} cy={54} r={3} fill="#555" />
        </g>
      ))}
      {/* Frame */}
      <line x1={18} y1={54} x2={45} y2={30} stroke="#666" strokeWidth={2.5} />
      <line x1={45} y1={30} x2={72} y2={54} stroke="#666" strokeWidth={2.5} />
      <line x1={45} y1={30} x2={45} y2={54} stroke="#666" strokeWidth={2.5} />
      <line x1={40} y1={54} x2={50} y2={54} stroke="#666" strokeWidth={2.5} />
      {/* Handlebar */}
      <line x1={45} y1={30} x2={60} y2={26} stroke="#888" strokeWidth={2} />
      {/* Rider */}
      <Circ cx={52} cy={16} fill="#F5D5B0" />
      {/* Helmet */}
      <path d="M44 14 Q52 6 60 14 Q60 16 52 17 Q44 16 44 14Z" fill="#D4AF37" />
      <Rect x={52} y={22} w={12} h={12} fill="#14B8A6" />
      {/* Pedaling legs */}
      <motion.g animate={{ rotate: 360 }} style={{ transformOrigin: '45px 54px' }}
        transition={{ duration: speed * 1.5, repeat: Infinity, ease: 'linear' }}>
        <line x1={45} y1={46} x2={38} y2={56} stroke="#1A3A6B" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={45} y1={62} x2={52} y2={52} stroke="#1A3A6B" strokeWidth={2.5} strokeLinecap="round" />
      </motion.g>
      {/* Arms */}
      <line x1={52} y1={26} x2={60} y2={28} stroke="#14B8A6" strokeWidth={2.5} strokeLinecap="round" />
      {/* Excited wave on click */}
      {clicked && (
        <motion.g initial={{ rotate: 0 }} animate={{ rotate: [0, -40, 0, -40, 0] }}
          style={{ transformOrigin: '52px 30px' }}
          transition={{ duration: 0.8 }}>
          <line x1={52} y1={30} x2={44} y2={22} stroke="#14B8A6" strokeWidth={2.5} strokeLinecap="round" />
          <text x="38" y="18" fontSize="12">👋</text>
        </motion.g>
      )}
    </svg>
  );
}

// ─── Character 2: Homebuyer Celebration ──────────────────────────────────────

function CharHomebuyer({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  return (
    <svg width="90" height="120" viewBox="0 0 90 120" style={{ overflow: 'visible' }}>
      {/* Mini SOLD house */}
      <polygon points="45,8 75,28 75,78 15,78 15,28" fill="#D4AF37" opacity={0.9} />
      <polygon points="45,8 80,32 10,32" fill="#14B8A6" />
      <rect x={32} y={52} width={26} height={26} rx={2} fill="#8B4513" />
      <rect x={20} y={38} width={16} height={16} rx={2} fill="#87CEEB" opacity={0.8} />
      <rect x={54} y={38} width={16} height={16} rx={2} fill="#87CEEB" opacity={0.8} />
      {/* SOLD sign */}
      <rect x={60} y={68} width={28} height={12} rx={2} fill="#CC0000" />
      <text x="74" y="77" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="900" fontFamily="sans-serif">SOLD!</text>
      {/* Person */}
      <motion.g animate={{ y: hovered ? [0, -4, 0] : [0, -2, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
        <Circ cx={45} cy={92} fill="#C68642" />
        <Rect x={45} y={101} w={14} h={16} fill="#14B8A6" />
        {/* Keys held up */}
        <motion.g animate={{ rotate: clicked ? [0, 20, -20, 20, 0] : [0, 8, 0] }}
          style={{ transformOrigin: '56px 104px' }}
          transition={{ duration: clicked ? 0.5 : 1.8, repeat: clicked ? 3 : Infinity }}>
          <line x1={56} y1={104} x2={68} y2={96} stroke="#14B8A6" strokeWidth={2.5} strokeLinecap="round" />
          <text x="70" y="94" fontSize="13">🔑</text>
        </motion.g>
        <line x1={34} y1={104} x2={24} y2={112} stroke="#14B8A6" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={45} y1={117} x2={41} y2={120} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        <line x1={45} y1={117} x2={49} y2={120} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

// ─── Character 3: Dog Walker ──────────────────────────────────────────────────

function CharDogWalker({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  return (
    <svg width="100" height="90" viewBox="0 0 100 90" style={{ overflow: 'visible' }}>
      {/* Person */}
      <Circ cx={28} cy={14} fill="#FDBCB4" />
      <Rect x={28} y={22} w={14} h={18} fill="#7C3AED" />
      <Arm x={22} y={26} color="#7C3AED" dir={-1} />
      {/* Leash arm — straight toward dog */}
      <line x1={34} y1={26} x2={52} y2={34} stroke="#7C3AED" strokeWidth={2.5} strokeLinecap="round" />
      {/* Leash rope */}
      <path d="M52 34 Q60 42 70 38" stroke="#8B4513" strokeWidth={1.5} fill="none" />
      <Leg x={24} y={40} color="#1A3A6B" dir={-1} />
      <Leg x={32} y={40} color="#1A3A6B" dir={1} />
      {/* Dog */}
      <motion.g animate={{ y: clicked ? [0, -12, 0, -8, 0] : hovered ? [0, -5, 0] : [0, -2, 0] }}
        transition={{ duration: clicked ? 0.7 : 1.5, repeat: clicked ? 2 : Infinity, ease: 'easeOut' }}>
        <ellipse cx={74} cy={44} rx={14} ry={8} fill="#C68642" />
        <circle cx={86} cy={40} r={7} fill="#A0522D" />
        <ellipse cx={90} cy={36} rx={4} ry={5} fill="#8B4513" />
        {/* Tail */}
        <motion.g animate={{ rotate: [-30, 30, -30] }} style={{ transformOrigin: '62px 42px' }}
          transition={{ duration: 0.4, repeat: Infinity }}>
          <path d="M62 42 Q54 36 56 30" stroke="#C68642" strokeWidth={3} fill="none" strokeLinecap="round" />
        </motion.g>
        {/* Legs */}
        <line x1={68} y1={50} x2={66} y2={62} stroke="#A0522D" strokeWidth={2} strokeLinecap="round" />
        <line x1={74} y1={51} x2={72} y2={63} stroke="#A0522D" strokeWidth={2} strokeLinecap="round" />
        <line x1={80} y1={51} x2={78} y2={63} stroke="#A0522D" strokeWidth={2} strokeLinecap="round" />
        {/* Sit text on click */}
        {clicked && <text x="74" y="30" textAnchor="middle" fontSize="11">🐾</text>}
      </motion.g>
    </svg>
  );
}

// ─── Character 4: Street Musician ─────────────────────────────────────────────

function CharMusician({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  const noteScale = clicked ? 2 : hovered ? 1.4 : 1;
  return (
    <svg width="90" height="110" viewBox="0 0 90 110" style={{ overflow: 'visible' }}>
      {/* Hat */}
      <ellipse cx={40} cy={14} rx={12} ry={8} fill="#D4AF37" />
      <rect x={30} y={8} width={20} height={6} rx={1} fill="#B8971F" />
      <Circ cx={40} cy={22} fill="#C68642" />
      <Rect x={40} y={30} w={14} h={18} fill="#1E3A5F" />
      {/* Guitar body */}
      <ellipse cx={30} cy={60} rx={10} ry={13} fill="#8B4513" />
      <ellipse cx={30} cy={72} rx={12} ry={14} fill="#A0522D" />
      <rect x={28} y={38} width={4} height={28} rx={2} fill="#6B3410" />
      {/* Strings */}
      {[29, 31, 33].map(x => <line key={x} x1={x} y1={40} x2={x} y2={82} stroke="rgba(255,255,255,0.5)" strokeWidth={0.8} />)}
      {/* Playing arm */}
      <motion.g animate={{ rotate: clicked ? [-25, 25, -25, 25, -25] : [-18, 18, -18] }}
        style={{ transformOrigin: '50px 34px' }}
        transition={{ duration: clicked ? 0.25 : 0.35, repeat: Infinity }}>
        <line x1={50} y1={34} x2={38} y2={52} stroke="#1E3A5F" strokeWidth={2.5} strokeLinecap="round" />
      </motion.g>
      <line x1={30} y1={34} x2={20} y2={46} stroke="#1E3A5F" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={40} y1={48} x2={37} y2={64} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
      <line x1={40} y1={48} x2={43} y2={64} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
      {/* Tip jar */}
      <ellipse cx={14} cy={92} rx={10} ry={5} fill="#222" />
      <text x="14" y="96" textAnchor="middle" fontSize="6" fill="#D4AF37">TIPS</text>
      {/* Music notes */}
      {['♩', '♪', '♫'].map((n, i) => (
        <motion.g key={i}
          animate={{ y: [0, -22 * noteScale, 0], opacity: [1, 0, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.55 }}>
          <text x={60 + i * 11} y={35} fontSize={13 * noteScale} fill="#D4AF37" fontWeight="bold">{n}</text>
        </motion.g>
      ))}
    </svg>
  );
}

// ─── Character 5: Bench Sitter ────────────────────────────────────────────────

function CharBenchSitter({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  return (
    <svg width="110" height="80" viewBox="0 0 110 80" style={{ overflow: 'visible' }}>
      {/* Bench */}
      <rect x={5} y={52} width={100} height={6} rx={2} fill="#8B6914" />
      <rect x={5} y={46} width={100} height={6} rx={2} fill="#A0792A" />
      {[12, 100].map(x => <rect key={x} x={x} y={44} width={5} height={18} rx={2} fill="#6B4C11" />)}
      {/* Backrest */}
      <rect x={5} y={30} width={100} height={5} rx={2} fill="#A0792A" />
      {[20, 55, 90].map(x => <rect key={x} x={x} y={35} width={3} height={16} rx={1} fill="#8B6914" />)}
      {/* Person */}
      <motion.g animate={{ rotate: hovered || clicked ? [0, 5, -5, 5, 0] : [0, 2, -2, 0] }}
        style={{ transformOrigin: '55px 30px' }}
        transition={{ duration: hovered || clicked ? 0.5 : 3, repeat: Infinity }}>
        <Circ cx={55} cy={20} fill="#8D5524" />
        <Rect x={55} y={28} w={16} h={16} fill="#60A5FA" />
        {/* Coffee cup */}
        <motion.g animate={{ rotate: clicked ? [0, 15, -10, 0] : 0 }}
          style={{ transformOrigin: '68px 36px' }}
          transition={{ duration: 0.5 }}>
          <line x1={62} y1={32} x2={72} y2={28} stroke="#60A5FA" strokeWidth={2.5} strokeLinecap="round" />
          <rect x={70} y={22} width={8} height={10} rx={2} fill="#8B4513" />
          <path d="M70 22 Q74 18 78 22" stroke="#8B4513" strokeWidth={1} fill="none" />
        </motion.g>
        {/* Other arm with phone */}
        <motion.g animate={{ rotate: clicked ? [0, -20, 0] : 0 }}
          style={{ transformOrigin: '48px 34px' }}>
          <line x1={48} y1={32} x2={36} y2={36} stroke="#60A5FA" strokeWidth={2.5} strokeLinecap="round" />
          {!clicked && <rect x={30} y={32} width={8} height={12} rx={2} fill="#111" />}
          {clicked && <text x="28" y="36" fontSize="14">👋</text>}
        </motion.g>
        {/* Seated legs */}
        <line x1={48} y1={44} x2={46} y2={58} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        <line x1={62} y1={44} x2={64} y2={58} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

// ─── Character 6: Counselor at Desk ──────────────────────────────────────────

function CharCounselor({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
      {/* Desk */}
      <rect x={20} y={60} width={100} height={7} rx={3} fill="#8B6914" />
      <rect x={24} y={67} width={6} height={24} rx={2} fill="#6B4C11" />
      <rect x={110} y={67} width={6} height={24} rx={2} fill="#6B4C11" />
      {/* Laptop */}
      <rect x={35} y={30} width={66} height={42} rx={4} fill="#1E3A5F" />
      <rect x={38} y={33} width={60} height={36} rx={3} fill="#0A1628" />
      {/* Screen glow */}
      <rect x={40} y={35} width={56} height={12} rx={2} fill="#fff" opacity={0.9} />
      <text x="68" y="44" textAnchor="middle" fontSize="7" fill="#006AFF" fontWeight="900" fontFamily="sans-serif">Newport News Housing</text>
      {/* House cards on screen */}
      {[42, 68, 94].map((x, i) => (
        <motion.g key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}>
          <rect x={x} y={49} width={20} height={16} rx={2} fill={['#14B8A6', '#D4AF37', '#60A5FA'][i]} opacity={0.7} />
          <text x={x + 10} y={59} textAnchor="middle" fontSize="5" fill="#fff">🏡</text>
        </motion.g>
      ))}
      {/* Cursor blink */}
      <motion.rect x={95} y={36} width={1.5} height={10} fill="#0A1628"
        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
      {/* Keyboard */}
      <rect x={35} y={72} width={66} height={4} rx={2} fill="#333" />
      {/* Hinge */}
      <rect x={60} y={70} width={20} height={3} rx={1} fill="#1A1A2E" />
      {/* Person */}
      <Circ cx={82} cy={20} fill="#F5D5B0" />
      <Rect x={82} y={28} w={14} h={16} fill="#0B2146" />
      {/* Typing arms */}
      <motion.g animate={{ rotate: clicked ? [-30, 30, -30] : [-10, 10, -10] }}
        style={{ transformOrigin: '76px 34px' }}
        transition={{ duration: clicked ? 0.15 : 0.4, repeat: Infinity }}>
        <line x1={76} y1={34} x2={60} y2={52} stroke="#0B2146" strokeWidth={2.5} strokeLinecap="round" />
      </motion.g>
      <motion.g animate={{ rotate: clicked ? [30, -30, 30] : [10, -10, 10] }}
        style={{ transformOrigin: '88px 34px' }}
        transition={{ duration: clicked ? 0.15 : 0.4, repeat: Infinity }}>
        <line x1={88} y1={34} x2={100} y2={50} stroke="#0B2146" strokeWidth={2.5} strokeLinecap="round" />
      </motion.g>
      {/* Look-up head tilt on click */}
      {clicked && <text x="86" y="16" textAnchor="middle" fontSize="12">👀</text>}
    </svg>
  );
}

// ─── Character 7: Shipbuilder ─────────────────────────────────────────────────

function CharShipbuilder({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" style={{ overflow: 'visible' }}>
      {/* Hard hat */}
      <path d="M24 28 Q40 16 56 28 L56 32 L24 32Z" fill="#FFD700" />
      <rect x={24} y={27} width={32} height={6} rx={2} fill="#CC9900" />
      <Circ cx={40} cy={38} fill="#F5D5B0" />
      <Rect x={40} y={46} w={16} h={20} fill="#FF6B00" />
      {/* Blueprints in arm */}
      <motion.g animate={{ rotate: hovered || clicked ? [-5, 5, -5] : [-2, 2, -2] }}
        style={{ transformOrigin: '30px 52px' }}
        transition={{ duration: 1.2, repeat: Infinity }}>
        <line x1={30} y1={52} x2={14} y2={60} stroke="#FF6B00" strokeWidth={2.5} strokeLinecap="round" />
        <rect x={4} y={56} width={22} height={16} rx={2} fill="#87CEEB" opacity={0.9} />
        {[0, 1, 2].map(i => <line key={i} x1={6} y1={61 + i * 4} x2={24} y2={61 + i * 4} stroke="#1E3A5F" strokeWidth={1} />)}
      </motion.g>
      {/* Wrench arm */}
      <motion.g animate={{ rotate: clicked ? [0, -30, 30, -30, 0] : [0, -10, 10, 0] }}
        style={{ transformOrigin: '50px 50px' }}
        transition={{ duration: clicked ? 0.4 : 2, repeat: clicked ? 2 : Infinity }}>
        <line x1={50} y1={50} x2={64} y2={44} stroke="#FF6B00" strokeWidth={2.5} strokeLinecap="round" />
        <text x="66" y="42" fontSize="14">🔧</text>
      </motion.g>
      {/* Legs */}
      <line x1={36} y1={66} x2={32} y2={82} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
      <line x1={44} y1={66} x2={48} y2={82} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
      {/* HII badge */}
      <rect x={30} y={52} width={20} height={8} rx={2} fill="#0B2146" />
      <text x="40" y="58" textAnchor="middle" fontSize="5" fill="#D4AF37" fontWeight="900">HII ⚓</text>
      {/* Thumbs up on click */}
      {clicked && (
        <motion.text x="56" y="32" textAnchor="middle" fontSize="18"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.3, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}>👍</motion.text>
      )}
    </svg>
  );
}

// ─── Character 8: Nurse ───────────────────────────────────────────────────────

function CharNurse({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" style={{ overflow: 'visible' }}>
      {/* Nurse cap */}
      <rect x={28} y={8} width={24} height={10} rx={2} fill="#fff" />
      <line x1={40} y1={8} x2={40} y2={18} stroke="#CC0000" strokeWidth={2} />
      <line x1={33} y1={12} x2={47} y2={12} stroke="#CC0000" strokeWidth={2} />
      <Circ cx={40} cy={24} fill="#FDBCB4" />
      <Rect x={40} y={32} w={16} h={20} fill="#fff" />
      {/* Scrub pants */}
      <rect x={32} y={52} width={16} height={20} rx={3} fill="#B3E5FC" />
      {/* Stethoscope */}
      <path d="M34 38 Q26 46 32 52 Q38 58 44 52" stroke="#333" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <circle cx={44} cy={52} r={3} fill="#555" />
      {/* Clipboard arm */}
      <motion.g animate={{ rotate: clicked ? [-15, 15, -15, 0] : hovered ? [-8, 8, -8] : [-4, 4, -4] }}
        style={{ transformOrigin: '46px 38px' }}
        transition={{ duration: clicked ? 0.3 : 1.5, repeat: clicked ? 3 : Infinity }}>
        <line x1={46} y1={38} x2={58} y2={44} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
        <rect x={57} y={40} width={14} height={18} rx={2} fill="#fff" stroke="#14B8A6" strokeWidth={1.5} />
        {[0, 1, 2].map(i => <line key={i} x1={59} y1={46 + i * 4} x2={69} y2={46 + i * 4} stroke="#14B8A6" strokeWidth={1} />)}
      </motion.g>
      <line x1={34} y1={38} x2={22} y2={46} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      {/* Shoes */}
      <rect x={30} y={70} width={10} height={6} rx={2} fill="#fff" />
      <rect x={42} y={70} width={10} height={6} rx={2} fill="#fff" />
      {/* Heart on click */}
      {clicked && (
        <motion.text x="22" y="36" textAnchor="middle" fontSize="16"
          initial={{ y: 36, opacity: 0 }} animate={{ y: 20, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5 }}>❤️</motion.text>
      )}
    </svg>
  );
}

// ─── Character 9: Kids Running ────────────────────────────────────────────────

function CharKidsRunning({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  const speed = clicked ? 0.18 : hovered ? 0.3 : 0.5;
  return (
    <svg width="100" height="80" viewBox="0 0 100 80" style={{ overflow: 'visible' }}>
      {/* Kid 1 */}
      <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: speed, repeat: Infinity }}>
        <Circ cx={28} cy={22} r={9} fill="#FDBCB4" />
        {/* Pigtails */}
        <line x1={22} y1={16} x2={16} y2={10} stroke="#8B4513" strokeWidth={2} strokeLinecap="round" />
        <line x1={34} y1={16} x2={40} y2={10} stroke="#8B4513" strokeWidth={2} strokeLinecap="round" />
        <Rect x={28} y={30} w={12} h={14} fill="#FF6B9D" />
        <Leg x={24} y={44} color="#1A3A6B" dir={-1} angle={35} />
        <Leg x={32} y={44} color="#1A3A6B" dir={1} angle={35} />
        <Arm x={22} y={33} color="#FF6B9D" dir={-1} angle={35} />
        <Arm x={34} y={33} color="#FF6B9D" dir={1} angle={35} />
        {clicked && <text x="28" y="10" textAnchor="middle" fontSize="14">🌟</text>}
      </motion.g>
      {/* Kid 2 */}
      <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: speed, repeat: Infinity, delay: speed / 2 }}>
        <Circ cx={72} cy={22} r={9} fill="#C68642" />
        {/* Cap */}
        <path d="M63 18 Q72 10 81 18 L81 20 L63 20Z" fill="#14B8A6" />
        <Rect x={72} y={30} w={12} h={14} fill="#60A5FA" />
        <Leg x={68} y={44} color="#1A3A6B" dir={1} angle={35} />
        <Leg x={76} y={44} color="#1A3A6B" dir={-1} angle={35} />
        <Arm x={66} y={33} color="#60A5FA" dir={-1} angle={35} />
        <Arm x={78} y={33} color="#60A5FA" dir={1} angle={35} />
        {clicked && <text x="72" y="10" textAnchor="middle" fontSize="14">🎉</text>}
      </motion.g>
      {/* Ground */}
      <rect x={0} y={68} width={100} height={2} rx={1} fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

// ─── Character 10: Family Group ───────────────────────────────────────────────

function CharFamilyGroup({ hovered, clicked }: { hovered: boolean; clicked: boolean }) {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
      {/* Dad */}
      <motion.g animate={{ rotate: hovered || clicked ? [-6, 6, -6] : [-2, 2, -2] }}
        style={{ transformOrigin: '28px 50px' }}
        transition={{ duration: hovered || clicked ? 0.4 : 2.5, repeat: Infinity }}>
        <Circ cx={28} cy={20} fill="#8D5524" />
        <Rect x={28} y={28} w={16} h={20} fill="#1E3A5F" />
        <line x1={22} y1={32} x2={14} y2={44} stroke="#1E3A5F" strokeWidth={2.5} strokeLinecap="round" />
        <motion.g animate={{ rotate: clicked ? [-40, 40, -40, 40, 0] : [-20, 20, -20] }}
          style={{ transformOrigin: '34px 32px' }}
          transition={{ duration: clicked ? 0.25 : 1.2, repeat: clicked ? 4 : Infinity }}>
          <line x1={34} y1={32} x2={44} y2={24} stroke="#1E3A5F" strokeWidth={2.5} strokeLinecap="round" />
        </motion.g>
        <line x1={24} y1={48} x2={22} y2={64} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        <line x1={32} y1={48} x2={34} y2={64} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
      </motion.g>
      {/* Mom */}
      <motion.g animate={{ rotate: hovered || clicked ? [6, -6, 6] : [2, -2, 2] }}
        style={{ transformOrigin: '62px 50px' }}
        transition={{ duration: hovered || clicked ? 0.4 : 2.2, repeat: Infinity, delay: 0.3 }}>
        <Circ cx={62} cy={22} fill="#FDBCB4" />
        {/* Hair */}
        <path d="M52 20 Q62 12 72 20 L72 18 Q62 8 52 18Z" fill="#5C2D0E" />
        <Rect x={62} y={30} w={14} h={18} fill="#D4AF37" />
        <motion.g animate={{ rotate: clicked ? [-40, 40, -40, 40, 0] : [-18, 18, -18] }}
          style={{ transformOrigin: '56px 34px' }}
          transition={{ duration: clicked ? 0.25 : 1.4, repeat: clicked ? 4 : Infinity }}>
          <line x1={56} y1={34} x2={46} y2={26} stroke="#D4AF37" strokeWidth={2.5} strokeLinecap="round" />
        </motion.g>
        <line x1={68} y1={34} x2={76} y2={44} stroke="#D4AF37" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={58} y1={48} x2={56} y2={64} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        <line x1={66} y1={48} x2={68} y2={64} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
      </motion.g>
      {/* Child */}
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
        <Circ cx={95} cy={38} r={8} fill="#C68642" />
        <Rect x={95} y={44} w={10} h={14} fill="#34D399" />
        <motion.g animate={{ rotate: clicked ? [-50, 50, -50, 50, 0] : [-25, 25, -25] }}
          style={{ transformOrigin: '91px 48px' }}
          transition={{ duration: clicked ? 0.2 : 1, repeat: clicked ? 5 : Infinity }}>
          <line x1={91} y1={48} x2={82} y2={42} stroke="#34D399" strokeWidth={2} strokeLinecap="round" />
        </motion.g>
        <motion.g animate={{ rotate: clicked ? [50, -50, 50, -50, 0] : [25, -25, 25] }}
          style={{ transformOrigin: '99px 48px' }}
          transition={{ duration: clicked ? 0.2 : 1, repeat: clicked ? 5 : Infinity }}>
          <line x1={99} y1={48} x2={106} y2={42} stroke="#34D399" strokeWidth={2} strokeLinecap="round" />
        </motion.g>
        <line x1={92} y1={58} x2={90} y2={68} stroke="#1A3A6B" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={98} y1={58} x2={100} y2={68} stroke="#1A3A6B" strokeWidth={2.5} strokeLinecap="round" />
        {clicked && <text x="95" y="30" textAnchor="middle" fontSize="12">😄</text>}
      </motion.g>
    </svg>
  );
}

// ─── Page-scene map ───────────────────────────────────────────────────────────

type SceneDef = {
  id: string;
  Char: React.ComponentType<{ hovered: boolean; clicked: boolean }>;
  style: React.CSSProperties;
  bubbleTexts: string[];
  bubbleColor?: string;
  showConfetti?: boolean;
};

// Every page gets a UNIQUE pair — no two pages share the same left+right combo.
// Characters live only in the two bottom corners, scaled down so they never
// block readable content in the centre of the page.
const PAGE_SCENES: Record<string, SceneDef[]> = {
  // Home — Homebuyer celebrating + Dog walker
  '/': [
    { id: 'a', Char: CharHomebuyer, style: POS.BL,
      bubbleTexts: ['Just closed on my home! 🔑🏡', 'Newport News made it happen! 🎉', 'Best decision of my life! ⭐'],
      bubbleColor: '#D4AF37', showConfetti: true },
    { id: 'b', Char: CharDogWalker, style: POS.BR,
      bubbleTexts: ['Best neighborhood walks! 🐕', 'Great city, great community! 🐾', 'Every block is beautiful!'] },
  ],
  // Buy — Counselor advising + Bench sitter researching
  '/buy': [
    { id: 'a', Char: CharCounselor, style: POS.BL,
      bubbleTexts: ['Free HUD counseling! 📞', 'Call (757) 933-2311 🏠', 'I help buyers every day!'] },
    { id: 'b', Char: CharBenchSitter, style: POS.BR,
      bubbleTexts: ['That calculator above is 🔥', 'Rent vs. buy — game changer!', 'Did the math, buying wins!'] },
  ],
  // Rent — Nurse + Family group
  '/rent': [
    { id: 'a', Char: CharNurse, style: POS.BL,
      bubbleTexts: ['Good housing = good health! 💙', 'Found mine through this site!', 'Stable home, stable life! 🏥'] },
    { id: 'b', Char: CharFamilyGroup, style: POS.BR,
      bubbleTexts: ['Perfect rental for us! 🏠', 'Newport News feels like home! ❤️', 'Great neighborhood for our kids!'] },
  ],
  // Neighborhoods — Cyclist exploring + Kids running
  '/neighborhoods': [
    { id: 'a', Char: CharCyclist, style: POS.BL,
      bubbleTexts: ['Hilton Village is incredible! 🚴', 'Oyster Point for the win! 🏙️', 'Every neighborhood has its vibe!'] },
    { id: 'b', Char: CharKidsRunning, style: POS.BR,
      bubbleTexts: ['So many parks to run in! 🌟', 'Best schools are right here! 🎉', 'Our block is the best block!'] },
  ],
  // Assistance — Family group helped + Nurse supporting
  '/assistance': [
    { id: 'a', Char: CharFamilyGroup, style: POS.BL,
      bubbleTexts: ['Programs saved our home! 🙏', 'Don\'t wait — call today!', 'Real help for real families!'],
      showConfetti: true },
    { id: 'b', Char: CharNurse, style: POS.BR,
      bubbleTexts: ['2-1-1 helped my family! 💙', 'Emergency help is one call away!', 'You\'re not alone! ❤️'] },
  ],
  // Journey — Homebuyer on the path + Kids cheering
  '/journey': [
    { id: 'a', Char: CharHomebuyer, style: POS.BL,
      bubbleTexts: ['Every step gets you closer! 🔑', 'The journey starts here! 🏡', 'Six steps — you\'ve got this!'],
      bubbleColor: '#D4AF37', showConfetti: true },
    { id: 'b', Char: CharKidsRunning, style: POS.BR,
      bubbleTexts: ['Our parents bought their home! 🌟', 'Homeownership IS possible!', 'You can do this! 🎉'] },
  ],
  // Events — Musician + Counselor
  '/events': [
    { id: 'a', Char: CharMusician, style: POS.BL,
      bubbleTexts: ['♪ Beyond the Keys — Aug 8! ♪', '♫ Free workshops every month!', '♩ Great music + great info! 🎶'] },
    { id: 'b', Char: CharCounselor, style: POS.BR,
      bubbleTexts: ['I teach at the workshops! 📋', 'Free certified counseling!', 'Register before seats fill!'] },
  ],
  // Contact — Bench sitter + Dog walker
  '/contact': [
    { id: 'a', Char: CharBenchSitter, style: POS.BL,
      bubbleTexts: ['They replied same day! ✉️', 'Friendliest housing team ever!', '2400 Washington Ave! 📍'] },
    { id: 'b', Char: CharDogWalker, style: POS.BR,
      bubbleTexts: ['Walked in, walked out with help! 🐕', 'Mon–Fri 8am–5pm!', 'Super helpful staff! 🐾'] },
  ],
  // Resources — Shipbuilder + Bench sitter reading
  '/resources': [
    { id: 'a', Char: CharShipbuilder, style: POS.BL,
      bubbleTexts: ['SHIP Plan is the real deal! ⚓', 'HII backing Newport News!', 'New housing is coming! 🏗️'] },
    { id: 'b', Char: CharBenchSitter, style: POS.BR,
      bubbleTexts: ['Virginia Housing rates are 🔥 💰', 'I read the SHIP Plan cover to cover!', 'Below-market rates are REAL!'] },
  ],
  // Services — Cyclist + Shipbuilder
  '/services': [
    { id: 'a', Char: CharCyclist, style: POS.BL,
      bubbleTexts: ['Paid my bill in 60 seconds! 💳', 'newportnewsva.gov is fast!', 'Best city portal in Virginia! 👍'] },
    { id: 'b', Char: CharShipbuilder, style: POS.BR,
      bubbleTexts: ['NN-ALERT kept my family safe! 🏙️', 'City services are world class!', 'Proud to live here! 💼'] },
  ],
  // Quiz — Kids running + Family group
  '/quiz': [
    { id: 'a', Char: CharKidsRunning, style: POS.BL,
      bubbleTexts: ['Our family used the quiz! 🌟', 'Found 4 grants we didn\'t know about!', 'Takes 2 minutes, so worth it! 🎉'] },
    { id: 'b', Char: CharFamilyGroup, style: POS.BR,
      bubbleTexts: ['Quiz found our perfect programs! 🏡', 'We matched 3 programs! 🎉', 'Best tool on the whole site!'] },
  ],
  // Why Newport News — Shipbuilder proud + Cyclist
  '/why-newport-news': [
    { id: 'a', Char: CharShipbuilder, style: POS.BL,
      bubbleTexts: ['HII — largest VA employer! ⚓', 'Proud Newport News worker!', 'This city built the fleet! 🚢'] },
    { id: 'b', Char: CharCyclist, style: POS.BR,
      bubbleTexts: ['14 miles of trails! 🚴', 'Noland Trail at sunrise — 🤩', 'Best cycling city in Hampton Roads!'] },
  ],
  // Success Stories — Musician celebrating + Homebuyer
  '/success-stories': [
    { id: 'a', Char: CharMusician, style: POS.BL,
      bubbleTexts: ['♪ Every story matters! ♫', '♩ Your story could be next!', '♫ Newport News sings! 🎶'] },
    { id: 'b', Char: CharHomebuyer, style: POS.BR,
      bubbleTexts: ['I bought at 26! 🔑', 'City grants made the difference!', 'Your turn — it\'s possible! 🏡'],
      bubbleColor: '#D4AF37', showConfetti: true },
  ],
  // Checklist — Nurse + Dog walker
  '/checklist': [
    { id: 'a', Char: CharNurse, style: POS.BL,
      bubbleTexts: ['Financial health = home ready! 💙', 'Save 3–6 months expenses first!', 'Check your credit score today!'] },
    { id: 'b', Char: CharDogWalker, style: POS.BR,
      bubbleTexts: ['Followed every step! 🐕', 'Closed in 90 days! 🐾', 'The checklist really works!'] },
  ],
  // SHIP Plan — Shipbuilder + Counselor on policy
  '/ship': [
    { id: 'a', Char: CharShipbuilder, style: POS.BL,
      bubbleTexts: ['Missing Middle zoning — bold! 🏗️', 'SHIP Plan is a game changer! ⚓', '4 pillars that actually work!'] },
    { id: 'b', Char: CharCounselor, style: POS.BR,
      bubbleTexts: ['Policy that puts families first! 📋', 'This plan will help thousands!', 'Reform → Production → Results!'] },
  ],
  // Partners — Musician + Family group
  '/partners': [
    { id: 'a', Char: CharMusician, style: POS.BL,
      bubbleTexts: ['♪ Community makes it happen! ♫', '♩ Partners in harmony! 🎶', '♫ United Way changed our lives!'] },
    { id: 'b', Char: CharFamilyGroup, style: POS.BR,
      bubbleTexts: ['Partners made it possible! 🤝', 'United Way 2-1-1 saved us!', 'Federal + city = real results! ✅'] },
  ],
};

// ─── Individual scene renderer ────────────────────────────────────────────────

function SceneCard({ scene }: { scene: SceneDef }) {
  return (
    <CharWrapper
      style={scene.style}
      bubbleTexts={scene.bubbleTexts}
      bubbleColor={scene.bubbleColor}
      showConfetti={scene.showConfetti}
    >
      {(hovered, clicked) => <scene.Char hovered={hovered} clicked={clicked} />}
    </CharWrapper>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
// We portal into #city-overlay — a div that lives in index.html as a SIBLING of
// #root, completely outside the React app tree.  Nothing React does (Framer Motion
// transforms, AnimatePresence, etc.) can ever affect elements rendered there.

export function CityStreetLife() {
  const [location] = useLocation();
  const path = location.split('?')[0];

  if (SKIP.has(path)) return null;

  const container = document.getElementById('city-overlay');
  if (!container) return null;

  const scenes = PAGE_SCENES[path] ?? PAGE_SCENES['/'];

  return createPortal(
    <>{scenes.map(scene => <SceneCard key={scene.id} scene={scene} />)}</>,
    container,
  );
}
