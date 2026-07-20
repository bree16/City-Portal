import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore, normalizeAppearance } from '@/store/gameStore';
import type { CharacterAppearance, HairstyleId, AccessoryId } from '@/store/gameStore';
import { CharacterRig } from './CharacterRig';
import { motion } from 'framer-motion';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';

const SKIN_TONES = ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#4A2912'];
const HAIR_COLORS = ['#1a0a00', '#3B1F0A', '#8B4513', '#D4A843', '#B0B0B0', '#E8E8E8'];
const SHIRT_COLORS = ['#0A8F7E', '#0D2B5E', '#D4A843', '#C0392B', '#8E44AD', '#27AE60'];
const PANTS_COLORS = ['#1A3A6B', '#2C2C2C', '#4A4A4A', '#8B7355', '#2E4057', '#1B5E20'];
const EYE_COLORS = ['#5B3A29', '#1a5276', '#1e8449', '#7D6608', '#6E2F1A', '#2E4057'];

const HAIRSTYLES: { id: HairstyleId; label: string }[] = [
  { id: 'short',    label: 'Short' },
  { id: 'medium',   label: 'Medium' },
  { id: 'locs',     label: 'Locs' },
  { id: 'curly',    label: 'Curly' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'fade',     label: 'Fade' },
];

const ACCESSORIES: { id: AccessoryId; label: string; icon: GameIconName }[] = [
  { id: 'glasses',  label: 'Glasses',  icon: 'search' },
  { id: 'earrings', label: 'Earrings', icon: 'sparkles' },
  { id: 'hat',      label: 'Hat',      icon: 'player' },
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
    <div>
      <div className="text-sm font-medium text-white/80 mb-3">
        {label}
      </div>
      <div className="flex gap-3 flex-wrap">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`w-8 h-8 rounded-full cursor-pointer transition-all outline-none flex items-center justify-center relative ${
              value === c ? 'ring-2 ring-offset-2 ring-teal-500 ring-offset-[#0B1221] scale-110' : 'hover:scale-105 border border-white/20'
            }`}
            style={{ backgroundColor: c }}
          >
             {value === c && <div className="absolute inset-0 rounded-full border border-white/30 mix-blend-overlay" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function CharacterPreview({ appearance, emote, forceSmile, lookAround }: { appearance: CharacterAppearance; emote: 'none' | 'wave', forceSmile: boolean, lookAround: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.1, 3.2], fov: 40 }} shadows>
      <color attach="background" args={['#060B19']} />
      <fog attach="fog" args={['#060B19', 4, 10]} />
      
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[2, 4, 3]} intensity={1.5} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#e2e8f0" />
      
      <CharacterRig
        {...appearance}
        isIdle={true}
        emote={emote}
        bigSmile={forceSmile}
        lookAround={lookAround}
      />
      
      {/* Neutral platform */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.85, 0.04, 48]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} metalness={0.1} />
      </mesh>
      
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        target={[0, 0.9, 0]}
        autoRotate={emote === 'none' && !lookAround}
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 3}
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

export function CharacterCreator() {
  const { startGame, resetGame, stage, characterAppearance: savedAppearance, gameStarted } = useGameStore();

  const hasSavedGame = gameStarted || stage > 1;

  const [appearance, setAppearance] = useState<CharacterAppearance>(
    hasSavedGame ? normalizeAppearance(savedAppearance) : { ...DEFAULT_NEW }
  );
  const [nameError, setNameError] = useState('');
  
  const [emote, setEmote] = useState<'none' | 'wave'>('none');
  const [forceSmile, setForceSmile] = useState(false);
  const [lookAround, setLookAround] = useState(false);
  
  const emoteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const smileTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lookTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { 
    if (emoteTimer.current) clearTimeout(emoteTimer.current);
    if (smileTimer.current) clearTimeout(smileTimer.current);
    if (lookTimer.current) clearTimeout(lookTimer.current);
  }, []);

  const playWave = () => {
    if (emoteTimer.current) clearTimeout(emoteTimer.current);
    setEmote('wave');
    emoteTimer.current = setTimeout(() => setEmote('none'), 2600);
  };
  
  const playSmile = () => {
    if (smileTimer.current) clearTimeout(smileTimer.current);
    setForceSmile(true);
    smileTimer.current = setTimeout(() => setForceSmile(false), 2600);
  };

  const playLook = () => {
    if (lookTimer.current) clearTimeout(lookTimer.current);
    setLookAround(true);
    lookTimer.current = setTimeout(() => setLookAround(false), 2600);
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

  return (
    <div className="min-h-[100dvh] w-full bg-[#060B19] flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-x-hidden text-white/90">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[1200px] flex flex-col lg:flex-row gap-6 z-10 h-auto lg:h-[85vh]"
      >
        {/* Left Column: Preview (Focal Point) */}
        <div className="w-full lg:w-[60%] rounded-2xl bg-[#0B1221]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden relative min-h-[450px]">
          <div className="flex-1 relative">
            <CharacterPreview appearance={appearance} emote={emote} forceSmile={forceSmile} lookAround={lookAround} />
            
            {/* Emotes */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              <button 
                onClick={playWave} 
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${emote === 'wave' ? 'bg-teal-500 text-teal-950 shadow-[0_0_20px_rgba(20,184,166,0.4)]' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white/80'}`}
              >
                <GameIcon name="handshake" size={16} /> Wave
              </button>
              <button 
                onClick={playSmile} 
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${forceSmile ? 'bg-teal-500 text-teal-950 shadow-[0_0_20px_rgba(20,184,166,0.4)]' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white/80'}`}
              >
                <GameIcon name="heart" size={16} /> Smile
              </button>
              <button 
                onClick={playLook} 
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${lookAround ? 'bg-teal-500 text-teal-950 shadow-[0_0_20px_rgba(20,184,166,0.4)]' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white/80'}`}
              >
                <GameIcon name="search" size={16} /> Look
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Customization */}
        <div className="w-full lg:w-[40%] rounded-2xl bg-[#0B1221]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden max-h-[85vh]">
          
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-[#0D1526]/50">
            <h1 className="text-2xl font-medium text-white tracking-wide">Design Your Character</h1>
            <p className="text-white/50 text-sm mt-1">Path to Your First Home</p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent pr-4">
            
            {/* Character Name */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">Character Name</label>
              <input
                type="text"
                placeholder="Enter your name…"
                value={appearance.name}
                maxLength={24}
                onChange={(e) => {
                  update('name')(e.target.value);
                  if (nameError) setNameError('');
                }}
                className={`w-full bg-[#070b14]/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${
                  nameError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-teal-500/50'
                }`}
              />
              {nameError && <div className="text-red-400 text-sm font-medium">{nameError}</div>}
            </div>

            {/* Pronouns */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">Pronouns</label>
              <div className="flex flex-wrap gap-2">
                {PRONOUN_OPTIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => update('pronouns')(p)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      appearance.pronouns === p
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                        : 'bg-white/5 text-white/70 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Hairstyle */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">Hairstyle</label>
              <div className="flex flex-wrap gap-2">
                {HAIRSTYLES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => update('hairstyle')(id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      appearance.hairstyle === id 
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
                        : 'bg-white/5 text-white/70 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              <SwatchRow label="Skin Tone" colors={SKIN_TONES} value={appearance.skinTone} onChange={update('skinTone')} />
              <SwatchRow label="Hair Color" colors={HAIR_COLORS} value={appearance.hairColor} onChange={update('hairColor')} />
              <SwatchRow label="Eye Color" colors={EYE_COLORS} value={appearance.eyeColor} onChange={update('eyeColor')} />
              <SwatchRow label="Shirt Color" colors={SHIRT_COLORS} value={appearance.shirtColor} onChange={update('shirtColor')} />
              <SwatchRow label="Pants Color" colors={PANTS_COLORS} value={appearance.pantsColor} onChange={update('pantsColor')} />
            </div>

            {/* Body Build */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white/80">Body Build</label>
                <span className="text-sm font-medium text-white/50">
                  {appearance.bodyScale < 0.35 ? 'Slim' : appearance.bodyScale > 0.65 ? 'Broad' : 'Average'}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={appearance.bodyScale}
                onChange={(e) => update('bodyScale')(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Accessories */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">Accessories</label>
              <div className="flex gap-3 flex-wrap">
                {ACCESSORIES.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleAccessory(id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      appearance.accessories.includes(id)
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                        : 'bg-white/5 text-white/70 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <GameIcon name={icon} size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Actions Footer */}
          <div className="p-6 border-t border-white/5 bg-[#0D1526]/80 flex flex-col gap-3 shrink-0">
            {hasSavedGame && (
              <button
                onClick={handleContinue}
                className="w-full py-4 rounded-xl font-medium text-base transition-all bg-white hover:bg-gray-100 text-[#091124] shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
              >
                Continue as {savedAppearance.name || 'Player'}
              </button>
            )}

            <button
              onClick={hasSavedGame ? handleNewGame : handleStart}
              className={`w-full py-4 rounded-xl font-medium text-base transition-all ${
                hasSavedGame 
                  ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                  : 'bg-teal-500 hover:bg-teal-400 text-teal-950 shadow-[0_4px_20px_rgba(20,184,166,0.3)]'
              }`}
            >
              {hasSavedGame ? 'Start New Game' : 'Start Your Journey'}
            </button>
            
            {hasSavedGame && (
              <p className="text-center text-white/40 text-xs font-medium tracking-wide mt-1">
                Starting a new game will erase your saved progress
              </p>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
