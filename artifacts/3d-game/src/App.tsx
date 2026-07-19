import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGameStore } from '@/store/gameStore';
import { CharacterCreator } from '@/components/characters/CharacterCreator';
import GamePage from '@/pages/GamePage';

const queryClient = new QueryClient();

function GameGate() {
  const gameStarted = useGameStore((s) => s.gameStarted);
  return gameStarted ? <GamePage /> : <CharacterCreator />;
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
