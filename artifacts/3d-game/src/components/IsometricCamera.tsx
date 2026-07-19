import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

const OFFSET = new THREE.Vector3(13, 11, 13);
const DAMP = 3.2; // frame-rate independent smoothing

export function IsometricCamera() {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const initialized = useRef(false);

  if (!initialized.current) {
    camera.position.copy(OFFSET);
    camera.lookAt(0, 0, 0);
    initialized.current = true;
  }

  useFrame((_, dt) => {
    const { playerPosition } = useGameStore.getState();
    const px = playerPosition[0];
    const pz = playerPosition[2];

    lookTarget.current.set(px, 0, pz);
    const desired = lookTarget.current.clone().add(OFFSET);
    const t = 1 - Math.exp(-DAMP * Math.min(dt, 0.05));
    camera.position.lerp(desired, t);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
