import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGameStore } from '@/store/gameStore';
import { CharacterCreator } from '@/components/characters/CharacterCreator';
import { CareerSelect } from '@/components/CareerSelect';
import GamePage from '@/pages/GamePage';

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
        <GameGate />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
