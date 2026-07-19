import { Html } from '@react-three/drei';
import { InteractionZone } from '@/components/InteractionZone';
import { SceneObstacles } from '@/components/SceneObstacles';
import { useGameStore } from '@/store/gameStore';
import { buildings, buildingRequiredStage } from '@/data/buildings';
import type { BuildingDef } from '@/data/buildings';

/* ── Reusable primitives ──────────────────────────────────────── */

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 1.2, 6]} />
        <meshStandardMaterial color="#6B4C2A" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.7, 8, 7]} />
        <meshStandardMaterial color="#2D6A2D" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[0.45, 8, 7]} />
        <meshStandardMaterial color="#3A7A3A" roughness={0.8} />
      </mesh>
    </group>
  );
}

function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.08, 4.5, 6]} />
        <meshStandardMaterial color="#555566" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.5, 2.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 5]} />
        <meshStandardMaterial color="#555566" metalness={0.5} />
      </mesh>
      <mesh position={[1.0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#FFF8D0" emissive="#FFF5A0" emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[1.0, 2.0, 0]} intensity={0.5} color="#FFF5A0" distance={8} decay={2} />
    </group>
  );
}

function ParkedCar({ position, color, rotation = 0 }: { position: [number, number, number]; color: string; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[1.9, 0.55, 0.85]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.3} />
      </mesh>
      <mesh position={[0.1, 0.62, 0]} castShadow>
        <boxGeometry args={[1.0, 0.32, 0.76]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.25} />
      </mesh>
      {/* Wheels */}
      {([-0.7, 0.7] as number[]).map((x) =>
        ([-0.42, 0.42] as number[]).map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.12, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.1, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}

function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.35]} />
        <meshStandardMaterial color="#8B6914" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.55, -0.14]} castShadow>
        <boxGeometry args={[1.2, 0.35, 0.08]} />
        <meshStandardMaterial color="#8B6914" roughness={0.7} />
      </mesh>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.18, 0]} castShadow>
          <boxGeometry args={[0.07, 0.36, 0.32]} />
          <meshStandardMaterial color="#6B4C2A" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Building Exterior ──────────────────────────────────────────── */

function BuildingExterior({ b, status, onEnter }: {
  b: BuildingDef;
  status: 'open' | 'current' | 'locked';
  onEnter: (id: string) => void;
}) {
  const [w, d] = b.footprint;
  const h = b.stageFor === null ? 3 : (b.stageFor <= 4 ? 4.5 : 5.5);
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';

  // Park has no building — just a flat decorated area
  if (b.id === 'park') {
    return (
      <group position={b.cityPos}>
        {/* Grass patch */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[b.footprint[0] + 2, b.footprint[1] + 2]} />
          <meshStandardMaterial color="#4A8C4A" roughness={0.95} />
        </mesh>
        {/* Park trees */}
        {([-3, 0, 3] as number[]).map((x) =>
          ([-2.5, 2.5] as number[]).map((z) => (
            <Tree key={`pt-${x}-${z}`} position={[x, 0, z]} />
          ))
        )}
        {/* Benches */}
        <Bench position={[-2, 0, 0]} />
        <Bench position={[2, 0, 0]} />
        {/* Fountain base */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[1.0, 1.1, 0.3, 12]} />
          <meshStandardMaterial color="#A0A8B0" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#B8C0CC" metalness={0.4} roughness={0.4} />
        </mesh>
        <Html position={[0, 3.5, 0]} center distanceFactor={14}>
          <div style={{ background: 'rgba(13,43,94,0.88)', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', fontFamily: 'Inter,sans-serif' }}>
            {b.icon} {b.name}
          </div>
        </Html>
      </group>
    );
  }

  return (
    <group position={b.cityPos}>
      {/* Foundation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[w + 1.5, d + 1.5]} />
        <meshStandardMaterial color="#A0A0A8" roughness={0.85} />
      </mesh>

      {/* Main building body */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={isLocked ? '#888' : b.color}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Windows — emissive rows */}
      {([1.2, 2.4, 3.6] as number[]).slice(0, Math.floor(h / 1.5)).map((y) =>
        ([-1.5, 0, 1.5] as number[]).map((x) => (
          <mesh key={`w-${y}-${x}`} position={[x, y, d / 2 + 0.05]}>
            <boxGeometry args={[0.65, 0.45, 0.05]} />
            <meshStandardMaterial
              color={isLocked ? '#444' : '#FFFACC'}
              emissive={isLocked ? '#000' : '#FFF5A0'}
              emissiveIntensity={isLocked ? 0 : 0.8}
              roughness={0.1}
            />
          </mesh>
        ))
      )}

      {/* Accent band at top */}
      <mesh position={[0, h + 0.1, 0]} castShadow>
        <boxGeometry args={[w + 0.2, 0.25, d + 0.2]} />
        <meshStandardMaterial color={isLocked ? '#666' : b.accentColor} roughness={0.5} />
      </mesh>

      {/* Door area */}
      <mesh position={[0, 1.1, d / 2 + 0.08]} castShadow>
        <boxGeometry args={[1.0, 2.2, 0.1]} />
        <meshStandardMaterial color={isLocked ? '#555' : '#2C1A0A'} roughness={0.6} />
      </mesh>

      {/* Door glow point */}
      {!isLocked && (
        <pointLight position={[0, 1.2, d / 2 + 0.5]} intensity={0.35} color={b.accentColor} distance={5} />
      )}

      {/* Objective ring highlight */}
      {isCurrent && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(w, d) / 2 + 0.5, Math.max(w, d) / 2 + 1.0, 32]} />
          <meshStandardMaterial color="#D4A843" emissive="#D4A843" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Sign / label */}
      <Html position={[0, h + 1.2, 0]} center distanceFactor={16}>
        <div
          onClick={() => { if (!isLocked && b.hasInterior) onEnter(b.id); }}
          style={{
            background: isLocked ? 'rgba(40,40,40,0.9)' : isCurrent ? 'rgba(212,168,67,0.95)' : 'rgba(13,43,94,0.9)',
            padding: '5px 12px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            color: isLocked ? '#888' : isCurrent ? '#0D2B5E' : '#fff',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter,sans-serif',
            border: `1px solid ${isLocked ? '#555' : isCurrent ? '#F0C050' : 'rgba(255,255,255,0.2)'}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            cursor: isLocked ? 'not-allowed' : b.hasInterior ? 'pointer' : 'default',
          }}
        >
          {b.icon} {b.name}
          {isLocked && ' 🔒'}
          {isCurrent && ' ★'}
        </div>
      </Html>

      {/* Invisible clickable entrance hitbox — only for buildings with playable interiors */}
      {b.hasInterior && (
        <mesh
          position={[0, 1.5, d / 2 + 0.6]}
          onClick={(e) => {
            e.stopPropagation();
            if (!isLocked) onEnter(b.id);
          }}
        >
          <boxGeometry args={[w, 3, 1.2]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Generous walk-up zone in front of the entrance */}
      {b.hasInterior && !isLocked && (
        <InteractionZone
          position={[0, 0, d / 2 + 1.6]}
          radius={2.0}
          prompt={`Enter ${b.name}`}
          onActivate={() => onEnter(b.id)}
        />
      )}
    </group>
  );
}

/* ── City Map Scene ─────────────────────────────────────────────── */

export default function CityMapScene() {
  const { stage, setTransitioning, setCurrentLocation, setPlayerTarget } = useGameStore();

  const handleEnterBuilding = (id: string) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentLocation(id);
      setPlayerTarget([0, 0, 0]);
      setTransitioning(false);
    }, 700);
  };

  return (
    <group>
      <SceneObstacles
        circles={buildings
          .filter((b) => b.id !== 'park')
          .map((b) => ({
            x: b.cityPos[0],
            z: b.cityPos[2],
            r: Math.max(b.footprint[0], b.footprint[1]) / 2 + 0.5,
          }))}
        bounds={{ minX: -33, maxX: 33, minZ: -33, maxZ: 33 }}
      />
      {/* === GROUND === */}
      {/* Main grass base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#5A8C4A" roughness={0.95} />
      </mesh>

      {/* Main E-W road (z = -1 to 1, i.e. 5 units wide) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -0.5]} receiveShadow>
        <planeGeometry args={[66, 5]} />
        <meshStandardMaterial color="#555560" roughness={0.8} />
      </mesh>

      {/* N-S road (x = -0.5, 4 wide) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0.01, 0]} receiveShadow>
        <planeGeometry args={[4, 66]} />
        <meshStandardMaterial color="#555560" roughness={0.8} />
      </mesh>

      {/* Center line markings — E-W road */}
      {([-24, -16, -8, 0, 8, 16, 24] as number[]).map((x) => (
        <mesh key={`ew-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, -0.5]}>
          <planeGeometry args={[3.5, 0.2]} />
          <meshStandardMaterial color="#F5F5A0" roughness={0.9} />
        </mesh>
      ))}

      {/* Sidewalks */}
      {/* North sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -4]} receiveShadow>
        <planeGeometry args={[66, 2]} />
        <meshStandardMaterial color="#8C8C96" roughness={0.85} />
      </mesh>
      {/* South sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3]} receiveShadow>
        <planeGeometry args={[66, 2]} />
        <meshStandardMaterial color="#8C8C96" roughness={0.85} />
      </mesh>

      {/* Crosswalk stripes at center */}
      {([-2, -1, 0, 1, 2] as number[]).map((i) => (
        <mesh key={`cw-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0.025, i * 0.8 - 0.5]}>
          <planeGeometry args={[0.6, 0.55]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* ─── Street lights along main road ─── */}
      {([-20, -10, 10, 20] as number[]).map((x) => (
        <StreetLight key={`sl-${x}`} position={[x, 0, -4]} />
      ))}

      {/* ─── Parked cars ─── */}
      <ParkedCar position={[-22, 0, -3.2]} color="#C0392B" />
      <ParkedCar position={[-14, 0, -3.2]} color="#2C7BB6" />
      <ParkedCar position={[10, 0, 2.2]} color="#8B6914" rotation={Math.PI} />
      <ParkedCar position={[20, 0, 2.2]} color="#3A3A3A" rotation={Math.PI} />

      {/* ─── Trees alongside sidewalks and grass areas ─── */}
      {([-26, -20, -12, 2, 14, 22, 28] as number[]).map((x) => (
        <Tree key={`tn-${x}`} position={[x, 0, -7.5]} />
      ))}
      {([-26, -20, -12, 2, 14, 22, 28] as number[]).map((x) => (
        <Tree key={`ts-${x}`} position={[x, 0, 6.5]} />
      ))}

      {/* ─── Buildings ─── */}
      {buildings.map((b) => {
        const status = buildingRequiredStage(b, stage);
        return (
          <BuildingExterior
            key={b.id}
            b={b}
            status={status}
            onEnter={handleEnterBuilding}
          />
        );
      })}
    </group>
  );
}
