import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CircleHelp, Code2, Copy, Layers3, LoaderCircle, Play, RotateCcw, Sparkles, Zap } from 'lucide-react';

const LAYOUTS = [
  { id: 'classic', name: 'Classic', label: 'Balanced and familiar', description: 'A clean progress bar with a compact status message.', accent: '#6d5dfc' },
  { id: 'minimal', name: 'Minimal', label: 'Quiet and focused', description: 'A restrained spinner and simple progress indicator.', accent: '#242424' },
  { id: 'gradient', name: 'Gradient', label: 'Bright and expressive', description: 'A vivid gradient ring paired with a bold progress bar.', accent: '#9a55f7' },
  { id: 'glass', name: 'Glass', label: 'Soft glassmorphism', description: 'Translucent panels, blur, and a luminous accent.', accent: '#7c75ff' },
  { id: 'terminal', name: 'Terminal', label: 'Developer-inspired', description: 'A command-line inspired loading state with live output.', accent: '#73f5a3' },
  { id: 'orbit', name: 'Orbit', label: 'Playful and spatial', description: 'Orbital dots animate around a central progress ring.', accent: '#5dd9e8' },
  { id: 'pulse', name: 'Pulse', label: 'Soft and energetic', description: 'A pulsing mark, calm typography, and a slim progress line.', accent: '#ff8b6a' },
];
const DURATION = 5000;

function Landing({ onPreview }) {
  return <main className="landing-page">
    <nav className="top-nav"><a className="brand" href="#home" aria-label="Loading Screens home"><span className="brand-mark"><Layers3 size={19} /></span><span>loading<span className="brand-light">kit</span></span></a><div className="nav-right"><span className="nav-chip"><span className="status-dot" /> React component library</span><a href="#layouts">Layouts</a><a href="#about">About</a></div></nav>
    <section className="hero" id="home">
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={14} /> A small UI kit with big range</div><h1>Loading screens,<br /><span>made reusable.</span></h1><p className="hero-description">Seven distinct loading experiences. One shared progress engine. Pick a layout, preview it live, and bring the component into your next React project.</p><div className="hero-actions"><button className="primary-button" onClick={onPreview}>Preview loading screens <ArrowRight size={17} /></button><a className="text-button" href="#layouts">Explore the layouts <ArrowRight size={15} /></a></div><div className="hero-proof"><div className="avatar-stack"><span>R</span><span>UI</span><span>JS</span></div><div><strong>One component. Seven styles.</strong><small>Responsive · Customizable · React-ready</small></div></div></div>
      <div className="hero-art" aria-label="Preview of a loading screen component"><div className="art-glow" /><div className="art-window"><div className="window-top"><div className="window-dots"><i /><i /><i /></div><span>loading-preview.jsx</span><Code2 size={15} /></div><div className="art-content"><div className="art-icon"><LoaderCircle size={28} /></div><div className="art-title">Getting things ready</div><div className="art-subtitle">This should only take a moment.</div><div className="art-progress"><span /></div><div className="art-progress-meta"><span>Loading resources</span><b>72%</b></div><div className="art-tags"><span><Check size={12} /> Shared progress</span><span><Zap size={12} /> 5 second cycle</span></div></div></div><div className="floating-card floating-top"><span className="floating-icon purple"><Sparkles size={16} /></span><div><b>7 layouts</b><small>Same functionality</small></div></div><div className="floating-card floating-bottom"><span className="floating-icon green"><Check size={16} /></span><div><b>Progress synced</b><small>0% → 100%</small></div></div><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /></div>
    </section>
    <section className="feature-strip"><div><span className="feature-icon"><RotateCcw size={18} /></span><div><b>Consistent behavior</b><small>One progress state across every style</small></div></div><div><span className="feature-icon"><Layers3 size={18} /></span><div><b>7 distinct layouts</b><small>From minimal to developer-focused</small></div></div><div><span className="feature-icon"><Code2 size={18} /></span><div><b>Made for React</b><small>Easy to customize and reuse</small></div></div></section>
    <section className="layouts-section" id="layouts"><div className="section-heading"><div><div className="eyebrow">THE COLLECTION</div><h2>Find your loading style.</h2></div><button className="secondary-button" onClick={onPreview}>View all layouts <ArrowRight size={16} /></button></div><div className="layout-grid">{LAYOUTS.map((layout, index) => <button key={layout.id} className="layout-card" onClick={onPreview}><div className={`mini-preview mini-${layout.id}`}><div className="mini-center"><span className="mini-spinner" /><span className="mini-line" /><span className="mini-line short" /></div><span className="mini-number">0{index + 1}</span></div><div className="layout-card-meta"><div><b>{layout.name}</b><small>{layout.label}</small></div><ArrowRight size={16} /></div></button>)}</div></section>
    <section className="bottom-cta" id="about"><div className="cta-icon"><Sparkles size={22} /></div><div><h2>Make loading feel intentional.</h2><p>Try the layouts in a live preview, then choose the one that fits your product.</p></div><button className="primary-button" onClick={onPreview}>Open live preview <ArrowRight size={17} /></button></section>
    <footer><a className="brand footer-brand" href="#home"><span className="brand-mark"><Layers3 size={17} /></span><span>loading<span className="brand-light">kit</span></span></a><span>Built for your next React project.</span><span>Reusable UI · 2026</span></footer>
  </main>;
}

function LoadingCanvas({ layout, progress, done }) {
  const remaining = Math.max(0, Math.ceil((100 - progress) / 20));
  const label = done ? 'Everything is ready' : 'Getting things ready';
  if (layout === 'terminal') return <div className="loading-canvas canvas-terminal"><div className="terminal-top"><span /><span /><span /><b>system_process.log</b></div><div className="terminal-body"><p><span className="terminal-green">$</span> initialize_application()</p><p className="terminal-muted">Checking dependencies...</p><p><span className="terminal-green">✓</span> Core modules loaded</p><p><span className="terminal-green">✓</span> Assets prepared</p><p><span className="terminal-green">{done ? '✓' : '›'}</span> {done ? 'Initialization complete' : 'Loading resources'}<span className="terminal-cursor">▌</span></p><div className="terminal-track"><span style={{ width: `${progress}%` }} /></div><div className="terminal-bottom"><span>{done ? 'COMPLETE' : 'PROCESSING'}</span><b>{progress}%</b></div></div></div>;
  return <div className={`loading-canvas canvas-${layout}`}>
    <div className={`loader-emblem emblem-${layout}`}>
      {layout === 'orbit' ? <><span className="orbit-dot dot-a" /><span className="orbit-dot dot-b" /><span className="orbit-dot dot-c" /><div className="orbit-core">{progress}%</div></> : layout === 'pulse' ? <><span className="pulse-ring" /><span className="pulse-core"><Sparkles size={25} /></span></> : layout === 'minimal' ? <span className="minimal-spinner" /> : layout === 'gradient' ? <div className="gradient-ring"><span>{progress}%</span></div> : layout === 'glass' ? <div className="glass-spinner"><LoaderCircle size={34} /></div> : <div className="classic-emblem"><LoaderCircle size={34} /></div>}
    </div>
    <div className="canvas-title">{label}</div><div className="canvas-description">{done ? 'Your experience is ready to go.' : layout === 'terminal' ? 'Please wait while the process finishes.' : 'This should only take a moment.'}</div>
    {layout !== 'orbit' && layout !== 'gradient' && <div className={`canvas-track track-${layout}`}><span style={{ width: `${progress}%` }} /></div>}
    <div className="canvas-meta"><span>{done ? 'Completed' : layout === 'terminal' ? 'Loading modules' : 'Loading resources'}</span><b>{progress}%</b></div>
    <div className="canvas-footnote">{done ? <><Check size={14} /> All systems ready</> : <><span className="tiny-dot" /> {remaining} steps remaining</>}</div>
  </div>;
}

function Preview({ onBack }) {
  const [selected, setSelected] = useState('classic');
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const startedAt = useRef(Date.now());
  const pausedAt = useRef(null);
  const carried = useRef(0);
  const activeLayout = useMemo(() => LAYOUTS.find((x) => x.id === selected) || LAYOUTS[0], [selected]);
  const reset = useCallback(() => { startedAt.current = Date.now(); carried.current = 0; pausedAt.current = null; setProgress(0); setIsRunning(true); }, []);
  useEffect(() => {
    if (!isRunning || progress >= 100) return undefined;
    const tick = () => {
      const elapsed = carried.current + (Date.now() - startedAt.current);
      const next = Math.min(100, Math.floor(elapsed / DURATION * 100));
      setProgress((old) => next > old ? next : old);
      if (next >= 100) setIsRunning(false);
    };
    tick();
    const id = window.setInterval(tick, 50);
    return () => window.clearInterval(id);
  }, [isRunning, progress]);
  const advance = () => {
    if (progress >= 100) { reset(); return; }
    const next = Math.min(100, Math.ceil((progress + 1) / 25) * 25);
    const elapsedTarget = next / 100 * DURATION;
    carried.current = elapsedTarget;
    startedAt.current = Date.now();
    setProgress(next);
    if (next >= 100) setIsRunning(false); else setIsRunning(true);
  };
  const toggleRun = () => {
    if (progress >= 100) { reset(); return; }
    if (isRunning) {
      carried.current += Date.now() - startedAt.current;
      setIsRunning(false);
    } else {
      startedAt.current = Date.now();
      setIsRunning(true);
    }
  };
  return <main className="preview-page">
    <header className="preview-header"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Back to demo</button><a className="brand" href="#preview"><span className="brand-mark"><Layers3 size={18} /></span><span>loading<span className="brand-light">kit</span></span></a><div className="preview-header-right"><span className="live-pill"><span className="status-dot" /> Live preview</span><button className="icon-button" title="About this preview" onClick={() => window.alert('All layouts share the same progress state. The automatic cycle takes 5 seconds from 0% to 100%.')}><CircleHelp size={18} /></button></div></header>
    <div className="preview-layout" id="preview"><aside className="layout-sidebar"><div className="sidebar-heading"><div><div className="eyebrow">CUSTOMIZE</div><h1>Select design</h1></div><span className="layout-count">07</span></div><p className="sidebar-description">Choose a visual style. The loading behavior stays the same.</p><div className="layout-options">{LAYOUTS.map((item, i) => <button key={item.id} className={`layout-option ${selected === item.id ? 'selected' : ''}`} onClick={() => setSelected(item.id)}><span className={`option-thumb thumb-${item.id}`}><span /></span><span className="option-copy"><b>{item.name}</b><small>{item.label}</small></span>{selected === item.id ? <span className="selected-check"><Check size={13} /></span> : <span className="option-index">0{i + 1}</span>}</button>)}</div><div className="sidebar-tip"><Sparkles size={16} /><p><b>Same engine, different look.</b><br />Progress, restart, and timing are shared by every design.</p></div></aside>
      <section className="preview-main"><div className="preview-title-row"><div><div className="eyebrow">LIVE COMPONENT PREVIEW</div><h2>{activeLayout.name} <span>layout</span></h2><p>{activeLayout.description}</p></div><div className="preview-badge"><span className="status-dot" /> {isRunning ? 'Running' : progress >= 100 ? 'Complete' : 'Paused'}</div></div>
        <div className={`preview-stage stage-${selected}`}><div className="stage-grid" /><div className="stage-glow" /><div className="stage-inner"><LoadingCanvas layout={selected} progress={progress} done={progress >= 100} /></div><div className="stage-caption"><span>PREVIEW / {activeLayout.name.toUpperCase()}</span><span>RESPONSIVE COMPONENT</span></div></div>
        <div className="progress-panel"><div className="progress-heading"><div><span className="panel-label">PROGRESS</span><div className="progress-number">{progress}<span>%</span></div></div><div className="progress-state"><span className={`progress-state-dot ${progress >= 100 ? 'complete' : ''}`} />{progress >= 100 ? 'Finished successfully' : isRunning ? 'Automatically progressing' : 'Progress paused'}</div></div><div className="main-track"><span style={{ width: `${progress}%` }} /></div><div className="timeline"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div><div className="control-row"><div className="control-note"><span className="control-note-icon"><Zap size={15} /></span><span><b>5-second loading cycle</b><small>From 0% to 100% automatically</small></span></div><div className="control-buttons"><button className="secondary-button control-secondary" onClick={reset}><RotateCcw size={15} /> Restart</button><button className="primary-button control-primary" onClick={advance}>{progress >= 100 ? <RotateCcw size={15} /> : <Play size={15} />}{progress >= 100 ? 'Run again' : 'Advance progress'}</button></div></div></div>
        <div className="preview-foot"><span><span className="tiny-dot" /> State synced across all layouts</span><button onClick={() => { const snippet = `<LoadingScreen layout="${selected}" progress={progress} />`; if (navigator.clipboard?.writeText) navigator.clipboard.writeText(snippet).then(() => window.alert('Example snippet copied.')); else window.alert(snippet); }}><Copy size={14} /> Copy example snippet</button></div>
      </section></div>
  </main>;
}

export default function App() {
  const [page, setPage] = useState('landing');
  useEffect(() => { document.title = page === 'preview' ? 'Live Preview — Loading Kit' : 'Loading Screens — React UI Kit'; }, [page]);
  return page === 'preview' ? <Preview onBack={() => setPage('landing')} /> : <Landing onPreview={() => setPage('preview')} />;
}

export { App as LoadingDemo };
