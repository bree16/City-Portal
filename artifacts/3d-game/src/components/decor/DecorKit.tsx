import { useMemo } from 'react';
import * as THREE from 'three';

/* Shared, low-poly decor kit. All components use cheap primitives and
   shared materials where possible — safe to sprinkle across scenes. */

type V3 = [number, number, number];

/* ── Plants ───────────────────────────────────────────────────── */

export function PottedPlant({ position, scale = 1, leafColor = '#2D7A2D', potColor = '#C47A3A' }: {
  position: V3; scale?: number; leafColor?: string; potColor?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.17, 0.6, 8]} />
        <meshStandardMaterial color={potColor} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 8]} />
        <meshStandardMaterial color="#3A2A1A" roughness={1} />
      </mesh>
      {/* Leaf clusters */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.32, 8, 7]} />
        <meshStandardMaterial color={leafColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 1.15, 0.05]} castShadow>
        <sphereGeometry args={[0.2, 7, 6]} />
        <meshStandardMaterial color={leafColor} roughness={0.9} />
      </mesh>
      <mesh position={[-0.16, 1.12, -0.08]} castShadow>
        <sphereGeometry args={[0.17, 7, 6]} />
        <meshStandardMaterial color={leafColor} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function TallPlant({ position, scale = 1 }: { position: V3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.19, 0.7, 8]} />
        <meshStandardMaterial color="#8A8078" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.05, 0.9, 5]} />
        <meshStandardMaterial color="#5A4A2A" roughness={0.9} />
      </mesh>
      {/* Fronds */}
      {[0, 1.05, 2.1, 3.14, 4.2, 5.24].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.28, 1.5 + (i % 2) * 0.12, Math.sin(a) * 0.28]}
          rotation={[Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7]} castShadow>
          <coneGeometry args={[0.1, 0.7, 4]} />
          <meshStandardMaterial color={i % 2 ? '#2D7A2D' : '#3A8A3A'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Wall decor ───────────────────────────────────────────────── */

export function WallArt({ position, rotation = [0, 0, 0], color = '#4A90C4', w = 1.1, h = 0.8, frame = '#3A2A1A' }: {
  position: V3; rotation?: V3; color?: string; w?: number; h?: number; frame?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[w + 0.1, h + 0.1, 0.05]} />
        <meshStandardMaterial color={frame} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[w, h, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Simple abstract shapes on the canvas */}
      <mesh position={[-w * 0.18, h * 0.1, 0.045]}>
        <circleGeometry args={[h * 0.22, 12]} />
        <meshStandardMaterial color="#F0E6D3" roughness={0.9} />
      </mesh>
      <mesh position={[w * 0.22, -h * 0.15, 0.045]}>
        <planeGeometry args={[w * 0.3, h * 0.3]} />
        <meshStandardMaterial color="#D4A843" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function WallClock({ position, rotation = [0, 0, 0] }: { position: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 20]} />
        <meshStandardMaterial color="#2C2C2C" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.028, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.01, 20]} />
        <meshStandardMaterial color="#F5F0E8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.04, -0.06]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 0.005, 0.14]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.05, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.02, 0.005, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

export function Curtains({ position, width = 2.6, height = 2.4, color = '#B08968' }: {
  position: V3; width?: number; height?: number; color?: string;
}) {
  const dark = useMemo(() => `#${new THREE.Color(color).multiplyScalar(0.8).getHexString()}`, [color]);
  return (
    <group position={position}>
      {/* Rod */}
      <mesh position={[0, height / 2 + 0.12, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, width + 0.4, 6]} />
        <meshStandardMaterial color="#5A4A3A" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Panels — slightly wavy via stacked boxes */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (width / 2 - 0.18), 0, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, height, 0.06]} />
            <meshStandardMaterial color={color} roughness={0.95} />
          </mesh>
          <mesh position={[s * 0.14, 0, 0.03]}>
            <boxGeometry args={[0.14, height, 0.05]} />
            <meshStandardMaterial color={dark} roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Furniture & clutter ──────────────────────────────────────── */

export function Rug({ position, w = 3.5, d = 2.6, color = '#8B6B8B', border = '#6B4B6B' }: {
  position: V3; w?: number; d?: number; color?: string; border?: string;
}) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={border} roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow>
        <planeGeometry args={[w - 0.4, d - 0.4]} />
        <meshStandardMaterial color={color} roughness={0.98} />
      </mesh>
    </group>
  );
}

const BOOK_COLORS = ['#C0392B', '#2980B9', '#27AE60', '#8E44AD', '#E67E22', '#16A085', '#D4A843', '#7B3F5E'];

export function BookRow({ position, count = 5, rotation = [0, 0, 0] }: { position: V3; count?: number; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[i * 0.09 - (count * 0.09) / 2, 0.11, 0]} rotation={[0, 0, i % 3 === 2 ? 0.12 : 0]} castShadow>
          <boxGeometry args={[0.06, 0.22 + (i % 3) * 0.03, 0.16]} />
          <meshStandardMaterial color={BOOK_COLORS[i % BOOK_COLORS.length]} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export function Bookshelf({ position, rotation = [0, 0, 0], color = '#6B4226' }: { position: V3; rotation?: V3; color?: string }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.1, 2.2, 0.36]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {[0.45, 1.05, 1.65].map((y, r) => (
        <BookRow key={y} position={[0, y, 0.12]} count={5 - (r % 2)} />
      ))}
      {/* Small vase on top */}
      <mesh position={[0.3, 2.32, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.22, 8]} />
        <meshStandardMaterial color="#4A90C4" roughness={0.3} />
      </mesh>
    </group>
  );
}

export function FloorLamp({ position, shadeColor = '#F0E0C0', lightColor = '#FFE8B0' }: {
  position: V3; shadeColor?: string; lightColor?: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.06, 12]} />
        <meshStandardMaterial color="#3A3A3A" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.45, 6]} />
        <meshStandardMaterial color="#3A3A3A" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.26, 0.34, 12, 1, true]} />
        <meshStandardMaterial color={shadeColor} roughness={0.9} side={THREE.DoubleSide} emissive={lightColor} emissiveIntensity={0.35} />
      </mesh>
      <pointLight position={[0, 1.55, 0]} intensity={0.5} color={lightColor} distance={5} decay={2} />
    </group>
  );
}

export function SideTable({ position, color = '#7A5C44' }: { position: V3; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 10]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.44, 6]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Mug */}
      <mesh position={[0.08, 0.53, 0.05]} castShadow>
        <cylinderGeometry args={[0.05, 0.045, 0.09, 8]} />
        <meshStandardMaterial color="#C0392B" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function CeilingFixture({ position, warm = true }: { position: V3; warm?: boolean }) {
  const c = warm ? '#FFE8B0' : '#E8F2FF';
  return (
    <group position={position}>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.3, 0.36, 0.14, 14]} />
        <meshStandardMaterial color="#F5F0E5" emissive={c} emissiveIntensity={1.2} roughness={0.6} />
      </mesh>
      <pointLight position={[0, -0.5, 0]} intensity={0.7} color={c} distance={11} decay={2} />
    </group>
  );
}

/* ── Outdoor ──────────────────────────────────────────────────── */

export function Bush({ position, scale = 1, color = '#3A7A3A' }: { position: V3; scale?: number; color?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.38, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[0.28, 0.2, 0.1]} castShadow>
        <sphereGeometry args={[0.26, 7, 6]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[-0.26, 0.22, -0.06]} castShadow>
        <sphereGeometry args={[0.24, 7, 6]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
    </group>
  );
}

const FLOWER_COLORS = ['#E74C3C', '#F1C40F', '#9B59B6', '#E67E22', '#EC7063'];

export function FlowerBed({ position, w = 1.6, d = 0.7 }: { position: V3; w?: number; d?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[w, 0.12, d]} />
        <meshStandardMaterial color="#4A3220" roughness={1} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={i} position={[(i - 2) * (w / 5.4), 0.12, (i % 2 === 0 ? 0.12 : -0.12) * (d / 0.7)]}>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.18, 4]} />
            <meshStandardMaterial color="#2D6A2D" roughness={1} />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.055, 6, 5]} />
            <meshStandardMaterial color={FLOWER_COLORS[i % FLOWER_COLORS.length]} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
