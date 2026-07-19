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
  musicVolume: number;
  setMusicVolume: (level: number) => void;
  sfxVolume: number;
  setSfxVolume: (level: number) => void;
}

const AudioCtx = createContext<AudioCtxValue>({
  muted: false,
  toggleMute: () => {},
  musicVolume: 0.6,
  setMusicVolume: () => {},
  sfxVolume: 0.6,
  setSfxVolume: () => {},
});

export function useAudioControls() {
  return useContext(AudioCtx);
}

// ─── Provider + reactive sound logic ─────────────────────────────────────────

export function AudioManager({ children }: { children: React.ReactNode }) {
  const engine = getAudioEngine();
  const [muted, setMuted] = useState(() => engine.muted);
  const [musicVolume, setMusicVolumeState] = useState(() => engine.musicVolume);
  const [sfxVolume, setSfxVolumeState] = useState(() => engine.sfxVolume);

  const toggleMute = useCallback(() => {
    const next = !engine.muted;
    engine.setMuted(next);
    setMuted(next);
    // If unmuting, restart ambient for the current stage
    if (!next) {
      engine.startAmbient(useGameStore.getState().stage);
    }
  }, [engine]);

  const setMusicVolume = useCallback((level: number) => {
    engine.setMusicVolume(level);
    setMusicVolumeState(engine.musicVolume);
    // Sync muted state in case setMusicVolume auto-unmuted
    setMuted(engine.muted);
    // If raising volume from 0 while ambient isn't playing, restart it
    if (level > 0) {
      engine.startAmbient(useGameStore.getState().stage);
    }
  }, [engine]);

  const setSfxVolume = useCallback((level: number) => {
    engine.setSfxVolume(level);
    setSfxVolumeState(engine.sfxVolume);
    // Sync muted state in case setSfxVolume auto-unmuted
    const wasMuted = muted;
    setMuted(engine.muted);
    // If auto-unmuted via the SFX slider, bring the music back too
    if (wasMuted && !engine.muted) {
      engine.startAmbient(useGameStore.getState().stage);
    }
  }, [engine, muted]);

  // ── Pre-game ambient (title / character creator) ──────────────────────────
  const gameStarted = useGameStore((s) => s.gameStarted);
  const prevStage = useRef<number | null>(null);

  useEffect(() => {
    if (!gameStarted) {
      // Handles both first load AND mid-game returns to the character screen:
      // startAmbient tears down any game-stage voices (with a fade) before
      // starting the soft intro track. Reset the stage tracker so that if the
      // player starts a new game, the stage effect below re-triggers even if
      // the stage number is unchanged.
      prevStage.current = null;
      engine.startAmbient(0);
    }
  }, [gameStarted, engine]);

  // ── Stage changes → switch ambient track ──────────────────────────────────
  const stage = useGameStore((s) => s.stage);

  useEffect(() => {
    if (!gameStarted) return;
    if (prevStage.current === stage) return;
    prevStage.current = stage;
    engine.startAmbient(stage);
    // Fanfare when reaching Closing (6) or New Home (7)
    if (stage === 6 || stage === 7) {
      setTimeout(() => engine.play('fanfare'), 800);
    }
  }, [stage, gameStarted, engine]);

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
    <AudioCtx.Provider value={{ muted, toggleMute, musicVolume, setMusicVolume, sfxVolume, setSfxVolume }}>
      {children}
    </AudioCtx.Provider>
  );
}
