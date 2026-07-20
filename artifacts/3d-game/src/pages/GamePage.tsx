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
  ambient: 0.75, ambientColor: '#E8F4FF',
  keyColor: '#FFFBF0', keyIntensity: 2.0, keyPos: [30, 28, 20],
  fillColor: '#E0F0FF', fillIntensity: 0.8,
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
    ambient: 0.5, ambientColor: '#F0F4FF',
    keyColor: '#FFFFFF', keyIntensity: 1.3, keyPos: [10, 16, 8],
    fillColor: '#D0E8FF', fillIntensity: 0.45,
    rimColor: '#0A8F7E', rimIntensity: 0.25,
    fogColor: '#EEF2F8', fogNear: 24, fogFar: 60,
    envPreset: 'lobby',
    accentColor: '#B0D0FF', accentPos: [0, 6, -4],
  },
  realestate: {
    ambient: 0.7, ambientColor: '#E8F4FF',
    keyColor: '#FFFBF0', keyIntensity: 2.2, keyPos: [20, 22, 15],
    fillColor: '#E0F0FF', fillIntensity: 0.8,
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
    fillColor: '#D0E8FF', fillIntensity: 0.6,
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
      <div style={{ fontSize: 10, fontWeight: 700, color: '#ffea00', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <GameIcon name="search-home" size={14} /> Tour Checklist
      </div>
      {TOUR_ROOMS.map((room) => {
        const seen = visited.includes(room);
        const label = TOUR_ROOM_LABELS[room];
        return (
          <div key={room} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 11, padding: '3px 0',
            color: seen ? '#4ade80' : 'rgba(255,255,255,0.45)',
            fontWeight: seen ? 700 : 400,
          }}>
            <span style={{ width: 14, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <GameIcon name={seen ? 'check' : 'uncheck'} size={12} color={seen ? '#4ade80' : 'rgba(255,255,255,0.3)'} />
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <GameIcon name={label.icon} size={12} /> {label.text}
            </span>
          </div>
        );
      })}
      {allDone && (
        <div style={{
          marginTop: 8, padding: '4px 8px', borderRadius: 6,
          background: 'rgba(10,143,126,0.18)',
          border: '1px solid rgba(10,143,126,0.4)',
          fontSize: 10, fontWeight: 700, color: '#00f0ff', textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
        }}>
          <GameIcon name="sparkles" size={12} /> Fully Inspected!
        </div>
      )}
      <button onClick={handleOffer} style={{
        marginTop: 10, width: '100%', padding: '8px', borderRadius: 8,
        background: '#ffea00', color: '#09070a', border: 'none',
        cursor: 'pointer', fontWeight: 800, fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
      }}>
        {allDone ? <><GameIcon name="home" size={12} /> Make an Offer →</> : 'Make an Offer →'}
      </button>
      {!allDone && (
        <div style={{ marginTop: 6, fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
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
      <GameHUD />
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
      <SpeechBubble />
      <SmartPhone />
      <LifeEventModal />
      <CityExitButton />
      <TourChecklist />
      <SceneTransition />
      <AchievementToast
        isVisible={!!activeToast}
        title={activeToast ? formatTitle(activeToast) : ''}
        onClose={() => setActiveToast(null)}
      />
      <ResultsCard
        visible={showResultsCard}
        onPlayAgain={() => setShowResultsCard(false)}
      />
    </div>
  );
}
