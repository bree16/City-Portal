import { useState } from 'react';
import { Html } from '@react-three/drei';
import { ScenePanelClose, ScenePanelReopen } from '@/components/ui/ScenePanelChrome';
import { InteractionZone } from '@/components/InteractionZone';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';
import {
  PottedPlant,
  TallPlant,
  WallArt,
  FloorLamp,
  Rug,
} from '@/components/decor/DecorKit';

import { GameIcon, GameIconName } from '@/components/ui/GameIcon';

const COUNSELOR: NPCDef = {
  id: 'counselor',
  name: 'Sarah — Counselor',
  role: 'Housing Counselor',
  skinTone: '#C68642',
  hairColor: '#1a0a00',
  shirtColor: '#0F766E',
  pantsColor: '#1A3A6B',
  position: [2, 0, -2.5],
  rotation: [0, Math.PI, 0],
  important: true,
};

const TASKS: { id: string; label: string; icon: GameIconName }[] = [
  { id: 'counselor', label: 'Talk to Housing Counselor', icon: 'counselor' },
  { id: 'whiteboard', label: 'Review Credit Score Guide', icon: 'chart' },
  { id: 'filing', label: 'Check Document Checklist', icon: 'documents' },
];

export default function CounselorOfficeScene() {
  const [panelOpen, setPanelOpen] = useState(true);
  const { openDialogue, completedInteractions, setStage, setTransitioning, addAchievement } =
    useGameStore();

  // 2 of 3 tasks is enough
  const doneCount = TASKS.filter((t) => completedInteractions.includes(t.id)).length;
  const canAdvance = doneCount >= 2;

  const handleAdvance = () => {
    addAchievement('first_mortgage');
    setTransitioning(true);
    setTimeout(() => {
      setStage(3);
      setTransitioning(false);
    }, 1800);
  };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#64748B" roughness={0.6} />
      </mesh>
      {/* Carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#4682B4" roughness={0.95} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2.5, -7]} receiveShadow>
        <boxGeometry args={[16, 5, 0.2]} />
        <meshStandardMaterial color="#E9E4DA" roughness={0.9} />
      </mesh>
      <mesh position={[-8, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#DDD8CE" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#E9E4DA" roughness={1} />
      </mesh>

      {/* Ceiling lights */}
      {[-4, 0, 4].map((x) => (
        <group key={x}>
          <mesh position={[x, 4.88, 0]}>
            <boxGeometry args={[1.0, 0.05, 0.5]} />
            <meshStandardMaterial color="#ffffff" emissive="#FFF0D4" emissiveIntensity={0.55} />
          </mesh>
          <pointLight position={[x, 4.5, 0]} intensity={0.5} color="#D2B48C" distance={10} />
        </group>
      ))}

      {/* Desk window — light source */}
      <mesh position={[6, 2.3, -6.88]}>
        <boxGeometry args={[2.5, 1.6, 0.08]} />
        <meshStandardMaterial color="#4682B4" emissive="#E0F0FF" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      <pointLight position={[6, 2.5, -6]} intensity={0.5} color="#5F9EA0" distance={7} />

      {/* Counselor desk */}
      <group position={[2, 0, -3]}>
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[2.2, 0.09, 1.1]} />
          <meshStandardMaterial color="#A0522D" roughness={0.5} metalness={0.05} />
        </mesh>
        {([-0.9, 0.9] as number[]).map((x) =>
          ([-0.45, 0.45] as number[]).map((z) => (
            <mesh key={`${x}-${z}`} position={[x + 2, 0.23, z + -3]} castShadow>
              <boxGeometry args={[0.09, 0.92, 0.09]} />
              <meshStandardMaterial color="#5F9EA0" roughness={0.5} />
            </mesh>
          ))
        )}
        {/* Monitor */}
        <mesh position={[0.4, 0.55, -0.15]} castShadow>
          <boxGeometry args={[0.55, 0.36, 0.05]} />
          <meshStandardMaterial color="#DDD8CE" roughness={0.2} metalness={0.4} emissive="#E0F0FF" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[2.5, 0.8, -2.8]} intensity={0.2} color="#4682B4" distance={2} />
        {/* Papers */}
        <mesh position={[-0.4, 0.52, 0]} castShadow>
          <boxGeometry args={[0.4, 0.01, 0.3]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.9} />
        </mesh>
      </group>

      {/* Visitor chairs */}
      {[-0.8, 0.8].map((x) => (
        <group key={x} position={[x + 2, 0, 0]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.65, 0.1, 0.65]} />
            <meshStandardMaterial color="#64748B" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.68, -0.28]} castShadow>
            <boxGeometry args={[0.65, 0.75, 0.08]} />
            <meshStandardMaterial color="#5F9EA0" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Whiteboard — clickable */}
      <InteractionZone position={[-3.5, 0, -5.6]} radius={1.8} prompt="Credit Score Guide" onActivate={() => openDialogue('whiteboard')} />
      <mesh
        position={[-3.5, 1.8, -6.85]}
        castShadow
        onPointerDown={(e) => { e.stopPropagation(); openDialogue('whiteboard'); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[3.0, 1.8, 0.1]} />
        <meshStandardMaterial
          color={completedInteractions.includes('whiteboard') ? '#D4AF37' : '#ffffff'}
          emissive={completedInteractions.includes('whiteboard') ? '#D4AF37' : '#1E3A8A'}
          emissiveIntensity={completedInteractions.includes('whiteboard') ? 0.3 : 0.08}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[-3.5, 1.8, -6.78]}>
        <boxGeometry args={[3.1, 1.9, 0.06]} />
        <meshStandardMaterial color="#5F9EA0" roughness={0.4} metalness={0.3} wireframe />
      </mesh>
      <Html position={[-3.5, 2.95, -6.7]} center distanceFactor={10}>
        <div onPointerDown={(e) => { e.stopPropagation(); openDialogue('whiteboard'); }} style={{
          background: completedInteractions.includes('whiteboard') ? '#D4AF37' : '#E9E4DA',
          color: completedInteractions.includes('whiteboard') ? '#E9E4DA' : '#fff',
          fontSize: 10, padding: '3px 10px', borderRadius: 'var(--glass-radius)',
          whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <GameIcon name={completedInteractions.includes('whiteboard') ? 'check' : 'chart'} size={12} />
          {completedInteractions.includes('whiteboard') ? 'Credit Score Guide' : 'Credit Score Guide'}
        </div>
      </Html>

      {/* Filing cabinet — clickable */}
      <InteractionZone position={[6, 0, -4]} radius={1.6} prompt="Paperwork Checklist" onActivate={() => openDialogue('filing')} />
      <group
        position={[6, 0, -4]}
        onPointerDown={(e) => { e.stopPropagation(); openDialogue('filing'); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.65, 1.3, 0.55]} />
          <meshStandardMaterial
            color={completedInteractions.includes('filing') ? '#D4AF37' : '#64748B'}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        {[0.3, 0.7, 1.1].map((y) => (
          <mesh key={y} position={[0.26, y, 0.3]} castShadow>
            <boxGeometry args={[0.15, 0.04, 0.04]} />
            <meshStandardMaterial color="#5F9EA0" metalness={0.7} roughness={0.2} />
          </mesh>
        ))}
        <Html position={[0, 1.55, 0]} center distanceFactor={10}>
          <div onPointerDown={(e) => { e.stopPropagation(); openDialogue('filing'); }} style={{
            background: completedInteractions.includes('filing') ? '#D4AF37' : '#1E3A8A',
            color: completedInteractions.includes('filing') ? '#E9E4DA' : '#fff',
            fontSize: 10, padding: '3px 10px', borderRadius: 'var(--glass-radius)',
            whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <GameIcon name={completedInteractions.includes('filing') ? 'check' : 'documents'} size={12} />
            {completedInteractions.includes('filing') ? 'Document Checklist' : 'Document Checklist'}
          </div>
        </Html>
      </group>

      {/* Bookshelf */}
      <group position={[-6.5, 0, -3]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.1, 2.2, 0.38]} />
          <meshStandardMaterial color="#A0522D" roughness={0.7} />
        </mesh>
        {[
          { y: 0.5, c: '#1E3A8A' }, { y: 0.75, c: '#0F766E' }, { y: 1.0, c: '#D4AF37' },
          { y: 1.25, c: '#047857' }, { y: 1.5, c: '#D4AF37' }, { y: 1.75, c: '#38BDF8' },
        ].map(({ y, c }, i) => (
          <mesh key={i} position={[i % 2 === 0 ? -0.2 : 0.2, y, 0.1]} castShadow>
            <boxGeometry args={[0.25, 0.22, 0.14]} />
            <meshStandardMaterial color={c} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Potted plant */}
      <group position={[7, 0, -5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.6, 8]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow>
          <sphereGeometry args={[0.4, 10, 10]} />
          <meshStandardMaterial color="#5F9EA0" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Decor: warm, welcoming office ─────────────────────── */}
      {/* Accent rug under the visitor chairs */}
      <Rug position={[2, 0.02, 0.2]} w={3.2} d={2.4} color="#4682B4" border="#2F4F4F" />
      {/* Tall plant in the far corner */}
      <TallPlant position={[-7, 0, -6] as [number, number, number]} scale={1.05} />
      {/* Extra small plant atop the filing cabinet */}
      <PottedPlant position={[6, 1.3, -4]} scale={0.5} leafColor="#2E8B57" potColor="#8B5A2B" />
      {/* Framed art on left wall, facing inward */}
      <WallArt position={[-7.85, 3.0, 1]} rotation={[0, Math.PI / 2, 0]} color="#5F9EA0" w={1.2} h={0.85} />
      {/* Warm floor lamp beside the bookshelf corner */}
      <FloorLamp position={[-7, 0, -1] as [number, number, number]} shadeColor="#F5F5DC" lightColor="#FFF0D4" />

      {/* Counselor NPC */}
      <NPCCharacter npc={COUNSELOR} onClick={() => openDialogue('counselor')} />

      {/* Task checklist panel */}
      <Html position={[-4, 4, 4]} center distanceFactor={15}>
        {!panelOpen ? (
          <ScenePanelReopen onOpen={() => setPanelOpen(true)} label="Task Checklist" icon="documents" />
        ) : (
        <div style={{
          position: 'relative',
          background: 'rgba(9,7,10,0.96)',
          borderRadius: 'var(--glass-radius)', padding: '18px 20px', minWidth: 300,
          color: '#fff', fontFamily: 'var(--display-font)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <ScenePanelClose onClose={() => setPanelOpen(false)} title="Hide Checklist" />
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2, color: '#D4AF37' }}>
            Getting Ready to Buy
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
            Complete any 2 of 3 tasks to continue
          </div>
          {TASKS.map((t) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
              padding: '8px 12px', borderRadius: 'var(--glass-radius)',
              background: completedInteractions.includes(t.id) ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
              border: completedInteractions.includes(t.id) ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255,255,255,0.08)',
              fontSize: 12,
            }}>
              <span style={{ display: 'flex', color: completedInteractions.includes(t.id) ? '#4ade80' : 'rgba(255,255,255,0.7)' }}>
                <GameIcon name={completedInteractions.includes(t.id) ? 'check' : t.icon} size={16} />
              </span>
              <span style={{ color: completedInteractions.includes(t.id) ? '#4ade80' : 'rgba(255,255,255,0.85)' }}>
                {t.label}
              </span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: '#D4AF37', textAlign: 'center', margin: '6px 0 10px', fontWeight: 700 }}>
            {doneCount}/2 complete
          </div>
          {canAdvance ? (
            <button onClick={handleAdvance} style={{
              width: '100%', padding: '12px', borderRadius: 'var(--glass-radius)',
              background: '#D4AF37', color: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', fontWeight: 800, fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
            }}>
              Start House Hunting! →
            </button>
          ) : (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
              Complete 2 tasks above to continue
            </div>
          )}
        </div>
        )}
      </Html>
    </group>
  );
}
