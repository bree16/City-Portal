import { useState } from 'react';
import { Html } from '@react-three/drei';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';
import {
  TallPlant,
  WallArt,
  WallClock,
  SideTable,
} from '@/components/decor/DecorKit';

const LOAN_OFFICER: NPCDef = {
  id: 'loanOfficer',
  name: 'Loan Officer',
  role: 'Loan Officer',
  skinTone: '#FDBCB4',
  hairColor: '#8B6914',
  shirtColor: '#0D2B5E',
  pantsColor: '#2C2C2C',
  position: [0, 0, -2.9],
  rotation: [0, 0, 0],
  important: true,
};

const DOCS = [
  { id: 'paystubs', label: 'Pay Stubs', x: -3.2, tip: '2 most recent' },
  { id: 'bank', label: 'Bank Statements', x: -1.05, tip: '2 months' },
  { id: 'w2', label: 'W-2 Forms', x: 1.1, tip: '2 years' },
  { id: 'tax', label: 'Tax Returns', x: 3.3, tip: '2 years' },
];

export default function BankScene() {
  const {
    openDialogue,
    completedInteractions,
    completeInteraction,
    creditScore,
    setStage,
    setTransitioning,
    addAchievement,
  } = useGameStore();

  const [approved, setApproved] = useState(false);
  // Only need 2 of 4 docs
  const docsSubmitted = DOCS.filter((d) => completedInteractions.includes(d.id)).length;
  const enoughDocs = docsSubmitted >= 2;
  const rate = creditScore >= 680 ? 6.2 : 6.8;

  const handleApprove = () => {
    setApproved(true);
    addAchievement('credit_champion');
  };

  const handleAdvance = () => {
    setTransitioning(true);
    setTimeout(() => {
      setStage(6);
      setTransitioning(false);
    }, 1800);
  };

  return (
    <group>
      {/* Marble floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#D8CEC0" roughness={0.25} metalness={0.08} />
      </mesh>
      <gridHelper args={[20, 20, '#C0B4A4', '#C0B4A4']} position={[0, 0.01, 0]} />

      {/* Walls */}
      <mesh position={[0, 2.5, -8]} receiveShadow>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#EDE8E0" roughness={0.9} />
      </mesh>
      <mesh position={[-10, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#E8E0D4" roughness={0.9} />
      </mesh>
      <mesh position={[10, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#E8E0D4" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#F8F6F0" roughness={1} />
      </mesh>

      {/* Fluorescent ceiling lights */}
      {[-6, -2, 2, 6].map((x) => (
        <group key={x}>
          <mesh position={[x, 4.88, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.4]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#E8F2FF" emissiveIntensity={1.8} />
          </mesh>
          <pointLight position={[x, 4.4, 0]} intensity={0.7} color="#D8E8FF" distance={10} />
        </group>
      ))}

      {/* Bank counter */}
      <mesh position={[0, 0.65, -2.2]} castShadow>
        <boxGeometry args={[12, 1.3, 0.45]} />
        <meshStandardMaterial color="#8B7355" roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.33, -2.2]} castShadow>
        <boxGeometry args={[12.1, 0.07, 0.6]} />
        <meshStandardMaterial color="#A09070" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Counter glass divider */}
      <mesh position={[0, 1.7, -2.25]}>
        <boxGeometry args={[12, 0.7, 0.04]} />
        <meshStandardMaterial color="#C8E0FF" transparent opacity={0.25} roughness={0.05} metalness={0.2} />
      </mesh>

      {/* Teller window dividers */}
      {[-4, 0, 4].map((x) => (
        <mesh key={x} position={[x, 1.8, -2.2]} castShadow>
          <boxGeometry args={[0.06, 1.0, 0.5]} />
          <meshStandardMaterial color="#888" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}

      {/* Bank sign on back wall — glowing */}
      <mesh position={[0, 3.6, -7.85]} castShadow>
        <boxGeometry args={[6.5, 0.75, 0.12]} />
        <meshStandardMaterial color="#0D2B5E" emissive="#0D2B5E" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      <Html position={[0, 3.6, -7.7]} center distanceFactor={16}>
        <div style={{ color: '#D4A843', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
          🏛 Newport News Community Bank
        </div>
      </Html>
      <pointLight position={[0, 4.0, -7]} intensity={0.6} color="#D4A843" distance={5} />

      {/* Waiting chairs */}
      {[-5, -3, 3, 5].map((x) => (
        <group key={x} position={[x, 0, 3.5]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.7, 0.1, 0.7]} />
            <meshStandardMaterial color="#2C3E6B" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.68, -0.3]} castShadow>
            <boxGeometry args={[0.7, 0.72, 0.09]} />
            <meshStandardMaterial color="#2C3E6B" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* ATM machine */}
      <group position={[-8, 0, -5]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.8, 2.0, 0.5]} />
          <meshStandardMaterial color="#2C2C2C" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 1.2, 0.26]} castShadow>
          <boxGeometry args={[0.5, 0.35, 0.05]} />
          <meshStandardMaterial color="#111" emissive="#002080" emissiveIntensity={0.8} roughness={0.1} metalness={0.3} />
        </mesh>
        <pointLight position={[-8, 1.4, -4.5]} intensity={0.4} color="#0040C0" distance={2} />
      </group>

      {/* Potted plants */}
      {[-7, 7].map((x) => (
        <group key={x} position={[x, 0, -6]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.22, 0.8, 8]} />
            <meshStandardMaterial color="#C47A3A" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.0, 0]} castShadow>
            <sphereGeometry args={[0.5, 10, 10]} />
            <meshStandardMaterial color="#2D7A2D" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Clickable document papers on counter */}
      {DOCS.map((doc) => (
        <group key={doc.id} position={[doc.x, 1.38, -2.2]}>
          <mesh
            castShadow
            onClick={(e) => {
              e.stopPropagation();
              if (!completedInteractions.includes(doc.id)) completeInteraction(doc.id);
            }}
          >
            <boxGeometry args={[0.48, 0.012, 0.38]} />
            <meshStandardMaterial
              color={completedInteractions.includes(doc.id) ? '#90EE90' : '#fff'}
              emissive={completedInteractions.includes(doc.id) ? '#00cc44' : '#4080FF'}
              emissiveIntensity={completedInteractions.includes(doc.id) ? 0.2 : 0.5}
              roughness={0.8}
            />
          </mesh>
          <Html position={[0, 0.34, 0]} center distanceFactor={10}>
            <div onClick={() => { if (!completedInteractions.includes(doc.id)) completeInteraction(doc.id); }} style={{
              background: completedInteractions.includes(doc.id) ? '#4ade80' : '#0D2B5E',
              color: completedInteractions.includes(doc.id) ? '#0D2B5E' : '#fff',
              fontSize: 10, padding: '3px 8px', borderRadius: 6,
              whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              {completedInteractions.includes(doc.id) ? '✓ ' : ''}{doc.label}
            </div>
          </Html>
        </group>
      ))}

      {/* ── Decor: professional, polished touches ─────────────── */}
      {/* Tall plants flanking the entrance corners */}
      <TallPlant position={[-9, 0, 6.5]} scale={1.1} />
      <TallPlant position={[9, 0, 6.5]} scale={1.1} />
      {/* Framed art on side walls, facing inward */}
      <WallArt position={[-9.85, 3.0, -3]} rotation={[0, Math.PI / 2, 0]} color="#2C5F7A" w={1.3} h={0.9} />
      <WallArt position={[9.85, 3.0, -3]} rotation={[0, -Math.PI / 2, 0]} color="#3A6B8A" w={1.3} h={0.9} />
      {/* Wall clock above the bank sign area, right of it */}
      <WallClock position={[4.5, 3.6, -7.82]} rotation={[0, 0, 0]} />
      {/* Waiting-area side table with magazines/mug between chairs */}
      <SideTable position={[0, 0, 3.5]} color="#5A4A3A" />
      {/* Magazine on the side table */}
      <mesh position={[-0.08, 0.94, 3.55]} rotation={[-Math.PI / 2, 0, 0.3]} castShadow>
        <boxGeometry args={[0.28, 0.36, 0.02]} />
        <meshStandardMaterial color="#D4A843" roughness={0.8} />
      </mesh>

      {/* Loan Officer NPC */}
      <NPCCharacter npc={LOAN_OFFICER} onClick={() => openDialogue('loanOfficer')} />

      {/* Application status panel */}
      <Html position={[6, 4.5, 2]} center distanceFactor={15}>
        <div style={{
          background: 'rgba(13,43,94,0.97)',
          borderRadius: 18, padding: '18px 22px', minWidth: 300,
          color: '#fff', fontFamily: 'Inter, sans-serif',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2, color: '#D4A843' }}>
            Mortgage Application
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
            Submit any 2 documents to apply ({docsSubmitted}/2 done)
          </div>

          {DOCS.map((d) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
              padding: '8px 12px', borderRadius: 10,
              background: completedInteractions.includes(d.id) ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
              border: completedInteractions.includes(d.id) ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255,255,255,0.08)',
              fontSize: 12,
            }}>
              <span>{completedInteractions.includes(d.id) ? '✅' : '📄'}</span>
              <span>{d.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{d.tip}</span>
            </div>
          ))}

          {enoughDocs && !approved && (
            <button onClick={handleApprove} style={{
              marginTop: 12, width: '100%', padding: '12px', borderRadius: 12,
              background: '#0A8F7E', color: '#fff', border: 'none',
              cursor: 'pointer', fontWeight: 800, fontSize: 13, fontFamily: 'Inter, sans-serif',
            }}>
              Submit Application →
            </button>
          )}

          {approved && (
            <div>
              <div style={{
                marginTop: 14, padding: '14px', borderRadius: 12,
                background: 'rgba(74,222,128,0.12)',
                border: '1px solid rgba(74,222,128,0.4)',
              }}>
                <div style={{ color: '#4ade80', fontWeight: 800, marginBottom: 6, fontSize: 13 }}>
                  ✓ APPROVED!
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                  <div>Interest Rate: <strong>{rate}%</strong></div>
                  <div>Term: <strong>30 years</strong></div>
                </div>
              </div>
              <button onClick={handleAdvance} style={{
                marginTop: 12, width: '100%', padding: '12px', borderRadius: 12,
                background: '#D4A843', color: '#0D2B5E', border: 'none',
                cursor: 'pointer', fontWeight: 800, fontSize: 13, fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 20px rgba(212,168,67,0.4)',
              }}>
                Proceed to Closing! →
              </button>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
