# React Custom UI

A reusable, dependency-light React component library for authentication, loading, feedback, navigation, themes, and common UI primitives.

## Components

### Authentication
`AuthLayout` · `Login` · `SignUp` · `ForgotPassword` · `ResetPassword` · `VerifyEmail`

### Loading
`LoadingScreen` · `PageLoader` · `Spinner` · `DotsLoader` · `PulseLoader` · `ProgressLoader` · `Skeleton` · `LoadingOverlay`

### Core UI
`Button` · `Input` · `Card` · `Modal` · `ToastProvider` / `useToast` · `ThemeToggle`

### Navigation
`Navbar` · `Sidebar` · `NavItem`

### Feedback
`Alert` · `EmptyState`

### Theme
`ThemeProvider` · `useTheme`

## Install locally

```bash
npm install
npm run dev
```

## Build the library

```bash
npm run build
```

## Example

```jsx
import {
  ThemeProvider,
  Login,
  Button,
  Card,
  ToastProvider
} from "react-custom-ui";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Card title="Welcome">
          <Login onSubmit={(values) => console.log(values)} />
        </Card>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

## Authentication philosophy

The library is UI-only. Your application owns:
- API requests
- authentication/session state
- tokens
- routing
- business validation
- authorization

Components communicate with the application through callbacks.

## Publishing

After creating your GitHub repository:

```bash
git init
git add .
git commit -m "Initial component library"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/react-custom-ui.git
git push -u origin main
```

When ready for npm:

```bash
npm login
npm publish
```

## License

MIT
