import { Html } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import { CharacterRig } from './CharacterRig';

export type NPCDef = {
  id: string;
  name: string;
  role: string;
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  position: [number, number, number];
  rotation?: [number, number, number];
};

interface NPCCharacterProps {
  npc: NPCDef;
  onClick?: () => void;
}

export function NPCCharacter({ npc, onClick }: NPCCharacterProps) {
  const { activeDialogue } = useGameStore();
  const isActive = activeDialogue?.npcId === npc.id;

  return (
    <group position={npc.position} rotation={npc.rotation ?? [0, 0, 0]}>
      <CharacterRig
        skinTone={npc.skinTone}
        hairColor={npc.hairColor}
        shirtColor={npc.shirtColor}
        pantsColor={npc.pantsColor}
        isIdle={true}
      />

      {/* Invisible click hitbox */}
      <mesh
        position={[0, 0.9, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <boxGeometry args={[0.6, 1.8, 0.5]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      {/* Name label above head */}
      <Html
        position={[0, 2.2, 0]}
        center
        distanceFactor={8}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            background: isActive ? '#D4A843' : '#0D2B5E',
            color: '#fff',
            padding: '3px 10px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            border: isActive ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onClick={() => onClick?.()}
        >
          {npc.name}
        </div>
      </Html>
    </group>
  );
}
