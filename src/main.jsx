import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import App from './App.jsx';
import './styles.css';

// Initialize dark mode theme
const initTheme = () => {
  try {
    const saved = localStorage.getItem('theme');
    if ((saved && JSON.parse(saved).theme === 'dark') || 
        (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    console.warn('Theme init error:', e);
  }
};

initTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
      <Toaster 
        position="top-right" 
        toastOptions={{duration: 4000}} 
      />
    </HashRouter>
  </StrictMode>
);