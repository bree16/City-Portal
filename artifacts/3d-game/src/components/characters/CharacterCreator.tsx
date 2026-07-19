import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import type { CharacterAppearance } from '@/store/gameStore';
import { CharacterRig } from './CharacterRig';
import { motion } from 'framer-motion';

const SKIN_TONES = ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#4A2912'];
const HAIR_COLORS = ['#1a0a00', '#3B1F0A', '#8B4513', '#D4A843', '#B0B0B0', '#E8E8E8'];
const SHIRT_COLORS = ['#0A8F7E', '#0D2B5E', '#D4A843', '#C0392B', '#8E44AD', '#27AE60'];
const PANTS_COLORS = ['#1A3A6B', '#2C2C2C', '#4A4A4A', '#8B7355', '#2E4057', '#1B5E20'];

interface SwatchRowProps {
  label: string;
  colors: string[];
  value: string;
  onChange: (c: string) => void;
}

function SwatchRow({ label, colors, value, onChange }: SwatchRowProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: c,
              border: value === c ? '3px solid #fff' : '2px solid transparent',
              boxShadow: value === c ? '0 0 0 2px #D4A843' : 'none',
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

function CharacterPreview({ appearance }: { appearance: CharacterAppearance }) {
  return (
    <Canvas camera={{ position: [0, 1.2, 3.2], fov: 42 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 3]} intensity={1.3} />
      <pointLight position={[-3, 3, -2]} intensity={0.4} color="#FFF8E7" />
      <CharacterRig
        skinTone={appearance.skinTone}
        hairColor={appearance.hairColor}
        shirtColor={appearance.shirtColor}
        pantsColor={appearance.pantsColor}
        isIdle={true}
      />
      {/* Pedestal */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.1, 16]} />
        <meshStandardMaterial color="#D4A843" />
      </mesh>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        target={[0, 0.9, 0]}
        autoRotate
        autoRotateSpeed={2.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}

export function CharacterCreator() {
  const { startGame } = useGameStore();
  const [appearance, setAppearance] = useState<CharacterAppearance>({
    skinTone: SKIN_TONES[0],
    hairColor: HAIR_COLORS[1],
    shirtColor: SHIRT_COLORS[0],
    pantsColor: PANTS_COLORS[0],
  });

  const update = (key: keyof CharacterAppearance) => (val: string) =>
    setAppearance((a) => ({ ...a, [key]: val }));

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D2B5E 0%, #0A4A3E 50%, #0D2B5E 100%)',
        padding: '24px 16px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 720 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏡</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0 }}>
            Path to Your First Home
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8, fontSize: 14 }}>
            A Newport News Homeownership Simulator
          </p>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* 3D Preview */}
          <div style={{ flex: '0 0 220px' }}>
            <div
              style={{
                height: 280,
                borderRadius: 20,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.07)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <CharacterPreview appearance={appearance} />
            </div>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 8 }}>
              Drag to rotate preview
            </p>
          </div>

          {/* Customization */}
          <div
            style={{
              flex: 1,
              minWidth: 260,
              background: 'rgba(255,255,255,0.09)',
              borderRadius: 20,
              padding: 24,
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <h2 style={{ color: '#D4A843', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
              Create Your Character
            </h2>

            <SwatchRow label="Skin Tone" colors={SKIN_TONES} value={appearance.skinTone} onChange={update('skinTone')} />
            <SwatchRow label="Hair Color" colors={HAIR_COLORS} value={appearance.hairColor} onChange={update('hairColor')} />
            <SwatchRow label="Shirt Color" colors={SHIRT_COLORS} value={appearance.shirtColor} onChange={update('shirtColor')} />
            <SwatchRow label="Pants Color" colors={PANTS_COLORS} value={appearance.pantsColor} onChange={update('pantsColor')} />

            <button
              onClick={() => startGame(appearance)}
              style={{
                marginTop: 8,
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                background: '#D4A843',
                color: '#0D2B5E',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: 16,
                transition: 'all 0.15s',
                boxShadow: '0 4px 20px rgba(212,168,67,0.4)',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              Start Your Journey →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
