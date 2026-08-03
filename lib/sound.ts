let sharedAudioCtx: AudioContext | null = null;

export const playNotificationSound = () => {
  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Attempt to resume if it was suspended due to autoplay policy
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }

    const oscillator = sharedAudioCtx.createOscillator();
    const gainNode = sharedAudioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(sharedAudioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, sharedAudioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(1760, sharedAudioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, sharedAudioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, sharedAudioCtx.currentTime + 0.5);
    
    oscillator.start(sharedAudioCtx.currentTime);
    oscillator.stop(sharedAudioCtx.currentTime + 0.5);
  } catch(e) {
    console.error("Audio play failed", e);
  }
};
