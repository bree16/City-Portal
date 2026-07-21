import React from 'react';
import { useReducedMotion } from 'framer-motion';

interface AnimatedLogoProps {
  /** True when navbar is on a light/white background */
  isLight: boolean;
  className?: string;
}

/**
 * Newport News logo — rebuilt as inline SVG so it has a transparent background.
 * Colors continuously flow through the brand palette (navy → coral → teal → gold).
 * Hover: animation speeds up + gentle shimmer.
 * prefers-reduced-motion: static colors, no animation.
 */
export function AnimatedLogo({ isLight, className = '' }: AnimatedLogoProps) {
  const prefersReduced = useReducedMotion();

  // Adapt text color to navbar state
  const textNavy  = isLight ? '#0A2540' : '#ffffff';
  const textCoral = isLight ? '#E05C3A' : '#FF7A5C';

  return (
    <svg
      viewBox="0 0 176 46"
      height={42}
      aria-label="Newport News"
      role="img"
      className={`select-none ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* ── Flowing gradient that shifts across the brand palette ── */}
        <linearGradient id="nn-flow" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#E05C3A" />   {/* coral */}
          <stop offset="33%"  stopColor="#00C2D4" />   {/* teal */}
          <stop offset="66%"  stopColor="#F5C518" />   {/* gold */}
          <stop offset="100%" stopColor="#E05C3A" />   {/* back to coral */}

          {!prefersReduced && (
            <>
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-60 0; 60 0; -60 0"
                dur="3.4s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
              />
            </>
          )}
        </linearGradient>

        {/* Gradient for the hover / accent dots */}
        <radialGradient id="nn-dot" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#F5C518" />
          <stop offset="100%" stopColor="#E05C3A" />
          {!prefersReduced && (
            <animate
              attributeName="fx"
              values="30%;70%;30%"
              dur="2.8s"
              repeatCount="indefinite"
            />
          )}
        </radialGradient>

        {/* Clip so the mark stays inside its box */}
        <clipPath id="nn-mark-clip">
          <rect x="0" y="0" width="46" height="46" rx="9" />
        </clipPath>
      </defs>

      {/* ─────────────────────────────────────────────
          ICON MARK  (46 × 46, transparent background)
          ───────────────────────────────────────────── */}
      <g clipPath="url(#nn-mark-clip)">
        {/* Subtle dark background only when on light navbars, so colors read clearly */}
        {isLight && (
          <rect x="0" y="0" width="46" height="46" rx="9" fill="rgba(10,37,64,0.08)" />
        )}

        {/* Main teal sweep — wide curved stroke forming the "n" arch */}
        <path
          d="M 7 38 C 7 24 16 12 26 9 C 32 7 38 10 40 15"
          fill="none"
          stroke="url(#nn-flow)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Red diagonal slash — crosses the teal curve */}
        <path
          d="M 10 37 L 36 9"
          fill="none"
          stroke="url(#nn-flow)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Coral lower foot of the "n" */}
        <path
          d="M 25 9 C 30 11 36 20 36 30 L 36 38"
          fill="none"
          stroke="url(#nn-flow)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Gold trailing dots */}
        <circle cx="38" cy="8"  r="2.8" fill="url(#nn-dot)" />
        <circle cx="42" cy="14" r="2.0" fill="url(#nn-dot)" opacity="0.85" />
        <circle cx="44" cy="20" r="1.4" fill="url(#nn-dot)" opacity="0.65" />
      </g>

      {/* ──────────────────────────────────────
          WORDMARK  "newport" / "news"
          ────────────────────────────────────── */}
      {/* "newport" */}
      <text
        x="54"
        y="21"
        fontFamily='"Inter", "Segoe UI", system-ui, sans-serif'
        fontWeight="800"
        fontSize="17"
        letterSpacing="-0.4"
        fill={textNavy}
        style={{ transition: 'fill 0.3s' }}
      >
        newport
      </text>

      {/* "news" — coral, slightly larger */}
      <text
        x="54"
        y="40"
        fontFamily='"Inter", "Segoe UI", system-ui, sans-serif'
        fontWeight="800"
        fontSize="19"
        letterSpacing="-0.5"
        fill={textCoral}
        style={{ transition: 'fill 0.3s' }}
      >
        news
      </text>

      {/* ── Hover shimmer overlay ── */}
      {!prefersReduced && (
        <rect
          x="0" y="0" width="46" height="46" rx="9"
          fill="white"
          opacity="0"
          style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
        >
          <animate
            attributeName="opacity"
            values="0;0.18;0"
            dur="2s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
        </rect>
      )}
    </svg>
  );
}
