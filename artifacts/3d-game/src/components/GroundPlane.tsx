import { useGameStore } from '@/store/gameStore';

interface GroundPlaneProps {
  size?: number;
}

export function GroundPlane({ size = 60 }: GroundPlaneProps) {
  const { setPlayerTarget } = useGameStore();

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.005, 0]}
      onPointerDown={(e) => {
        e.stopPropagation();
        setPlayerTarget([e.point.x, 0, e.point.z]);
      }}
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}
