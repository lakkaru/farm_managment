import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.background};
    transition: ${props => props.theme.transition};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: ${props => props.theme.spacing.sm};
    color: ${props => props.theme.colors.text};
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  /* Links */
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: ${props => props.theme.transition};

    &:hover {
      color: ${props => props.theme.colors.primaryDark};
    }
  }

  /* Buttons */
  button {
    cursor: pointer;
    border: none;
    outline: none;
    transition: ${props => props.theme.transition};
    font-family: inherit;
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    transition: ${props => props.theme.transition};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
    }

    &::placeholder {
      color: ${props => props.theme.colors.textSecondary};
    }
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    background-color: ${props => props.theme.colors.surface};
    border-radius: ${props => props.theme.borderRadius};
    overflow: hidden;
    box-shadow: ${props => props.theme.boxShadow};
  }

  th, td {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  th {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    font-weight: 600;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }

  /* React Datepicker overrides */
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
  }

  /* React Select overrides */
  .react-select-container {
    .react-select__control {
      border-color: ${props => props.theme.colors.border};
      background-color: ${props => props.theme.colors.surface};
      
      &:hover {
        border-color: ${props => props.theme.colors.primary};
      }

      &--is-focused {
        border-color: ${props => props.theme.colors.primary};
        box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
      }
    }

    .react-select__menu {
      background-color: ${props => props.theme.colors.surface};
      border: 1px solid ${props => props.theme.colors.border};
    }

    .react-select__option {
      color: ${props => props.theme.colors.text};

      &--is-selected {
        background-color: ${props => props.theme.colors.primary};
      }

      &--is-focused {
        background-color: ${props => props.theme.colors.primary}20;
      }
    }
  }

  /* React Table overrides */
  .table {
    .rt-table {
      background-color: ${props => props.theme.colors.surface};
    }

    .rt-thead.-header {
      background-color: ${props => props.theme.colors.primary};
      color: white;
    }

    .rt-td {
      border-right: 1px solid ${props => props.theme.colors.border};
    }

    .rt-tr-group:hover {
      background-color: ${props => props.theme.colors.primary}10;
    }
  }

  /* Toast overrides */
  .Toastify__toast {
    font-family: inherit;
  }

  /* Loading spinner */
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid ${props => props.theme.colors.border};
    border-top: 4px solid ${props => props.theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Utility classes */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }

  .mb-1 { margin-bottom: ${props => props.theme.spacing.xs}; }
  .mb-2 { margin-bottom: ${props => props.theme.spacing.sm}; }
  .mb-3 { margin-bottom: ${props => props.theme.spacing.md}; }
  .mb-4 { margin-bottom: ${props => props.theme.spacing.lg}; }
  .mb-5 { margin-bottom: ${props => props.theme.spacing.xl}; }

  .mt-1 { margin-top: ${props => props.theme.spacing.xs}; }
  .mt-2 { margin-top: ${props => props.theme.spacing.sm}; }
  .mt-3 { margin-top: ${props => props.theme.spacing.md}; }
  .mt-4 { margin-top: ${props => props.theme.spacing.lg}; }
  .mt-5 { margin-top: ${props => props.theme.spacing.xl}; }

  .text-success { color: ${props => props.theme.colors.success}; }
  .text-warning { color: ${props => props.theme.colors.warning}; }
  .text-error { color: ${props => props.theme.colors.error}; }
  .text-info { color: ${props => props.theme.colors.info}; }

  /* Responsive breakpoints */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    h1 { font-size: 2rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.5rem; }
    h4 { font-size: 1.25rem; }
    h5 { font-size: 1.1rem; }
    h6 { font-size: 1rem; }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
