import React from 'react';
import {Link} from 'react-router-dom';

export default function Practice() {
  return <section className="tool-page"><p className="eyebrow">A LITTLE PRACTICE, WHEN YOU FEEL LIKE IT</p><h1>Keep it curious<span className="accent">.</span></h1><p className="page-intro">Two ways to stretch your coding muscles. Pick a short challenge and take your time.</p><div className="practice-options"><Link className="surface practice-option" to="/missions"><span className="tool-icon" aria-hidden="true">✦</span><h2>Alien bug missions</h2><p>Find the fault, explore a fix, and see a regression test that keeps it fixed.</p><span className="tool-link">Go bug hunting ↗</span></Link><Link className="surface practice-option" to="/robocodingquiz"><span className="tool-icon" aria-hidden="true">⌘</span><h2>Coding quiz</h2><p>A quick React refresher with feedback after each answer.</p><span className="tool-link">Try the quiz ↗</span></Link></div></section>;
}
