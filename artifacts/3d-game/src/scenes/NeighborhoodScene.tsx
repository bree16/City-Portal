import { useState } from 'react';
import { Html } from '@react-three/drei';
import { InteractionZone } from '@/components/InteractionZone';
import { SceneObstacles } from '@/components/SceneObstacles';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';
import { Bush, FlowerBed, TallPlant } from '@/components/decor/DecorKit';
import { ScenePanelClose, ScenePanelReopen } from '@/components/ui/ScenePanelChrome';
import { GameIcon } from '@/components/ui/GameIcon';

const HOUSE_COLORS = ['#E9E4DA', '#B0C4DE', '#F5F5DC', '#B22222'];
const ROOF_COLORS = ['#333333', '#4A3C31', '#2F4F4F', '#3A3A3A'];

const AGENTS: Array<Omit<NPCDef, 'position' | 'rotation'>> = [
  { id: 'agent_h', name: 'Agent Maya', role: 'Realtor', skinTone: '#FDBCB4', hairColor: '#1a0a00', shirtColor: '#D4A843', pantsColor: '#2C2C2C' },
  { id: 'agent_d', name: 'Agent Marcus', role: 'Realtor', skinTone: '#8D5524', hairColor: '#2C1810', shirtColor: '#0D2B5E', pantsColor: '#1A3A6B' },
  { id: 'agent_o', name: 'Agent Lisa', role: 'Realtor', skinTone: '#F1C27D', hairColor: '#B8860B', shirtColor: '#27AE60', pantsColor: '#1C4230' },
  { id: 'agent_s', name: 'Agent James', role: 'Realtor', skinTone: '#E0AC69', hairColor: '#3B1F0A', shirtColor: '#8E44AD', pantsColor: '#2C1040' },
];

export default function NeighborhoodScene() {
  const { openDialogue, setSelectedHome, startNegotiation, startHomeTour, setTransitioning, addAchievement } = useGameStore();
  const [viewingHome, setViewingHome] = useState<number | null>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(true);

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
        <meshStandardMaterial color="#5aa04a" roughness={0.95} metalness={0} />
      </mesh>
      {/* Sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3.5]} receiveShadow>
        <planeGeometry args={[60, 3]} />
        <meshStandardMaterial color="#A0A0A0" roughness={0.85} />
      </mesh>
      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 7]} receiveShadow>
        <planeGeometry args={[60, 5]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
      {/* Road lines */}
      {[-15, -5, 5, 15].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.015, 7]} receiveShadow>
          <planeGeometry args={[2.5, 0.18]} />
          <meshStandardMaterial color="#F8C000" roughness={0.6} />
        </mesh>
      ))}

      {/* Scattered darker grass patches for ground variation */}
      {([[-20, -4], [-10, -5], [0, -4.5], [10, -5], [20, -4], [-5, 1], [15, 1]] as [number, number][]).map(([x, z], i) => (
        <mesh key={`gp-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.006, z]} receiveShadow>
          <circleGeometry args={[1.2 + (i % 3) * 0.4, 14]} />
          <meshStandardMaterial color={i % 2 ? '#4a8f3c' : '#3e7a32'} roughness={1} />
        </mesh>
      ))}

      {/* Corner bushes between the lots along the sidewalk verge */}
      {([-20, -10, 0, 10, 20] as number[]).map((x, i) => (
        <Bush key={`vb-${x}`} position={[x, 0, 1.6]} scale={0.7 + (i % 3) * 0.15} color={i % 2 ? '#228B22' : '#2E8B57'} />
      ))}

      {/* Sky backdrop */}
      <mesh position={[0, 8, -25]}>
        <planeGeometry args={[80, 24]} />
        <meshStandardMaterial color="#E9E4DA" roughness={1} side={2} />
      </mesh>
      {/* Clouds */}
      {[[-12, 10, -20], [8, 12, -22], [20, 9, -18]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[1.5, 10, 10]} />
            <meshStandardMaterial color="#8B5A2B" roughness={1} />
          </mesh>
          <mesh position={[1.2, 0.3, 0]}>
            <sphereGeometry args={[1.1, 10, 10]} />
            <meshStandardMaterial color="#8B5A2B" roughness={1} />
          </mesh>
          <mesh position={[-1.0, 0.2, 0]}>
            <sphereGeometry args={[1.0, 10, 10]} />
            <meshStandardMaterial color="#8B5A2B" roughness={1} />
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
            <mesh position={[0, 3.601, 0]} castShadow>
              {/* Scale a cone rotated 45deg to create a rectangular pyramid that overhangs 5.5 x 4.5 by 1.1x */}
              <group scale={[6.05 / 5.656, 1, 4.95 / 5.656]}>
                <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
                  <coneGeometry args={[4.0, 2.0, 4]} />
                  <meshStandardMaterial color={ROOF_COLORS[idx]} roughness={0.8} />
                </mesh>
              </group>
            </mesh>
            {/* Front door */}
            <mesh position={[0, 0.7, 2.26]} castShadow>
              <boxGeometry args={[1.0, 1.4, 0.1]} />
              <meshStandardMaterial color="#64748B" roughness={0.6} />
            </mesh>
            <mesh position={[0.38, 0.7, 2.32]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#7fb2d9" metalness={0.85} roughness={0.1} />
            </mesh>
            {/* Front windows — glowing warm */}
            {[-1.8, 1.8].map((wx) => (
              <mesh key={wx} position={[wx, 1.5, 2.28]} castShadow>
                <boxGeometry args={[1.0, 0.85, 0.1]} />
                <meshStandardMaterial color="#E9E4DA" emissive="#FFF0D4" emissiveIntensity={0.5} roughness={0.1} />
              </mesh>
            ))}
            {/* Side window */}
            <mesh position={[2.76, 1.5, 0]} castShadow>
              <boxGeometry args={[0.1, 0.8, 0.9]} />
              <meshStandardMaterial color="#E9E4DA" emissive="#a8cfe8" emissiveIntensity={0.1} roughness={0.1} />
            </mesh>
            {/* Window glow */}
            <pointLight position={[0, 1.8, 2.5]} intensity={0.4} color="#D2B48C" distance={3} />
            {/* Chimney */}
            <mesh position={[1.8, 3.8, -0.5]} castShadow>
              <boxGeometry args={[0.45, 2.4, 0.45]} />
              <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
            </mesh>
            {/* Tree */}
            <group position={[-3.2, 0, 0.5]}>
              <mesh position={[0, 0.7, 0]} castShadow>
                <cylinderGeometry args={[0.14, 0.2, 1.4, 6]} />
                <meshStandardMaterial color="#A0522D" roughness={0.8} />
              </mesh>
              <mesh position={[0, 1.8, 0]} castShadow>
                <sphereGeometry args={[0.9, 10, 10]} />
                <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
              </mesh>
            </group>
            {/* Mailbox */}
            <group position={[3.5, 0, 2.5]}>
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 1.0, 6]} />
                <meshStandardMaterial color="#7fb2d9" metalness={0.6} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.9, 0]} castShadow>
                <boxGeometry args={[0.28, 0.18, 0.18]} />
                <meshStandardMaterial color="#64748B" roughness={0.5} metalness={0.2} />
              </mesh>
              {/* Red flag */}
              <mesh position={[0.16, 0.95, 0]} castShadow>
                <boxGeometry args={[0.04, 0.14, 0.02]} />
                <meshStandardMaterial color="#8B5A2B" roughness={0.6} />
              </mesh>
            </group>

            {/* Foundation shrubs flanking the front door (small, off walkway) */}
            <Bush position={[-1.5, 0, 2.5]} scale={0.75} color={idx % 2 ? '#228B22' : '#2E8B57'} />
            <Bush position={[1.5, 0, 2.5]} scale={0.75} color={idx % 2 ? '#2E8B57' : '#228B22'} />

            {/* Flower beds under the front windows */}
            <FlowerBed position={[-1.8, 0, 2.55]} w={1.3} d={0.5} />
            <FlowerBed position={[1.8, 0, 2.55]} w={1.3} d={0.5} />

            {/* A potted ornamental plant by the corner of the yard */}
            <TallPlant position={[3.6, 0, 0.2]} scale={0.85} />

            {/* Stepping-stone path from sidewalk toward the door */}
            {[3.2, 4.0, 4.8, 5.6].map((z, i) => (
              <mesh key={`path-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, z]} receiveShadow>
                <circleGeometry args={[0.45, 12]} />
                <meshStandardMaterial color="#D2B48C" roughness={0.9} />
              </mesh>
            ))}

            {/* Listing card */}
            {viewingHome === home.id && (
              <Html position={[0, 5.5, 0]} center distanceFactor={13}>
                <div style={{
                  background: '#fff', borderRadius: 'var(--glass-radius)', padding: '16px', minWidth: 210,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)', fontFamily: 'var(--display-font)',
                  border: '2px solid #0F172A',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>{home.name}</div>
                  <div style={{ fontSize: 11, color: '#777', marginBottom: 10 }}>{home.neighborhood}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0F766E', marginBottom: 8 }}>
                    ${home.price.toLocaleString()}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', fontSize: 11, marginBottom: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="bed" size={12} /> {home.beds} beds</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="bath" size={12} /> {home.baths} baths</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="ruler" size={12} /> {home.sqft} sqft</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="car" size={12} /> {home.commute} min</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="school" size={12} /> {home.schools} <GameIcon name="star" size={10} color="#D4AF37" /></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="walk" size={12} /> {home.walkability}/100</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#555', marginBottom: 12 }}>
                    Est. payment: <strong>${home.monthlyPayment}/mo</strong>
                  </div>
                  <button onClick={() => handleStartTour(home.id)} style={{
                    width: '100%', padding: '9px', borderRadius: 'var(--glass-radius)',
                    background: '#0F766E', color: '#fff', border: 'none',
                    cursor: 'pointer', fontWeight: 800, fontSize: 12, fontFamily: 'Inter, sans-serif',
                    marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}>
                    <GameIcon name="home" size={14} /> Schedule Tour →
                  </button>
                  <button onClick={() => handleSelectHome(home.id)} style={{
                    width: '100%', padding: '7px', borderRadius: 'var(--glass-radius)',
                    background: 'rgba(212,175,55,0.15)', color: '#D4AF37',
                    border: '1px solid rgba(212,175,55,0.4)',
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
        {!instructionsOpen ? (
          <ScenePanelReopen onOpen={() => setInstructionsOpen(true)} label="Instructions" icon="question" />
        ) : (
        <div style={{
          position: 'relative',
          background: 'rgba(9,7,10,0.88)', borderRadius: 'var(--glass-radius)', padding: '12px 20px',
          color: '#fff', fontFamily: 'var(--display-font)', fontSize: 12,
          textAlign: 'center', backdropFilter: 'blur(8px)',
        }}>
          <ScenePanelClose onClose={() => setInstructionsOpen(false)} title="Hide Instructions" />
          <div style={{ fontWeight: 700, color: '#D4AF37', marginBottom: 4 }}>House Hunting!</div>
          <div style={{ color: 'rgba(255,255,255,0.7)' }}>Click the real estate agents to view each listing</div>
        </div>
        )}
      </Html>
    </group>
  );
}
