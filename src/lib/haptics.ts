// Haptic feedback utility for Pokopia Guide
// Uses Vibration API on mobile, AudioContext fallback on desktop

let audioCtx: AudioContext | null = null;
let lastHaptic = 0;

function audioFeedback(duration: number) {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 150;
    gain.gain.value = 0.08;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + Math.min(duration, 150) / 1000);
    osc.start();
    osc.stop(audioCtx.currentTime + Math.min(duration, 200) / 1000);
  } catch {}
}

export function haptic(type: 'success' | 'notification' = 'success') {
  // Throttle to 50ms minimum between haptics
  const now = Date.now();
  if (now - lastHaptic < 50) return;
  lastHaptic = now;

  if (type === 'success') {
    // Short tap — 15ms
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    } else {
      audioFeedback(15);
    }
  } else {
    // Buzz pattern — two pulses
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 30, 30]);
    } else {
      audioFeedback(80);
    }
  }
}

export function hapticTap() {
  haptic('success');
}

export function hapticBuzz() {
  haptic('notification');
}
