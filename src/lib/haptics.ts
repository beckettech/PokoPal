// Haptic feedback utility for Pokopia Guide
// Uses Vibration API on mobile, AudioContext fallback on desktop

const HAPTIC_PATTERNS = {
  success: [10],                // Short tap
  light: [5],                   // Very light tap
  medium: [20],
  heavy: [30],
  notification: [20, 50, 20],   // Buzz pattern
  error: [30, 50, 30, 50, 30],
};

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try { audioCtx = new AudioContext(); } catch { return null; }
  }
  return audioCtx;
}

// Audio feedback for desktop/web where vibration isn't available
function audioFeedback(pattern: number[]) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const duration = pattern.reduce((a, b) => a + b, 0);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 80;
  gain.gain.value = 0.03;
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + Math.min(duration, 200) / 1000);
}

export function haptic(type: keyof typeof HAPTIC_PATTERNS = 'success') {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(HAPTIC_PATTERNS[type]);
  } else {
    // Audio fallback for desktop browsers
    audioFeedback(HAPTIC_PATTERNS[type]);
  }
}

// Call on every button press
export function hapticTap() {
  haptic('success');
}

// Call when chatbot replies
export function hapticBuzz() {
  haptic('notification');
}
