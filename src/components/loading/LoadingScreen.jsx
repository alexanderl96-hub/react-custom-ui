import React from "react";
import Spinner from "./Spinner";

/** Full-page loading screen. Layout options: classic, minimal, gradient, glass, terminal, orbit. */
export default function LoadingScreen({
  title = "Loading",
  subtitle = "Please wait...",
  logo,
  spinnerSize = 44,
  layout = "classic",
  progress,
  className = ""
}) {
  const layouts = ["classic", "minimal", "gradient", "glass", "terminal", "orbit"];
  const selected = layouts.includes(layout) ? layout : "classic";
  return (
    <main className={`rcui-loading-screen rcui-loading-${selected} ${className}`.trim()} data-layout={selected} role="status" aria-live="polite">
      {selected === "terminal" && <div className="rcui-loading-terminal-prefix">$ initializing --please-wait</div>}
      {selected === "orbit" && <div className="rcui-orbit-art" aria-hidden="true"><span /><span /><span /></div>}
      {logo ? <img className="rcui-loading-logo" src={logo} alt="" /> : <div className="rcui-loading-logo-placeholder">{selected === "terminal" ? ">_" : "R"}</div>}
      {selected !== "orbit" && <Spinner size={spinnerSize} />}
      <h2>{title}</h2>
      <p>{subtitle}</p>
      {typeof progress === "number" && (
        <div className="rcui-loading-progress" aria-label={`Loading ${Math.max(0, Math.min(100, progress))}%`}>
          <span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </div>
      )}
    </main>
  );
}
