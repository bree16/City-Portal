import { useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { getAudioEngine } from '@/hooks/useGameAudio';
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
  /** Marks a quest-critical NPC so they get the gold ring + "!" marker. */
  important?: boolean;
};

interface NPCCharacterProps {
  npc: NPCDef;
  onClick?: () => void;
}

/** Deterministic 0..1 hash from a string (no Math.random in render). */
function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Convert to unsigned then normalise to 0..1
  return (h >>> 0) / 4294967295;
}

/* ── Shared geometry/material instances ─────────────────────────────
 * Every NPC reuses these singletons instead of allocating its own copy.
 * The ring's pulse is driven by per-mesh scale, and the ring material's
 * opacity is animated once globally (all rings breathe together), so a
 * single material instance is safe to share. */
const ringGeo = new THREE.RingGeometry(0.55, 0.7, 48);
const ringMat = new THREE.MeshBasicMaterial({
  color: '#ffea00',
  transparent: true,
  opacity: 0.45,
  side: THREE.DoubleSide,
  depthWrite: false,
});
const markerStemGeo = new THREE.CapsuleGeometry(0.045, 0.16, 4, 10);
const markerDotGeo = new THREE.SphereGeometry(0.05, 12, 10);
const markerMat = new THREE.MeshStandardMaterial({
  color: '#ffea00',
  emissive: '#D4A843',
  emissiveIntensity: 0.6,
  roughness: 0.3,
  metalness: 0.4,
});
const hitboxGeo = new THREE.BoxGeometry(0.6, 1.8, 0.5);
const hitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

/** Animate the shared ring material's opacity once per frame (not per NPC). */
let ringPulseFrameStamp = -1;
function pulseSharedRingMat(t: number) {
  if (ringPulseFrameStamp === t) return;
  ringPulseFrameStamp = t;
  ringMat.opacity = 0.35 + (Math.sin(t * 2) + 1) * 0.15;
}

/** Hide name labels beyond this camera distance (with hysteresis to avoid flicker). */
const LABEL_SHOW_DIST = 16;
const LABEL_HIDE_DIST = 18;
const tmpWorldPos = new THREE.Vector3();

export function NPCCharacter({ npc, onClick }: NPCCharacterProps) {
  const { activeDialogue } = useGameStore();
  const isActive = activeDialogue?.npcId === npc.id;
  const emphasized = isActive || npc.important === true;

  // Deterministic per-NPC constants derived from the id hash.
  const { idlePhase, gestureCycle, gestureOffset, frameSkew } = useMemo(() => {
    const h = hashId(npc.id);
    return {
      idlePhase: h * 12, // seconds of desync between idle timers
      gestureCycle: 9 + h * 5, // ~9-14s between gestures
      gestureOffset: h * 14, // stagger when the first gesture fires
      frameSkew: Math.floor(h * 10), // stagger throttled checks across NPCs
    };
  }, [npc.id]);

  const rootRef = useRef<THREE.Group>(null);
  const rigGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Group>(null);
  const frameCount = useRef(0);

  // Gesture emote — React state so CharacterRig re-renders with the new prop.
  // Only flips at cycle boundaries (~twice per 9-14s), so re-renders are rare.
  const [emote, setEmote] = useState<'none' | 'wave'>('none');
  const emoteRef = useRef<'none' | 'wave'>('none');

  // Distance-based label culling — keeps the DOM overlay count low in
  // crowded scenes. Checked every ~10 frames (staggered per NPC).
  const [labelVisible, setLabelVisible] = useState(true);
  const labelVisibleRef = useRef(true);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const frame = frameCount.current++;

    // ── Occasional gesture: brief wave on a slow deterministic cycle ──
    const phase = (t + gestureOffset) % gestureCycle;
    // Wave (or gesture while dialogue is active) for the first ~1.6s of each cycle.
    const nextEmote: 'none' | 'wave' = isActive || phase < 1.6 ? 'wave' : 'none';
    if (emoteRef.current !== nextEmote) {
      emoteRef.current = nextEmote;
      setEmote(nextEmote);
    }

    // ── Facing behavior: gently turn toward the camera when in dialogue ──
    if (rigGroupRef.current) {
      const cam = camera.position;
      // Angle from the NPC's world position toward the camera on the XZ plane.
      const targetY = isActive
        ? Math.atan2(cam.x - npc.position[0], cam.z - npc.position[2])
        : 0;
      rigGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.y,
        targetY,
        0.04
      );
    }

    // ── Throttled label distance check (every 10 frames, staggered) ──
    if ((frame + frameSkew) % 10 === 0 && rootRef.current) {
      rootRef.current.getWorldPosition(tmpWorldPos);
      const dist = tmpWorldPos.distanceTo(camera.position);
      const next = labelVisibleRef.current
        ? dist < LABEL_HIDE_DIST
        : dist < LABEL_SHOW_DIST;
      if (next !== labelVisibleRef.current) {
        labelVisibleRef.current = next;
        setLabelVisible(next);
      }
    }

    // ── Quest emphasis: pulsing gold ring ──
    if (emphasized) {
      pulseSharedRingMat(t);
      if (ringRef.current) {
        const s = 0.5 + Math.sin(t * 2 + idlePhase) * 0.06;
        ringRef.current.scale.set(s, s, s);
      }
      // Bobbing "!" marker above the head.
      if (markerRef.current) {
        markerRef.current.position.y = 2.55 + Math.sin(t * 2.5 + idlePhase) * 0.08;
        markerRef.current.rotation.y = t * 0.8;
      }
    }
  });

  return (
    <group ref={rootRef} position={npc.position} rotation={npc.rotation ?? [0, 0, 0]}>
      <group ref={rigGroupRef}>
        <CharacterRig
          skinTone={npc.skinTone}
          hairColor={npc.hairColor}
          shirtColor={npc.shirtColor}
          pantsColor={npc.pantsColor}
          isIdle={true}
          idlePhase={idlePhase}
          emote={emote}
          bigSmile={isActive}
        />
      </group>

      {/* Quest emphasis: softly pulsing gold ring on the ground (shared geo/mat) */}
      {emphasized && (
        <mesh
          ref={ringRef}
          position={[0, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={ringGeo}
          material={ringMat}
        />
      )}

      {/* Quest emphasis: bobbing gold "!" marker above the head (shared geo/mat) */}
      {emphasized && (
        <group ref={markerRef} position={[0, 2.55, 0]}>
          {/* Stem */}
          <mesh position={[0, 0.09, 0]} castShadow geometry={markerStemGeo} material={markerMat} />
          {/* Dot */}
          <mesh position={[0, -0.11, 0]} castShadow geometry={markerDotGeo} material={markerMat} />
        </group>
      )}

      {/* Invisible click hitbox (shared geo/mat) */}
      <mesh
        position={[0, 0.9, 0]}
        geometry={hitboxGeo}
        material={hitboxMat}
        onClick={(e) => {
          e.stopPropagation();
          getAudioEngine().play('click');
          onClick?.();
        }}
      />

      {/* Name label above head — glass look. Hidden beyond ~18m so distant
          NPCs don't each keep a DOM overlay alive. */}
      {labelVisible && (
        <Html
          position={[0, 2.2, 0]}
          center
          distanceFactor={8}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: isActive
                ? 'rgba(20, 26, 40, 0.82)'
                : 'rgba(13, 18, 30, 0.68)',
              color: isActive ? '#F5D97A' : '#fff',
              padding: '3px 10px',
              borderRadius: 0,
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              fontFamily: 'Inter, sans-serif',
              boxShadow: isActive
                ? '0 2px 12px rgba(255,234,0,0.35)'
                : '0 2px 8px rgba(0,0,0,0.4)',
              border: isActive
                ? '1.5px solid #ffea00'
                : '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
            onClick={() => {
              getAudioEngine().play('click');
              onClick?.();
            }}
          >
            {npc.name}
          </div>
        </Html>
      )}
    </group>
  );
}
