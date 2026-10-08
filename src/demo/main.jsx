import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AuthLayout,
  Login,
  SignUp,
  ForgotPassword,
  LoadingScreen,
  Spinner,
  DotsLoader,
  PulseLoader,
  ProgressLoader,
  Skeleton,
  LoadingOverlay,
  Alert,
  EmptyState
} from "../index";

function Demo() {
  const [screen, setScreen] = useState("login");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(65);

  function fakeSubmit(values) {
    console.log(values);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  if (screen === "loading") {
    return <LoadingScreen title="React Custom UI" subtitle="Loading components..." />;
  }

  return (
    <AuthLayout
      brand="React Custom UI"
      tagline="Reusable components for your next React project."
      footer="MIT licensed • Built for reuse"
    >
      {screen === "login" && (
        <Login
          loading={loading}
          onSubmit={fakeSubmit}
          onForgotPassword={() => setScreen("forgot")}
          onSwitchToSignUp={() => setScreen("signup")}
        />
      )}

      {screen === "signup" && (
        <SignUp
          loading={loading}
          onSubmit={fakeSubmit}
          onSwitchToLogin={() => setScreen("login")}
        />
      )}

      {screen === "forgot" && (
        <ForgotPassword
          onSubmit={fakeSubmit}
          onBackToLogin={() => setScreen("login")}
          success={loading ? "" : ""}
        />
      )}

      <div style={{ marginTop: 40, borderTop: "1px solid #e5e7eb", paddingTop: 24 }}>
        <strong style={{ display: "block", marginBottom: 14 }}>Loading components</strong>
        <div style={{ display: "grid", gap: 16 }}>
          <Spinner size={24} />
          <DotsLoader />
          <PulseLoader />
          <ProgressLoader value={progress} label="Example progress" />
          <div style={{ display: "grid", gap: 8 }}>
            <Skeleton height={18} />
            <Skeleton width="70%" height={14} />
          </div>
        </div>

        <button
          className="rcui-primary-button"
          style={{ marginTop: 16 }}
          onClick={() => setProgress((p) => p >= 100 ? 0 : p + 10)}
        >
          Increase progress
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <Alert type="info" title="Reusable">
          Authentication logic stays in your application.
        </Alert>
      </div>
    </AuthLayout>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>
);