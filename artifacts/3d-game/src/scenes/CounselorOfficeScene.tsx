import { Html } from '@react-three/drei';
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

const COUNSELOR: NPCDef = {
  id: 'counselor',
  name: 'Sarah — Counselor',
  role: 'Housing Counselor',
  skinTone: '#C68642',
  hairColor: '#1a0a00',
  shirtColor: '#0A8F7E',
  pantsColor: '#1A3A6B',
  position: [2, 0, -2.5],
  rotation: [0, Math.PI, 0],
};

const TASKS = [
  { id: 'counselor', label: 'Talk to Housing Counselor', icon: '👤' },
  { id: 'whiteboard', label: 'Review Credit Score Guide', icon: '📊' },
  { id: 'filing', label: 'Check Document Checklist', icon: '📂' },
];

export default function CounselorOfficeScene() {
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
        <meshStandardMaterial color="#C0B09A" roughness={0.6} />
      </mesh>
      {/* Carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#7B6B5B" roughness={0.95} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2.5, -7]} receiveShadow>
        <boxGeometry args={[16, 5, 0.2]} />
        <meshStandardMaterial color="#EAE0D0" roughness={0.9} />
      </mesh>
      <mesh position={[-8, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#E0D8C8" roughness={0.9} />
      </mesh>
      <mesh position={[8, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#E0D8C8" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#F5F0E8" roughness={1} />
      </mesh>

      {/* Ceiling lights */}
      {[-4, 0, 4].map((x) => (
        <group key={x}>
          <mesh position={[x, 4.88, 0]}>
            <boxGeometry args={[1.0, 0.05, 0.5]} />
            <meshStandardMaterial color="#FFFFF0" emissive="#F0F8FF" emissiveIntensity={1.2} />
          </mesh>
          <pointLight position={[x, 4.5, 0]} intensity={0.5} color="#EEF4FF" distance={10} />
        </group>
      ))}

      {/* Desk window — light source */}
      <mesh position={[6, 2.3, -6.88]}>
        <boxGeometry args={[2.5, 1.6, 0.08]} />
        <meshStandardMaterial color="#87CEEB" emissive="#E0F0FF" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      <pointLight position={[6, 2.5, -6]} intensity={0.8} color="#D0E8FF" distance={7} />

      {/* Counselor desk */}
      <group position={[2, 0, -3]}>
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[2.2, 0.09, 1.1]} />
          <meshStandardMaterial color="#8B6914" roughness={0.5} metalness={0.05} />
        </mesh>
        {([-0.9, 0.9] as number[]).map((x) =>
          ([-0.45, 0.45] as number[]).map((z) => (
            <mesh key={`${x}-${z}`} position={[x + 2, 0.23, z + -3]} castShadow>
              <boxGeometry args={[0.09, 0.92, 0.09]} />
              <meshStandardMaterial color="#7A5C44" roughness={0.5} />
            </mesh>
          ))
        )}
        {/* Monitor */}
        <mesh position={[0.4, 0.55, -0.15]} castShadow>
          <boxGeometry args={[0.55, 0.36, 0.05]} />
          <meshStandardMaterial color="#222" roughness={0.2} metalness={0.4} emissive="#001840" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[2.5, 0.8, -2.8]} intensity={0.2} color="#003080" distance={2} />
        {/* Papers */}
        <mesh position={[-0.4, 0.52, 0]} castShadow>
          <boxGeometry args={[0.4, 0.01, 0.3]} />
          <meshStandardMaterial color="#fff" roughness={0.9} />
        </mesh>
      </group>

      {/* Visitor chairs */}
      {[-0.8, 0.8].map((x) => (
        <group key={x} position={[x + 2, 0, 0]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.65, 0.1, 0.65]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.68, -0.28]} castShadow>
            <boxGeometry args={[0.65, 0.75, 0.08]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Whiteboard — clickable */}
      <mesh
        position={[-3.5, 1.8, -6.85]}
        castShadow
        onClick={(e) => { e.stopPropagation(); openDialogue('whiteboard'); }}
      >
        <boxGeometry args={[3.0, 1.8, 0.1]} />
        <meshStandardMaterial
          color={completedInteractions.includes('whiteboard') ? '#E8FFF0' : '#FFFFFF'}
          emissive={completedInteractions.includes('whiteboard') ? '#00ff88' : '#4080FF'}
          emissiveIntensity={completedInteractions.includes('whiteboard') ? 0.12 : 0.08}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[-3.5, 1.8, -6.78]}>
        <boxGeometry args={[3.1, 1.9, 0.06]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.3} wireframe />
      </mesh>
      <Html position={[-3.5, 2.95, -6.7]} center distanceFactor={10}>
        <div onClick={() => openDialogue('whiteboard')} style={{
          background: completedInteractions.includes('whiteboard') ? '#4ade80' : '#0D2B5E',
          color: completedInteractions.includes('whiteboard') ? '#0D2B5E' : '#fff',
          fontSize: 10, padding: '3px 10px', borderRadius: 6,
          whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          {completedInteractions.includes('whiteboard') ? '✓ ' : ''}Credit Score Guide
        </div>
      </Html>

      {/* Filing cabinet — clickable */}
      <group
        position={[6, 0, -4]}
        onClick={(e) => { e.stopPropagation(); openDialogue('filing'); }}
      >
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.65, 1.3, 0.55]} />
          <meshStandardMaterial
            color={completedInteractions.includes('filing') ? '#A8D8B0' : '#B0B0B0'}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        {[0.3, 0.7, 1.1].map((y) => (
          <mesh key={y} position={[0.26, y, 0.3]} castShadow>
            <boxGeometry args={[0.15, 0.04, 0.04]} />
            <meshStandardMaterial color="#888" metalness={0.7} roughness={0.2} />
          </mesh>
        ))}
        <Html position={[0, 1.55, 0]} center distanceFactor={10}>
          <div onClick={() => openDialogue('filing')} style={{
            background: completedInteractions.includes('filing') ? '#4ade80' : '#0A8F7E',
            color: completedInteractions.includes('filing') ? '#0D2B5E' : '#fff',
            fontSize: 10, padding: '3px 10px', borderRadius: 6,
            whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
            {completedInteractions.includes('filing') ? '✓ ' : ''}Document Checklist
          </div>
        </Html>
      </group>

      {/* Bookshelf */}
      <group position={[-6.5, 0, -3]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.1, 2.2, 0.38]} />
          <meshStandardMaterial color="#6B4226" roughness={0.7} />
        </mesh>
        {[
          { y: 0.5, c: '#C0392B' }, { y: 0.75, c: '#2980B9' }, { y: 1.0, c: '#27AE60' },
          { y: 1.25, c: '#8E44AD' }, { y: 1.5, c: '#E67E22' }, { y: 1.75, c: '#16A085' },
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
          <meshStandardMaterial color="#C47A3A" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow>
          <sphereGeometry args={[0.4, 10, 10]} />
          <meshStandardMaterial color="#2D7A2D" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Decor: warm, welcoming office ─────────────────────── */}
      {/* Accent rug under the visitor chairs */}
      <Rug position={[2, 0.02, 0.2]} w={3.2} d={2.4} color="#8A6A4A" border="#6A4A2A" />
      {/* Tall plant in the far corner */}
      <TallPlant position={[-7, 0, -6] as [number, number, number]} scale={1.05} />
      {/* Extra small plant atop the filing cabinet */}
      <PottedPlant position={[6, 1.3, -4]} scale={0.5} leafColor="#3A8A3A" potColor="#8B5A2B" />
      {/* Framed art on left wall, facing inward */}
      <WallArt position={[-7.85, 3.0, 1]} rotation={[0, Math.PI / 2, 0]} color="#0A8F7E" w={1.2} h={0.85} />
      {/* Warm floor lamp beside the bookshelf corner */}
      <FloorLamp position={[-7, 0, -1] as [number, number, number]} shadeColor="#F2E4C4" lightColor="#FFDDA0" />

      {/* Counselor NPC */}
      <NPCCharacter npc={COUNSELOR} onClick={() => openDialogue('counselor')} />

      {/* Task checklist panel */}
      <Html position={[-4, 4, 4]} center distanceFactor={15}>
        <div style={{
          background: 'rgba(13,43,94,0.96)',
          borderRadius: 18, padding: '18px 20px', minWidth: 300,
          color: '#fff', fontFamily: 'Inter, sans-serif',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2, color: '#D4A843' }}>
            Getting Ready to Buy
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
            Complete any 2 of 3 tasks to continue
          </div>
          {TASKS.map((t) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
              padding: '8px 12px', borderRadius: 10,
              background: completedInteractions.includes(t.id) ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
              border: completedInteractions.includes(t.id) ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255,255,255,0.08)',
              fontSize: 12,
            }}>
              <span>{t.icon}</span>
              <span style={{ color: completedInteractions.includes(t.id) ? '#4ade80' : 'rgba(255,255,255,0.85)' }}>
                {completedInteractions.includes(t.id) ? '✓ ' : ''}{t.label}
              </span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: '#D4A843', textAlign: 'center', margin: '6px 0 10px', fontWeight: 700 }}>
            {doneCount}/2 complete
          </div>
          {canAdvance ? (
            <button onClick={handleAdvance} style={{
              width: '100%', padding: '12px', borderRadius: 12,
              background: '#D4A843', color: '#0D2B5E', border: 'none',
              cursor: 'pointer', fontWeight: 800, fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 20px rgba(212,168,67,0.4)',
            }}>
              Start House Hunting! →
            </button>
          ) : (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
              Complete 2 tasks above to continue
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
