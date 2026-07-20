import { GameIconName } from '@/components/ui/GameIcon';

export interface MaintenanceEvent {
  id: string;
  icon: GameIconName;
  title: string;
  description: string;
  cost: number;
  /** Fraction of homeValue lost if deferred, e.g. 0.025 = 2.5% */
  valueImpact: number;
  tip: string;
}

export const MAINTENANCE_EVENTS: MaintenanceEvent[] = [
  {
    id: 'roof_leak',
    icon: 'wrench',
    title: 'Roof Leak Detected',
    description: 'Water stains appeared on the ceiling. A roofing contractor confirmed a small leak that needs repair before winter.',
    cost: 2800,
    valueImpact: 0.03,
    tip: 'Deferred roof repairs cause water damage that compounds quickly. A $2,800 fix now beats a $15,000 structural repair later.',
  },
  {
    id: 'water_heater',
    icon: 'droplet',
    title: 'Water Heater Failure',
    description: 'No hot water this morning! Your 12-year-old water heater gave out. Replacement is needed ASAP.',
    cost: 1200,
    valueImpact: 0.015,
    tip: 'Water heaters last 8–12 years. Budgeting $100/month in a home maintenance fund covers most surprises.',
  },
  {
    id: 'hvac_service',
    icon: 'wrench',
    title: 'HVAC Annual Service',
    description: 'Your HVAC technician recommends a full service — filter replacement, refrigerant check, and duct cleaning.',
    cost: 400,
    valueImpact: 0.01,
    tip: "Annual HVAC service extends system life by 5+ years. Skipping it voids most manufacturer warranties.",
  },
  {
    id: 'lawn_care',
    icon: 'leaf',
    title: 'Lawn & Landscaping',
    description: "The front yard's getting overgrown. Neighbors' HOA-adjacent pressure is building — time for upkeep.",
    cost: 120,
    valueImpact: 0.005,
    tip: 'Curb appeal affects home value — a well-maintained yard can add 5–10% to your listing price.',
  },
  {
    id: 'pest_inspection',
    icon: 'search',
    title: 'Pest Inspection Required',
    description: "You found signs of termite activity near the foundation. A licensed inspector confirmed it's early but needs treatment.",
    cost: 200,
    valueImpact: 0.008,
    tip: 'Termite damage costs an average of $3,000 to repair. Annual inspection is the cheapest insurance.',
  },
];

/**
 * Selects which maintenance event fires based on the counter (deterministic, no Math.random).
 * monthsAdvanced is the number of months passed since entering Home Life.
 */
export function selectMaintenanceEvent(monthsAdvanced: number): MaintenanceEvent {
  return MAINTENANCE_EVENTS[(monthsAdvanced - 1) % MAINTENANCE_EVENTS.length];
}

/**
 * Returns true every 4th month-advance (25% frequency).
 */
export function shouldMaintenanceFire(monthsAdvanced: number): boolean {
  return monthsAdvanced > 0 && monthsAdvanced % 4 === 0;
}
