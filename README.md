# React UI Kit

A reusable, GitHub-ready React component library for authentication, loading, error, and shared UI patterns. It is a component kit—not a backend-connected app. Components do not assume a router, auth provider, database, or API; provide callbacks to connect them to your application.

## Features

- **Authentication:** login, sign up, forgot password, reset password, and verify email pages.
- **Eight auth layouts:** Minimal, Split, Glass, Gradient, Aurora, Editorial, Terminal, and Centered Card.
- **Seven loading styles:** Classic, Minimal, Gradient, Glass, Terminal, Orbit, and Pulse, with shared progress behavior in the interactive example.
- **Error page:** configurable code, title, message, and action.
- **Shared controls:** Input, Button, and Notice.
- **Hooks and themes:** `useTheme`, `useLoadingProgress`, `defaultTheme`, and `darkTheme`.
- Responsive styling and a demo that lets you switch auth layouts and theme.
- **Combined showcase:** a dedicated “Login + Loading” tab displays both components side by side, with independent layout selectors and a loading restart control.

## Quick start: run the demo

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`). The demo opens on a **Login + Loading** showcase so both screens are visible together. Use the top-level tabs to preview each page independently, switch between all eight authentication layouts, toggle light/dark mode, and open the interactive loading and error demos. In the combined view, choose a loading style and restart its five-second preview without leaving the login example.

## Build

```bash
npm run build
```

The first build creates the demo in `demo-dist/`; the library build creates distributable files in `dist/`.

## Use in your React app

```jsx
import { LoginPage } from 'react-ui-kit';
import 'react-ui-kit/style.css';

export default function LoginRoute() {
  async function handleLogin({ email, password, remember }) {
    // Call your own API/authentication provider here.
    await myAuthService.signIn({ email, password, remember });
  }

  return (
    <LoginPage
      layout="split"
      onSubmit={handleLogin}
      onForgotPassword={() => navigate('/forgot-password')}
      onSignUp={() => navigate('/sign-up')}
    />
  );
}
```

`layout` options: `minimal`, `split`, `glass`, `gradient`, `aurora`, `editorial`, `terminal`, `centered`.

Other exported pages: `SignUpPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `VerifyEmailPage`, `LoadingPage`, and `ErrorPage`. Pages accept callback props such as `onSubmit`, `onResend`, `onBack`, and `onAction` so the consuming application owns navigation and authentication.

## Loading page

```jsx
import { LoadingPage } from 'react-ui-kit';

<LoadingPage
  layout="gradient"
  duration={5000}
  title="Preparing your workspace"
  onComplete={() => console.log('Ready')}
/>
```

## Project structure

```text
react-ui-kit/
├── src/
│   ├── components/
│   │   ├── LoginPage/
│   │   ├── LoadingPage/
│   │   ├── ErrorPage/
│   │   └── shared/
│   ├── layouts/
│   │   ├── MinimalLayout/
│   │   ├── SplitLayout/
│   │   ├── GlassLayout/
│   │   ├── GradientLayout/
│   │   └── layouts.jsx
│   ├── hooks/
│   ├── themes/
│   └── index.js
├── examples/
├── README.md
├── package.json
└── LICENSE
```

## Important notes

- No real authentication, email delivery, OAuth, or API requests are included. Connect the supplied callbacks to your own services.
- The Google button is a placeholder example; wire it to an OAuth provider before production.
- The demo login logs only a redacted payload to the console and does not authenticate a user.
- Customize CSS in `src/themes/ui-kit.css` and the existing loading demo styles in `src/styles.css`.

## License

MIT. See `LICENSE`.
