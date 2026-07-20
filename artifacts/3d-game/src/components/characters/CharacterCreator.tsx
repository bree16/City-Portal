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
    <div className="mb-4">
      <div className="text-[11px] font-extrabold text-white/60 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--display-font)' }}>
        {label}
      </div>
      <div className="flex gap-[6px] flex-wrap">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="w-8 h-8 rounded-full cursor-pointer transition-all outline-none"
            style={{
              background: c,
              border: value === c ? '3px solid #fff' : '2px solid transparent',
              boxShadow: value === c ? '0 0 0 2px var(--magenta), 3px 3px 0px var(--gold)' : 'none',
              transform: value === c ? 'scale(1.15) rotate(-3deg)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CharacterPreview({ appearance, emote, forceSmile, lookAround }: { appearance: CharacterAppearance; emote: 'none' | 'wave', forceSmile: boolean, lookAround: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.35, 3.1], fov: 42 }} shadows>
      <ambientLight intensity={0.65} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3, 2.5, -2]} intensity={0.6} color="#9BC4E8" />
      <pointLight position={[0, 3, -3]} intensity={0.8} color="#FFE0B0" />
      
      <CharacterRig
        {...appearance}
        isIdle={true}
        emote={emote}
        bigSmile={forceSmile}
        lookAround={lookAround}
      />
      
      {/* Pedestal */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <cylinderGeometry args={[0.62, 0.72, 0.12, 32]} />
        <meshStandardMaterial color="#ffea00" roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.13, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.05, 32]} />
        <meshStandardMaterial color="#ff007f" roughness={0.6} />
      </mesh>
      
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        target={[0, 1.0, 0]}
        autoRotate={emote === 'none' && !lookAround}
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
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-x-hidden font-sans" style={{ background: 'linear-gradient(135deg, #09070a 0%, #1a1525 100%)' }}>
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ff007f\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl z-10 flex flex-col md:flex-row gap-8 items-stretch"
      >
        {/* Left Column: Preview */}
        <div className="flex flex-col gap-6 w-full md:w-[320px] shrink-0">
          <div className="text-center md:text-left">
            <h1 className="text-[34px] leading-tight font-extrabold text-white mb-2 uppercase tracking-tight" style={{ fontFamily: 'var(--display-font)', textShadow: '2px 2px 0px var(--magenta)' }}>
              Design Your <span className="text-[#ffea00]">Player</span>
            </h1>
            <p className="text-white/70 font-bold text-sm tracking-wide">PATH TO YOUR FIRST HOME</p>
          </div>

          <div className="glass-panel p-2">
            <div className="h-[360px] w-full bg-[#110e15] border-2 border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#110e15] to-[#1a1525] pointer-events-none" />
              <CharacterPreview appearance={appearance} emote={emote} forceSmile={forceSmile} lookAround={lookAround} />
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button className="glass-btn text-[10px] py-2 tracking-widest" onClick={playWave}>👋 WAVE</button>
              <button className="glass-btn text-[10px] py-2 tracking-widest" onClick={playSmile}>😁 SMILE</button>
              <button className="glass-btn text-[10px] py-2 tracking-widest" onClick={playLook}>👀 LOOK</button>
            </div>
            <p className="text-center text-white/40 text-[10px] uppercase font-bold mt-3 tracking-widest">
              Drag to rotate preview
            </p>
          </div>
          
          <div className="glass-panel-strong p-5">
            <div className="text-[11px] font-extrabold text-white/60 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--display-font)' }}>Pronouns</div>
            <div className="flex flex-wrap gap-2">
              {PRONOUN_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => update('pronouns')(p)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase transition-all ${appearance.pronouns === p ? 'glass-chip bg-[var(--gold)] text-black border-black' : 'bg-transparent text-white/70 border-2 border-white/20 hover:border-white/50'}`}
                  style={{ fontFamily: 'var(--display-font)' }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customization */}
        <div className="glass-panel-strong flex-1 p-6 md:p-8 flex flex-col gap-6">
          
          {/* Character Name */}
          <div>
            <div className="text-[11px] font-extrabold text-white/60 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--display-font)' }}>Character Name</div>
            <input
              type="text"
              placeholder="Enter your name…"
              value={appearance.name}
              maxLength={24}
              onChange={(e) => {
                update('name')(e.target.value);
                if (nameError) setNameError('');
              }}
              className={`w-full p-3 bg-black/40 text-white font-bold text-sm border-2 transition-all outline-none ${
                nameError ? 'border-red-500' : 'border-white/20 focus:border-[var(--teal)]'
              }`}
              style={{ fontFamily: 'var(--display-font)' }}
            />
            {nameError && <div className="text-red-500 text-[11px] font-bold mt-2 uppercase tracking-wide">{nameError}</div>}
          </div>

          {/* Hairstyle */}
          <div>
            <div className="text-[11px] font-extrabold text-white/60 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--display-font)' }}>Hairstyle</div>
            <div className="flex gap-2 flex-wrap">
              {HAIRSTYLES.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => update('hairstyle')(id)}
                  title={label}
                  className={`flex flex-col items-center gap-1 p-2 min-w-[56px] transition-all cursor-pointer ${
                    appearance.hairstyle === id 
                      ? 'glass-chip bg-[var(--gold)] text-black border-black' 
                      : 'bg-white/5 border-2 border-white/10 text-white/70 hover:border-[var(--magenta)] hover:bg-white/10'
                  }`}
                  style={appearance.hairstyle === id ? { transform: 'scale(1.05) rotate(-2deg)' } : {}}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-[9px] font-extrabold uppercase">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            <SwatchRow label="Skin Tone" colors={SKIN_TONES} value={appearance.skinTone} onChange={update('skinTone')} />
            <SwatchRow label="Hair Color" colors={HAIR_COLORS} value={appearance.hairColor} onChange={update('hairColor')} />
            <SwatchRow label="Eye Color" colors={EYE_COLORS} value={appearance.eyeColor} onChange={update('eyeColor')} />
            <SwatchRow label="Shirt Color" colors={SHIRT_COLORS} value={appearance.shirtColor} onChange={update('shirtColor')} />
            <SwatchRow label="Pants Color" colors={PANTS_COLORS} value={appearance.pantsColor} onChange={update('pantsColor')} />
          </div>

          {/* Body Build */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[11px] font-extrabold text-white/60 uppercase tracking-widest" style={{ fontFamily: 'var(--display-font)' }}>Body Build</div>
              <div className="text-[10px] text-white/40 font-bold uppercase">
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
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff007f]"
            />
            <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase mt-2">
              <span>Slimmer</span>
              <span>Broader</span>
            </div>
          </div>

          {/* Accessories */}
          <div>
            <div className="text-[11px] font-extrabold text-white/60 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--display-font)' }}>Accessories</div>
            <div className="flex gap-2 flex-wrap">
              {ACCESSORIES.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => toggleAccessory(id)}
                  className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all cursor-pointer ${
                    appearance.accessories.includes(id)
                      ? 'glass-chip bg-[var(--gold)] text-black border-black'
                      : 'bg-white/5 border-2 border-white/10 text-white/70 hover:border-[var(--magenta)] hover:bg-white/10'
                  }`}
                  style={appearance.accessories.includes(id) ? { transform: 'scale(1.05) rotate(-2deg)' } : {}}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-[9px] font-extrabold uppercase">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-col gap-3">
            {hasSavedGame && (
              <button
                onClick={handleContinue}
                className="glass-btn-primary w-full py-4 text-[15px]"
              >
                Continue as {savedAppearance.name || 'Player'} →
              </button>
            )}

            <button
              onClick={hasSavedGame ? handleNewGame : handleStart}
              className={hasSavedGame ? "glass-btn w-full py-3 text-sm opacity-80" : "glass-btn-primary w-full py-4 text-[15px] bg-[#00f0ff] border-black shadow-[5px_5px_0px_var(--magenta)] hover:shadow-[7px_7px_0px_var(--magenta)]"}
              style={!hasSavedGame ? { background: 'var(--teal)', color: 'black' } : {}}
            >
              {hasSavedGame ? 'Start New Game' : 'Start Your Journey →'}
            </button>
            
            {hasSavedGame && (
              <p className="text-center text-white/40 text-[10px] uppercase font-bold tracking-widest mt-2">
                Starting a new game will erase your saved progress
              </p>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
