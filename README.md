# React Custom UI

A dependency-light React component library for authentication screens, loading states, feedback, navigation and common UI primitives. Built with React and plain CSS.

## Features

- **8 authentication layouts** using the same `Login`, `SignUp` and `ForgotPassword` components: `split` (default), `minimal`, `glass`, `gradient`, `aurora`, `editorial`, `terminal`, `centered`.
- **6 loading-screen layouts**: `classic` (default), `minimal`, `gradient`, `glass`, `terminal`, `orbit`.
- Shared inputs and submit handlers; layouts change presentation, not authentication logic.
- Buttons, cards, modal, toast notifications, alerts, empty states, nav components, loaders and skeletons.
- Light/dark theme provider and toggle.
- Responsive styles and reduced-motion support for the orbit loader.

## Run the demo

```bash
npm install
npm run dev
```

Use the selector at the top of the demo to preview every authentication layout. Choose **Preview loading screens** to explore the loading variants. Demo submissions are simulated and do not call a backend.

## Build

```bash
npm run build
```

## Use in your React application

After publishing the package to npm or installing it from your Git repository, import the component and the library CSS (the build bundles the CSS entry):

```jsx
import { AuthLayout, Login } from "react-custom-ui";
import "react-custom-ui/dist/index.css";

export default function SignInPage() {
  async function handleLogin({ email, password, remember }) {
    // Call your own backend here. Keep secrets and auth tokens out of the UI library.
    console.log({ email, password, remember });
  }

  return (
    <AuthLayout
      layout="aurora"
      brand="Acme"
      tagline="Your workspace, all in one place."
      footer="© Acme"
    >
      <Login onSubmit={handleLogin} onForgotPassword={() => console.log("Forgot password")} />
    </AuthLayout>
  );
}
```

### Change the look, not the behavior

```jsx
<AuthLayout layout="glass" brand="Acme">
  <Login onSubmit={handleLogin} />
</AuthLayout>
```

Supported auth layouts: `split`, `minimal`, `glass`, `gradient`, `aurora`, `editorial`, `terminal`, `centered`.

Supported loading layouts: `classic`, `minimal`, `gradient`, `glass`, `terminal`, `orbit`.

```jsx
<LoadingScreen layout="orbit" title="Preparing your workspace" subtitle="This will only take a moment." progress={72} />
```

## Authentication responsibilities

This package provides presentation and form callbacks only. The consuming app must implement API requests, password recovery, email verification, validation rules beyond browser-required fields, authorization, session persistence, and security protections.

## GitHub setup

1. Create a repository named `react-custom-ui`.
2. Unzip this project and push the contents to that repository.
3. Update the placeholder GitHub URL in `package.json` to your repository URL.
4. Run `npm install`, `npm run build`, and `npm run lint`.
5. Tag releases (for example, `v0.3.0`) after testing.

MIT licensed.
