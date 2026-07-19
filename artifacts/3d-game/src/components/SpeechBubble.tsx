import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { stageDialogue } from '@/data/dialogue';

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
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
            border: '3px solid #0D2B5E',
            position: 'relative',
          }}
        >
          {/* Triangle pointer */}
          <div
            style={{
              position: 'absolute',
              top: -14,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '13px solid transparent',
              borderRight: '13px solid transparent',
              borderBottom: '14px solid #0D2B5E',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '11px solid transparent',
              borderRight: '11px solid transparent',
              borderBottom: '12px solid #fff',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            {/* Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: line.speaker === 'You' ? '#D4A843' : '#0A8F7E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {line.speaker === 'You' ? playerName.charAt(0).toUpperCase() : line.speaker.charAt(0)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: line.speaker === 'You' ? '#D4A843' : '#0A8F7E', marginBottom: 4 }}>
                {line.speaker === 'You' ? playerName : line.speaker}
              </div>
              <p style={{ fontSize: 14, color: '#1a1a2e', lineHeight: 1.55, margin: 0 }}>
                {displayText}
              </p>
              {displayTip && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'rgba(212,168,67,0.1)',
                    borderLeft: '3px solid #D4A843',
                    fontSize: 12,
                    color: '#8B6914',
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
                    borderRadius: 3,
                    background: i <= activeDialogue.lineIndex ? '#0D2B5E' : '#ddd',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              style={{
                padding: '8px 20px',
                borderRadius: 10,
                background: isLast ? '#D4A843' : '#0D2B5E',
                color: isLast ? '#0D2B5E' : '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
                transition: 'opacity 0.15s',
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
