import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';

const STAGE_NAMES = [
  '',
  'Renting & Saving',
  'Preparing to Buy',
  'House Hunting',
  'Offer & Negotiation',
  'Mortgage Approval',
  'Closing Day',
  'Move In!',
  'Home Life',
];

const STAGE_SUBTITLES = [
  '',
  'Build your savings and improve your credit score',
  'Work with a housing counselor to get ready',
  'Explore Newport News neighborhoods',
  'Make an offer on your dream home',
  'Get approved for your mortgage',
  'Sign the papers and get your keys!',
  'Furnish and decorate your new home!',
  'Build equity and grow your wealth',
];

const STAGE_ICONS: GameIconName[] = ['warning', 'home', 'documents', 'neighborhood', 'handshake', 'bank', 'celebration', 'furniture', 'sparkles'];

export function SceneTransition() {
  const { transitioning, stage } = useGameStore();

  return (
    <AnimatePresence>
      {transitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: '#09070a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: 56, marginBottom: 16, display: 'flex', justifyContent: 'center' }}><GameIcon name={STAGE_ICONS[stage] || 'warning'} size={64} color="#fff" /></div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--gold)',
                
                letterSpacing: 3,
                marginBottom: 12,
              }}
            >
              {stage === 8 ? 'Stage 8 — Post-Purchase' : `Stage ${stage} of 7`}
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
              {STAGE_NAMES[stage]}
            </div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)' }}>
              {STAGE_SUBTITLES[stage]}
            </div>

            {/* Loading dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 32 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
