import { Html } from '@react-three/drei';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';

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
};

export default function ApartmentScene() {
  const {
    openDialogue,
    completedInteractions,
    month,
    savings,
    creditScore,
    advanceMonth,
    updateSavings,
    updateDebt,
    updateCreditScore,
    updateCash,
    setStage,
    setTransitioning,
    addAchievement,
  } = useGameStore();

  const canAdvance = savings >= 5000 && creditScore >= 650;

  const handleMonthEnd = (choice: 'save' | 'debt' | 'spend') => {
    if (choice === 'save') {
      updateSavings(500);
      updateCash(-500);
    } else if (choice === 'debt') {
      updateDebt(-300);
      updateCreditScore(8);
      updateCash(-300);
    }
    advanceMonth();
    if (savings + (choice === 'save' ? 500 : 0) >= 5000) {
      addAchievement('budget_master');
    }
  };

  const handleAdvance = () => {
    setTransitioning(true);
    setTimeout(() => {
      setStage(2);
      setTransitioning(false);
    }, 1800);
  };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#C8B99A" />
      </mesh>
      {/* Tile lines */}
      <gridHelper args={[14, 14, '#B8A88A', '#B8A88A']} position={[0, 0.01, 0]} />

      {/* Back wall */}
      <mesh position={[0, 2.5, -6]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#F0EAD8" />
      </mesh>
      {/* Left wall */}
      <mesh position={[-7, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 12]} />
        <meshStandardMaterial color="#E8E0CC" />
      </mesh>
      {/* Right wall */}
      <mesh position={[7, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 12]} />
        <meshStandardMaterial color="#E8E0CC" />
      </mesh>

      {/* Window on back wall */}
      <mesh position={[-2, 2.2, -5.85]}>
        <boxGeometry args={[2.2, 1.6, 0.1]} />
        <meshStandardMaterial color="#87CEEB" emissive="#FFFACD" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2, 2.2, -5.8]}>
        <boxGeometry args={[2.3, 1.7, 0.08]} />
        <meshStandardMaterial color="#8B6914" wireframe />
      </mesh>

      {/* Sofa */}
      <group position={[-2, 0, -3.5]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[2.4, 0.65, 0.95]} />
          <meshStandardMaterial color="#6B5B95" />
        </mesh>
        <mesh position={[0, 0.72, -0.38]} castShadow>
          <boxGeometry args={[2.4, 0.85, 0.22]} />
          <meshStandardMaterial color="#5A4A84" />
        </mesh>
        {/* Sofa arms */}
        <mesh position={[-1.12, 0.55, 0]} castShadow>
          <boxGeometry args={[0.22, 0.45, 0.95]} />
          <meshStandardMaterial color="#5A4A84" />
        </mesh>
        <mesh position={[1.12, 0.55, 0]} castShadow>
          <boxGeometry args={[0.22, 0.45, 0.95]} />
          <meshStandardMaterial color="#5A4A84" />
        </mesh>
      </group>

      {/* Coffee table */}
      <mesh position={[-2, 0.22, -2]} castShadow>
        <boxGeometry args={[1.1, 0.12, 0.65]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      {/* Coffee table legs */}
      {([-0.45, 0.45] as number[]).map((x) =>
        ([-0.26, 0.26] as number[]).map((z) => (
          <mesh key={`${x}-${z}`} position={[x + -2, 0.1, z + -2]} castShadow>
            <boxGeometry args={[0.06, 0.44, 0.06]} />
            <meshStandardMaterial color="#7A5C44" />
          </mesh>
        ))
      )}

      {/* TV + stand */}
      <group position={[3, 0, -5.5]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.8, 0.7, 0.42]} />
          <meshStandardMaterial color="#2C2C2C" />
        </mesh>
        <mesh position={[0, 1.0, -0.12]} castShadow>
          <boxGeometry args={[1.6, 0.9, 0.08]} />
          <meshStandardMaterial color="#111" emissive="#001030" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Desk + laptop (clickable) */}
      <group position={[5, 0, 1.5]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[1.5, 0.08, 0.75]} />
          <meshStandardMaterial color="#A0785A" />
        </mesh>
        {([-0.65, 0.65] as number[]).map((x) =>
          ([-0.3, 0.3] as number[]).map((z) => (
            <mesh key={`leg-${x}-${z}`} position={[x + 5, 0.2, z + 1.5]} castShadow>
              <boxGeometry args={[0.07, 0.84, 0.07]} />
              <meshStandardMaterial color="#7A5C44" />
            </mesh>
          ))
        )}
        {/* Laptop — clickable */}
        <mesh
          position={[0, 0.48, -0.08]}
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            openDialogue('laptop');
          }}
        >
          <boxGeometry args={[0.65, 0.04, 0.45]} />
          <meshStandardMaterial color="#B8B8B8" emissive="#2040FF" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, 0.62, -0.28]} castShadow>
          <boxGeometry args={[0.65, 0.42, 0.04]} />
          <meshStandardMaterial color="#A0A0A0" emissive="#102060" emissiveIntensity={0.4} />
        </mesh>
        <Html position={[0, 0.9, 0]} center distanceFactor={9}>
          <div
            style={{
              background: '#0A8F7E',
              color: '#fff',
              fontSize: 10,
              padding: '3px 8px',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Check Budget
          </div>
        </Html>
      </group>

      {/* Piggy bank (clickable) */}
      <group position={[-5.5, 0, 1.5]}>
        <mesh
          position={[0, 0.28, 0]}
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            openDialogue('piggybank');
          }}
        >
          <sphereGeometry args={[0.28, 12, 12]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
        {/* Pig ears */}
        <mesh position={[-0.12, 0.48, 0.08]} castShadow>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color="#FFA0B0" />
        </mesh>
        <mesh position={[0.12, 0.48, 0.08]} castShadow>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color="#FFA0B0" />
        </mesh>
        <Html position={[0, 0.75, 0]} center distanceFactor={9}>
          <div
            style={{
              background: '#D4A843',
              color: '#0D2B5E',
              fontSize: 10,
              padding: '3px 8px',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Savings Jar
          </div>
        </Html>
      </group>

      {/* Kitchen counter */}
      <group position={[-4.5, 0, -4.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[3.0, 1.0, 0.65]} />
          <meshStandardMaterial color="#C8B890" />
        </mesh>
        <mesh position={[0, 1.06, 0]} castShadow>
          <boxGeometry args={[3.1, 0.08, 0.75]} />
          <meshStandardMaterial color="#A8A090" />
        </mesh>
        {/* Cabinet above */}
        <mesh position={[0, 2.4, -0.18]} castShadow>
          <boxGeometry args={[2.8, 0.8, 0.4]} />
          <meshStandardMaterial color="#C0B080" />
        </mesh>
      </group>

      {/* Door */}
      <group position={[6.5, 0, 2.5]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.12, 2.3, 1.1]} />
          <meshStandardMaterial color="#8B6914" />
        </mesh>
        <mesh position={[0.1, 1.0, 0.4]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#D4A843" metalness={0.8} roughness={0.15} />
        </mesh>
      </group>

      {/* Small rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.01, -2.5]} receiveShadow>
        <planeGeometry args={[3.5, 3]} />
        <meshStandardMaterial color="#8B6B8B" />
      </mesh>

      {/* Landlord NPC */}
      <NPCCharacter npc={LANDLORD} onClick={() => openDialogue('landlord')} />

      {/* Month action panel */}
      <Html position={[0, 4.2, 4.5]} center distanceFactor={14}>
        <div
          style={{
            background: 'rgba(13,43,94,0.96)',
            borderRadius: 18,
            padding: '18px 20px',
            minWidth: 340,
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4, color: '#D4A843' }}>
            Month {month} — What will you do this month?
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
            Click an NPC to talk. Use buttons below to manage your money.
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button
              onClick={() => handleMonthEnd('save')}
              style={{
                flex: 1,
                padding: '10px 4px',
                borderRadius: 10,
                background: '#0A8F7E',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              🐷 Save $500
            </button>
            <button
              onClick={() => handleMonthEnd('debt')}
              style={{
                flex: 1,
                padding: '10px 4px',
                borderRadius: 10,
                background: '#0D2B5E',
                color: '#fff',
                border: '1px solid #D4A843',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              💳 Pay Debt +8 Credit
            </button>
            <button
              onClick={() => handleMonthEnd('spend')}
              style={{
                flex: 1,
                padding: '10px 4px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              🎮 Treat Yourself
            </button>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 11 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Savings Goal</span>
                <span style={{ color: '#0A8F7E', fontWeight: 700 }}>${savings.toLocaleString()} / $5,000</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (savings / 5000) * 100)}%`,
                    background: '#0A8F7E',
                    borderRadius: 3,
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Credit Goal</span>
                <span style={{ color: creditScore >= 650 ? '#4ade80' : '#fbbf24', fontWeight: 700 }}>
                  {creditScore} / 650
                </span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, ((creditScore - 300) / 350) * 100)}%`,
                    background: creditScore >= 650 ? '#4ade80' : '#D4A843',
                    borderRadius: 3,
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>
          </div>

          {canAdvance ? (
            <button
              onClick={handleAdvance}
              style={{
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
              Ready to Buy! Start Preparing →
            </button>
          ) : (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              Need $5,000 savings + 650 credit score to advance
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
