import React, { useState } from "react";

export default function SignUp({
  title = "Create your account",
  subtitle = "Join us and get started in minutes.",
  submitLabel = "Create account",
  loading = false,
  error = "",
  onSubmit,
  onSwitchToLogin,
  className = ""
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      onSubmit?.({ ...form, validationError: "Passwords do not match." });
      return;
    }

    onSubmit?.(form);
  }

  return (
    <div className={`rcui-auth-form ${className}`}>
      <div className="rcui-form-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="rcui-field">
          <span>Full name</span>
          <input
            value={form.name}
            placeholder="John Doe"
            autoComplete="name"
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </label>

        <label className="rcui-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            placeholder="you@example.com"
            autoComplete="email"
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </label>

        <label className="rcui-field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            placeholder="Create a password"
            autoComplete="new-password"
            onChange={(e) => update("password", e.target.value)}
            required
          />
        </label>

        <label className="rcui-field">
          <span>Confirm password</span>
          <input
            type="password"
            value={form.confirmPassword}
            placeholder="Repeat your password"
            autoComplete="new-password"
            onChange={(e) => update("confirmPassword", e.target.value)}
            required
          />
        </label>

        {error && <div className="rcui-error">{error}</div>}

        <button className="rcui-primary-button" disabled={loading}>
          {loading ? <span className="rcui-button-loading"><span className="rcui-mini-spinner" /> Creating...</span> : submitLabel}
        </button>
      </form>

      {onSwitchToLogin && (
        <p className="rcui-switch-text">
          Already have an account?{" "}
          <button type="button" className="rcui-link-button" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}