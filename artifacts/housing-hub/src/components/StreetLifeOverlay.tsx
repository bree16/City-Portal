/**
 * StreetLifeOverlay — cinematic street-life animations on the homepage hero.
 * Drones, planes, police chases, ambulances — all looping with random timing.
 * Uses Framer Motion keyframes only; no extra dependencies.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── tiny SVG primitives ─────────────────────────────────── */

function DroneBody({ color = '#14B8A6' }: { color?: string }) {
  return (
    <svg width="72" height="44" viewBox="0 0 72 44" fill="none">
      {/* Arms */}
      <line x1="36" y1="22" x2="8"  y2="8"  stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="22" x2="64" y2="8"  stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="22" x2="8"  y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="22" x2="64" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Body */}
      <rect x="24" y="16" width="24" height="12" rx="4" fill={color} />
      <rect x="28" y="19" width="16" height="6" rx="2" fill="rgba(0,0,0,0.3)" />
      {/* Propellers */}
      {[[8,8],[64,8],[8,36],[64,36]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="9" ry="3" fill="rgba(255,255,255,0.35)" />
      ))}
      {/* Camera */}
      <circle cx="36" cy="30" r="3.5" fill="#000" opacity="0.6" />
      <circle cx="36" cy="30" r="2" fill="#1E3A5F" />
    </svg>
  );
}

function DroneRope() {
  return <div style={{ width: 2, background: 'rgba(255,255,255,0.45)', margin: '0 auto' }} />;
}

function InfoCard({ text, sub }: { text: string; sub: string }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#1E3A5F,#0B2146)',
      border: '2px solid #14B8A6',
      borderRadius: 10, padding: '8px 14px', minWidth: 160,
      boxShadow: '0 8px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(20,184,166,0.3)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#14B8A6', letterSpacing: '0.05em' }}>{text}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{sub}</div>
    </div>
  );
}

function PoliceCar({ flipped = false }: { flipped?: boolean }) {
  const scaleX = flipped ? -1 : 1;
  return (
    <svg width="64" height="32" viewBox="0 0 64 32" fill="none" style={{ transform: `scaleX(${scaleX})` }}>
      {/* Body */}
      <rect x="4" y="14" width="56" height="14" rx="4" fill="#1a1aff" />
      <rect x="12" y="7" width="34" height="10" rx="4" fill="#2222ff" />
      {/* Windows */}
      <rect x="15" y="9" width="12" height="7" rx="2" fill="#b3e5fc" opacity="0.8" />
      <rect x="30" y="9" width="12" height="7" rx="2" fill="#b3e5fc" opacity="0.8" />
      {/* Wheels */}
      <circle cx="16" cy="28" r="5" fill="#111" /><circle cx="16" cy="28" r="3" fill="#333" />
      <circle cx="48" cy="28" r="5" fill="#111" /><circle cx="48" cy="28" r="3" fill="#333" />
      {/* Light bar */}
      <rect x="18" y="5" width="28" height="4" rx="2" fill="#ccc" />
      <rect x="20" y="5.5" width="8" height="3" rx="1" fill="#f00" />
      <rect x="36" y="5.5" width="8" height="3" rx="1" fill="#00f" />
      {/* Door stripe */}
      <rect x="4" y="17" width="56" height="3" fill="white" opacity="0.25" />
      <text x="28" y="24" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">POLICE</text>
    </svg>
  );
}

function ChaseCar({ flipped = false }: { flipped?: boolean }) {
  const scaleX = flipped ? -1 : 1;
  return (
    <svg width="58" height="28" viewBox="0 0 58 28" fill="none" style={{ transform: `scaleX(${scaleX})` }}>
      <rect x="4" y="12" width="50" height="13" rx="4" fill="#c0392b" />
      <rect x="10" y="5" width="32" height="10" rx="4" fill="#e74c3c" />
      <rect x="13" y="7" width="11" height="7" rx="2" fill="#b3e5fc" opacity="0.7" />
      <rect x="27" y="7" width="11" height="7" rx="2" fill="#b3e5fc" opacity="0.7" />
      <circle cx="14" cy="25" r="4" fill="#111" /><circle cx="14" cy="25" r="2.5" fill="#333" />
      <circle cx="44" cy="25" r="4" fill="#111" /><circle cx="44" cy="25" r="2.5" fill="#333" />
    </svg>
  );
}

function Ambulance({ flipped = false }: { flipped?: boolean }) {
  const scaleX = flipped ? -1 : 1;
  return (
    <svg width="72" height="34" viewBox="0 0 72 34" fill="none" style={{ transform: `scaleX(${scaleX})` }}>
      <rect x="2" y="10" width="68" height="20" rx="4" fill="white" />
      <rect x="2" y="10" width="22" height="20" rx="4" fill="#e0e0e0" />
      {/* Cab window */}
      <rect x="5" y="13" width="16" height="10" rx="2" fill="#b3e5fc" opacity="0.8" />
      {/* Red cross */}
      <rect x="36" y="13" width="22" height="14" rx="2" fill="white" stroke="#c0392b" strokeWidth="1" />
      <rect x="44" y="14" width="6" height="12" rx="1" fill="#c0392b" />
      <rect x="38" y="18" width="18" height="4" rx="1" fill="#c0392b" />
      {/* Wheels */}
      <circle cx="16" cy="30" r="5" fill="#111" /><circle cx="16" cy="30" r="3" fill="#333" />
      <circle cx="55" cy="30" r="5" fill="#111" /><circle cx="55" cy="30" r="3" fill="#333" />
      {/* Light bar */}
      <rect x="2" y="7" width="68" height="5" rx="2" fill="#ddd" />
      <rect x="4"  y="8" width="10" height="3" rx="1" fill="red" />
      <rect x="58" y="8" width="10" height="3" rx="1" fill="red" />
    </svg>
  );
}

function Plane() {
  return (
    <svg width="110" height="44" viewBox="0 0 110 44" fill="none">
      {/* Fuselage */}
      <ellipse cx="55" cy="22" rx="48" ry="9" fill="#ecf0f1" />
      <ellipse cx="22" cy="22" rx="20" ry="9" fill="#bdc3c7" />
      {/* Nose */}
      <path d="M100 22 Q110 22 108 18 Q104 22 108 26 Q110 22 100 22Z" fill="#95a5a6" />
      {/* Wing */}
      <path d="M50 22 L30 6 L24 6 L42 22 L24 38 L30 38 Z" fill="#95a5a6" />
      {/* Tail fins */}
      <path d="M10 22 L4 10 L8 12 L14 22Z" fill="#7f8c8d" />
      <path d="M10 22 L4 34 L8 32 L14 22Z" fill="#7f8c8d" />
      {/* Windows */}
      {[60,70,80,88].map((x) => (
        <ellipse key={x} cx={x} cy="19" rx="3.5" ry="3" fill="#3498db" opacity="0.7" />
      ))}
      {/* Engines */}
      <rect x="44" y="28" width="20" height="6" rx="3" fill="#7f8c8d" />
      <rect x="28" y="28" width="14" height="5" rx="2.5" fill="#95a5a6" />
    </svg>
  );
}

function BannerFlag({ text }: { text: string }) {
  return (
    <svg width="180" height="38" viewBox="0 0 180 38">
      {/* Rope */}
      <line x1="0" y1="6" x2="16" y2="6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Banner */}
      <rect x="16" y="0" width="164" height="30" rx="3" fill="#D4AF37" />
      <rect x="16" y="0" width="164" height="30" rx="3" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      {/* Fringe */}
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={16 + i * 15} y="30" width="8" height="8" rx="1" fill="#D4AF37" />
      ))}
      <text x="98" y="19" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0F172A" fontFamily="Inter,sans-serif">
        {text}
      </text>
    </svg>
  );
}

function FlashingLights({ active }: { active: boolean }) {
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setToggle((v) => !v), 200);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: toggle ? 'red' : 'rgba(255,0,0,0.15)', boxShadow: toggle ? '0 0 8px red' : 'none', transition: 'all 0.1s' }} />
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: !toggle ? '#00f' : 'rgba(0,0,255,0.15)', boxShadow: !toggle ? '0 0 8px #00f' : 'none', transition: 'all 0.1s' }} />
    </div>
  );
}

function SpeedLines({ count = 6, color = 'rgba(255,255,255,0.18)' }: { count?: number; color?: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 18 + i * 6, height: 2,
          background: color,
          top: `${30 + i * 10}%`,
          right: '100%',
          transform: `translateX(-${i * 4}px)`,
          borderRadius: 1,
        }} />
      ))}
    </>
  );
}

/* ─── Drone drop animation ───────────────────────────────── */

function DroneScene({
  startDelay, fromLeft, infoText, infoSub, yPos,
}: { startDelay: number; fromLeft: boolean; infoText: string; infoSub: string; yPos: number }) {
  const startX  = fromLeft ? '-160px' : 'calc(100vw + 80px)';
  const endX    = fromLeft ? 'calc(100vw + 80px)' : '-160px';
  const midX    = 'calc(50% - 36px)';
  const propAnim = { rotate: [0, 360] };
  const [dropped, setDropped] = useState(false);

  return (
    <motion.div
      style={{ position: 'absolute', top: yPos, left: 0, right: 0, pointerEvents: 'none', zIndex: 30 }}
      initial={{ x: startX, opacity: 0 }}
      animate={{
        x: [startX, midX, midX, endX],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        times: [0, 0.35, 0.65, 1],
        duration: 9,
        delay: startDelay,
        repeat: Infinity,
        repeatDelay: 22,
        ease: ['easeOut', 'linear', 'easeIn'],
      }}
      onAnimationIteration={() => setDropped(false)}
    >
      {/* Propellers spin overlay */}
      <div style={{ position: 'relative', width: 72 }}>
        <motion.div
          animate={propAnim}
          transition={{ duration: 0.18, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, opacity: 0.55 }}
        />
        <DroneBody color={fromLeft ? '#14B8A6' : '#D4AF37'} />
      </div>

      {/* Rope + card drop */}
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, 0, 44, 44, 0], opacity: [0, 1, 1, 1, 0] }}
        transition={{
          times: [0, 0.28, 0.42, 0.62, 0.75],
          duration: 9,
          delay: startDelay,
          repeat: Infinity,
          repeatDelay: 22,
        }}
        onUpdate={(latest) => {
          if ((latest.y as number) > 30 && !dropped) setDropped(true);
        }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <DroneRope />
        <div style={{ height: 28, width: 2, background: 'rgba(255,255,255,0.4)', margin: '0 auto' }} />
        <AnimatePresence>
          {dropped && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <InfoCard text={infoText} sub={infoSub} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─── Plane banner ───────────────────────────────────────── */

function PlaneScene({ startDelay, bannerText }: { startDelay: number; bannerText: string }) {
  return (
    <motion.div
      style={{
        position: 'absolute', top: 22, left: 0, right: 0,
        pointerEvents: 'none', zIndex: 22,
        display: 'flex', alignItems: 'center',
      }}
      initial={{ x: 'calc(100vw + 320px)', opacity: 0 }}
      animate={{
        x: [' calc(100vw + 320px)', '-400px'],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        times: [0, 0.05, 0.92, 1],
        duration: 14,
        delay: startDelay,
        repeat: Infinity,
        repeatDelay: 30,
        ease: 'linear',
      }}
    >
      <Plane />
      {/* Banner on a string trailing behind */}
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ marginLeft: 4 }}
      >
        <BannerFlag text={bannerText} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Police chase ───────────────────────────────────────── */

function PoliceChaseScene({ startDelay, fromLeft }: { startDelay: number; fromLeft: boolean }) {
  const dir = fromLeft ? 1 : -1;
  const startX = fromLeft ? 'calc(-200px)' : 'calc(100vw + 200px)';
  const endX   = fromLeft ? 'calc(100vw + 200px)' : '-200px';
  const chasedOffset = fromLeft ? -75 : 75;

  return (
    <>
      {/* Chased car */}
      <motion.div
        style={{ position: 'absolute', bottom: 8, left: 0, right: 0, pointerEvents: 'none', zIndex: 25, display: 'flex', alignItems: 'flex-end' }}
        initial={{ x: startX, opacity: 0 }}
        animate={{ x: [startX, endX], opacity: [0, 1, 1, 0] }}
        transition={{
          times: [0, 0.08, 0.88, 1],
          duration: 5.5,
          delay: startDelay,
          repeat: Infinity,
          repeatDelay: 25,
          ease: 'linear',
        }}
      >
        <div style={{ position: 'relative' }}>
          <SpeedLines color={fromLeft ? 'rgba(255,255,255,0.2)' : undefined} count={5} />
          <ChaseCar flipped={!fromLeft} />
          {/* Dust puff */}
          <motion.div
            animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{
              position: 'absolute',
              bottom: 0,
              [fromLeft ? 'left' : 'right']: -12,
              width: 22, height: 14,
              borderRadius: '50%',
              background: 'rgba(200,200,200,0.4)',
            }}
          />
        </div>
      </motion.div>

      {/* Police car, slightly behind */}
      <motion.div
        style={{ position: 'absolute', bottom: 4, left: chasedOffset, right: 0, pointerEvents: 'none', zIndex: 24 }}
        initial={{ x: startX, opacity: 0 }}
        animate={{ x: [startX, endX], opacity: [0, 1, 1, 0] }}
        transition={{
          times: [0, 0.08, 0.88, 1],
          duration: 5.5,
          delay: startDelay + 0.4,
          repeat: Infinity,
          repeatDelay: 25,
          ease: 'linear',
        }}
      >
        <div style={{ position: 'relative' }}>
          <FlashingLights active />
          <PoliceCar flipped={!fromLeft} />
        </div>
      </motion.div>
    </>
  );
}

/* ─── Ambulance ──────────────────────────────────────────── */

function AmbulanceScene({ startDelay, fromLeft }: { startDelay: number; fromLeft: boolean }) {
  const startX = fromLeft ? '-200px' : 'calc(100vw + 200px)';
  const endX   = fromLeft ? 'calc(100vw + 200px)' : '-200px';

  return (
    <motion.div
      style={{ position: 'absolute', bottom: 6, left: 0, right: 0, pointerEvents: 'none', zIndex: 26 }}
      initial={{ x: startX, opacity: 0 }}
      animate={{ x: [startX, endX], opacity: [0, 1, 1, 0] }}
      transition={{
        times: [0, 0.06, 0.9, 1],
        duration: 7,
        delay: startDelay,
        repeat: Infinity,
        repeatDelay: 34,
        ease: 'linear',
      }}
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative' }}
      >
        <FlashingLights active />
        <Ambulance flipped={!fromLeft} />
        {/* Siren wave */}
        <motion.div
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: 0,
            [fromLeft ? 'right' : 'left']: -6,
            width: 20, height: 20,
            borderRadius: '50%',
            background: 'rgba(255,0,0,0.35)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Exported overlay ───────────────────────────────────── */

export function StreetLifeOverlay() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        pointerEvents: 'none', zIndex: 20,
      }}
    >
      {/* Drone 1 — teal, left→right, drops "340+ Affordable Units" card */}
      <DroneScene
        startDelay={1.5}
        fromLeft
        yPos={40}
        infoText="340+ Affordable Units"
        infoSub="Available in Newport News"
      />

      {/* Drone 2 — gold, right→left, drops "SHIP counselors" card */}
      <DroneScene
        startDelay={14}
        fromLeft={false}
        yPos={28}
        infoText="Free SHIP Counselors"
        infoSub="Call (757) 247-8513"
      />

      {/* Plane with banner — right to left */}
      <PlaneScene startDelay={4} bannerText="Find Your Path Home — Newport News" />

      {/* Police chase — left to right */}
      <PoliceChaseScene startDelay={8} fromLeft />

      {/* Police chase — right to left (different timing) */}
      <PoliceChaseScene startDelay={34} fromLeft={false} />

      {/* Ambulance — left to right */}
      <AmbulanceScene startDelay={18} fromLeft />

      {/* Ambulance — right to left */}
      <AmbulanceScene startDelay={46} fromLeft={false} />
    </div>
  );
}
