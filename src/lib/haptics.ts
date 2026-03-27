// Haptic feedback utility for Pokopia Guide
// Uses web-haptics package (Vibration API + AudioContext fallback)

import { WebHaptics } from "web-haptics";

const haptics = new WebHaptics();

let lastHaptic = 0;

function throttledTrigger(input: Parameters<typeof haptics.trigger>[0]) {
  const now = Date.now();
  if (now - lastHaptic < 50) return;
  lastHaptic = now;
  haptics.trigger(input);
}

export function hapticTap() {
  // Light tap — short single vibration
  throttledTrigger(15);
}

export function hapticBuzz() {
  // Buzz pattern — two pulses
  throttledTrigger([20, 30, 30]);
}
