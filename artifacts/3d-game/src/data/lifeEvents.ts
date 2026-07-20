import { GameIconName } from '@/components/ui/GameIcon';

export interface LifeEventEffect {
  type: 'cash' | 'savings' | 'income' | 'expenses' | 'credit';
  delta: number;
}

export interface LifeEvent {
  id: string;
  icon: GameIconName;
  title: string;
  description: string;
  effect: LifeEventEffect;
  lesson: string;
}

export const lifeEvents: LifeEvent[] = [
  {
    id: 'car_repair',
    icon: 'car',
    title: 'Unexpected Car Repair',
    description: 'Your transmission went out. The mechanic says it\'ll cost $450 to fix — you need it to get to work.',
    effect: { type: 'cash', delta: -450 },
    lesson: 'Emergency funds exist for moments like this. Experts recommend 3–6 months of expenses saved.',
  },
  {
    id: 'small_raise',
    icon: 'trend-up',
    title: 'You Got a Raise!',
    description: 'Your manager recognized your hard work. Starting next month, you\'ll earn an extra $150/month.',
    effect: { type: 'income', delta: 150 },
    lesson: 'Income growth is one of the fastest ways to improve your debt-to-income ratio for a mortgage.',
  },
  {
    id: 'medical_copay',
    icon: 'pill',
    title: 'Medical Co-Pay',
    description: 'A routine checkup turned into unexpected tests. Your insurance covered most of it, but you owe $300.',
    effect: { type: 'cash', delta: -300 },
    lesson: 'Health insurance deductibles can surprise you. Include medical costs in your monthly budget.',
  },
  {
    id: 'friend_repaid',
    icon: 'handshake',
    title: 'Friend Paid You Back',
    description: 'Remember that $600 you lent your friend last year? They finally paid you back — in cash.',
    effect: { type: 'cash', delta: 600 },
    lesson: 'Unexpected windfalls are best used to boost savings or pay down debt, not lifestyle inflation.',
  },
  {
    id: 'rent_increase',
    icon: 'home',
    title: 'Rent Increased',
    description: 'Your landlord sent a notice: rent goes up $80/month starting next month. "Market rates," he says.',
    effect: { type: 'expenses', delta: 80 },
    lesson: 'Renters have no control over rising costs. Homeownership locks in your housing payment for 30 years.',
  },
  {
    id: 'credit_card_interest',
    icon: 'credit-card',
    title: 'Credit Card Interest Hit',
    description: 'You carried a balance this month. $180 disappeared to interest charges — money that built no equity.',
    effect: { type: 'savings', delta: -180 },
    lesson: 'Credit card APRs average 20–27%. Paying in full each month is like earning a 20% return.',
  },
  {
    id: 'side_gig',
    icon: 'scooter',
    title: 'Side Gig Pays Off',
    description: 'You picked up some weekend delivery shifts. Extra hustle = $350 straight to your pocket.',
    effect: { type: 'cash', delta: 350 },
    lesson: 'A side income can cut years off your homebuying timeline. Even $200/month extra adds up fast.',
  },
  {
    id: 'utility_spike',
    icon: 'lightning',
    title: 'Utility Bill Spike',
    description: 'A heatwave hit Newport News. Your electric bill was $220 higher than normal this month.',
    effect: { type: 'cash', delta: -220 },
    lesson: 'Energy-efficient homes cost less to run. Look for ENERGY STAR ratings when buying.',
  },
  {
    id: 'tax_refund',
    icon: 'mail',
    title: 'Tax Refund Arrived',
    description: 'The IRS processed your return faster than expected. $780 landed in your account today.',
    effect: { type: 'savings', delta: 780 },
    lesson: 'Smart move: put refunds directly into savings or a down payment fund before lifestyle creep sets in.',
  },
  {
    id: 'grocery_savings',
    icon: 'cart',
    title: 'Grocery Savings',
    description: 'You started meal planning and used coupons strategically. Saved $120 compared to last month.',
    effect: { type: 'cash', delta: 120 },
    lesson: 'Small spending cuts compound. $100/month saved for 3 years = $3,600 toward a down payment.',
  },
  {
    id: 'subscription_creep',
    icon: 'tv',
    title: 'Subscription Creep',
    description: 'You noticed 4 streaming services you forgot to cancel. That\'s $75/month going nowhere.',
    effect: { type: 'cash', delta: -75 },
    lesson: 'Audit your subscriptions every 6 months. Hidden recurring charges silently drain savings.',
  },
  {
    id: 'credit_boost',
    icon: 'star',
    title: 'On-Time Payments Paid Off',
    description: 'Six months of on-time payments. Your credit bureau report updated — score ticked up.',
    effect: { type: 'credit', delta: 12 },
    lesson: 'Payment history is 35% of your credit score. Consistency beats any credit hack.',
  },
];

/**
 * Deterministically pick a life event for a given month counter.
 * Uses a simple hash so the same month always picks the same event — no Math.random() in render.
 */
export function selectLifeEvent(month: number): LifeEvent {
  const index = (month * 7 + 3) % lifeEvents.length;
  return lifeEvents[index];
}

/**
 * Determine whether a life event fires this month.
 * Deterministic 40% probability based on month — avoids render-phase randomness.
 */
export function shouldEventFire(month: number): boolean {
  return ((month * 31 + 17) % 10) < 4;
}
