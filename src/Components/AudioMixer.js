import React from 'react';

export const DEFAULT_MIX = {music: 1, rain: 0, hum: 0, cafe: 0};
const layers = [['music', 'Lo-fi music', '♫'], ['rain', 'Rain', '☂'], ['hum', 'Spaceship hum', '◉'], ['cafe', 'Café murmur', '☕']];
export function readMix() {
  try {
    const saved = JSON.parse(localStorage.getItem('rocket-coder-audio-mix'));
    return Object.fromEntries(Object.entries(DEFAULT_MIX).map(([key, fallback]) => [key, typeof saved?.[key] === 'number' && Number.isFinite(saved[key]) ? Math.max(0, Math.min(1, saved[key])) : fallback]));
  } catch {return {...DEFAULT_MIX};}
}
export default function AudioMixer({mix, onChange}) {
  return <div className="audio-mixer"><div className="panel-heading"><h3>Make it your kind of quiet.</h3><span>LO-FI MIXING DESK</span></div><div className="mixer-layers">{layers.map(([key, label, icon]) => <label className="mixer-channel" key={key} htmlFor={`mix-${key}`}><span><span aria-hidden="true">{icon}</span> {label}<span className="mix-level" aria-hidden="true">{Math.round(mix[key] * 100)}%</span></span><input id={`mix-${key}`} aria-label={label} type="range" min="0" max="1" step="0.05" value={mix[key]} onChange={event => onChange({...mix, [key]: Number(event.target.value)})} /></label>)}</div><div className="mixer-presets" role="group" aria-label="Sound mix presets"><button className="secondary" onClick={() => onChange({music: 0.8, rain: 0.4, hum: 0, cafe: 0})}>Rainy moon</button><button className="secondary" onClick={() => onChange({music: 0.7, rain: 0, hum: 0.5, cafe: 0})}>Deep orbit</button><button className="secondary" onClick={() => onChange({music: 0.8, rain: 0, hum: 0, cafe: 0.55})}>Cosmic café</button><button className="text-button" onClick={() => onChange({...DEFAULT_MIX})}>Reset mix</button></div><p className="mixer-note">Original, synthesised textures. Mix before you play; all layers pause together.</p></div>;
}
