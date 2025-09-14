// SSR-safe Material-UI replacement
// This provides fallbacks during server-side rendering

const React = require('react')

// Safe component that renders nothing during SSR
const SafeComponent = ({ children, ...props }) => {
  if (typeof window === 'undefined') {
    // Server-side: return a div with basic styling
    return React.createElement('div', {
      className: 'mui-ssr-placeholder',
      style: { minHeight: '40px', ...props.style },
      ...props
    }, children)
  }
  
  // Client-side: this won't be used, real Material-UI will load
  return React.createElement('div', props, children)
}

// Export common Material-UI components as safe alternatives
module.exports = {
  // Layout components
  Box: SafeComponent,
  Container: SafeComponent,
  Grid: SafeComponent,
  Paper: SafeComponent,
  Card: SafeComponent,
  CardContent: SafeComponent,
  
  // Typography
  Typography: ({ children, variant, ...props }) => {
    const tag = variant === 'h1' ? 'h1' : 
                variant === 'h2' ? 'h2' :
                variant === 'h3' ? 'h3' :
                variant === 'h4' ? 'h4' :
                variant === 'h5' ? 'h5' :
                variant === 'h6' ? 'h6' : 'p'
    
    return React.createElement(tag, {
      className: `typography-${variant || 'body1'}`,
      ...props
    }, children)
  },
  
  // Form components
  TextField: SafeComponent,
  Button: ({ children, variant, color, ...props }) => {
    return React.createElement('button', {
      className: `button-${variant || 'contained'} button-${color || 'primary'}`,
      ...props
    }, children)
  },
  Select: SafeComponent,
  MenuItem: SafeComponent,
  FormControl: SafeComponent,
  InputLabel: SafeComponent,
  
  // Icons (return empty spans)
  default: SafeComponent,
  
  // Styles
  createTheme: () => ({}),
  ThemeProvider: ({ children }) => children,
  styled: (component) => (styles) => component,
  useTheme: () => ({}),
  
  // All other exports
  __esModule: true,
}

// Handle default exports
module.exports.default = SafeComponent
