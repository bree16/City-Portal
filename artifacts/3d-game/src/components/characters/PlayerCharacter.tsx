import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { CharacterRig } from './CharacterRig';
import { resolveCollisions } from '@/lib/obstacles';

const MAX_SPEED = 3.4; // units/sec
const ACCEL_DAMP = 9; // higher = snappier acceleration
const ARRIVE_RADIUS = 1.1; // start decelerating within this distance
const STOP_EPSILON = 0.03; // arrival tolerance

export function PlayerCharacter() {
  const { characterAppearance, setPlayerPosition } = useGameStore();
  const posRef = useRef(new THREE.Vector3(0, 0, 0));
  const facingAngle = useRef(0);
  const isMovingRef = useRef(false);
  const speedRef = useRef(0);
  const stuckTimer = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const state = useGameStore.getState();
    const [tx, , tz] = state.targetPosition;
    const dx = tx - posRef.current.x;
    const dz = tz - posRef.current.z;
    const dist = Math.hypot(dx, dz);

    if (dist > STOP_EPSILON) {
      // Arrival steering: full speed far away, ease out near the target.
      const desired = dist < ARRIVE_RADIUS ? MAX_SPEED * (dist / ARRIVE_RADIUS) : MAX_SPEED;
      speedRef.current = THREE.MathUtils.damp(speedRef.current, desired, ACCEL_DAMP, dt);

      const step = Math.min(speedRef.current * dt, dist);
      const nx = posRef.current.x + (dx / dist) * step;
      const nz = posRef.current.z + (dz / dist) * step;
      // Slide around obstacles: push-out produces tangential movement.
      const [rx, rz] = resolveCollisions(nx, nz);

      const actualStep = Math.hypot(rx - posRef.current.x, rz - posRef.current.z);
      if (actualStep > 0.002) {
        facingAngle.current = Math.atan2(rx - posRef.current.x, rz - posRef.current.z);
        stuckTimer.current = 0;
      } else {
        // Blocked by an obstacle — if we can't make progress, stop trying.
        stuckTimer.current += dt;
        if (stuckTimer.current > 0.5) {
          state.setPlayerTarget([posRef.current.x, 0, posRef.current.z]);
          stuckTimer.current = 0;
        }
      }
      posRef.current.set(rx, 0, rz);
      isMovingRef.current = actualStep > 0.002;
      setPlayerPosition([rx, 0, rz]);
    } else {
      // Precise arrival: snap exactly onto the target, no overshoot.
      if (dist > 0 && isMovingRef.current) {
        posRef.current.set(tx, 0, tz);
        setPlayerPosition([tx, 0, tz]);
      }
      isMovingRef.current = false;
      speedRef.current = 0;
      stuckTimer.current = 0;
    }

    if (groupRef.current) {
      groupRef.current.position.copy(posRef.current);
      // Smoothly rotate to face movement direction (frame-rate independent)
      const currentY = groupRef.current.rotation.y;
      const diff = facingAngle.current - currentY;
      const wrapped = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      groupRef.current.rotation.y += wrapped * Math.min(1, dt * 12);
    }
  });

  return (
    <group ref={groupRef}>
      <CharacterRig
        skinTone={characterAppearance.skinTone}
        hairColor={characterAppearance.hairColor}
        shirtColor={characterAppearance.shirtColor}
        pantsColor={characterAppearance.pantsColor}
        eyeColor={characterAppearance.eyeColor}
        hairstyle={characterAppearance.hairstyle}
        bodyScale={characterAppearance.bodyScale}
        accessories={characterAppearance.accessories}
        isMoving={isMovingRef.current}
        isIdle={!isMovingRef.current}
      />
    </group>
  );
}
