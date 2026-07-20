import React from 'react';

export type GameIconName =
  | 'home' | 'budget' | 'question' | 'pet' | 'audio' | 'cash' | 'objective' | 'achievement' | 'house-hunting' | 'dream-home' | 'neighborhood' | 'documents' | 'keys' | 'handshake' | 'bank' | 'city-hall'
  | 'celebration' | 'player' | 'map' | 'pin' | 'money' | 'chart' | 'trend-up' | 'trend-down'
  | 'exit' | 'phone' | 'target' | 'credit-card' | 'block' | 'calendar' | 'check' | 'uncheck'
  | 'lock' | 'bed' | 'bath' | 'ruler' | 'walk' | 'school' | 'car' | 'trophy' | 'star'
  | 'search' | 'sparkles' | 'kitchen' | 'wood' | 'leaf' | 'sun' | 'wrench' | 'warning'
  | 'fast-forward' | 'replay' | 'camera' | 'lightbulb' | 'lightning' | 'sad-face' | 'briefcase'
  | 'gift' | 'arrow-right' | 'arrow-left' | 'chevron-up' | 'chevron-down' | 'close' | 'music'
  | 'audio-off' | 'info' | 'heart' | 'wallet' | 'piggy-bank' | 'gauge' | 'counselor' | 'realtor'
  | 'search-home' | 'furniture' | 'shopping' | 'job' | 'droplet' | 'paw' | 'confetti-burst' | 'coin'
  | 'coffee' | 'tree' | 'park' | 'sofa' | 'dining' | 'laptop' | 'chair' | 'book' | 'cabinet'
  | 'office-chair' | 'plant' | 'fire' | 'tent' | 'microwave' | 'tv' | 'health' | 'mail' | 'anchor' | 'medal' | 'pill' | 'scooter' | 'cart'
  | 'message-circle' | 'bell' | 'settings' | 'minimize' | 'maximize' | 'window-restore' | 'window-minimize'
  | 'signal' | 'wifi' | 'battery-full';

export interface GameIconProps { style?: React.CSSProperties;
  name: GameIconName;
  size?: number;
  className?: string;
  color?: string;
}

export function GameIcon({ name, size = 16, className = '', color = 'currentColor', style }: GameIconProps) {
  const IconPaths = () => {
    switch (name) {
      case 'home':
        return <path d="M3 10L12 3l9 7v11H3V10zM9 21v-7h6v7" />;
      case 'neighborhood':
        return (
          <>
            <path d="M2 12l5-4 5 4v8H2v-8z" />
            <path d="M12 10l5-4 5 4v10h-10V10z" />
            <path d="M6 20v-4h2v4M16 20v-5h2v5" />
          </>
        );
      case 'documents':
        return (
          <>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
            <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
          </>
        );
      case 'keys':
        return <path d="M15 7a4 4 0 10-8 0 4 4 0 008 0zm0 0l6 6v3h-3v-3h-3l-2-2" />;
      case 'handshake':
        return <path d="M8 10l4-4 4 4M12 6v12M5 15h14M8 19l4 4 4-4" />;
      case 'bank':
        return (
          <>
            <path d="M2 22h20M12 2L2 8h20L12 2zM6 8v10M10 8v10M14 8v10M18 8v10" />
          </>
        );
      case 'city-hall':
        return (
          <>
            <path d="M12 2L2 9h20L12 2zM4 9v11h16V9M8 9v11M12 9v11M16 9v11M2 22h20" />
          </>
        );
      case 'celebration':
        return (
          <>
            <path d="M12 12l9-9M12 12l-9-9M12 12l0 10M12 12l7 7M12 12l-7 7M12 12l9 2M12 12l-9 2" />
          </>
        );
      case 'player':
        return (
          <>
            <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
            <path d="M4 21a8 8 0 0116 0" />
          </>
        );
      case 'map':
        return (
          <>
            <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
            <path d="M9 3v15M15 6v15" />
          </>
        );
      case 'pin':
        return (
          <>
            <path d="M12 2a6 6 0 00-6 6c0 5 6 14 6 14s6-9 6-14a6 6 0 00-6-6z" />
            <circle cx="12" cy="8" r="2" />
          </>
        );
      case 'money':
      case 'cash':
      case 'budget':
      case 'wallet':
      case 'coin':
        return (
          <>
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M6 12h.01M18 12h.01" />
          </>
        );
      case 'chart':
      case 'gauge':
        return (
          <>
            <path d="M2 20h20M4 16v4M10 10v10M16 4v16" />
          </>
        );
      case 'trend-up':
        return <path d="M2 20h20M3 15l6-6 4 4 8-8M17 5h4v4" />;
      case 'trend-down':
        return <path d="M2 20h20M3 5l6 6 4-4 8 8M17 15h4v-4" />;
      case 'exit':
        return (
          <>
            <path d="M14 2H5a2 2 0 00-2 2v16a2 2 0 002 2h9" />
            <path d="M10 12h11M17 8l4 4-4 4" />
          </>
        );
      case 'phone':
        return (
          <>
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <path d="M12 18h.01" />
          </>
        );
      case 'target':
      case 'objective':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" />
          </>
        );
      case 'credit-card':
        return (
          <>
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20M6 15h4" />
          </>
        );
      case 'block':
      case 'warning':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M6 6l12 12" />
          </>
        );
      case 'calendar':
        return (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </>
        );
      case 'check':
        return <path d="M5 12l4 4 10-10" />;
      case 'uncheck':
        return <rect x="4" y="4" width="16" height="16" rx="2" />;
      case 'lock':
        return (
          <>
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </>
        );
      case 'bed':
        return (
          <>
            <path d="M3 10v10M21 10v10M3 14h18" />
            <path d="M5 10V6a2 2 0 012-2h10a2 2 0 012 2v4" />
            <circle cx="12" cy="8" r="2" />
          </>
        );
      case 'bath':
      case 'droplet':
        return (
          <>
            <path d="M12 2l4 4c2 3 2 6 2 8a6 6 0 11-12 0c0-2 0-5 2-8l4-4z" />
          </>
        );
      case 'ruler':
        return (
          <>
            <path d="M2 15l9 5 11-11-9-5-11 11z" />
            <path d="M6 11l2 2M10 7l2 2M14 3l2 2" />
          </>
        );
      case 'walk':
        return (
          <>
            <circle cx="12" cy="4" r="2" />
            <path d="M12 6l-2 5l-4 1M12 6l2 5l4-1M10 11l-2 8M14 11l2 8" />
          </>
        );
      case 'school':
        return (
          <>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </>
        );
      case 'car':
        return (
          <>
            <path d="M4 14l1-5h14l1 5M2 14h20v5H2z" />
            <circle cx="6" cy="19" r="2" />
            <circle cx="18" cy="19" r="2" />
          </>
        );
      case 'trophy':
      case 'achievement':
        return (
          <>
            <path d="M6 9H3V5h18v4h-3" />
            <path d="M6 5v4c0 3 3 6 6 6s6-3 6-6V5" />
            <path d="M12 15v5M9 20h6" />
          </>
        );
      case 'star':
        return <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />;
      case 'search':
      case 'search-home':
      case 'house-hunting':
        return (
          <>
            <circle cx="11" cy="11" r="7" />
            <path d="M16 16l5 5" />
          </>
        );
      case 'sparkles':
      case 'dream-home':
        return (
          <>
            <path d="M12 2c0 5 5 10 10 10-5 0-10 5-10 10 0-5-5-10-10-10 5 0 10-5 10-10z" />
          </>
        );
      case 'kitchen':
        return (
          <>
            <path d="M7 12a5 5 0 0010 0V4a5 5 0 00-10 0v8z" />
            <path d="M12 12v9M9 21h6" />
          </>
        );
      case 'wood':
        return (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M4 8h16M4 16h16M8 4v4M16 8v8M10 16v4" />
          </>
        );
      case 'leaf':
        return (
          <>
            <path d="M12 2c0 0-8 2-8 10 0 4 3 8 8 10 0 0 8-4 8-10 0-8-8-10-8-10z" />
            <path d="M12 22v-8" />
          </>
        );
      case 'sun':
        return (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        );
      case 'wrench':
        return (
          <>
            <path d="M14 10L21 3M3 21l8-8M7 8a3 3 0 100 6 3 3 0 000-6z" />
          </>
        );
      case 'fast-forward':
        return <path d="M3 5l8 7-8 7V5zM13 5l8 7-8 7V5z" />;
      case 'replay':
        return (
          <>
            <path d="M3 12a9 9 0 109-9M3 12h5M3 12V7" />
          </>
        );
      case 'camera':
        return (
          <>
            <path d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2" />
            <path d="M2 10a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10z" />
            <circle cx="12" cy="15" r="4" />
          </>
        );
      case 'lightbulb':
        return (
          <>
            <path d="M9 19h6M10 22h4" />
            <path d="M12 2a6 6 0 00-6 6c0 3 2 5 2 7h8c0-2 2-4 2-7a6 6 0 00-6-6z" />
          </>
        );
      case 'lightning':
        return <path d="M13 2L3 13h8l-2 9 10-11h-8z" />;
      case 'sad-face':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M8 15a4 4 0 018 0M9 9h.01M15 9h.01" />
          </>
        );
      case 'briefcase':
      case 'job':
        return (
          <>
            <rect x="3" y="7" width="18" height="14" rx="2" />
            <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M12 12v.01" />
          </>
        );
      case 'gift':
        return (
          <>
            <rect x="4" y="8" width="16" height="14" rx="2" />
            <rect x="2" y="4" width="20" height="4" rx="1" />
            <path d="M12 8v14M12 4a2 2 0 00-2-2 2 2 0 00-2 2M12 4a2 2 0 012-2 2 2 0 012 2" />
          </>
        );
      case 'arrow-right':
        return <path d="M5 12h14M12 5l7 7-7 7" />;
      case 'arrow-left':
        return <path d="M19 12H5M12 19l-7-7 7-7" />;
      case 'chevron-up':
        return <path d="M18 15l-6-6-6 6" />;
      case 'chevron-down':
        return <path d="M6 9l6 6 6-6" />;
      case 'close':
        return <path d="M18 6L6 18M6 6l12 12" />;
      case 'music':
      case 'audio':
        return (
          <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <path d="M9 9h12" />
          </>
        );
      case 'audio-off':
        return (
          <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <path d="M9 9h12" />
            <path d="M2 2l20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'info':
      case 'question':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </>
        );
      case 'heart':
        return <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />;
      case 'counselor':
        return (
          <>
            <circle cx="12" cy="7" r="4" />
            <path d="M5 21v-2a6 6 0 0114 0v2M16 11l2 2-2 2" />
          </>
        );
      case 'realtor':
        return (
          <>
            <circle cx="12" cy="7" r="4" />
            <path d="M5 21v-2a6 6 0 0114 0v2M15 10l3-3m0 0l-3-3m3 3H9" />
          </>
        );
      case 'furniture':
        return (
          <>
            <path d="M4 14v5M20 14v5M3 14h18M5 14v-4a2 2 0 012-2h10a2 2 0 012 2v4" />
          </>
        );
      case 'shopping':
        return (
          <>
            <path d="M4 6h16l-2 10H6L4 6z" />
            <path d="M8 6V4a2 2 0 014 0v2" />
          </>
        );
      case 'piggy-bank':
        return (
          <>
            <path d="M19 14v3M5 14v3M3 10a7 7 0 1114 0h3a2 2 0 010 4h-3M12 6h2" />
          </>
        );
      case 'paw':
      case 'pet':
        return (
          <>
            <path d="M12 14c-3 0-5-2-5-5s2-3 5-3 5 1 5 3-2 5-5 5z" />
            <circle cx="6" cy="8" r="2" />
            <circle cx="18" cy="8" r="2" />
            <circle cx="9" cy="4" r="2" />
            <circle cx="15" cy="4" r="2" />
          </>
        );
      case 'confetti-burst':
        return (
          <>
            <path d="M12 12l-3-3M12 12l3-3M12 12l-4 1M12 12l4 1M12 12l-2 4M12 12l2 4" />
          </>
        );
      case 'coffee':
        return (
          <>
            <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
          </>
        );
      case 'tree':
      case 'park':
        return (
          <>
            <path d="M12 22v-6" />
            <path d="M12 16a4 4 0 01-4-4c0-2.5 2-4 2-6s2-4 2-4 2 1.5 2 4 2 1.5 2 6a4 4 0 01-4 4z" />
          </>
        );
      case 'sofa':
        return (
          <>
            <path d="M4 11V8a2 2 0 012-2h12a2 2 0 012 2v3" />
            <path d="M2 11h20v4H2z" />
            <path d="M4 15v2" />
            <path d="M20 15v2" />
          </>
        );
      case 'dining':
        return (
          <>
            <path d="M3 2v7c0 2 2 3 4 3s4-1 4-3V2" />
            <path d="M7 2v20" />
            <path d="M21 2v20M21 12c-3 0-4-1-4-4V2h4" />
          </>
        );
      case 'laptop':
        return (
          <>
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M2 20h20" />
            <path d="M10 16h4" />
          </>
        );
      case 'chair':
        return (
          <>
            <path d="M6 2v10M18 12V2" />
            <rect x="4" y="12" width="16" height="4" rx="1" />
            <path d="M6 16v6M18 16v6" />
          </>
        );
      case 'book':
        return (
          <>
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </>
        );
      case 'cabinet':
        return (
          <>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M4 10h16M4 16h16" />
            <path d="M10 6h4M10 13h4M10 19h4" />
          </>
        );
      case 'office-chair':
        return (
          <>
            <path d="M6 2h12v10a6 6 0 01-12 0V2zM12 12v6M8 22h8M10 22l-2-2M14 22l2-2" />
          </>
        );
      case 'plant':
        return (
          <>
            <path d="M8 22h8l1-8H7l1 8z" />
            <path d="M12 14v-4M12 10c-2-2-4-2-4-6 2 0 4 2 4 6 2-4 4-6 4-6s-2 4-4 6z" />
          </>
        );
      case 'fire':
        return (
          <>
            <path d="M12 2c0 0-4 6-4 10a4 4 0 108 0c0-4-4-10-4-10z" />
            <path d="M12 14v6" />
          </>
        );
      case 'tent':
        return (
          <>
            <path d="M12 3L2 21h20zM12 3v18M8 21l4-8 4 8" />
          </>
        );
      case 'microwave':
        return (
          <>
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <rect x="4" y="8" width="10" height="8" rx="1" />
            <path d="M18 8v1M18 12v1M18 16v1" />
          </>
        );
      case 'tv':
        return (
          <>
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M8 2l4 4 4-4" />
            <path d="M12 18v4M8 22h8" />
          </>
        );
      case 'health':
        return (
          <>
            <path d="M12 2v20M2 12h20" />
            <circle cx="12" cy="12" r="10" />
          </>
        );
      case 'mail':
        return (
          <>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 6l10 7 10-7" />
          </>
        );
      case 'anchor':
        return (
          <>
            <circle cx="12" cy="4" r="2" />
            <path d="M12 6v14M8 10h8" />
            <path d="M4 14a8 8 0 0016 0" />
            <path d="M2 12l2 2 2-2M22 12l-2 2-2-2" />
          </>
        );
      case 'medal':
        return (
          <>
            <circle cx="12" cy="15" r="5" />
            <path d="M9 11L7 2l5 3 5-3-2 9" />
          </>
        );
      case 'pill':
        return (
          <>
            <path d="M15.5 3.5a5.6 5.6 0 010 8L8.4 18.6a5.6 5.6 0 01-8-8L7.5 3.5a5.6 5.6 0 018 0z" />
            <path d="M11 7l-4 4" />
          </>
        );
      case 'scooter':
        return (
          <>
            <circle cx="5" cy="18" r="3" />
            <circle cx="19" cy="18" r="3" />
            <path d="M8 18h8M16 18l1-10h3M17 8h-4" />
            <path d="M8 18L5 9h3" />
          </>
        );
      case 'cart':
        return (
          <>
            <path d="M2 3h3l2 10h12M7 13h12l2-7H6M9 19a2 2 0 11-4 0 2 2 0 014 0zM19 19a2 2 0 11-4 0 2 2 0 014 0z" />
          </>
        );
      case 'message-circle':
        return (
          <>
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </>
        );
      case 'bell':
        return (
          <>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </>
        );
      case 'settings':
        return (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </>
        );
      case 'minimize':
      case 'window-minimize':
        return (
          <>
            <path d="M4 14h6v6M20 10h-6V4" />
            <path d="M14 10l7-7M3 21l7-7" />
          </>
        );
      case 'maximize':
      case 'window-restore':
        return (
          <>
            <path d="M15 3h6v6M9 21H3v-6" />
            <path d="M21 3l-7 7M3 21l7-7" />
          </>
        );
      case 'signal':
        return (
          <>
            <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16" />
          </>
        );
      case 'wifi':
        return (
          <>
            <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
          </>
        );
      case 'battery-full':
        return (
          <>
            <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
            <path d="M22 11v2" />
            <rect x="4" y="9" width="12" height="6" rx="1" ry="1" fill="currentColor" />
          </>
        );
      default:
        return <circle cx="12" cy="12" r="10" />;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <IconPaths />
    </svg>
  );
}
