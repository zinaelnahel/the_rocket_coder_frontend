import React, {useEffect, useRef, useState} from 'react';
import {createAmbientAudio} from '../ambientAudio';
import AudioMixer, {readMix} from './AudioMixer';

export default function AmbientPlayer() {
  const engine = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [mix, setMix] = useState(readMix);
  useEffect(() => {
    engine.current?.setMix(mix);
    try {localStorage.setItem('rocket-coder-audio-mix', JSON.stringify(mix));} catch {}
  }, [mix]);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {alive.current = false; engine.current?.close();};
  }, []);
  async function toggle() {
    setBusy(true); setError('');
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) throw new Error('Audio unsupported');
      if (!engine.current) engine.current = createAmbientAudio(Context);
      engine.current.setMix(mix);
      if (playing) await engine.current.pause();
      else await engine.current.play(volume);
      if (alive.current) setPlaying(!playing);
    } catch {
      if (alive.current) setError('Audio couldn’t start here. Try again, or listen using the radio link.');
    } finally {if (alive.current) setBusy(false);}
  }
  return <section className={`ambient-player${playing ? ' is-playing' : ''}`} aria-labelledby="ambient-heading"><div className="radio-disc" aria-hidden="true"><span>✦</span></div><div className="radio-description"><p className="eyebrow">YOUR COSMIC SOUNDTRACK</p><h2 id="ambient-heading">Lo-fi, high orbit.</h2><p>Warm keys, soft drums and vinyl texture. Original lo-fi at 72 BPM.</p><a href="https://somafm.com/spacestation/" target="_blank" rel="noopener noreferrer">Prefer live music? Open Space Station Soma ↗</a></div><div className="radio-controls"><button onClick={toggle} disabled={busy} aria-pressed={playing}>{busy ? 'Connecting…' : playing ? 'Pause soundscape' : 'Play soundscape'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span></button><label htmlFor="ambient-volume">Volume <input id="ambient-volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={event => {const value = Number(event.target.value); setVolume(value); engine.current?.setVolume(value);}} /></label><span className="radio-status" role="status">{error || (playing ? 'Playing · lo-fi orbit / 72 BPM' : 'Ready when you are. No autoplay.')}</span></div><AudioMixer mix={mix} onChange={setMix} /></section>;
}
