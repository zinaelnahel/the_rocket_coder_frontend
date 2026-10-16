import React, {useState} from 'react';
import Task from './Task';
import useStoredList from '../useStoredList';

export default function ToDo() {
  const [tasks, setTasks, storageError] = useStoredList(`${process.env.REACT_APP_NAMESPACE || 'rocket-coder'}-tasks`, 'undefined-tasks');
  const [text, setText] = useState('');
  function addTask(event) {
    event.preventDefault();
    if (!text.trim()) return;
    setTasks(previous => [{id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text: text.trim(), checked: false}, ...previous]);
    setText('');
  }
  function updateTask(id, changes) {
    setTasks(previous => previous.map(task => task.id === id ? {...task, ...changes} : task));
  }
  const completed = tasks.filter(task => task.checked).length;
  return <section className="tasks-panel" aria-labelledby="tasks-heading">
    <div className="panel-heading"><h2 id="tasks-heading">Today’s mission</h2><span>{completed}/{tasks.length} complete</span></div>
    <form onSubmit={addTask} className="task-form"><label className="sr-only" htmlFor="new-task">New task</label><input id="new-task" value={text} onChange={event => setText(event.target.value)} maxLength={240} placeholder="What would you like to get done?" /><button type="submit" disabled={!text.trim()}>Add task <span aria-hidden="true">+</span></button></form>
    {storageError && <p role="status" className="muted">Browser storage is unavailable. Changes will last for this session.</p>}
    {tasks.length ? <ul className="task-list">{tasks.map(task => <Task key={task.id} task={task} onUpdate={changes => updateTask(task.id, changes)} onDelete={() => setTasks(previous => previous.filter(item => item.id !== task.id))} />)}</ul> : <div className="empty-state"><span aria-hidden="true">✦</span><p>A little space for your next big thing.</p><small>Add a task to begin your mission.</small></div>}
  </section>;
}
