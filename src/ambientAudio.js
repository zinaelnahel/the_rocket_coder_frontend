// An original, seamless 72 BPM lo-fi loop rendered locally. No API or audio downloads.
// AudioBufferSourceNode handles timing, including when browser timers are throttled.
import {createAudioLayers} from './audioLayers';

export function createAmbientAudio(Context) {
  const context = new Context();
  const master = context.createGain();
  master.gain.value = 0;
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -8; limiter.ratio.value = 4;
  master.connect(limiter); limiter.connect(context.destination);
  const rate = 22050;
  const beat = 60 / 72;
  const duration = 8 * 4 * beat;
  const buffer = context.createBuffer(2, Math.round(duration * rate), rate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  let seed = 42;
  const noise = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2147483648 - 1;};
  function add(time, length, sound, pan = 0) {
    const start = Math.round(time * rate);
    const samples = Math.ceil(length * rate);
    for (let i = 0; i < samples; i += 1) {
      const index = (start + i) % left.length;
      const sample = sound(i / rate);
      left[index] += sample * (1 - Math.max(0, pan));
      right[index] += sample * (1 + Math.min(0, pan));
    }
  }
  function keys(time, notes, pan) {
    notes.forEach((frequency, index) => {
      const detuned = frequency * (1 + (index % 2 ? 0.0007 : -0.0007));
      const note = t => {
        const attack = Math.min(1, t / 0.009);
        const wobble = 0.003 * Math.sin(2 * Math.PI * 0.6 * t);
        const phase = 2 * Math.PI * detuned * t + wobble;
        return attack * Math.exp(-2.1 * t) * (Math.sin(phase) + 0.22 * Math.sin(phase * 2) * Math.exp(-4 * t)) * 0.043;
      };
      add(time, 2.6, note, pan);
      add(time + beat * 0.75, 2.6, t => note(t) * 0.18, -pan);
    });
  }
  const chords = [
    [130.81, 155.56, 196, 233.08], // Cm7
    [103.83, 130.81, 155.56, 196], // Abmaj7
    [155.56, 196, 233.08, 293.66], // Ebmaj7
    [116.54, 146.83, 174.61, 207.65], // Bb7
  ];
  for (let bar = 0; bar < 8; bar += 1) {
    const start = bar * 4 * beat;
    const chord = chords[Math.floor(bar / 2)];
    keys(start + 0.02, chord, -0.18);
    keys(start + 2.65 * beat, chord, 0.18);
    [0, 2.5].forEach(offset => add(start + offset * beat, 0.7, t => Math.sin(2 * Math.PI * chord[0] / 2 * t) * Math.min(1, t / 0.015) * Math.exp(-5 * t) * 0.16));
    [0, 1.75, 2.5].forEach(offset => add(start + offset * beat, 0.3, t => Math.sin(2 * Math.PI * (45 * t + 1.9 * (1 - Math.exp(-30 * t)))) * Math.exp(-18 * t) * 0.28));
    [1, 3].forEach(offset => add(start + offset * beat + 0.015, 0.18, t => (noise() * 0.10 + Math.sin(2 * Math.PI * 170 * t) * 0.045) * Math.exp(-28 * t)));
    for (let step = 0; step < 8; step += 1) {
      const swing = step % 2 ? 0.045 : 0;
      let previousNoise = 0;
      add(start + step * beat / 2 + swing, 0.065, t => {
        const next = noise();
        const high = next - previousNoise;
        previousNoise = next;
        return high * Math.exp(-80 * t) * (step % 2 ? 0.023 : 0.014);
      }, step % 2 ? 0.25 : -0.25);
    }
  }
  let softNoise = 0;
  for (let i = 0; i < left.length; i += 1) {
    softNoise = softNoise * 0.84 + noise() * 0.16;
    const texture = softNoise * 0.008;
    const crackle = Math.abs(noise()) > 0.9998 ? noise() * 0.014 : 0;
    left[i] = Math.tanh((left[i] + texture + crackle) * 1.5) * 0.75;
    right[i] = Math.tanh((right[i] + texture + crackle) * 1.5) * 0.75;
  }
  // Cross-fade the background texture at the loop boundary to avoid a click.
  const edge = Math.round(rate * 0.006);
  for (let i = 0; i < edge; i += 1) {
    const gain = i / edge;
    left[i] *= gain; right[i] *= gain;
    left[left.length - 1 - i] *= gain; right[right.length - 1 - i] *= gain;
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = 4300;
  const music = context.createGain(); music.gain.value = 1;
  source.connect(filter); filter.connect(music); music.connect(master);
  const layers = createAudioLayers(context, master);
  source.start();
  let closed = false;
  return {
    context,
    async play(volume) {await context.resume(); master.gain.setTargetAtTime(volume, context.currentTime, 0.15);},
    async pause() {await context.suspend();},
    setVolume(volume) {master.gain.setTargetAtTime(volume, context.currentTime, 0.15);},
    setMix(mix) {music.gain.setTargetAtTime(Math.max(0, Math.min(1, mix.music)), context.currentTime, 0.2); layers.setMix(mix);},
    close() {if (closed) return; closed = true; source.stop(); layers.close(); context.close().catch(() => {});},
  };
}
