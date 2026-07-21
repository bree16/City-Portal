import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import nnLogo from '@assets/image_1784598308543.png';

interface AnimatedLogoProps {
  /** True when the navbar is on a light background (scrolled or non-homepage) */
  isLight: boolean;
  className?: string;
}

/**
 * Animated Newport News logo.
 *
 * Intro: liquid-paint reveal (clip-path + opacity, 2.2s ease-out).
 * Hover: soft shimmer sweep + gentle float.
 * prefers-reduced-motion: static image, no animation.
 * WCAG 2.1 AA: no flash, always readable, aria-hidden on decorative overlay.
 */
export function AnimatedLogo({ isLight, className = '' }: AnimatedLogoProps) {
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReduced) { setIntroComplete(true); return; }
    timerRef.current = setTimeout(() => setIntroComplete(true), 2400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [prefersReduced]);

  // Static fallback for reduced-motion users
  if (prefersReduced) {
    return (
      <img
        src={nnLogo}
        alt="Newport News"
        height={38}
        className={`h-[38px] w-auto object-contain rounded-md ${className}`}
        draggable={false}
      />
    );
  }

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center rounded-md overflow-hidden select-none ${className}`}
      style={{ height: 38 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* ── Base logo image ── */}
      <motion.img
        src={nnLogo}
        alt="Newport News"
        height={38}
        className="h-[38px] w-auto object-contain rounded-md relative z-10"
        draggable={false}
        /* Intro: liquid reveal — rises up from clip-path, fades in */
        initial={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0% round 6px)', scale: 0.94 }}
        animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 6px)', scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── Hover: shimmer sweep ── */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 z-20 pointer-events-none rounded-md"
        style={{
          background:
            'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)',
          backgroundSize: '220% 100%',
        }}
        animate={
          introComplete && hovered
            ? { backgroundPosition: ['200% center', '-50% center'], opacity: [0, 1, 0] }
            : { opacity: 0 }
        }
        transition={
          introComplete && hovered
            ? { duration: 0.75, ease: 'easeOut' }
            : { duration: 0.2 }
        }
      />

      {/* ── Hover: gentle float ── */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        animate={introComplete && hovered ? { y: -2 } : { y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      />
    </motion.div>
  );
}
