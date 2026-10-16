import React, {useState} from 'react';
import guelden from './guelden.png';
import zina from './zina.png';
import claudia from './claudia.png';
import video from './video.mp4';

const crew = [
  {name: 'Gülden', image: guelden, github: 'https://github.com/GueldenBayar', linkedin: 'https://www.linkedin.com/in/gülden-bayar-705962218'},
  {name: 'Zina', image: zina, github: 'https://github.com/zinaelnahel', linkedin: 'https://www.linkedin.com/in/zina-el-nahel/'},
  {name: 'Claudia', image: claudia, github: 'https://github.com/claurennt', linkedin: 'https://www.linkedin.com/in/hello-world-claudia-here/'},
];
export default function Credits() {
  const [videoError, setVideoError] = useState(false);
  return <section className="tool-page"><p className="eyebrow">BUILT TOGETHER</p><h1>Meet the crew<span className="accent">.</span></h1><p className="page-intro">Three curious coders. One little corner of the universe.</p><div className="crew-grid">{crew.map(person => <article className="surface crew-card" key={person.name}><img src={person.image} alt={person.name} width="180" height="180" /><h2>{person.name}</h2><div className="resource-links"><a href={person.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></article>)}</div>{videoError ? <p className="video-fallback" role="status">The original crew video cannot play in this browser. You can still meet the team through the profiles above.</p> : <video className="crew-video" src={video} autoPlay muted loop playsInline controls preload="auto" onError={() => setVideoError(true)} aria-label="The Rocket Coder project video" />}<p className="muted">Alien animation: <a href="https://bestanimations.com/gifs/Little-Gray-Extraterrestrial-Alien-Face.html" target="_blank" rel="noopener noreferrer">Best Animations ↗</a>.</p></section>;
}
