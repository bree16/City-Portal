import { createRoot } from 'react-dom/client';
import { Router as WouterRouter } from 'wouter';
import App from './App';
import { CityOverlay } from './components/CityOverlay';
import './index.css';

// Main app
createRoot(document.getElementById('root')!).render(<App />);

// Completely separate React root — zero shared ancestors with the main app.
// position:fixed elements inside here are ALWAYS pinned to the viewport.
const overlayEl = document.getElementById('city-overlay');
if (overlayEl) {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  createRoot(overlayEl).render(
    <WouterRouter base={basePath}>
      <CityOverlay />
    </WouterRouter>,
  );
}
