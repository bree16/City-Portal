import React from 'react';
import { motion } from 'framer-motion';
import * as anims from '@/lib/animations';

export type AnimVariant =
  | 'fadeUp' | 'fadeDown' | 'fadeIn'
  | 'slideLeft' | 'slideRight' | 'slideUp'
  | 'scaleIn' | 'scaleGentle'
  | 'blurReveal' | 'flipUp' | 'flipY'
  | 'staggerFast' | 'staggerNormal' | 'staggerSlow'
  // Expressive
  | 'swoopIn' | 'popIn' | 'rollIn' | 'rollRight'
  | 'springUp' | 'glowFade' | 'tiltReveal' | 'magnetIn'
  | 'wipeUp' | 'wipeRight' | 'spinReveal' | 'wave'
  | 'dartLeft' | 'dartRight' | 'dropIn';

const MAP: Record<AnimVariant, any> = {
  fadeUp:        anims.fadeUp,
  fadeDown:      anims.fadeDown,
  fadeIn:        anims.fadeIn,
  slideLeft:     anims.slideLeft,
  slideRight:    anims.slideRight,
  slideUp:       anims.slideUp,
  scaleIn:       anims.scaleIn,
  scaleGentle:   anims.scaleGentle,
  blurReveal:    anims.blurReveal,
  flipUp:        anims.flipUp,
  flipY:         anims.flipY,
  staggerFast:   anims.staggerFast,
  staggerNormal: anims.staggerNormal,
  staggerSlow:   anims.staggerSlow,
  swoopIn:       anims.swoopIn,
  popIn:         anims.popIn,
  rollIn:        anims.rollIn,
  rollRight:     anims.rollRight,
  springUp:      anims.springUp,
  glowFade:      anims.glowFade,
  tiltReveal:    anims.tiltReveal,
  magnetIn:      anims.magnetIn,
  wipeUp:        anims.wipeUp,
  wipeRight:     anims.wipeRight,
  spinReveal:    anims.spinReveal,
  wave:          anims.wave,
  dartLeft:      anims.dartLeft,
  dartRight:     anims.dartRight,
  dropIn:        anims.dropIn,
};

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: AnimVariant;
  delay?: number;
  once?: boolean;
  margin?: string;
}

/** Scroll-triggered animation wrapper. Plays once by default. */
export function AnimatedSection({
  children,
  className,
  variant = 'fadeUp',
  delay = 0,
  once = true,
  margin = '-80px',
}: Props) {
  const base = MAP[variant];
  const variants = delay > 0 ? anims.withDelay(base, delay) : base;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children must use AnimatedSection or motion variants. */
export function StaggerSection({
  children,
  className,
  speed = 'normal',
  delay = 0,
  once = true,
  margin = '-80px',
}: {
  children: React.ReactNode;
  className?: string;
  speed?: 'fast' | 'normal' | 'slow';
  delay?: number;
  once?: boolean;
  margin?: string;
}) {
  const base =
    speed === 'fast' ? anims.staggerFast
    : speed === 'slow' ? anims.staggerSlow
    : anims.staggerNormal;
  const variants = delay > 0 ? anims.withDelay(base, delay) : base;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Single animated child item — use inside StaggerSection. */
export function StaggerItem({
  children,
  className,
  variant = 'fadeUp',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: AnimVariant;
}) {
  return (
    <motion.div variants={MAP[variant]} className={className}>
      {children}
    </motion.div>
  );
}
