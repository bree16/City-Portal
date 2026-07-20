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
  
  const engine = getAudioEngine();
  const [muted, setMuted] = useState(engine.muted);
  
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