import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { seedIfEmpty } from './db/schema';
import './styles/global.css';

void seedIfEmpty();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
