// Original ambient chords, synthesised locally. No downloads or API keys.
export function createAmbientAudio(Context) {
  const context = new Context();
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1300;
  filter.Q.value = 0.5;
  filter.connect(master);
  const voices = [];
  const chords = [[130.81, 164.81, 196, 246.94], [110, 130.81, 164.81, 196], [87.31, 130.81, 174.61, 220], [98, 146.83, 196, 246.94]];
  chords[0].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index % 2 ? 5 : -5;
    const gain = context.createGain();
    gain.gain.value = 0.06;
    const pan = context.createStereoPanner ? context.createStereoPanner() : context.createGain();
    if (pan.pan) pan.pan.value = index / 3 - 0.5;
    oscillator.connect(gain); gain.connect(pan); pan.connect(filter);
    oscillator.start();
    voices.push(oscillator);
  });
  let chord = 0;
  let note = 0;
  const activeChimes = new Set();
  const interval = setInterval(() => {
    if (context.state !== 'running') return;
    note += 1;
    if (note % 8 === 0) {
      chord = (chord + 1) % chords.length;
      voices.forEach((voice, index) => voice.frequency.setTargetAtTime(chords[chord][index], context.currentTime, 1.8));
    }
    const chime = context.createOscillator();
    const envelope = context.createGain();
    chime.frequency.value = chords[chord][note % 4] * 2;
    envelope.gain.setValueAtTime(0, context.currentTime);
    envelope.gain.linearRampToValueAtTime(0.022, context.currentTime + 0.05);
    envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 2.8);
    chime.connect(envelope); envelope.connect(filter);
    activeChimes.add(chime);
    chime.onended = () => {activeChimes.delete(chime); chime.disconnect(); envelope.disconnect();};
    chime.start(); chime.stop(context.currentTime + 3);
  }, 1500);
  return {
    context,
    async play(volume) {await context.resume(); master.gain.setTargetAtTime(volume, context.currentTime, 0.4);},
    async pause() {await context.suspend();},
    setVolume(volume) {master.gain.setTargetAtTime(volume, context.currentTime, 0.15);},
    close() {clearInterval(interval); voices.forEach(voice => voice.stop()); activeChimes.forEach(voice => voice.stop()); context.close().catch(() => {});},
  };
}
