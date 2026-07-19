import { useState } from 'react';
import { Html } from '@react-three/drei';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';

const SELLER: NPCDef = {
  id: 'seller',
  name: 'Home Seller',
  role: 'Seller',
  skinTone: '#FDBCB4',
  hairColor: '#D4A843',
  shirtColor: '#C0392B',
  pantsColor: '#2C2C2C',
  position: [2, 0, -1.5],
  rotation: [0, Math.PI, 0],
};

export default function NegotiationScene() {
  const {
    selectedHomeId,
    openDialogue,
    setStage,
    setTransitioning,
    updateSavings,
    addAchievement,
  } = useGameStore();

  const home = homes.find((h) => h.id === selectedHomeId) ?? homes[0];
  const [offerPct, setOfferPct] = useState(100);
  const [hasInspection, setHasInspection] = useState(true);
  const [outcome, setOutcome] = useState<'accepted' | 'counter' | 'rejected' | 'competing' | null>(null);

  const offerPrice = Math.round((home.price * offerPct) / 100);

  const submitOffer = () => {
    const rand = Math.random();
    if (rand < 0.45) setOutcome('accepted');
    else if (rand < 0.72) setOutcome('counter');
    else if (rand < 0.88) setOutcome('rejected');
    else setOutcome('competing');
  };

  const handleAccept = () => {
    addAchievement('deal_maker');
    updateSavings(-2500); // earnest money
    setTransitioning(true);
    setTimeout(() => {
      setStage(5);
      setTransitioning(false);
    }, 1800);
  };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#B8A88A" />
      </mesh>
      {/* Walls */}
      <mesh position={[0, 2.5, -7]} receiveShadow>
        <boxGeometry args={[18, 5, 0.2]} />
        <meshStandardMaterial color="#E8DDD0" />
      </mesh>
      <mesh position={[-9, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#DDD0C0" />
      </mesh>
      <mesh position={[9, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#DDD0C0" />
      </mesh>

      {/* Negotiation table */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[4.5, 0.1, 2.2]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>
      {/* Table legs */}
      {([-1.9, 1.9] as number[]).map((x) =>
        ([-0.9, 0.9] as number[]).map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.24, z]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.97, 8]} />
            <meshStandardMaterial color="#5A3A1A" />
          </mesh>
        ))
      )}

      {/* Documents on table */}
      {[-1.2, 0, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} castShadow>
          <boxGeometry args={[0.5, 0.012, 0.38]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ))}

      {/* Chairs — player side */}
      {[-1.0, 1.0].map((x) => (
        <group key={x} position={[x, 0, 1.8]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.65, 0.1, 0.65]} />
            <meshStandardMaterial color="#4A3020" />
          </mesh>
          <mesh position={[0, 0.68, -0.28]} castShadow>
            <boxGeometry args={[0.65, 0.75, 0.09]} />
            <meshStandardMaterial color="#4A3020" />
          </mesh>
        </group>
      ))}

      {/* Chairs — seller side */}
      {[-1.0, 1.0].map((x) => (
        <group key={x} position={[x, 0, -1.8]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.65, 0.1, 0.65]} />
            <meshStandardMaterial color="#4A3020" />
          </mesh>
          <mesh position={[0, 0.68, 0.28]} castShadow>
            <boxGeometry args={[0.65, 0.75, 0.09]} />
            <meshStandardMaterial color="#4A3020" />
          </mesh>
        </group>
      ))}

      {/* House photo on wall */}
      <mesh position={[0, 2.2, -6.85]} castShadow>
        <boxGeometry args={[2.2, 1.4, 0.1]} />
        <meshStandardMaterial color={home.color} />
      </mesh>
      <Html position={[0, 2.2, -6.7]} center distanceFactor={14}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            textAlign: 'center',
          }}
        >
          {home.name}
        </div>
      </Html>

      {/* Plant in corner */}
      <group position={[-7, 0, -5]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.7, 8]} />
          <meshStandardMaterial color="#C47A3A" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.45, 8, 8]} />
          <meshStandardMaterial color="#2D7A2D" />
        </mesh>
      </group>

      {/* Seller NPC */}
      <NPCCharacter npc={SELLER} onClick={() => openDialogue('seller')} />

      {/* Offer panel */}
      <Html position={[0, 4.5, 4.5]} center distanceFactor={15}>
        <div
          style={{
            background: 'rgba(13,43,94,0.97)',
            borderRadius: 18,
            padding: '20px 22px',
            minWidth: 360,
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, color: '#D4A843' }}>
            Your Offer
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>
            {home.name} — Listed at ${home.price.toLocaleString()}
          </div>

          {!outcome ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Offer Amount</span>
                  <span style={{ color: '#D4A843', fontWeight: 800 }}>
                    ${offerPrice.toLocaleString()} ({offerPct}% of list)
                  </span>
                </div>
                <input
                  type="range"
                  min={88}
                  max={108}
                  value={offerPct}
                  onChange={(e) => setOfferPct(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#D4A843' }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.35)',
                    marginTop: 4,
                  }}
                >
                  <span>Low offer (risk rejection)</span>
                  <span>Above ask (competitive)</span>
                </div>
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 12,
                  marginBottom: 18,
                  cursor: 'pointer',
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: hasInspection
                    ? 'rgba(10,143,126,0.18)'
                    : 'rgba(255,255,255,0.05)',
                  border: hasInspection
                    ? '1px solid rgba(10,143,126,0.5)'
                    : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <input
                  type="checkbox"
                  checked={hasInspection}
                  onChange={(e) => setHasInspection(e.target.checked)}
                  style={{ accentColor: '#0A8F7E', width: 16, height: 16 }}
                />
                <span>Include Inspection Contingency</span>
                <span style={{ color: '#0A8F7E', fontSize: 10, marginLeft: 'auto' }}>
                  Recommended!
                </span>
              </label>

              <button
                onClick={submitOffer}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 12,
                  background: '#D4A843',
                  color: '#0D2B5E',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Submit Offer →
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              {outcome === 'accepted' && (
                <>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                  <div style={{ fontWeight: 800, color: '#4ade80', fontSize: 16, marginBottom: 8 }}>
                    Offer Accepted!
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>
                    Congratulations! Earnest money of $2,500 is due to secure the deal.
                  </div>
                  <button
                    onClick={handleAccept}
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: 12,
                      background: '#4ade80',
                      color: '#0D2B5E',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: 13,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Pay Earnest Money ($2,500) & Proceed →
                  </button>
                </>
              )}
              {outcome === 'counter' && (
                <>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🤝</div>
                  <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: 16, marginBottom: 8 }}>
                    Counter Offer!
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>
                    Seller counters at ${(offerPrice + 8000).toLocaleString()}. Do you accept?
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={handleAccept}
                      style={{
                        flex: 1,
                        padding: '11px',
                        borderRadius: 10,
                        background: '#4ade80',
                        color: '#0D2B5E',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 12,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Accept Counter
                    </button>
                    <button
                      onClick={() => setOutcome(null)}
                      style={{
                        flex: 1,
                        padding: '11px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 12,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Negotiate Again
                    </button>
                  </div>
                </>
              )}
              {outcome === 'rejected' && (
                <>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>😞</div>
                  <div style={{ fontWeight: 800, color: '#f87171', fontSize: 16, marginBottom: 8 }}>
                    Offer Rejected
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>
                    Your offer was too low. Try again with a higher amount.
                  </div>
                  <button
                    onClick={() => setOutcome(null)}
                    style={{
                      width: '100%',
                      padding: '13px',
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
                    Try Again →
                  </button>
                </>
              )}
              {outcome === 'competing' && (
                <>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>⚡</div>
                  <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: 16, marginBottom: 8 }}>
                    Competing Offer!
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>
                    Another buyer appeared! Raise your offer by at least $7,000 to compete.
                  </div>
                  <button
                    onClick={() => {
                      setOfferPct(Math.min(108, offerPct + 3));
                      setOutcome(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '13px',
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
                    Raise Offer & Resubmit →
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
