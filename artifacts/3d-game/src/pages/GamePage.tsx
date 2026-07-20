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
    homeValue, mortgageBalance, cash, selectedHomeId, pendingMaintenance,
    advanceHomeLifeMonth, updateCash,
  } = useGameStore();

  if (stage !== 8) return null;

  const home = homes.find((h) => h.id === selectedHomeId) ?? homes[0];
  const equityValue = Math.max(0, homeValue - mortgageBalance);
  const equityPct   = homeValue > 0 ? (equityValue / homeValue) * 100 : 0;
  const interestPortion = Math.round(mortgageBalance * 0.065 / 12);
  const taxInsurance    = Math.round(home.price * 0.015 / 12);
  const principal       = Math.max(0, home.monthlyPayment - interestPortion - taxInsurance);
  const agentFee        = Math.round(homeValue * 0.05);
  const closingCosts    = Math.round(homeValue * 0.02);
  const estProfit       = homeValue - agentFee - closingCosts - mortgageBalance;

  const btnBase: React.CSSProperties = {
    width: '100%', padding: '9px', borderRadius: 'var(--glass-radius)',
    border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12,
    fontFamily: 'Inter, sans-serif', marginBottom: 6, transition: 'background 0.15s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  };

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
                { label: 'Home Value',    value: `${homeValue.toLocaleString()}`,   color: '#4ade80' },
                { label: 'Mortgage Left', value: `${mortgageBalance.toLocaleString()}`, color: '#f87171' },
                { label: 'Equity',        value: `${equityPct.toFixed(1)}%`,          color: '#D4AF37' },
              ].map((m) => (
                <div key={m.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--glass-radius)', padding: '6px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Equity bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                <span>Equity built: ${equityValue.toLocaleString()}</span><span>{equityPct.toFixed(1)}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--glass-radius)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, equityPct)}%`, background: 'linear-gradient(90deg, #D4AF37, #4ade80)', borderRadius: 'var(--glass-radius)', transition: 'width 0.8s ease' }} />
              </div>
            </div>

            {/* Monthly breakdown */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--glass-radius)', padding: '8px 10px', marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: 1 }}>
                Monthly Payment — ${home.monthlyPayment}/mo
              </div>
              {[
                { label: 'Principal',       value: principal,       color: '#4ade80' },
                { label: 'Interest',        value: interestPortion, color: '#f87171' },
                { label: 'Tax + Insurance', value: taxInsurance,    color: '#fbbf24' },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 0', color: 'rgba(255,255,255,0.7)' }}>
                  <span>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 700 }}>${row.value}/mo</span>
                </div>
              ))}
            </div>

            {/* Pass Month */}
            <button
              onClick={advanceHomeLifeMonth}
              disabled={!!pendingMaintenance}
              style={{
                ...btnBase,
                background: pendingMaintenance ? 'rgba(255,255,255,0.08)' : '#0F766E',
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
                  ...btnBase,
                  background: 'linear-gradient(135deg, #D4AF37, #F5C842)',
                  color: '#0F172A',
                  boxShadow: '0 0 16px rgba(212,175,55,0.5)',
                  animation: 'pulse 2s infinite',
                }}
              >
                <GameIcon name="home" size={14} /> List My Home →
              </button>
            )}
          </div>
        </DraggablePanel>
      )}

      {listingOpen && (
        <DraggablePanel
          id="listing-modal"
          title="Ready to Sell?"
          icon="home"
          defaultPosition={{ x: Math.max(16, Math.round(window.innerWidth / 2) - 185), y: 90 }}
          onClose={() => setListingOpen(false)}
        >
          <div style={{ width: 340, fontFamily: 'var(--display-font)', color: '#fff', textAlign: 'center' }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center', color: '#4ade80' }}>
              <GameIcon name="home" size={40} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 18 }}>Estimated Sale Breakdown</div>

            {[
              { label: 'Current Market Value',  value:  homeValue,        color: '#4ade80' },
              { label: 'Agent Commission (5%)', value: -agentFee,         color: '#f87171' },
              { label: 'Closing Costs (2%)',    value: -closingCosts,     color: '#f87171' },
              { label: 'Mortgage Payoff',       value: -mortgageBalance,  color: '#f87171' },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>{row.label}</span>
                <span style={{ color: row.color, fontWeight: 700 }}>
                  {row.value >= 0 ? '' : '−'}${Math.abs(row.value).toLocaleString()}
                </span>
              </div>
            ))}

            <div style={{ marginTop: 14, padding: '12px', background: estProfit > 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', borderRadius: 'var(--glass-radius)', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Estimated Profit</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: estProfit > 0 ? '#4ade80' : '#f87171' }}>
                {estProfit >= 0 ? '+' : ''}${estProfit.toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'rgba(212,175,55,0.1)', borderRadius: 'var(--glass-radius)', padding: '10px 12px', marginBottom: 16, fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, justifyContent: 'center' }}>
                <GameIcon name="sparkles" size={14} color="#D4AF37" />
                <strong style={{ color: '#D4AF37' }}>Dream Home Ahead!</strong>
              </div>
              Your equity could fund a larger Newport News home — start your journey toward your forever home!
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
              <button
                onClick={() => {
                  const extra = Math.min(5000, Math.floor((cash || 0) * 0.1));
                  if (extra > 0) {
                    updateCash(-extra);
                    useGameStore.setState((s) => ({ mortgageBalance: Math.max(0, s.mortgageBalance - extra) }));
                  }
                  setListingOpen(false);
                }}
                disabled={!cash || cash < 500}
                style={{
                  padding: '10px 8px', borderRadius: 'var(--glass-radius)',
                  background: cash >= 500 ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)',
                  color: cash >= 500 ? '#4ade80' : 'rgba(255,255,255,0.3)',
                  border: `1px solid ${cash >= 500 ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.1)'}`,
                  cursor: cash >= 500 ? 'pointer' : 'default', fontWeight: 700, fontSize: 10,
                  fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
                }}
              >
                <GameIcon name="bank" size={12} /> Pay Down Mortgage
              </button>
              <button
                onClick={() => setListingOpen(false)}
                style={{
                  padding: '10px 8px', borderRadius: 'var(--glass-radius)',
                  background: 'rgba(212,175,55,0.1)', color: '#D4AF37',
                  border: '1px solid rgba(212,175,55,0.3)', cursor: 'pointer',
                  fontWeight: 700, fontSize: 10, fontFamily: 'Inter,sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
                }}
              >
                <GameIcon name="chart" size={12} /> Refinance (Coming Soon)
              </button>
            </div>
            <button
              onClick={() => setListingOpen(false)}
              style={{
                width: '100%', padding: '11px', borderRadius: 'var(--glass-radius)',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                fontWeight: 700, fontSize: 11, fontFamily: 'Inter,sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              <GameIcon name="close" size={10} /> Keep Building Equity
            </button>
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
