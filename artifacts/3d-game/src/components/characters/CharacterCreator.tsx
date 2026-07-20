import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore, normalizeAppearance } from '@/store/gameStore';
import type { CharacterAppearance, HairstyleId, AccessoryId } from '@/store/gameStore';
import { CharacterRig } from './CharacterRig';
import { motion } from 'framer-motion';

const SKIN_TONES = ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#4A2912'];
const HAIR_COLORS = ['#1a0a00', '#3B1F0A', '#8B4513', '#D4A843', '#B0B0B0', '#E8E8E8'];
const SHIRT_COLORS = ['#0A8F7E', '#0D2B5E', '#D4A843', '#C0392B', '#8E44AD', '#27AE60'];
const PANTS_COLORS = ['#1A3A6B', '#2C2C2C', '#4A4A4A', '#8B7355', '#2E4057', '#1B5E20'];
const EYE_COLORS = ['#5B3A29', '#1a5276', '#1e8449', '#7D6608', '#6E2F1A', '#2E4057'];

const HAIRSTYLES: { id: HairstyleId; label: string; icon: string }[] = [
  { id: 'short',    label: 'Short',    icon: '💇' },
  { id: 'medium',   label: 'Medium',   icon: '🙂' },
  { id: 'locs',     label: 'Locs',     icon: '🎵' },
  { id: 'curly',    label: 'Curly',    icon: '🌀' },
  { id: 'ponytail', label: 'Ponytail', icon: '🎀' },
  { id: 'fade',     label: 'Fade',     icon: '✂️' },
];

const ACCESSORIES: { id: AccessoryId; label: string; icon: string }[] = [
  { id: 'glasses',  label: 'Glasses',  icon: '👓' },
  { id: 'earrings', label: 'Earrings', icon: '💛' },
  { id: 'hat',      label: 'Hat',      icon: '🧢' },
];

const PRONOUN_OPTIONS = ['He/Him', 'She/Her', 'They/Them', 'He/They', 'She/They'];

interface SwatchRowProps {
  label: string;
  colors: string[];
  value: string;
  onChange: (c: string) => void;
}

function SwatchRow({ label, colors, value, onChange }: SwatchRowProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: c,
              border: value === c ? '3px solid #fff' : '2px solid transparent',
              boxShadow: value === c ? '0 0 0 2px #ffea00' : 'none',
              cursor: 'pointer',
              transform: value === c ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.15s',
              outline: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CharacterPreview({ appearance, emote }: { appearance: CharacterAppearance; emote: 'none' | 'wave' }) {
  return (
    <Canvas camera={{ position: [0, 1.25, 2.9], fov: 40 }} shadows>
      {/* Three-point studio lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3, 2.5, -2]} intensity={0.5} color="#9BC4E8" />
      <pointLight position={[0, 3, -3]} intensity={0.7} color="#FFE0B0" />
      <CharacterRig
        skinTone={appearance.skinTone}
        hairColor={appearance.hairColor}
        shirtColor={appearance.shirtColor}
        pantsColor={appearance.pantsColor}
        eyeColor={appearance.eyeColor}
        hairstyle={appearance.hairstyle}
        bodyScale={appearance.bodyScale}
        accessories={appearance.accessories}
        isIdle={true}
        emote={emote}
        bigSmile
      />
      {/* Pedestal */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <cylinderGeometry args={[0.62, 0.72, 0.12, 32]} />
        <meshStandardMaterial color="#D4A843" roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.13, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.05, 32]} />
        <meshStandardMaterial color="#0D2B5E" roughness={0.6} />
      </mesh>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        target={[0, 0.9, 0]}
        autoRotate={emote === 'none'}
        autoRotateSpeed={2.0}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}

const DEFAULT_NEW: CharacterAppearance = {
  skinTone: SKIN_TONES[0],
  hairColor: HAIR_COLORS[1],
  shirtColor: SHIRT_COLORS[0],
  pantsColor: PANTS_COLORS[0],
  name: '',
  pronouns: 'They/Them',
  hairstyle: 'medium',
  eyeColor: EYE_COLORS[0],
  bodyScale: 0.5,
  accessories: [],
};

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.6)',
  textTransform: 'uppercase',
  letterSpacing: 1,
  marginBottom: 8,
};

export function CharacterCreator() {
  const { startGame, resetGame, stage, characterAppearance: savedAppearance, gameStarted } = useGameStore();

  const hasSavedGame = gameStarted || stage > 1;

  const [appearance, setAppearance] = useState<CharacterAppearance>(
    hasSavedGame ? normalizeAppearance(savedAppearance) : { ...DEFAULT_NEW }
  );
  const [nameError, setNameError] = useState('');
  const [emote, setEmote] = useState<'none' | 'wave'>('none');
  const emoteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (emoteTimer.current) clearTimeout(emoteTimer.current); }, []);

  const playWave = () => {
    if (emoteTimer.current) clearTimeout(emoteTimer.current);
    setEmote('wave');
    emoteTimer.current = setTimeout(() => setEmote('none'), 2600);
  };

  const update = <K extends keyof CharacterAppearance>(key: K) => (val: CharacterAppearance[K]) =>
    setAppearance((a) => ({ ...a, [key]: val }));

  const toggleAccessory = (id: AccessoryId) => {
    setAppearance((a) => ({
      ...a,
      accessories: a.accessories.includes(id)
        ? a.accessories.filter((x) => x !== id)
        : [...a.accessories, id],
    }));
  };

  const handleStart = () => {
    if (!appearance.name.trim()) {
      setNameError("Please enter a name for your character.");
      return;
    }
    setNameError('');
    startGame({ ...appearance, name: appearance.name.trim() });
  };

  const handleContinue = () => {
    startGame(savedAppearance);
  };

  const handleNewGame = () => {
    resetGame();
    setAppearance({ ...DEFAULT_NEW });
    setNameError('');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 0,
    border: nameError ? '1.5px solid #e74c3c' : '1.5px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #09070a 0%, #0A4A3E 50%, #09070a 100%)',
        padding: '24px 16px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 780 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 38, marginBottom: 6 }}>🏡</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0 }}>
            Path to Your First Home
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 6, fontSize: 13 }}>
            A Newport News Homeownership Simulator
          </p>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* 3D Preview */}
          <div style={{ flex: '0 0 200px' }}>
            <div
              style={{
                height: 260,
                borderRadius: 0,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.07)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <CharacterPreview appearance={appearance} emote={emote} />
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
              <button
                onClick={playWave}
                style={{
                  padding: '5px 12px',
                  borderRadius: 0,
                  border: emote === 'wave' ? '1.5px solid #ffea00' : '1.5px solid rgba(255,255,255,0.2)',
                  background: emote === 'wave' ? 'rgba(255,234,0,0.18)' : 'rgba(255,255,255,0.06)',
                  color: emote === 'wave' ? '#ffea00' : 'rgba(255,255,255,0.7)',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                👋 Wave
              </button>
            </div>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 6 }}>
              Drag to rotate preview
            </p>

            {/* Pronouns below preview */}
            <div style={{ marginTop: 8 }}>
              <div style={sectionLabel}>Pronouns</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {PRONOUN_OPTIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => update('pronouns')(p)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 0,
                      border: appearance.pronouns === p
                        ? '1.5px solid #ffea00'
                        : '1.5px solid rgba(255,255,255,0.2)',
                      background: appearance.pronouns === p
                        ? 'rgba(255,234,0,0.18)'
                        : 'rgba(255,255,255,0.06)',
                      color: appearance.pronouns === p ? '#ffea00' : 'rgba(255,255,255,0.65)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.15s',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customization panel */}
          <div
            style={{
              flex: 1,
              minWidth: 280,
              background: 'rgba(255,255,255,0.09)',
              borderRadius: 0,
              padding: '20px 20px 18px',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <h2 style={{ color: '#ffea00', fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
              Create Your Character
            </h2>

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <div style={sectionLabel}>Character Name</div>
              <input
                type="text"
                placeholder="Enter your name…"
                value={appearance.name}
                maxLength={24}
                onChange={(e) => {
                  update('name')(e.target.value);
                  if (nameError) setNameError('');
                }}
                style={inputStyle}
              />
              {nameError && (
                <div style={{ color: '#e74c3c', fontSize: 11, marginTop: 4 }}>{nameError}</div>
              )}
            </div>

            {/* Hairstyle */}
            <div style={{ marginBottom: 14 }}>
              <div style={sectionLabel}>Hairstyle</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {HAIRSTYLES.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => update('hairstyle')(id)}
                    title={label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      padding: '6px 8px',
                      borderRadius: 0,
                      border: appearance.hairstyle === id
                        ? '2px solid #ffea00'
                        : '2px solid rgba(255,255,255,0.14)',
                      background: appearance.hairstyle === id
                        ? 'rgba(255,234,0,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      minWidth: 46,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', fontWeight: 700 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <SwatchRow label="Skin Tone"  colors={SKIN_TONES}  value={appearance.skinTone}  onChange={update('skinTone')}  />
            <SwatchRow label="Hair Color" colors={HAIR_COLORS} value={appearance.hairColor} onChange={update('hairColor')} />
            <SwatchRow label="Eye Color"  colors={EYE_COLORS}  value={appearance.eyeColor}  onChange={update('eyeColor')}  />
            <SwatchRow label="Shirt Color"  colors={SHIRT_COLORS} value={appearance.shirtColor} onChange={update('shirtColor')} />
            <SwatchRow label="Pants Color"  colors={PANTS_COLORS} value={appearance.pantsColor} onChange={update('pantsColor')} />

            {/* Body type */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <div style={sectionLabel}>Body Type</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                  {appearance.bodyScale < 0.35 ? 'Slim' : appearance.bodyScale > 0.65 ? 'Broad' : 'Average'}
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={appearance.bodyScale}
                onChange={(e) => update('bodyScale')(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#ffea00', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                <span>Slimmer</span>
                <span>Broader</span>
              </div>
            </div>

            {/* Accessories */}
            <div style={{ marginBottom: 16 }}>
              <div style={sectionLabel}>Accessories</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {ACCESSORIES.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleAccessory(id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3,
                      padding: '7px 10px',
                      borderRadius: 0,
                      border: appearance.accessories.includes(id)
                        ? '2px solid #ffea00'
                        : '2px solid rgba(255,255,255,0.14)',
                      background: appearance.accessories.includes(id)
                        ? 'rgba(255,234,0,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      minWidth: 56,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', fontWeight: 700 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            {hasSavedGame && (
              <button
                onClick={handleContinue}
                style={{
                  marginTop: 4,
                  width: '100%',
                  padding: '13px',
                  borderRadius: 0,
                  background: '#ffea00',
                  color: '#09070a',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 15,
                  transition: 'all 0.15s',
                  boxShadow: '0 4px 20px rgba(255,234,0,0.4)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                Continue as {savedAppearance.name || 'Player'} →
              </button>
            )}

            <button
              onClick={hasSavedGame ? handleNewGame : handleStart}
              style={{
                marginTop: hasSavedGame ? 9 : 4,
                width: '100%',
                padding: '13px',
                borderRadius: 0,
                background: hasSavedGame ? 'rgba(255,255,255,0.1)' : '#ffea00',
                color: hasSavedGame ? 'rgba(255,255,255,0.8)' : '#09070a',
                border: hasSavedGame ? '1px solid rgba(255,255,255,0.2)' : 'none',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: 15,
                transition: 'all 0.15s',
                boxShadow: hasSavedGame ? 'none' : '0 4px 20px rgba(255,234,0,0.4)',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              {hasSavedGame ? 'Start New Game' : 'Start Your Journey →'}
            </button>

            {hasSavedGame && (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 7, marginBottom: 0 }}>
                Starting a new game will erase your saved progress
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
