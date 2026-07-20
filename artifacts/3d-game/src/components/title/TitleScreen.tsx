import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getAudioEngine } from '@/hooks/useGameAudio';
import { motion, AnimatePresence } from 'framer-motion';

import titleBg from '@/assets/title-bg.jpg';

export function TitleScreen({ onPlay, onContinue }: { onPlay: () => void, onContinue: () => void }) {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const careerId = useGameStore((s) => s.careerId);
  const stage = useGameStore((s) => s.stage);
  const resetGame = useGameStore((s) => s.resetGame);
  // A resumable save exists even after quitToMenu() (which clears the
  // gameStarted session flag but keeps stage/career progress persisted).
  const hasSave = gameStarted || careerId !== null || stage > 1;
  
  const [showHowTo, setShowHowTo] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);

  const engine = getAudioEngine();
  const [muted, setMuted] = useState(engine.muted);

  // ── Dev Stage Select: type "2005" anywhere on the title screen ──────────
  useEffect(() => {
    const buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        buf.push(e.key);
        if (buf.length > 4) buf.shift();
        if (buf.join('') === '2005') {
          engine.play('click');
          setShowDevMode(true);
          buf.length = 0;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine]);

  const DEV_STAGES = [
    { n: 1, label: 'City Start',    desc: 'Career & character creation' },
    { n: 2, label: 'Budget Phase',  desc: 'Work, save & build credit',   careerId: 'teacher', cash: 800,  savings: 1200,  income: 4200 },
    { n: 3, label: 'Home Shopping', desc: 'Tour homes across the city',  careerId: 'teacher', cash: 5000, savings: 9500,  income: 4200 },
    { n: 4, label: 'Make an Offer', desc: 'Negotiation mini-game',       careerId: 'teacher', cash: 3000, savings: 24500, homeId: 1 },
    { n: 5, label: 'Get Financed',  desc: 'Bank & mortgage approval',    careerId: 'teacher', cash: 3000, savings: 24500, homeId: 1 },
    { n: 6, label: 'Closing Day',   desc: 'Sign and get the keys',       careerId: 'teacher', cash: 2500, savings: 24500, homeId: 1 },
    { n: 7, label: 'Move In',       desc: 'Furnish your new home',       careerId: 'teacher', cash: 2000, savings: 500,   homeId: 1 },
    { n: 8, label: 'Home Life',     desc: 'Mortgage & equity journey',   careerId: 'teacher', cash: 2000, savings: 500,   homeId: 1 },
  ] as const;

  type DevStage = typeof DEV_STAGES[number];
  const jumpToStage = (s: DevStage) => {
    useGameStore.setState({
      gameStarted: true,
      stage: s.n,
      currentLocation: s.n === 7 ? 'newhome' : s.n === 8 ? 'homelife' : 'city',
      ...('careerId' in s ? { careerId: s.careerId } : {}),
      ...('cash'    in s ? { cash:    s.cash    } : {}),
      ...('savings' in s ? { savings: s.savings } : {}),
      ...('income'  in s ? { monthlyIncome: s.income, monthlyExpenses: Math.round(s.income * 0.65) } : {}),
      ...('homeId'  in s ? { selectedHomeId: s.homeId } : {}),
    });
    setShowDevMode(false);
    onContinue();
  };
  // ────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleFirstClick = () => {
      if (!engine.muted) {
        engine.startAmbient(useGameStore.getState().gameStarted ? useGameStore.getState().stage : 0);
      }
      window.removeEventListener('pointerdown', handleFirstClick);
    };
    window.addEventListener('pointerdown', handleFirstClick);
    return () => window.removeEventListener('pointerdown', handleFirstClick);
  }, [engine]);

  const handlePlay = () => {
    engine.play('click');
    onPlay();
  };

  const handleContinue = () => {
    engine.play('click');
    // Re-arm the session flag so the game routes past the creator when
    // resuming after a quit-to-menu (which clears gameStarted only).
    useGameStore.setState({ gameStarted: true });
    onContinue();
  };

  const handleNewGame = () => {
    engine.play('click');
    resetGame();
    onPlay();
  };

  const toggleMute = () => {
    engine.play('click');
    const next = !muted;
    engine.setMuted(next);
    setMuted(next);
    if (!next) {
      engine.startAmbient(useGameStore.getState().gameStarted ? useGameStore.getState().stage : 0);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#110e15] overflow-hidden text-[#ffffff] font-sans flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src={titleBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 18, ease: 'linear' }}
        />
        {/* Legibility gradient over the artwork */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(7,23,44,0.55) 0%, rgba(7,23,44,0.25) 35%, rgba(7,23,44,0.35) 70%, rgba(7,23,44,0.7) 100%)',
          }}
        />
      </div>
      
      <div className="relative z-10 w-full max-w-4xl p-6 pointer-events-none flex flex-col items-center justify-center h-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center space-y-3 pointer-events-auto text-center"
        >
          <div className="tracking-widest text-[var(--gold)] font-medium text-sm md:text-base drop-shadow-md">
            Newport News Housing Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: 'var(--display-font)' }}>
            Path to Your<br/>First Home
          </h1>
          <p className="text-lg md:text-xl text-[#e2dced] max-w-2xl mt-4 font-medium drop-shadow-sm">
            Learn the journey from renting to homeownership through an interactive educational experience.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center space-y-4 mt-12 pointer-events-auto"
        >
          {hasSave ? (
            <>
              <button onClick={handleContinue} className="glass-btn-primary px-12 py-4 text-xl">
                Continue Journey
              </button>
              <button onClick={() => { engine.play('click'); setShowConfirmNew(true); }} className="glass-btn px-8 py-3 text-lg">
                New Game
              </button>
            </>
          ) : (
            <button onClick={handlePlay} className="glass-btn-primary px-12 py-4 text-xl">
              Play
            </button>
          )}

          <div className="flex flex-row space-x-4 pt-4">
            <button onClick={() => { engine.play('click'); setShowHowTo(true); }} className="glass-btn px-6 py-2 text-sm">
              How to Play
            </button>
            <button onClick={() => { engine.play('click'); setShowAbout(true); }} className="glass-btn px-6 py-2 text-sm">
              About
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-6 pointer-events-auto z-20">
        <button onClick={toggleMute} className="glass-btn px-4 py-2 flex items-center space-x-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {muted ? (
              <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
            ) : (
              <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            )}
          </svg>
          <span>{muted ? 'Unmute' : 'Mute'}</span>
        </button>
      </div>
      
      <div className="absolute bottom-6 right-6 pointer-events-auto z-20">
        <a href="/" className="glass-btn px-4 py-2 block text-sm decoration-none">
          Exit to Housing Hub
        </a>
      </div>

      <AnimatePresence>
        {showConfirmNew && (
          <ModalOverlay onClose={() => setShowConfirmNew(false)}>
            <h2 className="text-2xl font-bold text-[var(--gold)] mb-4" style={{ fontFamily: 'var(--display-font)' }}>Warning</h2>
            <p className="text-lg mb-8">Starting a new game will erase your current progress. Are you sure?</p>
            <div className="flex space-x-4 justify-end">
              <button onClick={() => setShowConfirmNew(false)} className="glass-btn px-6 py-2">Cancel</button>
              <button onClick={handleNewGame} className="glass-btn-accent px-6 py-2">Confirm New Game</button>
            </div>
          </ModalOverlay>
        )}
        
        {showHowTo && (
          <ModalOverlay onClose={() => setShowHowTo(false)}>
            <h2 className="text-2xl font-bold text-[var(--teal)] mb-4" style={{ fontFamily: 'var(--display-font)' }}>How to Play</h2>
            <ul className="text-lg space-y-3 mb-8 list-disc pl-5 text-left">
              <li>Click to move your character around the city.</li>
              <li>Interact with glowing zones to talk to NPCs or enter buildings.</li>
              <li>Complete life events and manage your budget, credit, and savings.</li>
              <li>Navigate through 8 stages from renting to owning a home.</li>
            </ul>
            <div className="flex justify-end">
              <button onClick={() => setShowHowTo(false)} className="glass-btn px-6 py-2">Close</button>
            </div>
          </ModalOverlay>
        )}
        
        {showAbout && (
          <ModalOverlay onClose={() => setShowAbout(false)}>
            <h2 className="text-2xl font-bold text-[var(--gold)] mb-4" style={{ fontFamily: 'var(--display-font)' }}>About</h2>
            <p className="text-lg mb-8 text-left">This interactive simulator helps first-time homebuyers learn about budgeting, credit, home shopping, mortgages, closing, and homeownership through a fun, guided experience.</p>
            <div className="flex justify-end">
              <button onClick={() => setShowAbout(false)} className="glass-btn px-6 py-2">Close</button>
            </div>
          </ModalOverlay>
        )}

        {showDevMode && (
          <ModalOverlay onClose={() => setShowDevMode(false)}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-bold text-[var(--teal)]" style={{ fontFamily: 'var(--display-font)' }}>
                🛠 Dev Mode
              </h2>
              <span className="text-xs text-white/30 bg-white/10 px-2 py-0.5 rounded font-mono">2005</span>
            </div>
            <p className="text-sm text-white/50 mb-5">Jump to any stage. Stats are preset for quick testing.</p>
            <div className="grid grid-cols-2 gap-3">
              {DEV_STAGES.map((s) => (
                <button
                  key={s.n}
                  onClick={() => jumpToStage(s)}
                  className="glass-btn text-left px-4 py-3 hover:border-[var(--teal)] transition-colors"
                >
                  <div className="text-[var(--teal)] font-bold text-xs mb-0.5 uppercase tracking-wider">Stage {s.n}</div>
                  <div className="font-semibold text-sm leading-tight">{s.label}</div>
                  <div className="text-xs text-white/50 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button onClick={() => setShowDevMode(false)} className="glass-btn px-6 py-2 text-sm">Close</button>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  const engine = getAudioEngine();
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="absolute inset-0 z-50 bg-[var(--navy-glass)] flex items-center justify-center p-4 backdrop-blur-md pointer-events-auto"
    >
      <div className="absolute inset-0" onClick={() => { engine.play('click'); onClose(); }} />
      <motion.div 
        initial={{ scale: 0.95, y: 10 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.95, y: 10 }} 
        className="glass-panel-strong p-8 max-w-lg w-full relative z-10"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}