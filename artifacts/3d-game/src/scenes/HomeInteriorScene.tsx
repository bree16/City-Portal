import { GameIcon, GameIconName } from '@/components/ui/GameIcon';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import { InteractionZone } from '@/components/InteractionZone';
import { SceneObstacles } from '@/components/SceneObstacles';
import { NPCCharacter } from '@/components/characters/NPCCharacter';
import type { NPCDef } from '@/components/characters/NPCCharacter';
import { PottedPlant, TallPlant, WallArt, Rug, Bookshelf, FloorLamp, Bush, FlowerBed } from '@/components/decor/DecorKit';
import { homes } from '@/data/homes';

// ── Per-home theme data ──────────────────────────────────────────

interface FeatureProp {
  pos: [number, number, number];
  icon: import('@/components/ui/GameIcon').GameIconName;
  label: string;
  tip: string;
}

interface HomeTheme {
  wallColor: string;
  floorColor: string;
  bedroomFloorColor: string;
  accentColor: string;
  ceilingColor: string;
  hasFireplace: boolean;
  hasKitchenIsland: boolean;
  features: Record<string, FeatureProp[]>;
}

const HOME_THEMES: Record<number, HomeTheme> = {
  1: {
    wallColor: '#E9E4DA', floorColor: '#9A7B5C', bedroomFloorColor: '#A0522D',
    accentColor: '#1E3A8A', ceilingColor: '#E9E4DA',
    hasFireplace: true, hasKitchenIsland: false,
    features: {
      entry: [{ pos: [-4, 0.6, 7], icon: 'home', label: 'Crown Molding', tip: 'Original 1940s crown molding — a sign of quality craftsmanship that adds character and value.' }],
      living: [
        { pos: [-2, 0.3, 2.5], icon: 'kitchen', label: 'Brick Fireplace', tip: 'Wood-burning fireplace, fully functional. A working fireplace can add $1,000–$5,000 to home value.' },
        { pos: [1.5, 0.1, 1], icon: 'wood', label: 'Hardwood Floors', tip: 'Original solid oak hardwood throughout. Refinishable and adds 2.5% to resale value on average.' },
      ],
      kitchen: [
        { pos: [5.5, 1.0, 0.5], icon: 'wrench', label: 'Updated Appliances', tip: 'Stainless steel appliances replaced in 2022. Energy Star rated saves ~$100/year on utilities.' },
        { pos: [5, 0.9, -1.5], icon: 'kitchen', label: 'Granite Counters', tip: 'Durable granite countertops resist scratches and can add $2,000–$5,000 to resale value.' },
      ],
      bedroom: [
        { pos: [-5.5, 1.0, 0], icon: 'sun', label: 'East-Facing Windows', tip: 'Double-pane east windows. Morning sun reduces winter heating costs naturally.' },
        { pos: [-4, 0.5, -1.5], icon: 'furniture', label: 'Large Closet', tip: 'Walk-in closet potential. Storage ranks #1 on buyer wishlists nationwide.' },
      ],
      backyard: [
        { pos: [0.5, 0.1, -5.5], icon: 'leaf', label: 'Mature Oak Trees', tip: 'Mature trees add 10–15% to property value and cut cooling costs by up to 25%.' },
        { pos: [2.5, 0.5, -5], icon: 'lock', label: 'Privacy Fence', tip: '6-foot privacy fencing adds security, reduces noise, and increases buyer appeal.' },
      ],
    },
  },
  2: {
    wallColor: '#DDD8CE', floorColor: '#8B5A2B', bedroomFloorColor: '#9A7B5C',
    accentColor: '#0F766E', ceilingColor: '#DDD8CE',
    hasFireplace: false, hasKitchenIsland: false,
    features: {
      entry: [{ pos: [-4, 0.6, 7], icon: 'home', label: 'Ranch Layout', tip: 'Single-level ranch homes are fully accessible — perfect for long-term aging in place.' }],
      living: [
        { pos: [1.5, 0.1, 2], icon: 'furniture', label: 'Neutral Carpet', tip: 'Low-maintenance carpet throughout. Easy to replace or upgrade to hardwood later for under $3,000.' },
        { pos: [-1.5, 1.2, 3], icon: 'sun', label: 'Picture Window', tip: 'Large front window floods the room with natural light, reducing daytime electricity costs.' },
      ],
      kitchen: [
        { pos: [5.5, 0.9, 0.5], icon: 'kitchen', label: 'Breakfast Bar', tip: 'Space-efficient breakfast bar — perfect for small families or busy morning routines.' },
        { pos: [5, 0.9, -1.5], icon: 'furniture', label: 'Built-In Pantry', tip: 'Built-in pantry storage — one of the most-requested kitchen features by homebuyers.' },
      ],
      bedroom: [
        { pos: [-5.5, 0.5, 0], icon: 'bed', label: 'Plush Carpet', tip: 'Premium carpet in bedrooms — warm underfoot and provides excellent noise insulation.' },
        { pos: [-4, 1.0, -1.5], icon: 'lightbulb', label: 'Ceiling Fan', tip: 'Energy-efficient ceiling fans can reduce AC use by 40% in summer months.' },
      ],
      backyard: [
        { pos: [0, 0.1, -5.5], icon: 'leaf', label: 'Quarter-Acre Lot', tip: 'Flat quarter-acre lot — room to add a garage, shed, or deck in the future.' },
        { pos: [-2, 0.3, -5], icon: 'leaf', label: 'Garden Beds', tip: 'Existing raised garden beds — food gardens can save a family $1,200/year in groceries.' },
      ],
    },
  },
  3: {
    wallColor: '#E9E4DA', floorColor: '#A0522D', bedroomFloorColor: '#DDD8CE',
    accentColor: '#D4AF37', ceilingColor: '#E9E4DA',
    hasFireplace: false, hasKitchenIsland: true,
    features: {
      entry: [{ pos: [-4, 0.6, 7], icon: 'sparkles', label: 'Modern Finishes', tip: 'Contemporary design with clean lines throughout — highly attractive to modern buyers.' }],
      living: [
        { pos: [1, 0.1, 2], icon: 'wood', label: 'Luxury Vinyl Plank', tip: 'Waterproof luxury vinyl — more durable than hardwood and costs 50% less to install.' },
        { pos: [-2.5, 1.5, 1], icon: 'sun', label: 'Floor-to-Ceiling Glass', tip: 'Dramatic natural light with UV-coating. Energy-efficient double-glazed panels.' },
      ],
      kitchen: [
        { pos: [4.5, 1.0, 0.5], icon: 'kitchen', label: 'Quartz Island', tip: '6-foot quartz island with bar seating. Open-plan kitchens add 3–7% to resale value.' },
        { pos: [5.5, 0.9, -1.5], icon: 'phone', label: 'Smart Appliances', tip: 'WiFi-connected appliances. Smart home features attract premium buyers and renters.' },
      ],
      bedroom: [
        { pos: [-5.5, 1.5, 0], icon: 'bath', label: 'En Suite Bath', tip: 'Private en suite bathroom. Homes with master en suites sell 12% faster on average.' },
        { pos: [-3.5, 0.5, -1.5], icon: 'map', label: 'Oyster Point View', tip: 'Elevated position overlooking Oyster Point. Location is the #1 driver of home value.' },
      ],
      backyard: [
        { pos: [0, 0.5, -5], icon: 'wood', label: 'Composite Deck', tip: 'Low-maintenance composite deck. Decks add up to 65% of their cost back at resale.' },
        { pos: [-2, 0.3, -5.5], icon: 'droplet', label: 'Water Feature', tip: 'Small water feature creates a relaxing outdoor living area — boosts lifestyle appeal.' },
      ],
    },
  },
  4: {
    wallColor: '#DDD8CE', floorColor: '#9A7B5C', bedroomFloorColor: '#8B5A2B',
    accentColor: '#0F766E', ceilingColor: '#DDD8CE',
    hasFireplace: false, hasKitchenIsland: false,
    features: {
      entry: [{ pos: [-4, 0.6, 7], icon: 'trend-up', label: 'Equity Opportunity', tip: 'At $168k — 30% below neighborhood median — strong appreciation potential as the area develops.' }],
      living: [
        { pos: [1, 0.1, 2], icon: 'ruler', label: 'Efficient Layout', tip: 'Compact 980sqft means lower heating/cooling costs and easier maintenance year-round.' },
        { pos: [-2, 1.0, 3], icon: 'sun', label: 'Bay Window Nook', tip: 'Bay windows add architectural character and natural light — makes small spaces feel larger.' },
      ],
      kitchen: [
        { pos: [5.5, 0.9, 0.5], icon: 'wrench', label: 'Reno Potential', tip: "Small kitchen is a blank canvas — budget $15k–$25k for a full modern remodel with strong ROI." },
        { pos: [5, 0.9, -1.5], icon: 'kitchen', label: 'Efficient Size', tip: "Smaller kitchens mean faster cleanup and less wasted food. Great for solo buyers or couples." },
      ],
      bedroom: [
        { pos: [-5.5, 0.5, 0], icon: 'neighborhood', label: 'Quiet Street', tip: "Southeast cul-de-sac location — minimal traffic, low noise, ideal for peaceful living." },
        { pos: [-4, 1.0, -1.5], icon: 'furniture', label: 'Storage Nook', tip: "Built-in storage nook — small homes benefit hugely from smart built-in storage solutions." },
      ],
      backyard: [
        { pos: [0, 0.1, -5.5], icon: 'paw', label: 'Fenced Yard', tip: "Fully fenced yard — perfect for pets or children. Fenced yards increase buyer interest by 18%." },
        { pos: [2, 0.3, -5], icon: 'sun', label: 'South-Facing', tip: "South-facing yard gets full sun — ideal for a vegetable garden saving $1,200+/year in food." },
      ],
    },
  },
};

// ── Tour NPC agents (one per home — matching NeighborhoodScene) ──

const TOUR_NPCS: Record<number, Omit<NPCDef, 'position' | 'rotation'>> = {
  1: { id: 'tour_npc', name: 'Agent Maya',   role: 'Realtor', skinTone: '#FDBCB4', hairColor: '#1a0a00', shirtColor: '#D4A843', pantsColor: '#2C2C2C' },
  2: { id: 'tour_npc', name: 'Agent Marcus', role: 'Realtor', skinTone: '#8D5524', hairColor: '#2C1810', shirtColor: '#0D2B5E', pantsColor: '#1A3A6B' },
  3: { id: 'tour_npc', name: 'Agent Lisa',   role: 'Realtor', skinTone: '#F1C27D', hairColor: '#B8860B', shirtColor: '#27AE60', pantsColor: '#1C4230' },
  4: { id: 'tour_npc', name: 'Agent James',  role: 'Realtor', skinTone: '#E0AC69', hairColor: '#3B1F0A', shirtColor: '#8E44AD', pantsColor: '#2C1040' },
};

// ── Clickable feature props ──────────────────────────────────────

function ClickableProp({ pos, icon, label, tip }: FeatureProp) {
  const [open, setOpen] = useState(false);
  return (
    <group position={pos}>
      {/* Generous zone — clicking near the marker also toggles it */}
      <InteractionZone
        position={[0, -pos[1], 0]}
        radius={0.95}
        height={1.8}
        highlightPad={0.7}
        prompt="Inspect"
        onActivate={() => setOpen((v) => !v)}
      />
      <mesh
        onPointerDown={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        castShadow
      >
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial
          color={open ? '#D4AF37' : '#0F766E'}
          emissive={open ? '#D4AF37' : '#0F766E'}
          emissiveIntensity={open ? 1.0 : 0.5}
        />
      </mesh>
      {!open && (
        <Html position={[0, 0.42, 0]} center distanceFactor={10}>
          <div onPointerDown={(e) => { e.stopPropagation(); setOpen(true); }} style={{ background: 'rgba(15,118,110,0.85)', color: '#fff', borderRadius: 'var(--glass-radius)', padding: '2px 7px', fontSize: 9, fontWeight: 700, fontFamily: 'var(--display-font)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
            ● Inspect
          </div>
        </Html>
      )}
      {open && (
        <Html position={[0, 1.4, 0]} center distanceFactor={10}>
          <div style={{
            background: 'rgba(9,7,10,0.96)', border: '1px solid rgba(212,175,55,0.45)',
            borderRadius: 'var(--glass-radius)', padding: '10px 14px', maxWidth: 210,
            boxShadow: '0 6px 24px rgba(0,0,0,0.5)', fontFamily: 'var(--display-font)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#D4AF37', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}><GameIcon name={icon as GameIconName} size={14} /> {label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.82)', lineHeight: 1.45 }}>{tip}</div>
            <button onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--display-font)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <GameIcon name="close" size={10} /> Close
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

// ── Zone detector (runs in useFrame — no React hooks violation) ──

const ROOMS = ['entry', 'living', 'kitchen', 'bedroom', 'backyard'] as const;

function ZoneTracker({ homeId }: { homeId: string }) {
  const lastZone = useRef<string | null>(null);
  const dialogueFired = useRef(false);

  useFrame(() => {
    const store = useGameStore.getState();
    const [px, , pz] = store.playerPosition;

    let zone: string | null = null;
    if (pz > 5.5) zone = 'entry';
    else if (pz > 0 && pz <= 5.5 && Math.abs(px) < 4) zone = 'living';
    else if (px >= 2 && pz > -3.5 && pz <= 2) zone = 'kitchen';
    else if (px <= -2 && pz > -3.5 && pz <= 2) zone = 'bedroom';
    else if (pz <= -3.5) zone = 'backyard';

    if (zone && zone !== lastZone.current) {
      lastZone.current = zone;
      store.markRoomVisited(homeId, zone);
      // Auto-open realtor dialogue the first time player enters the living room
      if (zone === 'living' && !dialogueFired.current && !store.activeDialogue) {
        dialogueFired.current = true;
        store.openDialogue('tour_npc');
      }
    }
  });

  return null;
}

// ── Room label helper ────────────────────────────────────────────

function RoomLabel({ pos, text }: { pos: [number, number, number]; text: string }) {
  return (
    <Html position={pos} center distanceFactor={16} style={{ pointerEvents: 'none' }}>
      <div style={{ background: 'rgba(9,7,10,0.65)', borderRadius: 'var(--glass-radius)', padding: '3px 9px', fontSize: 9, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--display-font)', fontWeight: 700, backdropFilter: 'blur(4px)', whiteSpace: 'nowrap' }}>
        {text}
      </div>
    </Html>
  );
}

// ── Main Scene ───────────────────────────────────────────────────

export default function HomeInteriorScene() {
  const { selectedHomeId, openDialogue } = useGameStore();
  const homeId = selectedHomeId ?? 1;
  const theme = HOME_THEMES[homeId] ?? HOME_THEMES[1];
  const home = homes.find((h) => h.id === homeId) ?? homes[0];

  const npcBase = TOUR_NPCS[homeId] ?? TOUR_NPCS[1];
  const npc: NPCDef = { ...npcBase, position: [-1, 0, 2.5], rotation: [0, 0.4, 0] };

  const W = theme.wallColor;
  const F = theme.floorColor;
  const BF = theme.bedroomFloorColor;
  const C = theme.ceilingColor;

  return (
    <group>
      <ZoneTracker homeId={String(homeId)} />
      <SceneObstacles
        circles={[
          { x: -1.5, z: 0.5, r: 1.6 },   // sofa
          { x: -1.5, z: 2.2, r: 0.9 },   // coffee table
          { x: 2.5, z: 2, r: 1.2 },      // TV stand
          { x: 6.5, z: -1.5, r: 1.1 },   // kitchen counter (south)
          { x: 6.5, z: 1.2, r: 1.1 },    // kitchen counter (north)
          ...(theme.hasKitchenIsland ? [{ x: 4.5, z: 0, r: 1.4 }] : []),
          ...(theme.hasFireplace ? [{ x: -4.7, z: 3, r: 1.1 }] : []),
          { x: -5.5, z: -1.5, r: 1.7 },  // bed
          { x: -7.2, z: 0.5, r: 0.7 },   // dresser
          { x: 0, z: -5.5, r: 0.7 },     // patio table
          // ── Added decor obstacles (theme-varied) ──
          { x: 3.6, z: 7, r: 0.7 },      // tall plant by front entry
          { x: -4.4, z: -0.4, r: 0.6 },  // bedroom corner floor lamp
          ...(theme.hasFireplace ? [{ x: -4.5, z: 5, r: 0.7 }] : [{ x: -4.5, z: 5.4, r: 0.65 }]), // bookshelf / plant by living wall
        ]}
        bounds={{ minX: -7.6, maxX: 7.6, minZ: -7.6, maxZ: 8.4 }}
      />
      {/* Generous zone around the realtor */}
      <InteractionZone position={[-1, 0, 2.5]} radius={1.4} prompt="Talk to Realtor" onActivate={() => openDialogue('tour_npc')} />

      {/* Home name card */}
      <Html position={[0, 3.5, 8.5]} center distanceFactor={18}>
        <div style={{ background: 'rgba(9,7,10,0.9)', borderRadius: 'var(--glass-radius)', padding: '6px 14px', fontFamily: 'var(--display-font)', textAlign: 'center', border: '1px solid rgba(212,175,55,0.35)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#D4AF37' }}>{home.name}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{home.neighborhood} · ${home.price.toLocaleString()}</div>
        </div>
      </Html>

      {/* ── FLOORS ── */}
      {/* Main area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3]} receiveShadow>
        <planeGeometry args={[10, 14]} />
        <meshStandardMaterial color={F} roughness={0.72} metalness={0.04} />
      </mesh>
      {/* Kitchen alcove floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.5, 0, -0.5]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color={F} roughness={0.7} metalness={0.04} />
      </mesh>
      {/* Bedroom floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, 0, -0.5]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color={BF} roughness={0.9} />
      </mesh>
      {/* Patio */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -5.5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#5A8C4A" roughness={0.95} />
      </mesh>

      {/* ── CEILINGS ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 3]}>
        <planeGeometry args={[10, 14]} />
        <meshStandardMaterial color={C} roughness={1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[5.5, 3, -0.5]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color={C} roughness={1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-5.5, 3, -0.5]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color={C} roughness={1} />
      </mesh>

      {/* ── MAIN ROOM WALLS ── */}
      <mesh position={[-5, 1.5, 3]} receiveShadow castShadow>
        <boxGeometry args={[0.16, 3, 14]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      <mesh position={[5, 2.2, 5.5]} receiveShadow>
        <boxGeometry args={[0.16, 1.6, 9]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      {/* Back wall center (above back door) */}
      <mesh position={[0, 2.5, -2]} receiveShadow>
        <boxGeometry args={[4, 1, 0.16]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      {/* Back wall left section */}
      <mesh position={[-3.5, 1.5, -2]} receiveShadow>
        <boxGeometry args={[3, 3, 0.16]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      {/* Back wall right section */}
      <mesh position={[3.5, 1.5, -2]} receiveShadow>
        <boxGeometry args={[3, 3, 0.16]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      {/* Front wall side pillars */}
      <mesh position={[-4, 1.5, 8]} receiveShadow>
        <boxGeometry args={[2, 3, 0.16]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      <mesh position={[4, 1.5, 8]} receiveShadow>
        <boxGeometry args={[2, 3, 0.16]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>

      {/* ── BEDROOM SECTION ── */}
      <mesh position={[-8, 1.5, -1.5]} receiveShadow>
        <boxGeometry args={[0.16, 3, 7]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      <mesh position={[-5.5, 1.5, -4]} receiveShadow>
        <boxGeometry args={[5, 3, 0.16]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      {/* Bedroom doorway — top beam */}
      <mesh position={[-2.5, 2.5, 0.5]} receiveShadow>
        <boxGeometry args={[0.16, 1, 2.5]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      {/* Bedroom wall above doorway and below */}
      <mesh position={[-2.5, 1.5, -2.5]} receiveShadow>
        <boxGeometry args={[0.16, 3, 3]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>

      {/* ── KITCHEN SECTION ── */}
      <mesh position={[8, 1.5, -1.5]} receiveShadow>
        <boxGeometry args={[0.16, 3, 7]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      <mesh position={[5.5, 1.5, -4]} receiveShadow>
        <boxGeometry args={[5, 3, 0.16]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      <mesh position={[2.5, 2.5, 0.5]} receiveShadow>
        <boxGeometry args={[0.16, 1, 2.5]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>
      <mesh position={[2.5, 1.5, -2.5]} receiveShadow>
        <boxGeometry args={[0.16, 3, 3]} />
        <meshStandardMaterial color={W} roughness={0.9} />
      </mesh>

      {/* ── LIVING ROOM FURNITURE ── */}
      {/* Sofa */}
      <mesh position={[-1.5, 0.45, 0.5]} castShadow>
        <boxGeometry args={[3.5, 0.9, 1.2]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>
      <mesh position={[-1.5, 0.88, -0.1]} castShadow>
        <boxGeometry args={[3.5, 0.44, 0.16]} />
        <meshStandardMaterial color="#9A7B5C" roughness={0.8} />
      </mesh>
      {/* Cushions */}
      {([-2, -0.5, 1] as number[]).map((cx) => (
        <mesh key={cx} position={[cx, 0.95, 0.38]} castShadow>
          <boxGeometry args={[0.88, 0.16, 0.86]} />
          <meshStandardMaterial color="#5F9EA0" roughness={0.9} />
        </mesh>
      ))}
      {/* Coffee table */}
      <mesh position={[-1.5, 0.28, 2.2]} castShadow>
        <boxGeometry args={[2.2, 0.08, 1.0]} />
        <meshStandardMaterial color="#DDD8CE" roughness={0.4} metalness={0.05} />
      </mesh>
      {([-0.9, 0.9] as number[]).map((lx) =>
        ([-0.35, 0.35] as number[]).map((lz) => (
          <mesh key={`${lx}${lz}`} position={[lx - 1.5, 0.14, lz + 2.2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.28, 6]} />
            <meshStandardMaterial color="#D2B48C" roughness={0.6} />
          </mesh>
        ))
      )}
      {/* TV + stand */}
      <mesh position={[2.5, 0.35, 2]} castShadow>
        <boxGeometry args={[2.4, 0.7, 0.5]} />
        <meshStandardMaterial color="#9A7B5C" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[2.5, 1.3, 2.1]} castShadow>
        <boxGeometry args={[2.0, 1.3, 0.09]} />
        <meshStandardMaterial color="#E9E4DA" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Fireplace (home 1 only) */}
      {theme.hasFireplace && (
        <group position={[-4.7, 0, 3]}>
          <mesh position={[0, 1.0, 0.09]} castShadow>
            <boxGeometry args={[2.2, 2.0, 0.2]} />
            <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.6, 0.2]} castShadow>
            <boxGeometry args={[1.4, 1.2, 0.2]} />
            <meshStandardMaterial color="#E9E4DA" roughness={0.9} />
          </mesh>
          <pointLight position={[0, 0.8, 0.5]} intensity={0.7} color="#4682B4" distance={5} decay={2} />
        </group>
      )}

      {/* ── KITCHEN FURNITURE ── */}
      <mesh position={[6.5, 0.45, 0]} castShadow>
        <boxGeometry args={[1.2, 0.9, 5]} />
        <meshStandardMaterial color="#DDD8CE" roughness={0.7} />
      </mesh>
      <mesh position={[6.5, 0.95, 0]} castShadow>
        <boxGeometry args={[1.3, 0.08, 5.2]} />
        <meshStandardMaterial color={homeId === 1 ? '#4682B4' : homeId === 3 ? '#8B5A2B' : '#708090'} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[6.5, 2.1, 0]} castShadow>
        <boxGeometry args={[1.0, 0.9, 4.8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.7} />
      </mesh>
      {/* Stove */}
      <mesh position={[6.5, 0.95, 1.2]} castShadow>
        <boxGeometry args={[0.7, 0.08, 0.65]} />
        <meshStandardMaterial color="#E9E4DA" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Kitchen island (home 3) */}
      {theme.hasKitchenIsland && (
        <mesh position={[4.5, 0.52, 0]} castShadow>
          <boxGeometry args={[1.6, 1.04, 3.0]} />
          <meshStandardMaterial color="#9A7B5C" roughness={0.4} metalness={0.05} />
        </mesh>
      )}

      {/* ── BEDROOM FURNITURE ── */}
      <mesh position={[-5.5, 0.25, -1.5]} castShadow>
        <boxGeometry args={[3.2, 0.5, 2.5]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.7} />
      </mesh>
      <mesh position={[-5.5, 0.6, -1.5]} castShadow>
        <boxGeometry args={[3.0, 0.4, 2.3]} />
        <meshStandardMaterial color="#DDD8CE" roughness={0.95} />
      </mesh>
      <mesh position={[-5.5, 0.85, -2.3]} castShadow>
        <boxGeometry args={[1.8, 0.2, 0.5]} />
        <meshStandardMaterial color="#4682B4" roughness={0.95} />
      </mesh>
      <mesh position={[-5.5, 1.0, -2.85]} castShadow>
        <boxGeometry args={[3.2, 1.4, 0.16]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.7} />
      </mesh>
      {/* Nightstand */}
      <mesh position={[-4.0, 0.38, -2.1]} castShadow>
        <boxGeometry args={[0.7, 0.76, 0.6]} />
        <meshStandardMaterial color="#9A7B5C" roughness={0.6} />
      </mesh>
      {/* Dresser */}
      <mesh position={[-7.2, 0.6, 0.5]} castShadow>
        <boxGeometry args={[0.55, 1.2, 2.0]} />
        <meshStandardMaterial color="#9A7B5C" roughness={0.6} metalness={0.04} />
      </mesh>

      {/* ── BACKYARD / PATIO ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -4.5]} receiveShadow>
        <planeGeometry args={[6, 2]} />
        <meshStandardMaterial color="#DDD8CE" roughness={0.9} />
      </mesh>
      {/* Patio chairs */}
      {([-1.5, 1.5] as number[]).map((px) => (
        <group key={px} position={[px, 0, -5.5]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.6, 0.1, 0.6]} />
            <meshStandardMaterial color="#A0522D" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.65, -0.24]} castShadow>
            <boxGeometry args={[0.6, 0.65, 0.08]} />
            <meshStandardMaterial color="#5F9EA0" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Patio table */}
      <mesh position={[0, 0.36, -5.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.72, 6]} />
        <meshStandardMaterial color="#DDD8CE" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, -5.5]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 12]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Fence posts */}
      {([-4, -2, 0, 2, 4] as number[]).map((fx) => (
        <mesh key={fx} position={[fx, 0.75, -8]} castShadow>
          <boxGeometry args={[0.08, 1.5, 0.08]} />
          <meshStandardMaterial color="#DDD8CE" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 1.2, -8]} castShadow>
        <boxGeometry args={[8, 0.08, 0.08]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.5, -8]} castShadow>
        <boxGeometry args={[8, 0.08, 0.08]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>

      {/* ── CEILING LIGHTS ── */}
      {([[-1, 3], [2, 3]] as [number, number][]).map(([lx, lz]) => (
        <group key={`l${lx}`}>
          <mesh position={[lx, 2.85, lz]}>
            <cylinderGeometry args={[0.18, 0.22, 0.16, 10]} />
            <meshStandardMaterial color="#E9E4DA" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[lx, 2.78, lz]}>
            <cylinderGeometry args={[0.15, 0.15, 0.04, 10]} />
            <meshStandardMaterial color="#5F9EA0" emissive="#FFE7C2" emissiveIntensity={0.6} />
          </mesh>
          <pointLight position={[lx, 2.5, lz]} intensity={0.7} color="#5F9EA0" distance={8} decay={2} />
        </group>
      ))}

      {/* ── DECOR (theme-varied per home) ── */}
      {/* Living-room area rug — accent-tinted per theme */}
      <Rug
        position={[-1.5, 0.006, 1.5]}
        w={4.0} d={3.0}
        color={theme.accentColor}
        border={theme.floorColor}
      />
      {/* Wall art on the left living-room wall (x=-5, faces +x) */}
      <WallArt position={[-4.9, 1.9, 1.5]} rotation={[0, Math.PI / 2, 0]} color={theme.accentColor} w={1.2} h={0.9} />
      {/* Second wall art on back-left wall (z=-2, faces +z) */}
      <WallArt position={[-3.5, 1.9, -1.9]} rotation={[0, 0, 0]} color={theme.accentColor} w={1.0} h={0.75} />
      {/* Tall plant by the front entry (obstacle registered) */}
      <TallPlant position={[3.6, 0, 7]} scale={1.0} />
      {/* Floor lamp in bedroom corner (obstacle registered) */}
      <FloorLamp position={[-4.4, 0, -0.4]} />
      {/* Home 1: cozy bookshelf beside the fireplace; others: leafy plant */}
      {theme.hasFireplace ? (
        <Bookshelf position={[-4.7, 0, 5]} rotation={[0, 0, 0]} color={theme.accentColor} />
      ) : (
        <PottedPlant position={[-4.5, 0, 5.4]} scale={1.15} leafColor="#2E8B57" />
      )}
      {/* Home 3 (modern): sleek accent plant on the kitchen island end */}
      {theme.hasKitchenIsland && (
        <PottedPlant position={[4.5, 1.04, 1.2]} scale={0.7} potColor="#D2B48C" leafColor="#228B22" />
      )}
      {/* Backyard greenery — flowers + bushes vary by theme */}
      <FlowerBed position={[3.5, 0.04, -5]} w={1.6} d={0.6} />
      <Bush position={[-3.5, 0, -6.5]} scale={1.1} color="#4682B4" />
      <Bush position={[-2.2, 0, -6.6]} scale={0.85} color="#5F9EA0" />

      {/* ── CLICKABLE FEATURE PROPS ── */}
      {Object.entries(theme.features).flatMap(([, props]) =>
        props.map((p, i) => <ClickableProp key={`${p.label}-${i}`} {...p} />)
      )}

      {/* ── REALTOR NPC ── */}
      <NPCCharacter npc={npc} onClick={() => openDialogue('tour_npc')} />

      {/* ── ROOM LABELS ── */}
      <RoomLabel pos={[0, 3.2, 3]} text="Living Room" />
      <RoomLabel pos={[5.5, 3.2, 0]} text="Kitchen" />
      <RoomLabel pos={[-5.5, 3.2, 0]} text="Bedroom" />
      <RoomLabel pos={[0, 2.5, -6]} text="Backyard" />
    </group>
  );
}
