/**
 * CityOverlay — rendered in a completely separate React root (see main.tsx).
 * Zero shared ancestors with the main app, so position:fixed is always
 * pinned to the viewport regardless of any transform in the main tree.
 */
import { CityStreetLife } from './CityStreetLife';
import { CityLiveFeed } from './CityLiveFeed';
import { CityHomeFeed } from './CityHomeFeed';

export function CityOverlay() {
  return (
    <>
      <CityStreetLife />
      <CityLiveFeed />
      <CityHomeFeed />
    </>
  );
}
