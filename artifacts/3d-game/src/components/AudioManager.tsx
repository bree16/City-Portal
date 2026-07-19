/**
 * AudioManager — mounts once in GamePage.
 * Watches game state and drives all audio reactively.
 * Exposes muted/toggleMute via AudioContext so GameHUD can render a mute button.
 */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getAudioEngine } from '@/hooks/useGameAudio';

// ─── React context ────────────────────────────────────────────────────────────

interface AudioCtxValue {
  muted: boolean;
  toggleMute: () => void;
}

const AudioCtx = createContext<AudioCtxValue>({ muted: false, toggleMute: () => {} });

export function useAudioControls() {
  return useContext(AudioCtx);
}

// ─── Provider + reactive sound logic ─────────────────────────────────────────

export function AudioManager({ children }: { children: React.ReactNode }) {
  const engine = getAudioEngine();
  const [muted, setMuted] = useState(false);

  const toggleMute = useCallback(() => {
    const next = !engine.muted;
    engine.setMuted(next);
    setMuted(next);
    // If unmuting, restart ambient for the current stage
    if (!next) {
      engine.startAmbient(useGameStore.getState().stage);
    }
  }, [engine]);

  // ── Stage changes → switch ambient track ──────────────────────────────────
  const prevStage = useRef<number | null>(null);
  const stage = useGameStore((s) => s.stage);

  useEffect(() => {
    if (prevStage.current === stage) return;
    prevStage.current = stage;
    engine.startAmbient(stage);
    // Fanfare when reaching Closing (6) or New Home (7)
    if (stage === 6 || stage === 7) {
      setTimeout(() => engine.play('fanfare'), 800);
    }
  }, [stage, engine]);

  // ── Achievements → chime ──────────────────────────────────────────────────
  const achievements = useGameStore((s) => s.achievements);
  const prevAchLen = useRef(0);

  useEffect(() => {
    if (achievements.length > prevAchLen.current) {
      engine.play('achievement');
    }
    prevAchLen.current = achievements.length;
  }, [achievements, engine]);

  // ── Dialogue open → pop sound ─────────────────────────────────────────────
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const prevDialogueKey = useRef<string | null>(null);

  useEffect(() => {
    if (!activeDialogue) {
      prevDialogueKey.current = null;
      return;
    }
    const key = `${activeDialogue.npcId}:${activeDialogue.lineIndex}`;
    if (key !== prevDialogueKey.current) {
      engine.play('dialogue');
      prevDialogueKey.current = key;
    }
  }, [activeDialogue, engine]);

  // ── Savings increase → coin sound ─────────────────────────────────────────
  const savings = useGameStore((s) => s.savings);
  const prevSavings = useRef(savings);

  useEffect(() => {
    if (savings > prevSavings.current) {
      engine.play('coin');
    }
    prevSavings.current = savings;
  }, [savings, engine]);

  // ── Interact click — exposed via engine.play('click') called externally ───
  // (NPCCharacter / Html buttons call engine.play('click') directly)

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      engine.stopAmbient();
    };
  }, [engine]);

  return (
    <AudioCtx.Provider value={{ muted, toggleMute }}>
      {children}
    </AudioCtx.Provider>
  );
}
