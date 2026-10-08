import React, { useState } from "react";

export default function Login({
  title = "Welcome back",
  subtitle = "Sign in to continue to your account.",
  emailLabel = "Email",
  passwordLabel = "Password",
  emailPlaceholder = "you@example.com",
  passwordPlaceholder = "Enter your password",
  submitLabel = "Sign in",
  loading = false,
  error = "",
  rememberMe = true,
  forgotPasswordLabel = "Forgot password?",
  signUpLabel = "Don't have an account?",
  signUpActionLabel = "Create account",
  onSubmit,
  onForgotPassword,
  onSwitchToSignUp,
  className = ""
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.({ email, password, remember });
  }

  return (
    <div className={`rcui-auth-form ${className}`}>
      <div className="rcui-form-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="rcui-field">
          <span>{emailLabel}</span>
          <input
            type="email"
            value={email}
            placeholder={emailPlaceholder}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="rcui-field">
          <span>{passwordLabel}</span>
          <input
            type="password"
            value={password}
            placeholder={passwordPlaceholder}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <div className="rcui-form-row">
          {rememberMe ? (
            <label className="rcui-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          ) : <span />}

          {onForgotPassword && (
            <button
              type="button"
              className="rcui-link-button"
              onClick={onForgotPassword}
            >
              {forgotPasswordLabel}
            </button>
          )}
        </div>

        {error && <div className="rcui-error">{error}</div>}

        <button className="rcui-primary-button" disabled={loading}>
          {loading ? <span className="rcui-button-loading"><span className="rcui-mini-spinner" /> Signing in...</span> : submitLabel}
        </button>
      </form>

      {onSwitchToSignUp && (
        <p className="rcui-switch-text">
          {signUpLabel}{" "}
          <button type="button" className="rcui-link-button" onClick={onSwitchToSignUp}>
            {signUpActionLabel}
          </button>
        </p>
      )}
    </div>
  );
}