// Lightweight scene obstacle registry used by the player movement controller.
// Scenes register circle obstacles + walkable bounds on mount (see <SceneObstacles />).

export type ObstacleCircle = { x: number; z: number; r: number };
export type WalkBounds = { minX: number; maxX: number; minZ: number; maxZ: number };

let obstacles: ObstacleCircle[] = [];
let bounds: WalkBounds | null = null;

export function setObstacles(list: ObstacleCircle[], walkBounds?: WalkBounds | null) {
  obstacles = list;
  bounds = walkBounds ?? null;
}

export function clearObstacles() {
  obstacles = [];
  bounds = null;
}

/** Clamp a point to walkable bounds (if any). */
export function clampToBounds(x: number, z: number): [number, number] {
  if (!bounds) return [x, z];
  return [
    Math.min(bounds.maxX, Math.max(bounds.minX, x)),
    Math.min(bounds.maxZ, Math.max(bounds.minZ, z)),
  ];
}

/** Push a point out of any obstacle circles it is inside. */
export function resolveCollisions(x: number, z: number, pad = 0.25): [number, number] {
  let px = x;
  let pz = z;
  for (let iter = 0; iter < 3; iter++) {
    let moved = false;
    for (const o of obstacles) {
      const dx = px - o.x;
      const dz = pz - o.z;
      const rr = o.r + pad;
      const distSq = dx * dx + dz * dz;
      if (distSq < rr * rr) {
        const dist = Math.sqrt(distSq) || 0.001;
        px = o.x + (dx / dist) * rr;
        pz = o.z + (dz / dist) * rr;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return clampToBounds(px, pz);
}

/** Resolve a click point into the nearest legal walk target. */
export function resolveWalkTarget(x: number, z: number): [number, number] {
  return resolveCollisions(x, z, 0.3);
}
