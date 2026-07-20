import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

const OFFSET = new THREE.Vector3(13, 11, 13);
const POS_DAMP = 3.0; // frame-rate independent position smoothing (slightly softer)
const LOOK_DAMP = 4.5; // look target eases a touch faster than the rig position

export function IsometricCamera() {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const smoothLook = useRef(new THREE.Vector3(0, 0, 0));
  const desired = useRef(new THREE.Vector3());
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
    const cappedDt = Math.min(dt, 0.05);

    // Ease the look target toward the player so quick turns don't jerk the view.
    lookTarget.current.set(px, 0, pz);
    const lookT = 1 - Math.exp(-LOOK_DAMP * cappedDt);
    smoothLook.current.lerp(lookTarget.current, lookT);

    // Camera position trails the (smoothed) look target for a gentle follow.
    desired.current.copy(smoothLook.current).add(OFFSET);
    const posT = 1 - Math.exp(-POS_DAMP * cappedDt);
    camera.position.lerp(desired.current, posT);
    camera.lookAt(smoothLook.current);
  });

  return null;
}
