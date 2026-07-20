import { useEffect, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { ScenePanelClose, ScenePanelReopen } from '@/components/ui/ScenePanelChrome';
import { useGameStore } from '@/store/gameStore';
import { PottedPlant, TallPlant, WallArt, Curtains, Rug, Bookshelf, FloorLamp, SideTable, BookRow } from '@/components/decor/DecorKit';
import { homes } from '@/data/homes';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';

// ── Improvement projects ──────────────────────────────────────────

const IMPROVEMENTS: { id: string; label: string; icon: GameIconName; cost: number; valuePct: number; desc: string; pos: [number, number, number]; color: string; rgba: string }[] = [
  {
    id: 'kitchen_remodel', label: 'Kitchen Remodel', icon: 'kitchen',
    cost: 8000, valuePct: 0.05,
    desc: 'Modern counters, appliances, and updated cabinets.',
    pos: [-5, 0.1, -1],
    color: '#D4AF37',
    rgba: '212,175,55',
  },
  {
    id: 'new_flooring', label: 'New Flooring', icon: 'wood',
    cost: 3500, valuePct: 0.02,
    desc: 'Hardwood throughout the main living area.',
    pos: [0, 0.1, -1],
    color: '#1E3A8A',
    rgba: '30,58,138',
  },
  {
    id: 'landscaping', label: 'Landscaping', icon: 'leaf',
    cost: 2200, valuePct: 0.03,
    desc: 'Professional landscaping with new plants and mulch.',
    pos: [5.5, 0.1, 2],
    color: '#0F766E',
    rgba: '15,118,110',
  },
  {
    id: 'solar_panels', label: 'Solar Panels', icon: 'sun',
    cost: 12000, valuePct: 0.04,
    desc: 'Cuts energy bills and boosts eco-friendly home value.',
    pos: [-5, 0.1, 2],
    color: '#047857',
    rgba: '4,120,87',
  },
];

// ── Equity milestone messages ─────────────────────────────────────

const MILESTONES: Record<number, { icon: GameIconName; title: string; tip: string }> = {
  10: {
    icon: 'home',
    title: '10% Equity Reached!',
    tip: "With 10% equity, you may qualify to remove PMI — saving $100–200/month on your mortgage.",
  },
  20: {
    icon: 'budget',
    title: '20% Equity Built!',
    tip: "At 20% equity you can refinance at better rates or open a HELOC — a credit line backed by your home.",
  },
  30: {
    icon: 'chart',
    title: '30% Equity Milestone!',
    tip: "30% equity is serious wealth. You can leverage it for investments, education, or a down payment on your dream home.",
  },
};

// ── Scene ─────────────────────────────────────────────────────────

export default function HomeLifeScene() {
  const {
    cash, selectedHomeId, homeValue, mortgageBalance,
    improvementsOwned, pendingMaintenance,
    initHomeLife, applyMaintenance,
    buyImprovement, advanceHomeLifeMonth,
    listingOpen, setListingOpen, dashboardOpen, setDashboardOpen,
  } = useGameStore();

  const home = homes.find((h) => h.id === selectedHomeId) ?? homes[0];

  // Local state
  const [activeImp, setActiveImp] = useState<string | null>(null);
  const [milestoneToast, setMilestoneToast] = useState<{ pct: number; icon: GameIconName; title: string; tip: string } | null>(null);
  const shownMilestones = useRef<Set<number>>(new Set());

  // Initialize home life stats on mount
  useEffect(() => {
    initHomeLife(home.price);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Equity computation
  const equityValue = Math.max(0, homeValue - mortgageBalance);
  const equityPct = homeValue > 0 ? (equityValue / homeValue) * 100 : 0;

  // Check equity milestones
  useEffect(() => {
    for (const pct of [10, 20, 30] as const) {
      if (equityPct >= pct && !shownMilestones.current.has(pct)) {
        shownMilestones.current.add(pct);
        setMilestoneToast({ pct, ...MILESTONES[pct] });
        break;
      }
    }
  }, [equityPct]);

  // (All dashboard/listing logic is now in HomeLifeOverlays DraggablePanel — see GamePage.tsx)

  return (
    <group>
      {/* ── FLOOR ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#9A7B5C" roughness={0.42} metalness={0.05} />
      </mesh>
      <gridHelper args={[20, 40, '#1E3A8A', '#1E3A8A']} position={[0, 0.005, 0]} />
      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#5F9EA0" roughness={0.95} />
      </mesh>

      {/* ── WALLS ── */}
      <mesh position={[0, 2.5, -8]} receiveShadow>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#E9E4DA" roughness={0.9} />
      </mesh>
      <mesh position={[-10, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#DDD8CE" roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#E9E4DA" roughness={1} />
      </mesh>

      {/* ── LIGHTS ── */}
      {([-5, 0, 5] as number[]).map((x) => (
        <group key={x}>
          <mesh position={[x, 4.88, 0]}>
            <boxGeometry args={[1.4, 0.05, 0.5]} />
            <meshStandardMaterial color="#ffffff" emissive="#FFF0D4" emissiveIntensity={0.6} />
          </mesh>
          <pointLight position={[x, 4.4, 0]} intensity={0.6} color="#D2B48C" distance={10} decay={2} />
        </group>
      ))}

      {/* ── WINDOWS ── */}
      <mesh position={[-2, 2.1, -7.85]} castShadow>
        <boxGeometry args={[2.8, 1.8, 0.12]} />
        <meshStandardMaterial color="#E9E4DA" emissive="#FFE7C2" emissiveIntensity={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[3.5, 2.1, -7.85]} castShadow>
        <boxGeometry args={[2.8, 1.8, 0.12]} />
        <meshStandardMaterial color="#E9E4DA" emissive="#FFE7C2" emissiveIntensity={0.9} roughness={0.05} />
      </mesh>
      <pointLight position={[0, 3.0, -7]} intensity={1.4} color="#5F9EA0" distance={14} decay={2} />

      {/* ── FURNITURE (static — already furnished) ── */}
      {/* Sofa */}
      <mesh position={[-2.5, 0.45, -2.5]} castShadow>
        <boxGeometry args={[2.2, 0.9, 1.0]} />
        <meshStandardMaterial color="#4682B4" roughness={0.8} />
      </mesh>
      {/* Coffee table */}
      <mesh position={[-1.5, 0.3, -0.8]} castShadow>
        <boxGeometry args={[1.6, 0.08, 0.9]} />
        <meshStandardMaterial color="#A0522D" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* TV stand + TV */}
      <mesh position={[2.5, 0.3, -2.5]} castShadow>
        <boxGeometry args={[2.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#9A7B5C" roughness={0.5} />
      </mesh>
      <mesh position={[2.5, 1.2, -2.6]} castShadow>
        <boxGeometry args={[2.0, 1.2, 0.09]} />
        <meshStandardMaterial color="#E9E4DA" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Dining table */}
      <mesh position={[0, 0.5, 2.5]} castShadow>
        <boxGeometry args={[1.8, 0.1, 1.0]} />
        <meshStandardMaterial color="#DDD8CE" roughness={0.5} />
      </mesh>
      {/* Desk area */}
      <mesh position={[-5.5, 0.5, 2.5]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.75]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.6} />
      </mesh>
      {/* Plant */}
      <group position={[7.5, 0, -5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.22, 0.8, 8]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.0, 0]} castShadow>
          <sphereGeometry args={[0.55, 10, 10]} />
          <meshStandardMaterial color="#5F9EA0" roughness={0.9} />
        </mesh>
      </group>

      {/* ── DECOR: fully lived-in home ── */}
      {/* Living-room rug under sofa/coffee table */}
      <Rug position={[-2, 0.008, -1.6]} w={4.2} d={3.2} color="#5F9EA0" border="#2F4F4F" />
      {/* Bookshelf in far corner (behind sofa area, against left wall) */}
      <Bookshelf position={[-8.6, 0, -4]} rotation={[0, Math.PI / 2, 0]} color="#A0522D" />
      {/* Floor lamp beside the sofa */}
      <FloorLamp position={[-4.2, 0, -3.2]} shadeColor="#F5F5DC" lightColor="#FFF0D4" />
      {/* Side table with mug near sofa */}
      <SideTable position={[-4.2, 0, -1.6]} color="#9A7B5C" />
      {/* Tall plant by the dining area corner */}
      <TallPlant position={[8.5, 0, 5]} scale={1.05} />
      {/* Potted plant near the desk */}
      <PottedPlant position={[-8.5, 0, 4] } scale={1.05} />
      {/* Curtains framing the back windows (windows at z=-7.85) */}
      <Curtains position={[-2, 1.2, -7.7]} width={3.2} height={2.0} color="#D2B48C" />
      <Curtains position={[3.5, 1.2, -7.7]} width={3.2} height={2.0} color="#D2B48C" />
      {/* Wall art on left wall (faces +x), above bookshelf area */}
      <WallArt position={[-9.85, 3.0, 1.5]} rotation={[0, Math.PI / 2, 0]} color="#5F9EA0" w={1.2} h={0.9} />
      {/* Books + clutter on coffee table */}
      <BookRow position={[-1.9, 0.34, -0.8]} count={4} rotation={[0, 0.3, 0]} />

      {/* ── KITCHEN (was bare): counter, fridge, stove ── */}
      <group position={[8.4, 0, -1]}>
        {/* Counter run along right wall */}
        <mesh position={[0.6, 0.45, 0]} castShadow>
          <boxGeometry args={[1.0, 0.9, 4.2]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.7} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0.6, 0.92, 0]} castShadow>
          <boxGeometry args={[1.1, 0.06, 4.3]} />
          <meshStandardMaterial color="#9A7B5C" roughness={0.3} metalness={0.15} />
        </mesh>
        {/* Upper cabinets */}
        <mesh position={[0.75, 2.1, 0]} castShadow>
          <boxGeometry args={[0.7, 0.85, 4.0]} />
          <meshStandardMaterial color="#A0522D" roughness={0.7} />
        </mesh>
        {/* Stove top with burners */}
        <mesh position={[0.55, 0.96, 1.4]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.8]} />
          <meshStandardMaterial color="#111" roughness={0.35} metalness={0.4} />
        </mesh>
        {([[-0.18, 1.22], [0.18, 1.22], [-0.18, 1.58], [0.18, 1.58]] as [number, number][]).map(([bx, bz], i) => (
          <mesh key={i} position={[0.55 + bx, 0.99, bz]}>
            <cylinderGeometry args={[0.11, 0.11, 0.015, 12]} />
            <meshStandardMaterial color="#E9E4DA" roughness={0.5} />
          </mesh>
        ))}
        {/* Fridge at end of counter */}
        <mesh position={[0.55, 1.05, -2.4]} castShadow>
          <boxGeometry args={[0.9, 2.1, 0.9]} />
          <meshStandardMaterial color="#9A7B5C" roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh position={[0.1, 1.55, -2.4]}>
          <boxGeometry args={[0.03, 0.5, 0.05]} />
          <meshStandardMaterial color="#E9E4DA" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* ── WALL-MOUNTED SMART DISPLAY (decorative + reopen button) ── */}
      <mesh position={[0, 2.8, -7.85]} castShadow>
        <boxGeometry args={[4.8, 2.2, 0.08]} />
        <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 2.8, -7.78]}>
        <boxGeometry args={[4.5, 1.9, 0.04]} />
        <meshStandardMaterial color="#1E3A5F" emissive="#1E3A5F" emissiveIntensity={0.3} roughness={0.2} />
      </mesh>
      <Html position={[0, 2.8, -7.6]} center distanceFactor={14}>
        {!dashboardOpen ? (
          <ScenePanelReopen onOpen={() => setDashboardOpen(true)} label="Home Dashboard" icon="home" />
        ) : (
          <div style={{ fontSize: 10, color: 'rgba(212,175,55,0.7)', fontFamily: 'Inter,sans-serif', letterSpacing: 2, padding: '6px 10px' }}>
            DASHBOARD ACTIVE ↗
          </div>
        )}
      </Html>

      {/* ── IMPROVEMENT SPOTS ── */}
      {IMPROVEMENTS.map((imp) => {
        const owned = improvementsOwned.includes(imp.id);
        const isActive = activeImp === imp.id;
        return (
          <group key={imp.id} position={imp.pos}>
            {/* Glow pad */}
            <mesh
              position={[0, 0.06, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerDown={(e) => { e.stopPropagation(); if (!owned) setActiveImp(isActive ? null : imp.id); }}
              onClick={(e) => e.stopPropagation()}
            >
              <planeGeometry args={[2.2, 1.6]} />
              <meshStandardMaterial
                color={owned ? '#2D7A2D' : imp.color}
                emissive={owned ? '#2D7A2D' : imp.color}
                emissiveIntensity={owned ? 0.2 : 0.5}
                transparent opacity={0.45}
              />
            </mesh>
            <Html position={[0, 0.7, 0]} center distanceFactor={12}>
              <div onClick={() => { if (!owned) setActiveImp(isActive ? null : imp.id); }} style={{
                background: owned ? 'rgba(15,118,110,0.9)' : `rgba(${imp.rgba},0.88)`,
                color: '#fff', padding: '4px 10px', borderRadius: 'var(--glass-radius)',
                fontSize: 10, fontWeight: 700, fontFamily: 'Inter,sans-serif',
                whiteSpace: 'nowrap', cursor: owned ? 'default' : 'pointer',
                border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 6
              }}>
                <GameIcon name={owned ? 'check' : imp.icon} size={12} />
                {owned ? `${imp.label} Installed` : imp.label}
              </div>
            </Html>
            {isActive && !owned && (
              <Html position={[0, 2.2, 0]} center distanceFactor={11}>
                <div style={{
                  background: 'rgba(9,7,10,0.97)', border: '1px solid rgba(212,175,55,0.4)',
                  borderRadius: 'var(--glass-radius)', padding: '14px 18px', minWidth: 220,
                  fontFamily: 'var(--display-font)', color: '#fff',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#D4AF37', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GameIcon name={imp.icon} size={14} /> {imp.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 8, lineHeight: 1.4 }}>
                    {imp.desc}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 10 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Cost</span>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>${imp.cost.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 12 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Value Boost</span>
                    <span style={{ color: '#4ade80', fontWeight: 700 }}>+{(imp.valuePct * 100).toFixed(0)}% (~${Math.round(homeValue * imp.valuePct).toLocaleString()})</span>
                  </div>
                  <button
                    onClick={() => { buyImprovement(imp.id, imp.cost, imp.valuePct); setActiveImp(null); }}
                    disabled={cash < imp.cost}
                    style={{
                      width: '100%', padding: '9px', borderRadius: 'var(--glass-radius)',
                      background: cash >= imp.cost ? '#D4AF37' : 'rgba(255,255,255,0.08)',
                      color: cash >= imp.cost ? '#E9E4DA' : 'rgba(255,255,255,0.35)',
                      border: 'none', cursor: cash >= imp.cost ? 'pointer' : 'default',
                      fontWeight: 800, fontSize: 12, fontFamily: 'Inter,sans-serif',
                    }}
                  >
                    {cash >= imp.cost ? `Invest $${imp.cost.toLocaleString()} →` : `Need $${(imp.cost - cash).toLocaleString()} more`}
                  </button>
                  <div style={{ marginTop: 6, fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                    Cash: ${cash.toLocaleString()}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* ── MAINTENANCE MODAL ── */}
      {pendingMaintenance && (
        <Html position={[0, 3.5, 5.5]} center distanceFactor={14}>
          <div style={{
            background: 'rgba(9,7,10,0.98)', border: '2px solid rgba(248,113,113,0.5)',
            borderRadius: 'var(--glass-radius)', padding: '22px 26px', minWidth: 340,
            fontFamily: 'var(--display-font)', color: '#fff',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)', textAlign: 'center',
          }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center', color: '#f87171' }}><GameIcon name={pendingMaintenance.icon} size={42} /></div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f87171', marginBottom: 6 }}>
              {pendingMaintenance.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14, lineHeight: 1.5 }}>
              {pendingMaintenance.description}
            </div>
            <div style={{ background: 'rgba(248,113,113,0.1)', borderRadius: 'var(--glass-radius)', padding: '8px 12px', marginBottom: 16, fontSize: 11, color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 6, textAlign: 'left' }}>
              <div style={{ flexShrink: 0, color: '#D4AF37' }}><GameIcon name="lightbulb" size={14} /></div> 
              <div>{pendingMaintenance.tip}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => applyMaintenance(true)}
                disabled={cash < pendingMaintenance.cost}
                style={{
                  flex: 1, padding: '12px', borderRadius: 'var(--glass-radius)',
                  background: cash >= pendingMaintenance.cost ? '#4ade80' : 'rgba(255,255,255,0.08)',
                  color: cash >= pendingMaintenance.cost ? '#E9E4DA' : 'rgba(255,255,255,0.35)',
                  border: 'none', cursor: cash >= pendingMaintenance.cost ? 'pointer' : 'default',
                  fontWeight: 800, fontSize: 12, fontFamily: 'Inter,sans-serif',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><GameIcon name="wrench" size={12} /> Fix Now</div>
                <span style={{ fontSize: 10, fontWeight: 600 }}>${pendingMaintenance.cost.toLocaleString()}</span>
              </button>
              <button
                onClick={() => applyMaintenance(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 'var(--glass-radius)',
                  background: 'rgba(248,113,113,0.15)', color: '#f87171',
                  border: '1px solid rgba(248,113,113,0.35)',
                  cursor: 'pointer', fontWeight: 800, fontSize: 12, fontFamily: 'Inter,sans-serif',
                }}
              >
                ⏳ Defer<br />
                <span style={{ fontSize: 10, fontWeight: 600 }}>-{(pendingMaintenance.valueImpact * 100).toFixed(1)}% home value</span>
              </button>
            </div>
          </div>
        </Html>
      )}

      {/* Listing modal is now a DraggablePanel rendered from GamePage (HomeLifeOverlays) */}

      {/* ── EQUITY MILESTONE TOAST ── */}
      <Html position={[0, 0, 0]} style={{ position: 'fixed', bottom: 80, right: 16, pointerEvents: 'none' }}>
        <AnimatePresence>
          {milestoneToast && (
            <motion.div
              key={milestoneToast.pct}
              initial={{ opacity: 0, y: 40, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
              onAnimationComplete={() => setTimeout(() => setMilestoneToast(null), 4500)}
              style={{
                background: '#E9E4DA', border: '2px solid var(--gold)',
                borderRadius: 'var(--glass-radius)', padding: '14px 18px', minWidth: 260,
                fontFamily: 'Inter,sans-serif', pointerEvents: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center', color: '#D4AF37' }}><GameIcon name={milestoneToast.icon} size={28} /></div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#D4AF37', marginBottom: 4, textAlign: 'center' }}>
                {milestoneToast.title}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 1.45, textAlign: 'center' }}>
                {milestoneToast.tip}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Html>
    </group>
  );
}
