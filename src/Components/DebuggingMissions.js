import React, {useState} from 'react';
import {debugMissions} from '../debugMissions';
import useStoredList from '../useStoredList';

export default function DebuggingMissions() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [solved, setSolved, storageError] = useStoredList('rocket-coder-solved-missions');
  const mission = debugMissions[index];
  const validSolved = new Set(solved.filter(item => debugMissions.some(candidate => candidate.id === item.id)).map(item => item.id));
  function selectMission(next) {setIndex(next); setChoice(null); setChecked(false); setHint(false); setRevealed(false);}
  function check(event) {
    event.preventDefault(); setChecked(true);
    if (choice === mission.correct) setSolved(previous => previous.some(item => item.id === mission.id) ? previous : [...previous, {id: mission.id}]);
  }
  return <section className="tool-page"><p className="eyebrow">THE ALIEN’S DEBUGGING ACADEMY</p><h1>A little bug hunt<span className="accent">.</span></h1><p className="page-intro">Small broken snippets. Useful fixes. A tester’s eye for what could go wrong.</p><div className="mission-tabs" role="group" aria-label="Choose debugging mission">{debugMissions.map((item, next) => <button key={item.id} className={index === next ? '' : 'secondary'} aria-pressed={index === next} onClick={() => selectMission(next)}>{next + 1}. {item.title}{validSolved.has(item.id) ? ' ✓' : ''}</button>)}</div><article className="surface debugging-mission"><div className="panel-heading"><p className="eyebrow">{mission.topic}</p><span>{validSolved.size}/{debugMissions.length} solved</span></div><h2>{mission.title}</h2><p>{mission.brief}</p><pre><code>{mission.code}</code></pre><form onSubmit={check}><fieldset disabled={checked}><legend>Choose the fix</legend>{mission.options.map((option, answer) => <label className="quiz-answer" key={option}><input type="radio" name="mission-answer" checked={choice === answer} onChange={() => setChoice(answer)} /><span>{option}</span></label>)}</fieldset><div className="button-row"><button disabled={choice === null || checked}>Check my fix</button><button type="button" className="secondary" onClick={() => setHint(!hint)}>{hint ? 'Hide hint' : 'Need a hint?'}</button><button type="button" className="text-button" onClick={() => setRevealed(true)}>Reveal solution</button></div></form>{hint && <p className="mission-hint">✦ {mission.hint}</p>}{checked && <div className="quiz-feedback" role="status"><strong>{choice === mission.correct ? 'Mission solved. Nice debugging!' : 'Not quite. Try tracing the edge case.'}</strong><p>{choice === mission.correct ? mission.explanation : 'Use the hint, or reveal the solution to work through the cause.'}</p>{choice !== mission.correct && <button className="secondary" onClick={() => {setChecked(false); setChoice(null);}}>Try again</button>}</div>}{(revealed || (checked && choice === mission.correct)) && <div className="mission-solution"><h3>The fix</h3><p>{mission.explanation}</p><pre><code>{mission.fixed}</code></pre><h3>A regression test to keep it fixed</h3><pre><code>{mission.test}</code></pre><small className="muted">These are teaching examples. Code is displayed, not executed in this page.</small></div>}{index < debugMissions.length - 1 && <button className="secondary" onClick={() => selectMission(index + 1)}>Next mission →</button>}{storageError && <p className="muted" role="status">Progress could not be saved. You can still complete the missions this session.</p>}</article></section>;
}
