import { useEffect, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';
import { selectMaintenanceEvent, shouldMaintenanceFire } from '@/data/maintenanceEvents';

// ── Improvement projects ──────────────────────────────────────────

const IMPROVEMENTS = [
  {
    id: 'kitchen_remodel', label: 'Kitchen Remodel', icon: '🍳',
    cost: 8000, valuePct: 0.05,
    desc: 'Modern counters, appliances, and updated cabinets.',
    pos: [-5, 0.1, -1] as [number, number, number],
    color: '#D4A843',
  },
  {
    id: 'new_flooring', label: 'New Flooring', icon: '🪵',
    cost: 3500, valuePct: 0.02,
    desc: 'Hardwood throughout the main living area.',
    pos: [0, 0.1, -1] as [number, number, number],
    color: '#8B6914',
  },
  {
    id: 'landscaping', label: 'Landscaping', icon: '🌿',
    cost: 2200, valuePct: 0.03,
    desc: 'Professional landscaping with new plants and mulch.',
    pos: [5.5, 0.1, 2] as [number, number, number],
    color: '#27AE60',
  },
  {
    id: 'solar_panels', label: 'Solar Panels', icon: '☀️',
    cost: 12000, valuePct: 0.04,
    desc: 'Cuts energy bills and boosts eco-friendly home value.',
    pos: [-5, 0.1, 2] as [number, number, number],
    color: '#F39C12',
  },
] as const;

// ── Equity milestone messages ─────────────────────────────────────

const MILESTONES: Record<number, { icon: string; title: string; tip: string }> = {
  10: {
    icon: '🏠',
    title: '10% Equity Reached!',
    tip: "With 10% equity, you may qualify to remove PMI — saving $100–200/month on your mortgage.",
  },
  20: {
    icon: '💰',
    title: '20% Equity Built!',
    tip: "At 20% equity you can refinance at better rates or open a HELOC — a credit line backed by your home.",
  },
  30: {
    icon: '📈',
    title: '30% Equity Milestone!',
    tip: "30% equity is serious wealth. You can leverage it for investments, education, or a down payment on your dream home.",
  },
};

// ── Scene ─────────────────────────────────────────────────────────

export default function HomeLifeScene() {
  const {
    cash, selectedHomeId, homeValue, mortgageBalance,
    improvementsOwned, pendingMaintenance,
    initHomeLife, setPendingMaintenance, applyMaintenance,
    buyImprovement, advanceHomeMonth,
  } = useGameStore();

  const home = homes.find((h) => h.id === selectedHomeId) ?? homes[0];

  // Local state
  const [listingOpen, setListingOpen] = useState(false);
  const [activeImp, setActiveImp] = useState<string | null>(null);
  const [milestoneToast, setMilestoneToast] = useState<{ pct: number; icon: string; title: string; tip: string } | null>(null);
  const shownMilestones = useRef<Set<number>>(new Set());
  const monthsAdvanced = useRef(0);

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

  // Monthly payment breakdown
  const interestPortion = Math.round(mortgageBalance * 0.065 / 12);
  const taxInsurance   = Math.round(home.price * 0.015 / 12);
  const principal      = Math.max(0, home.monthlyPayment - interestPortion - taxInsurance);

  // Handle month advance
  const handlePassMonth = () => {
    if (pendingMaintenance) return;
    advanceHomeMonth();
    monthsAdvanced.current += 1;
    if (shouldMaintenanceFire(monthsAdvanced.current)) {
      setPendingMaintenance(selectMaintenanceEvent(monthsAdvanced.current));
    }
  };

  // Listing profit
  const agentFee      = Math.round(homeValue * 0.05);
  const closingCosts  = Math.round(homeValue * 0.02);
  const estProfit     = homeValue - agentFee - closingCosts - mortgageBalance;

  return (
    <group>
      {/* ── FLOOR ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#B8905A" roughness={0.42} metalness={0.05} />
      </mesh>
      <gridHelper args={[20, 40, '#A07840', '#A07840']} position={[0, 0.005, 0]} />
      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#4B3A6E" roughness={0.95} />
      </mesh>

      {/* ── WALLS ── */}
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

      {/* ── LIGHTS ── */}
      {([-5, 0, 5] as number[]).map((x) => (
        <group key={x}>
          <mesh position={[x, 4.88, 0]}>
            <boxGeometry args={[1.4, 0.05, 0.5]} />
            <meshStandardMaterial color="#FFFFF0" emissive="#FFF8D0" emissiveIntensity={1.4} />
          </mesh>
          <pointLight position={[x, 4.4, 0]} intensity={0.6} color="#FFF8D0" distance={10} decay={2} />
        </group>
      ))}

      {/* ── WINDOWS ── */}
      <mesh position={[-2, 2.1, -7.85]} castShadow>
        <boxGeometry args={[2.8, 1.8, 0.12]} />
        <meshStandardMaterial color="#87CEEB" emissive="#FFE87A" emissiveIntensity={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[3.5, 2.1, -7.85]} castShadow>
        <boxGeometry args={[2.8, 1.8, 0.12]} />
        <meshStandardMaterial color="#87CEEB" emissive="#FFE87A" emissiveIntensity={0.9} roughness={0.05} />
      </mesh>
      <pointLight position={[0, 3.0, -7]} intensity={1.4} color="#FFD96A" distance={14} decay={2} />

      {/* ── FURNITURE (static — already furnished) ── */}
      {/* Sofa */}
      <mesh position={[-2.5, 0.45, -2.5]} castShadow>
        <boxGeometry args={[2.2, 0.9, 1.0]} />
        <meshStandardMaterial color="#6B5B95" roughness={0.8} />
      </mesh>
      {/* Coffee table */}
      <mesh position={[-1.5, 0.3, -0.8]} castShadow>
        <boxGeometry args={[1.6, 0.08, 0.9]} />
        <meshStandardMaterial color="#5A3A1A" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* TV stand + TV */}
      <mesh position={[2.5, 0.3, -2.5]} castShadow>
        <boxGeometry args={[2.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#2A1A0A" roughness={0.5} />
      </mesh>
      <mesh position={[2.5, 1.2, -2.6]} castShadow>
        <boxGeometry args={[2.0, 1.2, 0.09]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Dining table */}
      <mesh position={[0, 0.5, 2.5]} castShadow>
        <boxGeometry args={[1.8, 0.1, 1.0]} />
        <meshStandardMaterial color="#8B7355" roughness={0.5} />
      </mesh>
      {/* Desk area */}
      <mesh position={[-5.5, 0.5, 2.5]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.75]} />
        <meshStandardMaterial color="#7A5C44" roughness={0.6} />
      </mesh>
      {/* Plant */}
      <group position={[7.5, 0, -5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.22, 0.8, 8]} />
          <meshStandardMaterial color="#C47A3A" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.0, 0]} castShadow>
          <sphereGeometry args={[0.55, 10, 10]} />
          <meshStandardMaterial color="#2D7A2D" roughness={0.9} />
        </mesh>
      </group>

      {/* ── WALL-MOUNTED SMART DISPLAY (Dashboard) ── */}
      {/* Display frame */}
      <mesh position={[0, 2.8, -7.85]} castShadow>
        <boxGeometry args={[4.8, 2.2, 0.08]} />
        <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 2.8, -7.78]}>
        <boxGeometry args={[4.5, 1.9, 0.04]} />
        <meshStandardMaterial color="#1E3A5F" emissive="#1E3A5F" emissiveIntensity={0.3} roughness={0.2} />
      </mesh>
      <Html position={[0, 2.8, -7.6]} center distanceFactor={14}>
        <div style={{
          width: 320, padding: '14px 18px',
          background: 'rgba(10,18,40,0.98)', border: '1px solid rgba(212,168,67,0.25)',
          borderRadius: 10, fontFamily: 'Inter, sans-serif', color: '#fff',
          boxShadow: '0 0 30px rgba(10,18,40,0.8)',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#D4A843', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10, textAlign: 'center' }}>
            🏠 Home Dashboard — {home.name}
          </div>

          {/* Key metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'Home Value', value: `$${homeValue.toLocaleString()}`, color: '#4ade80' },
              { label: 'Mortgage Left', value: `$${mortgageBalance.toLocaleString()}`, color: '#f87171' },
              { label: 'Equity', value: `${equityPct.toFixed(1)}%`, color: '#D4A843' },
            ].map((m) => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Equity bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
              <span>Equity built: ${equityValue.toLocaleString()}</span>
              <span>{equityPct.toFixed(1)}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, equityPct)}%`, background: 'linear-gradient(90deg, #D4A843, #4ade80)', borderRadius: 3, transition: 'width 0.8s ease' }} />
            </div>
          </div>

          {/* Monthly breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '8px 10px', marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Monthly Payment — ${home.monthlyPayment}/mo</div>
            {[
              { label: 'Principal', value: principal, color: '#4ade80' },
              { label: 'Interest',  value: interestPortion, color: '#f87171' },
              { label: 'Tax + Insurance', value: taxInsurance, color: '#fbbf24' },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 0', color: 'rgba(255,255,255,0.7)' }}>
                <span>{row.label}</span>
                <span style={{ color: row.color, fontWeight: 700 }}>${row.value}/mo</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <button
            onClick={handlePassMonth}
            disabled={!!pendingMaintenance}
            style={{
              width: '100%', padding: '9px', borderRadius: 8,
              background: pendingMaintenance ? 'rgba(255,255,255,0.08)' : '#0A8F7E',
              color: pendingMaintenance ? 'rgba(255,255,255,0.35)' : '#fff',
              border: 'none', cursor: pendingMaintenance ? 'default' : 'pointer',
              fontWeight: 800, fontSize: 12, fontFamily: 'Inter, sans-serif',
              marginBottom: 6, transition: 'background 0.15s',
            }}
          >
            {pendingMaintenance ? '⚠️ Resolve Maintenance First' : '⏩ Pass a Month →'}
          </button>

          {equityPct >= 15 && (
            <button
              onClick={() => setListingOpen(true)}
              style={{
                width: '100%', padding: '8px', borderRadius: 8,
                background: 'linear-gradient(135deg, #D4A843, #F5C842)',
                color: '#0D2B5E', border: 'none', cursor: 'pointer',
                fontWeight: 800, fontSize: 11, fontFamily: 'Inter, sans-serif',
                boxShadow: '0 0 16px rgba(212,168,67,0.5)',
                animation: 'pulse 2s infinite',
              }}
            >
              🏡 List My Home →
            </button>
          )}
        </div>
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
              onClick={(e) => { e.stopPropagation(); if (!owned) setActiveImp(isActive ? null : imp.id); }}
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
                background: owned ? 'rgba(45,122,45,0.9)' : `rgba(${imp.color.startsWith('#D') ? '212,168,67' : imp.color.startsWith('#8') ? '139,105,20' : imp.color.startsWith('#2') ? '39,174,96' : '243,156,18'},0.88)`,
                color: '#fff', padding: '4px 10px', borderRadius: 6,
                fontSize: 10, fontWeight: 700, fontFamily: 'Inter,sans-serif',
                whiteSpace: 'nowrap', cursor: owned ? 'default' : 'pointer',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                {owned ? `✅ ${imp.label} Installed` : `${imp.icon} ${imp.label}`}
              </div>
            </Html>
            {isActive && !owned && (
              <Html position={[0, 2.2, 0]} center distanceFactor={11}>
                <div style={{
                  background: 'rgba(13,43,94,0.97)', border: '1px solid rgba(212,168,67,0.4)',
                  borderRadius: 12, padding: '14px 18px', minWidth: 220,
                  fontFamily: 'Inter,sans-serif', color: '#fff',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#D4A843', marginBottom: 4 }}>
                    {imp.icon} {imp.label}
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
                      width: '100%', padding: '9px', borderRadius: 8,
                      background: cash >= imp.cost ? '#D4A843' : 'rgba(255,255,255,0.08)',
                      color: cash >= imp.cost ? '#0D2B5E' : 'rgba(255,255,255,0.35)',
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
            background: 'rgba(13,43,94,0.98)', border: '2px solid rgba(248,113,113,0.5)',
            borderRadius: 18, padding: '22px 26px', minWidth: 340,
            fontFamily: 'Inter,sans-serif', color: '#fff',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 42, marginBottom: 10 }}>{pendingMaintenance.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f87171', marginBottom: 6 }}>
              {pendingMaintenance.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14, lineHeight: 1.5 }}>
              {pendingMaintenance.description}
            </div>
            <div style={{ background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px', marginBottom: 16, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
              💡 {pendingMaintenance.tip}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => applyMaintenance(true)}
                disabled={cash < pendingMaintenance.cost}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  background: cash >= pendingMaintenance.cost ? '#4ade80' : 'rgba(255,255,255,0.08)',
                  color: cash >= pendingMaintenance.cost ? '#0D2B5E' : 'rgba(255,255,255,0.35)',
                  border: 'none', cursor: cash >= pendingMaintenance.cost ? 'pointer' : 'default',
                  fontWeight: 800, fontSize: 12, fontFamily: 'Inter,sans-serif',
                }}
              >
                🔧 Fix Now<br />
                <span style={{ fontSize: 10, fontWeight: 600 }}>${pendingMaintenance.cost.toLocaleString()}</span>
              </button>
              <button
                onClick={() => applyMaintenance(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10,
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

      {/* ── LISTING MODAL ── */}
      {listingOpen && (
        <Html position={[0, 3.5, 5.5]} center distanceFactor={14}>
          <div style={{
            background: 'rgba(13,43,94,0.98)', border: '2px solid rgba(212,168,67,0.5)',
            borderRadius: 18, padding: '22px 26px', minWidth: 340,
            fontFamily: 'Inter,sans-serif', color: '#fff',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🏡</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#D4A843', marginBottom: 4 }}>Ready to Sell?</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 18 }}>Estimated Sale Breakdown</div>

            {[
              { label: 'Current Market Value', value: homeValue, color: '#4ade80' },
              { label: 'Agent Commission (5%)', value: -agentFee, color: '#f87171' },
              { label: 'Closing Costs (2%)', value: -closingCosts, color: '#f87171' },
              { label: 'Mortgage Payoff', value: -mortgageBalance, color: '#f87171' },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>{row.label}</span>
                <span style={{ color: row.color, fontWeight: 700 }}>
                  {row.value >= 0 ? '' : '−'}${Math.abs(row.value).toLocaleString()}
                </span>
              </div>
            ))}

            <div style={{ marginTop: 14, padding: '12px', background: estProfit > 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', borderRadius: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Estimated Profit</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: estProfit > 0 ? '#4ade80' : '#f87171' }}>
                {estProfit >= 0 ? '+' : ''}${estProfit.toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'rgba(212,168,67,0.1)', borderRadius: 8, padding: '10px 12px', marginBottom: 16, fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
              🌟 <strong style={{ color: '#D4A843' }}>Dream Home Ahead!</strong><br />
              Your equity could fund a larger Newport News home — start your journey toward your forever home!
            </div>

            <button
              onClick={() => setListingOpen(false)}
              style={{
                width: '100%', padding: '11px', borderRadius: 10,
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
                border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12,
                fontFamily: 'Inter,sans-serif',
              }}
            >
              ✕ Keep Building Equity
            </button>
          </div>
        </Html>
      )}

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
                background: '#0D2B5E', border: '2px solid #D4A843',
                borderRadius: 14, padding: '14px 18px', minWidth: 260,
                fontFamily: 'Inter,sans-serif', pointerEvents: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6, textAlign: 'center' }}>{milestoneToast.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#D4A843', marginBottom: 4, textAlign: 'center' }}>
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
