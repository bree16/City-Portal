import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { cameraDrag } from '@/lib/cameraDrag';

// Default framing (keeps the original hardcoded isometric pose):
// OFFSET (13, 11, 13) → distance ~21.42, yaw 45°, pitch ~30.9° above horizon.
const DEFAULT_OFFSET = new THREE.Vector3(13, 11, 13);
const DEFAULT_DISTANCE = DEFAULT_OFFSET.length();
const DEFAULT_YAW = Math.atan2(DEFAULT_OFFSET.x, DEFAULT_OFFSET.z); // around Y
const DEFAULT_PITCH = Math.asin(DEFAULT_OFFSET.y / DEFAULT_DISTANCE); // above horizon

// Pitch clamp: ~15°..70° above the horizon so we never dip below ground
// or tip into an awkward top-down view.
const MIN_PITCH = THREE.MathUtils.degToRad(15);
const MAX_PITCH = THREE.MathUtils.degToRad(70);

// Zoom (orbit radius) clamp.
const MIN_DISTANCE = 8;
const MAX_DISTANCE = 40;

// Sensitivities.
const YAW_SPEED = 0.005; // radians per pixel
const PITCH_SPEED = 0.005; // radians per pixel
const WHEEL_ZOOM_SPEED = 0.0016; // distance factor per wheel delta unit
const PINCH_ZOOM_SPEED = 0.02;

// Smoothing (frame-rate independent).
const POS_DAMP = 3.0;
const LOOK_DAMP = 4.5;
const ORBIT_DAMP = 12.0; // how fast angles/distance ease toward their targets
const DRAG_THRESHOLD_SQ = 5 * 5; // px^2; beyond this a click is treated as a drag

export function IsometricCamera() {
  const { camera, gl } = useThree();

  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const smoothLook = useRef(new THREE.Vector3(0, 0, 0));
  const desired = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // Orbit state: current (smoothed) values follow the targets.
  const yaw = useRef(DEFAULT_YAW);
  const pitch = useRef(DEFAULT_PITCH);
  const distance = useRef(DEFAULT_DISTANCE);
  const targetYaw = useRef(DEFAULT_YAW);
  const targetPitch = useRef(DEFAULT_PITCH);
  const targetDistance = useRef(DEFAULT_DISTANCE);

  if (!initialized.current) {
    camera.position.copy(DEFAULT_OFFSET);
    camera.lookAt(0, 0, 0);
    initialized.current = true;
  }

  useEffect(() => {
    const dom = gl.domElement;

    // --- Drag orbit (right-drag primary, middle-drag secondary) ---
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    // Track total movement so click-to-move can distinguish a click from a drag.
    let downX = 0;
    let downY = 0;
    let activePointerId: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      // Reset drag-suppression at the start of every pointer interaction.
      cameraDrag.moved = false;
      downX = e.clientX;
      downY = e.clientY;

      // Orbit only with the right (2) or middle (1) mouse button so the
      // left button stays free for click-to-move.
      if (e.button === 2 || e.button === 1) {
        dragging = true;
        activePointerId = e.pointerId;
        lastX = e.clientX;
        lastY = e.clientY;
        try {
          dom.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        e.preventDefault();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      // Update drag-suppression distance for ANY button held down.
      const totalDx = e.clientX - downX;
      const totalDy = e.clientY - downY;
      if (totalDx * totalDx + totalDy * totalDy > DRAG_THRESHOLD_SQ) {
        cameraDrag.moved = true;
      }

      if (!dragging) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      targetYaw.current -= dx * YAW_SPEED; // free 360° yaw
      targetPitch.current = THREE.MathUtils.clamp(
        targetPitch.current + dy * PITCH_SPEED,
        MIN_PITCH,
        MAX_PITCH,
      );
    };

    const endDrag = (e: PointerEvent) => {
      if (activePointerId !== null && e.pointerId === activePointerId) {
        try {
          dom.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        activePointerId = null;
      }
      dragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Multiplicative zoom feels natural across the whole range.
      const factor = Math.exp(e.deltaY * WHEEL_ZOOM_SPEED);
      targetDistance.current = THREE.MathUtils.clamp(
        targetDistance.current * factor,
        MIN_DISTANCE,
        MAX_DISTANCE,
      );
    };

    const onContextMenu = (e: MouseEvent) => {
      // Never show the browser context menu over the canvas.
      e.preventDefault();
    };

    // --- Optional pinch zoom (two touch pointers) ---
    const touchPointers = new Map<number, { x: number; y: number }>();
    let lastPinchDist = 0;

    const onTouchPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      touchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touchPointers.size === 2) {
        const pts = Array.from(touchPointers.values());
        lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      }
    };
    const onTouchPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      if (!touchPointers.has(e.pointerId)) return;
      touchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touchPointers.size === 2) {
        cameraDrag.moved = true; // pinch is never a move command
        const pts = Array.from(touchPointers.values());
        const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (lastPinchDist > 0) {
          const delta = lastPinchDist - d;
          targetDistance.current = THREE.MathUtils.clamp(
            targetDistance.current + delta * PINCH_ZOOM_SPEED,
            MIN_DISTANCE,
            MAX_DISTANCE,
          );
        }
        lastPinchDist = d;
      }
    };
    const onTouchPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      touchPointers.delete(e.pointerId);
      lastPinchDist = 0;
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', endDrag);
    dom.addEventListener('pointercancel', endDrag);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', onContextMenu);

    dom.addEventListener('pointerdown', onTouchPointerDown);
    dom.addEventListener('pointermove', onTouchPointerMove);
    dom.addEventListener('pointerup', onTouchPointerUp);
    dom.addEventListener('pointercancel', onTouchPointerUp);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', endDrag);
      dom.removeEventListener('pointercancel', endDrag);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('contextmenu', onContextMenu);

      dom.removeEventListener('pointerdown', onTouchPointerDown);
      dom.removeEventListener('pointermove', onTouchPointerMove);
      dom.removeEventListener('pointerup', onTouchPointerUp);
      dom.removeEventListener('pointercancel', onTouchPointerUp);
    };
  }, [gl]);

  useFrame((_, dt) => {
    const { playerPosition } = useGameStore.getState();
    const px = playerPosition[0];
    const pz = playerPosition[2];
    const cappedDt = Math.min(dt, 0.05);

    // Ease orbit angles/distance toward their targets (damped).
    const orbitT = 1 - Math.exp(-ORBIT_DAMP * cappedDt);
    yaw.current += (targetYaw.current - yaw.current) * orbitT;
    pitch.current += (targetPitch.current - pitch.current) * orbitT;
    distance.current += (targetDistance.current - distance.current) * orbitT;

    // Ease the look target toward the player so quick turns don't jerk the view.
    lookTarget.current.set(px, 0, pz);
    const lookT = 1 - Math.exp(-LOOK_DAMP * cappedDt);
    smoothLook.current.lerp(lookTarget.current, lookT);

    // Build the orbit offset from spherical angles (reuse Vector3, no allocs).
    const cosPitch = Math.cos(pitch.current);
    offset.current.set(
      Math.sin(yaw.current) * cosPitch,
      Math.sin(pitch.current),
      Math.cos(yaw.current) * cosPitch,
    );
    offset.current.multiplyScalar(distance.current);

    // Camera position trails the (smoothed) look target for a gentle follow.
    desired.current.copy(smoothLook.current).add(offset.current);
    const posT = 1 - Math.exp(-POS_DAMP * cappedDt);
    camera.position.lerp(desired.current, posT);
    camera.lookAt(smoothLook.current);
  });

  return null;
}
