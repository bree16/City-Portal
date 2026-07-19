import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

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
      {/* Big invisible clickable cylinder */}
      <mesh
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <cylinderGeometry args={[radius, radius, height, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Proximity glow ring on the ground */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} visible={false}>
        <ringGeometry args={[radius * 0.75, radius * 0.9, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} depthWrite={false} />
      </mesh>

      {/* Proximity prompt */}
      {near && prompt && (
        <Html position={[0, height + 0.15, 0]} center distanceFactor={9} zIndexRange={[20, 0]}>
          <div
            onClick={onActivate}
            style={{
              background: 'rgba(13,43,94,0.95)',
              border: `1px solid ${color}`,
              color: '#fff',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              boxShadow: `0 0 14px ${color}55`,
            }}
          >
            👆 {prompt}
          </div>
        </Html>
      )}
    </group>
  );
}
