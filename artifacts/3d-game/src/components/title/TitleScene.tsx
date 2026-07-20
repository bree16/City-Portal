import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildings } from '@/data/buildings';
import { TallPlant } from '@/components/decor/DecorKit';

function SimpleCloud({ position, speed }: { position: [number, number, number], speed: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * speed) * 5;
    }
  });
  
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 7, 7]} />
        <meshStandardMaterial color="#ff007f" transparent opacity={0.2} roughness={1} />
      </mesh>
      <mesh position={[1.2, 0.2, 0.5]}>
        <sphereGeometry args={[1, 7, 7]} />
        <meshStandardMaterial color="#ff007f" transparent opacity={0.2} roughness={1} />
      </mesh>
      <mesh position={[-1.2, -0.2, -0.5]}>
        <sphereGeometry args={[1.2, 7, 7]} />
        <meshStandardMaterial color="#ff007f" transparent opacity={0.2} roughness={1} />
      </mesh>
    </group>
  );
}

export function TitleScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.02;
      groupRef.current.position.y = Math.sin(t * 0.2) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, -5]} intensity={1.5} color="#ffea00" />
      <directionalLight position={[-5, 5, 5]} intensity={1} color="#00f0ff" />
      
      <group ref={groupRef} position={[0, -2, -15]}>
        {/* Ground */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#09070a" roughness={0.9} />
        </mesh>

        {/* Shimmering Water */}
        <mesh position={[0, -0.05, 8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 30]} />
          <meshStandardMaterial color="#00f0ff" roughness={0.2} metalness={0.8} transparent opacity={0.15} />
        </mesh>
        
        {/* Buildings cluster */}
        {buildings.map((b) => {
          const height = b.footprint[1] * 0.8;
          return (
            <group key={b.id} position={[b.cityPos[0] * 0.6, 0, b.cityPos[2] * 0.6]}>
              <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[b.footprint[0] * 0.6, height, b.footprint[0] * 0.6]} />
                <meshStandardMaterial color={b.color} roughness={0.7} />
              </mesh>
              {/* Highlight roof */}
              <mesh position={[0, height + 0.101, 0]}>
                <boxGeometry args={[b.footprint[0] * 0.62, 0.2, b.footprint[0] * 0.62]} />
                <meshStandardMaterial color={b.accentColor} roughness={0.5} />
              </mesh>
            </group>
          );
        })}

        {/* Trees */}
        <TallPlant position={[-5, 0, -2]} scale={1.5} />
        <TallPlant position={[8, 0, -4]} scale={1.8} />
        <TallPlant position={[2, 0, -8]} scale={1.2} />
        
        {/* Clouds */}
        <SimpleCloud position={[-10, 8, -10]} speed={0.05} />
        <SimpleCloud position={[15, 12, -20]} speed={0.03} />
        <SimpleCloud position={[5, 6, -5]} speed={0.07} />
      </group>
    </>
  );
}