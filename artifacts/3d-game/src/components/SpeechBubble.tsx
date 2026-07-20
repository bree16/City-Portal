import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { stageDialogue } from '@/data/dialogue';
import { getAudioEngine } from '@/hooks/useGameAudio';

/** Replace {name} and {pronoun}/{pronouns} tokens in dialogue text with the player's values. */
function interpolate(text: string, name: string, pronouns: string): string {
  return text
    .replace(/\{name\}/gi, name)
    .replace(/\{pronouns?\}/gi, pronouns);
}

export function SpeechBubble() {
  const { stage, activeDialogue, advanceDialogue, closeDialogue, completeInteraction, characterAppearance } =
    useGameStore();

  if (!activeDialogue) return null;

  const npcLines = stageDialogue[stage]?.[activeDialogue.npcId] ?? [];
  const line = npcLines[activeDialogue.lineIndex];
  const isLast = activeDialogue.lineIndex >= npcLines.length - 1;

  if (!line) {
    closeDialogue();
    return null;
  }

  const playerName = characterAppearance.name?.trim() || 'Player';
  const playerPronouns = characterAppearance.pronouns || 'They/Them';

  const displayText = interpolate(line.text, playerName, playerPronouns);
  const displayTip = line.tip ? interpolate(line.tip, playerName, playerPronouns) : undefined;

  const handleNext = () => {
    getAudioEngine().play('click');
    if (isLast) {
      completeInteraction(activeDialogue.npcId);
      closeDialogue();
    } else {
      advanceDialogue();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeDialogue.npcId + '-' + activeDialogue.lineIndex}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          width: '100%',
          maxWidth: 520,
          padding: '0 16px',
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          className="glass-panel-strong glass-sheen"
          style={{
            padding: 20,
            position: 'relative',
          }}
        >
          {/* Glass pointer — small rotated square */}
          <div
            style={{
              position: 'absolute',
              top: -7,
              left: '50%',
              width: 14,
              height: 14,
              transform: 'translateX(-50%) rotate(45deg)',
              background: 'rgba(21, 38, 76, 0.9)',
              borderTop: '1px solid rgba(255,255,255,0.14)',
              borderLeft: '1px solid rgba(255,255,255,0.14)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            {/* Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: line.speaker === 'You' ? 'var(--gold-grad)' : 'var(--teal-grad)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: line.speaker === 'You' ? 'var(--ink)' : '#fff',
                fontWeight: 800,
                fontSize: 16,
                flexShrink: 0,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              {line.speaker === 'You' ? playerName.charAt(0).toUpperCase() : line.speaker.charAt(0)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: line.speaker === 'You' ? 'var(--gold)' : 'var(--teal)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                {line.speaker === 'You' ? playerName : line.speaker}
              </div>
              <p style={{ fontSize: 14, color: 'var(--glass-text)', lineHeight: 1.55, margin: 0 }}>
                {displayText}
              </p>
              {displayTip && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '8px 12px',
                    borderRadius: 0,
                    background: 'rgba(255,234,0,0.12)',
                    border: 'var(--glass-border-gold)',
                    fontSize: 12,
                    color: 'var(--gold)',
                    lineHeight: 1.4,
                  }}
                >
                  💡 {displayTip}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {npcLines.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === activeDialogue.lineIndex ? 16 : 6,
                    height: 6,
                    borderRadius: 0,
                    background: i <= activeDialogue.lineIndex ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className={isLast ? 'glass-btn-primary' : 'glass-btn-accent'}
              style={{
                padding: '8px 20px',
                fontSize: 13,
              }}
            >
              {isLast ? 'Got it!' : 'Continue →'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
