import { useState } from 'react';
import { Html } from '@react-three/drei';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';
import { PottedPlant, TallPlant, WallArt, WallClock } from '@/components/decor/DecorKit';
import confetti from 'canvas-confetti';

const NOTARY: NPCDef = {
  id: 'notary',
  name: 'Notary Patricia',
  role: 'Notary Public',
  skinTone: '#F1C27D',
  hairColor: '#1a0a00',
  shirtColor: '#8E44AD',
  pantsColor: '#2C1040',
  position: [2, 0, -1.5],
  rotation: [0, Math.PI, 0],
};

const SIGNING_STEPS = [
  { id: 'purchase', label: 'Sign Purchase Agreement', icon: '📋' },
  { id: 'loan', label: 'Sign Loan Documents', icon: '🏦' },
  { id: 'keys', label: 'Receive Your Keys!', icon: '🗝️' },
];

export default function ClosingScene() {
  const { openDialogue, completeInteraction, updateSavings, setStage, setTransitioning, addAchievement } = useGameStore();
  const [step, setStep] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const handleStep = (idx: number) => {
    if (idx !== step) return;
    if (idx === 2) {
      setCelebrating(true);
      updateSavings(-12000);
      addAchievement('homeowner');
      confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 }, colors: ['#D4A843', '#0A8F7E', '#0D2B5E', '#fff', '#FFD700'] });
      setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { x: 0.15, y: 0.5 }, colors: ['#D4A843', '#fff'] }), 400);
      setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { x: 0.85, y: 0.5 }, colors: ['#0A8F7E', '#fff'] }), 700);
    }
    completeInteraction(SIGNING_STEPS[idx].id);
    setStep((prev) => prev + 1);
  };

  const handleAdvance = () => {
    setTransitioning(true);
    setTimeout(() => { setStage(7); setTransitioning(false); }, 1800);
  };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#C0B09A" roughness={0.55} metalness={0.03} />
      </mesh>
      {/* Walls */}
      <mesh position={[0, 2.5, -7]} receiveShadow>
        <boxGeometry args={[18, 5, 0.2]} />
        <meshStandardMaterial color="#EAE0D0" roughness={0.9} />
      </mesh>
      <mesh position={[-9, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#E4D8C8" roughness={0.9} />
      </mesh>
      <mesh position={[9, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#E4D8C8" roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#F8F4EC" roughness={1} />
      </mesh>

      {/* Chandelier — glowing warm gold */}
      <mesh position={[0, 4.7, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.18, 16]} />
        <meshStandardMaterial color="#D4A843" metalness={0.7} roughness={0.2} emissive="#D4A843" emissiveIntensity={0.3} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.4, 4.55, Math.sin(angle) * 0.4]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#FFF8D0" emissive="#FFF8D0" emissiveIntensity={2.0} />
        </mesh>
      ))}
      <pointLight position={[0, 4.2, 0]} intensity={1.2} color="#FFD96A" distance={12} />

      {/* Carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial color="#7B6B5B" roughness={0.95} />
      </mesh>

      {/* Conference table */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[5.5, 0.1, 2.4]} />
        <meshStandardMaterial color="#5A3A1A" roughness={0.4} metalness={0.05} />
      </mesh>
      {([-2.4, 2.4] as number[]).map((x) =>
        ([-1.0, 1.0] as number[]).map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.24, z]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.97, 8]} />
            <meshStandardMaterial color="#4A2C10" roughness={0.5} metalness={0.08} />
          </mesh>
        ))
      )}

      {/* Documents on table — glow green as signed */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={x} position={[x, 0.55, 0]} castShadow>
          <boxGeometry args={[0.55, 0.013, 0.4]} />
          <meshStandardMaterial
            color={i < step ? '#90EE90' : '#fff'}
            emissive={i < step ? '#00cc44' : '#4080FF'}
            emissiveIntensity={i < step ? 0.25 : 0.4}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Pen */}
      <mesh position={[2.5, 0.52, 0.5]} rotation={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 1.2, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Chairs */}
      {[-1.5, 0, 1.5].map((x) => (
        <group key={x} position={[x, 0, 1.9]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.65, 0.1, 0.65]} />
            <meshStandardMaterial color="#3A2A1A" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.68, -0.28]} castShadow>
            <boxGeometry args={[0.65, 0.75, 0.09]} />
            <meshStandardMaterial color="#3A2A1A" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* American flag */}
      <group position={[7, 0, -5.5]}>
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 4.4, 6]} />
          <meshStandardMaterial color="#A0A0A0" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.7, 3.7, 0]} castShadow>
          <boxGeometry args={[1.4, 0.8, 0.05]} />
          <meshStandardMaterial color="#B22234" roughness={0.9} />
        </mesh>
        <mesh position={[0.7, 3.4, 0]} castShadow>
          <boxGeometry args={[1.4, 0.22, 0.05]} />
          <meshStandardMaterial color="#fff" roughness={0.9} />
        </mesh>
      </group>

      {/* Deed frame on wall */}
      <mesh position={[-3.5, 2.2, -6.85]} castShadow>
        <boxGeometry args={[2.2, 1.6, 0.08]} />
        <meshStandardMaterial color="#F5F0E8" roughness={0.9} />
      </mesh>
      <mesh position={[-3.5, 2.2, -6.78]}>
        <boxGeometry args={[2.3, 1.7, 0.06]} />
        <meshStandardMaterial color="#8B6914" roughness={0.5} metalness={0.1} wireframe />
      </mesh>
      <Html position={[-3.5, 2.2, -6.7]} center distanceFactor={14}>
        <div style={{ fontFamily: 'serif', fontSize: 12, fontWeight: 700, color: '#0D2B5E', textAlign: 'center' }}>
          DEED OF TRUST<br /><span style={{ fontSize: 9, fontWeight: 400 }}>Newport News, Virginia</span>
        </div>
      </Html>

      {/* Bookshelf */}
      <group position={[-7.5, 0, -3]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.2, 2.2, 0.38]} />
          <meshStandardMaterial color="#6B4226" roughness={0.7} />
        </mesh>
        {[0.4, 0.7, 1.0, 1.3, 1.6, 1.9].map((y, i) => (
          <mesh key={i} position={[i % 2 === 0 ? -0.2 : 0.2, y, 0.1]} castShadow>
            <boxGeometry args={[0.3, 0.24, 0.15]} />
            <meshStandardMaterial color={['#C0392B', '#2980B9', '#27AE60', '#8E44AD', '#E67E22', '#16A085'][i]} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ── Decor: formal closing office ── */}
      {/* Wall clock on back wall (faces +z) */}
      <WallClock position={[3.5, 3.0, -6.85]} rotation={[Math.PI / 2, 0, 0]} />
      {/* Wall art on left wall (faces +x) */}
      <WallArt position={[-8.85, 3.0, 2]} rotation={[0, Math.PI / 2, 0]} color="#0D2B5E" w={1.4} h={1.0} />
      {/* Wall art on right wall (faces -x) */}
      <WallArt position={[8.85, 3.0, -2]} rotation={[0, -Math.PI / 2, 0]} color="#0A8F7E" w={1.3} h={1.0} />
      {/* Tall plants flanking corners */}
      <TallPlant position={[-7.8, 0, 5.5]} scale={1.05} />
      <TallPlant position={[7.8, 0, 5.5]} scale={1.05} />
      {/* Potted plant near bookshelf */}
      <PottedPlant position={[-7.5, 0, -5]} scale={1.1} />

      <NPCCharacter npc={NOTARY} onClick={() => openDialogue('notary')} />

      {/* Signing steps panel */}
      <Html position={[0, 5, 4.5]} center distanceFactor={15}>
        <div style={{
          background: 'rgba(13,43,94,0.97)', borderRadius: 18, padding: '20px 24px', minWidth: 360,
          color: '#fff', fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          textAlign: 'center',
        }}>
          {!celebrating ? (
            <>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, color: '#D4A843' }}>Closing Day — Final Steps</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 18 }}>Sign each document in order</div>
              {SIGNING_STEPS.map((s, i) => (
                <button key={s.id} onClick={() => handleStep(i)} disabled={i !== step} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  width: '100%', padding: '13px 16px', borderRadius: 12, marginBottom: 10,
                  background: i < step ? 'rgba(74,222,128,0.18)' : i === step ? '#D4A843' : 'rgba(255,255,255,0.06)',
                  color: i === step ? '#0D2B5E' : i < step ? '#4ade80' : 'rgba(255,255,255,0.4)',
                  border: i < step ? '1px solid rgba(74,222,128,0.5)' : 'none',
                  cursor: i === step ? 'pointer' : 'default',
                  fontWeight: 700, fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                }}>
                  <span>{s.icon}</span>
                  <span>{i < step ? '✓ ' : ''}{s.label}</span>
                </button>
              ))}
            </>
          ) : (
            <>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🏡</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#D4A843', marginBottom: 8 }}>You're a Homeowner!</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 6, lineHeight: 1.5 }}>
                Congratulations! Welcome to Newport News homeownership.
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
                Closing costs of $12,000 deducted from savings.
              </div>
              <button onClick={handleAdvance} style={{
                width: '100%', padding: '15px', borderRadius: 14, background: '#D4A843',
                color: '#0D2B5E', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 15,
                fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 20px rgba(212,168,67,0.5)',
              }}>
                Move Into Your New Home! →
              </button>
            </>
          )}
        </div>
      </Html>
    </group>
  );
}
