/**
 * CityLiveFeed — site-wide cinematic info-delivery overlay.
 * Actors: Mega Drone, City Bus, Hot Air Balloon, City Hall Toast, News Ticker.
 * Page-aware: pulls relevant stats per route. Fixed overlay, pointer-events: none (except toasts).
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

// ─── Page-specific content ────────────────────────────────────────────────────

interface InfoCard { headline: string; sub: string; badge?: string }

const PAGE_DATA: Record<string, { color: string; accent: string; emoji: string; cards: InfoCard[]; ticker: string[] }> = {
  '/': {
    color: '#14B8A6', accent: '#D4AF37', emoji: '🏡',
    cards: [
      { headline: '2,400+ Families Assisted', sub: 'City housing programs & counseling services', badge: 'Community Impact' },
      { headline: '$18M Aid Distributed', sub: 'Grants, vouchers & emergency help since 2020', badge: 'City Investment' },
      { headline: '340 Affordable Units', sub: 'Available right now in Newport News', badge: 'Housing Stock' },
      { headline: '92% Satisfaction', sub: 'Families served rate our programs excellent', badge: 'Our Record' },
    ],
    ticker: ['2,400+ families helped by Newport News housing programs', '$18M in housing aid distributed citywide', '340 affordable units available now', 'Free HUD-approved housing counseling — call (757) 933-2311', '92% satisfaction rate from residents we\'ve served'],
  },
  '/buy': {
    color: '#D4AF37', accent: '#14B8A6', emoji: '🔑',
    cards: [
      { headline: 'Up to $25K Down Payment', sub: 'City-backed first-time buyer assistance programs', badge: 'Grant Available' },
      { headline: 'Credit Score 580+', sub: 'You may still qualify — counselors can help', badge: 'Low Barrier' },
      { headline: 'Free HUD Counseling', sub: 'No-cost guidance from certified housing advisors', badge: 'No Cost' },
      { headline: '30+ Programs Available', sub: 'Federal, state and city assistance combined', badge: 'Many Options' },
    ],
    ticker: ['First-time buyers: up to $25K down payment assistance available', 'Credit score as low as 580 may qualify for programs', 'Free HUD-certified housing counseling — no appointment needed', 'Newport News median home price: ~$280K', '30+ homebuyer programs between federal, state and city'],
  },
  '/rent': {
    color: '#60A5FA', accent: '#14B8A6', emoji: '🏢',
    cards: [
      { headline: 'Section 8 Vouchers', sub: 'Subsidy program for income-qualifying residents', badge: 'HUD Program' },
      { headline: 'FMR ~$1,500/2BR', sub: 'Fair Market Rent benchmark for Newport News 2026', badge: 'Market Rate' },
      { headline: 'VA Rent Relief', sub: 'Emergency rental assistance for hardship cases', badge: 'Emergency Aid' },
      { headline: 'Income < 50% AMI', sub: 'Section 8 eligibility threshold for the area', badge: 'Eligibility' },
    ],
    ticker: ['Section 8 vouchers — income qualifying residents may apply', 'Newport News Fair Market Rent: ~$1,500 for a 2-bedroom', 'Virginia Rent Relief Program available for hardship cases', 'Emergency rental assistance: call (757) 933-2311', '50% AMI income limit for Section 8 voucher eligibility'],
  },
  '/neighborhoods': {
    color: '#34D399', accent: '#D4AF37', emoji: '📍',
    cards: [
      { headline: 'Hilton Village ~$320K', sub: 'Historic charm, walkable streets, artisan shops', badge: 'Most Historic' },
      { headline: 'Denbigh ~$285K', sub: 'Spacious lots, great parks, suburban feel', badge: 'Family Friendly' },
      { headline: 'Oyster Point ~$350K', sub: 'Modern condos, bustling commerce, dining', badge: 'Most Modern' },
      { headline: 'Southeast ~$210K', sub: 'Rich heritage, waterfront views, community focus', badge: 'Best Value' },
    ],
    ticker: ['Hilton Village: avg ~$320K — historic charm and walkability', 'Denbigh: avg ~$285K — spacious suburban neighborhood', 'Oyster Point: avg ~$350K — modern living and dining', 'Southeast Newport News: avg ~$210K — waterfront heritage', '50+ parks and 14 miles of trails across Newport News'],
  },
  '/assistance': {
    color: '#F87171', accent: '#D4AF37', emoji: '🤝',
    cards: [
      { headline: 'Emergency: (757) 587-4202', sub: 'Virginia Peninsula Housing Crisis Hotline', badge: 'Call Now' },
      { headline: 'Up to $25K Help', sub: 'First-time buyer and emergency assistance grants', badge: 'Grant' },
      { headline: 'Eviction Prevention', sub: 'Legal aid and rent assistance to keep you housed', badge: 'Protection' },
      { headline: '2-1-1 United Way', sub: 'Free social services referral line, 24/7', badge: '24/7 Help' },
    ],
    ticker: ['Housing Crisis Hotline: (757) 587-4202 — free & confidential', 'Up to $25K emergency housing assistance available', 'Eviction prevention: call (757) 933-2311 immediately', '2-1-1 United Way Virginia: 24/7 referral service', 'NNRHA: (757) 928-2620 — housing authority resources'],
  },
  '/resources': {
    color: '#A78BFA', accent: '#14B8A6', emoji: '📚',
    cards: [
      { headline: 'SHIP Plan: Feb 2026', sub: 'Strategic Housing Initiatives Plan adopted', badge: 'New Policy' },
      { headline: '4 Pillars of SHIP', sub: 'Reform · Production · Affordability · Preservation', badge: 'Framework' },
      { headline: 'Virginia Housing', sub: 'State mortgages with below-market interest rates', badge: 'State Program' },
      { headline: 'Missing Middle Focus', sub: 'Townhomes & duplexes to expand housing supply', badge: 'SHIP Goal' },
    ],
    ticker: ['SHIP Plan adopted February 2026 — expanding affordable housing', 'Virginia Housing: below-market mortgage rates available', 'HUD-approved housing counseling — free to all residents', 'Missing Middle housing: townhomes & duplexes being prioritized', 'NNRHA manages 1,500+ public housing units in the city'],
  },
  '/events': {
    color: '#FB923C', accent: '#D4AF37', emoji: '📅',
    cards: [
      { headline: 'Beyond the Keys', sub: 'Homebuyer workshop — Aug 8, 2026 · 9:30–11 AM', badge: 'Upcoming' },
      { headline: 'Home & Health Expo', sub: 'Community expo — Sep 24, 2026 · 10 AM–2 PM', badge: 'Upcoming' },
      { headline: 'Bank On Hampton Roads', sub: 'Free 5-month financial literacy program', badge: 'Ongoing' },
      { headline: 'Free Workshops', sub: 'Homebuying education every month — register free', badge: 'Free' },
    ],
    ticker: ['Beyond the Keys workshop: Aug 8, 2026 — register today', 'Home & Healthy Living Expo: Sep 24, 2026 at Newport News', 'Bank On Hampton Roads: free 5-month financial literacy program', 'Monthly homebuyer education workshops — no cost to attend', 'All events free & open to Newport News residents'],
  },
  '/contact': {
    color: '#14B8A6', accent: '#D4AF37', emoji: '📞',
    cards: [
      { headline: '(757) 933-2311', sub: 'City Housing Line — Mon–Fri 8am–5pm', badge: 'Call Us' },
      { headline: '2400 Washington Ave', sub: 'Newport News, VA 23607 — walk-ins welcome', badge: 'Visit Us' },
      { headline: '2 Business Days', sub: 'Counselor response time goal', badge: 'Fast Response' },
      { headline: 'housing@nnva.gov', sub: 'Email our team for non-urgent questions', badge: 'Email' },
    ],
    ticker: ['City Housing Line: (757) 933-2311 — Mon–Fri 8am–5pm', '2400 Washington Avenue, Newport News VA 23607', 'Counselor response goal: 2 business days', 'Email: housing@newportnewsva.gov', 'Walk-in hours: Monday–Friday 8:00 AM to 5:00 PM'],
  },
  '/journey': {
    color: '#34D399', accent: '#D4AF37', emoji: '🗺️',
    cards: [
      { headline: 'Start 6–12 Months Early', sub: 'Financial prep timeline before buying', badge: 'Timeline' },
      { headline: 'Credit Score 620+', sub: 'Target score for most homebuyer programs', badge: 'Credit Goal' },
      { headline: 'Free HUD Counseling', sub: 'All pathways — renting, buying, repairs', badge: 'Free Guidance' },
      { headline: '5 Pathways Available', sub: 'Rent · Buy · Own · Repair · Emergency', badge: 'Your Options' },
    ],
    ticker: ['Start your homebuying journey 6–12 months before purchasing', 'Target credit score: 620+ for most city programs', 'Free HUD-approved counseling — all income levels welcome', '5 housing pathways: Rent, Buy, Own, Repair, Emergency', 'Newport News connects you to the right program for your stage'],
  },
  '/services': {
    color: '#60A5FA', accent: '#14B8A6', emoji: '🏙️',
    cards: [
      { headline: 'Pay Utility Bill Online', sub: 'Water, gas & electric — quick online payments', badge: 'City Service' },
      { headline: 'NN-ALERT System', sub: 'Sign up for emergency city alerts', badge: 'Safety' },
      { headline: 'City Jobs Available', sub: 'Employment with the City of Newport News', badge: 'Work Here' },
      { headline: 'Report an Issue', sub: 'Keep Newport News clean — report problems online', badge: 'Civic' },
    ],
    ticker: ['Pay utility bills online at newportnewsva.gov', 'NN-ALERT: sign up for emergency notifications', 'City of Newport News is hiring — apply at city HR portal', 'Report neighborhood issues via the city\'s online portal', 'Trash & recycling schedules at newportnewsva.gov/solidwaste'],
  },
  '/success-stories': {
    color: '#D4AF37', accent: '#14B8A6', emoji: '⭐',
    cards: [
      { headline: 'Marcus T., Age 26', sub: 'Bought first home in Denbigh using city grants', badge: 'Success Story' },
      { headline: 'Alicia M., Hilton', sub: '+120 credit score points through counseling', badge: 'Credit Journey' },
      { headline: '$18M in Aid', sub: 'Distributed to Newport News residents since 2020', badge: 'City Impact' },
      { headline: '2,400+ Families', sub: 'Helped find their path to stable housing', badge: 'Community' },
    ],
    ticker: ['Marcus T. bought his first home at 26 using city grant programs', 'Alicia M. improved her credit score by 120 points in one year', '$18M in housing aid distributed to Newport News residents', '2,400+ families assisted through city housing programs', 'Your success story could be next — start your journey today'],
  },
  '/why-newport-news': {
    color: '#34D399', accent: '#D4AF37', emoji: '⚓',
    cards: [
      { headline: 'Newport News Shipbuilding', sub: 'Largest industrial employer in all of Virginia', badge: 'Top Employer' },
      { headline: '50+ Parks & Trails', sub: '14 miles of trails including the Noland Trail', badge: 'Outdoors' },
      { headline: '~10 Min to Work', sub: 'Southeast to Shipbuilding commute time', badge: 'Short Commute' },
      { headline: 'James River Waterfront', sub: 'Walk the boardwalk any morning of the week', badge: 'Waterfront' },
    ],
    ticker: ['Newport News Shipbuilding (HII) — largest industrial employer in Virginia', '50+ parks and 14 miles of trails including Noland Trail', 'Southeast to Shipbuilding: ~10-minute commute', 'Walk the James River boardwalk any morning', 'Newport News: military families, professionals, lifelong residents all call home'],
  },
  '/checklist': {
    color: '#14B8A6', accent: '#D4AF37', emoji: '✅',
    cards: [
      { headline: 'Step 1: Check Credit', sub: 'Aim for 620+ before applying for programs', badge: 'First Step' },
      { headline: 'Save 1–3% Down', sub: 'Virginia programs need as little as 1% down', badge: 'Savings Goal' },
      { headline: '6–12 Month Prep', sub: 'Start preparing well before you want to buy', badge: 'Timeline' },
      { headline: 'Free Checklist', sub: 'Download the Newport News homebuyer guide', badge: 'Free Tool' },
    ],
    ticker: ['Homebuyer checklist: start with a credit check — aim for 620+', 'Virginia programs accept down payments as low as 1%', 'Begin financial prep 6–12 months before your target purchase date', 'Download the free Newport News homebuyer checklist today', 'A housing counselor will walk through every step with you — free'],
  },
  '/ship': {
    color: '#A78BFA', accent: '#D4AF37', emoji: '📋',
    cards: [
      { headline: 'SHIP Adopted Feb 2026', sub: 'Strategic Housing Initiatives Plan is active', badge: 'Live Policy' },
      { headline: '4 SHIP Pillars', sub: 'Reform · Production · Affordability · Preservation', badge: 'Framework' },
      { headline: 'Missing Middle Push', sub: 'Duplexes & townhomes to expand housing stock', badge: 'New Supply' },
      { headline: 'Regulatory Reform', sub: 'Zoning changes to allow more housing types', badge: 'Policy Change' },
    ],
    ticker: ['SHIP Plan: Newport News Strategic Housing Initiatives Plan — adopted Feb 2026', '4 pillars: Regulatory Reform, Production, Affordability, Preservation', '"Missing Middle" housing: townhomes & duplexes being prioritized', 'Zoning reform underway to allow more housing types citywide', 'SHIP goal: create more pathways to stable, affordable housing'],
  },
  '/partners': {
    color: '#FB923C', accent: '#14B8A6', emoji: '🤝',
    cards: [
      { headline: 'Virginia Housing', sub: 'State mortgages at below-market interest rates', badge: 'State Partner' },
      { headline: 'NNRHA', sub: 'Newport News Redevelopment & Housing Authority', badge: 'Local Partner' },
      { headline: 'United Way 2-1-1', sub: 'Social service referrals available 24/7', badge: '24/7' },
      { headline: 'HUD Approved', sub: 'Federal housing standards and program oversight', badge: 'Federal' },
    ],
    ticker: ['Virginia Housing: state-backed mortgages at below-market rates', 'NNRHA: (757) 928-2620 — Newport News Housing Authority', 'United Way 2-1-1: free social service referrals around the clock', 'HUD-approved programs meet federal housing quality standards', 'HOME of Virginia and Fair Housing partners active in the city'],
  },
  '/quiz': {
    color: '#D4AF37', accent: '#14B8A6', emoji: '🎯',
    cards: [
      { headline: '7-Question Quiz', sub: 'Find your matched housing programs in 2 minutes', badge: 'Quick & Easy' },
      { headline: 'VA Home Loans', sub: 'Veterans may qualify for zero down payment', badge: 'Veterans' },
      { headline: 'Section 8 Matching', sub: 'Check eligibility for housing choice vouchers', badge: 'Rental Help' },
      { headline: 'DPA Grants', sub: 'Down Payment Assistance matched to your situation', badge: 'Free Money' },
    ],
    ticker: ['Take the housing quiz — 7 questions, 2 minutes, personalized results', 'Veterans: VA Home Loans offer zero down payment options', 'Section 8 housing choice vouchers — check your eligibility now', 'Down Payment Assistance grants matched to your income and goals', 'Quiz matches you to 30+ federal, state and city programs'],
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

function BigInfoCard({ card, color, accent }: { card: InfoCard; color: string; accent: string }) {
  return (
    <div style={{
      width: 240,
      background: 'linear-gradient(145deg, #06122a 0%, #0f2347 60%, #162e55 100%)',
      border: `2.5px solid ${color}`,
      borderRadius: 16,
      padding: '16px 20px 18px',
      boxShadow: `0 16px 50px rgba(0,0,0,0.65), 0 0 0 1px ${color}30, inset 0 1px 0 rgba(255,255,255,0.06)`,
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 8, fontWeight: 900, color: accent, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          🏛 City of Newport News
        </div>
        {card.badge && (
          <span style={{
            background: `${color}20`, border: `1px solid ${color}50`,
            borderRadius: 6, padding: '2px 7px', fontSize: 8, fontWeight: 800,
            color, letterSpacing: '0.05em',
          }}>{card.badge}</span>
        )}
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 7 }}>
        {card.headline}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>{card.sub}</div>
      <div style={{ marginTop: 12, height: 2, background: `linear-gradient(90deg, ${color}, transparent)`, borderRadius: 1 }} />
    </div>
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

function BalloonSign({ card, color, accent }: { card: InfoCard; color: string; accent: string }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}18, ${color}08)`,
      border: `2px solid ${color}`,
      borderRadius: 10,
      padding: '10px 16px',
      width: 200,
      backdropFilter: 'blur(10px)',
      boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px ${color}20`,
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ fontSize: 8, fontWeight: 800, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
        🏛 Newport News Housing
      </div>
      <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: 5 }}>{card.headline}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{card.sub}</div>
    </div>
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

// ─── Drone Scene ──────────────────────────────────────────────────────────────
function DroneScene({ color, accent, card }: { color: string; accent: string; card: InfoCard }) {
  const [cardVisible, setCardVisible] = useState(false);
  const [phase, setPhase] = useState<'idle'|'entering'|'hovering'|'exiting'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const runCycle = useCallback(() => {
    setPhase('entering');
    timerRef.current = setTimeout(() => {
      setCardVisible(true);
      setPhase('hovering');
      timerRef.current = setTimeout(() => {
        setCardVisible(false);
        setPhase('exiting');
        timerRef.current = setTimeout(() => {
          setPhase('idle');
        }, 2500);
      }, 7000);
    }, 2800);
  }, []);

  useEffect(() => {
    const initial = setTimeout(runCycle, 2000);
    return () => clearTimeout(initial);
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

  return (
    <motion.div
      style={{ position: 'fixed', top: 80, right: 0, left: 0, pointerEvents: 'none', zIndex: 9990 }}
    >
      <motion.div
        animate={{ x: droneX, y: phase === 'hovering' ? [0, -6, 0] : 0 }}
        transition={phase === 'hovering'
          ? { y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 0 } }
          : { x: { duration: phase === 'entering' ? 2.8 : 2.5, ease: phase === 'entering' ? [0.22,1,0.36,1] : [0.55,0,0.78,0] }, y: { duration: 0 } }
        }
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <MegaDrone color={color} />

        {/* Cable + card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -4 }}>
          {/* Cable */}
          <motion.div
            animate={{ height: cardVisible ? 80 : 0, opacity: cardVisible ? 1 : 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ width: 2, background: `linear-gradient(180deg, ${color}80, rgba(255,255,255,0.3))`, borderRadius: 1 }}
          />
          {/* Hook */}
          <AnimatePresence>
            {cardVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.4, y: -20 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              >
                <BigInfoCard card={card} color={color} accent={accent} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
function BalloonScene({ color, accent, card }: { color: string; accent: string; card: InfoCard }) {
  const [showSign, setShowSign] = useState(false);
  return (
    <motion.div
      style={{ position: 'fixed', top: '28%', right: 0, pointerEvents: 'none', zIndex: 9985 }}
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: [200, -600], opacity: [0, 1, 1, 0] }}
      transition={{ times: [0, 0.06, 0.9, 1], duration: 22, delay: 14, repeat: Infinity, repeatDelay: 40, ease: 'linear' }}
      onUpdate={(l) => { if ((l.x as number) < 100) setShowSign(true); }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative' }}
      >
        <HotAirBalloon color={color} accent={accent} />
        {/* Hanging sign on a rope */}
        <AnimatePresence>
          {showSign && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 178 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 2, height: 28, background: 'rgba(255,255,255,0.4)' }} />
                <BalloonSign card={card} color={color} accent={accent} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
  // Rotate which card goes to each actor so they all show different content
  const cards = data.cards;
  const droneCard   = cards[0];
  const balloonCard = cards[1] ?? cards[0];

  return (
    <>
      <DroneScene   color={data.color} accent={data.accent} card={droneCard} />
      <BusScene     ticker={data.ticker} />
      <BalloonScene color={data.color} accent={data.accent} card={balloonCard} />
      <StreetSignPost cards={cards} color={data.color} accent={data.accent} />
      <CityHallToast cards={cards} color={data.color} accent={data.accent} />
      <NewsTicker items={data.ticker} />
    </>
  );
}
