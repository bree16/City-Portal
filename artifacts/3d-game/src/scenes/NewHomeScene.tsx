import { useState } from 'react';
import { Html } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

const FURNITURE_SLOTS = [
  {
    id: 'sofa_slot', label: 'Sofa',
    position: [-2.5, 0, -2.5] as [number, number, number],
    size: [2.2, 0.65, 1.0] as [number, number, number],
    options: [
      { id: 'f1', name: 'Modern Sectional', price: 1200, color: '#6B5B95' },
      { id: 'f1b', name: 'Classic Futon', price: 450, color: '#8B7355' },
      { id: 'f1c', name: 'Coastal Loveseat', price: 680, color: '#5B8B8B' },
    ],
  },
  {
    id: 'bed_slot', label: 'Bed',
    position: [4.5, 0, -3.5] as [number, number, number],
    size: [2.0, 0.6, 2.4] as [number, number, number],
    options: [
      { id: 'f3', name: 'Queen Bed', price: 800, color: '#4A6FA5' },
      { id: 'f3b', name: 'King Bed', price: 1200, color: '#2C3E6B' },
      { id: 'f3c', name: 'Platform Bed', price: 650, color: '#8B6914' },
    ],
  },
  {
    id: 'table_slot', label: 'Dining Table',
    position: [0, 0, 2.5] as [number, number, number],
    size: [1.8, 0.5, 1.0] as [number, number, number],
    options: [
      { id: 'f4', name: 'Farmhouse Table', price: 650, color: '#8B7355' },
      { id: 'f4b', name: 'Round Table', price: 480, color: '#A08060' },
      { id: 'f4c', name: 'Glass Table', price: 720, color: '#87CEEB' },
    ],
  },
  {
    id: 'desk_slot', label: 'Home Office',
    position: [-5.5, 0, 2.5] as [number, number, number],
    size: [1.5, 0.5, 0.75] as [number, number, number],
    options: [
      { id: 'f5', name: 'Standing Desk', price: 380, color: '#7A5C44' },
      { id: 'f5b', name: 'Corner Desk', price: 520, color: '#6B4226' },
      { id: 'f5c', name: 'Secretary Desk', price: 680, color: '#8B6914' },
    ],
  },
  {
    id: 'outdoor_slot', label: 'Patio',
    position: [6.5, 0, 3.5] as [number, number, number],
    size: [1.5, 0.35, 0.85] as [number, number, number],
    options: [
      { id: 'f6', name: 'Outdoor Sofa', price: 520, color: '#5D8A5E' },
      { id: 'f16', name: 'Fire Pit', price: 350, color: '#B22222' },
      { id: 'f17', name: 'Hammock', price: 150, color: '#8B7355' },
    ],
  },
];

export default function NewHomeScene() {
  const { cash, furnitureOwned, buyFurniture, addAchievement, setShowResultsCard } = useGameStore();
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [tip, setTip] = useState<string | null>(null);

  const FINANCIAL_TIPS = [
    "Keep 3-6 months of expenses in an emergency fund for unexpected repairs!",
    "Homeowners insurance is required — budget $100-150/month to protect your investment.",
    "Set aside 1-2% of your home's value annually for maintenance.",
    "Your mortgage interest is tax-deductible — talk to a CPA for first-year savings!",
  ];

  const handleBuy = (slotId: string, itemId: string, price: number) => {
    if (cash >= price && !furnitureOwned.includes(itemId)) {
      buyFurniture(itemId, price);
      const newCount = purchaseCount + 1;
      setPurchaseCount(newCount);
      setActiveSlot(null);
      if (newCount % 2 === 0) {
        setTip(FINANCIAL_TIPS[Math.floor(newCount / 2) % FINANCIAL_TIPS.length]);
        setTimeout(() => setTip(null), 6000);
      }
      if (furnitureOwned.length + 1 >= 5) addAchievement('dream_home');
    }
  };

  const getPlacedOption = (slot: (typeof FURNITURE_SLOTS)[0]) =>
    slot.options.find((o) => furnitureOwned.includes(o.id));

  return (
    <group>
      {/* Hardwood floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#B8905A" roughness={0.4} metalness={0.06} />
      </mesh>
      <gridHelper args={[20, 40, '#A07840', '#A07840']} position={[0, 0.005, 0]} />

      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.01, -1.5]} receiveShadow>
        <planeGeometry args={[5.5, 4.5]} />
        <meshStandardMaterial color="#6B4B7B" roughness={0.95} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2.5, -8]} receiveShadow>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#F0EAE0" roughness={0.9} />
      </mesh>
      <mesh position={[-10, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#EAE4D8" roughness={0.9} />
      </mesh>
      <mesh position={[10, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#EAE4D8" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#F8F4EE" roughness={1} />
      </mesh>

      {/* Ceiling lights */}
      {[-5, 0, 5].map((x) => (
        <group key={x}>
          <mesh position={[x, 4.88, 0]}>
            <boxGeometry args={[1.4, 0.05, 0.5]} />
            <meshStandardMaterial color="#FFFFF0" emissive="#FFF8D0" emissiveIntensity={1.4} />
          </mesh>
          <pointLight position={[x, 4.4, 0]} intensity={0.6} color="#FFF8D0" distance={10} />
        </group>
      ))}

      {/* Windows — warm sunlight */}
      <mesh position={[-2, 2.1, -7.85]} castShadow>
        <boxGeometry args={[2.8, 1.8, 0.12]} />
        <meshStandardMaterial color="#87CEEB" emissive="#FFE87A" emissiveIntensity={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[3.5, 2.1, -7.85]} castShadow>
        <boxGeometry args={[2.8, 1.8, 0.12]} />
        <meshStandardMaterial color="#87CEEB" emissive="#FFE87A" emissiveIntensity={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[-9.85, 1.8, 1]} castShadow>
        <boxGeometry args={[0.12, 1.5, 2.0]} />
        <meshStandardMaterial color="#87CEEB" emissive="#FFE87A" emissiveIntensity={0.6} roughness={0.05} />
      </mesh>
      <pointLight position={[0, 3.0, -7]} intensity={1.2} color="#FFD96A" distance={12} />

      {/* Door */}
      <group position={[8.5, 0, 2.5]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.12, 2.3, 1.1]} />
          <meshStandardMaterial color="#8B6914" roughness={0.6} />
        </mesh>
        <mesh position={[0.1, 1.0, 0.42]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#D4A843" metalness={0.9} roughness={0.08} />
        </mesh>
      </group>

      {/* Baseboard trim */}
      {([-9.9, 9.9] as number[]).map((x) => (
        <mesh key={x} position={[x, 0.08, 0]} castShadow>
          <boxGeometry args={[0.1, 0.16, 15.8]} />
          <meshStandardMaterial color="#E8E0D0" roughness={0.8} />
        </mesh>
      ))}

      {/* Crown molding */}
      <mesh position={[0, 4.92, -7.9]}>
        <boxGeometry args={[20, 0.16, 0.12]} />
        <meshStandardMaterial color="#EDE8E0" roughness={0.8} />
      </mesh>

      {/* Furniture slots */}
      {FURNITURE_SLOTS.map((slot) => {
        const placed = getPlacedOption(slot);
        return (
          <group key={slot.id} position={slot.position}>
            {placed ? (
              <mesh position={[0, slot.size[1] / 2, 0]} castShadow>
                <boxGeometry args={slot.size} />
                <meshStandardMaterial color={placed.color} roughness={0.9} />
              </mesh>
            ) : (
              <mesh position={[0, 0.06, 0]} onClick={(e) => { e.stopPropagation(); setActiveSlot(activeSlot === slot.id ? null : slot.id); }}>
                <boxGeometry args={[slot.size[0] + 0.2, 0.12, slot.size[2] + 0.2]} />
                <meshStandardMaterial color="#D4A843" transparent opacity={0.45} emissive="#D4A843" emissiveIntensity={0.8} roughness={0.5} />
              </mesh>
            )}
            <Html position={[0, placed ? slot.size[1] + 0.55 : 0.55, 0]} center distanceFactor={10}>
              <div style={{
                background: placed ? '#0A8F7E' : '#D4A843',
                color: placed ? '#fff' : '#0D2B5E',
                fontSize: 10, padding: '3px 10px', borderRadius: 6,
                whiteSpace: 'nowrap', fontWeight: 700,
                cursor: placed ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
                {placed ? `✓ ${placed.name}` : `+ Add ${slot.label}`}
              </div>
            </Html>
            {activeSlot === slot.id && !placed && (
              <Html position={[0, 1.8, 0]} center distanceFactor={10}>
                <div style={{
                  background: 'rgba(13,43,94,0.97)', borderRadius: 14, padding: '14px 18px',
                  minWidth: 230, color: '#fff', fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.12)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, color: '#D4A843' }}>Choose {slot.label}</div>
                  {slot.options.map((opt) => (
                    <div key={opt.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginBottom: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: opt.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12 }}>{opt.name}</span>
                      </div>
                      <button onClick={() => handleBuy(slot.id, opt.id, opt.price)} disabled={cash < opt.price} style={{
                        padding: '5px 12px', borderRadius: 8,
                        background: cash >= opt.price ? '#D4A843' : 'rgba(255,255,255,0.08)',
                        color: cash >= opt.price ? '#0D2B5E' : 'rgba(255,255,255,0.35)',
                        border: 'none', cursor: cash >= opt.price ? 'pointer' : 'default',
                        fontWeight: 700, fontSize: 11, fontFamily: 'Inter, sans-serif', flexShrink: 0,
                      }}>
                        ${opt.price.toLocaleString()}
                      </button>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Your budget:</span>
                    <span style={{ color: cash > 3000 ? '#4ade80' : '#f87171', fontWeight: 700 }}>${cash.toLocaleString()}</span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Welcome banner */}
      <Html position={[0, 5.2, -4]} center distanceFactor={18}>
        <div style={{
          background: 'rgba(212,168,67,0.95)', borderRadius: 16, padding: '12px 28px',
          color: '#0D2B5E', fontFamily: 'Inter, sans-serif', textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>🏡 Welcome Home!</div>
          <div style={{ fontSize: 12, marginTop: 4, fontWeight: 600 }}>
            Budget: <strong>${cash.toLocaleString()}</strong> | Click golden spots to furnish
          </div>
        </div>
      </Html>

      {/* View Your Journey button — always visible in new home stage */}
      <Html position={[0, 3.8, 7]} center distanceFactor={14}>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => setShowResultsCard(true)}
          style={{
            padding: '12px 28px',
            borderRadius: 50,
            background: 'linear-gradient(135deg, #0A8F7E 0%, #0D2B5E 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 14,
            border: '2px solid rgba(212,168,67,0.7)',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
          }}
        >
          🏆 View Your Journey
        </motion.button>
      </Html>

      {/* Financial tip popup */}
      {tip && (
        <Html position={[0, 4.2, 5]} center distanceFactor={16}>
          <div style={{
            background: 'rgba(10,143,126,0.95)', borderRadius: 14, padding: '12px 18px',
            maxWidth: 300, color: '#fff', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)', textAlign: 'center',
            fontSize: 12, lineHeight: 1.5,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4, color: '#D4A843' }}>💡 Financial Tip</div>
            {tip}
          </div>
        </Html>
      )}
    </group>
  );
}
