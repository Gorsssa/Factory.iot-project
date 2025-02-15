import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster 
      richColors 
      position="top-right"
      expand={true}
      closeButton={true}
      visibleToasts={20}
    />
    <App />
  </StrictMode>
);