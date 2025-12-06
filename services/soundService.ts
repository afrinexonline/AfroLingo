
// Simple synth using Web Audio API to avoid external asset dependencies

let audioContext: AudioContext | null = null;

const getContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playSound = (type: 'click' | 'correct' | 'incorrect' | 'complete') => {
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(e => console.error(e));
    }

    const t = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    // Master volume control for effects
    const vol = 0.15; 

    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        osc.connect(gainNode);
        osc.type = 'sine';
        
        // High pitched "blip"
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
        
        gainNode.gain.setValueAtTime(vol * 0.5, t);
        gainNode.gain.linearRampToValueAtTime(0, t + 0.1);
        
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      }
      case 'correct': {
        // C Major Arpeggio (C5, E5, G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();
            osc.connect(noteGain);
            noteGain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const start = t + i * 0.08;
            noteGain.gain.setValueAtTime(0, start);
            noteGain.gain.linearRampToValueAtTime(vol, start + 0.02);
            noteGain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
            
            osc.start(start);
            osc.stop(start + 0.35);
        });
        break;
      }
      case 'incorrect': {
        // Low sawtooth "buzz"
        const osc = ctx.createOscillator();
        osc.connect(gainNode);
        osc.type = 'sawtooth';
        
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.3);
        
        gainNode.gain.setValueAtTime(vol * 0.8, t);
        gainNode.gain.linearRampToValueAtTime(0, t + 0.3);
        
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      }
      case 'complete': {
        // Victory Fanfare (C5, E5, G5, C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();
            osc.connect(noteGain);
            noteGain.connect(ctx.destination);
            
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            const start = t + i * 0.1;
            // Last note longer
            const duration = i === notes.length - 1 ? 0.8 : 0.4; 
            
            noteGain.gain.setValueAtTime(0, start);
            noteGain.gain.linearRampToValueAtTime(vol, start + 0.05);
            noteGain.gain.exponentialRampToValueAtTime(0.001, start + duration);
            
            osc.start(start);
            osc.stop(start + duration + 0.1);
        });
        break;
      }
    }
  } catch (e) {
    console.error("Audio playback error", e);
  }
};
