import { useState } from 'react';
import { Home, Volume2, VolumeX, Smartphone, ChevronUp, ChevronDown, LogOut } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useAudioControls } from '@/components/AudioManager';
import { getAudioEngine } from '@/hooks/useGameAudio';
import { buildings } from '@/data/buildings';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';
import { DraggablePanel } from '@/components/ui/DraggablePanel';

// ── Constants ────────────────────────────────────────────────────

const STAGE_NAMES = ['', 'Renting', 'Preparing', 'Hunting', 'Offer', 'Mortgage', 'Closing', 'Move In'];

const OBJECTIVES: Array<{ stage: number; text: string; building: string | null; icon: GameIconName }> = [
  { stage: 1, text: 'Talk to your landlord & save for a down payment', building: 'apartment', icon: 'home' },
  { stage: 2, text: 'Visit the Housing Counselor to get pre-qualified', building: 'counselor', icon: 'documents' },
  { stage: 3, text: 'Browse homes at the Real Estate Office', building: 'realestate', icon: 'keys' },
  { stage: 4, text: "Make your offer at the Buyer's Agent office", building: 'negotiation', icon: 'handshake' },
  { stage: 5, text: 'Get mortgage approval at the Community Bank', building: 'bank', icon: 'bank' },
  { stage: 6, text: 'Sign your closing papers at City Hall', building: 'closing', icon: 'city-hall' },
  { stage: 7, text: 'Enjoy your new home! You did it!', building: null, icon: 'celebration' },
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

function MiniMap({ playerPosition, onClose }: { playerPosition: [number, number, number]; onClose: () => void }) {
  const px = worldToMap(playerPosition[0], playerPosition[2]);

  return (
    <DraggablePanel
      id="minimap"
      title="City Map"
      icon="map"
      defaultPosition={{ x: window.innerWidth - MAP_W - 40, y: 80 }}
      onClose={onClose}
    >
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
        <circle cx={px.x} cy={px.y} r={4} fill="var(--gold)" opacity={0.95} />
        <circle cx={px.x} cy={px.y} r={6} fill="none" stroke="var(--gold)" strokeWidth={1} opacity={0.5} />
      </svg>
    </DraggablePanel>
  );
}

// ── Objective Card ───────────────────────────────────────────────

function ObjectiveCard({ stage, onClose }: { stage: number; onClose: () => void }) {
  const obj = OBJECTIVES.find((o) => o.stage === stage) ?? OBJECTIVES[0];

  return (
    <DraggablePanel
      id="objective"
      title="Objective"
      icon="target"
      defaultPosition={{ x: window.innerWidth / 2 - 150, y: window.innerHeight - 80 }}
      onClose={onClose}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
        <GameIcon name={obj.icon} size={16} />
        <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 11, letterSpacing: 0.6, marginRight: 2 }}>Next</span>
        <span style={{ color: 'var(--glass-text)' }}>{obj.text}</span>
      </div>
    </DraggablePanel>
  );
}

// ── Main HUD ─────────────────────────────────────────────────────

export function GameHUD() {
  const { stage, month, cash, savings, creditScore, resetGame, quitToMenu, characterAppearance, togglePhone, phoneOpen, lifeEventLog, currentLocation, playerPosition } = useGameStore();
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const { muted, toggleMute, musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useAudioControls();

  const playerName = characterAppearance.name?.trim() || 'Player';
  const [logExpanded, setLogExpanded] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showObjective, setShowObjective] = useState(true);
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
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          margin: '10px 12px 0',
          pointerEvents: 'auto',
        }}
      >
        {/* Logo + player name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'var(--teal-grad)', padding: 6, borderRadius: 0, display: 'flex', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' }}>
            <Home size={16} color="#fff" />
          </div>
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--glass-text)' }}>Newport News</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', letterSpacing: 0.8 }}>Housing Hub</div>
          </div>
          <div
            className="glass-chip"
            style={{
              marginLeft: 6,
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--glass-text-dim)',
              maxWidth: 130,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GameIcon name="player" size={14} /> {playerName}
          </div>
        </div>

        {/* Center: location + stage + month */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ fontSize: 10, color: 'var(--glass-text-dim)', fontWeight: 600, letterSpacing: 0.6, display: 'flex', alignItems: 'center', gap: 4 }}>
            {isCity ? <><GameIcon name="map" size={12} /> Newport News City</> : <><GameIcon name="pin" size={12} /> Month {month} of 36</>}
          </div>
          <div
            style={{
              padding: '3px 14px',
              borderRadius: 0,
              background: isCity ? 'var(--teal-grad)' : 'var(--gold-grad)',
              color: 'var(--ink)',
              fontSize: 11,
              fontWeight: 800,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
            }}
          >
            {isCity ? 'Open City' : `Stage ${stage}: ${STAGE_NAMES[stage]}`}
          </div>
        </div>

        {/* Stats */}
        <div
          className="glass-chip"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--glass-text)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <GameIcon name="budget" size={14} color="var(--gold)" />
            <span>${cash.toLocaleString()}</span>
          </div>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.16)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <GameIcon name="bank" size={14} color="var(--teal)" />
            <span style={{ color: 'var(--teal)' }}>${savings.toLocaleString()}</span>
          </div>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.16)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <GameIcon name="chart" size={14} color={creditScore >= 650 ? '#4ade80' : '#fbbf24'} />
            <span style={{ color: creditScore >= 650 ? '#4ade80' : '#fbbf24' }}>
              {creditScore}
            </span>
          </div>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.16)' }} />
          {/* Volume controls: mute toggle + slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={toggleMute}
              title={muted ? 'Unmute' : 'Mute'}
              className="glass-btn"
              style={{
                ...(muted
                  ? { background: 'rgba(212,168,67,0.18)', borderColor: 'rgba(212,168,67,0.5)', color: 'var(--gold)' }
                  : { color: 'var(--glass-text-dim)' }),
                padding: '4px 7px',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--glass-text-faint)', width: 28, textAlign: 'right', letterSpacing: 0.5 }}>
                  Music
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={muted ? 0 : Math.round(musicVolume * 100)}
                  onChange={(e) => setMusicVolume(Number(e.target.value) / 100)}
                  title={`Music volume: ${muted ? 0 : Math.round(musicVolume * 100)}%`}
                  style={{
                    width: 64,
                    height: 4,
                    cursor: 'pointer',
                    accentColor: 'var(--gold)',
                    opacity: 0.85,
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--glass-text-faint)', width: 28, textAlign: 'right', letterSpacing: 0.5 }}>
                  SFX
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={muted ? 0 : Math.round(sfxVolume * 100)}
                  onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
                  title={`Sound effects volume: ${muted ? 0 : Math.round(sfxVolume * 100)}%`}
                  style={{
                    width: 64,
                    height: 4,
                    cursor: 'pointer',
                    accentColor: 'var(--teal)',
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.16)' }} />
          <button
            onClick={() => { getAudioEngine().play('click'); resetGame(); }}
            className="glass-btn"
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
              padding: '4px 10px',
            }}
          >
            Restart
          </button>
          <button
            onClick={() => { getAudioEngine().play('click'); setShowQuitConfirm(true); }}
            title="Quit to Menu"
            className="glass-btn"
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <LogOut size={11} />
            Quit to Menu
          </button>
        </div>
      </div>

      {/* ── Quit confirmation dialog ── */}
      {showQuitConfirm && (
        <div
          className="glass-anim-fade"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'rgba(9,7,10,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowQuitConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-strong glass-sheen glass-anim-in"
            style={{
              padding: '24px 28px',
              maxWidth: 340,
              width: '90%',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8, display: 'flex', justifyContent: 'center' }}><GameIcon name="exit" size={32} color="rgba(255,255,255,0.2)" /></div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--glass-text)', marginBottom: 8 }}>
              Quit to Menu?
            </div>
            <div style={{ fontSize: 13, color: 'var(--glass-text-dim)', lineHeight: 1.5, marginBottom: 20 }}>
              You'll return to the character screen. Your progress is saved automatically, so you can continue later — or start fresh.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => { getAudioEngine().play('click'); setShowQuitConfirm(false); }}
                className="glass-btn"
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  getAudioEngine().play('click');
                  setShowQuitConfirm(false);
                  quitToMenu();
                }}
                className="glass-btn-primary"
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                Quit to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage progress dots (hidden in city view) ── */}
      {!isCity && (
        <div
          className="glass-chip glass-anim-in"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            margin: '8px auto 0',
            width: 'fit-content',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              style={{
                height: 6,
                width: s === stage ? 22 : 8,
                borderRadius: 0,
                background:
                  s < stage ? 'var(--teal)' : s === stage ? 'var(--gold)' : 'rgba(255,255,255,0.18)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Phone button — fixed bottom-right ── */}
      <button
        onClick={() => { getAudioEngine().play('click'); togglePhone(); }}
        title="Open Phone"
        className={phoneOpen ? 'glass-btn-primary' : 'glass-btn'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 20,
          zIndex: 35,
          width: 52,
          height: 52,
          borderRadius: '50%',
          ...(phoneOpen
            ? { boxShadow: '0 0 0 4px rgba(212,168,67,0.3), 0 8px 24px rgba(9,7,10,0.45), inset 0 1px 0 rgba(255,255,255,0.4)' }
            : {}),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: phoneOpen ? 'var(--ink)' : 'var(--glass-text)',
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
            className="glass-chip"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              color: 'var(--glass-text-dim)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <GameIcon name="documents" size={14} /> Life Events
            {logExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
          {logExpanded && (
            <div
              className="glass-panel glass-anim-in"
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: 8,
                minWidth: 200,
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--glass-text-faint)', letterSpacing: 1, marginBottom: 8 }}>
                Recent Events
              </div>
              {lifeEventLog.map((title, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12,
                    color: i === 0 ? 'var(--gold)' : 'var(--glass-text-dim)',
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
      {isCity && showMiniMap && <MiniMap playerPosition={playerPosition} onClose={() => setShowMiniMap(false)} />}

      {/* ── Objective card (only in city) ── */}
      {isCity && showObjective && <ObjectiveCard stage={stage} onClose={() => setShowObjective(false)} />}

      {/* ── Reopen chips for closed HUD panels (only in city) ── */}
      {isCity && (!showMiniMap || !showObjective) && (
        <div
          style={{
            position: 'fixed',
            top: 76,
            left: 12,
            zIndex: 33,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            pointerEvents: 'none',
          }}
        >
          {!showObjective && (
            <button
              onClick={() => { getAudioEngine().play('click'); setShowObjective(true); }}
              className="glass-chip"
              title="Show Objective"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--glass-text)',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              <GameIcon name="target" size={14} /> Objective
            </button>
          )}
          {!showMiniMap && (
            <button
              onClick={() => { getAudioEngine().play('click'); setShowMiniMap(true); }}
              className="glass-chip"
              title="Show City Map"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--glass-text)',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              <GameIcon name="map" size={14} /> Map
            </button>
          )}
        </div>
      )}
    </div>
  );
}
