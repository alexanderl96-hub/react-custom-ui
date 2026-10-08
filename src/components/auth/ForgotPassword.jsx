import React, { useState } from "react";

export default function ForgotPassword({
  title = "Forgot your password?",
  subtitle = "Enter your email and we'll send you a reset link.",
  submitLabel = "Send reset link",
  loading = false,
  error = "",
  success = "",
  onSubmit,
  onBackToLogin
}) {
  const [email, setEmail] = useState("");

  function submit(event) {
    event.preventDefault();
    onSubmit?.({ email });
  }

  return (
    <div className="rcui-auth-form">
      <div className="rcui-form-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <form onSubmit={submit}>
        <label className="rcui-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {error && <div className="rcui-error">{error}</div>}
        {success && <div className="rcui-success">{success}</div>}

        <button className="rcui-primary-button" disabled={loading}>
          {loading ? "Sending..." : submitLabel}
        </button>
      </form>

      {onBackToLogin && (
        <button type="button" className="rcui-link-button rcui-back-button" onClick={onBackToLogin}>
          ← Back to sign in
        </button>
      )}
    </div>
  );
}