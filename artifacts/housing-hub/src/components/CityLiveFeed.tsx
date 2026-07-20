/**
 * CityLiveFeed — site-wide cinematic info-delivery overlay.
 * Actors: Mega Drone, City Bus, Hot Air Balloon, City Hall Toast, News Ticker.
 * Page-aware: pulls relevant stats per route. Fixed overlay, pointer-events: none (except toasts).
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

// ─── Page-specific content ────────────────────────────────────────────────────

interface InfoCard { headline: string; sub: string; badge?: string; link?: string }

const PAGE_DATA: Record<string, { color: string; accent: string; emoji: string; cards: InfoCard[]; ticker: string[] }> = {
  '/': {
    color: '#14B8A6', accent: '#D4AF37', emoji: '🏡',
    cards: [
      { headline: 'Buy Your First Home', sub: 'Programs, grants & step-by-step guidance for buyers', link: '/buy', badge: 'Get Started →' },
      { headline: 'Explore Neighborhoods', sub: 'Hilton Village · Denbigh · Oyster Point · Southeast', link: '/neighborhoods', badge: 'Browse →' },
      { headline: 'Play the Simulator', sub: 'Walk through what homeownership really costs', link: '/simulator', badge: 'Try It →' },
      { headline: 'Free Workshop — Aug 8', sub: 'Beyond the Keys homebuyer education, 9:30 AM', link: '/events', badge: 'Register Free →' },
    ],
    ticker: ['Buy a home in Newport News → visit the Buy page', 'Explore neighborhoods: Hilton Village · Denbigh · Oyster Point', 'Play the Simulator — learn homeownership step by step', 'Free homebuyer workshop: Beyond the Keys — Aug 8, 2026', 'Need guidance? Free HUD-certified housing counseling available'],
  },
  '/buy': {
    color: '#D4AF37', accent: '#14B8A6', emoji: '🔑',
    cards: [
      { headline: 'Buying Power Calculator', sub: 'See your estimated monthly payment right now ↑', link: '/buy', badge: 'Use Tool →' },
      { headline: 'Down Payment Programs', sub: 'City & state assistance for first-time buyers', link: '/assistance', badge: 'See Programs →' },
      { headline: 'Talk to a Counselor', sub: 'Free HUD-certified housing guidance, no appointment needed', link: '/contact', badge: 'Contact →' },
      { headline: 'Check Your Eligibility', sub: 'Take the 7-question quiz to find your best programs', link: '/quiz', badge: 'Take Quiz →' },
    ],
    ticker: ['Use the Buying Power Calculator above ↑', 'Compare rent vs. buy on this page', 'Find down payment assistance → visit Assistance page', 'Free HUD counseling — no appointment needed', 'Take the eligibility quiz to find your programs'],
  },
  '/rent': {
    color: '#60A5FA', accent: '#14B8A6', emoji: '🏢',
    cards: [
      { headline: 'Find Affordable Rentals', sub: 'Browse listings across Newport News neighborhoods', link: '/rent', badge: 'Browse →' },
      { headline: 'Rental Assistance', sub: 'Section 8, VA Rent Relief & emergency programs', link: '/assistance', badge: 'Get Help →' },
      { headline: 'Rent vs. Buy', sub: 'See if buying might be cheaper than renting for you', link: '/buy', badge: 'Compare →' },
      { headline: 'Talk to Someone', sub: 'Free housing counseling — renting, buying or emergency', link: '/contact', badge: 'Contact →' },
    ],
    ticker: ['Browse affordable rentals in Newport News', 'Section 8 vouchers — learn more on the Assistance page', 'Already renting? See if buying could cost less', 'Emergency rental assistance — call (757) 933-2311', 'Free counseling covers renting, buying, and emergency help'],
  },
  '/neighborhoods': {
    color: '#34D399', accent: '#D4AF37', emoji: '📍',
    cards: [
      { headline: 'Hilton Village  avg ~$320K', sub: 'Historic charm, walkable streets, artisan shops', link: '/neighborhoods', badge: 'Explore →' },
      { headline: 'Denbigh  avg ~$285K', sub: 'Spacious lots, great parks, suburban community', link: '/neighborhoods', badge: 'Explore →' },
      { headline: 'Oyster Point  avg ~$350K', sub: 'Modern condos, bustling commerce & dining', link: '/neighborhoods', badge: 'Explore →' },
      { headline: 'Southeast  avg ~$210K', sub: 'Rich heritage, waterfront views, community focus', link: '/neighborhoods', badge: 'Explore →' },
    ],
    ticker: ['Hilton Village: avg ~$320K — historic & walkable', 'Denbigh: avg ~$285K — spacious suburban living', 'Oyster Point: avg ~$350K — modern condos & dining', 'Southeast Newport News: avg ~$210K — waterfront views', 'Scroll down to explore all Newport News neighborhoods ↓'],
  },
  '/assistance': {
    color: '#F87171', accent: '#D4AF37', emoji: '🤝',
    cards: [
      { headline: 'Housing Crisis Hotline', sub: '(757) 587-4202 — Virginia Peninsula, free & confidential', badge: 'Call Now' },
      { headline: 'Down Payment Grants', sub: 'City & state programs for first-time buyers', link: '/buy', badge: 'Learn More →' },
      { headline: 'Eviction Prevention', sub: 'Legal aid and rental assistance — call (757) 933-2311', badge: 'Get Help' },
      { headline: '2-1-1 United Way', sub: 'Free 24/7 social service referral line', badge: '24/7 →' },
    ],
    ticker: ['Housing Crisis Hotline: (757) 587-4202 — free & confidential', 'Eviction prevention: call (757) 933-2311 immediately', 'United Way 2-1-1: 24/7 referral — dial 211 from any phone', 'NNRHA: (757) 928-2620 — Newport News Housing Authority', 'Down payment grants available — see Buy page for details'],
  },
  '/resources': {
    color: '#A78BFA', accent: '#14B8A6', emoji: '📚',
    cards: [
      { headline: 'SHIP Plan — Active 2026', sub: 'Newport News Strategic Housing Initiatives Plan', link: '/ship', badge: 'Read Plan →' },
      { headline: 'Virginia Housing', sub: 'Below-market mortgage rates for VA residents', badge: 'virginiahousing.com →' },
      { headline: 'HUD Counseling', sub: 'Free certified housing counseling for all residents', link: '/contact', badge: 'Find Counselor →' },
      { headline: 'Homebuyer Checklist', sub: 'Download the Newport News step-by-step guide', link: '/checklist', badge: 'Download →' },
    ],
    ticker: ['Newport News SHIP Plan — adopted Feb 2026 · read on SHIP page', 'Virginia Housing: below-market mortgage rates available', 'HUD-approved housing counseling — free to all residents', 'Download the free homebuyer checklist → Checklist page', 'NNRHA manages 1,500+ public housing units across the city'],
  },
  '/events': {
    color: '#FB923C', accent: '#D4AF37', emoji: '📅',
    cards: [
      { headline: 'Beyond the Keys', sub: 'Homebuyer workshop — Aug 8, 2026 · 9:30–11 AM', link: '/events', badge: 'Register Free →' },
      { headline: 'Home & Health Expo', sub: 'Community expo — Sep 24, 2026 · 10 AM–2 PM', link: '/events', badge: 'Learn More →' },
      { headline: 'Bank On Hampton Roads', sub: 'Free 5-month financial literacy program', link: '/events', badge: 'Enroll →' },
      { headline: 'All Events Free', sub: 'Open to all Newport News residents — no cost', link: '/events', badge: 'See Calendar →' },
    ],
    ticker: ['Beyond the Keys: Aug 8, 2026 · 9:30 AM — homebuyer workshop', 'Home & Healthy Living Expo: Sep 24, 2026', 'Bank On Hampton Roads: free 5-month financial literacy program', 'All workshops free and open to Newport News residents', 'Register for upcoming events — see the Events page'],
  },
  '/contact': {
    color: '#14B8A6', accent: '#D4AF37', emoji: '📞',
    cards: [
      { headline: '(757) 933-2311', sub: 'City Housing Line — Mon–Fri 8am–5pm', badge: 'Call Now' },
      { headline: '2400 Washington Ave', sub: 'Newport News, VA 23607 — walk-ins welcome', badge: 'Get Directions' },
      { headline: 'Housing@nnva.gov', sub: 'Email the team for non-urgent questions', badge: 'Send Email' },
      { headline: 'Free HUD Counseling', sub: 'Certified advisors — all incomes welcome', link: '/journey', badge: 'Learn More →' },
    ],
    ticker: ['City Housing Line: (757) 933-2311 — Mon–Fri 8am–5pm', '2400 Washington Avenue, Newport News VA 23607', 'Email: housing@nnva.gov — non-urgent inquiries', 'Walk-in hours: Monday–Friday 8:00 AM to 5:00 PM', 'Free HUD-certified counseling — all income levels welcome'],
  },
  '/journey': {
    color: '#34D399', accent: '#D4AF37', emoji: '🗺️',
    cards: [
      { headline: 'Rent Path', sub: 'Find safe, affordable housing right now', link: '/rent', badge: 'Explore Rentals →' },
      { headline: 'Buy Path', sub: 'First-time buyer programs, grants & the calculator', link: '/buy', badge: 'Start Buying →' },
      { headline: 'Repair Path', sub: 'Home repair assistance for existing homeowners', link: '/assistance', badge: 'Get Help →' },
      { headline: 'Free HUD Counseling', sub: 'All 5 pathways — a counselor will guide you', link: '/contact', badge: 'Contact →' },
    ],
    ticker: ['Choose your housing path: Rent · Buy · Own · Repair · Emergency', 'Free HUD-approved counseling for all pathways', 'Use the Buying Power Calculator on the Buy page', 'Explore neighborhoods before you decide where to buy', 'Start with the eligibility quiz to find your best programs'],
  },
  '/services': {
    color: '#60A5FA', accent: '#14B8A6', emoji: '🏙️',
    cards: [
      { headline: 'Pay Utility Bill Online', sub: 'Water, gas & electric at newportnewsva.gov', badge: 'Pay Now →' },
      { headline: 'NN-ALERT System', sub: 'Sign up for emergency city notifications', badge: 'Sign Up →' },
      { headline: 'City Jobs', sub: 'Employment opportunities with Newport News', badge: 'Apply →' },
      { headline: 'Report an Issue', sub: 'Keep the city clean — report problems online', badge: 'Report →' },
    ],
    ticker: ['Pay utility bills online at newportnewsva.gov', 'NN-ALERT: sign up for emergency city notifications', 'Newport News is hiring — see city employment portal', 'Report neighborhood issues via the online portal', 'Trash & recycling schedule at newportnewsva.gov/solidwaste'],
  },
  '/success-stories': {
    color: '#D4AF37', accent: '#14B8A6', emoji: '⭐',
    cards: [
      { headline: 'Share Your Story', sub: 'Bought a home in Newport News? We want to feature you', link: '/contact', badge: 'Contact Us →' },
      { headline: 'Start Your Journey', sub: 'Find your housing pathway today', link: '/journey', badge: 'Get Started →' },
      { headline: 'Browse Programs', sub: 'Grants, vouchers & counseling for every situation', link: '/assistance', badge: 'See Programs →' },
      { headline: 'Play the Simulator', sub: 'See what your own homebuying story could look like', link: '/simulator', badge: 'Try It →' },
    ],
    ticker: ['Ready to write your own story? Start on the Buy page', 'Free HUD-certified counseling — all income levels welcome', 'Find down payment grants and programs on the Assistance page', 'Play the Simulator to see what homeownership looks like for you', 'Browse neighborhoods to find your ideal Newport News community'],
  },
  '/why-newport-news': {
    color: '#34D399', accent: '#D4AF37', emoji: '⚓',
    cards: [
      { headline: 'Explore Neighborhoods', sub: 'Hilton Village · Denbigh · Oyster Point · Southeast', link: '/neighborhoods', badge: 'Browse →' },
      { headline: 'Newport News Shipbuilding', sub: 'HII — largest industrial employer in Virginia', link: '/why-newport-news', badge: 'Learn More →' },
      { headline: '50+ Parks & 14mi Trails', sub: 'Including the award-winning Noland Trail', link: '/why-newport-news', badge: 'Explore →' },
      { headline: 'James River Waterfront', sub: 'Walk the boardwalk any morning of the week', link: '/why-newport-news', badge: 'See More →' },
    ],
    ticker: ['Explore Newport News neighborhoods: Hilton Village · Denbigh · Southeast', 'HII Newport News Shipbuilding — largest industrial VA employer', '50+ parks including the 5-mile Noland Trail', 'James River waterfront boardwalk — open daily', 'Military families, professionals & lifelong residents all call it home'],
  },
  '/checklist': {
    color: '#14B8A6', accent: '#D4AF37', emoji: '✅',
    cards: [
      { headline: 'Step 1: Check Your Credit', sub: 'Aim for 620+ — use the checklist to track progress', link: '/checklist', badge: 'Start Here →' },
      { headline: 'Step 2: Calculate Budget', sub: 'Use the Buying Power calculator on the Buy page', link: '/buy', badge: 'Try Calculator →' },
      { headline: 'Step 3: Find Programs', sub: 'Take the 7-question eligibility quiz', link: '/quiz', badge: 'Take Quiz →' },
      { headline: 'Step 4: Talk to a Counselor', sub: 'Free HUD-certified guidance — no appointment needed', link: '/contact', badge: 'Contact →' },
    ],
    ticker: ['Step 1: Check your credit — aim for 620+ before applying', 'Step 2: Use the Buying Power Calculator → Buy page', 'Step 3: Take the eligibility quiz to find your programs', 'Step 4: Talk to a free HUD-certified counselor', 'Virginia programs accept down payments as low as 1%'],
  },
  '/ship': {
    color: '#A78BFA', accent: '#D4AF37', emoji: '📋',
    cards: [
      { headline: 'SHIP Plan — Feb 2026', sub: 'Newport News Strategic Housing Initiatives Plan', link: '/ship', badge: 'Read Plan →' },
      { headline: '4 Pillars of SHIP', sub: 'Reform · Production · Affordability · Preservation', link: '/ship', badge: 'Learn More →' },
      { headline: 'Missing Middle Housing', sub: 'Duplexes & townhomes to expand housing stock', link: '/ship', badge: 'Details →' },
      { headline: 'Your Input Matters', sub: 'Public comment shapes Newport News housing policy', link: '/contact', badge: 'Contact →' },
    ],
    ticker: ['SHIP Plan adopted February 2026 — shaping Newport News housing', '4 pillars: Regulatory Reform, Production, Affordability, Preservation', '"Missing Middle" housing: duplexes & townhomes being prioritized', 'Zoning reform underway to allow more housing types', 'Your voice matters — contact the housing office to weigh in'],
  },
  '/partners': {
    color: '#FB923C', accent: '#14B8A6', emoji: '🤝',
    cards: [
      { headline: 'Virginia Housing', sub: 'State mortgages at below-market interest rates', badge: 'virginiahousing.com →' },
      { headline: 'NNRHA', sub: '(757) 928-2620 — Newport News Housing Authority', badge: 'Call →' },
      { headline: 'United Way 2-1-1', sub: 'Free 24/7 social service referral — dial 2-1-1', badge: 'Dial 211 →' },
      { headline: 'HUD Approved Programs', sub: 'Federal housing quality standards & oversight', link: '/resources', badge: 'See Resources →' },
    ],
    ticker: ['Virginia Housing: state-backed mortgages at below-market rates', 'NNRHA: (757) 928-2620 — Newport News Housing Authority', 'United Way 2-1-1: free social service referrals 24/7', 'HUD-approved programs — federal housing quality standards', 'See all partner resources on the Resources page'],
  },
  '/quiz': {
    color: '#D4AF37', accent: '#14B8A6', emoji: '🎯',
    cards: [
      { headline: 'Take the Quiz ↑', sub: '7 questions · 2 minutes · personalized program matches', link: '/quiz', badge: 'Start Now →' },
      { headline: 'After Your Quiz', sub: 'Book a free counseling session with your results', link: '/contact', badge: 'Contact →' },
      { headline: 'Try the Calculator', sub: 'See your estimated monthly payment on the Buy page', link: '/buy', badge: 'Calculate →' },
      { headline: 'Explore Neighborhoods', sub: 'Know where you want to live before you buy', link: '/neighborhoods', badge: 'Browse →' },
    ],
    ticker: ['Take the quiz above ↑ — 7 questions, 2 minutes', 'After your quiz, book a free counseling session', 'Try the Buying Power calculator on the Buy page', 'Browse neighborhoods before committing to a location', 'Veterans: ask your counselor about VA Home Loan options'],
  },
};

const FALLBACK_DATA = PAGE_DATA['/'];

function getPageData(path: string) {
  return PAGE_DATA[path] ?? FALLBACK_DATA;
}

// ─── SVG Actors ───────────────────────────────────────────────────────────────

function MegaDrone({ color }: { color: string }) {
  return (
    <svg width="160" height="96" viewBox="0 0 160 96" fill="none">
      {/* Arms */}
      <line x1="80" y1="48" x2="14" y2="16" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="80" y1="48" x2="146" y2="16" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="80" y1="48" x2="14" y2="80" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="80" y1="48" x2="146" y2="80" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* Motor housings */}
      {[[14,16],[146,16],[14,80],[146,80]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="10" fill="rgba(0,0,0,0.5)" stroke={color} strokeWidth="2" />
      ))}
      {/* Propeller discs */}
      {[[14,16],[146,16],[14,80],[146,80]].map(([cx,cy],i)=>(
        <ellipse key={i} cx={cx} cy={cy} rx="22" ry="7" fill={color} opacity="0.22" />
      ))}
      {/* Body */}
      <rect x="52" y="34" width="56" height="28" rx="10" fill={color} />
      <rect x="58" y="40" width="44" height="16" rx="5" fill="rgba(0,0,0,0.38)" />
      {/* LED status lights */}
      <circle cx="64" cy="56" r="3.5" fill="#00ff88" />
      <circle cx="73" cy="56" r="3.5" fill={color} opacity="0.6" />
      {/* Logo plate */}
      <rect x="82" y="42" width="22" height="12" rx="3" fill="rgba(0,0,0,0.3)" />
      <text x="93" y="51" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.7)" fontWeight="bold" fontFamily="Inter,sans-serif">NN.GOV</text>
      {/* Camera gimbal */}
      <circle cx="80" cy="66" r="9" fill="rgba(0,0,0,0.7)" />
      <circle cx="80" cy="66" r="5.5" fill="#1E3A5F" />
      <circle cx="82" cy="64" r="2" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}


function CityBus({ marquee }: { marquee: string }) {
  return (
    <svg width="220" height="76" viewBox="0 0 220 76" fill="none">
      {/* Body */}
      <rect x="4" y="10" width="212" height="52" rx="9" fill="#0F3F6A" />
      {/* Top stripe */}
      <rect x="4" y="10" width="212" height="14" rx="9" fill="#14517A" />
      {/* Windows strip */}
      {[18,56,94,132,170].map(x=>(
        <rect key={x} x={x} y="15" width="30" height="23" rx="5" fill="#B3E5FC" opacity="0.82" />
      ))}
      {/* Door */}
      <rect x="174" y="17" width="30" height="30" rx="4" fill="#87CEEB" opacity="0.55" />
      <line x1="189" y1="17" x2="189" y2="47" stroke="#0F3F6A" strokeWidth="1.5" />
      {/* LED sign */}
      <rect x="10" y="41" width="155" height="17" rx="3" fill="#000e00" />
      <text x="88" y="53" textAnchor="middle" fontSize="9.5" fill="#00ff44" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">
        {marquee.length > 28 ? marquee.slice(0,28) : marquee}
      </text>
      {/* City logo plate */}
      <rect x="170" y="42" width="42" height="16" rx="3" fill="#D4AF37" />
      <text x="191" y="53" textAnchor="middle" fontSize="7" fill="#0B2146" fontWeight="900" fontFamily="Inter,sans-serif">NEWPORT NEWS</text>
      {/* City seal */}
      <circle cx="14" cy="24" r="7" fill="#D4AF37" />
      <text x="14" y="28" textAnchor="middle" fontSize="8" fill="#0B2146" fontWeight="900">⚓</text>
      {/* Wheels */}
      {[42, 178].map(cx=>(
        <g key={cx}>
          <circle cx={cx} cy="68" r="11" fill="#111" />
          <circle cx={cx} cy="68" r="7" fill="#222" />
          <circle cx={cx} cy="68" r="3" fill="#444" />
          <line x1={cx-7} y1="68" x2={cx+7} y2="68" stroke="#333" strokeWidth="1.5" />
          <line x1={cx} y1="61" x2={cx} y2="75" stroke="#333" strokeWidth="1.5" />
        </g>
      ))}
      {/* Undercarriage */}
      <rect x="4" y="60" width="212" height="4" rx="2" fill="#0A2B4A" />
    </svg>
  );
}

function HotAirBalloon({ color, accent }: { color: string; accent: string }) {
  return (
    <svg width="110" height="175" viewBox="0 0 110 175" fill="none">
      {/* Balloon */}
      <ellipse cx="55" cy="62" rx="48" ry="58" fill={color} opacity="0.95" />
      {/* Panels */}
      <path d="M55 4 Q103 35 101 65 Q103 95 55 120 Q7 95 9 65 Q7 35 55 4Z" fill={color} />
      {/* Vertical panels */}
      {[0,1,2,3,4,5].map(i=>{
        const angle = (i/6)*Math.PI;
        const x1 = 55 + 48*Math.cos(angle - Math.PI/2);
        const y1 = 62 + 58*Math.sin(angle - Math.PI/2);
        const x2 = 55 + 48*Math.cos(angle + Math.PI/2);
        const y2 = 62 + 58*Math.sin(angle + Math.PI/2);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />;
      })}
      {/* Alternating color panels */}
      <path d="M55 4 Q55 62 55 120" stroke={accent} strokeWidth="3" opacity="0.5" />
      <path d="M7 62 Q55 62 103 62" stroke={accent} strokeWidth="2" opacity="0.4" />
      <path d="M15 30 Q55 45 95 30" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <path d="M11 90 Q55 78 99 90" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      {/* Center NN logo */}
      <circle cx="55" cy="62" r="16" fill="rgba(0,0,0,0.25)" />
      <text x="55" y="67" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.85)" fontWeight="900" fontFamily="Inter,sans-serif">NN</text>
      {/* Ropes */}
      {[28,40,55,70,82].map((x,i)=>(
        <line key={i} x1={x} y1={115} x2={x-4+(i*2)} y2={142} stroke="#6B4C11" strokeWidth="1.8" opacity="0.9" />
      ))}
      {/* Burner */}
      <rect x="44" y="118" width="22" height="10" rx="3" fill="#555" />
      <motion.ellipse
        cx="55" cy="118" rx="8" ry="5"
        fill="#FF6B00"
        animate={{ scaleY: [0.8, 1.5, 0.8], opacity: [0.7, 1, 0.7] }}
        style={{ transformOrigin: '55px 118px' }}
        transition={{ duration: 0.7, repeat: Infinity }}
      />
      {/* Basket */}
      <rect x="22" y="140" width="66" height="32" rx="7" fill="#8B5E15" />
      <rect x="24" y="142" width="62" height="28" rx="6" fill="#A0722A" />
      {/* Weave */}
      {[38,55,72].map(x=><line key={x} x1={x} y1={142} x2={x} y2={168} stroke="#6B4C11" strokeWidth="1.5"/>)}
      <line x1="24" y1="153" x2="86" y2="153" stroke="#6B4C11" strokeWidth="1.5" />
      {/* Passengers silhouettes */}
      <circle cx="38" cy="145" r="5" fill="#0B2146" />
      <circle cx="72" cy="145" r="5" fill="#0B2146" />
      <circle cx="55" cy="144" r="5" fill="#0B2146" />
    </svg>
  );
}


// ─── Flash helper ─────────────────────────────────────────────────────────────
function useFlash(interval = 220) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), interval);
    return () => clearInterval(id);
  }, [interval]);
  return on;
}

// Drone stays near the very top (just below the navbar) so it never covers content
const DRONE_TOP = 58;

// ─── Drone Scene ──────────────────────────────────────────────────────────────
function DroneScene({ color }: { color: string }) {
  const [phase, setPhase] = useState<'idle'|'entering'|'hovering'|'exiting'>('idle');
  const [cycleCount, setCycleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const runCycle = useCallback(() => {
    setCycleCount(c => c + 1);
    setPhase('entering');
    timerRef.current = setTimeout(() => {
      setPhase('hovering');
      timerRef.current = setTimeout(() => {
        setPhase('exiting');
        timerRef.current = setTimeout(() => setPhase('idle'), 2500);
      }, 6000);
    }, 2800);
  }, []);

  useEffect(() => {
    const t = setTimeout(runCycle, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'idle') {
      const id = setTimeout(runCycle, 22000);
      return () => clearTimeout(id);
    }
  }, [phase, runCycle]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const droneX = phase === 'idle' ? '110vw' :
                 phase === 'entering' ? '62vw' :
                 phase === 'hovering' ? '62vw' : '-20vw';

  const droneTop = DRONE_TOP;

  return (
    <motion.div style={{ position: 'fixed', top: droneTop, right: 0, left: 0, pointerEvents: 'none', zIndex: 9990 }}>
      <motion.div
        animate={{ x: droneX, y: phase === 'hovering' ? [0, -8, 0] : 0 }}
        transition={phase === 'hovering'
          ? { y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 0 } }
          : { x: { duration: phase === 'entering' ? 2.8 : 2.5, ease: phase === 'entering' ? [0.22,1,0.36,1] : [0.55,0,0.78,0] }, y: { duration: 0 } }
        }
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <MegaDrone color={color} />
      </motion.div>
    </motion.div>
  );
}

// ─── City Bus Scene ───────────────────────────────────────────────────────────
function BusScene({ ticker }: { ticker: string[] }) {
  const marquee = ticker[Math.floor(Date.now() / 1000) % ticker.length] ?? ticker[0];
  const flash = useFlash(300);

  return (
    <motion.div
      style={{ position: 'fixed', bottom: 38, left: 0, pointerEvents: 'none', zIndex: 9988 }}
      initial={{ x: '110vw' }}
      animate={{ x: [' 110vw', '-280px'] }}
      transition={{ duration: 12, delay: 8, repeat: Infinity, repeatDelay: 36, ease: 'linear' }}
    >
      <div style={{ position: 'relative' }}>
        {/* Exhaust puff */}
        <motion.div
          animate={{ scale: [0.8,1.6,0.8], opacity: [0.5,0.15,0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ position: 'absolute', right: -16, bottom: 6, width: 24, height: 18, borderRadius: '50%', background: 'rgba(180,180,180,0.35)' }}
        />
        {/* Status beacon */}
        <div style={{
          position: 'absolute', top: -6, left: 14,
          width: 8, height: 8, borderRadius: '50%',
          background: flash ? '#FF3B3B' : '#0A2B4A',
          boxShadow: flash ? '0 0 8px #FF3B3B' : 'none',
          transition: 'all 0.1s',
        }} />
        <CityBus marquee={marquee} />
      </div>
    </motion.div>
  );
}

// ─── Hot Air Balloon Scene ────────────────────────────────────────────────────
function BalloonScene({ color, accent }: { color: string; accent: string }) {
  return (
    <motion.div
      style={{ position: 'fixed', top: 68, right: 0, pointerEvents: 'none', zIndex: 9985 }}
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: [200, -600], opacity: [0, 1, 1, 0] }}
      transition={{ times: [0, 0.06, 0.9, 1], duration: 22, delay: 14, repeat: Infinity, repeatDelay: 40, ease: 'linear' }}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HotAirBalloon color={color} accent={accent} />
      </motion.div>
    </motion.div>
  );
}

// ─── City Hall Toast ──────────────────────────────────────────────────────────
function CityHallToast({
  cards, color, accent,
}: { cards: InfoCard[]; color: string; accent: string }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % cards.length);
        setVisible(true);
      }, 3000);
    }, 8000);
    return () => clearTimeout(hide);
  }, [visible, cards.length]);

  const card = cards[idx];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={idx}
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          style={{
            position: 'fixed', bottom: 50, right: 20, zIndex: 9999,
            width: 296,
            background: 'linear-gradient(145deg, #06122a 0%, #0f2347 100%)',
            border: `1.5px solid ${color}55`,
            borderRadius: 16,
            padding: '14px 18px 16px',
            boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px ${color}18`,
            fontFamily: 'Inter, sans-serif',
            pointerEvents: 'auto',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              background: `${color}18`, border: `1px solid ${color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>🏛️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                City of Newport News
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>Housing Hub Announcement</div>
            </div>
            <button
              onClick={() => setVisible(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}
            >×</button>
          </div>
          {/* Badge */}
          {card.badge && (
            <span style={{
              display: 'inline-block',
              background: `${color}20`, border: `1px solid ${color}45`,
              borderRadius: 6, padding: '2px 8px',
              fontSize: 8, fontWeight: 800, color, letterSpacing: '0.06em',
              marginBottom: 7,
            }}>{card.badge}</span>
          )}
          {/* Content */}
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 5 }}>
            {card.headline}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.58)', lineHeight: 1.55 }}>
            {card.sub}
          </div>
          {/* Divider */}
          <div style={{ marginTop: 12, height: 1.5, background: `linear-gradient(90deg, ${color}50, transparent)` }} />
          {/* Dots */}
          <div style={{ display: 'flex', gap: 5, marginTop: 10, justifyContent: 'center' }}>
            {cards.map((_, i) => (
              <div key={i} style={{ width: i === idx ? 16 : 6, height: 6, borderRadius: 3, background: i === idx ? color : 'rgba(255,255,255,0.15)', transition: 'all 0.3s' }} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── News Ticker ──────────────────────────────────────────────────────────────
function NewsTicker({ items }: { items: string[] }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9995,
        height: 34, display: 'flex', alignItems: 'stretch', overflow: 'hidden',
        background: 'rgba(6, 18, 42, 0.93)',
        borderTop: '1.5px solid rgba(212,175,55,0.3)',
        backdropFilter: 'blur(6px)',
        pointerEvents: 'none',
      }}
    >
      {/* LIVE badge */}
      <div style={{
        background: 'linear-gradient(90deg, #D4AF37, #F5C842)',
        color: '#0B2146', padding: '0 12px',
        display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 9, fontWeight: 900, letterSpacing: '0.12em', whiteSpace: 'nowrap',
        flexShrink: 0, fontFamily: 'Inter, sans-serif',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0B2146', display: 'inline-block' }} />
        LIVE
      </div>
      {/* Scrolling text */}
      <div style={{ overflow: 'hidden', flex: 1, display: 'flex', alignItems: 'center' }}>
        <motion.div
          style={{ display: 'flex', gap: 64, whiteSpace: 'nowrap' }}
          animate={{ x: [0, -2400] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        >
          {doubled.map((item, i) => (
            <span key={i} style={{ fontSize: 11, color: '#E2E8F0', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#14B8A6', fontSize: 8 }}>◆</span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
      {/* Right logo */}
      <div style={{
        padding: '0 12px', display: 'flex', alignItems: 'center',
        fontSize: 9, fontWeight: 700, color: 'rgba(212,175,55,0.7)',
        letterSpacing: '0.08em', whiteSpace: 'nowrap', flexShrink: 0,
        fontFamily: 'Inter, sans-serif', borderLeft: '1px solid rgba(212,175,55,0.2)',
      }}>
        ⚓ Newport News
      </div>
    </div>
  );
}

// ─── Street Sign Post ─────────────────────────────────────────────────────────
function StreetSignPost({ cards, color, accent }: { cards: InfoCard[]; color: string; accent: string }) {
  const [up, setUp] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);

  useEffect(() => {
    const show = setTimeout(() => {
      setUp(true);
      setTimeout(() => {
        setUp(false);
        setTimeout(() => {
          setCardIdx(i => (i + 1) % cards.length);
        }, 800);
      }, 7000);
    }, 5500);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!up) {
      const id = setTimeout(() => {
        setUp(true);
        setTimeout(() => setUp(false), 7000);
      }, 28000);
      return () => clearTimeout(id);
    }
  }, [up]);

  const card = cards[cardIdx];

  return (
    <motion.div
      style={{ position: 'fixed', left: 40, bottom: 34, zIndex: 9987, pointerEvents: 'none' }}
      animate={{ y: up ? 0 : 260 }}
      transition={{ type: 'spring', stiffness: 150, damping: 22 }}
    >
      {/* Sign arms */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {/* Top directional sign */}
        <div style={{
          background: `linear-gradient(135deg, ${color}18, ${color}0a)`,
          border: `2px solid ${color}`,
          borderRadius: 8, padding: '8px 16px',
          fontFamily: 'Inter, sans-serif',
          boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', gap: 8,
          minWidth: 200,
        }}>
          <div style={{ fontSize: 18 }}>{card.badge?.includes('Grant') ? '💰' : card.badge?.includes('Call') ? '📞' : '📌'}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{card.headline}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{card.sub}</div>
          </div>
        </div>
        {/* Second sign */}
        <div style={{ width: 3, height: 10, background: '#666' }} />
        <div style={{
          background: accent,
          borderRadius: 6, padding: '5px 14px',
          fontSize: 9, fontWeight: 900, color: '#0B2146',
          letterSpacing: '0.1em', fontFamily: 'Inter, sans-serif',
        }}>
          NEWPORT NEWS HOUSING HUB
        </div>
        {/* Pole */}
        <div style={{ width: 4, height: 120, background: 'linear-gradient(180deg, #888, #555)', borderRadius: 2 }} />
        {/* Base */}
        <div style={{ width: 36, height: 8, background: '#444', borderRadius: 4 }} />
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const SKIP_PAGES = new Set(['/simulator', '/sign-in', '/sign-up']);

export function CityLiveFeed() {
  const [location] = useLocation();
  const path = location.split('?')[0];

  if (SKIP_PAGES.has(path)) return null;

  const data = getPageData(path);
  const cards = data.cards;

  return (
    <>
      <DroneScene   color={data.color} />
      <BusScene     ticker={data.ticker} />
      <BalloonScene color={data.color} accent={data.accent} />
      <StreetSignPost cards={cards} color={data.color} accent={data.accent} />
      <CityHallToast cards={cards} color={data.color} accent={data.accent} />
      <NewsTicker items={data.ticker} />
    </>
  );
}
