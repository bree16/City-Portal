import { type Variants } from 'framer-motion';

const easeExpo  = [0.22, 1, 0.36, 1] as const;
const easeBounce = [0.34, 1.56, 0.64, 1] as const;

// ── Core Variants ─────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 52, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.65, ease: easeExpo } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -44, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,   filter: 'blur(0px)', transition: { duration: 0.6,  ease: easeExpo } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -72 },
  show:   { opacity: 1, x: 0,   transition: { duration: 0.7, ease: easeExpo } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 72 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.7, ease: easeExpo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.78 },
  show:   { opacity: 1, scale: 1,    transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

export const scaleGentle: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  show:   { opacity: 1, scale: 1,    transition: { duration: 0.55, ease: easeExpo } },
};

export const blurReveal: Variants = {
  hidden: { opacity: 0, filter: 'blur(20px)', scale: 0.95 },
  show:   { opacity: 1, filter: 'blur(0px)',  scale: 1,    transition: { duration: 0.75, ease: easeExpo } },
};

export const flipUp: Variants = {
  hidden: { opacity: 0, rotateX: -50, y: 32 },
  show:   { opacity: 1, rotateX: 0,   y: 0,  transition: { duration: 0.65, ease: easeExpo } },
};

// ── Dramatic / Expressive Variants ───────────────────────────────

/** Sweeping arc entry from below-right with slight spin */
export const swoopIn: Variants = {
  hidden: { opacity: 0, y: 90, rotate: -8, scale: 0.85 },
  show:   { opacity: 1, y: 0,  rotate: 0,  scale: 1,
            transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

/** Elastic scale pop from zero */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show:   { opacity: 1, scale: 1,
            transition: { type: 'spring', stiffness: 520, damping: 28 } },
};

/** Roll in from the left with rotation */
export const rollIn: Variants = {
  hidden: { opacity: 0, x: -110, rotate: -14 },
  show:   { opacity: 1, x: 0,    rotate: 0,
            transition: { type: 'spring', stiffness: 180, damping: 22 } },
};

/** Roll in from the right with rotation */
export const rollRight: Variants = {
  hidden: { opacity: 0, x: 110, rotate: 14 },
  show:   { opacity: 1, x: 0,   rotate: 0,
            transition: { type: 'spring', stiffness: 180, damping: 22 } },
};

/** Energetic spring upward */
export const springUp: Variants = {
  hidden: { opacity: 0, y: 80 },
  show:   { opacity: 1, y: 0,
            transition: { type: 'spring', stiffness: 380, damping: 22 } },
};

/** Fade in with dramatic glow/brightness burn */
export const glowFade: Variants = {
  hidden: { opacity: 0, filter: 'blur(18px) brightness(2.5)' },
  show:   { opacity: 1, filter: 'blur(0px) brightness(1)',
            transition: { duration: 0.9, ease: easeExpo } },
};

/** 3-D perspective tilt reveal from the left face */
export const tiltReveal: Variants = {
  hidden: { opacity: 0, rotateY: 50, x: -50 },
  show:   { opacity: 1, rotateY: 0,  x: 0,
            transition: { duration: 0.8, ease: easeExpo } },
};

/** Zoom-in magnetised snap */
export const magnetIn: Variants = {
  hidden: { opacity: 0, scale: 1.2, filter: 'blur(10px)' },
  show:   { opacity: 1, scale: 1,   filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 420, damping: 32 } },
};

/** Clip-path wipe upward reveal */
export const wipeUp: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 },
  show:   { clipPath: 'inset(0% 0% 0% 0%)',   opacity: 1,
            transition: { duration: 0.7, ease: easeExpo } },
};

/** Clip-path wipe from left to right */
export const wipeRight: Variants = {
  hidden: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 1 },
  show:   { clipPath: 'inset(0% 0% 0% 0%)',   opacity: 1,
            transition: { duration: 0.75, ease: easeExpo } },
};

/** Full 180° spin-in + scale */
export const spinReveal: Variants = {
  hidden: { opacity: 0, rotate: -180, scale: 0.4 },
  show:   { opacity: 1, rotate: 0,    scale: 1,
            transition: { type: 'spring', stiffness: 250, damping: 22 } },
};

/** Bouncy wave — overshoot y then settle */
export const wave: Variants = {
  hidden: { opacity: 0, y: 55, rotate: 5 },
  show:   { opacity: 1, y: 0,  rotate: 0,
            transition: { duration: 0.65, ease: easeBounce } },
};

/** Tall slide up — pure vertical */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 100 },
  show:   { opacity: 1, y: 0,
            transition: { duration: 0.7, ease: easeExpo } },
};

/** Perspective flip on Y-axis (card flip effect) */
export const flipY: Variants = {
  hidden: { opacity: 0, rotateY: -90, scale: 0.9 },
  show:   { opacity: 1, rotateY: 0,   scale: 1,
            transition: { duration: 0.7, ease: easeExpo } },
};

/** Dart in from far left at full speed */
export const dartLeft: Variants = {
  hidden: { opacity: 0, x: -180, skewX: -12 },
  show:   { opacity: 1, x: 0,    skewX: 0,
            transition: { duration: 0.55, ease: easeExpo } },
};

/** Dart in from far right at full speed */
export const dartRight: Variants = {
  hidden: { opacity: 0, x: 180, skewX: 12 },
  show:   { opacity: 1, x: 0,   skewX: 0,
            transition: { duration: 0.55, ease: easeExpo } },
};

/** Gentle float down from above with blur */
export const dropIn: Variants = {
  hidden: { opacity: 0, y: -60, scale: 0.96, filter: 'blur(8px)' },
  show:   { opacity: 1, y: 0,   scale: 1,    filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

// ── Stagger containers ────────────────────────────────────────────

export const staggerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const staggerNormal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

export const staggerSlow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

// ── Utility factory ───────────────────────────────────────────────

export function withDelay(variant: Variants, delay: number): Variants {
  const show = (variant as any).show ?? {};
  return {
    ...variant,
    show: {
      ...show,
      transition: { ...(show.transition ?? {}), delay },
    },
  };
}
