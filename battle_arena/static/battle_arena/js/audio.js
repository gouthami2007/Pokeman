/**
 * SoundSynth - Web Audio API Synthesizer for Pokémon retro 8-bit sound effects.
 * Avoids any external assets and ensures instant performance.
 */
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 0.25; // default comfortable volume
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playTackle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // A fast physical sweep/thud
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(this.masterVolume * 1.5, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playHeavyAttack() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Heavy physical boom
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.3);

    // Apply lowpass filter for deep impact
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(this.masterVolume * 1.8, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playQuickAttack() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // High frequency dash/whoosh (simulated using short white noise/high sweep)
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.12);

    gainNode.gain.setValueAtTime(this.masterVolume * 1.2, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playThunder() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Electric buzz: rapid frequency modulations
    const now = this.ctx.currentTime;
    const duration = 0.45;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    
    // Create crackling effect with rapid scheduling
    for (let t = 0; t < duration; t += 0.05) {
      const freq = 100 + Math.random() * 800;
      osc.frequency.setValueAtTime(freq, now + t);
    }
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.Q.setValueAtTime(1.0, now);

    gainNode.gain.setValueAtTime(this.masterVolume * 1.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + duration);
  }

  playHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Metallic static slap
    const now = this.ctx.currentTime;
    const duration = 0.12;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + duration);

    gainNode.gain.setValueAtTime(this.masterVolume * 1.6, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + duration);
  }

  playCritical() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Explosive dual-tone crash
    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.linearRampToValueAtTime(40, now + 0.35);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(500, now);
    osc2.frequency.exponentialRampToValueAtTime(100, now + 0.25);

    gainNode.gain.setValueAtTime(this.masterVolume * 2.0, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  playMiss() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Soft whoosh
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.8, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Uplifting 8-bit fanfare chime sequence
    const now = this.ctx.currentTime;
    
    // Notes: C5 (0.0), E5 (0.1), G5 (0.2), C6 (0.35 to 0.7)
    const notes = [
      { freq: 523.25, start: 0, duration: 0.1 }, // C5
      { freq: 659.25, start: 0.1, duration: 0.1 }, // E5
      { freq: 783.99, start: 0.2, duration: 0.1 }, // G5
      { freq: 1046.50, start: 0.3, duration: 0.5 } // C6
    ];

    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.freq, now + note.start);

      gainNode.gain.setValueAtTime(this.masterVolume * 1.2, now + note.start);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now + note.start);
      osc.stop(now + note.start + note.duration);
    });
  }

  playDefeat() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Sad descending minor scale
    const now = this.ctx.currentTime;
    
    // Notes: C4 (0.0), Ab3 (0.18), G3 (0.36), F3 (0.54 to 1.0)
    const notes = [
      { freq: 261.63, start: 0, duration: 0.18 }, // C4
      { freq: 207.65, start: 0.18, duration: 0.18 }, // Ab3
      { freq: 196.00, start: 0.36, duration: 0.18 }, // G3
      { freq: 174.61, start: 0.54, duration: 0.6 } // F3
    ];

    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now + note.start);

      gainNode.gain.setValueAtTime(this.masterVolume * 1.5, now + note.start);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now + note.start);
      osc.stop(now + note.start + note.duration);
    });
  }
}

// Export a single instance to be used by battle.js
const audioSynth = new SoundSynth();
window.audioSynth = audioSynth;
