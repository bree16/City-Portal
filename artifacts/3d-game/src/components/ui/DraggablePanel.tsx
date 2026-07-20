import { useState, useRef, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';
import { getAudioEngine } from '@/hooks/useGameAudio';
import { ScenePanelReopen } from './ScenePanelChrome';

// Global map to persist positions during the session
const panelPositions = new Map<string, { x: number; y: number }>();

export interface DraggablePanelProps {
  id: string;
  title: string;
  icon?: GameIconName;
  defaultPosition?: { x: number; y: number };
  children: ReactNode;
  onClose?: () => void;
  startMinimized?: boolean;
}

export function DraggablePanel({
  id,
  title,
  icon,
  defaultPosition = { x: 20, y: 20 },
  children,
  onClose,
  startMinimized = false,
}: DraggablePanelProps) {
  const [position, setPosition] = useState(() => panelPositions.get(id) || defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [minimized, setMinimized] = useState(startMinimized);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const panelStartPos = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (e.target instanceof HTMLElement && e.target.closest('button')) {
      return; // Don't drag if clicking a button
    }
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    panelStartPos.current = { ...position };
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    const newX = panelStartPos.current.x + dx;
    const newY = panelStartPos.current.y + dy;
    
    // Constrain to viewport loosely
    const constrainedX = Math.max(0, Math.min(window.innerWidth - 100, newX));
    const constrainedY = Math.max(0, Math.min(window.innerHeight - 40, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      panelPositions.set(id, position);
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
  };

  if (!mounted) return null;

  if (minimized) {
    return createPortal(
      <div style={{ position: 'fixed', left: position.x, top: position.y, zIndex: 40 }}>
        <ScenePanelReopen
          onOpen={() => {
            getAudioEngine().play('click');
            setMinimized(false);
          }}
          label={title}
          icon={icon}
        />
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 40,
        pointerEvents: 'auto',
      }}
      className="glass-panel"
    >
      {/* Drag Handle / Title Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          cursor: isDragging ? 'grabbing' : 'grab',
          borderTopLeftRadius: 'var(--glass-radius)',
          borderTopRightRadius: 'var(--glass-radius)',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: 'var(--gold)', pointerEvents: 'none' }}>
          {icon && <GameIcon name={icon} size={18} />}
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              getAudioEngine().play('click');
              setMinimized(true);
            }}
            style={{ color: 'var(--glass-text-dim)', cursor: 'pointer', display: 'flex' }}
            title="Minimize"
          >
            <GameIcon name="chevron-down" size={18} />
          </button>
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                getAudioEngine().play('click');
                onClose();
              }}
              style={{ color: 'var(--glass-text-dim)', cursor: 'pointer', display: 'flex' }}
              title="Close"
            >
              <GameIcon name="close" size={18} />
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div style={{ padding: '12px', overflow: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        {children}
      </div>
    </div>,
    document.body
  );
}
