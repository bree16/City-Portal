import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '@/components/GameHUD';
import { SpeechBubble } from '@/components/SpeechBubble';
import { SceneTransition } from '@/components/SceneTransition';
import { AchievementToast } from '@/components/AchievementToast';
import { ResultsCard } from '@/components/ResultsCard';
import { AudioManager } from '@/components/AudioManager';
import { SmartPhone } from '@/components/SmartPhone';
import { IsometricCamera } from '@/components/IsometricCamera';
import { GroundPlane } from '@/components/GroundPlane';
import { PlayerCharacter } from '@/components/characters/PlayerCharacter';

import ApartmentScene from '@/scenes/ApartmentScene';
import CounselorOfficeScene from '@/scenes/CounselorOfficeScene';
import NeighborhoodScene from '@/scenes/NeighborhoodScene';
import NegotiationScene from '@/scenes/NegotiationScene';
import BankScene from '@/scenes/BankScene';
import ClosingScene from '@/scenes/ClosingScene';
import NewHomeScene from '@/scenes/NewHomeScene';

const SCENES: Record<number, React.ComponentType> = {
  1: ApartmentScene,
  2: CounselorOfficeScene,
  3: NeighborhoodScene,
  4: NegotiationScene,
  5: BankScene,
  6: ClosingScene,
  7: NewHomeScene,
};

// Per-scene lighting + environment config
const SCENE_CONFIG: Record<number, {
  ambient: number;
  ambientColor: string;
  keyColor: string;
  keyIntensity: number;
  keyPos: [number, number, number];
  fillColor: string;
  fillIntensity: number;
  rimColor: string;
  rimIntensity: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  envPreset: 'apartment' | 'city' | 'park' | 'lobby' | 'warehouse' | 'forest';
  accentColor: string;
  accentPos: [number, number, number];
}> = {
  1: { // Apartment — warm golden hour
    ambient: 0.45, ambientColor: '#FFF5E0',
    keyColor: '#FFD580', keyIntensity: 1.4, keyPos: [8, 14, 6],
    fillColor: '#FFE4B5', fillIntensity: 0.5,
    rimColor: '#87CEEB', rimIntensity: 0.3,
    fogColor: '#FFF8F0', fogNear: 22, fogFar: 55,
    envPreset: 'apartment',
    accentColor: '#FFB347', accentPos: [-6, 5, -4],
  },
  2: { // Counselor office — professional daylight
    ambient: 0.5, ambientColor: '#F0F4FF',
    keyColor: '#FFFFFF', keyIntensity: 1.3, keyPos: [10, 16, 8],
    fillColor: '#D0E8FF', fillIntensity: 0.45,
    rimColor: '#0A8F7E', rimIntensity: 0.25,
    fogColor: '#EEF2F8', fogNear: 24, fogFar: 60,
    envPreset: 'lobby',
    accentColor: '#B0D0FF', accentPos: [0, 6, -4],
  },
  3: { // Neighborhood — bright outdoor sun
    ambient: 0.7, ambientColor: '#E8F4FF',
    keyColor: '#FFF8E1', keyIntensity: 2.2, keyPos: [20, 22, 15],
    fillColor: '#C8E8FF', fillIntensity: 0.8,
    rimColor: '#FFD700', rimIntensity: 0.4,
    fogColor: '#D0E8FF', fogNear: 40, fogFar: 90,
    envPreset: 'park',
    accentColor: '#FFE680', accentPos: [0, 12, -10],
  },
  4: { // Negotiation — dramatic boardroom
    ambient: 0.35, ambientColor: '#FFF0E0',
    keyColor: '#FFD080', keyIntensity: 1.5, keyPos: [6, 14, 4],
    fillColor: '#FFF5D0', fillIntensity: 0.35,
    rimColor: '#C0392B', rimIntensity: 0.2,
    fogColor: '#F8F0E8', fogNear: 20, fogFar: 50,
    envPreset: 'lobby',
    accentColor: '#FFB347', accentPos: [-6, 8, -5],
  },
  5: { // Bank — cool fluorescent
    ambient: 0.6, ambientColor: '#EEF4FF',
    keyColor: '#E8F0FF', keyIntensity: 1.8, keyPos: [0, 18, 0],
    fillColor: '#D0E8FF', fillIntensity: 0.6,
    rimColor: '#4080FF', rimIntensity: 0.25,
    fogColor: '#E8EFF8', fogNear: 28, fogFar: 65,
    envPreset: 'city',
    accentColor: '#8AB0FF', accentPos: [5, 6, 0],
  },
  6: { // Closing — warm celebratory
    ambient: 0.5, ambientColor: '#FFF8E8',
    keyColor: '#FFD96A', keyIntensity: 1.6, keyPos: [8, 15, 6],
    fillColor: '#FFE8A0', fillIntensity: 0.5,
    rimColor: '#0A8F7E', rimIntensity: 0.3,
    fogColor: '#FFF8F0', fogNear: 22, fogFar: 55,
    envPreset: 'apartment',
    accentColor: '#FFD700', accentPos: [0, 8, -4],
  },
  7: { // New home — bright airy
    ambient: 0.55, ambientColor: '#FFF9F0',
    keyColor: '#FFEDAA', keyIntensity: 1.5, keyPos: [8, 16, 8],
    fillColor: '#FFE8D0', fillIntensity: 0.45,
    rimColor: '#87CEEB', rimIntensity: 0.3,
    fogColor: '#FFF8F0', fogNear: 25, fogFar: 60,
    envPreset: 'apartment',
    accentColor: '#FFD96A', accentPos: [-6, 8, -6],
  },
};

function SceneLighting({ stage }: { stage: number }) {
  const cfg = SCENE_CONFIG[stage] ?? SCENE_CONFIG[1];
  return (
    <>
      <ambientLight intensity={cfg.ambient} color={cfg.ambientColor} />
      {/* Key light */}
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
      {/* Fill light */}
      <pointLight position={[-12, 10, -8]} intensity={cfg.fillIntensity} color={cfg.fillColor} />
      {/* Rim light */}
      <pointLight position={[0, 2, 12]} intensity={cfg.rimIntensity} color={cfg.rimColor} />
      {/* Accent */}
      <pointLight position={cfg.accentPos} intensity={0.4} color={cfg.accentColor} />
    </>
  );
}

function FogLayer({ stage }: { stage: number }) {
  const cfg = SCENE_CONFIG[stage] ?? SCENE_CONFIG[1];
  return <fog attach="fog" args={[cfg.fogColor, cfg.fogNear, cfg.fogFar]} />;
}

function SceneContents({ stage }: { stage: number }) {
  const Scene = SCENES[stage] ?? ApartmentScene;
  const cfg = SCENE_CONFIG[stage] ?? SCENE_CONFIG[1];
  return (
    <>
      <FogLayer stage={stage} />
      <SceneLighting stage={stage} />
      <Environment preset={cfg.envPreset} backgroundIntensity={0} />
      <GroundPlane />
      <PlayerCharacter />
      <Scene />
      <IsometricCamera />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.35}
          luminanceSmoothing={0.9}
          intensity={0.7}
          mipmapBlur
        />
        <Vignette offset={0.38} darkness={0.55} />
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
  const { stage, achievements, showResultsCard, setShowResultsCard } = useGameStore();
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
    <AudioManager>
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          overflow: 'hidden',
          background: '#0D2B5E',
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
            <SceneContents stage={stage} />
          </Canvas>
        </div>
        <SpeechBubble />
        <SmartPhone />
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
    </AudioManager>
  );
}
