/**
 * CityHomeFeed — home page only.
 * Police car chase, ambulance (with sirens), Disney characters,
 * Marvel Avengers, and a one-time Grinch run across the top.
 * All elements use position:fixed inside the separate city-overlay root.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

// ─── Web Audio Sounds ─────────────────────────────────────────────────────────

let _actx: AudioContext | null = null;
function actx(): AudioContext | null {
  try {
    if (!_actx || _actx.state === 'closed') _actx = new AudioContext();
    if (_actx.state === 'suspended') void _actx.resume();
    return _actx;
  } catch { return null; }
}

function playSiren(type: 'police' | 'ambulance', durSec: number) {
  const ctx = actx(); if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.2);
    gain.gain.setValueAtTime(0.07, now + durSec - 0.3);
    gain.gain.linearRampToValueAtTime(0, now + durSec);
    const [hi, lo, beat] = type === 'police' ? [970, 760, 0.40] : [640, 430, 0.60];
    const n = Math.ceil(durSec / beat);
    for (let i = 0; i < n; i++) osc.frequency.setValueAtTime(i % 2 === 0 ? hi : lo, now + i * beat);
    osc.start(now); osc.stop(now + durSec);
  } catch { /* autoplay blocked — fail silently */ }
}

function playWhoosh() {
  const ctx = actx(); if (!ctx) return;
  try {
    const len = Math.floor(ctx.sampleRate * 0.55);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.4) * 0.055;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.value = 1900; filt.Q.value = 0.6;
    src.connect(filt); filt.connect(ctx.destination);
    src.start(ctx.currentTime); src.stop(ctx.currentTime + 0.55);
  } catch { /* silently fail */ }
}

// Flashing light helper
function useFlash(ms = 220) {
  const [on, setOn] = useState(false);
  useEffect(() => { const id = setInterval(() => setOn(v => !v), ms); return () => clearInterval(id); }, [ms]);
  return on;
}

// ─── Vehicle SVGs ─────────────────────────────────────────────────────────────

function GetawayCar() {
  return (
    <svg width="118" height="44" viewBox="0 0 196 74" style={{ overflow: 'visible' }}>
      <rect x="8" y="27" width="180" height="33" rx="9" fill="#B91C1C" />
      <rect x="28" y="10" width="122" height="29" rx="8" fill="#DC2626" />
      <rect x="36" y="13" width="46" height="22" rx="5" fill="#FCA5A5" opacity="0.5" />
      <rect x="88" y="13" width="48" height="22" rx="5" fill="#FCA5A5" opacity="0.5" />
      {/* Dent / damage */}
      <path d="M170 30 Q176 28 182 32 Q178 36 172 34 Z" fill="#991B1B" />
      {/* Speed lines */}
      <line x1="4" y1="31" x2="-20" y2="31" stroke="#FECACA" strokeWidth="3" strokeDasharray="6 4" opacity="0.7" />
      <line x1="4" y1="40" x2="-32" y2="40" stroke="#FECACA" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
      <line x1="4" y1="49" x2="-16" y2="49" stroke="#FECACA" strokeWidth="2" strokeDasharray="6 4" opacity="0.35" />
      {[50, 152].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy={60} r={14} fill="#111" />
          <circle cx={cx} cy={60} r={8} fill="#444" />
          <circle cx={cx} cy={60} r={3} fill="#777" />
        </g>
      ))}
    </svg>
  );
}

function PoliceCar() {
  const fl = useFlash(200);
  return (
    <svg width="137" height="50" viewBox="0 0 228 84" style={{ overflow: 'visible' }}>
      {/* Body */}
      <rect x="12" y="28" width="200" height="38" rx="10" fill="#1E3A8A" />
      {/* Cabin */}
      <rect x="36" y="10" width="140" height="30" rx="9" fill="#2563EB" />
      {/* Light bar */}
      <rect x="58" y="4" width="102" height="12" rx="6" fill="#0F172A" />
      <rect x="63" y="6" width="42" height="8" rx="3" fill={fl ? '#EF4444' : '#7F1D1D'} />
      <rect x="114" y="6" width="42" height="8" rx="3" fill={fl ? '#60A5FA' : '#1E3A8A'} />
      {/* Windows */}
      <rect x="46" y="13" width="50" height="24" rx="5" fill="#BFDBFE" opacity="0.88" />
      <rect x="102" y="13" width="66" height="24" rx="5" fill="#BFDBFE" opacity="0.88" />
      {/* POLICE text */}
      <text x="114" y="57" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial,sans-serif" letterSpacing="2">POLICE</text>
      {/* Badge */}
      <text x="30" y="58" fontSize="18" fill="#FCD34D">★</text>
      {/* Bumpers */}
      <rect x="202" y="44" width="20" height="14" rx="4" fill="#93C5FD" />
      <rect x="6" y="44" width="20" height="14" rx="4" fill="#93C5FD" />
      {/* Wheels */}
      {[58, 170].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy={66} r={18} fill="#111" />
          <circle cx={cx} cy={66} r={10} fill="#444" />
          <circle cx={cx} cy={66} r={4} fill="#888" />
          <line x1={cx} y1={48} x2={cx} y2={84} stroke="#666" strokeWidth="1.5" />
          <line x1={cx - 18} y1={66} x2={cx + 18} y2={66} stroke="#666" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

function AmbulanceSVG() {
  const fl = useFlash(270);
  return (
    <svg width="161" height="57" viewBox="0 0 268 96" style={{ overflow: 'visible' }}>
      {/* Box body */}
      <rect x="8" y="20" width="252" height="58" rx="7" fill="white" stroke="#CBD5E1" strokeWidth="2" />
      {/* Cab */}
      <rect x="8" y="20" width="66" height="58" rx="7" fill="#F1F5F9" />
      <line x1="74" y1="20" x2="74" y2="78" stroke="#CBD5E1" strokeWidth="2" />
      {/* Light bar */}
      <rect x="24" y="10" width="66" height="14" rx="7" fill="#1E293B" />
      <rect x="28" y="12" width="26" height="10" rx="4" fill={fl ? '#EF4444' : '#7F1D1D'} />
      <rect x="58" y="12" width="26" height="10" rx="4" fill={fl ? '#F8FAFC' : '#94A3B8'} />
      {/* Red cross */}
      <rect x="118" y="33" width="60" height="22" rx="4" fill="#DC2626" />
      <rect x="136" y="27" width="24" height="34" rx="4" fill="#DC2626" />
      <rect x="139" y="30" width="18" height="28" rx="3" fill="white" />
      <rect x="121" y="37" width="54" height="14" rx="3" fill="white" />
      {/* AMBULANCE */}
      <text x="134" y="74" textAnchor="middle" fontSize="12" fontWeight="900" fill="#DC2626" fontFamily="Arial,sans-serif" letterSpacing="1.5">AMBULANCE</text>
      {/* Cab window */}
      <rect x="16" y="28" width="48" height="34" rx="5" fill="#BAE6FD" opacity="0.82" />
      {/* Wheels */}
      {[64, 204].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy={78} r={18} fill="#111" />
          <circle cx={cx} cy={78} r={10} fill="#444" />
          <circle cx={cx} cy={78} r={4} fill="#777" />
        </g>
      ))}
    </svg>
  );
}

// ─── Character SVGs ───────────────────────────────────────────────────────────

function MickeyMouse() {
  return (
    <svg width="40" height="52" viewBox="0 0 56 72" style={{ overflow: 'visible' }}>
      {/* Ears */}
      <circle cx="11" cy="13" r="12" fill="#111" />
      <circle cx="45" cy="13" r="12" fill="#111" />
      {/* Head */}
      <circle cx="28" cy="27" r="18" fill="#111" />
      {/* Face */}
      <ellipse cx="28" cy="29" rx="13" ry="12" fill="#FDBCB4" />
      {/* Eyes */}
      <ellipse cx="22" cy="25" rx="3.5" ry="4" fill="white" />
      <ellipse cx="34" cy="25" rx="3.5" ry="4" fill="white" />
      <circle cx="23" cy="25" r="2" fill="#111" />
      <circle cx="35" cy="25" r="2" fill="#111" />
      <circle cx="23.8" cy="24" r="0.8" fill="white" />
      <circle cx="35.8" cy="24" r="0.8" fill="white" />
      {/* Nose */}
      <ellipse cx="28" cy="33" rx="4.5" ry="3" fill="#111" />
      {/* Smile */}
      <path d="M20 36 Q28 44 36 36" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* White gloves */}
      <circle cx="7" cy="52" r="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      <circle cx="49" cy="52" r="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      {/* Body — red shorts */}
      <rect x="16" y="45" width="24" height="16" rx="4" fill="#CC0000" />
      <rect x="19" y="48" width="6" height="3" rx="1.5" fill="#FFD700" />
      <rect x="31" y="48" width="6" height="3" rx="1.5" fill="#FFD700" />
      {/* Legs */}
      <rect x="16" y="60" width="10" height="11" rx="3" fill="#111" />
      <rect x="30" y="60" width="10" height="11" rx="3" fill="#111" />
      {/* Yellow shoes */}
      <ellipse cx="20" cy="71" rx="9" ry="4.5" fill="#F59E0B" />
      <ellipse cx="36" cy="71" rx="9" ry="4.5" fill="#F59E0B" />
    </svg>
  );
}

function MinnieMouse() {
  return (
    <svg width="40" height="57" viewBox="0 0 56 80" style={{ overflow: 'visible' }}>
      {/* Ears */}
      <circle cx="11" cy="13" r="12" fill="#111" />
      <circle cx="45" cy="13" r="12" fill="#111" />
      {/* Polka dot bow on left ear */}
      <ellipse cx="4" cy="6" rx="8" ry="5" fill="#FF1744" transform="rotate(-30 4 6)" />
      <ellipse cx="18" cy="6" rx="8" ry="5" fill="#FF1744" transform="rotate(30 18 6)" />
      <circle cx="11" cy="7" r="4" fill="#FF1744" />
      <circle cx="5" cy="5" r="1.2" fill="white" opacity="0.5" />
      <circle cx="16" cy="4" r="1.2" fill="white" opacity="0.5" />
      <circle cx="13" cy="10" r="1.2" fill="white" opacity="0.5" />
      {/* Head */}
      <circle cx="28" cy="27" r="18" fill="#111" />
      {/* Face */}
      <ellipse cx="28" cy="29" rx="13" ry="12" fill="#FDBCB4" />
      {/* Eyes */}
      <ellipse cx="22" cy="25" rx="3.5" ry="4" fill="white" />
      <ellipse cx="34" cy="25" rx="3.5" ry="4" fill="white" />
      <circle cx="23" cy="25" r="2" fill="#111" />
      <circle cx="35" cy="25" r="2" fill="#111" />
      {/* Eyelashes */}
      <line x1="20" y1="22" x2="18" y2="20" stroke="#111" strokeWidth="1.2" />
      <line x1="22" y1="21" x2="21" y2="19" stroke="#111" strokeWidth="1.2" />
      <line x1="32" y1="21" x2="33" y2="19" stroke="#111" strokeWidth="1.2" />
      <line x1="34" y1="22" x2="36" y2="20" stroke="#111" strokeWidth="1.2" />
      {/* Nose */}
      <ellipse cx="28" cy="33" rx="4" ry="2.8" fill="#111" />
      {/* Smile */}
      <path d="M20 36 Q28 44 36 36" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* White gloves */}
      <circle cx="6" cy="55" r="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      <circle cx="50" cy="55" r="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      {/* Polka dot dress */}
      <path d="M15 46 Q28 44 41 46 L44 72 L12 72 Z" fill="#FF1744" />
      <circle cx="22" cy="55" r="2.5" fill="white" opacity="0.65" />
      <circle cx="34" cy="52" r="2" fill="white" opacity="0.65" />
      <circle cx="28" cy="60" r="2.5" fill="white" opacity="0.65" />
      <circle cx="20" cy="64" r="2" fill="white" opacity="0.65" />
      <circle cx="36" cy="63" r="2" fill="white" opacity="0.65" />
      {/* Legs */}
      <rect x="17" y="70" width="9" height="9" rx="3" fill="#111" />
      <rect x="30" y="70" width="9" height="9" rx="3" fill="#111" />
      <ellipse cx="21" cy="79" rx="8" ry="4" fill="#F59E0B" />
      <ellipse cx="35" cy="79" rx="8" ry="4" fill="#F59E0B" />
    </svg>
  );
}

function Elsa() {
  return (
    <svg width="31" height="54" viewBox="0 0 44 76" style={{ overflow: 'visible' }}>
      {/* Ice crown */}
      <polygon points="8,10 12,2 16,8 20,0 24,8 28,2 32,10" fill="#BAE6FD" opacity="0.9" />
      {/* Braid */}
      <path d="M28 12 Q34 28 30 50 Q28 60 26 72" stroke="#FDE68A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M28 12 Q34 28 30 50 Q28 60 26 72" stroke="#FCD34D" strokeWidth="2" fill="none" strokeDasharray="3 4" />
      {/* Hair */}
      <ellipse cx="22" cy="14" rx="14" ry="12" fill="#FDE68A" />
      {/* Face */}
      <ellipse cx="22" cy="15" rx="10" ry="11" fill="#FFDFC4" />
      {/* Eyes */}
      <ellipse cx="17" cy="13" rx="2.5" ry="3" fill="#38BDF8" />
      <ellipse cx="27" cy="13" rx="2.5" ry="3" fill="#38BDF8" />
      <circle cx="17.8" cy="13" r="1.2" fill="#0369A1" />
      <circle cx="27.8" cy="13" r="1.2" fill="#0369A1" />
      {/* Rosy cheeks */}
      <ellipse cx="13" cy="17" rx="3" ry="2" fill="#FECDD3" opacity="0.6" />
      <ellipse cx="31" cy="17" rx="3" ry="2" fill="#FECDD3" opacity="0.6" />
      {/* Lips */}
      <path d="M18 20 Q22 24 26 20" stroke="#F9A8D4" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Dress bodice */}
      <path d="M10 26 L14 50 L30 50 L34 26 Q22 22 10 26Z" fill="#0284C7" />
      <path d="M12 26 L32 26 Q22 23 12 26Z" fill="#7DD3FC" />
      {/* Flowing skirt */}
      <path d="M14 50 Q8 60 6 76 L38 76 Q36 60 30 50Z" fill="#38BDF8" opacity="0.85" />
      {/* Ice sparkles */}
      <text x="2" y="42" fontSize="10">❄️</text>
      <text x="34" y="38" fontSize="8">✨</text>
      {/* Arms */}
      <line x1="10" y1="28" x2="2" y2="44" stroke="#7DD3FC" strokeWidth="4" strokeLinecap="round" />
      <line x1="34" y1="28" x2="42" y2="44" stroke="#7DD3FC" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function SpiderMan() {
  return (
    <svg width="34" height="51" viewBox="0 0 48 72" style={{ overflow: 'visible' }}>
      {/* Head */}
      <circle cx="24" cy="11" r="11" fill="#CC0000" />
      {/* Web eyes */}
      <ellipse cx="18" cy="9" rx="5" ry="4" fill="white" opacity="0.92" />
      <ellipse cx="30" cy="9" rx="5" ry="4" fill="white" opacity="0.92" />
      <ellipse cx="18" cy="9" rx="3.5" ry="2.8" fill="#C0C0C0" />
      <ellipse cx="30" cy="9" rx="3.5" ry="2.8" fill="#C0C0C0" />
      {/* Web lines on head */}
      <line x1="24" y1="0" x2="24" y2="22" stroke="black" strokeWidth="0.6" opacity="0.4" />
      <line x1="13" y1="3" x2="35" y2="19" stroke="black" strokeWidth="0.6" opacity="0.4" />
      <line x1="35" y1="3" x2="13" y2="19" stroke="black" strokeWidth="0.6" opacity="0.4" />
      {/* Torso — blue */}
      <rect x="14" y="22" width="20" height="22" rx="4" fill="#1E3A8A" />
      {/* Red sides */}
      <rect x="10" y="22" width="6" height="20" rx="3" fill="#CC0000" />
      <rect x="32" y="22" width="6" height="20" rx="3" fill="#CC0000" />
      {/* Spider symbol */}
      <path d="M24 27 L22 32 L26 32 Z" fill="#111" />
      <line x1="24" y1="27" x2="18" y2="24" stroke="#111" strokeWidth="1" />
      <line x1="24" y1="27" x2="30" y2="24" stroke="#111" strokeWidth="1" />
      <line x1="24" y1="32" x2="18" y2="35" stroke="#111" strokeWidth="1" />
      <line x1="24" y1="32" x2="30" y2="35" stroke="#111" strokeWidth="1" />
      {/* Arms — red */}
      <rect x="1" y="23" width="10" height="5" rx="2.5" fill="#CC0000" />
      <rect x="37" y="23" width="10" height="5" rx="2.5" fill="#CC0000" />
      {/* Hands */}
      <circle cx="0" cy="25" r="4" fill="#CC0000" />
      <circle cx="48" cy="25" r="4" fill="#CC0000" />
      {/* Legs */}
      <rect x="14" y="44" width="8" height="20" rx="3" fill="#1E3A8A" />
      <rect x="26" y="44" width="8" height="20" rx="3" fill="#1E3A8A" />
      {/* Boots */}
      <ellipse cx="18" cy="64" rx="8" ry="4.5" fill="#CC0000" />
      <ellipse cx="30" cy="64" rx="8" ry="4.5" fill="#CC0000" />
      {/* Web line shooting out */}
      <line x1="48" y1="23" x2="62" y2="8" stroke="#E5E7EB" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

function IronMan() {
  return (
    <svg width="37" height="54" viewBox="0 0 52 76" style={{ overflow: 'visible' }}>
      {/* Helmet */}
      <rect x="10" y="2" width="32" height="24" rx="8" fill="#CC0000" />
      {/* Face plate */}
      <rect x="12" y="10" width="28" height="14" rx="5" fill="#B91C1C" />
      {/* Eye slits */}
      <rect x="13" y="13" width="9" height="4" rx="2" fill="#FDE68A" />
      <rect x="30" y="13" width="9" height="4" rx="2" fill="#FDE68A" />
      {/* Chin */}
      <rect x="16" y="22" width="20" height="6" rx="3" fill="#991B1B" />
      {/* Chest */}
      <rect x="8" y="26" width="36" height="26" rx="5" fill="#CC0000" />
      {/* Gold chest detail */}
      <rect x="11" y="29" width="30" height="20" rx="4" fill="#B45309" />
      {/* Arc reactor */}
      <circle cx="26" cy="39" r="6" fill="#BAE6FD" />
      <circle cx="26" cy="39" r="4" fill="#7DD3FC" />
      <circle cx="26" cy="39" r="2" fill="white" />
      <circle cx="25" cy="38" r="0.8" fill="rgba(255,255,255,0.6)" />
      {/* Shoulder pads */}
      <rect x="-2" y="25" width="12" height="10" rx="4" fill="#CC0000" />
      <rect x="42" y="25" width="12" height="10" rx="4" fill="#CC0000" />
      {/* Arms */}
      <rect x="-2" y="34" width="10" height="14" rx="4" fill="#B45309" />
      <rect x="44" y="34" width="10" height="14" rx="4" fill="#B45309" />
      {/* Repulsor hands */}
      <circle cx="2" cy="47" r="5" fill="#BAE6FD" opacity="0.85" />
      <circle cx="50" cy="47" r="5" fill="#BAE6FD" opacity="0.85" />
      {/* Legs */}
      <rect x="10" y="52" width="14" height="20" rx="3" fill="#CC0000" />
      <rect x="28" y="52" width="14" height="20" rx="3" fill="#CC0000" />
      {/* Boots */}
      <rect x="8" y="66" width="16" height="10" rx="4" fill="#B45309" />
      <rect x="28" y="66" width="16" height="10" rx="4" fill="#B45309" />
      {/* Boot jets glow */}
      <ellipse cx="16" cy="76" rx="6" ry="3" fill="#FED7AA" opacity="0.7" />
      <ellipse cx="36" cy="76" rx="6" ry="3" fill="#FED7AA" opacity="0.7" />
    </svg>
  );
}

function Hulk() {
  return (
    <svg width="49" height="57" viewBox="0 0 68 80" style={{ overflow: 'visible' }}>
      {/* Big green body */}
      {/* Head */}
      <circle cx="34" cy="14" r="16" fill="#22C55E" />
      {/* Brow ridge */}
      <ellipse cx="34" cy="8" rx="15" ry="6" fill="#16A34A" />
      {/* Mean eyes */}
      <ellipse cx="26" cy="13" rx="5" ry="4" fill="#FEF08A" />
      <ellipse cx="42" cy="13" rx="5" ry="4" fill="#FEF08A" />
      <circle cx="26" cy="13" r="2.5" fill="#15803D" />
      <circle cx="42" cy="13" r="2.5" fill="#15803D" />
      <circle cx="26.8" cy="12" r="1" fill="black" />
      <circle cx="42.8" cy="12" r="1" fill="black" />
      {/* Angry eyebrows */}
      <line x1="21" y1="8" x2="30" y2="11" stroke="#14532D" strokeWidth="3" strokeLinecap="round" />
      <line x1="47" y1="8" x2="38" y2="11" stroke="#14532D" strokeWidth="3" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="34" cy="18" rx="4" ry="3" fill="#16A34A" />
      {/* Mouth — big grin */}
      <path d="M24 23 Q34 32 44 23" stroke="#14532D" strokeWidth="2.5" fill="#14532D" strokeLinecap="round" />
      {/* Massive chest */}
      <rect x="8" y="30" width="52" height="30" rx="8" fill="#22C55E" />
      {/* Purple torn pants */}
      <rect x="14" y="55" width="40" height="24" rx="5" fill="#7C3AED" />
      {/* Torn bottom */}
      <path d="M14 70 L10 80 L22 74 L26 80 L30 72 L34 80 L38 72 L42 80 L46 74 L54 80 L54 70 Z" fill="#6D28D9" />
      {/* Massive arms */}
      <rect x="-8" y="28" width="18" height="32" rx="8" fill="#22C55E" />
      <rect x="58" y="28" width="18" height="32" rx="8" fill="#22C55E" />
      {/* Fists */}
      <circle cx="-2" cy="60" r="10" fill="#16A34A" />
      <circle cx="70" cy="60" r="10" fill="#16A34A" />
      {/* Veins on arms */}
      <path d="M-6 38 Q-4 42 -2 46" stroke="#16A34A" strokeWidth="2" fill="none" />
      <path d="M60 38 Q62 42 64 46" stroke="#16A34A" strokeWidth="2" fill="none" />
      {/* Legs */}
      <rect x="14" y="74" width="16" height="6" rx="3" fill="#6D28D9" />
      <rect x="38" y="74" width="16" height="6" rx="3" fill="#6D28D9" />
    </svg>
  );
}

function GrinchChar() {
  return (
    <svg width="44" height="60" viewBox="0 0 62 84" style={{ overflow: 'visible' }}>
      {/* Santa hat */}
      <polygon points="12,20 31,0 50,16" fill="#CC0000" />
      <rect x="8" y="20" width="46" height="8" rx="4" fill="white" />
      <circle cx="31" cy="0" r="5" fill="white" />
      {/* Furry head — textured green */}
      <circle cx="31" cy="36" r="22" fill="#22C55E" />
      {/* Fur tufts */}
      {[[-12,8],[12,6],[-16,22],[16,20],[-14,36],[14,34]].map(([dx,dy],i)=>(
        <circle key={i} cx={31+dx} cy={36+dy} r={5} fill="#16A34A" />
      ))}
      {/* Yellow evil eyes */}
      <ellipse cx="22" cy="32" rx="6" ry="5" fill="#FEF08A" />
      <ellipse cx="40" cy="32" rx="6" ry="5" fill="#FEF08A" />
      <circle cx="22" cy="32" r="3" fill="#15803D" />
      <circle cx="40" cy="32" r="3" fill="#15803D" />
      <circle cx="23" cy="31" r="1.2" fill="black" />
      <circle cx="41" cy="31" r="1.2" fill="black" />
      {/* Sinister angled eyebrows */}
      <path d="M16 26 L27 30" stroke="#14532D" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M46 26 L35 30" stroke="#14532D" strokeWidth="3.5" strokeLinecap="round" />
      {/* Big nose */}
      <ellipse cx="31" cy="40" rx="5" ry="4" fill="#16A34A" />
      {/* The Grinch grin */}
      <path d="M18 47 Q31 60 44 47" fill="#14532D" />
      <path d="M18 47 Q31 56 44 47" stroke="#4ADE80" strokeWidth="1.5" fill="none" />
      {/* Teeth */}
      <rect x="24" y="48" width="4" height="5" rx="1" fill="white" />
      <rect x="30" y="47" width="4" height="6" rx="1" fill="white" />
      <rect x="36" y="48" width="4" height="5" rx="1" fill="white" />
      {/* Green furry body */}
      <rect x="16" y="57" width="30" height="20" rx="6" fill="#22C55E" />
      {/* Stolen bag */}
      <circle cx="52" cy="60" r="12" fill="#854D0E" />
      <rect x="48" y="50" width="4" height="10" rx="2" fill="#92400E" />
      {/* Bag contents peeking out */}
      <text x="46" y="64" fontSize="9">🎁</text>
      {/* Arms */}
      <path d="M16 62 Q6 58 0 66" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M46 62 Q56 56 52 50" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <rect x="17" y="74" width="11" height="10" rx="3" fill="#22C55E" />
      <rect x="34" y="74" width="11" height="10" rx="3" fill="#22C55E" />
      {/* Furry feet */}
      <ellipse cx="22" cy="84" rx="10" ry="5" fill="#16A34A" />
      <ellipse cx="40" cy="84" rx="10" ry="5" fill="#16A34A" />
    </svg>
  );
}

// ─── Bouncing runner wrapper ──────────────────────────────────────────────────
function Bounce({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0, -6, 0] }}
      transition={{ duration: 0.38, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

// ─── Scheduled sound hook ─────────────────────────────────────────────────────
function useScheduled(fn: () => void, delayMs: number, repeatMs: number | null) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn();
      if (repeatMs !== null) {
        const id = setInterval(fn, repeatMs);
        return () => clearInterval(id);
      }
    }, delayMs);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

// ─── Police Chase ─────────────────────────────────────────────────────────────
// Getaway car bolts past first, police in hot pursuit.
// ANIMATION TIMINGS (delay + duration + repeatDelay = repeat period)
// Getaway:  delay=18s, dur=6s,   repeatDelay=66s  → fires at t=18, 90, 162 …
// Police:   delay=19s, dur=7.5s, repeatDelay=64.5s → fires at t=19, 91, 163 …
// Sound:    fires at t=18, 90, 162 … (8s of siren per pass)
function PoliceChaseScene() {
  useScheduled(() => playSiren('police', 8), 18_000, 72_000);
  return (
    <>
      <motion.div style={{ position: 'fixed', bottom: 40, right: 0, pointerEvents: 'none', zIndex: 9989 }}
        initial={{ x: '115vw' }} animate={{ x: ['115vw', '-230px'] }}
        transition={{ duration: 6, delay: 18, repeat: Infinity, repeatDelay: 66, ease: 'linear' }}>
        <GetawayCar />
      </motion.div>
      <motion.div style={{ position: 'fixed', bottom: 40, right: 0, pointerEvents: 'none', zIndex: 9990 }}
        initial={{ x: '130vw' }} animate={{ x: ['130vw', '-230px'] }}
        transition={{ duration: 7.5, delay: 19, repeat: Infinity, repeatDelay: 64.5, ease: 'linear' }}>
        <PoliceCar />
      </motion.div>
    </>
  );
}

// ─── Ambulance ────────────────────────────────────────────────────────────────
// Fires at t=38, 118, 198 …
function AmbulanceScene() {
  useScheduled(() => playSiren('ambulance', 10), 38_000, 80_000);
  return (
    <motion.div style={{ position: 'fixed', bottom: 40, right: 0, pointerEvents: 'none', zIndex: 9991 }}
      initial={{ x: '115vw' }} animate={{ x: ['115vw', '-290px'] }}
      transition={{ duration: 10, delay: 38, repeat: Infinity, repeatDelay: 70, ease: 'linear' }}>
      <AmbulanceSVG />
    </motion.div>
  );
}

// ─── Character Parade ─────────────────────────────────────────────────────────
// Characters run left-to-right across the very top (just below the navbar).
// Grinch is one-time only (repeat: 0).
//
// Schedule (delay / travel duration / repeatDelay):
//   Mickey   : 10s / 5s  / 82s  → every 87s starting t=10
//   Minnie   : 24s / 5.5s/ 86s  → every 91.5s starting t=24
//   Spidey   : 38s / 4s  / 90s  → every 94s starting t=38
//   Iron Man : 52s / 4s  / 90s  → every 94s starting t=52
//   Elsa     : 66s / 5.5s/ 84s  → every 89.5s starting t=66
//   Hulk     : 78s / 4.5s/ 88s  → every 92.5s starting t=78
//   Grinch   : 95s / 3.5s/ —    → once only

type CharEntry = {
  id: string;
  El: React.ComponentType;
  top: number;
  delay: number;
  dur: number;
  repeatDelay: number;
  repeat: number;
};

const CHARS: CharEntry[] = [
  { id: 'mickey',   El: MickeyMouse, top: 62, delay: 10, dur: 5,   repeatDelay: 82,  repeat: Infinity },
  { id: 'minnie',   El: MinnieMouse, top: 58, delay: 24, dur: 5.5, repeatDelay: 86,  repeat: Infinity },
  { id: 'spidey',   El: SpiderMan,   top: 62, delay: 38, dur: 4,   repeatDelay: 90,  repeat: Infinity },
  { id: 'ironman',  El: IronMan,     top: 60, delay: 52, dur: 4,   repeatDelay: 90,  repeat: Infinity },
  { id: 'elsa',     El: Elsa,        top: 64, delay: 66, dur: 5.5, repeatDelay: 84,  repeat: Infinity },
  { id: 'hulk',     El: Hulk,        top: 56, delay: 78, dur: 4.5, repeatDelay: 88,  repeat: Infinity },
  { id: 'grinch',   El: GrinchChar,  top: 57, delay: 95, dur: 3.5, repeatDelay: 0,   repeat: 0 },
];

// One component per character so each can legally call useEffect for its sound.
function CharRun({ id, El, top, delay, dur, repeatDelay, repeat }: CharEntry) {
  // Whoosh fires midway through the run; for repeating chars it re-fires each cycle.
  const midMs = Math.round((delay + dur / 2) * 1000);
  const cycleMs = repeat === 0 ? null : Math.round((dur + repeatDelay) * 1000);
  useScheduled(playWhoosh, midMs, cycleMs);

  return (
    <motion.div
      style={{ position: 'fixed', top, right: 0, pointerEvents: 'none', zIndex: 9982 }}
      initial={{ x: '110vw' }}
      animate={{ x: ['110vw', '-160px'] }}
      transition={{ duration: dur, delay, repeat, repeatDelay, ease: 'linear' }}
    >
      <Bounce><El /></Bounce>
    </motion.div>
  );
}

function CharacterParadeScene() {
  return <>{CHARS.map(c => <CharRun key={c.id} {...c} />)}</>;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function CityHomeFeed() {
  const [location] = useLocation();
  const path = location.split('?')[0];
  if (path !== '/') return null;

  return (
    <>
      <PoliceChaseScene />
      <AmbulanceScene />
      <CharacterParadeScene />
    </>
  );
}
