import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '@/components/GameHUD';
import { AchievementToast } from '@/components/AchievementToast';

// Stages
import { Stage1Renting } from '@/stages/Stage1Renting';
import { Stage2Preparing } from '@/stages/Stage2Preparing';
import { Stage3Hunting } from '@/stages/Stage3Hunting';
import { Stage4Offer } from '@/stages/Stage4Offer';
import { Stage5Mortgage } from '@/stages/Stage5Mortgage';
import { Stage6Closing } from '@/stages/Stage6Closing';
import { Stage7MoveIn } from '@/stages/Stage7MoveIn';

export default function GamePage() {
  const { stage, achievements } = useGameStore();
  
  // Achievement Toast State
  const [toastQueue, setToastQueue] = useState<string[]>([]);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Watch for new achievements
  useEffect(() => {
    if (achievements.length > 0) {
      const latest = achievements[achievements.length - 1];
      if (latest !== activeToast && !toastQueue.includes(latest)) {
        setToastQueue(prev => [...prev, latest]);
      }
    }
  }, [achievements]);

  // Process toast queue
  useEffect(() => {
    if (!activeToast && toastQueue.length > 0) {
      setActiveToast(toastQueue[0]);
      setToastQueue(prev => prev.slice(1));
    }
  }, [activeToast, toastQueue]);

  const renderStage = () => {
    switch (stage) {
      case 1: return <Stage1Renting />;
      case 2: return <Stage2Preparing />;
      case 3: return <Stage3Hunting />;
      case 4: return <Stage4Offer />;
      case 5: return <Stage5Mortgage />;
      case 6: return <Stage6Closing />;
      case 7: return <Stage7MoveIn />;
      default: return <Stage1Renting />;
    }
  };

  const formatAchievementTitle = (id: string) => {
    return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background font-sans overflow-hidden">
      {stage !== 6 && <GameHUD />}
      
      <main className="flex-1 w-full max-w-7xl mx-auto overflow-hidden relative shadow-2xl bg-white md:my-4 md:rounded-2xl border border-border flex flex-col">
        {renderStage()}
      </main>

      <AchievementToast 
        isVisible={!!activeToast} 
        title={activeToast ? formatAchievementTitle(activeToast) : ''} 
        onClose={() => setActiveToast(null)} 
      />
    </div>
  );
}
