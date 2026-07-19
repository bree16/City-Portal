import { useState } from 'react';
import { Home, Volume2, VolumeX, Smartphone, ChevronUp, ChevronDown } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useAudioControls } from '@/components/AudioManager';
import { buildings } from '@/data/buildings';

// ── Constants ────────────────────────────────────────────────────

const STAGE_NAMES = ['', 'Renting', 'Preparing', 'Hunting', 'Offer', 'Mortgage', 'Closing', 'Move In'];

const OBJECTIVES = [
  { stage: 1, text: 'Talk to your landlord & save for a down payment', building: 'apartment', icon: '🏠' },
  { stage: 2, text: 'Visit the Housing Counselor to get pre-qualified', building: 'counselor', icon: '📋' },
  { stage: 3, text: 'Browse homes at the Real Estate Office', building: 'realestate', icon: '🔑' },
  { stage: 4, text: "Make your offer at the Buyer's Agent office", building: 'negotiation', icon: '🤝' },
  { stage: 5, text: 'Get mortgage approval at the Community Bank', building: 'bank', icon: '🏦' },
  { stage: 6, text: 'Sign your closing papers at City Hall', building: 'closing', icon: '🏛️' },
  { stage: 7, text: 'Enjoy your new home! You did it!', building: null, icon: '🎉' },
];

// Mini-map world bounds
const MAP_MIN_X = -26;
const MAP_MAX_X = 26;
const MAP_MIN_Z = -20;
const MAP_MAX_Z = 18;
const MAP_W = 112;
const MAP_H = 80;

function worldToMap(wx: number, wz: number): { x: number; y: number } {
  return {
    x: ((wx - MAP_MIN_X) / (MAP_MAX_X - MAP_MIN_X)) * MAP_W,
    y: ((wz - MAP_MIN_Z) / (MAP_MAX_Z - MAP_MIN_Z)) * MAP_H,
  };
}

// ── Mini-map ─────────────────────────────────────────────────────

function MiniMap({ playerPosition }: { playerPosition: [number, number, number] }) {
  const px = worldToMap(playerPosition[0], playerPosition[2]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 72,
        right: 12,
        zIndex: 32,
        background: 'rgba(13,43,94,0.9)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 10,
        padding: 6,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        marginTop: 4,
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        City Map
      </div>
      <svg width={MAP_W} height={MAP_H} style={{ display: 'block', overflow: 'visible' }}>
        {/* Road grid */}
        {/* Main E-W road */}
        <rect
          x={0} y={worldToMap(0, -3).y}
          width={MAP_W} height={Math.max(4, (5 / (MAP_MAX_Z - MAP_MIN_Z)) * MAP_H)}
          fill="rgba(80,80,100,0.8)"
        />
        {/* Main N-S road */}
        <rect
          x={worldToMap(-3, 0).x} y={0}
          width={Math.max(4, (4 / (MAP_MAX_X - MAP_MIN_X)) * MAP_W)} height={MAP_H}
          fill="rgba(80,80,100,0.8)"
        />

        {/* Buildings */}
        {buildings.map((b) => {
          const bPos = worldToMap(b.cityPos[0], b.cityPos[2]);
          const bw = (b.footprint[0] / (MAP_MAX_X - MAP_MIN_X)) * MAP_W;
          const bh = (b.footprint[1] / (MAP_MAX_Z - MAP_MIN_Z)) * MAP_H;
          return (
            <rect
              key={b.id}
              x={bPos.x - bw / 2}
              y={bPos.y - bh / 2}
              width={bw}
              height={bh}
              fill={b.stageFor === null ? '#3A6A3A' : b.color}
              rx={1.5}
              opacity={0.85}
            />
          );
        })}

        {/* Player position dot */}
        <circle cx={px.x} cy={px.y} r={4} fill="#D4A843" opacity={0.95} />
        <circle cx={px.x} cy={px.y} r={6} fill="none" stroke="#D4A843" strokeWidth={1} opacity={0.5} />
      </svg>
    </div>
  );
}

// ── Objective Card ───────────────────────────────────────────────

function ObjectiveCard({ stage }: { stage: number }) {
  const obj = OBJECTIVES.find((o) => o.stage === stage) ?? OBJECTIVES[0];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 16px',
        borderRadius: 20,
        background: 'rgba(13,43,94,0.92)',
        border: '1px solid rgba(212,168,67,0.35)',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        maxWidth: '90vw',
      }}
    >
      <span>{obj.icon}</span>
      <span style={{ color: '#D4A843', fontWeight: 700, marginRight: 2 }}>Next:</span>
      <span style={{ color: 'rgba(255,255,255,0.85)' }}>{obj.text}</span>
    </div>
  );
}

// ── Main HUD ─────────────────────────────────────────────────────

export function GameHUD() {
  const { stage, month, cash, savings, creditScore, resetGame, characterAppearance, togglePhone, phoneOpen, lifeEventLog, currentLocation, playerPosition } = useGameStore();
  const { muted, toggleMute } = useAudioControls();

  const playerName = characterAppearance.name?.trim() || 'Player';
  const [logExpanded, setLogExpanded] = useState(false);
  const isCity = currentLocation === 'city';

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
      {/* ── Main bar ── */}
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

        {/* Center: location + stage + month */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
            {isCity ? '🗺️ Newport News City' : `📍 Month ${month} of 36`}
          </div>
          <div
            style={{
              padding: '2px 12px',
              borderRadius: 20,
              background: isCity ? '#0A8F7E' : '#D4A843',
              color: '#0D2B5E',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            {isCity ? 'Open City' : `Stage ${stage}: ${STAGE_NAMES[stage]}`}
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

      {/* ── Stage progress dots (hidden in city view) ── */}
      {!isCity && (
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
      )}

      {/* ── Phone button — fixed bottom-right ── */}
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

      {/* ── Life Events Log — fixed bottom-left ── */}
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

      {/* ── Mini-map (only in city) ── */}
      {isCity && <MiniMap playerPosition={playerPosition} />}

      {/* ── Objective card (only in city) ── */}
      {isCity && <ObjectiveCard stage={stage} />}
    </div>
  );
}
