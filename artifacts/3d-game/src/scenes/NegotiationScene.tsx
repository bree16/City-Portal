import { useState } from 'react';
import { Html } from '@react-three/drei';
import { ScenePanelClose, ScenePanelReopen } from '@/components/ui/ScenePanelChrome';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';
import {
  TallPlant,
  WallArt,
  WallClock,
} from '@/components/decor/DecorKit';

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
  important: true,
};

export default function NegotiationScene() {
  const { selectedHomeId, openDialogue, setStage, setTransitioning, updateSavings, addAchievement } = useGameStore();
  const home = homes.find((h) => h.id === selectedHomeId) ?? homes[0];
  const [panelOpen, setPanelOpen] = useState(true);
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
    updateSavings(-2500);
    setTransitioning(true);
    setTimeout(() => { setStage(5); setTransitioning(false); }, 1800);
  };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#1a0a2a" roughness={0.6} metalness={0.03} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2.5, -7]} receiveShadow>
        <boxGeometry args={[18, 5, 0.2]} />
        <meshStandardMaterial color="#09070a" roughness={0.9} />
      </mesh>
      <mesh position={[-9, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#110e15" roughness={0.9} />
      </mesh>
      <mesh position={[9, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#110e15" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#09070a" roughness={1} />
      </mesh>

      {/* Pendant lights over table */}
      {[-1.5, 0, 1.5].map((x) => (
        <group key={x}>
          <mesh position={[x, 3.5, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.18, 12]} />
            <meshStandardMaterial color="#2b0a3d" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[x, 3.44, 0]}>
            <boxGeometry args={[0.02, 0.8, 0.02]} />
            <meshStandardMaterial color="#1a0521" metalness={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[x, 3.58, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.05, 12]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[x, 3.2, 0]} intensity={0.9} color="#00f0ff" distance={6} />
        </group>
      ))}

      {/* Negotiation table */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[4.5, 0.1, 2.2]} />
        <meshStandardMaterial color="#1a0521" roughness={0.4} metalness={0.05} />
      </mesh>
      {([-1.9, 1.9] as number[]).map((x) =>
        ([-0.9, 0.9] as number[]).map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.24, z]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.97, 8]} />
            <meshStandardMaterial color="#00f0ff" roughness={0.5} metalness={0.08} />
          </mesh>
        ))
      )}

      {/* Documents on table */}
      {[-1.2, 0, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} castShadow>
          <boxGeometry args={[0.5, 0.012, 0.38]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      ))}

      {/* Chairs */}
      {[-1.0, 1.0].map((x) => (
        <group key={`p-${x}`} position={[x, 0, 1.8]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.65, 0.1, 0.65]} />
            <meshStandardMaterial color="#2b0a3d" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.68, -0.28]} castShadow>
            <boxGeometry args={[0.65, 0.75, 0.09]} />
            <meshStandardMaterial color="#ff007f" roughness={0.85} />
          </mesh>
        </group>
      ))}
      {[-1.0, 1.0].map((x) => (
        <group key={`s-${x}`} position={[x, 0, -1.8]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.65, 0.1, 0.65]} />
            <meshStandardMaterial color="#2b0a3d" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.68, 0.28]} castShadow>
            <boxGeometry args={[0.65, 0.75, 0.09]} />
            <meshStandardMaterial color="#ff007f" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* House photo on wall */}
      <mesh position={[0, 2.2, -6.85]} castShadow>
        <boxGeometry args={[2.2, 1.4, 0.1]} />
        <meshStandardMaterial color={home.color} roughness={0.8} />
      </mesh>
      <Html position={[0, 2.2, -6.7]} center distanceFactor={14}>
        <div style={{ fontFamily: 'var(--display-font)', fontSize: 10, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)', textAlign: 'center' }}>
          {home.name}
        </div>
      </Html>

      {/* Plant in corner */}
      <group position={[-7, 0, -5]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.7, 8]} />
          <meshStandardMaterial color="#ffea00" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.45, 10, 10]} />
          <meshStandardMaterial color="#00f0ff" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Decor: professional conference feel ───────────────── */}
      {/* Tall plant in the opposite corner to balance the existing one */}
      <TallPlant position={[7, 0, -5]} scale={1.1} />
      {/* Framed art on side walls, facing inward */}
      <WallArt position={[-8.85, 3.0, -2]} rotation={[0, Math.PI / 2, 0]} color="#ff007f" w={1.3} h={0.9} />
      <WallArt position={[8.85, 3.0, -2]} rotation={[0, -Math.PI / 2, 0]} color="#00f0ff" w={1.3} h={0.9} />
      {/* Subtle wall clock on back wall, beside the house photo */}
      <WallClock position={[4, 3.0, -6.88]} rotation={[0, 0, 0]} />

      <NPCCharacter npc={SELLER} onClick={() => openDialogue('seller')} />

      {/* Offer panel */}
      <Html position={[0, 4.5, 4.5]} center distanceFactor={15}>
        {!panelOpen ? (
          <ScenePanelReopen onOpen={() => setPanelOpen(true)} label="🤝 Your Offer" />
        ) : (
        <div style={{
          position: 'relative',
          background: 'rgba(9,7,10,0.97)', borderRadius: 0, padding: '20px 22px', minWidth: 360,
          color: '#fff', fontFamily: 'var(--display-font)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <ScenePanelClose onClose={() => setPanelOpen(false)} title="Hide Offer" />
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, color: '#ffea00' }}>Your Offer</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>
            {home.name} — Listed at ${home.price.toLocaleString()}
          </div>

          {!outcome ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Offer Amount</span>
                  <span style={{ color: '#ffea00', fontWeight: 800 }}>${offerPrice.toLocaleString()} ({offerPct}%)</span>
                </div>
                <input type="range" min={88} max={108} value={offerPct}
                  onChange={(e) => setOfferPct(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ffea00' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                  <span>Low (risky)</span><span>Above ask (competitive)</span>
                </div>
              </div>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, marginBottom: 18,
                cursor: 'pointer', padding: '10px 12px', borderRadius: 0,
                background: hasInspection ? 'rgba(0,240,255,0.18)' : 'rgba(255,255,255,0.05)',
                border: hasInspection ? '1px solid rgba(0,240,255,0.5)' : '1px solid rgba(255,255,255,0.1)',
              }}>
                <input type="checkbox" checked={hasInspection} onChange={(e) => setHasInspection(e.target.checked)}
                  style={{ accentColor: '#00f0ff', width: 16, height: 16 }} />
                <span>Include Inspection Contingency</span>
                <span style={{ color: '#00f0ff', fontSize: 10, marginLeft: 'auto' }}>Recommended!</span>
              </label>
              <button onClick={submitOffer} style={{
                width: '100%', padding: '13px', borderRadius: 0, background: '#ffea00',
                color: '#09070a', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 14, fontFamily: 'var(--display-font)',
              }}>Submit Offer →</button>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              {outcome === 'accepted' && (<>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                <div style={{ fontWeight: 800, color: '#4ade80', fontSize: 16, marginBottom: 8 }}>Offer Accepted!</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>Earnest money of $2,500 is due to secure the deal.</div>
                <button onClick={handleAccept} style={{ width: '100%', padding: '13px', borderRadius: 0, background: '#4ade80', color: '#09070a', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13, fontFamily: 'var(--display-font)' }}>
                  Pay Earnest Money ($2,500) & Proceed →
                </button>
              </>)}
              {outcome === 'counter' && (<>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🤝</div>
                <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: 16, marginBottom: 8 }}>Counter Offer!</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>Seller counters at ${(offerPrice + 8000).toLocaleString()}. Accept?</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleAccept} style={{ flex: 1, padding: '11px', borderRadius: 0, background: '#4ade80', color: '#09070a', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'var(--display-font)' }}>Accept Counter</button>
                  <button onClick={() => setOutcome(null)} style={{ flex: 1, padding: '11px', borderRadius: 0, background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'var(--display-font)' }}>Negotiate Again</button>
                </div>
              </>)}
              {outcome === 'rejected' && (<>
                <div style={{ fontSize: 40, marginBottom: 10 }}>😞</div>
                <div style={{ fontWeight: 800, color: '#f87171', fontSize: 16, marginBottom: 8 }}>Offer Rejected</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>Your offer was too low. Try a higher amount.</div>
                <button onClick={() => setOutcome(null)} style={{ width: '100%', padding: '13px', borderRadius: 0, background: '#ffea00', color: '#09070a', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13, fontFamily: 'var(--display-font)' }}>Try Again →</button>
              </>)}
              {outcome === 'competing' && (<>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚡</div>
                <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: 16, marginBottom: 8 }}>Competing Offer!</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>Another buyer appeared! Raise your offer to compete.</div>
                <button onClick={() => { setOfferPct(Math.min(108, offerPct + 3)); setOutcome(null); }} style={{ width: '100%', padding: '13px', borderRadius: 0, background: '#ffea00', color: '#09070a', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13, fontFamily: 'var(--display-font)' }}>
                  Raise Offer & Resubmit →
                </button>
              </>)}
            </div>
          )}
        </div>
        )}
      </Html>
    </group>
  );
}
