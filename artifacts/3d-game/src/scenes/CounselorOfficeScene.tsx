import { Html } from '@react-three/drei';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';

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

  const allDone = TASKS.every((t) => completedInteractions.includes(t.id));

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
        <meshStandardMaterial color="#C0B09A" />
      </mesh>
      {/* Carpet area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#8B7B6B" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2.5, -7]} receiveShadow>
        <boxGeometry args={[16, 5, 0.2]} />
        <meshStandardMaterial color="#EAE0D0" />
      </mesh>
      <mesh position={[-8, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#E0D8C8" />
      </mesh>
      <mesh position={[8, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#E0D8C8" />
      </mesh>

      {/* Counselor desk */}
      <group position={[2, 0, -3]}>
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[2.2, 0.09, 1.1]} />
          <meshStandardMaterial color="#8B6914" />
        </mesh>
        {([-0.9, 0.9] as number[]).map((x) =>
          ([-0.45, 0.45] as number[]).map((z) => (
            <mesh key={`${x}-${z}`} position={[x + 2, 0.23, z + -3]} castShadow>
              <boxGeometry args={[0.09, 0.92, 0.09]} />
              <meshStandardMaterial color="#7A5C44" />
            </mesh>
          ))
        )}
        {/* Computer on desk */}
        <mesh position={[0.4, 0.55, -0.15]} castShadow>
          <boxGeometry args={[0.55, 0.36, 0.05]} />
          <meshStandardMaterial color="#222" emissive="#001840" emissiveIntensity={0.5} />
        </mesh>
        {/* Papers */}
        <mesh position={[-0.4, 0.52, 0]} castShadow>
          <boxGeometry args={[0.4, 0.01, 0.3]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </group>

      {/* Visitor chairs */}
      {[-0.8, 0.8].map((x) => (
        <group key={x} position={[x + 2, 0, 0]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.65, 0.1, 0.65]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 0.68, -0.28]} castShadow>
            <boxGeometry args={[0.65, 0.75, 0.08]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      ))}

      {/* Whiteboard — clickable */}
      <mesh
        position={[-3.5, 1.8, -6.85]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          openDialogue('whiteboard');
        }}
      >
        <boxGeometry args={[3.0, 1.8, 0.1]} />
        <meshStandardMaterial
          color={completedInteractions.includes('whiteboard') ? '#E8FFF0' : '#FFFFFF'}
          emissive={completedInteractions.includes('whiteboard') ? '#00ff88' : '#4080FF'}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Whiteboard frame */}
      <mesh position={[-3.5, 1.8, -6.8]}>
        <boxGeometry args={[3.1, 1.9, 0.06]} />
        <meshStandardMaterial color="#444" wireframe />
      </mesh>
      <Html position={[-3.5, 2.9, -6.7]} center distanceFactor={10}>
        <div
          style={{
            background: completedInteractions.includes('whiteboard') ? '#4ade80' : '#0D2B5E',
            color: completedInteractions.includes('whiteboard') ? '#0D2B5E' : '#fff',
            fontSize: 10,
            padding: '3px 10px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {completedInteractions.includes('whiteboard') ? '✓ ' : ''}Credit Score Guide
        </div>
      </Html>

      {/* Filing cabinet — clickable */}
      <group
        position={[6, 0, -4]}
        onClick={(e) => {
          e.stopPropagation();
          openDialogue('filing');
        }}
      >
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.65, 1.3, 0.55]} />
          <meshStandardMaterial
            color={completedInteractions.includes('filing') ? '#A8D8B0' : '#B0B0B0'}
          />
        </mesh>
        {/* Drawer handles */}
        {[0.3, 0.7, 1.1].map((y) => (
          <mesh key={y} position={[0.26, y, 0.3]} castShadow>
            <boxGeometry args={[0.15, 0.04, 0.04]} />
            <meshStandardMaterial color="#888" metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
        <Html position={[0, 1.5, 0]} center distanceFactor={10}>
          <div
            style={{
              background: completedInteractions.includes('filing') ? '#4ade80' : '#0A8F7E',
              color: completedInteractions.includes('filing') ? '#0D2B5E' : '#fff',
              fontSize: 10,
              padding: '3px 10px',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {completedInteractions.includes('filing') ? '✓ ' : ''}Document Checklist
          </div>
        </Html>
      </group>

      {/* Bookshelf */}
      <group position={[-6.5, 0, -3]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.1, 2.2, 0.38]} />
          <meshStandardMaterial color="#6B4226" />
        </mesh>
        {/* Books */}
        {[
          { y: 0.5, c: '#C0392B' },
          { y: 0.75, c: '#2980B9' },
          { y: 1.0, c: '#27AE60' },
          { y: 1.25, c: '#8E44AD' },
          { y: 1.5, c: '#E67E22' },
          { y: 1.75, c: '#16A085' },
        ].map(({ y, c }, i) => (
          <mesh key={i} position={[i % 2 === 0 ? -0.2 : 0.2, y, 0.1]} castShadow>
            <boxGeometry args={[0.25, 0.22, 0.14]} />
            <meshStandardMaterial color={c} />
          </mesh>
        ))}
      </group>

      {/* Potted plant */}
      <group position={[7, 0, -5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.6, 8]} />
          <meshStandardMaterial color="#C47A3A" />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#2D7A2D" />
        </mesh>
      </group>

      {/* Counselor NPC */}
      <NPCCharacter npc={COUNSELOR} onClick={() => openDialogue('counselor')} />

      {/* Task checklist panel */}
      <Html position={[-4, 4, 4]} center distanceFactor={15}>
        <div
          style={{
            background: 'rgba(13,43,94,0.96)',
            borderRadius: 18,
            padding: '18px 20px',
            minWidth: 300,
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, color: '#D4A843' }}>
            Getting Ready to Buy
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
            Click each item in the scene to complete it
          </div>
          {TASKS.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
                padding: '8px 12px',
                borderRadius: 10,
                background: completedInteractions.includes(t.id)
                  ? 'rgba(74,222,128,0.15)'
                  : 'rgba(255,255,255,0.05)',
                border: completedInteractions.includes(t.id)
                  ? '1px solid rgba(74,222,128,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                fontSize: 12,
              }}
            >
              <span>{t.icon}</span>
              <span>{completedInteractions.includes(t.id) ? '✓ ' : ''}{t.label}</span>
            </div>
          ))}
          {allDone ? (
            <button
              onClick={handleAdvance}
              style={{
                marginTop: 8,
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                background: '#D4A843',
                color: '#0D2B5E',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Start House Hunting! →
            </button>
          ) : (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 8 }}>
              Complete all tasks above to continue
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
