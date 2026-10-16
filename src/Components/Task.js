import React, {useState} from 'react';

export default function Task({task, onUpdate, onDelete}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  function save(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    onUpdate({text: draft.trim()});
    setEditing(false);
  }
  return <li className={`task-row${task.checked ? ' completed' : ''}`}>
    <input type="checkbox" checked={Boolean(task.checked)} onChange={() => onUpdate({checked: !task.checked})} aria-label={`Complete ${task.text}`} />
    {editing ? <form className="task-edit" onSubmit={save}><input autoFocus aria-label="Edit task" value={draft} maxLength={240} onChange={event => setDraft(event.target.value)} onKeyDown={event => {if (event.key === 'Escape') setEditing(false);}} /><button type="submit" disabled={!draft.trim()}>Save</button><button type="button" onClick={() => setEditing(false)}>Cancel</button></form> : <><span className="task-text">{task.text}</span><button className="icon-button" onClick={() => {setDraft(task.text); setEditing(true);}} aria-label={`Edit ${task.text}`}>Edit</button></>}
    <button className="icon-button" onClick={onDelete} aria-label={`Delete ${task.text}`}>×</button>
  </li>;
}
