// Locally synthesised atmosphere, not external recordings or streams.
export function createAudioLayers(context, destination) {
  const sources = [];
  const gains = {};
  let seed = 123;
  const noise = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2147483648 - 1;};
  function noiseLayer(name, frequency, gain, type) {
    const buffer = context.createBuffer(2, 22050 * 8, 22050);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = buffer.getChannelData(channel);
      let low = 0;
      for (let i = 0; i < data.length; i += 1) {
        low = low * 0.94 + noise() * 0.06;
        const time = i / 22050;
        const breath = 0.7 + 0.3 * Math.sin(2 * Math.PI * time / 8);
        data[i] = name === 'rain' ? noise() * 0.18 + low * 0.4 : low * breath * 0.6;
        if (name === 'cafe') {
          const sinceClink = time % 2;
          data[i] += Math.sin(2 * Math.PI * 1700 * sinceClink) * Math.exp(-30 * sinceClink) * 0.025;
        }
        // Ease the noise at the loop seam; eight seconds avoids frequent repetition.
        const edge = Math.min(1, i / 150, (data.length - i - 1) / 150);
        data[i] *= edge;
      }
    }
    const source = context.createBufferSource();
    source.buffer = buffer; source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = type; filter.frequency.value = frequency;
    const level = context.createGain(); level.gain.value = 0;
    source.connect(filter); filter.connect(level); level.connect(destination);
    source.start(); sources.push(source); gains[name] = {node: level, gain};
  }
  noiseLayer('rain', 1800, 0.65, 'lowpass');
  noiseLayer('cafe', 800, 1.1, 'lowpass');
  const hum = context.createGain(); hum.gain.value = 0; hum.connect(destination);
  [55, 82.5, 110].forEach(frequency => {
    const oscillator = context.createOscillator(); oscillator.frequency.value = frequency;
    const level = context.createGain(); level.gain.value = 0.035;
    oscillator.connect(level); level.connect(hum); oscillator.start(); sources.push(oscillator);
  });
  gains.hum = {node: hum, gain: 1};
  return {
    setMix(mix) {Object.entries(gains).forEach(([name, {node, gain}]) => node.gain.setTargetAtTime(Math.max(0, Math.min(1, mix[name] || 0)) * gain, context.currentTime, 0.2));},
    close() {sources.forEach(source => source.stop());},
  };
}
