import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { LangProvider } from './i18n.jsx';
import { ProfilProvider } from './profil.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
    <LangProvider>
      {/* Second axe, à côté de la langue : TPE ou PME. */}
      <ProfilProvider>
        <App />
      </ProfilProvider>
    </LangProvider>
  </BrowserRouter>
);
