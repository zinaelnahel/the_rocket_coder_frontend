import {useEffect, useState} from 'react';

export default function useStoredList(key, legacyKey) {
  const [storageError, setStorageError] = useState(false);
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(key) ?? (legacyKey ? localStorage.getItem(legacyKey) : null);
      const saved = raw ? JSON.parse(raw) : [];
      return Array.isArray(saved) ? saved.filter(item => item && typeof item === 'object') : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(items)); }
    catch { setStorageError(true); }
  }, [items, key]);
  return [items, setItems, storageError];
}
