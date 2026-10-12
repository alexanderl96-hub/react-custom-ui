import React, { useEffect, useState } from 'react';
import '../../themes/ui-kit.css';

export const LOADING_LAYOUTS = ['classic', 'minimal', 'gradient', 'glass', 'terminal', 'orbit', 'pulse'];
export function LoadingPage({ layout = 'classic', duration = 5000, title = 'Getting things ready', subtitle = 'This should only take a moment.', onComplete, showProgress = true }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => { const started = Date.now(); const id = setInterval(() => { const next = Math.min(100, Math.floor((Date.now() - started) / duration * 100)); setProgress(next); if (next >= 100) { clearInterval(id); onComplete?.(); } }, 40); return () => clearInterval(id); }, [duration, onComplete]);
  return <main className={`ui-loading ui-loading--${layout}`} role="status" aria-live="polite"><div className="ui-loading-mark"><span className="ui-loading-spinner" /></div><h2>{progress >= 100 ? 'Everything is ready' : title}</h2><p>{progress >= 100 ? 'Your experience is ready to go.' : subtitle}</p>{showProgress && <><div className="ui-loading-track"><span style={{ width: `${progress}%` }} /></div><div className="ui-loading-meta"><span>{progress >= 100 ? 'Complete' : 'Loading resources'}</span><strong>{progress}%</strong></div></>}</main>;
}
export default LoadingPage;
