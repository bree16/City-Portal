import { useEffect } from 'react';
import { setObstacles, clearObstacles } from '@/lib/obstacles';
import type { ObstacleCircle, WalkBounds } from '@/lib/obstacles';

interface SceneObstaclesProps {
  circles: ObstacleCircle[];
  bounds?: WalkBounds;
}

/** Registers a scene's obstacles + walkable bounds while mounted. */
export function SceneObstacles({ circles, bounds }: SceneObstaclesProps) {
  useEffect(() => {
    setObstacles(circles, bounds ?? null);
    return () => clearObstacles();
    // Scenes pass static literals; register once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
