import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGameStore } from '@/store/gameStore';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';
import { GameHUD } from '@/components/GameHUD';
import { SpeechBubble } from '@/components/SpeechBubble';
import { SceneTransition } from '@/components/SceneTransition';
import { AchievementToast } from '@/components/AchievementToast';
import { ResultsCard } from '@/components/ResultsCard';
import { SmartPhone } from '@/components/SmartPhone';
import { LifeEventModal } from '@/components/LifeEventModal';
import { CityExitButton } from '@/components/CityExitButton';
import { IsometricCamera } from '@/components/IsometricCamera';
import { GroundPlane } from '@/components/GroundPlane';
import { PlayerCharacter } from '@/components/characters/PlayerCharacter';
import { DraggablePanel } from '@/components/ui/DraggablePanel';
import { homes } from '@/data/homes';
import CityMapScene from '@/scenes/CityMapScene';
import HomeInteriorScene from '@/scenes/HomeInteriorScene';
import HomeLifeScene from '@/scenes/HomeLifeScene';

import ApartmentScene from '@/scenes/ApartmentScene';
import CounselorOfficeScene from '@/scenes/CounselorOfficeScene';
import NeighborhoodScene from '@/scenes/NeighborhoodScene';
import NegotiationScene from '@/scenes/NegotiationScene';
import BankScene from '@/scenes/BankScene';
import ClosingScene from '@/scenes/ClosingScene';
import NewHomeScene from '@/scenes/NewHomeScene';

// ── Location → interior scene ────────────────────────────────────
const LOCATION_SCENES: Record<string, React.ComponentType> = {
  apartment:   ApartmentScene,
  counselor:   CounselorOfficeScene,
  realestate:  NeighborhoodScene,
  home_tour:   HomeInteriorScene,
  negotiation: NegotiationScene,
  bank:        BankScene,
  closing:     ClosingScene,
  newhome:     NewHomeScene,
  homelife:    HomeLifeScene,
};

// ── Lighting configs ─────────────────────────────────────────────
type LightCfg = {
  ambient: number; ambientColor: string;
  keyColor: string; keyIntensity: number; keyPos: [number, number, number];
  fillColor: string; fillIntensity: number;
  rimColor: string; rimIntensity: number;
  fogColor: string; fogNear: number; fogFar: number;
  envPreset: 'apartment' | 'city' | 'park' | 'lobby' | 'warehouse' | 'forest';
  accentColor: string; accentPos: [number, number, number];
};

const CITY_CFG: LightCfg = {
  ambient: 0.75, ambientColor: '#FFF0DA',
  keyColor: '#FFFBF0', keyIntensity: 2.0, keyPos: [30, 28, 20],
  fillColor: '#FFE7C2', fillIntensity: 0.8,
  rimColor: '#FFD700', rimIntensity: 0.35,
  fogColor: '#87CEEB', fogNear: 45, fogFar: 100,
  envPreset: 'park',
  accentColor: '#FFE680', accentPos: [0, 14, -10],
};

const INTERIOR_CFG: Record<string, LightCfg> = {
  apartment: {
    ambient: 0.45, ambientColor: '#FFF5E0',
    keyColor: '#FFD580', keyIntensity: 1.4, keyPos: [8, 14, 6],
    fillColor: '#FFE4B5', fillIntensity: 0.5,
    rimColor: '#87CEEB', rimIntensity: 0.3,
    fogColor: '#FFF8F0', fogNear: 22, fogFar: 55,
    envPreset: 'apartment',
    accentColor: '#FFB347', accentPos: [-6, 5, -4],
  },
  counselor: {
    ambient: 0.5, ambientColor: '#FFF2DC',
    keyColor: '#FFF6E8', keyIntensity: 1.3, keyPos: [10, 16, 8],
    fillColor: '#FFE4B5', fillIntensity: 0.45,
    rimColor: '#0A8F7E', rimIntensity: 0.25,
    fogColor: '#EEF2F8', fogNear: 24, fogFar: 60,
    envPreset: 'lobby',
    accentColor: '#FFD9A0', accentPos: [0, 6, -4],
  },
  realestate: {
    ambient: 0.7, ambientColor: '#FFF0DA',
    keyColor: '#FFFBF0', keyIntensity: 2.2, keyPos: [20, 22, 15],
    fillColor: '#FFE7C2', fillIntensity: 0.8,
    rimColor: '#FFD700', rimIntensity: 0.4,
    fogColor: '#87CEEB', fogNear: 40, fogFar: 90,
    envPreset: 'park',
    accentColor: '#FFE680', accentPos: [0, 12, -10],
  },
  negotiation: {
    ambient: 0.35, ambientColor: '#FFF0E0',
    keyColor: '#FFD080', keyIntensity: 1.5, keyPos: [6, 14, 4],
    fillColor: '#FFF5D0', fillIntensity: 0.35,
    rimColor: '#C0392B', rimIntensity: 0.2,
    fogColor: '#F8F0E8', fogNear: 20, fogFar: 50,
    envPreset: 'lobby',
    accentColor: '#FFB347', accentPos: [-6, 8, -5],
  },
  bank: {
    ambient: 0.6, ambientColor: '#EEF4FF',
    keyColor: '#E8F0FF', keyIntensity: 1.8, keyPos: [0, 18, 0],
    fillColor: '#FFE4B5', fillIntensity: 0.6,
    rimColor: '#4080FF', rimIntensity: 0.25,
    fogColor: '#E8EFF8', fogNear: 28, fogFar: 65,
    envPreset: 'city',
    accentColor: '#8AB0FF', accentPos: [5, 6, 0],
  },
  closing: {
    ambient: 0.5, ambientColor: '#FFF8E8',
    keyColor: '#FFD96A', keyIntensity: 1.6, keyPos: [8, 15, 6],
    fillColor: '#FFE8A0', fillIntensity: 0.5,
    rimColor: '#0A8F7E', rimIntensity: 0.3,
    fogColor: '#FFF8F0', fogNear: 22, fogFar: 55,
    envPreset: 'apartment',
    accentColor: '#FFD700', accentPos: [0, 8, -4],
  },
  newhome: {
    ambient: 0.55, ambientColor: '#FFF9F0',
    keyColor: '#FFEDAA', keyIntensity: 1.5, keyPos: [8, 16, 8],
    fillColor: '#FFE8D0', fillIntensity: 0.45,
    rimColor: '#87CEEB', rimIntensity: 0.3,
    fogColor: '#FFF8F0', fogNear: 25, fogFar: 60,
    envPreset: 'apartment',
    accentColor: '#FFD96A', accentPos: [-6, 8, -6],
  },
  home_tour: {
    ambient: 0.55, ambientColor: '#FFF8F0',
    keyColor: '#FFE0AA', keyIntensity: 1.6, keyPos: [10, 18, 10],
    fillColor: '#FFE8D0', fillIntensity: 0.5,
    rimColor: '#87CEEB', rimIntensity: 0.25,
    fogColor: '#FFF8F0', fogNear: 28, fogFar: 70,
    envPreset: 'apartment',
    accentColor: '#FFD96A', accentPos: [-4, 6, -4],
  },
  homelife: {
    ambient: 0.6, ambientColor: '#FFF9F0',
    keyColor: '#FFE8B0', keyIntensity: 1.7, keyPos: [10, 18, 10],
    fillColor: '#FFE8D0', fillIntensity: 0.55,
    rimColor: '#87CEEB', rimIntensity: 0.28,
    fogColor: '#FFF8F0', fogNear: 30, fogFar: 72,
    envPreset: 'apartment',
    accentColor: '#FFD700', accentPos: [-4, 7, -4],
  },
};

// ── Tour checklist overlay ────────────────────────────────────────

const TOUR_ROOMS = ['entry', 'living', 'kitchen', 'bedroom', 'backyard'] as const;
const TOUR_ROOM_LABELS: Record<string, { text: string; icon: GameIconName }> = {
  entry:    { text: 'Entry Hallway', icon: 'home' },
  living:   { text: 'Living Room', icon: 'furniture' },
  kitchen:  { text: 'Kitchen', icon: 'kitchen' },
  bedroom:  { text: 'Bedroom', icon: 'bed' },
  backyard: { text: 'Backyard', icon: 'leaf' },
};

function TourChecklist() {
  const currentLocation = useGameStore((s) => s.currentLocation);
  const selectedHomeId   = useGameStore((s) => s.selectedHomeId);
  const tourProgress     = useGameStore((s) => s.tourProgress);
  const startNegotiation = useGameStore((s) => s.startNegotiation);
  const setTransitioning = useGameStore((s) => s.setTransitioning);

  if (currentLocation !== 'home_tour') return null;

  const homeKey  = String(selectedHomeId ?? 1);
  const visited  = tourProgress[homeKey] ?? [];
  const allDone  = TOUR_ROOMS.every((r) => visited.includes(r));

  const handleOffer = () => {
    setTransitioning(true);
    setTimeout(() => { startNegotiation(); setTransitioning(false); }, 900);
  };

  return (
    <div style={{
      position: 'fixed', top: 120, left: 12, zIndex: 32,
      background: 'rgba(17,14,21,0.92)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 12, padding: '12px 14px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      fontFamily: 'Inter, sans-serif', minWidth: 178,
      marginTop: 4,
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#ffea00', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <GameIcon name="search-home" size={18} /> Tour Checklist
      </div>
      {TOUR_ROOMS.map((room) => {
        const seen = visited.includes(room);
        const label = TOUR_ROOM_LABELS[room];
        return (
          <div key={room} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 16, padding: '3px 0',
            color: seen ? '#4ade80' : 'rgba(255,255,255,0.45)',
            fontWeight: seen ? 700 : 400,
          }}>
            <span style={{ width: 14, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <GameIcon name={seen ? 'check' : 'uncheck'} size={16} color={seen ? '#4ade80' : 'rgba(255,255,255,0.3)'} />
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <GameIcon name={label.icon} size={16} /> {label.text}
            </span>
          </div>
        );
      })}
      {allDone && (
        <div style={{
          marginTop: 8, padding: '4px 8px', borderRadius: 6,
          background: 'rgba(10,143,126,0.18)',
          border: '1px solid rgba(10,143,126,0.4)',
          fontSize: 15, fontWeight: 700, color: '#00f0ff', textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
        }}>
          <GameIcon name="sparkles" size={16} /> Fully Inspected!
        </div>
      )}
      <button onClick={handleOffer} style={{
        marginTop: 10, width: '100%', padding: '8px', borderRadius: 8,
        background: '#ffea00', color: '#09070a', border: 'none',
        cursor: 'pointer', fontWeight: 800, fontSize: 16,
        fontFamily: 'Inter, sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
      }}>
        {allDone ? <><GameIcon name="home" size={16} /> Make an Offer →</> : 'Make an Offer →'}
      </button>
      {!allDone && (
        <div style={{ marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
          Walk through all rooms to fully inspect
        </div>
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────

function SceneLighting({ cfg }: { cfg: LightCfg }) {
  return (
    <>
      <ambientLight intensity={cfg.ambient} color={cfg.ambientColor} />
      <directionalLight
        position={cfg.keyPos}
        intensity={cfg.keyIntensity}
        color={cfg.keyColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
      />
      <pointLight position={[-12, 10, -8]} intensity={cfg.fillIntensity} color={cfg.fillColor} />
      <pointLight position={[0, 2, 12]} intensity={cfg.rimIntensity} color={cfg.rimColor} />
      <pointLight position={cfg.accentPos} intensity={0.4} color={cfg.accentColor} />
    </>
  );
}

function SceneContents() {
  const currentLocation = useGameStore((s) => s.currentLocation);
  const isCity = currentLocation === 'city';
  const cfg = isCity ? CITY_CFG : (INTERIOR_CFG[currentLocation] ?? INTERIOR_CFG['apartment']);
  const InteriorScene = LOCATION_SCENES[currentLocation];

  return (
    <>
      <fog attach="fog" args={[cfg.fogColor, cfg.fogNear, cfg.fogFar]} />
      <SceneLighting cfg={cfg} />
      <Environment preset={cfg.envPreset} backgroundIntensity={0} />
      <GroundPlane size={isCity ? 80 : 60} />
      <PlayerCharacter />
      {isCity
        ? <CityMapScene />
        : InteriorScene
          ? <InteriorScene />
          : null /* unknown location — render nothing rather than wrong scene */
      }
      <IsometricCamera />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.35}
          luminanceSmoothing={0.9}
          intensity={isCity ? 0.4 : 0.7}
          mipmapBlur
        />
        <Vignette offset={0.38} darkness={isCity ? 0.3 : 0.55} />
      </EffectComposer>
    </>
  );
}

function formatTitle(id: string): string {
  return id
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ── Home-Life Draggable Overlays ──────────────────────────────────
function HomeLifeOverlays() {
  const {
    stage, listingOpen, setListingOpen, dashboardOpen, setDashboardOpen,
    homeValue, mortgageBalance, mortgagePayment, mortgageRate, cash,
    selectedHomeId, pendingMaintenance, homeLifeMonths,
    advanceHomeLifeMonth, payDownMortgage, refinanceMortgage,
  } = useGameStore();

  // Sub-panel view within the listing modal
  const [activeAction, setActiveAction] = useState<'none' | 'paydown' | 'refinance'>('none');
  // Selected paydown amount
  const [paydownAmt, setPaydownAmt]     = useState(0);
  // Selected refinance tier index
  const [refiIdx, setRefiIdx]           = useState(0);

  // Reset sub-view when modal opens/closes
  useEffect(() => {
    if (!listingOpen) { setActiveAction('none'); setPaydownAmt(0); setRefiIdx(0); }
  }, [listingOpen]);

  if (stage !== 8) return null;

  const home         = homes.find((h) => h.id === selectedHomeId) ?? homes[0];
  const equityValue  = Math.max(0, homeValue - mortgageBalance);
  const equityPct    = homeValue > 0 ? (equityValue / homeValue) * 100 : 0;
  const curRate      = mortgageRate ?? 6.5;
  const monthlyRate  = curRate / 100 / 12;
  const interestPortion = Math.round(mortgageBalance * monthlyRate);
  const taxInsurance    = Math.round(home.price * 0.015 / 12);
  const principal       = Math.max(0, (mortgagePayment || home.monthlyPayment) - interestPortion - taxInsurance);
  const agentFee        = Math.round(homeValue * 0.05);
  const closingCosts    = Math.round(homeValue * 0.02);
  const estProfit       = homeValue - agentFee - closingCosts - mortgageBalance;

  // ── Refinance tier options ────────────────────────────────────────
  const refiTiers = [
    { label: 'Standard',  rate: 6.0,  fee: 3500,  minMonths: 0,  badge: 'Available Now' },
    { label: 'Better',    rate: 5.5,  fee: 4500,  minMonths: 6,  badge: '6+ Months' },
    { label: 'Best Rate', rate: 5.0,  fee: 5500,  minMonths: 18, badge: '18+ Months' },
  ].filter((t) => homeLifeMonths >= t.minMonths && t.rate < curRate);

  const calcPayment = (rate: number, bal: number) => {
    const r = rate / 100 / 12;
    return Math.round(bal * r / (1 - Math.pow(1 + r, -360)));
  };

  // ── Shared button style factory ───────────────────────────────────
  const btn = (color: string, bg: string, border = 'transparent'): React.CSSProperties => ({
    padding: '9px 10px', borderRadius: 'var(--glass-radius)',
    background: bg, color, border: `1px solid ${border}`,
    cursor: 'pointer', fontWeight: 700, fontSize: 10,
    fontFamily: 'Inter,sans-serif', transition: 'opacity 0.15s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
  });
  const btnFull = (color: string, bg: string, border = 'transparent'): React.CSSProperties => ({
    ...btn(color, bg, border), width: '100%', marginBottom: 6,
  });
  const row: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', fontSize: 11,
    padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
  };
  const dimTxt = { color: 'rgba(255,255,255,0.55)' };
  const panel = (bg: string): React.CSSProperties => ({
    background: bg, borderRadius: 'var(--glass-radius)', padding: '10px 12px', marginBottom: 10,
  });

  return (
    <>
      {dashboardOpen && (
        <DraggablePanel
          id="home-dashboard"
          title="Home Dashboard"
          icon="home"
          defaultPosition={{ x: 16, y: 90 }}
          onClose={() => setDashboardOpen(false)}
        >
          <div style={{ width: 300, fontFamily: 'var(--display-font)', color: '#fff' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#D4AF37', letterSpacing: 2, marginBottom: 10, textAlign: 'center' }}>
              {home.name}
            </div>

            {/* Key metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Home Value',    value: `${homeValue.toLocaleString()}`,       color: '#4ade80' },
                { label: 'Mortgage Left', value: `${mortgageBalance.toLocaleString()}`, color: '#f87171' },
                { label: 'Equity',        value: `${equityPct.toFixed(1)}%`,             color: '#D4AF37' },
              ].map((m) => (
                <div key={m.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--glass-radius)', padding: '6px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Equity bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                <span>Equity built: ${equityValue.toLocaleString()}</span>
                <span>{equityPct.toFixed(1)}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--glass-radius)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, equityPct)}%`, background: 'linear-gradient(90deg, #D4AF37, #4ade80)', borderRadius: 'var(--glass-radius)', transition: 'width 0.8s ease' }} />
              </div>
            </div>

            {/* Monthly breakdown */}
            <div style={{ ...panel('rgba(255,255,255,0.04)'), marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: 1 }}>
                Monthly Payment — ${mortgagePayment || home.monthlyPayment}/mo · {curRate}% APR
              </div>
              {[
                { label: 'Principal',       value: principal,       color: '#4ade80' },
                { label: 'Interest',        value: interestPortion, color: '#f87171' },
                { label: 'Tax + Insurance', value: taxInsurance,    color: '#fbbf24' },
              ].map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 0', color: 'rgba(255,255,255,0.7)' }}>
                  <span>{r.label}</span>
                  <span style={{ color: r.color, fontWeight: 700 }}>${r.value}/mo</span>
                </div>
              ))}
            </div>

            {/* Pass Month */}
            <button
              onClick={advanceHomeLifeMonth}
              disabled={!!pendingMaintenance}
              style={{
                ...btnFull('#fff', pendingMaintenance ? 'rgba(255,255,255,0.08)' : '#0F766E'),
                color: pendingMaintenance ? 'rgba(255,255,255,0.35)' : '#fff',
                cursor: pendingMaintenance ? 'default' : 'pointer',
              }}
            >
              {pendingMaintenance
                ? <><GameIcon name="close" size={12} /> Resolve Maintenance First</>
                : <>Pass a Month →</>}
            </button>

            {/* List Home */}
            {equityPct >= 15 && (
              <button
                onClick={() => setListingOpen(true)}
                style={{
                  ...btnFull('#0F172A', 'linear-gradient(135deg,#D4AF37,#F5C842)'),
                  boxShadow: '0 0 16px rgba(212,175,55,0.5)',
                  animation: 'pulse 2s infinite',
                }}
              >
                <GameIcon name="home" size={14} /> Manage Home →
              </button>
            )}
          </div>
        </DraggablePanel>
      )}

      {listingOpen && (
        <DraggablePanel
          id="listing-modal"
          title={activeAction === 'paydown' ? 'Extra Mortgage Payment' : activeAction === 'refinance' ? 'Refinance Your Mortgage' : 'Home Options'}
          icon="home"
          defaultPosition={{ x: Math.max(16, Math.round(window.innerWidth / 2) - 185), y: 80 }}
          onClose={() => setListingOpen(false)}
        >
          <div style={{ width: 350, fontFamily: 'var(--display-font)', color: '#fff' }}>

            {/* ── MAIN VIEW ─────────────────────────────────────────── */}
            {activeAction === 'none' && (
              <>
                {/* Sale breakdown */}
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                  <div style={{ color: '#4ade80', marginBottom: 6 }}><GameIcon name="home" size={36} /></div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>Estimated Sale Breakdown</div>
                  {[
                    { label: 'Current Market Value',  value:  homeValue,       color: '#4ade80' },
                    { label: 'Agent Commission (5%)', value: -agentFee,        color: '#f87171' },
                    { label: 'Closing Costs (2%)',    value: -closingCosts,    color: '#f87171' },
                    { label: 'Mortgage Payoff',       value: -mortgageBalance, color: '#f87171' },
                  ].map((r) => (
                    <div key={r.label} style={row}>
                      <span style={dimTxt}>{r.label}</span>
                      <span style={{ color: r.color, fontWeight: 700 }}>
                        {r.value < 0 ? '−' : ''}${Math.abs(r.value).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ ...panel(estProfit > 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)'), textAlign: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 10, ...dimTxt }}>Estimated Sale Profit</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: estProfit > 0 ? '#4ade80' : '#f87171' }}>
                    {estProfit >= 0 ? '+' : ''}${estProfit.toLocaleString()}
                  </div>
                </div>

                <div style={{ ...panel('rgba(212,175,55,0.1)'), fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, textAlign: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center', marginBottom: 4 }}>
                    <GameIcon name="sparkles" size={13} color="#D4AF37" />
                    <strong style={{ color: '#D4AF37' }}>Grow Your Investment</strong>
                  </div>
                  Use extra cash to pay down your mortgage or refinance for a lower rate.
                </div>

                {/* Action buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 6 }}>
                  <button
                    onClick={() => { setPaydownAmt(Math.min(5000, Math.floor((cash || 0) * 0.1))); setActiveAction('paydown'); }}
                    disabled={!cash || cash < 500}
                    style={btn(
                      cash >= 500 ? '#4ade80' : 'rgba(255,255,255,0.25)',
                      cash >= 500 ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                      cash >= 500 ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.08)',
                    )}
                  >
                    <GameIcon name="bank" size={12} /> Pay Down Mortgage
                  </button>
                  <button
                    onClick={() => { setRefiIdx(0); setActiveAction('refinance'); }}
                    disabled={refiTiers.length === 0}
                    style={btn(
                      refiTiers.length > 0 ? '#D4AF37' : 'rgba(255,255,255,0.25)',
                      refiTiers.length > 0 ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
                      refiTiers.length > 0 ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.08)',
                    )}
                  >
                    <GameIcon name="chart" size={12} /> {refiTiers.length > 0 ? 'Refinance' : 'Refinance (Need 6mo)'}
                  </button>
                </div>

                <button onClick={() => setListingOpen(false)} style={btnFull('rgba(255,255,255,0.45)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)')}>
                  <GameIcon name="close" size={10} /> Keep Building Equity
                </button>
              </>
            )}

            {/* ── PAY DOWN VIEW ─────────────────────────────────────── */}
            {activeAction === 'paydown' && (
              <>
                <div style={{ ...panel('rgba(74,222,128,0.08)'), marginBottom: 14 }}>
                  <div style={{ fontSize: 10, ...dimTxt, marginBottom: 2 }}>Current Mortgage Balance</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#f87171' }}>${mortgageBalance.toLocaleString()}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Cash available: ${(cash || 0).toLocaleString()}</div>
                </div>

                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Choose extra payment amount:</div>

                {/* Preset amounts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                  {[1000, 2500, 5000, 10000].map((amt) => {
                    const canAfford = (cash || 0) >= amt;
                    const newBal    = Math.max(0, mortgageBalance - amt);
                    const newEq     = homeValue > 0 ? ((homeValue - newBal) / homeValue * 100) : 0;
                    const selected  = paydownAmt === amt;
                    return (
                      <button
                        key={amt}
                        disabled={!canAfford}
                        onClick={() => setPaydownAmt(amt)}
                        style={{
                          padding: '8px', borderRadius: 'var(--glass-radius)',
                          background: selected ? 'rgba(74,222,128,0.2)' : canAfford ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                          color: selected ? '#4ade80' : canAfford ? '#fff' : 'rgba(255,255,255,0.2)',
                          border: `1px solid ${selected ? 'rgba(74,222,128,0.6)' : canAfford ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}`,
                          cursor: canAfford ? 'pointer' : 'default',
                          fontFamily: 'Inter,sans-serif', textAlign: 'left',
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: 12 }}>${amt.toLocaleString()}</div>
                        {canAfford && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>→ {newEq.toFixed(1)}% equity</div>}
                      </button>
                    );
                  })}
                </div>

                {/* Effect preview */}
                {paydownAmt > 0 && (
                  <div style={{ ...panel('rgba(74,222,128,0.08)'), marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: '#4ade80', fontWeight: 700, marginBottom: 6 }}>Effect of this payment</div>
                    {[
                      { label: 'New balance',   value: `${Math.max(0, mortgageBalance - paydownAmt).toLocaleString()}`, color: '#4ade80' },
                      { label: 'New equity',    value: `${Math.min(100, homeValue > 0 ? ((homeValue - Math.max(0, mortgageBalance - paydownAmt)) / homeValue * 100) : 0).toFixed(1)}%`, color: '#D4AF37' },
                      { label: 'Cash after',    value: `${Math.max(0, (cash || 0) - paydownAmt).toLocaleString()}`,    color: '#fbbf24' },
                    ].map((r) => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 0' }}>
                        <span style={dimTxt}>{r.label}</span>
                        <span style={{ color: r.color, fontWeight: 700 }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button onClick={() => setActiveAction('none')} style={btn('rgba(255,255,255,0.45)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.1)')}>
                    ← Back
                  </button>
                  <button
                    disabled={paydownAmt <= 0 || (cash || 0) < paydownAmt}
                    onClick={() => { payDownMortgage(paydownAmt); setActiveAction('none'); }}
                    style={btn(
                      paydownAmt > 0 && (cash || 0) >= paydownAmt ? '#fff' : 'rgba(255,255,255,0.25)',
                      paydownAmt > 0 && (cash || 0) >= paydownAmt ? '#0F766E' : 'rgba(255,255,255,0.04)',
                    )}
                  >
                    <GameIcon name="bank" size={12} /> Apply Payment
                  </button>
                </div>
              </>
            )}

            {/* ── REFINANCE VIEW ────────────────────────────────────── */}
            {activeAction === 'refinance' && (
              <>
                {refiTiers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 20, ...dimTxt, fontSize: 12 }}>
                    No refinance options available yet. Build more equity or wait until Month 6.
                  </div>
                ) : (
                  <>
                    <div style={{ ...panel('rgba(255,255,255,0.04)'), marginBottom: 10 }}>
                      <div style={{ fontSize: 10, ...dimTxt, marginBottom: 4 }}>Current Loan</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: '#f87171' }}>{curRate}% APR</div>
                          <div style={{ fontSize: 9, ...dimTxt }}>Current Rate</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: '#fbbf24' }}>${mortgagePayment || home.monthlyPayment}/mo</div>
                          <div style={{ fontSize: 9, ...dimTxt }}>Monthly Payment</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Choose a refinance option:</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      {refiTiers.map((t, i) => {
                        const newPmt    = calcPayment(t.rate, mortgageBalance);
                        const savings   = (mortgagePayment || home.monthlyPayment) - newPmt;
                        const breakEven = savings > 0 ? Math.ceil(t.fee / savings) : 999;
                        const canAfford = (cash || 0) >= t.fee;
                        const selected  = refiIdx === i;
                        return (
                          <button
                            key={t.label}
                            disabled={!canAfford}
                            onClick={() => setRefiIdx(i)}
                            style={{
                              padding: '10px 12px', borderRadius: 'var(--glass-radius)',
                              background: selected ? 'rgba(212,175,55,0.15)' : canAfford ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${selected ? 'rgba(212,175,55,0.6)' : canAfford ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}`,
                              color: canAfford ? '#fff' : 'rgba(255,255,255,0.25)',
                              cursor: canAfford ? 'pointer' : 'default', textAlign: 'left',
                              fontFamily: 'Inter,sans-serif',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontSize: 14, fontWeight: 800, color: selected ? '#D4AF37' : '#fff' }}>{t.rate}% APR</span>
                                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>{t.label}</span>
                              </div>
                              <span style={{ fontSize: 8, background: 'rgba(74,222,128,0.15)', color: '#4ade80', padding: '2px 6px', borderRadius: 4 }}>
                                {t.badge}
                              </span>
                            </div>
                            {canAfford && (
                              <div style={{ display: 'flex', gap: 12, marginTop: 5, fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>
                                <span>New pmt: <strong style={{ color: '#4ade80' }}>${newPmt}/mo</strong></span>
                                <span>Save: <strong style={{ color: '#4ade80' }}>${savings}/mo</strong></span>
                                <span>Break-even: <strong style={{ color: '#fbbf24' }}>{breakEven} mo</strong></span>
                              </div>
                            )}
                            {!canAfford && (
                              <div style={{ fontSize: 9, color: '#f87171', marginTop: 3 }}>
                                Need ${(t.fee - (cash || 0)).toLocaleString()} more cash for closing costs
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Confirm section */}
                    {refiTiers[refiIdx] && (cash || 0) >= refiTiers[refiIdx].fee && (
                      <div style={{ ...panel('rgba(212,175,55,0.08)'), fontSize: 10, marginBottom: 10 }}>
                        <div style={{ color: '#D4AF37', fontWeight: 700, marginBottom: 5 }}>Refinance Summary</div>
                        {[
                          { label: 'New rate',         value: `${refiTiers[refiIdx].rate}% APR` },
                          { label: 'New payment',      value: `${calcPayment(refiTiers[refiIdx].rate, mortgageBalance)}/mo` },
                          { label: 'Monthly savings',  value: `${((mortgagePayment || home.monthlyPayment) - calcPayment(refiTiers[refiIdx].rate, mortgageBalance))}/mo` },
                          { label: 'Closing cost',     value: `-${refiTiers[refiIdx].fee.toLocaleString()}` },
                        ].map((r) => (
                          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                            <span style={dimTxt}>{r.label}</span>
                            <span style={{ fontWeight: 700, color: r.label === 'Closing cost' ? '#f87171' : '#4ade80' }}>{r.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      <button onClick={() => setActiveAction('none')} style={btn('rgba(255,255,255,0.45)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.1)')}>
                        ← Back
                      </button>
                      <button
                        disabled={!refiTiers[refiIdx] || (cash || 0) < refiTiers[refiIdx].fee}
                        onClick={() => {
                          const t = refiTiers[refiIdx];
                          if (t) { refinanceMortgage(t.rate, t.fee); setActiveAction('none'); }
                        }}
                        style={btn(
                          refiTiers[refiIdx] && (cash || 0) >= refiTiers[refiIdx]?.fee ? '#fff' : 'rgba(255,255,255,0.25)',
                          refiTiers[refiIdx] && (cash || 0) >= refiTiers[refiIdx]?.fee ? 'linear-gradient(135deg,#D4AF37,#F5C842)' : 'rgba(255,255,255,0.04)',
                        )}
                      >
                        <GameIcon name="chart" size={12} /> Confirm Refinance
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

          </div>
        </DraggablePanel>
      )}
    </>
  );
}

export default function GamePage() {
  const { achievements, showResultsCard, setShowResultsCard } = useGameStore();
  const prevAchievements = useRef<string[]>([]);
  const [toastQueue, setToastQueue] = useState<string[]>([]);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    const newOnes = achievements.filter((a) => !prevAchievements.current.includes(a));
    if (newOnes.length > 0) {
      setToastQueue((q) => [...q, ...newOnes]);
      prevAchievements.current = achievements;
    }
  }, [achievements]);

  useEffect(() => {
    if (!activeToast && toastQueue.length > 0) {
      setActiveToast(toastQueue[0]);
      setToastQueue((q) => q.slice(1));
    }
  }, [activeToast, toastQueue]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        background: '#87CEEB',
        position: 'relative',
      }}
    >
      {!showResultsCard && <GameHUD />}
      <div style={{ position: 'absolute', top: 72, left: 0, right: 0, bottom: 0 }}>
        <Canvas
          shadows
          camera={{ position: [13, 11, 13], fov: 44 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <SceneContents />
        </Canvas>
      </div>
      {!showResultsCard && <SpeechBubble />}
      {!showResultsCard && <SmartPhone />}
      {!showResultsCard && <LifeEventModal />}
      {!showResultsCard && <CityExitButton />}
      {!showResultsCard && <TourChecklist />}
      {!showResultsCard && <HomeLifeOverlays />}
      <SceneTransition />
      <AchievementToast
        isVisible={!!activeToast}
        title={activeToast ? formatTitle(activeToast) : ''}
        onClose={() => setActiveToast(null)}
      />
      <ResultsCard
        visible={showResultsCard}
        onPlayAgain={() => setShowResultsCard(false)}
        onClose={() => setShowResultsCard(false)}
      />
    </div>
  );
}
