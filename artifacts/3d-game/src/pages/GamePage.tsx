import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '@/components/GameHUD';
import { SpeechBubble } from '@/components/SpeechBubble';
import { SceneTransition } from '@/components/SceneTransition';
import { AchievementToast } from '@/components/AchievementToast';
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

function SceneContents({ stage }: { stage: number }) {
  const Scene = SCENES[stage] ?? ApartmentScene;
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[14, 16, 12]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
      />
      <pointLight position={[-10, 10, -8]} intensity={0.35} color="#FFF8E7" />
      <GroundPlane />
      <PlayerCharacter />
      <Scene />
      <IsometricCamera />
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
  const { stage, achievements } = useGameStore();
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
        background: '#0D2B5E',
        position: 'relative',
      }}
    >
      {/* HUD overlay */}
      <GameHUD />

      {/* 3D Canvas — starts below the HUD (~72px) */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Canvas
          shadows
          camera={{ position: [13, 11, 13], fov: 44 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: false }}
        >
          <SceneContents stage={stage} />
        </Canvas>
      </div>

      {/* HTML overlays on top of canvas */}
      <SpeechBubble />
      <SceneTransition />
      <AchievementToast
        isVisible={!!activeToast}
        title={activeToast ? formatTitle(activeToast) : ''}
        onClose={() => setActiveToast(null)}
      />
    </div>
  );
}
