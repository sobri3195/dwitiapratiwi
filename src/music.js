export function createMusicPlayer() {
  let context;
  let master;
  let timer;
  let playing = false;
  const notes = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66];
  let noteIndex = 0;

  function playNote(frequency) {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    oscillator.connect(gain).connect(master);
    oscillator.start(now);
    oscillator.stop(now + 1.9);
  }

  async function toggle() {
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = 0.45;
      master.connect(context.destination);
    }
    if (context.state === 'suspended') await context.resume();
    playing = !playing;
    if (playing) {
      playNote(notes[noteIndex]);
      timer = window.setInterval(() => {
        noteIndex = (noteIndex + 1) % notes.length;
        playNote(notes[noteIndex]);
      }, 900);
    } else {
      clearInterval(timer);
    }
    return playing;
  }

  function destroy() { clearInterval(timer); context?.close(); }
  return { toggle, destroy };
}
