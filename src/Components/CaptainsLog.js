import React, {useState} from 'react';
import useStoredList from '../useStoredList';

export function logMarkdown(entries) {
  return '# Captain’s Log\n\n' + entries.map(entry => `## ${entry.date}\n\n### Built\n${entry.built || '—'}\n\n### Got stuck\n${entry.stuck || '—'}\n\n### Next\n${entry.next || '—'}\n`).join('\n---\n\n');
}
export default function CaptainsLog() {
  const [entries, setEntries, storageError] = useStoredList('rocket-coder-captains-log');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({built: '', stuck: '', next: ''});
  const [message, setMessage] = useState('');
  function save(event) {
    event.preventDefault();
    if (!Object.values(draft).some(value => value.trim())) return;
    const date = new Date().toLocaleDateString('en-CA');
    const entry = {...draft, id: editing || `${Date.now()}-${Math.random()}`, date};
    setEntries(previous => editing ? previous.map(item => item.id === editing ? {...item, ...draft} : item) : [entry, ...previous]);
    setDraft({built: '', stuck: '', next: ''}); setEditing(null); setMessage('Log entry saved.');
  }
  function download() {
    try {
      const url = URL.createObjectURL(new Blob([logMarkdown(entries)], {type: 'text/markdown;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = 'rocket-coder-captains-log.md';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Markdown export created. Check your browser downloads.');
    } catch {setMessage('The export could not start in this browser. Your entries are still here.');}
  }
  return <section className="tool-page"><p className="eyebrow">SMALL WINS DESERVE A RECORD</p><h1>Captain’s Log<span className="accent">.</span></h1><p className="page-intro">What you made. What got tangled. Where you’re going next.</p><div className="log-layout"><form className="surface log-form" onSubmit={save}><h2>{editing ? 'Edit your entry' : 'A note from today'}</h2>{[['built', 'What did you build?'], ['stuck', 'What got you stuck?'], ['next', 'What’s next?']].map(([key, label]) => <label key={key} htmlFor={`log-${key}`}>{label}<textarea id={`log-${key}`} rows={3} maxLength={4000} value={draft[key]} onChange={event => setDraft({...draft, [key]: event.target.value})} /></label>)}<div className="button-row"><button disabled={!Object.values(draft).some(value => value.trim())}>{editing ? 'Save changes' : 'Save log entry'}</button>{editing && <button type="button" className="secondary" onClick={() => {setEditing(null); setDraft({built: '', stuck: '', next: ''});}}>Cancel edit</button>}</div><p role="status" className="muted">{storageError ? 'Storage unavailable. Entries last for this session; export them to keep a copy.' : message}</p><small className="muted">Saved in this browser only. Export a backup to keep your notes.</small></form><section className="surface log-history" aria-labelledby="log-history-heading"><div className="panel-heading"><h2 id="log-history-heading">Previous transmissions</h2><span>{entries.length} entries</span></div><button className="secondary" disabled={!entries.length} onClick={download}>Export Markdown ↓</button>{!entries.length && <div className="empty-state"><span aria-hidden="true">✎</span><p>Your story starts with a small note.</p></div>}{entries.map(entry => <article className="log-entry" key={entry.id}><p className="eyebrow">{entry.date}</p>{[['built', 'Built'], ['stuck', 'Got stuck'], ['next', 'Next']].filter(([key]) => entry[key]).map(([key, label]) => <div key={key}><h3>{label}</h3><p>{entry[key]}</p></div>)}<div className="button-row"><button className="text-button" aria-label={`Edit log entry ${entry.date}`} onClick={() => {setEditing(entry.id); setDraft({built: entry.built || '', stuck: entry.stuck || '', next: entry.next || ''});}}>Edit</button><button className="text-button" aria-label={`Delete log entry ${entry.date}`} onClick={() => {setEntries(previous => previous.filter(item => item.id !== entry.id)); if (editing === entry.id) {setEditing(null); setDraft({built: '', stuck: '', next: ''});} setMessage('Log entry deleted.');}}>Delete</button></div></article>)}</section></div></section>;
}
