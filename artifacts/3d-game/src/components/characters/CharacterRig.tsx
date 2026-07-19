import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { HairstyleId, AccessoryId } from '@/store/gameStore';

interface CharacterRigProps {
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  eyeColor?: string;
  hairstyle?: HairstyleId;
  bodyScale?: number; // 0 = slimmer, 1 = broader
  accessories?: AccessoryId[];
  isMoving?: boolean;
  isIdle?: boolean;
  scale?: number;
  /** Optional emote for the character-creator preview. */
  emote?: 'none' | 'wave';
  /** Bigger, happier smile (creator preview). */
  bigSmile?: boolean;
  /** Deterministic phase offset (seconds) so multiple rigs don't idle in sync. */
  idlePhase?: number;
}

function shade(hex: string, mult: number): string {
  const c = new THREE.Color(hex).multiplyScalar(mult);
  return `#${c.getHexString()}`;
}

/* ── Hair ─────────────────────────────────────────────────────── */

const HEAD_Y = 1.58;

function HairMesh({ hairstyle, hairColor }: { hairstyle: HairstyleId; hairColor: string }) {
  const mat = <meshStandardMaterial color={hairColor} roughness={0.55} metalness={0} />;

  switch (hairstyle) {
    case 'short':
      return (
        <group>
          {/* Close crop hugging the skull */}
          <mesh position={[0, HEAD_Y + 0.015, -0.01]} castShadow>
            <sphereGeometry args={[0.222, 20, 14, 0, Math.PI * 2, 0, 1.75]} />
            {mat}
          </mesh>
          {/* Sideburns */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.195, HEAD_Y - 0.05, 0.03]} scale={[0.5, 1.4, 0.7]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              {mat}
            </mesh>
          ))}
        </group>
      );

    case 'locs':
      return (
        <group>
          <mesh position={[0, HEAD_Y + 0.03, -0.01]} castShadow>
            <sphereGeometry args={[0.228, 18, 12, 0, Math.PI * 2, 0, 1.8]} />
            {mat}
          </mesh>
          {/* Hanging locs around sides + back */}
          {[
            [-0.17, 0.06], [-0.1, -0.14], [0, -0.18], [0.1, -0.14], [0.17, 0.06],
            [-0.15, -0.1], [0.15, -0.1],
          ].map(([x, z], i) => (
            <mesh key={i} position={[x, HEAD_Y - 0.16, z]} rotation={[0, 0, x * -0.5]} castShadow>
              <capsuleGeometry args={[0.028, 0.2 + (i % 3) * 0.04, 4, 6]} />
              {mat}
            </mesh>
          ))}
        </group>
      );

    case 'curly':
      return (
        <group>
          <mesh position={[0, HEAD_Y + 0.05, -0.01]} castShadow>
            <sphereGeometry args={[0.25, 18, 14, 0, Math.PI * 2, 0, 2.0]} />
            {mat}
          </mesh>
          {/* Poofy curl clusters */}
          {[
            [-0.15, 0.16, 0.09], [0.15, 0.16, 0.09], [0, 0.22, 0.02],
            [-0.18, 0.08, -0.1], [0.18, 0.08, -0.1], [0, 0.14, -0.17],
            [-0.08, 0.22, -0.08], [0.08, 0.22, -0.08],
          ].map(([x, y, z], i) => (
            <mesh key={i} position={[x, HEAD_Y + y, z]} castShadow>
              <sphereGeometry args={[0.085, 10, 8]} />
              {mat}
            </mesh>
          ))}
        </group>
      );

    case 'ponytail':
      return (
        <group>
          <mesh position={[0, HEAD_Y + 0.02, -0.01]} castShadow>
            <sphereGeometry args={[0.226, 20, 14, 0, Math.PI * 2, 0, 1.9]} />
            {mat}
          </mesh>
          {/* Swept-back volume */}
          <mesh position={[0, HEAD_Y + 0.06, -0.12]} scale={[0.9, 0.8, 0.8]} castShadow>
            <sphereGeometry args={[0.2, 14, 10]} />
            {mat}
          </mesh>
          {/* Holder band */}
          <mesh position={[0, HEAD_Y + 0.08, -0.21]} rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[0.05, 0.016, 6, 12]} />
            <meshStandardMaterial color="#333" roughness={0.9} />
          </mesh>
          {/* Tail — two curved segments */}
          <mesh position={[0, HEAD_Y - 0.04, -0.27]} rotation={[-0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
            {mat}
          </mesh>
          <mesh position={[0, HEAD_Y - 0.22, -0.31]} rotation={[-0.15, 0, 0]} castShadow>
            <capsuleGeometry args={[0.04, 0.18, 4, 8]} />
            {mat}
          </mesh>
        </group>
      );

    case 'fade':
      return (
        <group>
          {/* Flat-top volume */}
          <mesh position={[0, HEAD_Y + 0.14, -0.01]} scale={[0.92, 0.6, 0.92]} castShadow>
            <sphereGeometry args={[0.215, 18, 12]} />
            {mat}
          </mesh>
          {/* Faded sides — thin, darker band */}
          <mesh position={[0, HEAD_Y + 0.04, -0.01]} scale={[1.01, 0.5, 1.01]}>
            <sphereGeometry args={[0.215, 18, 10, 0, Math.PI * 2, 0, 1.6]} />
            <meshStandardMaterial color={shade('#888888', 0.6)} roughness={0.8} transparent opacity={0.35} />
          </mesh>
        </group>
      );

    case 'medium':
    default:
      return (
        <group>
          <mesh position={[0, HEAD_Y + 0.03, -0.01]} castShadow>
            <sphereGeometry args={[0.235, 20, 14, 0, Math.PI * 2, 0, 2.0]} />
            {mat}
          </mesh>
          {/* Side sweep framing the face */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.185, HEAD_Y - 0.06, 0.02]} scale={[0.55, 1.6, 0.85]} castShadow>
              <sphereGeometry args={[0.06, 8, 8]} />
              {mat}
            </mesh>
          ))}
          {/* Back volume */}
          <mesh position={[0, HEAD_Y - 0.06, -0.14]} scale={[0.95, 1.1, 0.65]} castShadow>
            <sphereGeometry args={[0.16, 12, 10]} />
            {mat}
          </mesh>
        </group>
      );
  }
}

/* ── Accessories ──────────────────────────────────────────────── */

function AccessoryMeshes({ accessories, hairColor }: { accessories: AccessoryId[]; hairColor: string }) {
  return (
    <>
      {accessories.includes('glasses') && (
        <group position={[0, HEAD_Y + 0.02, 0.185]}>
          {[-0.072, 0.072].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <torusGeometry args={[0.046, 0.008, 6, 14]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
            </mesh>
          ))}
          <mesh>
            <boxGeometry args={[0.056, 0.007, 0.007]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.13, 0, -0.05]} rotation={[0, s * -0.35, 0]}>
              <boxGeometry args={[0.05, 0.006, 0.006]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {accessories.includes('earrings') && (
        <>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.205, HEAD_Y - 0.045, 0.01]}>
              <sphereGeometry args={[0.016, 6, 6]} />
              <meshStandardMaterial color="#D4A843" roughness={0.1} metalness={0.9} />
            </mesh>
          ))}
        </>
      )}

      {accessories.includes('hat') && (
        <group position={[0, HEAD_Y + 0.19, 0]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <sphereGeometry args={[0.21, 16, 10, 0, Math.PI * 2, 0, 1.5]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} />
          </mesh>
          {/* Curved cap brim */}
          <mesh position={[0, 0.01, 0.2]} rotation={[-0.15, 0, 0]} scale={[1, 0.25, 1]} castShadow>
            <sphereGeometry args={[0.16, 12, 8]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} />
          </mesh>
        </group>
      )}
    </>
  );
}

/* ── Rig ──────────────────────────────────────────────────────── */

export function CharacterRig({
  skinTone,
  hairColor,
  shirtColor,
  pantsColor,
  eyeColor = '#5B3A29',
  hairstyle = 'medium',
  bodyScale = 0.5,
  accessories = [],
  isMoving = false,
  isIdle = true,
  scale = 1,
  emote = 'none',
  bigSmile = false,
  idlePhase = 0,
}: CharacterRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftShinRef = useRef<THREE.Group>(null);
  const rightShinRef = useRef<THREE.Group>(null);

  // bodyScale 0 = slim, 1 = broad
  const wm = 0.85 + bodyScale * 0.3;

  const skinMat = useMemo(() => ({ color: skinTone, roughness: 0.65, metalness: 0 }), [skinTone]);
  const shirtDark = useMemo(() => shade(shirtColor, 0.72), [shirtColor]);
  const pantsDark = useMemo(() => shade(pantsColor, 0.7), [pantsColor]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + idlePhase;

    if (isMoving) {
      const w = t * 8.5;
      const swing = Math.sin(w);
      // Arms: swing from shoulder + subtle elbow bend on the back swing
      if (leftArmRef.current) leftArmRef.current.rotation.x = swing * 0.65;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing * 0.65;
      if (leftForearmRef.current) leftForearmRef.current.rotation.x = -0.35 - Math.max(0, swing) * 0.4;
      if (rightForearmRef.current) rightForearmRef.current.rotation.x = -0.35 - Math.max(0, -swing) * 0.4;
      // Legs: swing from hip + knee flexion only when the leg trails
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * 0.55;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing * 0.55;
      if (leftShinRef.current) leftShinRef.current.rotation.x = Math.max(0, swing) * 0.85;
      if (rightShinRef.current) rightShinRef.current.rotation.x = Math.max(0, -swing) * 0.85;
      // Bounce + forward lean
      if (bodyGroupRef.current) {
        bodyGroupRef.current.position.y = Math.abs(Math.sin(w)) * 0.045;
        bodyGroupRef.current.rotation.x = 0.06;
        bodyGroupRef.current.rotation.z = Math.sin(w) * 0.02;
      }
      if (headRef.current) {
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = 0;
      }
    } else if (isIdle) {
      // Breathing
      if (chestRef.current) {
        const b = 1 + Math.sin(t * 1.8) * 0.015;
        chestRef.current.scale.set(wm * 1.12 * b, 1, 0.8 * b);
      }
      // Gentle weight shift (never dips below neutral — keeps feet grounded)
      if (bodyGroupRef.current) {
        bodyGroupRef.current.position.y = (Math.sin(t * 1.8) + 1) * 0.006;
        bodyGroupRef.current.rotation.x = 0;
        bodyGroupRef.current.rotation.z = Math.sin(t * 0.6) * 0.02;
      }
      if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.04;
      // Look around occasionally
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.35) * 0.22 * Math.max(0, Math.sin(t * 0.11) * 2 - 1);
        headRef.current.rotation.x = Math.sin(t * 0.9) * 0.02;
      }
      // Relaxed arms
      if (emote === 'wave' && rightArmRef.current && rightForearmRef.current) {
        rightArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.z = -2.2;
        rightForearmRef.current.rotation.x = 0;
        rightForearmRef.current.rotation.z = Math.sin(t * 7) * 0.45;
      } else {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.sin(t * 0.8 + 1) * 0.03;
          rightArmRef.current.rotation.z = -0.08 - Math.sin(t * 0.8) * 0.02;
        }
        if (rightForearmRef.current) {
          rightForearmRef.current.rotation.x = -0.12;
          rightForearmRef.current.rotation.z = 0;
        }
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(t * 0.8) * 0.03;
        leftArmRef.current.rotation.z = 0.08 + Math.sin(t * 0.8) * 0.02;
      }
      if (leftForearmRef.current) leftForearmRef.current.rotation.x = -0.12;
      // Legs at rest
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftShinRef.current) leftShinRef.current.rotation.x = 0;
      if (rightShinRef.current) rightShinRef.current.rotation.x = 0;
    }
  });

  const shoulderX = 0.235 * wm + 0.035;
  const hipX = 0.105 * wm;

  return (
    <group ref={groupRef} scale={scale}>
      <group ref={bodyGroupRef}>
        {/* ── HEAD ── */}
        <group ref={headRef} position={[0, HEAD_Y, 0]}>
          <group position={[0, -HEAD_Y, 0]}>
            {/* Skull — soft oval */}
            <mesh position={[0, HEAD_Y, 0]} scale={[0.95, 1.08, 0.98]} castShadow>
              <sphereGeometry args={[0.21, 24, 20]} />
              <meshStandardMaterial {...skinMat} />
            </mesh>
            {/* Jaw / chin */}
            <mesh position={[0, HEAD_Y - 0.13, 0.05]} scale={[0.8, 0.6, 0.75]}>
              <sphereGeometry args={[0.15, 16, 12]} />
              <meshStandardMaterial {...skinMat} />
            </mesh>
            {/* Ears */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.198, HEAD_Y + 0.005, 0]} scale={[0.45, 1, 0.7]}>
                <sphereGeometry args={[0.045, 8, 8]} />
                <meshStandardMaterial {...skinMat} />
              </mesh>
            ))}
            {/* Nose */}
            <mesh position={[0, HEAD_Y - 0.03, 0.205]} scale={[0.7, 1, 0.9]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshStandardMaterial {...skinMat} />
            </mesh>
            {/* Brows */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.073, HEAD_Y + 0.085, 0.183]} rotation={[0, 0, s * -0.12]}>
                <boxGeometry args={[0.072, 0.013, 0.018]} />
                <meshStandardMaterial color={hairColor} roughness={0.8} />
              </mesh>
            ))}
            {/* Eyes — almond whites + iris + pupil + highlight */}
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.072, HEAD_Y + 0.025, 0.172]}>
                <mesh scale={[1, 1.25, 0.55]}>
                  <sphereGeometry args={[0.036, 12, 10]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.35} />
                </mesh>
                <mesh position={[0, 0, 0.017]} scale={[1, 1.2, 0.5]}>
                  <sphereGeometry args={[0.023, 10, 8]} />
                  <meshStandardMaterial color={eyeColor} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0.028]} scale={[1, 1, 0.5]}>
                  <sphereGeometry args={[0.011, 8, 6]} />
                  <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
                </mesh>
                <mesh position={[0.008, 0.01, 0.033]}>
                  <sphereGeometry args={[0.004, 6, 6]} />
                  <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.6} />
                </mesh>
              </group>
            ))}
            {/* Smile — curved arc */}
            <mesh
              position={[0, HEAD_Y - 0.085, 0.178]}
              rotation={[0.25, 0, Math.PI]}
              scale={bigSmile ? [1.35, 1.35, 1] : [1, 1, 1]}
            >
              <torusGeometry args={[0.045, 0.011, 6, 14, Math.PI]} />
              <meshStandardMaterial color="#B0574A" roughness={0.7} />
            </mesh>
            {/* Blush hints */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.115, HEAD_Y - 0.045, 0.155]} scale={[1, 0.7, 0.4]}>
                <sphereGeometry args={[0.028, 8, 6]} />
                <meshStandardMaterial color={shade(skinTone, 0.92)} roughness={0.9} transparent opacity={0.5} />
              </mesh>
            ))}
            {/* Hair + accessories move with the head */}
            <HairMesh hairstyle={hairstyle} hairColor={hairColor} />
            <AccessoryMeshes accessories={accessories} hairColor={hairColor} />
          </group>
        </group>

        {/* Neck */}
        <mesh position={[0, 1.36, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.065, 0.1, 12]} />
          <meshStandardMaterial {...skinMat} />
        </mesh>

        {/* ── TORSO (layered shirt) ── */}
        {/* Chest — tapered */}
        <mesh ref={chestRef} position={[0, 1.14, 0]} scale={[wm * 1.12, 1, 0.8]} castShadow>
          <capsuleGeometry args={[0.185, 0.22, 8, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.85} />
        </mesh>
        {/* Shoulders */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.21 * wm, 1.3, 0]} castShadow>
            <sphereGeometry args={[0.085 * wm, 12, 10]} />
            <meshStandardMaterial color={shirtColor} roughness={0.85} />
          </mesh>
        ))}
        {/* Collar */}
        <mesh position={[0, 1.335, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.075, 0.02, 8, 16]} />
          <meshStandardMaterial color={shirtDark} roughness={0.85} />
        </mesh>
        {/* Waist / shirt hem */}
        <mesh position={[0, 0.94, 0]} scale={[wm * 1.05, 0.55, 0.75]} castShadow>
          <sphereGeometry args={[0.185, 16, 12]} />
          <meshStandardMaterial color={shirtDark} roughness={0.85} />
        </mesh>

        {/* ── HIPS ── */}
        <mesh position={[0, 0.84, 0]} scale={[wm * 1.08, 0.68, 0.8]} castShadow>
          <sphereGeometry args={[0.18, 16, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.9} />
        </mesh>
        {/* Belt */}
        <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.155 * wm, 0.018, 6, 18]} />
          <meshStandardMaterial color={pantsDark} roughness={0.7} />
        </mesh>

        {/* ── ARMS (shoulder → elbow → forearm → hand) ── */}
        {([-1, 1] as const).map((s) => {
          const armRef = s === -1 ? leftArmRef : rightArmRef;
          const foreRef = s === -1 ? leftForearmRef : rightForearmRef;
          return (
            <group key={`arm${s}`} ref={armRef} position={[s * shoulderX, 1.28, 0]}>
              {/* Upper arm — short sleeve */}
              <mesh position={[0, -0.11, 0]} castShadow>
                <capsuleGeometry args={[0.058, 0.14, 6, 12]} />
                <meshStandardMaterial color={shirtColor} roughness={0.85} />
              </mesh>
              {/* Sleeve cuff */}
              <mesh position={[0, -0.19, 0]}>
                <cylinderGeometry args={[0.06, 0.055, 0.03, 10]} />
                <meshStandardMaterial color={shirtDark} roughness={0.85} />
              </mesh>
              {/* Forearm group pivots at the elbow */}
              <group ref={foreRef} position={[0, -0.24, 0]}>
                <mesh position={[0, -0.1, 0]} castShadow>
                  <capsuleGeometry args={[0.047, 0.14, 6, 12]} />
                  <meshStandardMaterial {...skinMat} />
                </mesh>
                {/* Hand — flattened sphere + thumb */}
                <mesh position={[0, -0.225, 0.005]} scale={[0.85, 1.15, 0.55]} castShadow>
                  <sphereGeometry args={[0.055, 10, 8]} />
                  <meshStandardMaterial {...skinMat} />
                </mesh>
                <mesh position={[s * -0.035, -0.2, 0.03]} scale={[0.7, 1, 0.7]}>
                  <sphereGeometry args={[0.022, 6, 6]} />
                  <meshStandardMaterial {...skinMat} />
                </mesh>
              </group>
            </group>
          );
        })}

        {/* ── LEGS (hip → knee → shin → foot) ── */}
        {([-1, 1] as const).map((s) => {
          const legRef = s === -1 ? leftLegRef : rightLegRef;
          const shinRef = s === -1 ? leftShinRef : rightShinRef;
          return (
            <group key={`leg${s}`} ref={legRef} position={[s * hipX, 0.82, 0]}>
              {/* Thigh */}
              <mesh position={[0, -0.17, 0]} castShadow>
                <capsuleGeometry args={[0.078 * wm, 0.2, 6, 12]} />
                <meshStandardMaterial color={pantsColor} roughness={0.9} />
              </mesh>
              {/* Shin group pivots at the knee */}
              <group ref={shinRef} position={[0, -0.37, 0]}>
                <mesh position={[0, -0.14, 0]} castShadow>
                  <capsuleGeometry args={[0.062 * wm, 0.18, 6, 12]} />
                  <meshStandardMaterial color={pantsColor} roughness={0.9} />
                </mesh>
                {/* Pant cuff */}
                <mesh position={[0, -0.28, 0]}>
                  <cylinderGeometry args={[0.068 * wm, 0.064 * wm, 0.035, 10]} />
                  <meshStandardMaterial color={pantsDark} roughness={0.9} />
                </mesh>
                {/* Shoe — rounded with toe + sole */}
                <mesh position={[0, -0.385, 0.035]} scale={[1, 0.65, 1.5]} castShadow>
                  <sphereGeometry args={[0.075, 12, 10]} />
                  <meshStandardMaterial color="#2a1a0a" roughness={0.35} metalness={0.1} />
                </mesh>
                <mesh position={[0, -0.425, 0.03]} scale={[1.05, 0.25, 1.55]}>
                  <sphereGeometry args={[0.075, 10, 8]} />
                  <meshStandardMaterial color="#f0ede4" roughness={0.6} />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
}
