import { useState } from 'react';
import { Html } from '@react-three/drei';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';

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
  const allDocs = DOCS.every((d) => completedInteractions.includes(d.id));
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
        <meshStandardMaterial color="#D4C8B8" />
      </mesh>
      <gridHelper args={[20, 20, '#C0B4A4', '#C0B4A4']} position={[0, 0.01, 0]} />

      {/* Back wall */}
      <mesh position={[0, 2.5, -8]} receiveShadow>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#EDE8E0" />
      </mesh>
      {/* Side walls */}
      <mesh position={[-10, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#E8E0D4" />
      </mesh>
      <mesh position={[10, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#E8E0D4" />
      </mesh>

      {/* Bank counter */}
      <mesh position={[0, 0.65, -2.2]} castShadow>
        <boxGeometry args={[12, 1.3, 0.45]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      {/* Counter top */}
      <mesh position={[0, 1.33, -2.2]} castShadow>
        <boxGeometry args={[12.1, 0.07, 0.6]} />
        <meshStandardMaterial color="#A09070" />
      </mesh>

      {/* Teller window dividers */}
      {[-4, 0, 4].map((x) => (
        <mesh key={x} position={[x, 1.8, -2.2]} castShadow>
          <boxGeometry args={[0.06, 1.0, 0.5]} />
          <meshStandardMaterial color="#888" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}

      {/* Bank sign on back wall */}
      <mesh position={[0, 3.6, -7.85]} castShadow>
        <boxGeometry args={[6, 0.7, 0.1]} />
        <meshStandardMaterial color="#0D2B5E" />
      </mesh>
      <Html position={[0, 3.6, -7.7]} center distanceFactor={16}>
        <div
          style={{
            color: '#D4A843',
            fontWeight: 800,
            fontSize: 14,
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          🏛 Newport News Community Bank
        </div>
      </Html>

      {/* Waiting chairs */}
      {[-5, -3, 3, 5].map((x) => (
        <group key={x} position={[x, 0, 3.5]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.7, 0.1, 0.7]} />
            <meshStandardMaterial color="#2C3E6B" />
          </mesh>
          <mesh position={[0, 0.68, -0.3]} castShadow>
            <boxGeometry args={[0.7, 0.72, 0.09]} />
            <meshStandardMaterial color="#2C3E6B" />
          </mesh>
        </group>
      ))}

      {/* ATM machine */}
      <group position={[-8, 0, -5]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.8, 2.0, 0.5]} />
          <meshStandardMaterial color="#2C2C2C" />
        </mesh>
        <mesh position={[0, 1.2, 0.26]} castShadow>
          <boxGeometry args={[0.5, 0.35, 0.05]} />
          <meshStandardMaterial color="#111" emissive="#002080" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Potted plants */}
      {[-7, 7].map((x) => (
        <group key={x} position={[x, 0, -6]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.22, 0.8, 8]} />
            <meshStandardMaterial color="#C47A3A" />
          </mesh>
          <mesh position={[0, 1.0, 0]} castShadow>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshStandardMaterial color="#2D7A2D" />
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
              if (!completedInteractions.includes(doc.id)) {
                completeInteraction(doc.id);
              }
            }}
          >
            <boxGeometry args={[0.48, 0.012, 0.38]} />
            <meshStandardMaterial
              color={completedInteractions.includes(doc.id) ? '#90EE90' : '#fff'}
              emissive={completedInteractions.includes(doc.id) ? '#00cc44' : '#4080FF'}
              emissiveIntensity={completedInteractions.includes(doc.id) ? 0.15 : 0.4}
            />
          </mesh>
          <Html position={[0, 0.32, 0]} center distanceFactor={10}>
            <div
              style={{
                background: completedInteractions.includes(doc.id) ? '#4ade80' : '#0D2B5E',
                color: completedInteractions.includes(doc.id) ? '#0D2B5E' : '#fff',
                fontSize: 10,
                padding: '3px 8px',
                borderRadius: 6,
                whiteSpace: 'nowrap',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {completedInteractions.includes(doc.id) ? '✓ ' : ''}
              {doc.label}
            </div>
          </Html>
        </group>
      ))}

      {/* Loan Officer NPC */}
      <NPCCharacter npc={LOAN_OFFICER} onClick={() => openDialogue('loanOfficer')} />

      {/* Application status panel */}
      <Html position={[6, 4.5, 2]} center distanceFactor={15}>
        <div
          style={{
            background: 'rgba(13,43,94,0.97)',
            borderRadius: 18,
            padding: '18px 22px',
            minWidth: 300,
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, color: '#D4A843' }}>
            Mortgage Application
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
            Click each document on the counter to submit
          </div>

          {DOCS.map((d) => (
            <div
              key={d.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 8,
                padding: '8px 12px',
                borderRadius: 10,
                background: completedInteractions.includes(d.id)
                  ? 'rgba(74,222,128,0.15)'
                  : 'rgba(255,255,255,0.05)',
                border: completedInteractions.includes(d.id)
                  ? '1px solid rgba(74,222,128,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                fontSize: 12,
              }}
            >
              <span>{completedInteractions.includes(d.id) ? '✅' : '📄'}</span>
              <span>{d.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                {d.tip}
              </span>
            </div>
          ))}

          {allDocs && !approved && (
            <button
              onClick={handleApprove}
              style={{
                marginTop: 12,
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                background: '#0A8F7E',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Submit Application →
            </button>
          )}

          {approved && (
            <div>
              <div
                style={{
                  marginTop: 14,
                  padding: '14px',
                  borderRadius: 12,
                  background: 'rgba(74,222,128,0.12)',
                  border: '1px solid rgba(74,222,128,0.4)',
                }}
              >
                <div style={{ color: '#4ade80', fontWeight: 800, marginBottom: 6, fontSize: 13 }}>
                  ✓ APPROVED!
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                  <div>Interest Rate: <strong>{rate}%</strong></div>
                  <div>Term: <strong>30 years</strong></div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 4 }}>
                    Better credit = lower rate. You saved{' '}
                    {creditScore >= 680 ? '$0' : 'by improving to 680+'}!
                  </div>
                </div>
              </div>
              <button
                onClick={handleAdvance}
                style={{
                  marginTop: 12,
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
                Proceed to Closing! →
              </button>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
