import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AuthLayout, Login, SignUp, ForgotPassword, LoadingScreen, Spinner, DotsLoader,
  PulseLoader, ProgressLoader, Skeleton, Alert, ThemeProvider, ThemeToggle
} from "../index";

const authLayouts = [
  ["split", "Split screen"], ["minimal", "Minimal"], ["glass", "Dark glass"],
  ["gradient", "Gradient"], ["aurora", "Aurora"], ["editorial", "Editorial"],
  ["terminal", "Terminal"], ["centered", "Centered card"]
];
const loadingLayouts = ["classic", "minimal", "gradient", "glass", "terminal", "orbit"];

function Demo() {
  const [screen, setScreen] = useState("login");
  const [layout, setLayout] = useState("split");
  const [loadingLayout, setLoadingLayout] = useState("classic");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(65);
  const [error, setError] = useState("");

  function fakeSubmit(values) {
    console.log("Demo form submission (no API request):", values);
    setError("");
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1200);
  }

  if (screen === "loading") {
    return <div className="rcui-demo-loading-wrap">
      <div className="rcui-demo-toolbar"><label>Loading design <select value={loadingLayout} onChange={e => setLoadingLayout(e.target.value)}>{loadingLayouts.map(item => <option key={item} value={item}>{item}</option>)}</select></label><button className="rcui-secondary-button" onClick={() => setScreen("login")}>Back to demo</button></div>
      <LoadingScreen layout={loadingLayout} title="React Custom UI" subtitle="Loading your workspace..." progress={progress} />
      <button className="rcui-demo-progress-button" onClick={() => setProgress(p => p >= 100 ? 0 : p + 10)}>Advance progress ({progress}%)</button>
    </div>;
  }

  return <div className="rcui-demo-app">
    <div className="rcui-demo-toolbar">
      <label>Authentication layout <select value={layout} onChange={e => setLayout(e.target.value)}>{authLayouts.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <div className="rcui-demo-actions"><button className="rcui-secondary-button" onClick={() => setScreen("loading")}>Preview loading screens</button><ThemeToggle /></div>
    </div>
    <AuthLayout layout={layout} brand="React Custom UI" tagline="A flexible starting point for your next product." footer="MIT licensed · Authentication UI only · No backend included">
      {screen === "login" && <Login loading={loading} error={error} onSubmit={fakeSubmit} onForgotPassword={() => setScreen("forgot")} onSwitchToSignUp={() => setScreen("signup")} />}
      {screen === "signup" && <SignUp loading={loading} onSubmit={fakeSubmit} onSwitchToLogin={() => setScreen("login")} />}
      {screen === "forgot" && <ForgotPassword onSubmit={fakeSubmit} onBackToLogin={() => setScreen("login")} />}
      <div className="rcui-demo-note"><Alert type="info" title="Demo mode">Forms share the same functionality in every layout. Submissions are simulated in this preview; connect your own API in your application.</Alert></div>
    </AuthLayout>
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><ThemeProvider><Demo /></ThemeProvider></React.StrictMode>);
