import React, {useEffect, useRef, useState} from 'react';
import alien from './Alien.gif';

export default function AlienDebugger() {
  const [problem, setProblem] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');
  const recognition = useRef(null);
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  useEffect(() => () => recognition.current?.abort(), []);
  function listen() {
    if (listening) {recognition.current?.stop(); return;}
    if (!Speech) return;
    const instance = new Speech();
    recognition.current = instance;
    instance.lang = 'en-US'; instance.interimResults = false;
    instance.onresult = event => setProblem(previous => `${previous} ${event.results[0][0].transcript}`.trim());
    instance.onend = () => setListening(false);
    instance.onerror = () => {setListening(false); setMessage('Voice input is unavailable. You can type your explanation instead.');};
    try {instance.start(); setListening(true); setMessage('');} catch {setMessage('Could not start voice input. Please try typing.');}
  }
  const query = encodeURIComponent(problem.trim());
  return <section className="tool-page"><p className="eyebrow">A FRESH PAIR OF EXTRATERRESTRIAL EYES</p><h1>Talk it through<span className="accent">.</span></h1><p className="page-intro">Sometimes explaining a bug is the first step to solving it.</p><div className="debugger-layout"><div className="alien-portrait"><img src={alien} alt="Your alien debugging companion" /><p>“Start at the beginning. I’m listening.”</p></div><div className="surface"><h2>What’s puzzling you?</h2><p className="muted">What should happen? What happens instead? What have you already tried?</p><form onSubmit={event => {event.preventDefault(); setSubmitted(true);}}><label className="sr-only" htmlFor="problem">Explain your coding problem</label><textarea id="problem" rows={7} maxLength={2000} placeholder="Explain it as if I’ve just landed on Earth…" value={problem} onChange={event => {setProblem(event.target.value); setSubmitted(false);}} /><div className="button-row"><button disabled={!problem.trim()}>Help me think</button>{Speech && <button type="button" className="secondary" aria-pressed={listening} onClick={listen}>{listening ? 'Stop listening' : 'Use my voice'}</button>}</div><p role="status" className="muted">{message || (listening ? 'Listening…' : '')}</p></form>{submitted && <div className="debug-response" role="status"><h3>Let’s narrow it down.</h3><ol><li>Find the smallest example that reproduces the issue.</li><li>Check the inputs and the exact error message.</li><li>Compare the expected result with what your code actually does.</li></ol><p>Want another perspective? Search for your explanation:</p><div className="resource-links"><a href={`https://www.google.com/search?q=${query}`} target="_blank" rel="noopener noreferrer">Search the web ↗</a><a href={`https://stackoverflow.com/search?q=${query}`} target="_blank" rel="noopener noreferrer">Search Stack Overflow ↗</a></div><small className="muted">These links open an external search. This companion uses a guided checklist, not AI-generated answers.</small></div>}</div></div></section>;
}
