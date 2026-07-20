import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { getAudioEngine } from '@/hooks/useGameAudio';
import { GameIcon } from '@/components/ui/GameIcon';

interface InteractionZoneProps {
  /** Local position within the parent group (world position is computed automatically). */
  position: [number, number, number];
  /** Radius of the clickable cylinder zone. */
  radius?: number;
  height?: number;
  onActivate: () => void;
  /** Short prompt shown when the player walks close, e.g. "Talk" or "Check Budget". */
  prompt?: string;
  /** Extra distance beyond the radius at which proximity highlight kicks in. */
  highlightPad?: number;
  color?: string;
}

/**
 * Large invisible hit zone around an interactive object. Clicking anywhere in
 * the zone fires the same handler as clicking the object itself. When the
 * player walks near, a glowing ring + prompt appear.
 *
 * Robustness notes:
 *  - We handle BOTH onPointerDown and onClick and stop propagation on each so
 *    the GroundPlane's onPointerDown (which would otherwise move the player)
 *    never steals the interaction. onPointerDown is the primary trigger so a
 *    single tap reliably fires even if the pointer nudges before release.
 *  - The invisible cylinder is intentionally tall + wide so the target is easy
 *    to hit from any camera angle.
 */
export function InteractionZone({
  position,
  radius = 1.3,
  height = 2.4,
  onActivate,
  prompt,
  highlightPad = 1.1,
  color = '#D4A843',
}: InteractionZoneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const worldPos = useRef(new THREE.Vector3());
  const [near, setNear] = useState(false);
  const nearRef = useRef(false);
  // Guard so onPointerDown + onClick don't double-fire from a single tap.
  const firedThisPress = useRef(false);

  // First-time hint beacon: until the player has made a few interactions ever,
  // every interaction zone shows a bouncing gold arrow so new players know where to click.
  const showBeacon = useGameStore((s) => s.interactionCount < 4);

  const fire = () => {
    getAudioEngine().play('click');
    useGameStore.getState().noteInteraction();
    onActivate();
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    firedThisPress.current = true;
    fire();
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // If pointerDown already fired for this press, skip (avoids double activation).
    if (firedThisPress.current) {
      firedThisPress.current = false;
      return;
    }
    fire();
  };

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.getWorldPosition(worldPos.current);
    const [px, , pz] = useGameStore.getState().playerPosition;
    const dist = Math.hypot(px - worldPos.current.x, pz - worldPos.current.z);
    const isNear = dist < radius + highlightPad;
    if (isNear !== nearRef.current) {
      nearRef.current = isNear;
      setNear(isNear);
    }
    if (ringRef.current) {
      ringRef.current.visible = isNear;
      if (isNear) {
        const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.06;
        ringRef.current.scale.setScalar(pulse);
        (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
          0.55 + Math.sin(clock.elapsedTime * 4) * 0.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Big invisible clickable cylinder — primary fat target */}
      <mesh
        position={[0, height / 2, 0]}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <cylinderGeometry args={[radius, radius, height, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Proximity glow ring on the ground */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} visible={false}>
        <ringGeometry args={[radius * 0.75, radius * 0.9, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} depthWrite={false} />
      </mesh>

      {/* First-time hint: bouncing gold arrow visible even from far away */}
      {showBeacon && !near && (
        <Html position={[0, height + 0.4, 0]} center distanceFactor={10} zIndexRange={[15, 0]}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              pointerEvents: 'none',
              animation: 'hint-bounce 1.1s ease-in-out infinite',
            }}
          >
            <div
              style={{
                background: 'rgba(9,7,10,0.9)',
                border: '1.5px solid var(--gold)',
                color: 'var(--gold)',
                padding: '3px 10px',
                fontSize: 15,
                fontWeight: 800,
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 16px rgba(212,168,67,0.5)',
              }}
            >
              {prompt ? prompt : 'Click here'}
            </div>
            <div style={{ color: 'var(--gold)', fontSize: 22, lineHeight: 1, textShadow: '0 0 8px rgba(212,168,67,0.8)' }}>▼</div>
            <style>{`@keyframes hint-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }`}</style>
          </div>
        </Html>
      )}

      {/* Proximity prompt — slightly enlarged when the player is near */}
      {near && prompt && (
        <Html position={[0, height + 0.15, 0]} center distanceFactor={9} zIndexRange={[20, 0]}>
          <div
            onPointerDown={(e) => { e.stopPropagation(); fire(); }}
            style={{
              background: 'rgba(9,7,10,0.95)',
              border: `1.5px solid ${color}`,
              color: '#fff',
              borderRadius: 0,
              padding: '5px 12px',
              fontSize: 17,
              fontWeight: 800,
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              boxShadow: `0 0 20px ${color}77`,
              transform: 'scale(1.08)',
              transition: 'transform 0.15s ease-out',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <GameIcon name="search" size={18} /> {prompt}
          </div>
        </Html>
      )}
    </group>
  );
}
