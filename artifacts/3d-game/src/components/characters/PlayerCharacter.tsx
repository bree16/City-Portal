import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { CharacterRig } from './CharacterRig';

export function PlayerCharacter() {
  const { characterAppearance, setPlayerPosition } = useGameStore();
  const posRef = useRef(new THREE.Vector3(0, 0, 0));
  const facingAngle = useRef(0);
  const isMovingRef = useRef(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const state = useGameStore.getState();
    const target = new THREE.Vector3(...state.targetPosition);
    const dist = posRef.current.distanceTo(target);

    if (dist > 0.12) {
      isMovingRef.current = true;
      const dx = target.x - posRef.current.x;
      const dz = target.z - posRef.current.z;
      facingAngle.current = Math.atan2(dx, dz);
      posRef.current.lerp(target, 0.07);
      setPlayerPosition([posRef.current.x, posRef.current.y, posRef.current.z]);
    } else {
      isMovingRef.current = false;
    }

    if (groupRef.current) {
      groupRef.current.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
      // Smoothly rotate to face movement direction
      const currentY = groupRef.current.rotation.y;
      const diff = facingAngle.current - currentY;
      const wrapped = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      groupRef.current.rotation.y += wrapped * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <CharacterRig
        skinTone={characterAppearance.skinTone}
        hairColor={characterAppearance.hairColor}
        shirtColor={characterAppearance.shirtColor}
        pantsColor={characterAppearance.pantsColor}
        isMoving={isMovingRef.current}
        isIdle={!isMovingRef.current}
      />
    </group>
  );
}
