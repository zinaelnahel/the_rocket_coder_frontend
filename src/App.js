import React, {useEffect} from 'react';
import {Switch, Route, useLocation} from 'react-router-dom';
import './App.css';
import './exploration.css';
import AmbientPlayer from './Components/AmbientPlayer';
import Navigation from './Components/SwipeableTemporaryDrawer';
import Home from './Components/Home';
import AlienDebugger from './Components/AlienDebugger';
import FocusTimer from './Components/FocusTimer';
import RoboCodingQuiz from './Components/RoboCodingQuiz';
import ShortcutsGenerator from './Components/ShortcutsGenerator';
import Credits from './Components/Credits';
import CaptainsLog from './Components/CaptainsLog';
import DebuggingMissions from './Components/DebuggingMissions';
import Practice from './Components/Practice';

export default function App() {
  const {pathname} = useLocation();
  useEffect(() => {
    document.title = 'The Rocket Coder · Your coding launchpad';
    document.getElementById('main-content')?.focus({preventScroll: true});
  }, [pathname]);
  return <div className="App"><a href="#main-content" className="skip-link">Skip to content</a><Navigation /><main id="main-content" tabIndex={-1}><Switch><Route exact path="/"><Home /></Route><Route path="/focustimer"><FocusTimer /></Route><Route path="/aliendebugger"><AlienDebugger /></Route><Route path="/practice"><Practice /></Route><Route path="/robocodingquiz"><RoboCodingQuiz /></Route><Route path="/shortcutsgenerator"><ShortcutsGenerator /></Route><Route path="/log"><CaptainsLog /></Route><Route path="/missions"><DebuggingMissions /></Route><Route path="/credits"><Credits /></Route><Route><section className="tool-page"><h1>Lost in space?</h1><p>Choose a tool from the navigation to get back on course.</p></section></Route></Switch></main><div className="radio-container"><AmbientPlayer /></div><footer className="site-footer"><span>Made for curious minds &amp; small daily wins.</span><span>THE ROCKET CODER <span className="accent">✦</span></span></footer></div>;
}
