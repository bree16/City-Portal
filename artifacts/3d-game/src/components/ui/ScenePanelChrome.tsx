import { getAudioEngine } from '@/hooks/useGameAudio';
import { GameIcon, GameIconName } from './GameIcon';

/**
 * Small close (✕) button docked to the top-right corner of an
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
        top: -16,
        right: -16,
        zIndex: 5,
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--navy)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        transition: 'all 0.2s var(--glass-ease)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.background = 'var(--navy-dark)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background = 'var(--navy)';
      }}
    >
      <GameIcon name="close" size={18} />
    </button>
  );
}

/**
 * Compact reopen chip shown in place of a closed in-world panel so the panel
 * is always reachable again.
 */
export function ScenePanelReopen({ onOpen, label, icon }: { onOpen: () => void; label: string; icon?: GameIconName }) {
  return (
    <div
      onPointerDown={(e) => { e.stopPropagation(); }}
      onClick={(e) => { e.stopPropagation(); getAudioEngine().play('click'); onOpen(); }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: 'var(--navy-glass)',
        backdropFilter: 'var(--glass-blur)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '9999px',
        boxShadow: 'var(--glass-shadow)',
        cursor: 'pointer',
        fontFamily: 'var(--display-font)',
        fontWeight: 600,
        fontSize: 14,
        transition: 'all 0.2s var(--glass-ease)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--teal)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--navy-glass)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {icon && <GameIcon name={icon} size={18} color="var(--gold)" />}
      {label}
    </div>
  );
}
