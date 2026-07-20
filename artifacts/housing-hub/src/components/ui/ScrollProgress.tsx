import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin gradient bar pinned to the very top of the viewport that fills as you scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'linear-gradient(90deg, #0A8F7E 0%, #D4AF37 55%, #14B8A6 100%)',
        scaleX,
        transformOrigin: '0%',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}
