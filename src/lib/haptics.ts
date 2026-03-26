// Haptic feedback utility for Pokopia Guide

const HAPTIC_PATTERNS = {
  success: [10],           // Short tap
  light: [5],              // Very light tap
  medium: [20],
  heavy: [30],
  notification: [20, 50, 20],  // Buzz pattern
  error: [30, 50, 30, 50, 30],
};

export function haptic(type: keyof typeof HAPTIC_PATTERNS = 'success') {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(HAPTIC_PATTERNS[type]);
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
