import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGameStore } from '@/store/gameStore';
import { CharacterCreator } from '@/components/characters/CharacterCreator';
import { CareerSelect } from '@/components/CareerSelect';
import GamePage from '@/pages/GamePage';
import { AudioManager } from '@/components/AudioManager';

const queryClient = new QueryClient();

function GameGate() {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const careerId = useGameStore((s) => s.careerId);
  if (!gameStarted) return <CharacterCreator />;
  if (!careerId) return <CareerSelect />;
  return <GamePage />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioManager>
          <GameGate />
        </AudioManager>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
