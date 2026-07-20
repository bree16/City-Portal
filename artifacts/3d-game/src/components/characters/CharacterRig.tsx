import { useMemo, useRef, useEffect } from 'react';
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

/* ── Shared Geometries ────────────────────────────────────────── */
/* Instantiated once globally to keep memory and draw calls cheap. */

const SHARED = {
  // --- Upper Body (Skin) ---
  torso: new THREE.LatheGeometry([
    new THREE.Vector2(0.001, 0.36),
    new THREE.Vector2(0.035, 0.36), // neck top
    new THREE.Vector2(0.042, 0.26), // neck base
    new THREE.Vector2(0.140, 0.22), // shoulder base
    new THREE.Vector2(0.155, 0.12), // chest
    new THREE.Vector2(0.130, 0.00), // waist
    new THREE.Vector2(0.135, -0.05), // slight tuck
    new THREE.Vector2(0.001, -0.05)
  ], 24),

  // --- Upper Body (Shirt) ---
  shirt: new THREE.LatheGeometry([
    new THREE.Vector2(0.044, 0.27),
    new THREE.Vector2(0.150, 0.23),
    new THREE.Vector2(0.165, 0.12),
    new THREE.Vector2(0.140, 0.00),
    new THREE.Vector2(0.160, -0.11),
    new THREE.Vector2(0.001, -0.11)
  ], 24),
  shirtHem: new THREE.TorusGeometry(0.16, 0.012, 8, 24),

  // --- Lower Body (Pants & Pelvis) ---
  pants: new THREE.LatheGeometry([
    new THREE.Vector2(0.001, 0.01),
    new THREE.Vector2(0.135, 0.01),  // waist top
    new THREE.Vector2(0.165, -0.12), // hips
    new THREE.Vector2(0.145, -0.24), // crotch
    new THREE.Vector2(0.001, -0.26)
  ], 24),
  belt: new THREE.TorusGeometry(0.135, 0.018, 8, 24),

  // --- Head & Face ---
  head: new THREE.SphereGeometry(0.16, 24, 20),
  jaw: new THREE.SphereGeometry(0.11, 16, 16),
  ear: new THREE.SphereGeometry(0.035, 12, 10),
  nose: new THREE.SphereGeometry(0.022, 12, 10),
  eyeWhite: new THREE.SphereGeometry(0.028, 12, 10),
  eyeIris: new THREE.SphereGeometry(0.018, 10, 8),
  eyePupil: new THREE.SphereGeometry(0.009, 8, 6),
  eyeHighlight: new THREE.SphereGeometry(0.003, 6, 6),
  blush: new THREE.SphereGeometry(0.025, 8, 6),
  smileBig: new THREE.TorusGeometry(0.04, 0.012, 8, 16, Math.PI),
  smileSmall: new THREE.TorusGeometry(0.03, 0.005, 8, 12, Math.PI * 0.8),
  brow: new THREE.BoxGeometry(0.06, 0.012, 0.015),

  // --- Arms (Tapered) ---
  shoulder: new THREE.SphereGeometry(0.055, 16, 12),
  upperArm: new THREE.CylinderGeometry(0.045, 0.035, 0.28, 16),
  sleeve: new THREE.CylinderGeometry(0.052, 0.042, 0.14, 16),
  sleeveCuff: new THREE.TorusGeometry(0.042, 0.008, 8, 16),
  elbow: new THREE.SphereGeometry(0.036, 16, 12),
  forearm: new THREE.CylinderGeometry(0.035, 0.025, 0.28, 16),
  wrist: new THREE.SphereGeometry(0.026, 16, 12),
  hand: new THREE.CapsuleGeometry(0.028, 0.04, 12, 12),
  thumb: new THREE.CapsuleGeometry(0.012, 0.025, 8, 8),

  // --- Legs (Tapered) ---
  hip: new THREE.SphereGeometry(0.07, 16, 16),
  thighPant: new THREE.CylinderGeometry(0.075, 0.05, 0.38, 16),
  knee: new THREE.SphereGeometry(0.05, 16, 12),
  calfPant: new THREE.CylinderGeometry(0.05, 0.035, 0.40, 16),
  pantHem: new THREE.TorusGeometry(0.035, 0.012, 8, 16),
  ankle: new THREE.SphereGeometry(0.028, 16, 12),
  shoe: new THREE.CapsuleGeometry(0.045, 0.08, 12, 12),
  shoeSole: new THREE.CapsuleGeometry(0.047, 0.082, 12, 12),

  // --- Hair Options ---
  hairCap: new THREE.SphereGeometry(0.165, 20, 16, 0, Math.PI * 2, 0, 1.7),
  hairCapFull: new THREE.SphereGeometry(0.175, 20, 16, 0, Math.PI * 2, 0, 1.9),
  hairLoc: new THREE.CapsuleGeometry(0.025, 0.2, 6, 8),
  hairCurl: new THREE.SphereGeometry(0.07, 12, 10),
  hairPonySweep: new THREE.SphereGeometry(0.15, 16, 12),
  hairPonyTail: new THREE.CapsuleGeometry(0.045, 0.18, 8, 8),
  hairPonyBand: new THREE.TorusGeometry(0.04, 0.016, 8, 12),
  hairFadeTop: new THREE.SphereGeometry(0.165, 18, 12),
  hairFadeSide: new THREE.SphereGeometry(0.165, 18, 10, 0, Math.PI * 2, 0, 1.6),
  hairBang: new THREE.SphereGeometry(0.06, 12, 10),
  hairBack: new THREE.SphereGeometry(0.14, 16, 12),

  // --- Accessories ---
  glassesRing: new THREE.TorusGeometry(0.042, 0.008, 8, 20),
  glassesBridge: new THREE.BoxGeometry(0.056, 0.007, 0.007),
  glassesArm: new THREE.BoxGeometry(0.05, 0.006, 0.006),
  earring: new THREE.SphereGeometry(0.016, 8, 8),
  hatDome: new THREE.SphereGeometry(0.18, 16, 12, 0, Math.PI * 2, 0, 1.5),
  hatBrim: new THREE.SphereGeometry(0.16, 12, 8),
};

const CONST_MATS = {
  eyeWhite: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 }),
  eyePupil: new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.1 }),
  eyeHighlight: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.8 }),
  shoe: new THREE.MeshStandardMaterial({ color: '#2a1a0a', roughness: 0.5, metalness: 0.1 }),
  shoeSole: new THREE.MeshStandardMaterial({ color: '#1a1006', roughness: 0.8 }),
  hairBand: new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.9 }),
  glassesFrame: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.3, metalness: 0.7 }),
  gold: new THREE.MeshStandardMaterial({ color: '#D4A843', roughness: 0.1, metalness: 0.9 }),
};

/* ── Components ───────────────────────────────────────────────── */

function HairMesh({ hairstyle, hairMat, skinMat, fadeMat }: { hairstyle: HairstyleId; hairMat: THREE.Material; skinMat: THREE.Material; fadeMat: THREE.Material }) {
  switch (hairstyle) {
    case 'short':
      return (
        <group>
          <mesh geometry={SHARED.hairCap} material={hairMat} position={[0, 0.02, -0.01]} scale={[0.94, 1.06, 0.96]} castShadow />
          {[-1, 1].map((s) => (
            <mesh key={s} geometry={SHARED.ear} material={skinMat} position={[s * 0.15, -0.04, 0.04]} scale={[0.4, 1.2, 0.6]} />
          ))}
        </group>
      );
    case 'locs':
      return (
        <group>
          <mesh geometry={SHARED.hairCapFull} material={hairMat} position={[0, 0.03, -0.01]} castShadow />
          {[
            [-0.14, 0.06], [-0.08, -0.12], [0, -0.15], [0.08, -0.12], [0.14, 0.06],
            [-0.13, -0.08], [0.13, -0.08],
          ].map(([x, z], i) => (
            <mesh key={i} geometry={SHARED.hairLoc} material={hairMat} position={[x, -0.12, z]} rotation={[0, 0, x * -0.6]} castShadow />
          ))}
        </group>
      );
    case 'curly':
      return (
        <group>
          <mesh geometry={SHARED.hairCapFull} material={hairMat} position={[0, 0.05, -0.01]} scale={[1.05, 1.1, 1.05]} castShadow />
          {[
            [-0.13, 0.14, 0.08], [0.13, 0.14, 0.08], [0, 0.19, 0.02],
            [-0.15, 0.06, -0.09], [0.15, 0.06, -0.09], [0, 0.12, -0.14],
            [-0.06, 0.19, -0.07], [0.06, 0.19, -0.07],
          ].map(([x, y, z], i) => (
            <mesh key={i} geometry={SHARED.hairCurl} material={hairMat} position={[x, y, z]} castShadow />
          ))}
        </group>
      );
    case 'ponytail':
      return (
        <group>
          <mesh geometry={SHARED.hairCapFull} material={hairMat} position={[0, 0.02, -0.01]} scale={[1.02, 1.02, 1.02]} castShadow />
          <mesh geometry={SHARED.hairPonySweep} material={hairMat} position={[0, 0.06, -0.11]} scale={[0.9, 0.8, 0.8]} castShadow />
          <mesh geometry={SHARED.hairPonyBand} material={CONST_MATS.hairBand} position={[0, 0.08, -0.18]} rotation={[Math.PI / 2.4, 0, 0]} />
          <mesh geometry={SHARED.hairPonyTail} material={hairMat} position={[0, -0.02, -0.24]} rotation={[-0.4, 0, 0]} castShadow />
          <mesh geometry={SHARED.hairPonyTail} material={hairMat} position={[0, -0.16, -0.28]} rotation={[-0.2, 0, 0]} scale={[0.8, 0.9, 0.8]} castShadow />
        </group>
      );
    case 'fade':
      return (
        <group>
          <mesh geometry={SHARED.hairFadeTop} material={hairMat} position={[0, 0.12, -0.01]} scale={[0.95, 0.6, 0.95]} castShadow />
          <mesh geometry={SHARED.hairFadeSide} material={fadeMat} position={[0, 0.03, -0.01]} scale={[1.0, 0.5, 1.0]} />
        </group>
      );
    case 'medium':
    default:
      return (
        <group>
          <mesh geometry={SHARED.hairCapFull} material={hairMat} position={[0, 0.01, -0.01]} scale={[0.96, 1.08, 0.98]} castShadow />
          {[-1, 1].map((s) => (
            <mesh key={s} geometry={SHARED.hairBang} material={hairMat} position={[s * 0.15, -0.05, 0.03]} scale={[0.6, 1.6, 0.9]} castShadow />
          ))}
          <mesh geometry={SHARED.hairBack} material={hairMat} position={[0, -0.05, -0.12]} scale={[0.95, 1.1, 0.7]} castShadow />
        </group>
      );
  }
}

function AccessoryMeshes({ accessories, hairMat }: { accessories: AccessoryId[]; hairMat: THREE.Material }) {
  return (
    <>
      {accessories.includes('glasses') && (
        <group position={[0, 0.02, 0.15]}>
          {[-0.065, 0.065].map((x) => (
            <mesh key={x} geometry={SHARED.glassesRing} material={CONST_MATS.glassesFrame} position={[x, 0, 0]} />
          ))}
          <mesh geometry={SHARED.glassesBridge} material={CONST_MATS.glassesFrame} />
          {[-1, 1].map((s) => (
            <mesh key={s} geometry={SHARED.glassesArm} material={CONST_MATS.glassesFrame} position={[s * 0.11, 0, -0.05]} rotation={[0, s * -0.35, 0]} />
          ))}
        </group>
      )}
      {accessories.includes('earrings') && (
        <>
          {[-1, 1].map((s) => (
            <mesh key={s} geometry={SHARED.earring} material={CONST_MATS.gold} position={[s * 0.17, -0.05, 0.01]} />
          ))}
        </>
      )}
      {accessories.includes('hat') && (
        <group position={[0, 0.16, 0]}>
          <mesh geometry={SHARED.hatDome} material={hairMat} position={[0, 0.02, 0]} castShadow />
          <mesh geometry={SHARED.hatBrim} material={hairMat} position={[0, -0.02, 0.19]} rotation={[-0.15, 0, 0]} scale={[1, 0.25, 1]} castShadow />
        </group>
      )}
    </>
  );
}

/* ── Rig Component ────────────────────────────────────────────── */

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
  
  // Refs for animation
  const rootRef = useRef<THREE.Group>(null);
  const chestGroupRef = useRef<THREE.Group>(null);
  const pelvisGroupRef = useRef<THREE.Group>(null);
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

  // Dynamically generated materials
  const mats = useMemo(() => ({
    skin: new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.45, metalness: 0.1 }),
    shirt: new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.85 }),
    pants: new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.9 }),
    shirtDark: new THREE.MeshStandardMaterial({ color: shade(shirtColor, 0.72), roughness: 0.85 }),
    pantsDark: new THREE.MeshStandardMaterial({ color: shade(pantsColor, 0.7), roughness: 0.9 }),
    hair: new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.7, metalness: 0 }),
    fade: new THREE.MeshStandardMaterial({ color: shade(hairColor, 0.5), roughness: 0.8, transparent: true, opacity: 0.6 }),
    eye: new THREE.MeshStandardMaterial({ color: eyeColor, roughness: 0.2 }),
    mouth: new THREE.MeshStandardMaterial({ color: '#B0574A', roughness: 0.6 }),
    blush: new THREE.MeshStandardMaterial({ color: shade(skinTone, 0.92), roughness: 0.9, transparent: true, opacity: 0.4 }),
  }), [skinTone, shirtColor, pantsColor, hairColor, eyeColor]);

  // Clean up materials on unmount
  useEffect(() => {
    return () => { Object.values(mats).forEach(m => m.dispose()); };
  }, [mats]);

  // Body thickness
  const wm = 0.85 + bodyScale * 0.3;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + idlePhase;

    // Snappy blink
    if (eyesGroupRef.current) {
      eyesGroupRef.current.scale.y = (t % 4.5) < 0.12 ? 0.1 : 1;
    }

    if (isMoving) {
      const w = t * 8.5;
      const swing = Math.sin(w);
      const cosSwing = Math.cos(w);

      // Arms (Opposite to legs)
      if (leftArmRef.current) leftArmRef.current.rotation.x = swing * 0.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing * 0.6;
      
      // Forearms bend when arm is moving forward
      if (leftForearmRef.current) leftForearmRef.current.rotation.x = -0.1 - Math.max(0, swing) * 0.6;
      if (rightForearmRef.current) rightForearmRef.current.rotation.x = -0.1 - Math.max(0, -swing) * 0.6;
      
      // Legs
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * 0.6;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing * 0.6;
      
      // Knees bend sharply when leg transitions from back to front
      if (leftShinRef.current) leftShinRef.current.rotation.x = Math.max(0, swing + cosSwing) * 0.8;
      if (rightShinRef.current) rightShinRef.current.rotation.x = Math.max(0, -swing + cosSwing) * 0.8;
      
      // Torso dynamics
      if (rootRef.current) {
        // Dip below the standing baseline at mid-stride (legs bent), returning
        // to 1.02 when legs are extended — keeps feet planted, never hovering.
        rootRef.current.position.y = 1.02 - (1 - Math.abs(cosSwing)) * 0.035;
        rootRef.current.rotation.y = swing * 0.1;
        rootRef.current.rotation.z = Math.sin(w * 0.5) * 0.02;
      }
      if (chestGroupRef.current) {
        chestGroupRef.current.rotation.x = 0.05;
        chestGroupRef.current.rotation.y = -swing * 0.15; // Counter-twist
      }
      if (pelvisGroupRef.current) {
        pelvisGroupRef.current.rotation.x = 0;
      }
      if (headRef.current) {
        headRef.current.rotation.y = -swing * 0.05; // Stabilize head
        headRef.current.rotation.x = 0;
      }
    } else if (isIdle) {
      const b = Math.sin(t * 1.5);
      
      // Breathing & Weight shift
      if (rootRef.current) {
        rootRef.current.position.y = 1.02; // breathing shown via chest scale, feet stay grounded
        rootRef.current.rotation.y = Math.sin(t * 0.5) * 0.03;
        rootRef.current.rotation.z = Math.sin(t * 0.5) * 0.01;
      }
      if (chestGroupRef.current) {
        chestGroupRef.current.scale.set(1 + b * 0.012, 1, 1 + b * 0.012);
        chestGroupRef.current.rotation.x = 0;
        chestGroupRef.current.rotation.y = 0;
      }
      if (pelvisGroupRef.current) {
        pelvisGroupRef.current.rotation.x = 0;
      }

      // Emotes
      if (emote === 'wave' && rightArmRef.current && rightForearmRef.current) {
        rightArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.z = -2.2;
        rightForearmRef.current.rotation.x = 0;
        rightForearmRef.current.rotation.z = Math.sin(t * 8) * 0.5;
      } else {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.sin(t * 0.8 + 1) * 0.03;
          rightArmRef.current.rotation.z = -0.1 - Math.sin(t * 0.8) * 0.02;
        }
        if (rightForearmRef.current) {
          rightForearmRef.current.rotation.x = -0.1;
          rightForearmRef.current.rotation.z = 0;
        }
      }
      
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(t * 0.8) * 0.03;
        leftArmRef.current.rotation.z = 0.1 + Math.sin(t * 0.8) * 0.02;
      }
      if (leftForearmRef.current) {
        leftForearmRef.current.rotation.x = -0.1;
        leftForearmRef.current.rotation.z = 0;
      }

      // Look around
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
    <group scale={scale}>
      {/* 
        Root matches the character's waist at Y=1.02.
        Total leg drop is ~1.02, so feet bottom out exactly at Y=0.
      */}
      <group ref={rootRef} position={[0, 1.02, 0]}>
        
        {/* LOWER BODY (Pants & Legs) */}
        <group ref={pelvisGroupRef}>
          <mesh geometry={SHARED.pants} material={mats.pants} scale={[wm, 1, 0.72]} castShadow />
          <mesh geometry={SHARED.belt} material={mats.pantsDark} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[wm, 1, 0.72]} />

          {/* LEGS (Pivot from Hips at Y=-0.15) */}
          {([-1, 1] as const).map((s) => (
            <group key={`leg${s}`} ref={s === -1 ? leftLegRef : rightLegRef} position={[s * (0.09 * wm), -0.15, 0]}>
              <mesh geometry={SHARED.hip} material={mats.pants} castShadow />
              <mesh geometry={SHARED.thighPant} material={mats.pants} position={[0, -0.19, 0]} castShadow />

              {/* SHIN (Pivots from Knee at Y=-0.38) */}
              <group ref={s === -1 ? leftShinRef : rightShinRef} position={[0, -0.38, 0]}>
                <mesh geometry={SHARED.knee} material={mats.pants} castShadow />
                <mesh geometry={SHARED.calfPant} material={mats.pants} position={[0, -0.20, 0]} castShadow />
                <mesh geometry={SHARED.pantHem} material={mats.pantsDark} position={[0, -0.40, 0]} rotation={[Math.PI / 2, 0, 0]} />

                {/* FOOT (Y=-0.40 relative to knee) */}
                <group position={[0, -0.40, 0]}>
                  <mesh geometry={SHARED.ankle} material={mats.skin} castShadow />
                  <mesh geometry={SHARED.shoe} material={CONST_MATS.shoe} position={[0, -0.02, 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow />
                  <mesh geometry={SHARED.shoeSole} material={CONST_MATS.shoeSole} position={[0, -0.045, 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow />
                </group>
              </group>
            </group>
          ))}
        </group>

        {/* UPPER BODY (Torso, Shirt, Head, Arms) */}
        <group ref={chestGroupRef}>
          <mesh geometry={SHARED.torso} material={mats.skin} scale={[wm, 1, 0.68]} castShadow />
          <mesh geometry={SHARED.shirt} material={mats.shirt} scale={[wm, 1, 0.72]} castShadow />
          <mesh geometry={SHARED.shirtHem} material={mats.shirtDark} position={[0, -0.11, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[wm, 1, 0.72]} />

          {/* HEAD (Pivots at neck base Y=0.26) */}
          <group position={[0, 0.26, 0]}>
            <group ref={headRef} position={[0, 0.10, 0]}>
              <mesh geometry={SHARED.head} material={mats.skin} scale={[0.92, 1.05, 0.95]} castShadow />
              <mesh geometry={SHARED.jaw} material={mats.skin} position={[0, -0.07, 0.05]} scale={[0.85, 0.8, 0.85]} castShadow />
              
              {/* Ears */}
              {[-1, 1].map((s) => (
                <mesh key={s} geometry={SHARED.ear} material={mats.skin} position={[s * 0.155, 0, 0]} scale={[0.5, 1, 0.8]} rotation={[0, s * 0.15, 0]} />
              ))}
              
              {/* Nose */}
              <mesh geometry={SHARED.nose} material={mats.skin} position={[0, -0.03, 0.16]} scale={[0.8, 1.1, 0.9]} castShadow />
              
              {/* Brows */}
              {[-1, 1].map((s) => (
                <mesh key={s} geometry={SHARED.brow} material={mats.hair} position={[s * 0.07, 0.07, 0.15]} rotation={[0, 0, s * -0.1]} />
              ))}

              {/* Eyes */}
              <group ref={eyesGroupRef}>
                {[-1, 1].map((s) => (
                  <group key={s} position={[s * 0.065, 0.015, 0.145]}>
                    <mesh geometry={SHARED.eyeWhite} material={CONST_MATS.eyeWhite} scale={[1.1, 1.3, 0.6]} />
                    <mesh geometry={SHARED.eyeIris} material={mats.eye} position={[0, 0, 0.014]} scale={[1, 1.2, 0.5]} />
                    <mesh geometry={SHARED.eyePupil} material={CONST_MATS.eyePupil} position={[0, 0, 0.020]} scale={[1, 1, 0.5]} />
                    <mesh geometry={SHARED.eyeHighlight} material={CONST_MATS.eyeHighlight} position={[s * 0.005, 0.005, 0.024]} />
                  </group>
                ))}
              </group>

              {/* Mouth */}
              <mesh geometry={bigSmile ? SHARED.smileBig : SHARED.smileSmall} material={mats.mouth} position={bigSmile ? [0, -0.08, 0.145] : [0, -0.09, 0.15]} rotation={bigSmile ? [0.2, 0, Math.PI] : [0.1, 0, Math.PI]} />

              {/* Blush */}
              {[-1, 1].map((s) => (
                <mesh key={s} geometry={SHARED.blush} material={mats.blush} position={[s * 0.10, -0.04, 0.13]} scale={[1.2, 0.8, 0.5]} />
              ))}

              <HairMesh hairstyle={hairstyle} hairMat={mats.hair} skinMat={mats.skin} fadeMat={mats.fade} />
              <AccessoryMeshes accessories={accessories} hairMat={mats.hair} />
            </group>
          </group>

          {/* ARMS (Pivot from Shoulders at Y=0.22) */}
          {([-1, 1] as const).map((s) => (
            <group key={`arm${s}`} ref={s === -1 ? leftArmRef : rightArmRef} position={[s * (0.16 * wm + 0.02), 0.22, 0]}>
              <mesh geometry={SHARED.shoulder} material={mats.shirt} castShadow />
              
              <mesh geometry={SHARED.upperArm} material={mats.skin} position={[0, -0.14, 0]} castShadow />
              <mesh geometry={SHARED.sleeve} material={mats.shirt} position={[0, -0.07, 0]} castShadow />
              <mesh geometry={SHARED.sleeveCuff} material={mats.shirtDark} position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]} />

              {/* FOREARM (Pivots from Elbow at Y=-0.28) */}
              <group ref={s === -1 ? leftForearmRef : rightForearmRef} position={[0, -0.28, 0]}>
                <mesh geometry={SHARED.elbow} material={mats.skin} castShadow />
                <mesh geometry={SHARED.forearm} material={mats.skin} position={[0, -0.14, 0]} castShadow />

                {/* HAND (Y=-0.28) */}
                <group position={[0, -0.28, 0]}>
                  <mesh geometry={SHARED.wrist} material={mats.skin} castShadow />
                  <mesh geometry={SHARED.hand} material={mats.skin} position={[0, -0.02, 0]} rotation={[0, 0, s * -0.1]} castShadow />
                  <mesh geometry={SHARED.thumb} material={mats.skin} position={[s * -0.02, -0.01, 0.015]} rotation={[0, 0, s * 0.4]} castShadow />
                </group>
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
