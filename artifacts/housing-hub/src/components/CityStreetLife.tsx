/**
 * CityStreetLife — living city-life character animation overlay.
 * Scenes: crossing guard + kids, bus stop crowd, cyclists, block party BBQ,
 * homebuyers with keys, nurse, shipbuilder, Zillow browser, dog walker,
 * street musician, drive-thru worker, shoppers, ambulance, police chase.
 * All animated SVG silhouettes. Fixed overlay, pointer-events: none.
 */
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

const SKIP = new Set(['/simulator', '/sign-in', '/sign-up']);

// ─── Tiny SVG character primitives ───────────────────────────────────────────

function Head({ x, y, r = 9, fill = '#FDBCB4' }: { x: number; y: number; r?: number; fill?: string }) {
  return <circle cx={x} cy={y} r={r} fill={fill} />;
}

function Body({ x, y, w = 14, h = 20, fill = '#1E3A5F' }: { x: number; y: number; w?: number; h?: number; fill?: string }) {
  return <rect x={x - w / 2} y={y} width={w} height={h} rx={4} fill={fill} />;
}

/** Walking leg pair — uses rotation on <g> so Framer Motion never touches SVG coords */
function WalkLegs({ x, y, color = '#1A3A6B', delay = 0 }: { x: number; y: number; color?: string; delay?: number }) {
  return (
    <>
      <motion.g
        animate={{ rotate: [-30, 30, -30] }}
        style={{ transformOrigin: `${x - 4}px ${y}px` }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay }}>
        <line x1={x - 4} y1={y} x2={x - 5} y2={y + 15} stroke={color} strokeWidth={3} strokeLinecap="round" />
      </motion.g>
      <motion.g
        animate={{ rotate: [30, -30, 30] }}
        style={{ transformOrigin: `${x + 4}px ${y}px` }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay }}>
        <line x1={x + 4} y1={y} x2={x + 5} y2={y + 15} stroke={color} strokeWidth={3} strokeLinecap="round" />
      </motion.g>
    </>
  );
}

/** Swinging arm pair — same rotation approach */
function SwingArms({ x, y, shirtColor = '#14B8A6', delay = 0 }: { x: number; y: number; shirtColor?: string; delay?: number }) {
  return (
    <>
      <motion.g
        animate={{ rotate: [30, -30, 30] }}
        style={{ transformOrigin: `${x - 5}px ${y + 4}px` }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay }}>
        <line x1={x - 5} y1={y + 4} x2={x - 10} y2={y + 14} stroke={shirtColor} strokeWidth={3} strokeLinecap="round" />
      </motion.g>
      <motion.g
        animate={{ rotate: [-30, 30, -30] }}
        style={{ transformOrigin: `${x + 5}px ${y + 4}px` }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay }}>
        <line x1={x + 5} y1={y + 4} x2={x + 10} y2={y + 14} stroke={shirtColor} strokeWidth={3} strokeLinecap="round" />
      </motion.g>
    </>
  );
}

/** Generic walking person SVG person (origin at foot-level center = cx, cy) */
function WalkingPerson({ cx, cy, skinTone = '#FDBCB4', shirt = '#14B8A6', pants = '#1A3A6B', delay = 0, scale = 1 }:
  { cx: number; cy: number; skinTone?: string; shirt?: string; pants?: string; delay?: number; scale?: number }) {
  const h = 50 * scale;
  const headY = cy - h;
  const bodyY = headY + 10 * scale;
  const legsY = bodyY + 20 * scale;
  return (
    <g>
      <Head x={cx} y={headY} r={8 * scale} fill={skinTone} />
      <Body x={cx} y={bodyY} w={14 * scale} h={20 * scale} fill={shirt} />
      <WalkLegs x={cx} y={legsY} color={pants} delay={delay} />
      <SwingArms x={cx} y={bodyY} shirtColor={shirt} delay={delay} />
    </g>
  );
}

// ─── Scene 1: Crossing Guard + Children ──────────────────────────────────────

function CrossingGuardScene() {
  const [active, setActive] = useState(false);
  const [kidX, setKidX] = useState(-40);

  useEffect(() => {
    const start = setTimeout(() => {
      setActive(true);
      setKidX(-40);
      const move = setInterval(() => setKidX(x => x + 3), 40);
      setTimeout(() => { clearInterval(move); setActive(false); setKidX(-40); }, 4500);
    }, 6000);
    const repeat = setInterval(() => {
      setActive(true); setKidX(-40);
      const move = setInterval(() => setKidX(x => x + 3), 40);
      setTimeout(() => { clearInterval(move); setActive(false); setKidX(-40); }, 4500);
    }, 38000);
    return () => { clearTimeout(start); clearInterval(repeat); };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', bottom: 38, left: '30%', zIndex: 9970, pointerEvents: 'none' }}>
          <svg width="320" height="80" viewBox="0 0 320 80">
            {/* Guard — orange vest, stop sign */}
            <Head x={30} y={20} fill="#C68642" />
            <Body x={30} y={30} fill="#FF6B00" />
            <WalkLegs x={30} y={50} color="#1A3A6B" />
            {/* Stop sign on pole */}
            <rect x={38} y={8} width={2} height={32} fill="#888" />
            <polygon points="49,8 58,5 64,10 64,19 58,24 49,21 43,16" fill="#CC0000" stroke="#fff" strokeWidth="1.5" />
            <text x="53" y="17" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="900" fontFamily="sans-serif">STOP</text>
            {/* Crosswalk stripes */}
            {[60, 90, 120, 150, 180, 210, 240].map(x => (
              <rect key={x} x={x} y={68} width={18} height={8} rx={1} fill="rgba(255,255,255,0.55)" />
            ))}
            {/* Kids walking */}
            {[0, 1, 2, 3].map(i => (
              <g key={i} transform={`translate(${kidX + i * 32}, 0)`}>
                <Head x={0} y={32} r={7} fill={['#FDBCB4','#C68642','#F5D5B0','#8D5524'][i]} />
                <Body x={0} y={39} w={11} h={15} fill={['#FF6B9D','#60A5FA','#34D399','#FB923C'][i]} />
                <WalkLegs x={0} y={54} color={['#7C3AED','#1A3A6B','#065F46','#92400E'][i]} delay={i * 0.12} />
                {/* Backpack */}
                <rect x={4} y={40} width={7} height={10} rx={2} fill={['#D4AF37','#FF6B9D','#14B8A6','#F87171'][i]} opacity={0.8} />
              </g>
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scene 2: Bus Stop with Waiting Crowd ────────────────────────────────────

function BusStopScene() {
  const [busX, setBusX] = useState(1400);
  const [busPhase, setBusPhase] = useState<'away'|'arriving'|'stopped'|'leaving'>('away');

  useEffect(() => {
    const run = () => {
      setBusPhase('arriving'); setBusX(1400);
      const arrive = setInterval(() => setBusX(x => { if (x <= 520) { clearInterval(arrive); setBusPhase('stopped'); setTimeout(() => { setBusPhase('leaving'); const go = setInterval(() => setBusX(x2 => { if (x2 < -300) { clearInterval(go); setBusPhase('away'); } return x2 - 6; }), 30); }, 3500); return x; } return x - 8; }), 30);
    };
    const t1 = setTimeout(run, 3000);
    const repeat = setInterval(run, 42000);
    return () => { clearTimeout(t1); clearInterval(repeat); };
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 38, left: '55%', zIndex: 9968, pointerEvents: 'none' }}>
      <svg width="350" height="90" viewBox="0 0 350 90">
        {/* Bus stop sign pole */}
        <rect x={10} y={10} width={3} height={68} fill="#666" />
        <rect x={0} y={10} width={24} height={20} rx={4} fill="#0F3F6A" />
        <text x={12} y={23} textAnchor="middle" fontSize="6" fill="#FFD700" fontWeight="900" fontFamily="sans-serif">BUS STOP</text>

        {/* Waiting people — 4 of them */}
        {/* Person 1: on phone */}
        <Head x={40} y={36} fill="#FDBCB4" />
        <Body x={40} y={46} fill="#7C3AED" />
        <line x1={40} y1={50} x2={44} y2={43} stroke="#FDBCB4" strokeWidth={2.5} strokeLinecap="round" />
        <rect x={44} y={40} width={5} height={7} rx={1} fill="#111" />
        <line x1={40} y1={66} x2={36} y2={80} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        <line x1={40} y1={66} x2={44} y2={80} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        {/* Person 2: reading paper */}
        <Head x={70} y={34} fill="#C68642" />
        <Body x={70} y={44} fill="#F87171" />
        <line x1={65} y1={50} x2={60} y2={58} stroke="#F87171" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={75} y1={50} x2={80} y2={58} stroke="#F87171" strokeWidth={2.5} strokeLinecap="round" />
        <rect x={58} y={52} width={24} height={16} rx={2} fill="#fff" opacity={0.85} />
        <line x1={61} y1={57} x2={79} y2={57} stroke="#ccc" strokeWidth={1} />
        <line x1={61} y1={61} x2={79} y2={61} stroke="#ccc" strokeWidth={1} />
        <line x1={70} y1={66} x2={68} y2={80} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        <line x1={70} y1={66} x2={72} y2={80} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        {/* Person 3: with child */}
        <Head x={102} y={34} fill="#F5D5B0" />
        <Body x={102} y={44} fill="#14B8A6" />
        <Head x={118} y={50} r={6} fill="#FDBCB4" />
        <Body x={118} y={56} w={10} h={12} fill="#FF6B9D" />
        <motion.g animate={{ rotate: [-20, 20, -20] }} style={{ transformOrigin: '107px 50px' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <line x1={107} y1={50} x2={112} y2={58} stroke="#14B8A6" strokeWidth={2.5} strokeLinecap="round" />
        </motion.g>
        <line x1={102} y1={66} x2={100} y2={80} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        <line x1={102} y1={66} x2={104} y2={80} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        {/* Person 4: headphones + coffee */}
        <Head x={140} y={34} fill="#8D5524" />
        {/* Headphones arc */}
        <path d="M133 34 Q140 26 147 34" stroke="#333" strokeWidth={2} fill="none" strokeLinecap="round" />
        <circle cx={133} cy={34} r={3} fill="#333" />
        <circle cx={147} cy={34} r={3} fill="#333" />
        <Body x={140} y={44} fill="#1E3A5F" />
        <line x1={135} y1={50} x2={128} y2={60} stroke="#1E3A5F" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={126} cy={62} r={4} fill="#8B4513" />
        <line x1={140} y1={66} x2={138} y2={80} stroke="#111" strokeWidth={3} strokeLinecap="round" />
        <line x1={140} y1={66} x2={142} y2={80} stroke="#111" strokeWidth={3} strokeLinecap="round" />

        {/* Bench */}
        <rect x={28} y={75} width={130} height={5} rx={2} fill="#8B6914" />
        <rect x={35} y={70} width={4} height={10} rx={1} fill="#6B4C11" />
        <rect x={150} y={70} width={4} height={10} rx={1} fill="#6B4C11" />

        {/* Animated bus */}
        <g transform={`translate(${busX - 500}, 20)`}>
          <rect x={0} y={0} width={180} height={52} rx={8} fill="#0F3F6A" />
          <rect x={0} y={0} width={180} height={12} rx={8} fill="#14517A" />
          {[10,44,78,112,146].map(x => <rect key={x} x={x} y={5} width={26} height={20} rx={4} fill="#B3E5FC" opacity={0.8} />)}
          <rect x={6} y={32} width={130} height={14} rx={3} fill="#000e00" />
          <text x="71" y="42" textAnchor="middle" fontSize="9" fill="#00ff44" fontFamily="monospace" fontWeight="bold">NEWPORT NEWS</text>
          <rect x={138} y={32} width={36} height={14} rx={3} fill="#D4AF37" />
          <text x="156" y="42" textAnchor="middle" fontSize="6" fill="#0B2146" fontWeight="900" fontFamily="sans-serif">ROUTE 5</text>
          {[30, 150].map(cx => <g key={cx}>
            <circle cx={cx} cy={54} r={10} fill="#111" />
            <circle cx={cx} cy={54} r={6} fill="#222" />
            <circle cx={cx} cy={54} r={2.5} fill="#444" />
          </g>)}
          {/* Door open when stopped */}
          {busPhase === 'stopped' && <rect x={152} y={10} width={26} height={30} rx={3} fill="#87CEEB" opacity={0.65} />}
        </g>
      </svg>
    </div>
  );
}

// ─── Scene 3: Bicyclists ──────────────────────────────────────────────────────

function BicyclistScene({ delay = 0, fromRight = false, y = 38, shirt = '#34D399', skin = '#FDBCB4' }:
  { delay?: number; fromRight?: boolean; y?: number; shirt?: string; skin?: string }) {
  return (
    <motion.div
      style={{ position: 'fixed', bottom: y, [fromRight ? 'right' : 'left']: 0, zIndex: 9966, pointerEvents: 'none' }}
      initial={{ x: fromRight ? -280 : '110vw' }}
      animate={{ x: fromRight ? '110vw' : -280 }}
      transition={{ duration: 10, delay, repeat: Infinity, repeatDelay: 32, ease: 'linear' }}
    >
      <svg width="100" height="68" viewBox="0 0 100 68" fill="none">
        {/* Bike frame */}
        <circle cx={28} cy={52} r={16} stroke="#555" strokeWidth={3} fill="none" />
        <circle cx={72} cy={52} r={16} stroke="#555" strokeWidth={3} fill="none" />
        {/* Frame */}
        <line x1={28} y1={52} x2={50} y2={28} stroke="#666" strokeWidth={3} strokeLinecap="round" />
        <line x1={50} y1={28} x2={72} y2={52} stroke="#666" strokeWidth={3} strokeLinecap="round" />
        <line x1={50} y1={28} x2={28} y2={52} stroke="#666" strokeWidth={2} strokeLinecap="round" />
        {/* Handlebars */}
        <line x1={50} y1={28} x2={60} y2={22} stroke="#555" strokeWidth={3} strokeLinecap="round" />
        <line x1={60} y1={22} x2={64} y2={20} stroke="#555" strokeWidth={3} strokeLinecap="round" />
        <line x1={60} y1={22} x2={64} y2={24} stroke="#555" strokeWidth={3} strokeLinecap="round" />
        {/* Seat */}
        <line x1={50} y1={28} x2={44} y2={26} stroke="#555" strokeWidth={3} strokeLinecap="round" />
        <rect x={38} y={23} width={12} height={4} rx={2} fill="#333" />
        {/* Pedals spinning */}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 44px' }}>
          <line x1={44} y1={44} x2={56} y2={44} stroke="#888" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={44} cy={44} r={3} fill="#999" />
          <circle cx={56} cy={44} r={3} fill="#999" />
        </motion.g>
        {/* Rider */}
        <circle cx={56} cy={16} r={8} fill={skin} />
        {/* Helmet */}
        <path d="M49 14 Q56 6 63 14 Q63 16 56 17 Q49 16 49 14Z" fill="#D4AF37" />
        <rect x={50} y={22} width={14} height={14} rx={4} fill={shirt} />
        {/* Arms on bars */}
        <line x1={56} y1={25} x2={63} y2={22} stroke={shirt} strokeWidth={2.5} strokeLinecap="round" />
        {/* Legs — animated pedaling */}
        <motion.g animate={{ rotate: [35, -35, 35] }} style={{ transformOrigin: '52px 34px' }}
          transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}>
          <line x1={52} y1={34} x2={44} y2={44} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        </motion.g>
        <motion.g animate={{ rotate: [-35, 35, -35] }} style={{ transformOrigin: '58px 34px' }}
          transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}>
          <line x1={58} y1={34} x2={56} y2={44} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
        </motion.g>
        {/* Wheels spinning spokes */}
        <motion.line x1={28} y1={36} x2={28} y2={68} stroke="#777" strokeWidth={1.5}
          animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '28px 52px' }} />
        <motion.line x1={12} y1={52} x2={44} y2={52} stroke="#777" strokeWidth={1.5}
          animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '28px 52px' }} />
      </svg>
    </motion.div>
  );
}

// ─── Scene 4: Block Party / BBQ ──────────────────────────────────────────────

function BlockPartyScene() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10000);
    const hide = setInterval(() => { setVisible(v => !v); }, 35000);
    return () => { clearTimeout(t); clearInterval(hide); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'fixed', bottom: 38, left: '5%', zIndex: 9965, pointerEvents: 'none' }}>
          <svg width="280" height="110" viewBox="0 0 280 110">
            {/* BBQ grill */}
            <ellipse cx={40} cy={60} rx={22} ry={10} fill="#333" />
            <rect x={26} y={55} width={28} height={5} rx={2} fill="#555" />
            <rect x={32} y={60} width={4} height={24} rx={2} fill="#444" />
            <rect x={44} y={60} width={4} height={24} rx={2} fill="#444" />
            {/* Grill grates */}
            {[28,34,40,46,52].map(x => <line key={x} x1={x} y1={55} x2={x} y2={60} stroke="#888" strokeWidth={1.5} />)}
            {/* Smoke puffs */}
            {[0,1,2].map(i => (
              <motion.circle key={i} cx={40 + (i - 1) * 6} cy={40} r={6}
                fill="rgba(180,180,180,0.45)"
                animate={{ y: [-5,-18,-5], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: i * 0.5 }} />
            ))}
            {/* Food on grill */}
            <rect x={30} y={52} width={8} height={3} rx={1} fill="#8B4513" />
            <rect x={42} y={52} width={8} height={3} rx={1} fill="#CC5500" />

            {/* Dancer 1 — waving */}
            <Head x={90} y={28} fill="#FDBCB4" />
            <Body x={90} y={38} fill="#FF6B9D" />
            <motion.g animate={{ rotate: [25, -25, 25] }} style={{ transformOrigin: '85px 44px' }}
              transition={{ duration: 0.8, repeat: Infinity }}>
              <line x1={85} y1={44} x2={75} y2={36} stroke="#FF6B9D" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            <motion.g animate={{ rotate: [-25, 25, -25] }} style={{ transformOrigin: '95px 44px' }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}>
              <line x1={95} y1={44} x2={105} y2={36} stroke="#FF6B9D" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            <line x1={90} y1={58} x2={86} y2={74} stroke="#7C3AED" strokeWidth={3} strokeLinecap="round" />
            <line x1={90} y1={58} x2={94} y2={74} stroke="#7C3AED" strokeWidth={3} strokeLinecap="round" />

            {/* Dancer 2 — grooving */}
            <Head x={130} y={30} fill="#8D5524" />
            <Body x={130} y={40} fill="#14B8A6" />
            <motion.rect x={118} y={38} width={8} height={3} rx={1} fill="#D4AF37"
              animate={{ rotate: [-15, 15, -15] }} style={{ transformOrigin: '122px 40px' }}
              transition={{ duration: 0.6, repeat: Infinity }} />
            <motion.g animate={{ rotate: [30, -30, 30] }} style={{ transformOrigin: '125px 44px' }}
              transition={{ duration: 0.5, repeat: Infinity }}>
              <line x1={125} y1={44} x2={116} y2={52} stroke="#14B8A6" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            <motion.g animate={{ rotate: [-30, 30, -30] }} style={{ transformOrigin: '135px 44px' }}
              transition={{ duration: 0.5, repeat: Infinity }}>
              <line x1={135} y1={44} x2={144} y2={52} stroke="#14B8A6" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            <motion.g animate={{ rotate: [-20, 20, -20] }} style={{ transformOrigin: '130px 58px' }}
              transition={{ duration: 0.5, repeat: Infinity }}>
              <line x1={130} y1={58} x2={124} y2={72} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            <line x1={130} y1={58} x2={136} y2={72} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />

            {/* Dancer 3 — holding cup, swaying */}
            <Head x={170} y={28} fill="#F5D5B0" />
            <Body x={170} y={38} fill="#FB923C" />
            <motion.g animate={{ rotate: [-8, 8, -8] }} style={{ transformOrigin: '170px 48px' }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
              <line x1={175} y1={44} x2={184} y2={40} stroke="#FB923C" strokeWidth={3} strokeLinecap="round" />
              <rect x={183} y={36} width={6} height={8} rx={2} fill="#D4AF37" />
            </motion.g>
            <line x1={165} y1={44} x2={156} y2={52} stroke="#FB923C" strokeWidth={3} strokeLinecap="round" />
            <line x1={170} y1={58} x2={167} y2={72} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <motion.g animate={{ rotate: [-18, 18, -18] }} style={{ transformOrigin: '170px 58px' }}
              transition={{ duration: 0.6, repeat: Infinity }}>
              <line x1={170} y1={58} x2={174} y2={72} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            </motion.g>

            {/* Waving homebuyer 4 */}
            <Head x={220} y={26} fill="#C68642" />
            <Body x={220} y={36} fill="#34D399" />
            <motion.line x1={225} y1={40} x2={236} y2={30} stroke="#34D399" strokeWidth={3} strokeLinecap="round"
              animate={{ rotate: [-20, 20, -20] }} style={{ transformOrigin: '225px 40px' }}
              transition={{ duration: 0.5, repeat: Infinity }} />
            <line x1={215} y1={40} x2={206} y2={50} stroke="#34D399" strokeWidth={3} strokeLinecap="round" />
            <line x1={220} y1={56} x2={217} y2={70} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <line x1={220} y1={56} x2={223} y2={70} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />

            {/* Music notes floating */}
            {[0,1,2].map(i => (
              <motion.text key={i} x={155 + i * 18} y={20} fontSize="14" fill="#D4AF37"
                animate={{ y: [20, 6, 20], opacity: [0.9, 0.2, 0.9] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}>♪</motion.text>
            ))}

            {/* Ground shadow */}
            <ellipse cx={140} cy={105} rx={120} ry={5} fill="rgba(0,0,0,0.12)" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scene 5: Homebuyer with keys ────────────────────────────────────────────

function HomebuyerScene() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 14000);
    const cycle = setInterval(() => setVisible(v => !v), 30000);
    return () => { clearTimeout(t); clearInterval(cycle); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ position: 'fixed', bottom: 38, right: '8%', zIndex: 9975, pointerEvents: 'none' }}>
          <svg width="180" height="130" viewBox="0 0 180 130">
            {/* Little house */}
            <polygon points="90,10 140,40 140,110 40,110 40,40" fill="#D4AF37" />
            <polygon points="90,10 150,45 30,45" fill="#14B8A6" />
            <rect x={72} y={75} width={36} height={35} rx={3} fill="#8B4513" />
            {/* Windows */}
            <rect x={48} y={55} width={22} height={22} rx={3} fill="#87CEEB" opacity={0.8} />
            <rect x={108} y={55} width={22} height={22} rx={3} fill="#87CEEB" opacity={0.8} />
            <line x1={59} y1={55} x2={59} y2={77} stroke="#ccc" strokeWidth={1.5} />
            <line x1={48} y1={66} x2={70} y2={66} stroke="#ccc" strokeWidth={1.5} />
            {/* SOLD sign */}
            <rect x={115} y={85} width={35} height={20} rx={3} fill="#CC0000" />
            <text x="132" y="98" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="900" fontFamily="sans-serif">SOLD!</text>
            <rect x={130} y={105} width={3} height={20} fill="#888" />

            {/* Person */}
            <Head x={30} y={72} fill="#F5D5B0" />
            <Body x={30} y={82} fill="#1E3A5F" />
            {/* Waving arm with keys */}
            <motion.g animate={{ rotate: [-25, 15, -25] }} style={{ transformOrigin: '34px 85px' }}
              transition={{ duration: 0.6, repeat: Infinity }}>
              <line x1={34} y1={85} x2={48} y2={74} stroke="#1E3A5F" strokeWidth={3} strokeLinecap="round" />
              {/* Keys */}
              <circle cx={52} cy={71} r={4} fill="#D4AF37" stroke="#B8960C" strokeWidth={1} />
              <circle cx={52} cy={71} r={2} fill="none" stroke="#B8960C" strokeWidth={1} />
              <rect x={54} y={72} width={6} height={2} rx={1} fill="#D4AF37" />
              <rect x={54} y={68} width={6} height={2} rx={1} fill="#D4AF37" />
            </motion.g>
            <line x1={26} y1={85} x2={18} y2={95} stroke="#1E3A5F" strokeWidth={3} strokeLinecap="round" />
            <line x1={30} y1={100} x2={27} y2={115} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <line x1={30} y1={100} x2={33} y2={115} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />

            {/* Confetti */}
            {['#FF6B9D','#14B8A6','#D4AF37','#60A5FA','#34D399','#FB923C'].map((c, i) => (
              <motion.rect key={i} x={10 + i * 26} y={0} width={5} height={5} rx={1} fill={c}
                animate={{ y: [0, 50, 0], rotate: [0, 360, 0], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }} />
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scene 6: Walking workers (nurse, shipbuilder) ────────────────────────────

function WorkerWalker({ type, delay = 0, fromRight = false }: { type: 'nurse'|'shipbuilder'|'shopper'|'dogwalker'; delay?: number; fromRight?: boolean }) {
  const configs = {
    nurse: { shirt: '#fff', pants: '#B3E5FC', skin: '#C68642', hat: true, label: '🏥' },
    shipbuilder: { shirt: '#FF6B00', pants: '#1A3A6B', skin: '#F5D5B0', hat: false, label: '⚓' },
    shopper: { shirt: '#FF6B9D', pants: '#7C3AED', skin: '#FDBCB4', hat: false, label: '🛍️' },
    dogwalker: { shirt: '#34D399', pants: '#1A3A6B', skin: '#8D5524', hat: false, label: '🐕' },
  };
  const c = configs[type];

  return (
    <motion.div
      style={{ position: 'fixed', bottom: 38, [fromRight ? 'right' : 'left']: 0, zIndex: 9967, pointerEvents: 'none' }}
      initial={{ x: fromRight ? -140 : '108vw' }}
      animate={{ x: fromRight ? '108vw' : -140 }}
      transition={{ duration: 13, delay, repeat: Infinity, repeatDelay: 28, ease: 'linear' }}
    >
      <svg width="140" height="80" viewBox="0 0 140 80">
        {/* Label badge floating above */}
        <text x="30" y="8" textAnchor="middle" fontSize="16">{c.label}</text>

        {/* Person */}
        <Head x={30} y={24} fill={c.skin} />
        {/* Nurse hat */}
        {type === 'nurse' && (
          <>
            <rect x={22} y={14} width={16} height={10} rx={2} fill="#fff" />
            <line x1={30} y1={14} x2={30} y2={24} stroke="#CC0000" strokeWidth={2} />
            <line x1={25} y1={18} x2={35} y2={18} stroke="#CC0000" strokeWidth={2} />
          </>
        )}
        {/* Hard hat */}
        {type === 'shipbuilder' && (
          <path d="M21 22 Q30 12 39 22 L39 24 L21 24Z" fill="#FFD700" />
        )}
        <Body x={30} y={34} fill={c.shirt} />
        {/* Stethoscope for nurse */}
        {type === 'nurse' && (
          <path d="M25 38 Q20 45 25 50 Q30 55 35 50" stroke="#333" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        )}
        {/* Tool belt for shipbuilder */}
        {type === 'shipbuilder' && (
          <rect x={23} y={48} width={14} height={4} rx={1} fill="#8B4513" />
        )}
        {/* Shopping bags */}
        {type === 'shopper' && (
          <>
            <motion.g animate={{ rotate: [-10, 10, -10] }} style={{ transformOrigin: '20px 52px' }}
              transition={{ duration: 0.5, repeat: Infinity }}>
              <line x1={25} y1={44} x2={18} y2={55} stroke="#FF6B9D" strokeWidth={2.5} strokeLinecap="round" />
              <rect x={12} y={52} width={12} height={14} rx={2} fill="#D4AF37" />
              <path d="M15 52 Q18 48 21 52" stroke="#B8960C" strokeWidth={1.5} fill="none" />
            </motion.g>
            <motion.g animate={{ rotate: [10, -10, 10] }} style={{ transformOrigin: '40px 52px' }}
              transition={{ duration: 0.5, repeat: Infinity }}>
              <line x1={35} y1={44} x2={42} y2={55} stroke="#FF6B9D" strokeWidth={2.5} strokeLinecap="round" />
              <rect x={36} y={52} width={12} height={14} rx={2} fill="#14B8A6" />
              <path d="M39 52 Q42 48 45 52" stroke="#0F9A8C" strokeWidth={1.5} fill="none" />
            </motion.g>
          </>
        )}
        {/* Dog */}
        {type === 'dogwalker' && (
          <g transform="translate(50, 36)">
            {/* Leash — static curve */}
            <path d="M-22 18 Q-8 24 0 20" stroke="#8B4513" strokeWidth={1.5} fill="none" />
            {/* Dog body */}
            <ellipse cx={10} cy={24} rx={14} ry={8} fill="#C68642" />
            {/* Head */}
            <circle cx={22} cy={20} r={7} fill="#A0522D" />
            {/* Ear */}
            <ellipse cx={26} cy={15} rx={4} ry={6} fill="#8B4513" />
            {/* Tail wagging — rotate group */}
            <motion.g animate={{ rotate: [-30, 30, -30] }} style={{ transformOrigin: '-2px 22px' }}
              transition={{ duration: 0.4, repeat: Infinity }}>
              <path d="M-2 22 Q-10 14 -6 8" stroke="#C68642" strokeWidth={3} fill="none" strokeLinecap="round" />
            </motion.g>
            {/* Legs */}
            <line x1={2} y1={30} x2={0} y2={42} stroke="#A0522D" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={8} y1={31} x2={6} y2={43} stroke="#A0522D" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={16} y1={31} x2={14} y2={43} stroke="#A0522D" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={22} y1={30} x2={20} y2={42} stroke="#A0522D" strokeWidth={2.5} strokeLinecap="round" />
          </g>
        )}
        <WalkLegs x={30} y={54} color={c.pants} />
        <SwingArms x={30} y={34} shirtColor={c.shirt} />
      </svg>
    </motion.div>
  );
}

// ─── Scene 7: Zillow Browser ──────────────────────────────────────────────────

function ZillowBrowserScene() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 18000);
    const c = setInterval(() => setVisible(v => !v), 40000);
    return () => { clearTimeout(t); clearInterval(c); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          style={{ position: 'fixed', bottom: 38, right: '22%', zIndex: 9974, pointerEvents: 'none' }}>
          <svg width="200" height="130" viewBox="0 0 200 130">
            {/* Desk */}
            <rect x={0} y={110} width={200} height={8} rx={3} fill="#8B6914" />
            <rect x={10} y={118} width={8} height={12} rx={2} fill="#6B4C11" />
            <rect x={182} y={118} width={8} height={12} rx={2} fill="#6B4C11" />

            {/* Laptop */}
            <rect x={30} y={72} width={110} height={72} rx={6} fill="#1E3A5F" />
            <rect x={34} y={76} width={102} height={64} rx={4} fill="#0A1628" />
            {/* Screen content — mini Zillow interface */}
            <rect x={36} y={78} width={98} height={12} rx={2} fill="#fff" opacity={0.9} />
            <text x="85" y="87" textAnchor="middle" fontSize="7" fill="#006AFF" fontWeight="900" fontFamily="sans-serif">🏠 zillow.com/newport-news</text>
            {/* House cards floating/scrolling */}
            {[0,1,2].map(i => (
              <motion.g key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}>
                <rect x={38 + i * 34} y={95} width={30} height={36} rx={3} fill="#fff" opacity={0.85} />
                <rect x={38 + i * 34} y={95} width={30} height={16} rx={3} fill={['#14B8A6','#D4AF37','#60A5FA'][i]} opacity={0.7} />
                <text x={53 + i * 34} y={104} textAnchor="middle" fontSize="6" fill="#fff" fontWeight="800">🏡</text>
                <text x={53 + i * 34} y={116} textAnchor="middle" fontSize="5" fill="#1E3A5F" fontWeight="700">${['285K','320K','210K'][i]}</text>
                <text x={53 + i * 34} y={124} textAnchor="middle" fontSize="4" fill="#666">{['Denbigh','Hilton','SE'][i]}</text>
              </motion.g>
            ))}
            {/* Keyboard */}
            <rect x={30} y={144} width={110} height={6} rx={2} fill="#333" />
            {/* Hinge */}
            <rect x={80} y={142} width={40} height={4} rx={2} fill="#1A1A2E" />

            {/* Person sitting */}
            <Head x={110} y={56} fill="#FDBCB4" />
            <Body x={110} y={66} w={16} h={22} fill="#7C3AED" />
            {/* Arms on keyboard */}
            <line x1={103} y1={74} x2={90} y2={88} stroke="#7C3AED" strokeWidth={3} strokeLinecap="round" />
            <motion.g animate={{ rotate: [-25, 25, -25] }} style={{ transformOrigin: '117px 74px' }}
              transition={{ duration: 0.4, repeat: Infinity }}>
              <line x1={117} y1={74} x2={120} y2={88} stroke="#7C3AED" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            {/* Thought bubble — house */}
            <motion.g animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1, 0.95] }} style={{ transformOrigin: '148px 28px' }}
              transition={{ duration: 2, repeat: Infinity }}>
              <circle cx={128} cy={46} r={4} fill="rgba(255,255,255,0.6)" />
              <circle cx={136} cy={38} r={6} fill="rgba(255,255,255,0.7)" />
              <circle cx={148} cy={32} r={10} fill="rgba(255,255,255,0.8)" />
              <text x="148" y="36" textAnchor="middle" fontSize="12">🏡</text>
            </motion.g>
            {/* Cursor blinking */}
            <motion.rect x={104} y={85} width={1.5} height={8} fill="#0A1628"
              animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scene 8: Street Musician ─────────────────────────────────────────────────

function StreetMusicianScene() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 22000);
    const c = setInterval(() => setVisible(v => !v), 48000);
    return () => { clearTimeout(t); clearInterval(c); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', bottom: 38, left: '20%', zIndex: 9964, pointerEvents: 'none' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Ground */}
            <rect x={0} y={108} width={120} height={4} rx={2} fill="rgba(255,255,255,0.15)" />
            {/* Hat case / tip jar */}
            <ellipse cx={30} cy={110} rx={18} ry={6} fill="#333" />
            <ellipse cx={30} cy={108} rx={18} ry={5} fill="#1A1A1A" />
            <text x="30" y="112" textAnchor="middle" fontSize="7" fill="#D4AF37">TIPS 🙏</text>
            {/* Person */}
            <Head x={75} y={28} fill="#C68642" />
            {/* Beanie */}
            <ellipse cx={75} cy={22} rx={11} ry={8} fill="#D4AF37" />
            <rect x={64} y={19} width={22} height={6} rx={3} fill="#D4AF37" />
            <circle cx={75} cy={14} r={4} fill="#FF6B9D" />
            <Body x={75} y={38} fill="#1E3A5F" />
            {/* Guitar body */}
            <ellipse cx={58} cy={72} rx={14} ry={16} fill="#8B4513" />
            <ellipse cx={58} cy={56} rx={8} ry={10} fill="#8B4513" />
            <rect x={55} y={42} width={6} height={20} rx={2} fill="#A0522D" />
            {/* Guitar hole */}
            <circle cx={58} cy={72} r={5} fill="rgba(0,0,0,0.4)" />
            {/* Strings */}
            {[54,57,60,63].map(x => <line key={x} x1={x} y1={42} x2={x} y2={88} stroke="rgba(255,255,255,0.6)" strokeWidth={0.8} />)}
            {/* Playing arm */}
            <motion.g animate={{ rotate: [-18, 18, -18] }} style={{ transformOrigin: '70px 44px' }}
              transition={{ duration: 0.3, repeat: Infinity }}>
              <line x1={70} y1={44} x2={62} y2={62} stroke="#1E3A5F" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            <line x1={80} y1={44} x2={90} y2={60} stroke="#1E3A5F" strokeWidth={3} strokeLinecap="round" />
            <line x1={75} y1={58} x2={72} y2={74} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <line x1={75} y1={58} x2={78} y2={74} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            {/* Music notes — use translateY on group, not SVG y attr */}
            {['♩','♪','♫'].map((n, i) => (
              <motion.g key={i}
                animate={{ y: [0, -20, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}>
                <text x={88 + i * 10} y={35} fontSize="14" fill="#D4AF37">{n}</text>
              </motion.g>
            ))}
            {/* Coin tossed — translateY on group */}
            <motion.g animate={{ y: [0, 28, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}>
              <circle cx={30} cy={80} r={4} fill="#D4AF37" />
            </motion.g>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scene 9: Drive-thru Fast Food ───────────────────────────────────────────

function FastFoodScene() {
  const [carX, setCarX] = useState(1400);
  const [phase, setPhase] = useState<'away'|'arriving'|'ordering'|'leaving'>('away');
  useEffect(() => {
    const run = () => {
      setPhase('arriving'); setCarX(1400);
      const arrive = setInterval(() => {
        setCarX(x => {
          if (x <= 700) {
            clearInterval(arrive);
            setPhase('ordering');
            setTimeout(() => {
              setPhase('leaving');
              const go = setInterval(() => setCarX(x2 => {
                if (x2 < -300) { clearInterval(go); setPhase('away'); }
                return x2 - 6;
              }), 30);
            }, 3000);
          }
          return x - 7;
        });
      }, 30);
    };
    const t = setTimeout(run, 8000);
    const r = setInterval(run, 50000);
    return () => { clearTimeout(t); clearInterval(r); };
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 38, left: 0, right: 0, zIndex: 9963, pointerEvents: 'none' }}>
      <svg width="100%" height="110" viewBox={`0 0 1280 110`} preserveAspectRatio="none">
        {/* Fast food shack */}
        <rect x={640} y={20} width={120} height={80} rx={5} fill="#FF6B00" />
        <polygon points="630,20 770,20 770,10 630,10" fill="#CC3300" />
        <text x="700" y="42" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="900" fontFamily="sans-serif">🍔 QUICK EATS</text>
        {/* Window */}
        <rect x={655} y={48} width={50} height={35} rx={3} fill="#B3E5FC" opacity={0.8} />
        {/* Worker in window */}
        <circle cx={680} cy={60} r={8} fill="#F5D5B0" />
        <rect x={672} y={68} width={16} height={12} rx={3} fill="#fff" />
        {/* Hat */}
        <rect x={674} y={50} width={12} height={8} rx={2} fill="#CC3300" />
        {/* Waving hand with bag */}
        {phase === 'ordering' && (
          <motion.g animate={{ rotate: [-10, 10, -10] }} style={{ transformOrigin: '694px 65px' }}
            transition={{ duration: 0.5, repeat: Infinity }}>
            <line x1={688} y1={65} x2={698} y2={58} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
            <rect x={696} y={52} width={10} height={14} rx={2} fill="#D4AF37" />
            <text x="701" y="62" textAnchor="middle" fontSize="8">🍟</text>
          </motion.g>
        )}
        {/* Car */}
        <g transform={`translate(${carX - 1280}, 45)`}>
          {/* Car body */}
          <rect x={0} y={20} width={120} height={40} rx={8} fill="#14517A" />
          <rect x={10} y={10} width={80} height={32} rx={8} fill="#1E6B9A" />
          {/* Windows */}
          <rect x={15} y={14} width={28} height={22} rx={4} fill="#87CEEB" opacity={0.8} />
          <rect x={50} y={14} width={28} height={22} rx={4} fill="#87CEEB" opacity={0.8} />
          {/* Person in car */}
          <circle cx={65} cy={22} r={7} fill="#C68642" />
          {/* Wheels */}
          {[20, 100].map(x => <g key={x}>
            <circle cx={x} cy={62} r={12} fill="#111" />
            <circle cx={x} cy={62} r={7} fill="#222" />
            <motion.line x1={x-7} y1={62} x2={x+7} y2={62} stroke="#444" strokeWidth={2}
              animate={{ rotate: 360 }} transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${x}px 62px` }} />
          </g>)}
          {/* Order sign */}
          {phase === 'ordering' && (
            <motion.rect x={-60} y={15} width={55} height={25} rx={4} fill="#fff" opacity={0.9}
              animate={{ opacity: [0.9, 1, 0.9] }} transition={{ duration: 0.5, repeat: Infinity }}>
            </motion.rect>
          )}
          {phase === 'ordering' && (
            <text x="-32" y="30" textAnchor="middle" fontSize="8" fill="#CC3300" fontWeight="800" fontFamily="sans-serif">
              Order here! 🎤
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}

// ─── Scene 10: Ambulance ──────────────────────────────────────────────────────

function AmbulanceScene({ delay = 0 }: { delay?: number }) {
  const [lit, setLit] = useState(false);
  useEffect(() => { const id = setInterval(() => setLit(v => !v), 200); return () => clearInterval(id); }, []);
  return (
    <motion.div
      style={{ position: 'fixed', bottom: 38, left: 0, zIndex: 9982, pointerEvents: 'none' }}
      initial={{ x: '108vw' }}
      animate={{ x: -360 }}
      transition={{ duration: 7, delay, repeat: Infinity, repeatDelay: 52, ease: 'linear' }}
    >
      <svg width="200" height="76" viewBox="0 0 200 76">
        <rect x={4} y={14} width={192} height={48} rx={8} fill="#fff" />
        <rect x={4} y={14} width={192} height={48} rx={8} fill="none" stroke="#CC0000" strokeWidth={3} />
        <rect x={4} y={14} width={192} height={14} rx={8} fill="#CC0000" />
        {/* Cross symbol */}
        <rect x={84} y={18} width={32} height={8} rx={2} fill="#fff" />
        <rect x={96} y={14} width={8} height={16} rx={2} fill="#fff" />
        {/* Lights */}
        <rect x={8} y={14} width={20} height={12} rx={3} fill={lit ? '#FF0000' : '#660000'} />
        <rect x={172} y={14} width={20} height={12} rx={3} fill={lit ? '#0000FF' : '#000066'} />
        {/* Siren glow — scale instead of r */}
        <motion.circle cx={18} cy={20} r={8} fill={lit ? '#FF000066' : 'transparent'}
          animate={{ scale: [0.4, 1.8, 0.4] }}
          style={{ transformOrigin: '18px 20px' }}
          transition={{ duration: 0.4, repeat: Infinity }} />
        {/* Windows */}
        {[14, 100, 146].map(x => <rect key={x} x={x} y={20} width={30} height={22} rx={4} fill="#B3E5FC" opacity={0.8} />)}
        <text x="120" y="52" textAnchor="middle" fontSize="9" fill="#CC0000" fontWeight="900" fontFamily="sans-serif">AMBULANCE</text>
        {/* Wheels */}
        {[36, 162].map(cx => <g key={cx}><circle cx={cx} cy={66} r={10} fill="#111" /><circle cx={cx} cy={66} r={6} fill="#222" /></g>)}
      </svg>
    </motion.div>
  );
}

// ─── Scene 11: Police Chase ───────────────────────────────────────────────────

function PoliceChaseScene({ delay = 0, fromRight = false }: { delay?: number; fromRight?: boolean }) {
  const [policeFlash, setPoliceFlash] = useState(false);
  useEffect(() => { const id = setInterval(() => setPoliceFlash(v => !v), 180); return () => clearInterval(id); }, []);
  const dir = fromRight ? -1 : 1;
  return (
    <motion.div
      style={{ position: 'fixed', bottom: 38, [fromRight ? 'right' : 'left']: 0, zIndex: 9980, pointerEvents: 'none' }}
      initial={{ x: fromRight ? -520 : '115vw' }}
      animate={{ x: fromRight ? '115vw' : -520 }}
      transition={{ duration: 6, delay, repeat: Infinity, repeatDelay: 45, ease: 'linear' }}
    >
      <svg width="420" height="68" viewBox={`0 0 420 68`} transform={fromRight ? 'scale(-1,1)' : undefined}>
        {/* Fleeing car */}
        <rect x={4} y={10} width={140} height={44} rx={8} fill="#CC0000" />
        <rect x={14} y={4} width={100} height={32} rx={8} fill="#AA0000" />
        {[18,74,114].map(x=><rect key={x} x={x} y={8} width={26} height={22} rx={4} fill="#87CEEB" opacity={0.7}/>)}
        {[20,124].map(cx=><g key={cx}><circle cx={cx} cy={56} r={10} fill="#111"/><circle cx={cx} cy={56} r={6} fill="#222"/></g>)}
        <motion.text x="72" y="40" textAnchor="middle" fontSize="10"
          animate={{ opacity: [0,1,0] }} transition={{ duration: 0.3, repeat: Infinity }}>💨</motion.text>
        {/* Police car */}
        <rect x={200} y={12} width={200} height={44} rx={8} fill="#1E3A5F" />
        <rect x={210} y={4} width={160} height={32} rx={8} fill="#0F2347" />
        <rect x={220} y={4} width={140} height={6} rx={2} fill="#fff" />
        {[214,270,332].map(x=><rect key={x} x={x} y={8} width={28} height={22} rx={4} fill="#B3E5FC" opacity={0.7}/>)}
        {/* Lights on roof */}
        <rect x={255} y={2} width={16} height={6} rx={2} fill={policeFlash ? '#FF0000' : '#660000'} />
        <rect x={280} y={2} width={16} height={6} rx={2} fill={policeFlash ? '#0000FF' : '#000066'} />
        <rect x={305} y={2} width={16} height={6} rx={2} fill={policeFlash ? '#FF0000' : '#660000'} />
        {[216,372].map(cx=><g key={cx}><circle cx={cx} cy={58} r={10} fill="#111"/><circle cx={cx} cy={58} r={6} fill="#222"/></g>)}
        <text x="292" y="44" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="900" fontFamily="sans-serif">POLICE</text>
      </svg>
    </motion.div>
  );
}

// ─── Scene 12: People on benches / sitting, reading, chatting ────────────────

function SittingCrowdScene() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 26000);
    const c = setInterval(() => setVisible(v => !v), 55000);
    return () => { clearTimeout(t); clearInterval(c); };
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', bottom: 38, left: '42%', zIndex: 9962, pointerEvents: 'none' }}>
          <svg width="240" height="90" viewBox="0 0 240 90">
            {/* Park bench */}
            <rect x={10} y={65} width={220} height={6} rx={2} fill="#8B6914" />
            <rect x={10} y={58} width={220} height={6} rx={2} fill="#A0792A" />
            {[20, 220].map(x=><rect key={x} x={x} y={56} width={5} height={20} rx={2} fill="#6B4C11"/>)}
            {/* Person 1: chatting */}
            <Head x={45} y={26} fill="#FDBCB4" />
            <Body x={45} y={36} w={14} h={18} fill="#60A5FA" />
            <motion.g animate={{ rotate: [20, -20, 20] }} style={{ transformOrigin: '40px 40px' }}
              transition={{ duration: 1, repeat: Infinity }}>
              <line x1={40} y1={40} x2={30} y2={48} stroke="#60A5FA" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            <motion.g animate={{ rotate: [-20, 20, -20] }} style={{ transformOrigin: '50px 40px' }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>
              <line x1={50} y1={40} x2={60} y2={46} stroke="#60A5FA" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            {/* Legs on bench */}
            <line x1={40} y1={54} x2={38} y2={65} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <line x1={50} y1={54} x2={52} y2={65} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            {/* Speech bubble */}
            <rect x={2} y={8} width={50} height={16} rx={6} fill="#fff" opacity={0.85} />
            <polygon points="18,24 24,24 20,30" fill="#fff" opacity={0.85} />
            <text x="27" y="19" textAnchor="middle" fontSize="7" fill="#1E3A5F" fontWeight="700">Let's buy!</text>
            {/* Person 2 */}
            <Head x={100} y={28} fill="#8D5524" />
            <Body x={100} y={38} w={14} h={18} fill="#34D399" />
            {/* Phone in hand */}
            <line x1={106} y1={42} x2={112} y2={36} stroke="#34D399" strokeWidth={3} strokeLinecap="round" />
            <rect x={112} y={31} width={8} height={12} rx={2} fill="#111" />
            <motion.rect x={113} y={32} width={6} height={10} rx={1} fill="#87CEEB"
              animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <line x1={95} y1={42} x2={88} y2={50} stroke="#34D399" strokeWidth={3} strokeLinecap="round" />
            <line x1={95} y1={56} x2={93} y2={65} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <line x1={105} y1={56} x2={107} y2={65} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            {/* Person 3 — with ice cream */}
            <Head x={160} y={26} fill="#F5D5B0" />
            <Body x={160} y={36} w={14} h={18} fill="#A78BFA" />
            <line x1={166} y1={40} x2={174} y2={32} stroke="#A78BFA" strokeWidth={3} strokeLinecap="round" />
            {/* Ice cream cone */}
            <polygon points="174,32 180,32 177,42" fill="#D4AF37" />
            <circle cx={177} cy={28} r={8} fill="#FF6B9D" />
            <circle cx={177} cy={26} r={6} fill="#FFB3CC" opacity={0.7} />
            <line x1={154} y1={40} x2={146} y2={50} stroke="#A78BFA" strokeWidth={3} strokeLinecap="round" />
            <line x1={154} y1={54} x2={152} y2={65} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <line x1={164} y1={54} x2={166} y2={65} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            {/* Squirrel on bench arm */}
            <circle cx={210} cy={50} r={6} fill="#8B4513" />
            <ellipse cx={216} cy={47} rx={3} ry={5} fill="#A0522D" />
            <motion.g animate={{ rotate: [-25, 25, -25] }} style={{ transformOrigin: '204px 48px' }}
              transition={{ duration: 0.8, repeat: Infinity }}>
              <path d="M204 48 Q198 40 204 36" stroke="#8B4513" strokeWidth={2.5} fill="none" strokeLinecap="round" />
            </motion.g>
            <circle cx={218} cy={46} r={2} fill="#FFF" />
            <circle cx={213} cy={49} r={2} fill="#D4AF37" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scene 13: Shipbuilder at work ────────────────────────────────────────────

function ShipbuilderWorkScene() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30000);
    const c = setInterval(() => setVisible(v => !v), 60000);
    return () => { clearTimeout(t); clearInterval(c); };
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
          style={{ position: 'fixed', bottom: 38, left: '65%', zIndex: 9960, pointerEvents: 'none' }}>
          <svg width="200" height="120" viewBox="0 0 200 120">
            {/* Ship hull being built */}
            <rect x={20} y={60} width={160} height={50} rx={4} fill="#1E3A5F" opacity={0.8} />
            <ellipse cx={100} cy={60} rx={80} ry={8} fill="#0F2347" />
            {/* Porthole windows */}
            {[40, 70, 100, 130, 160].map(x => <circle key={x} cx={x} cy={80} r={8} fill="none" stroke="#D4AF37" strokeWidth={2} />)}
            {/* Scaffolding */}
            <rect x={0} y={20} width={4} height={90} fill="#666" />
            <rect x={196} y={20} width={4} height={90} fill="#666" />
            {[20,40,60,80].map(y=><rect key={y} x={0} y={y} width={200} height={3} fill="#555" opacity={0.6}/>)}
            {/* Anchor logo */}
            <text x="100" y="98" textAnchor="middle" fontSize="24" fill="#D4AF37" opacity={0.6}>⚓</text>
            {/* Worker 1 with welding */}
            <Head x={55} y={32} fill="#F5D5B0" />
            {/* Hard hat */}
            <path d="M45 30 Q55 20 65 30 L65 33 L45 33Z" fill="#FFD700" />
            <rect x={45} y={29} width={20} height={5} rx={2} fill="#CC9900" />
            <Body x={55} y={42} fill="#FF6B00" />
            {/* Welding arm — sparks */}
            <motion.g animate={{ rotate: [-15, 15, -15] }} style={{ transformOrigin: '60px 50px' }}
              transition={{ duration: 0.3, repeat: Infinity }}>
              <line x1={60} y1={50} x2={72} y2={60} stroke="#FF6B00" strokeWidth={3} strokeLinecap="round" />
              <motion.circle cx={72} cy={60} r={3} fill="#FFD700"
                animate={{ scale: [0.6, 1.8, 0.6], opacity: [1, 0.3, 1] }}
                style={{ transformOrigin: '72px 60px' }}
                transition={{ duration: 0.2, repeat: Infinity }} />
              {/* Sparks — translateY on groups */}
              {[0,1,2,3].map(i => (
                <motion.g key={i}
                  animate={{ y: [0, -6, 0], opacity: [1, 0, 1] }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.07 }}>
                  <line x1={72} y1={60} x2={72 + (i - 1.5) * 6} y2={54}
                    stroke="#FFD700" strokeWidth={1.5} strokeLinecap="round" />
                </motion.g>
              ))}
            </motion.g>
            <line x1={50} y1={50} x2={42} y2={60} stroke="#FF6B00" strokeWidth={3} strokeLinecap="round" />
            <line x1={55} y1={60} x2={52} y2={75} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <line x1={55} y1={60} x2={58} y2={75} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />

            {/* Worker 2 with blueprints */}
            <Head x={140} y={30} fill="#C68642" />
            <path d="M130 28 Q140 18 150 28 L150 31 L130 31Z" fill="#FFD700" />
            <Body x={140} y={40} fill="#FF6B00" />
            <line x1={135} y1={46} x2={122} y2={54} stroke="#FF6B00" strokeWidth={3} strokeLinecap="round" />
            <rect x={110} y={50} width={30} height={22} rx={2} fill="#87CEEB" opacity={0.9} />
            {[0,1,2].map(i=><line key={i} x1={113} y1={56+i*5} x2={137} y2={56+i*5} stroke="#1E3A5F" strokeWidth={1}/>)}
            <line x1={140} y1={58} x2={138} y2={74} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <line x1={140} y1={58} x2={142} y2={74} stroke="#1A3A6B" strokeWidth={3} strokeLinecap="round" />
            <motion.g animate={{ rotate: [15, -15, 15] }} style={{ transformOrigin: '145px 46px' }}
              transition={{ duration: 1, repeat: Infinity }}>
              <line x1={145} y1={46} x2={152} y2={54} stroke="#FF6B00" strokeWidth={3} strokeLinecap="round" />
            </motion.g>

            {/* HII badge */}
            <rect x={80} y={18} width={40} height={14} rx={4} fill="#0B2146" opacity={0.8} />
            <text x="100" y="28" textAnchor="middle" fontSize="8" fill="#D4AF37" fontWeight="900" fontFamily="sans-serif">HII ⚓</text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scene 14: Nurse at work / walking ───────────────────────────────────────

function NurseWorkScene() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 36000);
    const c = setInterval(() => setVisible(v => !v), 62000);
    return () => { clearTimeout(t); clearInterval(c); };
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', bottom: 38, right: '30%', zIndex: 9959, pointerEvents: 'none' }}>
          <svg width="160" height="110" viewBox="0 0 160 110">
            {/* Medical cart */}
            <rect x={90} y={50} width={60} height={50} rx={4} fill="#fff" stroke="#14B8A6" strokeWidth={2} />
            <rect x={90} y={50} width={60} height={16} rx={4} fill="#14B8A6" />
            <text x="120" y="62" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="900">🏥 CARE</text>
            {/* Clipboard & supplies */}
            <rect x={96} y={72} width={20} height={24} rx={2} fill="#fff" stroke="#ccc" strokeWidth={1} />
            {[0,1,2].map(i=><line key={i} x1={98} y1={78+i*6} x2={114} y2={78+i*6} stroke="#ccc" strokeWidth={1}/>)}
            {/* Medicine bottles */}
            <rect x={122} y={72} width={10} height={18} rx={3} fill="#FF6B9D" />
            <rect x={135} y={70} width={10} height={20} rx={3} fill="#34D399" />
            {/* Wheels */}
            {[96, 144].map(cx => <circle key={cx} cx={cx} cy={102} r={5} fill="#999" />)}

            {/* Nurse */}
            <Head x={60} y={22} fill="#FDBCB4" />
            {/* Nurse cap */}
            <rect x={50} y={12} width={20} height={10} rx={2} fill="#fff" />
            <line x1={60} y1={12} x2={60} y2={22} stroke="#CC0000" strokeWidth={2} />
            <line x1={54} y1={16} x2={66} y2={16} stroke="#CC0000" strokeWidth={2} />
            <Body x={60} y={32} fill="#fff" />
            {/* Scrub pants */}
            <rect x={52} y={50} width={16} height={20} rx={3} fill="#B3E5FC" />
            {/* Stethoscope */}
            <path d="M55 38 Q48 46 54 52 Q60 58 66 52" stroke="#333" strokeWidth={1.5} fill="none" strokeLinecap="round" />
            <circle cx={66} cy={52} r={3} fill="#555" />
            {/* Holding clipboard */}
            <motion.g animate={{ rotate: [-15, 15, -15] }} style={{ transformOrigin: '65px 40px' }}
              transition={{ duration: 1.5, repeat: Infinity }}>
              <line x1={65} y1={40} x2={80} y2={48} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
            </motion.g>
            <rect x={78} y={44} width={16} height={20} rx={2} fill="#fff" stroke="#14B8A6" strokeWidth={1.5} />
            {[0,1,2].map(i=><line key={i} x1={80} y1={50+i*5} x2={92} y2={50+i*5} stroke="#14B8A6" strokeWidth={1}/>)}
            <line x1={55} y1={40} x2={48} y2={50} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
            {/* Shoes */}
            <rect x={52} y={68} width={10} height={6} rx={2} fill="#fff" />
            <rect x={62} y={68} width={10} height={6} rx={2} fill="#fff" />

            {/* Heart icon */}
            <motion.text x="60" y="12" textAnchor="middle" fontSize="12" fill="#FF6B9D"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
              style={{ transformOrigin: '60px 12px' }}
              transition={{ duration: 1.5, repeat: Infinity }}>❤️</motion.text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main overlay ─────────────────────────────────────────────────────────────

export function CityStreetLife() {
  const [location] = useLocation();
  const path = location.split('?')[0];
  if (SKIP.has(path)) return null;

  return (
    <>
      {/* Always-on background actors */}
      <CrossingGuardScene />
      <BusStopScene />
      <BicyclistScene delay={2} shirt="#34D399" skin="#FDBCB4" />
      <BicyclistScene delay={22} fromRight shirt="#FB923C" skin="#C68642" y={44} />
      <BicyclistScene delay={44} shirt="#60A5FA" skin="#F5D5B0" y={38} />
      <WorkerWalker type="nurse"       delay={4}  />
      <WorkerWalker type="shipbuilder" delay={18} fromRight />
      <WorkerWalker type="shopper"     delay={30} />
      <WorkerWalker type="dogwalker"   delay={10} fromRight />
      <BlockPartyScene />
      <HomebuyerScene />
      <ZillowBrowserScene />
      <StreetMusicianScene />
      <FastFoodScene />
      <SittingCrowdScene />
      <ShipbuilderWorkScene />
      <NurseWorkScene />
      <AmbulanceScene delay={5} />
      <AmbulanceScene delay={60} />
      <PoliceChaseScene delay={12} />
      <PoliceChaseScene delay={55} fromRight />
    </>
  );
}
