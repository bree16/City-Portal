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

/**
 * Lightweight steering: if the player is heading toward an obstacle, return a
 * small perpendicular nudge so they flow around it instead of grinding into it.
 * Returns [dx, dz] to add to the intended step. Not full pathfinding — just a
 * gentle tangential push proportional to how head-on the approach is.
 */
export function steerAround(
  x: number,
  z: number,
  dirX: number,
  dirZ: number,
  step: number,
): [number, number] {
  let ndx = 0;
  let ndz = 0;
  const look = 1.2; // how far ahead we sense obstacles
  for (const o of obstacles) {
    const toX = o.x - x;
    const toZ = o.z - z;
    const along = toX * dirX + toZ * dirZ; // projection onto heading
    if (along <= 0 || along > o.r + look) continue; // behind us or too far
    // Perpendicular distance from the obstacle center to our heading ray.
    const perpX = toX - dirX * along;
    const perpZ = toZ - dirZ * along;
    const perpDist = Math.hypot(perpX, perpZ);
    const influence = o.r + 0.5;
    if (perpDist < influence) {
      // Steer away from the obstacle center, perpendicular to heading.
      // Tangent direction is the perpendicular pointing away from the center.
      let sx = -perpX;
      let sz = -perpZ;
      const len = Math.hypot(sx, sz) || 0.001;
      sx /= len;
      sz /= len;
      const strength = (1 - perpDist / influence) * (1 - along / (o.r + look));
      ndx += sx * strength * step * 1.4;
      ndz += sz * strength * step * 1.4;
    }
  }
  return [ndx, ndz];
}
