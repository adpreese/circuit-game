
// Define musical note frequencies (in Hz)
export const NOTE_FREQUENCIES = {
  'A': 440.0,
  'B': 493.88,
  'C#': 554.37,
  'D#': 622.25,
  'E': 659.25,
  'F#': 739.99,
  'G#': 830.61
};

export type NoteName = keyof typeof NOTE_FREQUENCIES;

// Map to store active oscillator nodes 
const audioContextMap = new Map<string, AudioContext>();
const oscillatorMap = new Map<string, OscillatorNode[]>();

// Function to play a note for a specific duration
export const playNote = (noteName: NoteName, duration: number = 1000): void => {
  try {
    const frequency = NOTE_FREQUENCIES[noteName];
    const noteId = `${noteName}-${Date.now()}`;
    
    // Create new audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextMap.set(noteId, audioContext);
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Create gain node for volume control and decay
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start and stop oscillator
    oscillator.start();
    
    // Store oscillator
    oscillatorMap.set(noteId, [oscillator]);
    
    // Stop and clean up after duration
    setTimeout(() => {
      if (oscillatorMap.has(noteId)) {
        const oscillators = oscillatorMap.get(noteId);
        oscillators?.forEach(osc => {
          try {
            osc.stop();
          } catch (err) {
            console.log('Error stopping oscillator:', err);
          }
        });
        oscillatorMap.delete(noteId);
      }
      if (audioContextMap.has(noteId)) {
        audioContextMap.delete(noteId);
      }
    }, duration);
    
  } catch (err) {
    console.error('Error playing audio:', err);
  }
};

// Play two notes simultaneously (an interval)
export const playInterval = (note1: NoteName, note2: NoteName, duration: number = 1000): void => {
  playNote(note1, duration);
  playNote(note2, duration);
};

// Play chord (all notes simultaneously)
export const playChord = (notes: NoteName[], duration: number = 1500): void => {
  notes.forEach(note => playNote(note, duration));
};

// Play a success sound
export const playSuccessSound = (): void => {
  // Play a pleasant resolved major 7th chord
  playChord(['E', 'G#', 'B', 'D#'], 2000);
};

// Play an error sound
export const playErrorSound = (): void => {
  // Play a dissonant interval
  playInterval('F#', 'G#', 500);
};
