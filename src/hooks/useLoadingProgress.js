import { useCallback, useEffect, useRef, useState } from 'react';
export function useLoadingProgress(duration = 5000, interval = 40) {
  const [progress, setProgress] = useState(0); const [running, setRunning] = useState(true); const startedAt = useRef(Date.now()); const elapsedBefore = useRef(0);
  const restart = useCallback(() => { startedAt.current = Date.now(); elapsedBefore.current = 0; setProgress(0); setRunning(true); }, []);
  const advance = useCallback((amount = 25) => setProgress(value => Math.min(100, Math.ceil((value + 1) / amount) * amount)), []);
  useEffect(() => { if (!running || progress >= 100) return; const id = setInterval(() => { const next = Math.min(100, Math.floor((elapsedBefore.current + Date.now() - startedAt.current) / duration * 100)); setProgress(old => Math.max(old, next)); if (next >= 100) setRunning(false); }, interval); return () => clearInterval(id); }, [duration, interval, progress, running]);
  return { progress, running, restart, advance, setProgress };
}
