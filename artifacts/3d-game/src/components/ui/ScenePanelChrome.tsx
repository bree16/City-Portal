import { getAudioEngine } from '@/hooks/useGameAudio';

/**
 * Small comic-styled close (✕) button docked to the top-right corner of an
 * in-world scene panel. The parent panel must be `position: relative`.
 */
export function ScenePanelClose({ onClose, title = 'Close' }: { onClose: () => void; title?: string }) {
  return (
    <button
      onPointerDown={(e) => { e.stopPropagation(); }}
      onClick={(e) => { e.stopPropagation(); getAudioEngine().play('click'); onClose(); }}
      title={title}
      aria-label={title}
      style={{
        position: 'absolute',
        top: -10,
        right: -10,
        zIndex: 5,
        width: 22,
        height: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ff007f',
        color: '#fff',
        border: '2px solid #09070a',
        borderRadius: 0,
        boxShadow: '2px 2px 0px #ffea00',
        cursor: 'pointer',
        fontFamily: 'var(--display-font)',
        fontWeight: 800,
        fontSize: 12,
        lineHeight: 1,
      }}
    >
      ✕
    </button>
  );
}

/**
 * Compact reopen chip shown in place of a closed in-world panel so the panel
 * is always reachable again. Comic UI theme.
 */
export function ScenePanelReopen({ onOpen, label }: { onOpen: () => void; label: string }) {
  return (
    <div
      onPointerDown={(e) => { e.stopPropagation(); }}
      onClick={(e) => { e.stopPropagation(); getAudioEngine().play('click'); onOpen(); }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: '#09070a',
        color: '#fff',
        border: '2px solid #ffea00',
        borderRadius: 0,
        boxShadow: '3px 3px 0px #ffea00',
        cursor: 'pointer',
        fontFamily: 'var(--display-font)',
        fontWeight: 800,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
}
