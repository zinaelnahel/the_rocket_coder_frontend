export const TASKS_KEY = `${process.env.REACT_APP_NAMESPACE || 'rocket-coder'}-tasks`;

// Persist the handoff before routing unmounts the task list.
export function persistMission(tasks) {
  try {localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); return true;}
  catch {return false;}
}
