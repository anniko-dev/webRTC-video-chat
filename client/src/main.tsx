import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import 'normalize.css';
import { ThemeProvider } from '@mui/material';
import { theme } from './core/style/theme.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
);
