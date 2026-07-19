import { useGameStore } from '@/store/gameStore';
import { findBuilding } from '@/data/buildings';

export function CityExitButton() {
  const { currentLocation, setTransitioning, setCurrentLocation, setPlayerTarget } = useGameStore();

  // Only show when inside a building or home tour.
  // Hide for city (no button needed) and homelife (Stage 8 is post-purchase, no city return).
  if (currentLocation === 'city' || currentLocation === 'homelife') return null;

  // Home tour: go back to the Real Estate Office (listing cards), not the city map
  const isTour = currentLocation === 'home_tour';
  const building = isTour ? null : findBuilding(currentLocation);

  const handleReturn = () => {
    setTransitioning(true);
    if (isTour) {
      setTimeout(() => {
        setCurrentLocation('realestate');
        setTransitioning(false);
      }, 700);
    } else {
      const exitPos = building?.exitCityPos ?? [0, 0, 0];
      setTimeout(() => {
        setCurrentLocation('city');
        setPlayerTarget(exitPos);
        setTransitioning(false);
      }, 700);
    }
  };

  const label = isTour ? '← Back to Listings' : '← Back to City';

  return (
    <button
      onClick={handleReturn}
      className="glass-btn glass-anim-in"
      style={{
        position: 'fixed',
        top: 76,
        left: 12,
        zIndex: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </button>
  );
}
