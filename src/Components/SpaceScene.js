import React, {useEffect, useRef, useState} from 'react';

export default function SpaceScene() {
  const [launched, setLaunched] = useState(false);
  const timeout = useRef(null);
  useEffect(() => () => clearTimeout(timeout.current), []);
  function launch() {
    if (launched) return;
    setLaunched(true);
    timeout.current = setTimeout(() => setLaunched(false), 2600);
  }
  return <div className={`space-scene${launched ? ' launched' : ''}`}>
    <span className="scene-coordinate">RC—01 / THE IDEA GALAXY</span>
    <svg viewBox="0 0 500 330" className="space-illustration" aria-hidden="true">
      <defs><linearGradient id="planet-colour" x2="0.8" y2="1"><stop stopColor="#f2be8d" /><stop offset="1" stopColor="#f47e67" /></linearGradient></defs>
      <g fill="#f4eddf"><path d="M70 80v18m-9-9h18M414 171v22m-11-11h22M365 47v13m-6-6h12" stroke="currentColor" strokeWidth="2" /><circle cx="120" cy="231" r="3" /><circle cx="430" cy="85" r="3" /><circle cx="340" cy="270" r="2" /><circle cx="187" cy="41" r="2" /><circle cx="61" cy="183" r="2" /></g>
      <ellipse cx="256" cy="174" rx="178" ry="86" transform="rotate(-22 256 174)" fill="none" stroke="#b8a0db" strokeDasharray="3 8" opacity=".55" />
      <circle cx="269" cy="181" r="91" fill="url(#planet-colour)" stroke="#2d2052" strokeWidth="3" />
      <path d="M191 140q57 36 146-5M181 169q69 38 175-2M184 204q73 36 166-5M208 241q52 14 115-6" fill="none" stroke="#b94659" strokeWidth="13" opacity=".2" />
      <ellipse cx="269" cy="181" rx="143" ry="29" transform="rotate(-22 269 181)" fill="none" stroke="#d6f47c" strokeWidth="14" />
      <path d="M208 111a91 91 0 0 1 145 40" fill="none" stroke="#f6bb90" strokeWidth="6" />
      <g className="little-rocket">
        <path className="rocket-flame" d="M162 147q-43 30-35 57 29-5 48-41" fill="#f4c35d" stroke="#30204f" strokeWidth="3" />
        <path d="M155 117q-30-1-43 26l37 6m38-4q3 33-26 46l-2-35" fill="#be9cf3" stroke="#30204f" strokeWidth="3" strokeLinejoin="round" />
        <path d="M143 143q7-52 61-63 8 55-35 80z" fill="#fff3d9" stroke="#30204f" strokeWidth="3" />
        <path d="M179 88q12-6 25-8 2 14 0 27z" fill="#ee8a94" stroke="#30204f" strokeWidth="3" />
        <circle cx="174" cy="120" r="13" fill="#7065b1" stroke="#30204f" strokeWidth="3" /><path d="M168 116l8-4" stroke="#e8d5fa" strokeWidth="3" strokeLinecap="round" />
        <path d="M141 149l15 13" stroke="#30204f" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g transform="translate(373 249) rotate(15)"><rect width="67" height="36" rx="8" fill="#c8b3f0" stroke="#30204f" strokeWidth="2" /><text x="33" y="24" fill="#30204f" fontSize="19" textAnchor="middle" fontFamily="monospace">&lt;/&gt;</text></g>
      <circle cx="91" cy="268" r="19" fill="#d6f47c" stroke="#30204f" strokeWidth="2" /><path d="M83 266l6 7 11-13" fill="none" stroke="#30204f" strokeWidth="3" />
    </svg>
    <span className="scene-sticker">a little out<br /><em>of this world.</em></span>
    <button className="launch-button" onClick={launch} disabled={launched}>{launched ? 'Off to great things! ✦' : 'Give your day a little boost ↗'}</button>
    <span className="sr-only" role="status">{launched ? 'Rocket launched. One small step towards your next big idea!' : ''}</span>
  </div>;
}
