import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CharacterRigProps {
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  isMoving?: boolean;
  isIdle?: boolean;
  scale?: number;
}

export function CharacterRig({
  skinTone,
  hairColor,
  shirtColor,
  pantsColor,
  isMoving = false,
  isIdle = true,
  scale = 1,
}: CharacterRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (isMoving) {
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 8) * 0.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 8) * 0.6;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(t * 8) * 0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t * 8) * 0.5;
      if (bodyGroupRef.current) bodyGroupRef.current.position.y = Math.abs(Math.sin(t * 8)) * 0.04;
    } else if (isIdle) {
      if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
      if (bodyGroupRef.current) bodyGroupRef.current.position.y = Math.sin(t * 1.5) * 0.02;
      if (leftArmRef.current) leftArmRef.current.rotation.z = 0.12 + Math.sin(t * 0.8) * 0.05;
      if (rightArmRef.current) rightArmRef.current.rotation.z = -0.12 - Math.sin(t * 0.8) * 0.05;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <group ref={bodyGroupRef}>
        {/* Head */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={skinTone} roughness={0.75} metalness={0} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 1.71, 0]} castShadow>
          <sphereGeometry args={[0.235, 16, 10]} />
          <meshStandardMaterial color={hairColor} roughness={0.6} metalness={0} />
        </mesh>
        {/* Eye whites */}
        <mesh position={[-0.07, 1.565, 0.19]}>
          <sphereGeometry args={[0.042, 8, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0.07, 1.565, 0.19]}>
          <sphereGeometry args={[0.042, 8, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        {/* Pupils */}
        <mesh position={[-0.07, 1.565, 0.205]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.1} />
        </mesh>
        <mesh position={[0.07, 1.565, 0.205]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.1} />
        </mesh>
        {/* Smile */}
        <mesh position={[0, 1.49, 0.21]}>
          <boxGeometry args={[0.08, 0.022, 0.01]} />
          <meshStandardMaterial color="#c0776a" roughness={0.8} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 10]} />
          <meshStandardMaterial color={skinTone} roughness={0.75} />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[0.42, 0.5, 0.24]} />
          <meshStandardMaterial color={shirtColor} roughness={0.95} metalness={0} />
        </mesh>
        {/* Left Arm */}
        <mesh ref={leftArmRef} position={[-0.3, 1.05, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.38, 6, 10]} />
          <meshStandardMaterial color={shirtColor} roughness={0.95} />
        </mesh>
        {/* Right Arm */}
        <mesh ref={rightArmRef} position={[0.3, 1.05, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.38, 6, 10]} />
          <meshStandardMaterial color={shirtColor} roughness={0.95} />
        </mesh>
        {/* Hands */}
        <mesh position={[-0.3, 0.77, 0]} castShadow>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color={skinTone} roughness={0.75} />
        </mesh>
        <mesh position={[0.3, 0.77, 0]} castShadow>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color={skinTone} roughness={0.75} />
        </mesh>
        {/* Pelvis */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.4, 0.2, 0.22]} />
          <meshStandardMaterial color={pantsColor} roughness={0.9} />
        </mesh>
        {/* Left Leg */}
        <mesh ref={leftLegRef} position={[-0.12, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.48, 6, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.9} />
        </mesh>
        {/* Right Leg */}
        <mesh ref={rightLegRef} position={[0.12, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.48, 6, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.9} />
        </mesh>
        {/* Shoes */}
        <mesh position={[-0.12, 0.16, 0.05]} castShadow>
          <boxGeometry args={[0.14, 0.09, 0.26]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.3} metalness={0.15} />
        </mesh>
        <mesh position={[0.12, 0.16, 0.05]} castShadow>
          <boxGeometry args={[0.14, 0.09, 0.26]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.3} metalness={0.15} />
        </mesh>
      </group>
    </group>
  );
}
