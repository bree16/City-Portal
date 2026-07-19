import { useGameStore } from '@/store/gameStore';
import { findBuilding } from '@/data/buildings';

export function CityExitButton() {
  const { currentLocation, setTransitioning, setCurrentLocation, setPlayerTarget } = useGameStore();

  // Only show when inside a building (not in city)
  if (currentLocation === 'city') return null;

  const building = findBuilding(currentLocation);

  const handleReturn = () => {
    setTransitioning(true);
    const exitPos = building?.exitCityPos ?? [0, 0, 0];
    setTimeout(() => {
      setCurrentLocation('city');
      setPlayerTarget(exitPos);
      setTransitioning(false);
    }, 700);
  };

  return (
    <button
      onClick={handleReturn}
      style={{
        position: 'fixed',
        top: 72,
        left: 12,
        zIndex: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 10,
        background: 'rgba(13,43,94,0.88)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        transition: 'background 0.15s',
        marginTop: 4,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(10,143,126,0.8)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,43,94,0.88)'; }}
    >
      ← Back to City
    </button>
  );
}
