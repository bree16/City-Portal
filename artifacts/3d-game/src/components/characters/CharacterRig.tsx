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
  emote?: 'none' | 'wave' | 'look';
  /** Bigger, happier smile (creator preview). */
  bigSmile?: boolean;
  /** Force the character to look around (creator preview). */
  lookAround?: boolean;
  /** Deterministic phase offset (seconds) so multiple rigs don't idle in sync. */
  idlePhase?: number;
}

function shade(hex: string, mult: number): string {
  const c = new THREE.Color(hex).multiplyScalar(mult);
  return `#${c.getHexString()}`;
}

/* ── Hair ─────────────────────────────────────────────────────── */

const HAIR_Y = 0; // Local origin of head

function HairMesh({ hairstyle, hairColor }: { hairstyle: HairstyleId; hairColor: string }) {
  const mat = <meshStandardMaterial color={hairColor} roughness={0.7} metalness={0} />;

  switch (hairstyle) {
    case 'short':
      return (
        <group>
          {/* Close crop hugging the skull */}
          <mesh position={[0, HAIR_Y + 0.015, -0.01]} castShadow>
            <sphereGeometry args={[0.222, 20, 14, 0, Math.PI * 2, 0, 1.75]} />
            {mat}
          </mesh>
          {/* Sideburns */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.195, HAIR_Y - 0.05, 0.03]} scale={[0.5, 1.4, 0.7]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              {mat}
            </mesh>
          ))}
        </group>
      );

    case 'locs':
      return (
        <group>
          <mesh position={[0, HAIR_Y + 0.03, -0.01]} castShadow>
            <sphereGeometry args={[0.228, 18, 12, 0, Math.PI * 2, 0, 1.8]} />
            {mat}
          </mesh>
          {/* Hanging locs around sides + back */}
          {[
            [-0.17, 0.06], [-0.1, -0.14], [0, -0.18], [0.1, -0.14], [0.17, 0.06],
            [-0.15, -0.1], [0.15, -0.1],
          ].map(([x, z], i) => (
            <mesh key={i} position={[x, HAIR_Y - 0.16, z]} rotation={[0, 0, x * -0.5]} castShadow>
              <capsuleGeometry args={[0.028, 0.2 + (i % 3) * 0.04, 4, 6]} />
              {mat}
            </mesh>
          ))}
        </group>
      );

    case 'curly':
      return (
        <group>
          <mesh position={[0, HAIR_Y + 0.05, -0.01]} castShadow>
            <sphereGeometry args={[0.25, 18, 14, 0, Math.PI * 2, 0, 2.0]} />
            {mat}
          </mesh>
          {/* Poofy curl clusters */}
          {[
            [-0.15, 0.16, 0.09], [0.15, 0.16, 0.09], [0, 0.22, 0.02],
            [-0.18, 0.08, -0.1], [0.18, 0.08, -0.1], [0, 0.14, -0.17],
            [-0.08, 0.22, -0.08], [0.08, 0.22, -0.08],
          ].map(([x, y, z], i) => (
            <mesh key={i} position={[x, HAIR_Y + y, z]} castShadow>
              <sphereGeometry args={[0.085, 10, 8]} />
              {mat}
            </mesh>
          ))}
        </group>
      );

    case 'ponytail':
      return (
        <group>
          <mesh position={[0, HAIR_Y + 0.02, -0.01]} castShadow>
            <sphereGeometry args={[0.226, 20, 14, 0, Math.PI * 2, 0, 1.9]} />
            {mat}
          </mesh>
          {/* Swept-back volume */}
          <mesh position={[0, HAIR_Y + 0.06, -0.12]} scale={[0.9, 0.8, 0.8]} castShadow>
            <sphereGeometry args={[0.2, 14, 10]} />
            {mat}
          </mesh>
          {/* Holder band */}
          <mesh position={[0, HAIR_Y + 0.08, -0.21]} rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[0.05, 0.016, 6, 12]} />
            <meshStandardMaterial color="#333" roughness={0.9} />
          </mesh>
          {/* Tail — two curved segments */}
          <mesh position={[0, HAIR_Y - 0.04, -0.27]} rotation={[-0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
            {mat}
          </mesh>
          <mesh position={[0, HAIR_Y - 0.22, -0.31]} rotation={[-0.15, 0, 0]} castShadow>
            <capsuleGeometry args={[0.04, 0.18, 4, 8]} />
            {mat}
          </mesh>
        </group>
      );

    case 'fade':
      return (
        <group>
          {/* Flat-top volume */}
          <mesh position={[0, HAIR_Y + 0.14, -0.01]} scale={[0.92, 0.6, 0.92]} castShadow>
            <sphereGeometry args={[0.215, 18, 12]} />
            {mat}
          </mesh>
          {/* Faded sides — thin, darker band */}
          <mesh position={[0, HAIR_Y + 0.04, -0.01]} scale={[1.01, 0.5, 1.01]}>
            <sphereGeometry args={[0.215, 18, 10, 0, Math.PI * 2, 0, 1.6]} />
            <meshStandardMaterial color={shade('#888888', 0.6)} roughness={0.8} transparent opacity={0.35} />
          </mesh>
        </group>
      );

    case 'medium':
    default:
      return (
        <group>
          <mesh position={[0, HAIR_Y + 0.03, -0.01]} castShadow>
            <sphereGeometry args={[0.235, 20, 14, 0, Math.PI * 2, 0, 2.0]} />
            {mat}
          </mesh>
          {/* Side sweep framing the face */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.185, HAIR_Y - 0.06, 0.02]} scale={[0.55, 1.6, 0.85]} castShadow>
              <sphereGeometry args={[0.06, 8, 8]} />
              {mat}
            </mesh>
          ))}
          {/* Back volume */}
          <mesh position={[0, HAIR_Y - 0.06, -0.14]} scale={[0.95, 1.1, 0.65]} castShadow>
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
        <group position={[0, HAIR_Y + 0.025, 0.19]}>
          {[-0.072, 0.072].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <torusGeometry args={[0.044, 0.008, 8, 20]} />
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
            <mesh key={s} position={[s * 0.205, HAIR_Y - 0.045, 0.01]}>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshStandardMaterial color="#D4A843" roughness={0.1} metalness={0.9} />
            </mesh>
          ))}
        </>
      )}

      {accessories.includes('hat') && (
        <group position={[0, HAIR_Y + 0.19, 0]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <sphereGeometry args={[0.21, 16, 12, 0, Math.PI * 2, 0, 1.5]} />
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
  lookAround = false,
  idlePhase = 0,
}: CharacterRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const eyesGroupRef = useRef<THREE.Group>(null);
  
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

  const skinMat = useMemo(() => ({ color: skinTone, roughness: 0.45, metalness: 0.1 }), [skinTone]);
  const shirtDark = useMemo(() => shade(shirtColor, 0.72), [shirtColor]);
  const pantsDark = useMemo(() => shade(pantsColor, 0.7), [pantsColor]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + idlePhase;

    // Eye blinking
    if (eyesGroupRef.current) {
      const blinkPhase = t % 4.5;
      const isBlinking = blinkPhase < 0.12;
      eyesGroupRef.current.scale.y = THREE.MathUtils.lerp(
        eyesGroupRef.current.scale.y,
        isBlinking ? 0.05 : 1,
        0.4
      );
    }

    if (isMoving) {
      const w = t * 8.5;
      const swing = Math.sin(w);
      // Arms swing
      if (leftArmRef.current) leftArmRef.current.rotation.x = swing * 0.75;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing * 0.75;
      if (leftForearmRef.current) leftForearmRef.current.rotation.x = -0.15 - Math.max(0, swing) * 0.55;
      if (rightForearmRef.current) rightForearmRef.current.rotation.x = -0.15 - Math.max(0, -swing) * 0.55;
      
      // Legs swing
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * 0.65;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing * 0.65;
      if (leftShinRef.current) leftShinRef.current.rotation.x = Math.max(0, swing) * 0.9;
      if (rightShinRef.current) rightShinRef.current.rotation.x = Math.max(0, -swing) * 0.9;
      
      // Bounce and lean
      if (bodyGroupRef.current) {
        bodyGroupRef.current.position.y = Math.abs(Math.sin(w)) * 0.04;
        bodyGroupRef.current.rotation.x = 0.06;
        bodyGroupRef.current.rotation.z = Math.sin(w) * 0.02;
      }
      if (headRef.current) {
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = 0;
      }
    } else if (isIdle) {
      // Breathing & idle weight shift
      const b = 1 + Math.sin(t * 1.8) * 0.015;
      if (chestRef.current) {
        chestRef.current.scale.set(1, b, 1);
      }
      
      if (bodyGroupRef.current) {
        bodyGroupRef.current.position.y = (Math.sin(t * 1.8) + 1) * 0.006;
        bodyGroupRef.current.rotation.x = 0;
        bodyGroupRef.current.rotation.z = Math.sin(t * 0.6) * 0.015;
      }
      if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.03;

      // Emotes and Arm state
      if (emote === 'wave' && rightArmRef.current && rightForearmRef.current) {
        rightArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.z = -2.2;
        rightForearmRef.current.rotation.x = 0;
        rightForearmRef.current.rotation.z = Math.sin(t * 8) * 0.5;
      } else {
        // Natural relaxed arms
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.sin(t * 0.8 + 1) * 0.03;
          rightArmRef.current.rotation.z = -0.08 - Math.sin(t * 0.8) * 0.02;
        }
        if (rightForearmRef.current) {
          rightForearmRef.current.rotation.x = -0.15;
          rightForearmRef.current.rotation.z = 0;
        }
      }
      
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(t * 0.8) * 0.03;
        leftArmRef.current.rotation.z = 0.08 + Math.sin(t * 0.8) * 0.02;
      }
      if (leftForearmRef.current) leftForearmRef.current.rotation.x = -0.15;

      // Head looking
      if (headRef.current) {
        if (lookAround || emote === 'look') {
          headRef.current.rotation.y = Math.sin(t * 2) * 0.45;
          headRef.current.rotation.x = 0;
        } else {
          headRef.current.rotation.y = Math.sin(t * 0.35) * 0.22 * Math.max(0, Math.sin(t * 0.11) * 2 - 1);
          headRef.current.rotation.x = Math.sin(t * 0.9) * 0.02;
        }
      }

      // Rest legs
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftShinRef.current) leftShinRef.current.rotation.x = 0;
      if (rightShinRef.current) rightShinRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <group ref={bodyGroupRef}>
        {/* HIPS (Root for lower body & upper body pivot) at Y=0.9 */}
        <group position={[0, 0.9, 0]}>
          
          {/* Pelvis */}
          <mesh castShadow>
            <capsuleGeometry args={[0.11 * wm, 0.08, 8, 16]} />
            <meshStandardMaterial color={pantsColor} roughness={0.9} />
          </mesh>
          
          {/* Belt/Hem */}
          <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.115 * wm, 0.018, 8, 16]} />
            <meshStandardMaterial color={shirtDark} roughness={0.8} />
          </mesh>

          {/* CHEST (Pivots from waist) */}
          <group position={[0, 0.15, 0]}>
            
            <mesh ref={chestRef} position={[0, 0.20, 0]} castShadow>
              <cylinderGeometry args={[0.14 * wm, 0.11 * wm, 0.40, 16]} />
              <meshStandardMaterial color={shirtColor} roughness={0.85} />
            </mesh>

            {/* Neck */}
            <mesh position={[0, 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.08, 12]} />
              <meshStandardMaterial {...skinMat} />
            </mesh>
            
            {/* HEAD */}
            <group ref={headRef} position={[0, 0.48, 0]}>
              {/* Skull */}
              <mesh scale={[0.95, 1.05, 0.95]} castShadow>
                <sphereGeometry args={[0.21, 24, 20]} />
                <meshStandardMaterial {...skinMat} />
              </mesh>
              {/* Jaw / Chin */}
              <mesh position={[0, -0.13, 0.05]} scale={[0.8, 0.6, 0.75]}>
                <sphereGeometry args={[0.15, 16, 12]} />
                <meshStandardMaterial {...skinMat} />
              </mesh>
              {/* Ears */}
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.198, 0.005, 0]} scale={[0.45, 1, 0.7]} rotation={[0, s * 0.15, 0]}>
                  <sphereGeometry args={[0.045, 12, 10]} />
                  <meshStandardMaterial {...skinMat} />
                </mesh>
              ))}
              {/* Nose */}
              <mesh position={[0, -0.03, 0.205]} scale={[0.7, 1, 0.9]}>
                <sphereGeometry args={[0.028, 12, 10]} />
                <meshStandardMaterial {...skinMat} />
              </mesh>
              {/* Brows */}
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.073, 0.085, 0.183]} rotation={[0, 0, s * -0.12]}>
                  <boxGeometry args={[0.072, 0.013, 0.018]} />
                  <meshStandardMaterial color={hairColor} roughness={0.8} />
                </mesh>
              ))}
              
              {/* Eyes */}
              <group ref={eyesGroupRef}>
                {[-1, 1].map((s) => (
                  <group key={s} position={[s * 0.072, 0.025, 0.172]}>
                    <mesh scale={[1, 1.25, 0.55]}>
                      <sphereGeometry args={[0.032, 12, 10]} />
                      <meshStandardMaterial color="#ffffff" roughness={0.35} />
                    </mesh>
                    <mesh position={[0, 0, 0.015]} scale={[1, 1.2, 0.5]}>
                      <sphereGeometry args={[0.02, 10, 8]} />
                      <meshStandardMaterial color={eyeColor} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0.024]} scale={[1, 1, 0.5]}>
                      <sphereGeometry args={[0.01, 8, 6]} />
                      <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
                    </mesh>
                    <mesh position={[s * 0.006, 0.008, 0.029]}>
                      <sphereGeometry args={[0.004, 6, 6]} />
                      <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.6} />
                    </mesh>
                  </group>
                ))}
              </group>

              {/* Mouth */}
              {bigSmile ? (
                <mesh position={[0, -0.08, 0.18]} rotation={[0.2, 0, Math.PI]}>
                  <torusGeometry args={[0.045, 0.015, 8, 16, Math.PI]} />
                  <meshStandardMaterial color="#B0574A" roughness={0.7} />
                </mesh>
              ) : (
                <mesh position={[0, -0.09, 0.185]} rotation={[0.1, 0, Math.PI]}>
                  <torusGeometry args={[0.035, 0.006, 6, 12, Math.PI * 0.8]} />
                  <meshStandardMaterial color="#B0574A" roughness={0.7} />
                </mesh>
              )}

              {/* Blush */}
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.115, -0.045, 0.155]} scale={[1, 0.7, 0.4]}>
                  <sphereGeometry args={[0.028, 8, 6]} />
                  <meshStandardMaterial color={shade(skinTone, 0.92)} roughness={0.9} transparent opacity={0.5} />
                </mesh>
              ))}

              <HairMesh hairstyle={hairstyle} hairColor={hairColor} />
              <AccessoryMeshes accessories={accessories} hairColor={hairColor} />
            </group>

            {/* ARMS */}
            {([-1, 1] as const).map((s) => (
              <group key={`arm${s}`} ref={s === -1 ? leftArmRef : rightArmRef} position={[s * (0.16 * wm + 0.03), 0.38, 0]}>
                {/* Shoulder joint */}
                <mesh castShadow>
                  <sphereGeometry args={[0.06, 12, 12]} />
                  <meshStandardMaterial color={shirtColor} roughness={0.85} />
                </mesh>
                
                {/* Upper Arm (Shirt sleeve) */}
                <mesh position={[0, -0.13, 0]} castShadow>
                  <cylinderGeometry args={[0.055, 0.045, 0.26, 12]} />
                  <meshStandardMaterial color={shirtColor} roughness={0.85} />
                </mesh>
                {/* Sleeve Cuff */}
                <mesh position={[0, -0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.046, 0.012, 8, 12]} />
                  <meshStandardMaterial color={shirtDark} roughness={0.85} />
                </mesh>

                {/* Forearm Group (Pivots at elbow) */}
                <group ref={s === -1 ? leftForearmRef : rightForearmRef} position={[0, -0.26, 0]}>
                  {/* Elbow joint */}
                  <mesh castShadow>
                    <sphereGeometry args={[0.04, 12, 10]} />
                    <meshStandardMaterial {...skinMat} />
                  </mesh>
                  {/* Lower Arm */}
                  <mesh position={[0, -0.13, 0]} castShadow>
                    <cylinderGeometry args={[0.04, 0.03, 0.26, 12]} />
                    <meshStandardMaterial {...skinMat} />
                  </mesh>

                  {/* Hand (Mitten + Thumb) */}
                  <group position={[0, -0.28, 0]}>
                    <mesh castShadow scale={[0.9, 1.25, 0.6]}>
                      <sphereGeometry args={[0.04, 12, 10]} />
                      <meshStandardMaterial {...skinMat} />
                    </mesh>
                    <mesh position={[s * -0.025, 0.015, 0.015]} rotation={[0, 0, s * 0.4]} castShadow>
                      <capsuleGeometry args={[0.014, 0.035, 6, 8]} />
                      <meshStandardMaterial {...skinMat} />
                    </mesh>
                  </group>
                </group>
              </group>
            ))}
          </group>

          {/* LEGS */}
          {([-1, 1] as const).map((s) => (
            <group key={`leg${s}`} ref={s === -1 ? leftLegRef : rightLegRef} position={[s * (0.08 * wm), -0.05, 0]}>
              {/* Hip joint */}
              <mesh castShadow>
                <sphereGeometry args={[0.065, 12, 12]} />
                <meshStandardMaterial color={pantsColor} roughness={0.9} />
              </mesh>
              {/* Thigh */}
              <mesh position={[0, -0.19, 0]} castShadow>
                <cylinderGeometry args={[0.065, 0.05, 0.38, 12]} />
                <meshStandardMaterial color={pantsColor} roughness={0.9} />
              </mesh>

              {/* Shin Group (Pivots at knee) */}
              <group ref={s === -1 ? leftShinRef : rightShinRef} position={[0, -0.38, 0]}>
                {/* Knee joint */}
                <mesh castShadow>
                  <sphereGeometry args={[0.05, 12, 10]} />
                  <meshStandardMaterial color={pantsColor} roughness={0.9} />
                </mesh>
                {/* Calf */}
                <mesh position={[0, -0.20, 0]} castShadow>
                  <cylinderGeometry args={[0.05, 0.04, 0.40, 12]} />
                  <meshStandardMaterial color={pantsColor} roughness={0.9} />
                </mesh>
                {/* Pant Cuff */}
                <mesh position={[0, -0.40, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.042, 0.014, 8, 12]} />
                  <meshStandardMaterial color={pantsDark} roughness={0.9} />
                </mesh>

                {/* Shoe */}
                <group position={[0, -0.43, 0.04]}>
                  <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <capsuleGeometry args={[0.048, 0.075, 10, 12]} />
                    <meshStandardMaterial color="#2a1a0a" roughness={0.5} metalness={0.1} />
                  </mesh>
                  <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <capsuleGeometry args={[0.049, 0.077, 10, 12]} />
                    <meshStandardMaterial color="#1a1006" roughness={0.8} />
                  </mesh>
                </group>
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
