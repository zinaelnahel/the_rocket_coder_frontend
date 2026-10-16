import React from 'react';
import {Link} from 'react-router-dom';
import MainBody from './MainBody';
import SpaceScene from './SpaceScene';

const tools = [
  ['/focustimer', '◷', 'Find your focus', 'One task. One session. A little more headspace.', 'Focus timer'],
  ['/aliendebugger', '☄', 'Talk it through', 'Meet your extraterrestrial rubber duck.', 'Alien debugger'],
  ['/robocodingquiz', '⌘', 'Keep your mind curious', 'A quick refresher for your coding knowledge.', 'Coding quiz'],
  ['/shortcutsgenerator', '⌥', 'Make room for shortcuts', 'Keep useful key combinations close at hand.', 'Shortcut notebook'],
];
export default function Home() {
  return <div className="home-layout"><MainBody /><aside className="launchpad" aria-label="Your coding tools"><SpaceScene /><p className="eyebrow">A LITTLE HELP FROM YOUR CREW</p><div className="tool-grid">{tools.map(([path, icon, title, description, label], index) => <Link to={path} className="tool-card" key={path}><span className="tool-number">0{index + 1} / YOUR SPACE KIT</span><span className="tool-icon" aria-hidden="true">{icon}</span><h2>{title}</h2><p>{description}</p><span className="tool-link">{label} <span aria-hidden="true">↗</span></span></Link>)}</div></aside></div>;
}
