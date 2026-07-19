import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { HairstyleId, AccessoryId } from '@/store/gameStore';

interface CharacterRigProps {
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  eyeColor?: string;
  hairstyle?: HairstyleId;
  bodyScale?: number; // 0 = slimmer, 1 = broader
  accessories?: AccessoryId[];
  isMoving?: boolean;
  isIdle?: boolean;
  scale?: number;
}

function HairMesh({ hairstyle, hairColor }: { hairstyle: HairstyleId; hairColor: string }) {
  const mat = <meshStandardMaterial color={hairColor} roughness={0.6} metalness={0} />;

  switch (hairstyle) {
    case 'short':
      // Flat cap — sphere squished vertically
      return (
        <mesh position={[0, 1.74, 0]} scale={[1, 0.45, 1]} castShadow>
          <sphereGeometry args={[0.235, 16, 10]} />
          {mat}
        </mesh>
      );

    case 'locs':
      // Stacked capsule bundles around head
      return (
        <group>
          <mesh position={[0, 1.78, 0]} castShadow>
            <sphereGeometry args={[0.24, 14, 10]} />
            {mat}
          </mesh>
          {[-0.13, 0, 0.13].map((x, i) => (
            <mesh key={i} position={[x, 1.48, i === 1 ? 0.12 : 0.05]} castShadow>
              <capsuleGeometry args={[0.04, 0.22, 4, 6]} />
              {mat}
            </mesh>
          ))}
          {[-0.1, 0.1].map((x, i) => (
            <mesh key={i} position={[x, 1.44, -0.08]} castShadow>
              <capsuleGeometry args={[0.04, 0.18, 4, 6]} />
              {mat}
            </mesh>
          ))}
        </group>
      );

    case 'curly':
      // Large poofy sphere
      return (
        <mesh position={[0, 1.73, 0]} castShadow>
          <sphereGeometry args={[0.285, 16, 12]} />
          {mat}
        </mesh>
      );

    case 'ponytail':
      // Sphere + swept cylinder at back
      return (
        <group>
          <mesh position={[0, 1.71, 0]} castShadow>
            <sphereGeometry args={[0.235, 16, 10]} />
            {mat}
          </mesh>
          {/* Ponytail holder band */}
          <mesh position={[0, 1.63, -0.22]} rotation={[0.3, 0, 0]} castShadow>
            <torusGeometry args={[0.06, 0.018, 6, 12]} />
            <meshStandardMaterial color="#333" roughness={0.9} />
          </mesh>
          {/* Tail */}
          <mesh position={[0, 1.48, -0.26]} rotation={[-0.6, 0, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.32, 4, 8]} />
            {mat}
          </mesh>
        </group>
      );

    case 'fade':
      // Very flat sides, taller top volume
      return (
        <group>
          {/* Top volume */}
          <mesh position={[0, 1.78, 0]} scale={[0.88, 0.85, 0.88]} castShadow>
            <sphereGeometry args={[0.235, 16, 10]} />
            {mat}
          </mesh>
          {/* Very thin side band (barely visible — represents faded sides) */}
          <mesh position={[0, 1.61, 0]} scale={[1.02, 0.22, 1.02]} castShadow>
            <sphereGeometry args={[0.235, 16, 6]} />
            {mat}
          </mesh>
        </group>
      );

    case 'medium':
    default:
      return (
        <mesh position={[0, 1.71, 0]} castShadow>
          <sphereGeometry args={[0.235, 16, 10]} />
          {mat}
        </mesh>
      );
  }
}

function AccessoryMeshes({
  accessories,
  skinTone,
  hairColor,
}: {
  accessories: AccessoryId[];
  skinTone: string;
  hairColor: string;
}) {
  return (
    <>
      {accessories.includes('glasses') && (
        <group position={[0, 1.565, 0.195]}>
          {/* Left lens ring */}
          <mesh position={[-0.07, 0, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.044, 0.009, 6, 14]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Right lens ring */}
          <mesh position={[0.07, 0, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.044, 0.009, 6, 14]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.054, 0.007, 0.007]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Left arm */}
          <mesh position={[-0.126, 0, -0.04]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.04, 0.006, 0.006]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Right arm */}
          <mesh position={[0.126, 0, -0.04]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.04, 0.006, 0.006]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      )}

      {accessories.includes('earrings') && (
        <>
          <mesh position={[-0.215, 1.52, 0.02]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshStandardMaterial color="#D4A843" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0.215, 1.52, 0.02]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshStandardMaterial color="#D4A843" roughness={0.1} metalness={0.9} />
          </mesh>
        </>
      )}

      {accessories.includes('hat') && (
        <group position={[0, 1.82, 0]}>
          {/* Crown */}
          <mesh position={[0, 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.22, 0.16, 14]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} metalness={0} />
          </mesh>
          {/* Brim */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.028, 14]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} metalness={0} />
          </mesh>
        </group>
      )}
    </>
  );
}

export function CharacterRig({
  skinTone,
  hairColor,
  shirtColor,
  pantsColor,
  eyeColor = '#5B3A29',
  hairstyle = 'medium',
  bodyScale = 0.5,
  accessories = [],
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

  // bodyScale 0 = 0.85x wide, 1 = 1.15x wide
  const widthMult = 0.85 + bodyScale * 0.3;

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

  const torsoW = 0.42 * widthMult;
  const hipW = 0.4 * widthMult;
  const armX = (0.3 - 0.21 + torsoW / 2);

  return (
    <group ref={groupRef} scale={scale}>
      <group ref={bodyGroupRef}>
        {/* Head */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={skinTone} roughness={0.75} metalness={0} />
        </mesh>

        {/* Hair */}
        <HairMesh hairstyle={hairstyle} hairColor={hairColor} />

        {/* Eye whites */}
        <mesh position={[-0.07, 1.565, 0.19]}>
          <sphereGeometry args={[0.042, 8, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0.07, 1.565, 0.19]}>
          <sphereGeometry args={[0.042, 8, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>

        {/* Iris (eye color) */}
        <mesh position={[-0.07, 1.565, 0.198]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={eyeColor} roughness={0.2} metalness={0.05} />
        </mesh>
        <mesh position={[0.07, 1.565, 0.198]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={eyeColor} roughness={0.2} metalness={0.05} />
        </mesh>

        {/* Pupils */}
        <mesh position={[-0.07, 1.565, 0.207]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.1} />
        </mesh>
        <mesh position={[0.07, 1.565, 0.207]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.1} />
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

        {/* Torso — width driven by bodyScale */}
        <mesh position={[0, 1.05, 0]} scale={[widthMult, 1, 1]} castShadow>
          <boxGeometry args={[0.42, 0.5, 0.24]} />
          <meshStandardMaterial color={shirtColor} roughness={0.95} metalness={0} />
        </mesh>

        {/* Left Arm */}
        <mesh ref={leftArmRef} position={[-armX, 1.05, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.38, 6, 10]} />
          <meshStandardMaterial color={shirtColor} roughness={0.95} />
        </mesh>
        {/* Right Arm */}
        <mesh ref={rightArmRef} position={[armX, 1.05, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.38, 6, 10]} />
          <meshStandardMaterial color={shirtColor} roughness={0.95} />
        </mesh>

        {/* Hands */}
        <mesh position={[-armX, 0.77, 0]} castShadow>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color={skinTone} roughness={0.75} />
        </mesh>
        <mesh position={[armX, 0.77, 0]} castShadow>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color={skinTone} roughness={0.75} />
        </mesh>

        {/* Pelvis */}
        <mesh position={[0, 0.75, 0]} scale={[widthMult, 1, 1]} castShadow>
          <boxGeometry args={[0.4, 0.2, 0.22]} />
          <meshStandardMaterial color={pantsColor} roughness={0.9} />
        </mesh>

        {/* Left Leg */}
        <mesh ref={leftLegRef} position={[-0.12 * widthMult, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.48, 6, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.9} />
        </mesh>
        {/* Right Leg */}
        <mesh ref={rightLegRef} position={[0.12 * widthMult, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.48, 6, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.9} />
        </mesh>

        {/* Shoes */}
        <mesh position={[-0.12 * widthMult, 0.16, 0.05]} castShadow>
          <boxGeometry args={[0.14, 0.09, 0.26]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.3} metalness={0.15} />
        </mesh>
        <mesh position={[0.12 * widthMult, 0.16, 0.05]} castShadow>
          <boxGeometry args={[0.14, 0.09, 0.26]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.3} metalness={0.15} />
        </mesh>

        {/* Accessories */}
        <AccessoryMeshes
          accessories={accessories}
          skinTone={skinTone}
          hairColor={hairColor}
        />
      </group>
    </group>
  );
}
