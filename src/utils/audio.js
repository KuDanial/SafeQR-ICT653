// Web Audio API Synthesizer for high-fidelity alerts without external asset dependencies
export const playMerchantAlertSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Dual-tone chime (ding-dong / cash register bell)
    const playTone = (freq, startTime, duration, type = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(587.33, now, 0.25, 'triangle');       // D5
    playTone(880.00, now + 0.12, 0.45, 'sine');     // A5
    playTone(1174.66, now + 0.25, 0.65, 'sine');   // D6
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
};

// Web Speech API for audible voice confirmation
export const speakConfirmation = (text, onEndCallback) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onEndCallback) onEndCallback();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // slightly slower for maximum clarity (especially helpful for elderly / noisy stalls)
  utterance.pitch = 1.05;
  utterance.lang = 'en-MY'; // Malaysian English accent if available, else default en

  // Try to pick a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.includes('en-MY') || v.lang.includes('en-SG') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEndCallback) {
    utterance.onend = onEndCallback;
    utterance.onerror = onEndCallback;
  }

  window.speechSynthesis.speak(utterance);
};
