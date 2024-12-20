export function createDialingTone(audioContext: AudioContext) {
  // Create oscillators for the dialing tone (North American dial tone: 350Hz + 440Hz)
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Set frequencies for the dial tone
  osc1.frequency.value = 350;
  osc2.frequency.value = 440;

  // Set volume
  gainNode.gain.value = 0.1;

  // Connect the oscillators to the gain node
  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start the oscillators
  osc1.start();
  osc2.start();

  return {
    stop: () => {
      // Gradual fade out
      gainNode.gain.setValueAtTime(
        gainNode.gain.value,
        audioContext.currentTime,
      );
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);

      // Stop oscillators after fade out
      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        osc1.disconnect();
        osc2.disconnect();
        gainNode.disconnect();
      }, 100);
    },
  };
}
