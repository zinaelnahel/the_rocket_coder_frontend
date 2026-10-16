import React, {useState} from 'react';
import useStoredList from '../useStoredList';

const keys = ['Ctrl', '⌘', 'Alt', 'Shift', 'Tab', 'Esc', 'Enter', 'Space', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
export default function ShortcutsGenerator() {
  const [saved, setSaved, storageError] = useStoredList(process.env.REACT_APP_SHORTCUTSSPACE || 'rocket-coder-shortcuts', 'undefined');
  const [combination, setCombination] = useState([]);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  function addKey(key) {setCombination(previous => previous.includes(key) ? previous.filter(item => item !== key) : [...previous, key]);}
  function save(event) {
    event.preventDefault();
    if (!combination.length || !comment.trim()) return;
    setSaved(previous => [...previous, {id: `${Date.now()}-${Math.random()}`, shortcut: combination.join(' + '), comment: comment.trim()}]);
    setCombination([]); setComment(''); setMessage('Shortcut saved.');
  }
  return <section className="tool-page"><p className="eyebrow">LESS SEARCHING. MORE MAKING.</p><h1>Shortcut notebook<span className="accent">.</span></h1><p className="page-intro">A home for the key combinations you always mean to remember.</p><div className="two-column"><form className="surface shortcut-form" onSubmit={save}><h2>Build a shortcut</h2><p className="muted">Tap keys below, or focus the capture box and press your combination.</p><div className="key-capture" role="group" tabIndex={0} aria-label="Capture shortcut keys" onKeyDown={event => {if (event.key === 'Tab') return; event.preventDefault(); const modifiers = [event.ctrlKey && 'Ctrl', event.metaKey && '⌘', event.altKey && 'Alt', event.shiftKey && 'Shift'].filter(Boolean); const key = event.key === ' ' ? 'Space' : event.key.length === 1 ? event.key.toUpperCase() : event.key; setCombination([...modifiers, ...(['Control', 'Meta', 'Alt', 'Shift'].includes(event.key) ? [] : [key])]);}}>{combination.length ? combination.map(key => <kbd key={key}>{key}</kbd>) : <span className="muted">Your keys will appear here</span>}</div><div className="keyboard" aria-label="Shortcut keys">{keys.map(key => <button key={key} type="button" className={combination.includes(key) ? 'key selected' : 'key'} aria-pressed={combination.includes(key)} onClick={() => addKey(key)}>{key}</button>)}</div><button type="button" className="text-button" onClick={() => setCombination([])}>Clear keys</button><label htmlFor="shortcut-description">What does it do?</label><input id="shortcut-description" value={comment} maxLength={160} onChange={event => setComment(event.target.value)} placeholder="For example, open the command palette" /><button disabled={!combination.length || !comment.trim()}>Save shortcut</button><p className="muted" role="status">{storageError ? 'Storage unavailable. Saved for this session only.' : message}</p></form><section className="surface"><div className="panel-heading"><h2>Your shortcuts</h2><span>{saved.length} saved</span></div>{saved.length ? <ul className="saved-shortcuts">{saved.map((item, index) => <li key={item.id || index}><div><kbd>{item.shortcut}</kbd><p>{item.comment}</p></div><button className="icon-button" aria-label={`Delete ${item.comment}`} onClick={() => setSaved(previous => previous.filter((_, itemIndex) => itemIndex !== index))}>×</button></li>)}</ul> : <div className="empty-state"><span aria-hidden="true">⌘</span><p>Your future self will thank you.</p><small>Save your first useful shortcut.</small></div>}</section></div></section>;
}
