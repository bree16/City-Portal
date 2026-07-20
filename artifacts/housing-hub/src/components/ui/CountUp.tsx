import { useRef, useEffect } from 'react';
import { useInView, animate } from 'framer-motion';

interface Props {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

/**
 * Animates a number from 0 → end when it scrolls into view.
 * Renders as a plain <span> so it can be styled via className.
 */
export function CountUp({ end, prefix = '', suffix = '', duration = 1.8, className, decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const el = ref.current;
    const ctrl = animate(0, end, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        el.textContent = `${prefix}${decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString()}${suffix}`;
      },
    });
    return () => ctrl.stop();
  }, [isInView, end, duration, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
