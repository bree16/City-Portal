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
  /** If set, this event only fires for these career ids. Omit = fires for everyone. */
  careers?: string[];
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
  // ── Career-specific events ──────────────────────────────────────
  {
    id: 'ship_overtime',
    icon: 'anchor',
    title: 'Carrier Deadline Overtime',
    description: 'The shipyard is pushing to finish a carrier overhaul. Two weeks of mandatory overtime = $520 extra.',
    effect: { type: 'cash', delta: 520 },
    lesson: 'Overtime is great for savings — but lenders only count it toward a mortgage if it\'s consistent for 2 years.',
    careers: ['shipbuilding'],
  },
  {
    id: 'ship_boots',
    icon: 'wrench',
    title: 'Safety Gear Replacement',
    description: 'Your steel-toe boots and welding gloves wore out. The yard covers some, but you\'re out $140.',
    effect: { type: 'cash', delta: -140 },
    lesson: 'Work-related costs are part of your real budget. Some union dues and gear may be tax-deductible.',
    careers: ['shipbuilding'],
  },
  {
    id: 'nurse_shift_diff',
    icon: 'health',
    title: 'Night Shift Differential',
    description: 'You picked up three night shifts this month. Shift differential pay added $380 to your paycheck.',
    effect: { type: 'cash', delta: 380 },
    lesson: 'Extra shifts can fast-track a down payment — just protect your sleep and health too.',
    careers: ['healthcare'],
  },
  {
    id: 'nurse_license',
    icon: 'documents',
    title: 'License Renewal Fee',
    description: 'Your RN license renewal plus a required continuing-education course cost $190 this month.',
    effect: { type: 'cash', delta: -190 },
    lesson: 'Professional licenses are recurring costs. Budget for them yearly so they never feel like a surprise.',
    careers: ['healthcare'],
  },
  {
    id: 'tech_cert',
    icon: 'laptop',
    title: 'Certification Bonus',
    description: 'You passed your Security+ cert. Your employer reimbursed the exam AND gave you a $400 bonus.',
    effect: { type: 'cash', delta: 400 },
    lesson: 'Certifications raise income fast in tech — and higher income means more house you can safely afford.',
    careers: ['technology'],
  },
  {
    id: 'gov_shutdown_scare',
    icon: 'city-hall',
    title: 'Budget Freeze Scare',
    description: 'A city budget freeze delayed your paycheck a week. You covered bills from savings — stressful, but you managed.',
    effect: { type: 'savings', delta: -150 },
    lesson: 'Even "stable" jobs have hiccups. An emergency fund keeps a late paycheck from becoming a crisis.',
    careers: ['government'],
  },
  {
    id: 'teacher_supplies',
    icon: 'book',
    title: 'Classroom Supplies',
    description: 'You bought supplies for your students out of pocket again — $130 this semester.',
    effect: { type: 'cash', delta: -130 },
    lesson: 'Educators can deduct some classroom expenses at tax time — keep those receipts.',
    careers: ['education'],
  },
  {
    id: 'teacher_summer',
    icon: 'sun',
    title: 'Summer School Pay',
    description: 'You taught summer school. The extra weeks added $450 to your savings.',
    effect: { type: 'savings', delta: 450 },
    lesson: 'Seasonal income spikes are perfect for a down-payment fund — you never budgeted to spend them.',
    careers: ['education'],
  },
  {
    id: 'military_reenlist',
    icon: 'medal',
    title: 'Re-enlistment Bonus Installment',
    description: 'An installment of your re-enlistment bonus hit your account: $600.',
    effect: { type: 'savings', delta: 600 },
    lesson: 'VA loans let service members buy with $0 down — one of the strongest homebuying benefits anywhere.',
    careers: ['military'],
  },
  {
    id: 'fastfood_tips',
    icon: 'dining',
    title: 'Holiday Rush Tips',
    description: 'A packed holiday weekend meant great tips — an extra $260 in your pocket.',
    effect: { type: 'cash', delta: 260 },
    lesson: 'Tip income counts for a mortgage if you report it and it shows a 2-year history. Report your tips!',
    careers: ['fastfood'],
  },
  {
    id: 'retail_hours_cut',
    icon: 'cart',
    title: 'Hours Cut This Month',
    description: 'The store cut everyone\'s hours after inventory. Your paycheck came up $200 short.',
    effect: { type: 'cash', delta: -200 },
    lesson: 'Variable hours make budgeting harder. Base your budget on your LOWEST typical month, not your best.',
    careers: ['retail'],
  },
  {
    id: 'student_scholarship',
    icon: 'school',
    title: 'Scholarship Refund',
    description: 'Your scholarship covered more than tuition this term. The school refunded you $500.',
    effect: { type: 'savings', delta: 500 },
    lesson: 'Graduating with less debt is a head start on homeownership — student loans count in your DTI ratio.',
    careers: ['student'],
  },
];

/**
 * Deterministically pick a life event for a given month counter.
 * Uses a simple hash so the same month always picks the same event — no Math.random() in render.
 * Pool = generic events + events matching the player's career.
 */
export function selectLifeEvent(month: number, careerId?: string | null): LifeEvent {
  const pool = lifeEvents.filter((e) => !e.careers || (careerId && e.careers.includes(careerId)));
  if (pool.length === 0) return lifeEvents[0];
  // Knuth multiplicative hash: distributes indices evenly regardless of pool size,
  // so career-specific events are actually reachable for every career.
  const hash = ((month + 1) * 2654435761) >>> 0;
  return pool[hash % pool.length];
}

/**
 * Determine whether a life event fires this month.
 * Deterministic 40% probability based on month — avoids render-phase randomness.
 */
export function shouldEventFire(month: number): boolean {
  return ((month * 31 + 17) % 10) < 4;
}
