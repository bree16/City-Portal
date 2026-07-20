import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGameStore } from '@/store/gameStore';
import { CharacterCreator } from '@/components/characters/CharacterCreator';
import { CareerSelect } from '@/components/CareerSelect';
import GamePage from '@/pages/GamePage';
import { AudioManager } from '@/components/AudioManager';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TitleScreen } from '@/components/title/TitleScreen';
import { IntroSequence } from '@/components/title/IntroSequence';

const queryClient = new QueryClient();

export type AppPhase = 'title' | 'intro' | 'game';

function GameGate() {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const careerId = useGameStore((s) => s.careerId);
  
  let key = 'creator';
  if (gameStarted && !careerId) key = 'career';
  if (gameStarted && careerId) key = 'game';

  return (
    <AnimatePresence mode="wait">
      <motion.div key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-[100dvh]">
        {!gameStarted && <CharacterCreator />}
        {gameStarted && !careerId && <CareerSelect />}
        {gameStarted && careerId && <GamePage />}
      </motion.div>
    </AnimatePresence>
  );
}

function MainApp() {
  const [phase, setPhase] = useState<AppPhase>('title');

  return (
    <AnimatePresence mode="wait">
      {phase === 'title' && (
        <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-[100dvh] absolute inset-0">
          <TitleScreen 
            onPlay={() => setPhase('intro')} 
            onContinue={() => setPhase('game')} 
          />
        </motion.div>
      )}
      {phase === 'intro' && (
        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-[100dvh] absolute inset-0">
          <IntroSequence onComplete={() => setPhase('game')} />
        </motion.div>
      )}
      {phase === 'game' && (
        <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-[100dvh] absolute inset-0">
          <GameGate />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioManager>
          <div className="w-full h-[100dvh] bg-[#110e15] text-white relative overflow-y-auto overflow-x-hidden">
            <MainApp />
          </div>
        </AudioManager>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;