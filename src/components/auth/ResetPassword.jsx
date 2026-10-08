import React, { useState } from "react";

export default function ResetPassword({
  title = "Create a new password",
  subtitle = "Choose a strong password for your account.",
  submitLabel = "Update password",
  loading = false,
  error = "",
  onSubmit
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function submit(event) {
    event.preventDefault();
    onSubmit?.({ password, confirmPassword });
  }

  return (
    <div className="rcui-auth-form">
      <div className="rcui-form-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <form onSubmit={submit}>
        <label className="rcui-field">
          <span>New password</span>
          <input
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="rcui-field">
          <span>Confirm password</span>
          <input
            type="password"
            value={confirmPassword}
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        {error && <div className="rcui-error">{error}</div>}

        <button className="rcui-primary-button" disabled={loading}>
          {loading ? "Updating..." : submitLabel}
        </button>
      </form>
    </div>
  );
}