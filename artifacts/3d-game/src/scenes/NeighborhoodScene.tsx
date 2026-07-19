import { useState } from 'react';
import { Html } from '@react-three/drei';
import { InteractionZone } from '@/components/InteractionZone';
import { SceneObstacles } from '@/components/SceneObstacles';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';
import { Bush, FlowerBed, TallPlant } from '@/components/decor/DecorKit';

const HOUSE_COLORS = ['#D4B896', '#7BA7BC', '#BC9B7A', '#96BC7B'];
const ROOF_COLORS = ['#8B4513', '#2C3E50', '#6B3A2A', '#2D4A1E'];

const AGENTS: Array<Omit<NPCDef, 'position' | 'rotation'>> = [
  { id: 'agent_h', name: 'Agent Maya', role: 'Realtor', skinTone: '#FDBCB4', hairColor: '#1a0a00', shirtColor: '#D4A843', pantsColor: '#2C2C2C' },
  { id: 'agent_d', name: 'Agent Marcus', role: 'Realtor', skinTone: '#8D5524', hairColor: '#2C1810', shirtColor: '#0D2B5E', pantsColor: '#1A3A6B' },
  { id: 'agent_o', name: 'Agent Lisa', role: 'Realtor', skinTone: '#F1C27D', hairColor: '#B8860B', shirtColor: '#27AE60', pantsColor: '#1C4230' },
  { id: 'agent_s', name: 'Agent James', role: 'Realtor', skinTone: '#E0AC69', hairColor: '#3B1F0A', shirtColor: '#8E44AD', pantsColor: '#2C1040' },
];

export default function NeighborhoodScene() {
  const { openDialogue, setSelectedHome, startNegotiation, startHomeTour, setTransitioning, addAchievement } = useGameStore();
  const [viewingHome, setViewingHome] = useState<number | null>(null);

  // Go straight to the negotiation table (skip tour)
  const handleSelectHome = (homeId: number) => {
    setSelectedHome(homeId);
    setTransitioning(true);
    setTimeout(() => { startNegotiation(); setTransitioning(false); }, 1200);
  };

  // Walk through the home before making an offer
  const handleStartTour = (homeId: number) => {
    setTransitioning(true);
    setTimeout(() => { startHomeTour(homeId); setTransitioning(false); }, 700);
  };

  return (
    <group>
      <SceneObstacles
        circles={[
          ...homes.map((_, idx) => ({ x: -15 + idx * 10, z: -2.5, r: 3.4 })),
          // Ornamental TallPlant at each home's yard corner (local [3.6,0,0.2])
          ...homes.map((_, idx) => ({ x: -15 + idx * 10 + 3.6, z: -2.3, r: 0.5 })),
        ]}
        bounds={{ minX: -27, maxX: 27, minZ: -6.5, maxZ: 9 }}
      />
      {/* Grass — PBR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 22]} />
        <meshStandardMaterial color="#5A9050" roughness={0.95} metalness={0} />
      </mesh>
      {/* Sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3.5]} receiveShadow>
        <planeGeometry args={[60, 3]} />
        <meshStandardMaterial color="#C8C0B0" roughness={0.85} />
      </mesh>
      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 7]} receiveShadow>
        <planeGeometry args={[60, 5]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.9} />
      </mesh>
      {/* Road lines */}
      {[-15, -5, 5, 15].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.015, 7]} receiveShadow>
          <planeGeometry args={[2.5, 0.18]} />
          <meshStandardMaterial color="#FFD700" roughness={0.6} />
        </mesh>
      ))}

      {/* Scattered darker grass patches for ground variation */}
      {([[-20, -4], [-10, -5], [0, -4.5], [10, -5], [20, -4], [-5, 1], [15, 1]] as [number, number][]).map(([x, z], i) => (
        <mesh key={`gp-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.006, z]} receiveShadow>
          <circleGeometry args={[1.2 + (i % 3) * 0.4, 14]} />
          <meshStandardMaterial color={i % 2 ? '#4C7E42' : '#548648'} roughness={1} />
        </mesh>
      ))}

      {/* Corner bushes between the lots along the sidewalk verge */}
      {([-20, -10, 0, 10, 20] as number[]).map((x, i) => (
        <Bush key={`vb-${x}`} position={[x, 0, 1.6]} scale={0.7 + (i % 3) * 0.15} color={i % 2 ? '#3A7A3A' : '#4A8C4A'} />
      ))}

      {/* Sky backdrop */}
      <mesh position={[0, 8, -25]}>
        <planeGeometry args={[80, 24]} />
        <meshStandardMaterial color="#87CEEB" roughness={1} side={2} />
      </mesh>
      {/* Clouds */}
      {[[-12, 10, -20], [8, 12, -22], [20, 9, -18]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[1.5, 10, 10]} />
            <meshStandardMaterial color="#fff" roughness={1} />
          </mesh>
          <mesh position={[1.2, 0.3, 0]}>
            <sphereGeometry args={[1.1, 10, 10]} />
            <meshStandardMaterial color="#fff" roughness={1} />
          </mesh>
          <mesh position={[-1.0, 0.2, 0]}>
            <sphereGeometry args={[1.0, 10, 10]} />
            <meshStandardMaterial color="#fff" roughness={1} />
          </mesh>
        </group>
      ))}

      {homes.map((home, idx) => {
        const x = -15 + idx * 10;
        const agentNpc: NPCDef = { ...AGENTS[idx], position: [x, 0, 2], rotation: [0, Math.PI, 0], important: true };

        return (
          <group key={home.id} position={[x, 0, -2.5]}>
            {/* House body */}
            <mesh position={[0, 1.3, 0]} castShadow>
              <boxGeometry args={[5.5, 2.6, 4.5]} />
              <meshStandardMaterial color={HOUSE_COLORS[idx]} roughness={0.85} metalness={0} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 3.0, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[4.0, 2.0, 4]} />
              <meshStandardMaterial color={ROOF_COLORS[idx]} roughness={0.8} />
            </mesh>
            {/* Front door */}
            <mesh position={[0, 0.7, 2.26]} castShadow>
              <boxGeometry args={[1.0, 1.4, 0.1]} />
              <meshStandardMaterial color="#8B6914" roughness={0.6} />
            </mesh>
            <mesh position={[0.38, 0.7, 2.32]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#D4A843" metalness={0.85} roughness={0.1} />
            </mesh>
            {/* Front windows — glowing warm */}
            {[-1.8, 1.8].map((wx) => (
              <mesh key={wx} position={[wx, 1.5, 2.28]} castShadow>
                <boxGeometry args={[1.0, 0.85, 0.1]} />
                <meshStandardMaterial color="#87CEEB" emissive="#FFE87A" emissiveIntensity={0.5} roughness={0.1} />
              </mesh>
            ))}
            {/* Side window */}
            <mesh position={[2.76, 1.5, 0]} castShadow>
              <boxGeometry args={[0.1, 0.8, 0.9]} />
              <meshStandardMaterial color="#87CEEB" emissive="#FFE87A" emissiveIntensity={0.3} roughness={0.1} />
            </mesh>
            {/* Window glow */}
            <pointLight position={[0, 1.8, 2.5]} intensity={0.4} color="#FFD96A" distance={3} />
            {/* Chimney */}
            <mesh position={[1.8, 3.0, -0.5]} castShadow>
              <boxGeometry args={[0.45, 1.2, 0.45]} />
              <meshStandardMaterial color="#A0522D" roughness={0.8} />
            </mesh>
            {/* Tree */}
            <group position={[-3.2, 0, 0.5]}>
              <mesh position={[0, 0.7, 0]} castShadow>
                <cylinderGeometry args={[0.14, 0.2, 1.4, 6]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
              </mesh>
              <mesh position={[0, 1.8, 0]} castShadow>
                <sphereGeometry args={[0.9, 10, 10]} />
                <meshStandardMaterial color="#2D7A2D" roughness={0.9} />
              </mesh>
            </group>
            {/* Mailbox */}
            <group position={[3.5, 0, 2.5]}>
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 1.0, 6]} />
                <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.9, 0]} castShadow>
                <boxGeometry args={[0.28, 0.18, 0.18]} />
                <meshStandardMaterial color="#0D2B5E" roughness={0.5} metalness={0.2} />
              </mesh>
              {/* Red flag */}
              <mesh position={[0.16, 0.95, 0]} castShadow>
                <boxGeometry args={[0.04, 0.14, 0.02]} />
                <meshStandardMaterial color="#C0392B" roughness={0.6} />
              </mesh>
            </group>

            {/* Foundation shrubs flanking the front door (small, off walkway) */}
            <Bush position={[-1.5, 0, 2.5]} scale={0.75} color={idx % 2 ? '#3A7A3A' : '#4A8C4A'} />
            <Bush position={[1.5, 0, 2.5]} scale={0.75} color={idx % 2 ? '#4A8C4A' : '#3A7A3A'} />

            {/* Flower beds under the front windows */}
            <FlowerBed position={[-1.8, 0, 2.55]} w={1.3} d={0.5} />
            <FlowerBed position={[1.8, 0, 2.55]} w={1.3} d={0.5} />

            {/* A potted ornamental plant by the corner of the yard */}
            <TallPlant position={[3.6, 0, 0.2]} scale={0.85} />

            {/* Stepping-stone path from sidewalk toward the door */}
            {[3.2, 4.0, 4.8, 5.6].map((z, i) => (
              <mesh key={`path-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, z]} receiveShadow>
                <circleGeometry args={[0.45, 12]} />
                <meshStandardMaterial color="#B0A890" roughness={0.9} />
              </mesh>
            ))}

            {/* Listing card */}
            {viewingHome === home.id && (
              <Html position={[0, 5.5, 0]} center distanceFactor={13}>
                <div style={{
                  background: '#fff', borderRadius: 14, padding: '16px', minWidth: 210,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)', fontFamily: 'Inter, sans-serif',
                  border: '2px solid #0D2B5E',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0D2B5E', marginBottom: 2 }}>{home.name}</div>
                  <div style={{ fontSize: 11, color: '#777', marginBottom: 10 }}>{home.neighborhood}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0A8F7E', marginBottom: 8 }}>
                    ${home.price.toLocaleString()}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', fontSize: 11, marginBottom: 10 }}>
                    <span>🛏 {home.beds} beds</span>
                    <span>🚿 {home.baths} baths</span>
                    <span>📐 {home.sqft} sqft</span>
                    <span>🚗 {home.commute} min</span>
                    <span>🏫 {home.schools}★</span>
                    <span>🚶 {home.walkability}/100</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#555', marginBottom: 12 }}>
                    Est. payment: <strong>${home.monthlyPayment}/mo</strong>
                  </div>
                  <button onClick={() => handleStartTour(home.id)} style={{
                    width: '100%', padding: '9px', borderRadius: 8,
                    background: '#0A8F7E', color: '#fff', border: 'none',
                    cursor: 'pointer', fontWeight: 800, fontSize: 12, fontFamily: 'Inter, sans-serif',
                    marginBottom: 6,
                  }}>
                    🏠 Schedule Tour →
                  </button>
                  <button onClick={() => handleSelectHome(home.id)} style={{
                    width: '100%', padding: '7px', borderRadius: 8,
                    background: 'rgba(212,168,67,0.15)', color: '#D4A843',
                    border: '1px solid rgba(212,168,67,0.4)',
                    cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: 'Inter, sans-serif',
                  }}>
                    Skip Tour — Make an Offer
                  </button>
                </div>
              </Html>
            )}

            <NPCCharacter
              npc={agentNpc}
              onClick={() => {
                openDialogue(AGENTS[idx].id);
                setViewingHome(viewingHome === home.id ? null : home.id);
              }}
            />
            {/* Generous zone around the agent — clicking anywhere nearby opens the listing */}
            <InteractionZone
              position={[0, 0, 4.5]}
              radius={1.6}
              prompt={`View ${home.name}`}
              onActivate={() => {
                openDialogue(AGENTS[idx].id);
                setViewingHome(viewingHome === home.id ? null : home.id);
              }}
            />
          </group>
        );
      })}

      {/* Instructions */}
      <Html position={[0, 5, 8]} center distanceFactor={16}>
        <div style={{
          background: 'rgba(13,43,94,0.88)', borderRadius: 14, padding: '12px 20px',
          color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 12,
          textAlign: 'center', backdropFilter: 'blur(8px)',
        }}>
          <div style={{ fontWeight: 700, color: '#D4A843', marginBottom: 4 }}>House Hunting!</div>
          <div style={{ color: 'rgba(255,255,255,0.7)' }}>Click the real estate agents to view each listing</div>
        </div>
      </Html>
    </group>
  );
}
