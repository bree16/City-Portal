import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { resolveWalkTarget } from '@/lib/obstacles';
import { cameraDrag } from '@/lib/cameraDrag';

interface GroundPlaneProps {
  size?: number;
}

/** Ripple + destination marker rendered at the current walk target. */
function ClickFeedback() {
  const rippleRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);
  const rippleT = useRef(1); // 1 = finished
  const lastTarget = useRef<[number, number, number] | null>(null);

  useFrame((_, dt) => {
    const s = useGameStore.getState();
    const t = s.targetPosition;

    if (lastTarget.current === null) {
      lastTarget.current = [...t]; // no ripple on mount
    } else if (t[0] !== lastTarget.current[0] || t[2] !== lastTarget.current[2]) {
      lastTarget.current = [...t];
      rippleT.current = 0;
    }

    if (rippleRef.current) {
      if (rippleT.current < 1) {
        rippleT.current = Math.min(1, rippleT.current + dt * 2.4);
        const k = rippleT.current;
        rippleRef.current.visible = true;
        rippleRef.current.position.set(t[0], 0.03, t[2]);
        rippleRef.current.scale.setScalar(0.4 + k * 1.6);
        (rippleRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.85;
      } else {
        rippleRef.current.visible = false;
      }
    }

    if (markerRef.current) {
      const p = s.playerPosition;
      const dist = Math.hypot(t[0] - p[0], t[2] - p[2]);
      // Fade the marker out smoothly as the player arrives (0.15..0.9m).
      const fade = Math.min(1, Math.max(0, (dist - 0.15) / 0.75));
      const mat = markerRef.current.material as THREE.MeshBasicMaterial;
      markerRef.current.visible = fade > 0.01;
      if (markerRef.current.visible) {
        markerRef.current.position.set(t[0], 0.035, t[2]);
        markerRef.current.rotation.z += dt * 2;
        const pulse = 0.9 + Math.sin(rippleT.current * 10 + markerRef.current.rotation.z * 3) * 0.08;
        markerRef.current.scale.setScalar(pulse);
        mat.opacity = 0.85 * fade;
      }
    }
  });

  return (
    <>
      <mesh ref={rippleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.28, 0.38, 32]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={markerRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.3, 0.42, 32]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} depthWrite={false} />
      </mesh>
    </>
  );
}

export function GroundPlane({ size = 60 }: GroundPlaneProps) {
  const { setPlayerTarget } = useGameStore();

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        // Resolve movement on pointer-UP so we can suppress clicks that were
        // actually the end of a camera orbit/pan drag (see cameraDrag.moved).
        onPointerUp={(e) => {
          e.stopPropagation();
          // Only left-clicks move the player; ignore right/middle (orbit) buttons.
          if (e.button !== 0) return;
          // If the pointer travelled past the drag threshold, this was a drag.
          if (cameraDrag.moved) return;
          // Snap the click to the nearest legal walk target (outside obstacles, in bounds)
          const [x, z] = resolveWalkTarget(e.point.x, e.point.z);
          setPlayerTarget([x, 0, z]);
        }}
      >
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <ClickFeedback />
    </>
  );
}
