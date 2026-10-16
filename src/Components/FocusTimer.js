import React, {useEffect, useRef, useState} from 'react';
import beep1 from '../sounds/beep1.mp3';
import beep2 from '../sounds/beep2.mp3';
import useStoredList from '../useStoredList';
import {TASKS_KEY} from '../taskStorage';

export default function FocusTimer() {
  const [tasks, setTasks] = useStoredList(TASKS_KEY, 'undefined-tasks');
  const mission = tasks.find(task => task.activeMission && !task.checked);
  const availableTasks = tasks.filter(task => !task.checked);
  function chooseMission(id) {
    setTasks(previous => previous.map(task => ({...task, activeMission: String(task.id) === id})));
  }
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [sound, setSound] = useState('off');
  const [volume, setVolume] = useState(0.5);
  const deadline = useRef(0);
  const audio = useRef(null);
  useEffect(() => {
    if (!running) return;
    function tick() {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) {
        setRunning(false); setFinished(true);
      }
    }
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [running, minutes]);
  useEffect(() => {
    if (finished && sound !== 'off' && audio.current) {
      audio.current.volume = volume;
      audio.current.play().catch(() => {});
    }
  }, [finished, sound, volume]);
  function reset() {
    setRunning(false); setFinished(false); setSeconds(minutes * 60);
    if (audio.current) {audio.current.pause(); audio.current.currentTime = 0;}
  }
  function toggle() {
    if (running) {setRunning(false); return;}
    const duration = seconds > 0 ? seconds : minutes * 60;
    setSeconds(duration); setFinished(false);
    deadline.current = Date.now() + duration * 1000;
    setRunning(true);
  }
  return <section className="tool-page" aria-labelledby="timer-heading"><p className="eyebrow">ONE SMALL STEP AT A TIME</p><h1 id="timer-heading">Find your focus<span className="accent">.</span></h1><p className="page-intro">Pick one thing. Give it your full attention. The rest can wait.</p><section className="mission-control" aria-labelledby="mission-control-heading"><div><p className="eyebrow">MISSION CONTROL</p><h2 id="mission-control-heading">{mission ? mission.text : 'One thing at a time.'}</h2><p>{mission ? 'Your mission is selected. Press Start session when you are ready.' : 'Choose an unfinished task, or enjoy a free-flight focus session.'}</p></div><div className="mission-controls"><label htmlFor="active-mission">Current mission</label><select id="active-mission" disabled={running} value={mission ? String(mission.id) : ''} onChange={event => chooseMission(event.target.value)}><option value="">Free-flight session</option>{availableTasks.map(task => <option key={task.id} value={String(task.id)}>{task.text}</option>)}</select>{mission && <button className="secondary" disabled={running} onClick={() => setTasks(previous => previous.map(task => task.id === mission.id ? {...task, checked: true, activeMission: false} : task))}>Mark mission complete ✓</button>}</div></section><div className="timer-layout"><div className="surface timer-panel"><div className="panel-heading"><h2>Focus session</h2><span className="status-pill">{running ? 'In orbit' : finished ? 'Mission complete' : 'Ready for launch'}</span></div><div className="timer-dial" style={{'--progress': `${(1 - seconds / (minutes * 60)) * 360}deg`}}><span className="timer-digits" role="timer" aria-label="Time remaining">{String(Math.floor(seconds / 60)).padStart(2, '0')}<span>:</span>{String(seconds % 60).padStart(2, '0')}</span><span className="muted">A LITTLE SPACE TO THINK</span></div><div className="button-row"><button onClick={toggle}>{running ? 'Pause session' : finished ? 'Start again' : 'Start session'}</button><button className="secondary" onClick={reset}>Reset</button></div><p role="status" className="session-message">{finished ? 'Nice work. Step away, stretch and take a short break.' : 'Your next small win starts here.'}</p></div><aside className="surface timer-settings"><h2>Your session</h2><label htmlFor="session-length">Session length</label><select id="session-length" value={minutes} disabled={running} onChange={event => {const value = Number(event.target.value); setMinutes(value); setSeconds(value * 60); setFinished(false);}}>{[1, 5, 15, 25, 45, 60].map(value => <option key={value} value={value}>{value} minutes</option>)}</select><label htmlFor="timer-sound">Completion sound</label><select id="timer-sound" value={sound} onChange={event => setSound(event.target.value)}><option value="off">Silent</option><option value="1">Soft chime</option><option value="2">Space signal</option></select><label htmlFor="timer-volume">Volume</label><input id="timer-volume" type="range" min="0" max="1" step="0.1" value={volume} onChange={event => setVolume(Number(event.target.value))} /><div className="tip"><span aria-hidden="true">✦</span><p>Close the extra tabs. Silence notifications. You’ve got this.</p></div></aside></div><audio ref={audio} src={sound === '1' ? beep1 : beep2} preload="none" /></section>;
}
