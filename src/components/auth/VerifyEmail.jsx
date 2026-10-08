import React from "react";

export default function VerifyEmail({
  email = "your email",
  title = "Check your email",
  subtitle = "We sent a verification link to",
  buttonLabel = "Open email",
  onAction,
  onBack
}) {
  return (
    <div className="rcui-auth-form rcui-centered-form">
      <div className="rcui-verification-icon">✓</div>
      <div className="rcui-form-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <strong>{email}</strong>
      </div>

      {onAction && (
        <button className="rcui-primary-button" onClick={onAction}>
          {buttonLabel}
        </button>
      )}

      {onBack && (
        <button className="rcui-link-button rcui-back-button" onClick={onBack}>
          Back
        </button>
      )}
    </div>
  );
}