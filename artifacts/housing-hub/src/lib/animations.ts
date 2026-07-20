import { type Variants } from 'framer-motion';

const easeExpo = [0.22, 1, 0.36, 1] as const;

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
