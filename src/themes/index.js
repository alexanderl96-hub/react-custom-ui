export const defaultTheme = {
  colors: { primary: '#6958e8', text: '#1c1b27', muted: '#777589', surface: '#ffffff', background: '#f6f5fb', border: '#e7e5ef', danger: '#c53949', success: '#20815c' },
  radius: { small: '8px', medium: '14px', large: '24px' },
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};
export const darkTheme = { ...defaultTheme, colors: { ...defaultTheme.colors, primary: '#a79bff', text: '#f3f1ff', muted: '#aaa6c2', surface: '#1e1c2c', background: '#14121f', border: '#39354c' } };
