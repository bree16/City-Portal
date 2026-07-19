/**
 * useGameAudio — singleton Web Audio API manager + React hook.
 * All sounds are synthesized; no external audio files required.
 */

import { useGameStore, DEFAULT_VOLUME } from '@/store/gameStore';

export type SoundEffect = 'click' | 'dialogue' | 'coin' | 'achievement' | 'fanfare';

// ─── Singleton audio engine ────────────────────────────────────────────────

class GameAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGains: GainNode[] = [];
  private _muted = false;
  private _musicVolume: number;
  private _sfxVolume: number;

  constructor() {
    // Restore persisted audio prefs from the game save (gameStore persists
    // them alongside stage, cash, etc.). The persist middleware rehydrates
    // synchronously from localStorage, so this is safe at construction time.
    const { musicVolume, sfxVolume, audioMuted } = useGameStore.getState();
    this._musicVolume = this._clamp(musicVolume);
    this._sfxVolume = this._clamp(sfxVolume);
    this._muted = audioMuted === true;
  }

  private _clamp(v: unknown): number {
    const n = typeof v === 'number' && !isNaN(v) ? v : DEFAULT_VOLUME;
    return Math.max(0, Math.min(1, n));
  }

  // Lazy-init — must be triggered by a user gesture first
  private boot(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this._muted ? 0 : this._musicVolume;
      this.musicGain.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this._muted ? 0 : this._sfxVolume;
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  get muted() {
    return this._muted;
  }

  get musicVolume() {
    return this._musicVolume;
  }

  get sfxVolume() {
    return this._sfxVolume;
  }

  private _rampGain(node: GainNode | null, target: number, time = 0.08) {
    if (!node || !this.ctx) return;
    const ctx = this.ctx;
    node.gain.cancelScheduledValues(ctx.currentTime);
    node.gain.linearRampToValueAtTime(target, ctx.currentTime + time);
  }

  setMuted(val: boolean) {
    this._muted = val;
    useGameStore.getState().setAudioMuted(val);
    // Smooth ramps to avoid clicks
    this._rampGain(this.musicGain, val ? 0 : this._musicVolume);
    this._rampGain(this.sfxGain, val ? 0 : this._sfxVolume);
    if (val) {
      this.stopAmbient();
    }
  }

  private _unmuteIfNeeded() {
    if (this._muted) {
      this._muted = false;
      useGameStore.getState().setAudioMuted(false);
      this._rampGain(this.musicGain, this._musicVolume);
      this._rampGain(this.sfxGain, this._sfxVolume);
    }
  }

  setMusicVolume(level: number) {
    this._musicVolume = this._clamp(level);
    useGameStore.getState().setMusicVolume(this._musicVolume);
    if (!this._muted) {
      this._rampGain(this.musicGain, this._musicVolume, 0.05);
    }
    // If volume is raised while muted, auto-unmute
    if (this._musicVolume > 0) this._unmuteIfNeeded();
  }

  setSfxVolume(level: number) {
    this._sfxVolume = this._clamp(level);
    useGameStore.getState().setSfxVolume(this._sfxVolume);
    if (!this._muted) {
      this._rampGain(this.sfxGain, this._sfxVolume, 0.05);
    }
    // If volume is raised while muted, auto-unmute
    if (this._sfxVolume > 0) this._unmuteIfNeeded();
  }

  // ── SFX ──────────────────────────────────────────────────────────────────

  play(sfx: SoundEffect) {
    if (this._muted) return;
    const ctx = this.boot();
    switch (sfx) {
      case 'click':      return this._playClick(ctx);
      case 'dialogue':   return this._playDialogue(ctx);
      case 'coin':       return this._playCoin(ctx);
      case 'achievement':return this._playAchievement(ctx);
      case 'fanfare':    return this._playFanfare(ctx);
    }
  }

  private _tone(
    ctx: AudioContext,
    freq: number,
    startOffset: number,
    duration: number,
    peakGain: number,
    type: OscillatorType = 'sine'
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    const t = ctx.currentTime + startOffset;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peakGain, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  private _playClick(ctx: AudioContext) {
    this._tone(ctx, 900, 0, 0.07, 0.22, 'sine');
    this._tone(ctx, 500, 0.03, 0.06, 0.1, 'sine');
  }

  private _playDialogue(ctx: AudioContext) {
    this._tone(ctx, 660, 0,    0.06, 0.18, 'sine');
    this._tone(ctx, 880, 0.05, 0.08, 0.12, 'sine');
  }

  private _playCoin(ctx: AudioContext) {
    // Two-note ding
    const pairs = [[880, 0.25], [1100, 0.3], [1320, 0.22]];
    pairs.forEach(([freq, g], i) => {
      this._tone(ctx, freq, i * 0.09, 0.45, g, 'sine');
    });
  }

  private _playAchievement(ctx: AudioContext) {
    // Ascending four-note chime
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      this._tone(ctx, freq, i * 0.13, 0.55, 0.28, 'sine');
    });
  }

  private _playFanfare(ctx: AudioContext) {
    // Triumphant five-note fanfare
    const notes = [523, 659, 784, 659, 1047];
    notes.forEach((freq, i) => {
      this._tone(ctx, freq, i * 0.16, 0.65, 0.35, 'triangle');
      // Harmony a third up
      this._tone(ctx, freq * 1.26, i * 0.16, 0.55, 0.12, 'sine');
    });
  }

  // ── Ambient music ─────────────────────────────────────────────────────────

  /**
   * Per-scene ambient configs.
   * Each scene gets a chord (freqs), oscillator type, and LFO rate for movement.
   */
  private AMBIENT: Record<number, { freqs: number[]; type: OscillatorType; lfo: number; gain: number }> = {
    // Stage 0 — Title / Character Creator: soft, hopeful intro — gentle major 6th chord
    0: { freqs: [87.3, 110, 130.8, 164.8, 196], type: 'sine', lfo: 0.09, gain: 0.026 },
    // Stage 1 — Apartment: warm jazz tones
    1: { freqs: [110, 138.6, 165, 220],   type: 'sine',     lfo: 0.18, gain: 0.032 },
    // Stage 2 — Counselor office: calm, open fifths
    2: { freqs: [130.8, 196, 261.6],       type: 'sine',     lfo: 0.12, gain: 0.028 },
    // Stage 3 — Neighborhood: outdoor pentatonic shimmer
    3: { freqs: [196, 247, 294, 370, 440], type: 'triangle', lfo: 0.22, gain: 0.022 },
    // Stage 4 — Negotiation: slightly tense minor
    4: { freqs: [220, 261.6, 329.6],       type: 'sine',     lfo: 0.35, gain: 0.026 },
    // Stage 5 — Bank: corporate, clean
    5: { freqs: [130.8, 196, 261.6, 329.6],type: 'sine',     lfo: 0.14, gain: 0.025 },
    // Stage 6 — Closing: hopeful major
    6: { freqs: [261.6, 329.6, 392, 523],  type: 'sine',     lfo: 0.10, gain: 0.030 },
    // Stage 7 — New home: celebratory, bright
    7: { freqs: [523, 659.3, 784, 987.8],  type: 'sine',     lfo: 0.08, gain: 0.035 },
  };

  startAmbient(stage: number) {
    this.stopAmbient();
    if (this._muted) return;
    const ctx = this.boot();
    const cfg = this.AMBIENT[stage] ?? this.AMBIENT[1];
    const perVoice = cfg.gain / cfg.freqs.length;

    cfg.freqs.forEach((baseFreq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = cfg.type;
      osc.frequency.value = baseFreq;

      // Gentle frequency vibrato via LFO
      lfo.type = 'sine';
      lfo.frequency.value = cfg.lfo + (Math.random() * 0.05);
      lfoGain.gain.value = baseFreq * 0.004;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(this.musicGain!);

      lfo.start();
      osc.start();

      // Fade in
      gain.gain.linearRampToValueAtTime(perVoice, ctx.currentTime + 1.5);

      this.ambientOscillators.push(osc, lfo);
      this.ambientGains.push(gain);
    });
  }

  /**
   * Stop all ambient voices. Fades gains to zero before stopping the
   * oscillators to avoid audible pops when tearing down mid-game music
   * (e.g. when returning to the character screen).
   */
  stopAmbient() {
    const oscillators = this.ambientOscillators;
    const gains = this.ambientGains;
    this.ambientOscillators = [];
    this.ambientGains = [];

    if (oscillators.length === 0) return;

    const FADE = 0.25;
    if (this.ctx && this.ctx.state === 'running') {
      const now = this.ctx.currentTime;
      gains.forEach((g) => {
        try {
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(g.gain.value, now);
          g.gain.linearRampToValueAtTime(0, now + FADE);
        } catch (_) { /* node already disconnected */ }
      });
      oscillators.forEach((n) => {
        try { n.stop(now + FADE + 0.02); } catch (_) { /* already stopped */ }
      });
    } else {
      // No running context — stop immediately
      oscillators.forEach((n) => {
        try { n.stop(); } catch (_) { /* already stopped */ }
      });
    }
  }
}

// Singleton
let _engine: GameAudioEngine | null = null;
export function getAudioEngine(): GameAudioEngine {
  if (!_engine) _engine = new GameAudioEngine();
  return _engine;
}
