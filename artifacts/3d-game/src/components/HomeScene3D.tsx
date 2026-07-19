import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function HomeScene3D() {
  return (
    <div className="w-full h-80 relative bg-gradient-to-b from-sky-100 to-transparent rounded-t-2xl overflow-hidden">
      <Canvas camera={{ position: [8, 6, 8], fov: 40 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <HouseModel />
      </Canvas>
    </div>
  );
}

function HouseModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const treePositions = useMemo(() => [
    [-3, 0, -3],
    [3, 0, -2],
    [-2, 0, 3],
    [4, 0, 2]
  ], []);

  return (
    <group ref={groupRef}>
      {/* Ground Plane */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[12, 1, 12]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* House Body */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1.5, 3]} />
        <meshStandardMaterial color="#FFF8E7" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[2.8, 1.5, 4]} />
        <meshStandardMaterial color="#2C3E6B" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.5, 1.51]} castShadow>
        <boxGeometry args={[0.8, 1, 0.1]} />
        <meshStandardMaterial color="#0A8F7E" />
      </mesh>

      {/* Windows */}
      <mesh position={[-1.2, 0.8, 1.51]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[1.2, 0.8, 1.51]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-2.01, 0.8, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.6]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} />
      </mesh>

      {/* Chimney */}
      <mesh position={[1.5, 1.8, -0.5]} castShadow>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#B22222" />
      </mesh>

      {/* Trees */}
      {treePositions.map((pos, idx) => (
        <group position={new THREE.Vector3(pos[0], pos[1], pos[2])} key={idx}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.7, 8, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
