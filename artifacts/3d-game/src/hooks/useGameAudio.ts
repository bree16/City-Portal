/**
 * useGameAudio — singleton Web Audio API manager + React hook.
 * All sounds are synthesized; no external audio files required.
 */

export type SoundEffect = 'click' | 'dialogue' | 'coin' | 'achievement' | 'fanfare';

// ─── Singleton audio engine ────────────────────────────────────────────────

class GameAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private _muted = false;

  // Lazy-init — must be triggered by a user gesture first
  private boot(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  get muted() {
    return this._muted;
  }

  setMuted(val: boolean) {
    this._muted = val;
    if (this.masterGain) {
      // Smooth ramp to avoid clicks
      const ctx = this.ctx!;
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(val ? 0 : 0.6, ctx.currentTime + 0.08);
    }
    if (val) {
      this.stopAmbient();
    }
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
    gain.connect(this.masterGain!);
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
      gain.connect(this.masterGain!);

      lfo.start();
      osc.start();

      // Fade in
      gain.gain.linearRampToValueAtTime(perVoice, ctx.currentTime + 1.5);

      this.ambientOscillators.push(osc, lfo);
    });
  }

  stopAmbient() {
    this.ambientOscillators.forEach((n) => {
      try { n.stop(); } catch (_) { /* already stopped */ }
    });
    this.ambientOscillators = [];
  }
}

// Singleton
let _engine: GameAudioEngine | null = null;
export function getAudioEngine(): GameAudioEngine {
  if (!_engine) _engine = new GameAudioEngine();
  return _engine;
}
