import { useState } from 'react';
import { Home, Volume2, VolumeX, Smartphone, ChevronUp, ChevronDown } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useAudioControls } from '@/components/AudioManager';

const STAGE_NAMES = [
  '',
  'Renting',
  'Preparing',
  'Hunting',
  'Offer',
  'Mortgage',
  'Closing',
  'Move In',
];

export function GameHUD() {
  const { stage, month, cash, savings, creditScore, resetGame, characterAppearance, togglePhone, phoneOpen, lifeEventLog } = useGameStore();
  const { muted, toggleMute } = useAudioControls();

  const playerName = characterAppearance.name?.trim() || 'Player';
  const [logExpanded, setLogExpanded] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        fontFamily: 'Inter, sans-serif',
        pointerEvents: 'none',
      }}
    >
      {/* Main bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'rgba(13,43,94,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          pointerEvents: 'auto',
        }}
      >
        {/* Logo + player name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#fff', padding: 5, borderRadius: 8 }}>
            <Home size={16} color="#0A8F7E" />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Newport News</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#D4A843' }}>Housing Hub</div>
          </div>
          {/* Player name badge */}
          <div
            style={{
              marginLeft: 6,
              padding: '2px 10px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              fontSize: 11,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            👤 {playerName}
          </div>
        </div>

        {/* Center: stage + month */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
            Month {month} of 36
          </div>
          <div
            style={{
              padding: '2px 12px',
              borderRadius: 20,
              background: '#D4A843',
              color: '#0D2B5E',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            Stage {stage}: {STAGE_NAMES[stage]}
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(0,0,0,0.25)',
            borderRadius: 12,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>💰</span>
            <span>${cash.toLocaleString()}</span>
          </div>
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>🏦</span>
            <span style={{ color: '#0A8F7E' }}>${savings.toLocaleString()}</span>
          </div>
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>📊</span>
            <span style={{ color: creditScore >= 650 ? '#4ade80' : '#fbbf24' }}>
              {creditScore}
            </span>
          </div>
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            title={muted ? 'Unmute' : 'Mute'}
            style={{
              background: muted ? 'rgba(212,168,67,0.18)' : 'rgba(255,255,255,0.10)',
              border: muted ? '1px solid rgba(212,168,67,0.5)' : '1px solid transparent',
              color: muted ? '#D4A843' : 'rgba(255,255,255,0.65)',
              padding: '3px 6px',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.15s',
            }}
          >
            {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
          <button
            onClick={resetGame}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Restart
          </button>
        </div>
      </div>

      {/* Phone button — fixed bottom-right */}
      <button
        onClick={togglePhone}
        title="Open Phone"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 20,
          zIndex: 35,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: phoneOpen ? '#D4A843' : 'rgba(13,43,94,0.92)',
          border: `2px solid ${phoneOpen ? '#D4A843' : 'rgba(255,255,255,0.18)'}`,
          boxShadow: phoneOpen
            ? '0 0 0 4px rgba(212,168,67,0.3), 0 8px 24px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: phoneOpen ? '#0D2B5E' : '#fff',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s',
          pointerEvents: 'auto',
        }}
      >
        <Smartphone size={22} />
      </button>

      {/* Life Events Log — fixed bottom-left */}
      {lifeEventLog.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: 16,
            zIndex: 35,
            fontFamily: 'Inter, sans-serif',
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={() => setLogExpanded((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 20,
              background: 'rgba(13,43,94,0.92)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            📋 Life Events
            {logExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
          {logExpanded && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: 6,
                minWidth: 200,
                background: 'rgba(13,43,94,0.96)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '10px 12px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Recent Events
              </div>
              {lifeEventLog.map((title, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 11,
                    color: i === 0 ? '#D4A843' : 'rgba(255,255,255,0.55)',
                    padding: '4px 0',
                    borderBottom: i < lifeEventLog.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    fontWeight: i === 0 ? 700 : 400,
                  }}
                >
                  {i === 0 ? '● ' : '○ '}{title}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stage progress dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          padding: '5px 0',
          background: 'rgba(13,43,94,0.75)',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div
            key={s}
            style={{
              height: 6,
              width: s === stage ? 22 : 8,
              borderRadius: 3,
              background:
                s < stage ? '#0A8F7E' : s === stage ? '#D4A843' : 'rgba(255,255,255,0.18)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
