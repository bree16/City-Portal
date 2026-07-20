import { useState } from 'react';
import { Html } from '@react-three/drei';
import { ScenePanelClose, ScenePanelReopen } from '@/components/ui/ScenePanelChrome';
import { InteractionZone } from '@/components/InteractionZone';
import { SceneObstacles } from '@/components/SceneObstacles';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';
import { selectLifeEvent, shouldEventFire } from '@/data/lifeEvents';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';
import {
  PottedPlant,
  WallArt,
  Curtains,
  FloorLamp,
  BookRow,
  WallClock,
} from '@/components/decor/DecorKit';

const LANDLORD: NPCDef = {
  id: 'landlord',
  name: 'Landlord',
  role: 'Your Landlord',
  skinTone: '#E0AC69',
  hairColor: '#1a0a00',
  shirtColor: '#C0392B',
  pantsColor: '#2C2C2C',
  position: [4.5, 0, -2.5],
  rotation: [0, Math.PI + 0.5, 0],
  important: true,
};

export default function ApartmentScene() {
  const [panelOpen, setPanelOpen] = useState(true);
  const {
    openDialogue,
    completedInteractions,
    savings,
    creditScore,
    month,
    monthlyIncome,
    monthlyExpenses,
    setStage,
    setTransitioning,
    addAchievement,
    advanceMonth,
    setPendingLifeEvent,
  } = useGameStore();

  // Just talk to the landlord AND interact with one financial item — no month grinding
  const talkedToLandlord = completedInteractions.includes('landlord');
  const checkedFinances =
    completedInteractions.includes('laptop') || completedInteractions.includes('piggybank');
  const canAdvance = talkedToLandlord && checkedFinances;

  const handleAdvance = () => {
    addAchievement('budget_master');
    setTransitioning(true);
    setTimeout(() => {
      setStage(2);
      setTransitioning(false);
    }, 1800);
  };

  return (
    <group>
      <SceneObstacles
        circles={[
          { x: -2, z: -3.5, r: 1.4 },   // sofa
          { x: -2, z: -2, r: 0.7 },     // coffee table
          { x: 3, z: -5.5, r: 1.1 },    // TV stand
          { x: 5, z: 1.5, r: 0.95 },    // desk
          { x: -4.5, z: -4.5, r: 1.7 }, // kitchen counter
          { x: -5.5, z: 1.5, r: 0.5 },  // piggy bank
          { x: 6.4, z: -3.4, r: 0.55 }, // floor lamp
          { x: -6.2, z: -1.5, r: 0.45 },// potted plant (left wall)
        ]}
        bounds={{ minX: -6.4, maxX: 6.4, minZ: -5.4, maxZ: 5.4 }}
      />
      {/* Generous interaction zones */}
      <InteractionZone position={[5, 0, 1.5]} radius={2.0} prompt="Check Budget" onActivate={() => openDialogue('laptop')} />
      <InteractionZone position={[-5.5, 0, 1.5]} radius={2.0} prompt="Savings Jar" onActivate={() => openDialogue('piggybank')} />
      <InteractionZone position={[4.5, 0, -2.5]} radius={2.0} prompt="Talk to Landlord" onActivate={() => openDialogue('landlord')} />
      {/* Floor — warm hardwood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.45} metalness={0.05} />
      </mesh>
      <gridHelper args={[14, 14, '#1E3A8A', '#1E3A8A']} position={[0, 0.01, 0]} />

      {/* Walls */}
      <mesh position={[0, 2.5, -6]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
      </mesh>
      <mesh position={[-7, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 12]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
      </mesh>
      <mesh position={[7, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 12]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#F8FAFC" roughness={1} />
      </mesh>

      {/* Ceiling light — emissive glow */}
      <mesh position={[0, 4.85, 0]}>
        <boxGeometry args={[1.2, 0.06, 1.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#0F766E" emissiveIntensity={1.5} roughness={0.5} />
      </mesh>
      <pointLight position={[0, 4.5, 0]} intensity={0.8} color="#0F766E" distance={12} />

      {/* Window on back wall — glowing sunlight */}
      <mesh position={[-2, 2.2, -5.85]}>
        <boxGeometry args={[2.2, 1.6, 0.08]} />
        <meshStandardMaterial color="#1E3A8A" emissive="#D4AF37" emissiveIntensity={0.8} roughness={0.1} />
      </mesh>
      {/* Window frame */}
      <mesh position={[-2, 2.2, -5.78]}>
        <boxGeometry args={[2.32, 1.72, 0.06]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.6} metalness={0.05} wireframe />
      </mesh>
      {/* Window glow light */}
      <pointLight position={[-2, 2.5, -5]} intensity={1.2} color="#D4AF37" distance={8} />

      {/* Sofa */}
      <group position={[-2, 0, -3.5]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[2.4, 0.65, 0.95]} />
          <meshStandardMaterial color="#64748B" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.72, -0.38]} castShadow>
          <boxGeometry args={[2.4, 0.85, 0.22]} />
          <meshStandardMaterial color="#A0522D" roughness={0.95} />
        </mesh>
        <mesh position={[-1.12, 0.55, 0]} castShadow>
          <boxGeometry args={[0.22, 0.45, 0.95]} />
          <meshStandardMaterial color="#A0522D" roughness={0.95} />
        </mesh>
        <mesh position={[1.12, 0.55, 0]} castShadow>
          <boxGeometry args={[0.22, 0.45, 0.95]} />
          <meshStandardMaterial color="#A0522D" roughness={0.95} />
        </mesh>
      </group>

      {/* Coffee table */}
      <mesh position={[-2, 0.22, -2]} castShadow>
        <boxGeometry args={[1.1, 0.12, 0.65]} />
        <meshStandardMaterial color="#0F766E" roughness={0.5} metalness={0.05} />
      </mesh>
      {([-0.45, 0.45] as number[]).map((x) =>
        ([-0.26, 0.26] as number[]).map((z) => (
          <mesh key={`${x}-${z}`} position={[x + -2, 0.1, z + -2]} castShadow>
            <boxGeometry args={[0.06, 0.44, 0.06]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.5} metalness={0.1} />
          </mesh>
        ))
      )}

      {/* TV + stand */}
      <group position={[3, 0, -5.5]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.8, 0.7, 0.42]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.0, -0.12]} castShadow>
          <boxGeometry args={[1.6, 0.9, 0.08]} />
          <meshStandardMaterial color="#F8FAFC" emissive="#1E3A8A" emissiveIntensity={0.5} roughness={0.1} metalness={0.3} />
        </mesh>
        <pointLight position={[3, 1.2, -5.2]} intensity={0.3} color="#1E3A8A" distance={3} />
      </group>

      {/* Desk + laptop (clickable) */}
      <group position={[5, 0, 1.5]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[1.5, 0.08, 0.75]} />
          <meshStandardMaterial color="#64748B" roughness={0.5} metalness={0.05} />
        </mesh>
        {([-0.65, 0.65] as number[]).map((x) =>
          ([-0.3, 0.3] as number[]).map((z) => (
            <mesh key={`leg-${x}-${z}`} position={[x + 5, 0.2, z + 1.5]} castShadow>
              <boxGeometry args={[0.07, 0.84, 0.07]} />
              <meshStandardMaterial color="#A0522D" roughness={0.5} />
            </mesh>
          ))
        )}
        {/* Laptop base */}
        <mesh
          position={[0, 0.48, -0.08]}
          castShadow
          onPointerDown={(e) => {
            e.stopPropagation();
            openDialogue('laptop');
          }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <boxGeometry args={[0.65, 0.04, 0.45]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.6} emissive="#0F766E" emissiveIntensity={0.2} />
        </mesh>
        {/* Laptop screen */}
        <mesh position={[0, 0.62, -0.28]} castShadow>
          <boxGeometry args={[0.65, 0.42, 0.04]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.5} emissive="#0F766E" emissiveIntensity={0.7} />
        </mesh>
        <pointLight position={[5, 0.9, 1.2]} intensity={0.3} color="#0F766E" distance={2} />
        <Html position={[0, 0.95, 0]} center distanceFactor={9}>
          <div onPointerDown={(e) => { e.stopPropagation(); openDialogue('laptop'); }} style={{
            background: completedInteractions.includes('laptop') ? '#4ade80' : '#0F766E',
            color: completedInteractions.includes('laptop') ? '#F8FAFC' : '#fff',
            fontSize: 10, padding: '3px 8px', borderRadius: 'var(--glass-radius)',
            whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <GameIcon name={completedInteractions.includes('laptop') ? 'check' : 'budget'} size={12} />
            {completedInteractions.includes('laptop') ? 'Budget Checked' : 'Check Budget'}
          </div>
        </Html>
      </group>

      {/* Piggy bank (clickable) */}
      <group position={[-5.5, 0, 1.5]}>
        <mesh
          position={[0, 0.28, 0]}
          castShadow
          onPointerDown={(e) => {
            e.stopPropagation();
            openDialogue('piggybank');
          }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <sphereGeometry args={[0.28, 16, 12]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} metalness={0.05} />
        </mesh>
        <mesh position={[-0.12, 0.48, 0.08]} castShadow>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.6} />
        </mesh>
        <mesh position={[0.12, 0.48, 0.08]} castShadow>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.6} />
        </mesh>
        <Html position={[0, 0.75, 0]} center distanceFactor={9}>
          <div onPointerDown={(e) => { e.stopPropagation(); openDialogue('piggybank'); }} style={{
            background: completedInteractions.includes('piggybank') ? '#4ade80' : '#D4AF37',
            color: completedInteractions.includes('piggybank') ? '#F8FAFC' : '#F8FAFC',
            fontSize: 10, padding: '3px 8px', borderRadius: 'var(--glass-radius)',
            whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <GameIcon name={completedInteractions.includes('piggybank') ? 'check' : 'piggy-bank'} size={12} />
            {completedInteractions.includes('piggybank') ? 'Savings Checked' : 'Savings Jar'}
          </div>
        </Html>
      </group>

      {/* Kitchen counter */}
      <group position={[-4.5, 0, -4.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[3.0, 1.0, 0.65]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.06, 0]} castShadow>
          <boxGeometry args={[3.1, 0.08, 0.75]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 2.4, -0.18]} castShadow>
          <boxGeometry args={[2.8, 0.8, 0.4]} />
          <meshStandardMaterial color="#64748B" roughness={0.7} />
        </mesh>
      </group>

      {/* Door */}
      <group position={[6.5, 0, 2.5]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.12, 2.3, 1.1]} />
          <meshStandardMaterial color="#A0522D" roughness={0.6} />
        </mesh>
        <mesh position={[0.1, 1.0, 0.4]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.1} />
        </mesh>
      </group>

      {/* Small rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.01, -2.5]} receiveShadow>
        <planeGeometry args={[3.5, 3]} />
        <meshStandardMaterial color="#1E3A8A" roughness={0.95} />
      </mesh>

      {/* ── Decor: cozy-but-modest touches ────────────────────── */}
      {/* Curtains flanking the window on the back wall (window at x=-2) */}
      <Curtains position={[-2, 1.65, -5.75]} width={2.9} height={2.6} color="#0F766E" />
      {/* Framed art on back wall, right of window */}
      <WallArt position={[3, 2.4, -5.88]} rotation={[0, 0, 0]} color="#0F766E" w={1.0} h={0.75} />
      {/* Wall clock on right wall, facing inward */}
      <WallClock position={[6.88, 3.0, -1]} rotation={[0, -Math.PI / 2, 0]} />
      {/* Floor lamp in cozy corner near sofa */}
      <FloorLamp position={[6.4, 0, -3.4]} />
      {/* Potted plant against the left wall */}
      <PottedPlant position={[-6.2, 0, -1.5]} scale={1.05} />
      {/* Small potted plant on coffee table */}
      <PottedPlant position={[-2.3, 0.28, -2]} scale={0.45} leafColor="#D4AF37" potColor="#64748B" />
      {/* Books stacked on the TV stand */}
      <BookRow position={[2.5, 0.7, -5.35]} count={4} />
      {/* Kitchenette clutter — bowl of fruit & a kettle on the counter */}
      <group position={[-4.5, 1.14, -4.35]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.11, 0.09, 12]} />
          <meshStandardMaterial color="#0F766E" roughness={0.7} />
        </mesh>
        {[[-0.05, 0, 0.02], [0.06, 0, -0.03], [0, 0, 0.06]].map((p, i) => (
          <mesh key={i} position={[p[0], 0.09, p[2]]} castShadow>
            <sphereGeometry args={[0.055, 8, 6]} />
            <meshStandardMaterial color={i === 0 ? '#1E3A8A' : i === 1 ? '#D4AF37' : '#0F766E'} roughness={0.6} />
          </mesh>
        ))}
      </group>
      {/* Kettle on counter */}
      <group position={[-5.6, 1.14, -4.4]}>
        <mesh position={[0, 0.13, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 0.24, 10]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh position={[0.14, 0.16, 0]} rotation={[0, 0, -0.6]} castShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.14, 6]} />
          <meshStandardMaterial color="#0F766E" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* Landlord NPC */}
      <NPCCharacter npc={LANDLORD} onClick={() => openDialogue('landlord')} />

      {/* Streamlined action panel */}
      <Html position={[0, 4.0, 4.5]} center distanceFactor={14}>
        {!panelOpen ? (
          <ScenePanelReopen onOpen={() => setPanelOpen(true)} label="Stage 1 Steps" icon="documents" />
        ) : (
        <div style={{
          position: 'relative',
          background: 'rgba(9,7,10,0.96)',
          borderRadius: 'var(--glass-radius)',
          padding: '18px 22px',
          minWidth: 320,
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <ScenePanelClose onClose={() => setPanelOpen(false)} title="Hide Steps" />
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, color: '#D4AF37' }}>
            Stage 1 — Getting Ready
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>
            Two quick steps before you start your homebuying journey.
          </div>

          {/* Step checklist */}
          {[
            { id: 'landlord', label: 'Talk to your landlord', icon: 'counselor' as GameIconName, done: talkedToLandlord },
            { id: 'finances', label: 'Check your budget (laptop or savings jar)', icon: 'budget' as GameIconName, done: checkedFinances },
          ].map((step) => (
            <div key={step.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
              padding: '9px 12px', borderRadius: 'var(--glass-radius)',
              background: step.done ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
              border: step.done ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255,255,255,0.08)',
              fontSize: 12,
            }}>
              <span style={{ display: 'flex', color: step.done ? '#4ade80' : 'rgba(255,255,255,0.7)' }}>
                <GameIcon name={step.done ? 'check' : step.icon} size={16} />
              </span>
              <span style={{ color: step.done ? '#4ade80' : 'rgba(255,255,255,0.85)' }}>
                {step.label}
              </span>
            </div>
          ))}

          {/* Stats mini-display */}
          <div style={{ display: 'flex', gap: 10, margin: '12px 0', fontSize: 11 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--glass-radius)', padding: '8px 10px' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Savings</div>
              <div style={{ color: '#0F766E', fontWeight: 800 }}>${savings.toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--glass-radius)', padding: '8px 10px' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Credit Score</div>
              <div style={{ color: creditScore >= 650 ? '#4ade80' : '#fbbf24', fontWeight: 800 }}>{creditScore}</div>
            </div>
          </div>

          {/* End Month — builds savings & may trigger a life event */}
          <button
            onClick={() => {
              // Check for life event BEFORE advancing (use current month as seed)
              const fires = shouldEventFire(month);
              advanceMonth();
              if (fires) {
                setPendingLifeEvent(selectLifeEvent(month));
              }
            }}
            style={{
              width: '100%', padding: '10px', borderRadius: 'var(--glass-radius)',
              background: 'rgba(15,118,110,0.18)',
              border: '1px solid rgba(15,118,110,0.4)',
              color: '#0F766E', cursor: 'pointer', fontWeight: 700, fontSize: 12,
              fontFamily: 'Inter, sans-serif', marginBottom: 8,
            }}
          >
            ⏭ Pass a Month (+${(monthlyIncome - monthlyExpenses).toLocaleString()} net)
          </button>

          {canAdvance ? (
            <button onClick={handleAdvance} style={{
              width: '100%', padding: '13px', borderRadius: 'var(--glass-radius)',
              background: '#D4AF37', color: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', fontWeight: 800, fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
            }}>
              Ready to Buy! Let's Go! →
            </button>
          ) : (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              Complete both steps above to continue
            </div>
          )}
        </div>
        )}
      </Html>
    </group>
  );
}
