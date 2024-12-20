export function playConnectedTone(audioContext: AudioContext) {
  // Create oscillator for a pleasant "connected" sound
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Set initial frequency and type
  osc.frequency.value = 880; // A5 note
  osc.type = "sine";

  // Set up gain envelope
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

  // Connect and start
  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start oscillator
  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.5);

  // Clean up after the sound is done
  setTimeout(() => {
    osc.disconnect();
    gainNode.disconnect();
  }, 600);
}
