import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle2, XCircle, BookOpen, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface LeaseItem {
  id: string;
  label: string;
  amount: number;
  period: 'mo' | 'one-time';
  isSuspicious: boolean;
  explanation: string;
}

interface LeaseScenario {
  address: string;
  landlord: string;
  items: LeaseItem[];
}

const ALL_SCENARIOS: LeaseScenario[] = [
  {
    address: '104 Riverside Dr, Unit 2B',
    landlord: 'Riverside Properties LLC',
    items: [
      { id: 'rent',        label: 'Monthly Rent',                          amount: 1295, period: 'mo',       isSuspicious: false, explanation: 'Standard — this is your agreed-upon monthly rent. Completely normal.' },
      { id: 'deposit',     label: 'Security Deposit',                      amount: 1295, period: 'one-time', isSuspicious: false, explanation: 'Normal — typically one month\'s rent, fully refundable when you leave in good condition.' },
      { id: 'water',       label: 'Water & Sewer',                         amount:   55, period: 'mo',       isSuspicious: false, explanation: 'Reasonable — utility pass-throughs from the landlord are common and legitimate.' },
      { id: 'pet-deposit', label: 'Pet Deposit (one-time)',                 amount:  200, period: 'one-time', isSuspicious: false, explanation: 'Standard — a refundable deposit covering potential pet-related damage.' },
      { id: 'pet-rent',    label: 'Monthly Pet Rent',                      amount:   35, period: 'mo',       isSuspicious: false, explanation: 'Common — a small monthly pet fee in addition to the deposit is standard practice.' },
      { id: 'renters-ins', label: "Renter's Insurance (required)",          amount:   12, period: 'mo',       isSuspicious: false, explanation: 'Reasonable — many landlords require this. At $12/mo it\'s a fair rate and protects you too.' },
      { id: 'portal-fee',  label: 'Online Portal Convenience Fee',         amount:   25, period: 'mo',       isSuspicious: true,  explanation: '🚩 Red flag — you should never pay a fee just to pay your own rent. Ask for this to be removed.' },
      { id: 'admin-fee',   label: 'Monthly Administrative Processing Fee', amount:  115, period: 'mo',       isSuspicious: true,  explanation: '🚩 Hidden charge — vague "administrative" fees with no clear service are a major red flag. Demand a written explanation.' },
      { id: 'pest',        label: 'Mandatory Pest Control Program',         amount:   65, period: 'mo',       isSuspicious: true,  explanation: '🚩 Inflated — landlords are generally responsible for pest control. A $65/mo mandatory program is unusually high; $10–15 is more typical.' },
      { id: 'trash',       label: 'Trash & Recycling Service',              amount:   42, period: 'mo',       isSuspicious: true,  explanation: '🚩 Possible double billing — Newport News trash collection is a city service. Confirm you\'re not already paying for this through your rent.' },
    ],
  },
  {
    address: '1802 Jefferson Ave, Unit 5',
    landlord: 'Jefferson Square Management',
    items: [
      { id: 'rent',         label: 'Base Monthly Rent',                    amount: 1150, period: 'mo',       isSuspicious: false, explanation: 'Standard — this is the rent you negotiated. Completely normal.' },
      { id: 'deposit',      label: 'Security Deposit',                     amount: 1150, period: 'one-time', isSuspicious: false, explanation: 'Normal — one month\'s rent as a security deposit is standard in Virginia.' },
      { id: 'elec-share',   label: 'Electricity (RUBS allocation)',         amount:   48, period: 'mo',       isSuspicious: false, explanation: 'Acceptable — Ratio Utility Billing System (RUBS) splits building utility costs fairly among units.' },
      { id: 'parking',      label: 'Assigned Parking Space',               amount:   40, period: 'mo',       isSuspicious: false, explanation: 'Normal — a fee for a reserved, assigned parking spot is a legitimate add-on charge.' },
      { id: 'key-replace',  label: 'Key Replacement Fee (deposit)',         amount:   75, period: 'one-time', isSuspicious: false, explanation: 'Standard — a one-time deposit for key/fob replacement is common and reasonable.' },
      { id: 'move-in-fee',  label: 'Non-refundable Move-In Fee',           amount:  350, period: 'one-time', isSuspicious: true,  explanation: '🚩 Question this — move-in fees are not standard. Ask exactly what this covers. In Virginia, any non-refundable fee must be described in the lease.' },
      { id: 'lease-renew',  label: 'Lease Renewal Processing Fee',         amount:  199, period: 'one-time', isSuspicious: true,  explanation: '🚩 Hidden fee — charging you to renew your own lease is not standard. This is a profit line for the landlord with no real service behind it.' },
      { id: 'valet-trash',  label: 'Valet Trash Service (mandatory)',       amount:   85, period: 'mo',       isSuspicious: true,  explanation: '🚩 Inflated — $85/mo for valet trash pickup is well above market rate ($25–40). If it\'s mandatory, push back on the price or ask for opt-out.' },
      { id: 'mail-service', label: 'Package Concierge Service',            amount:   22, period: 'mo',       isSuspicious: false, explanation: 'Borderline acceptable — if the building has a staffed package room, a small monthly fee can be justified. Confirm the service exists.' },
      { id: 'late-fee',     label: 'Late Fee Schedule (if applicable)',     amount:   50, period: 'one-time', isSuspicious: false, explanation: 'Normal — lease disclosures of late fees are required. A flat fee or 5–10% of rent is standard. Read the exact trigger date.' },
    ],
  },
  {
    address: '3401 Chesapeake Ave, Unit 12',
    landlord: 'Chesapeake Bay Realty Group',
    items: [
      { id: 'rent',         label: 'Monthly Rent',                         amount: 1395, period: 'mo',       isSuspicious: false, explanation: 'Standard — the rent you agreed to in your application. Normal.' },
      { id: 'deposit',      label: 'Security Deposit',                     amount: 1395, period: 'one-time', isSuspicious: false, explanation: 'Standard — one month\'s rent as a deposit, fully refundable in good standing.' },
      { id: 'water-sewer',  label: 'Water & Sewer',                        amount:   60, period: 'mo',       isSuspicious: false, explanation: 'Reasonable — landlord pass-through of city utility costs. Verify with a recent bill estimate.' },
      { id: 'renters-ins',  label: "Renter's Insurance (required)",         amount:   15, period: 'mo',       isSuspicious: false, explanation: 'Reasonable — $15/mo is fair market rate. Renter\'s insurance also protects your own belongings.' },
      { id: 'gym',          label: 'Fitness Center Access',                amount:   30, period: 'mo',       isSuspicious: false, explanation: 'Borderline — if the complex has an on-site gym, a $30/mo access fee can be legitimate. Confirm what the facility looks like.' },
      { id: 'admin-fee2',   label: 'Annual Account Management Fee',        amount:  225, period: 'one-time', isSuspicious: true,  explanation: '🚩 Red flag — an "account management" fee is a revenue line with no real service. Ask for a written breakdown of what this covers.' },
      { id: 'cleaning',     label: 'Monthly Common Area Cleaning Fee',     amount:   95, period: 'mo',       isSuspicious: true,  explanation: '🚩 Inflated — common-area maintenance is a landlord responsibility included in your rent. A separate monthly fee for this is unusual and should be challenged.' },
      { id: 'tech-fee',     label: 'Smart Home Tech Package (mandatory)',   amount:   55, period: 'mo',       isSuspicious: true,  explanation: '🚩 Forced upsell — mandatory tech fees for smart locks or thermostats you didn\'t choose are a growing hidden-fee tactic. Negotiate it out.' },
      { id: 'storage',      label: 'Storage Unit (assigned)',              amount:   45, period: 'mo',       isSuspicious: false, explanation: 'Normal — if you\'re receiving an assigned storage unit, a monthly fee is legitimate. Confirm the unit exists and its size.' },
      { id: 'app-fee',      label: 'Application Fee (one-time)',           amount:   50, period: 'one-time', isSuspicious: false, explanation: 'Standard — application fees cover credit and background checks. Virginia caps how landlords use this fee.' },
    ],
  },
  {
    address: '517 Warwick Blvd, Apt 8C',
    landlord: 'Premier Newport Property Mgmt',
    items: [
      { id: 'rent',         label: 'Monthly Rent',                         amount: 1075, period: 'mo',       isSuspicious: false, explanation: 'Standard — this is your agreed-upon monthly rent.' },
      { id: 'deposit',      label: 'Security Deposit',                     amount: 1075, period: 'one-time', isSuspicious: false, explanation: 'Normal — one month\'s rent as a refundable security deposit.' },
      { id: 'cable-int',    label: 'Internet & Cable Bundle (required)',   amount:  120, period: 'mo',       isSuspicious: true,  explanation: '🚩 Forced bundle — landlords cannot require you to use a specific cable/internet provider if alternatives exist. Ask if you can opt out and set up your own service.' },
      { id: 'renters-ins',  label: "Renter's Insurance (required)",         amount:   14, period: 'mo',       isSuspicious: false, explanation: 'Reasonable — $14/mo for required renter\'s insurance is fair market and protects your belongings.' },
      { id: 'bike-storage', label: 'Bicycle Storage Room Access',         amount:   10, period: 'mo',       isSuspicious: false, explanation: 'Acceptable — a nominal fee for secured bike storage is legitimate if the facility exists.' },
      { id: 'legal-fee',    label: 'Lease Preparation Legal Fee',          amount:  175, period: 'one-time', isSuspicious: true,  explanation: '🚩 Questionable — landlords are expected to absorb lease preparation costs. Charging a tenant for the landlord\'s legal costs is an unusual and suspicious practice.' },
      { id: 'hvac-filter',  label: 'Monthly HVAC Filter Service',          amount:   45, period: 'mo',       isSuspicious: true,  explanation: '🚩 Inflated — routine HVAC filter replacement is a basic maintenance duty. At $45/mo ($540/yr), you could buy filters yourself for $30–60 per year.' },
      { id: 'electric',     label: 'Electricity (direct-metered)',         amount:   70, period: 'mo',       isSuspicious: false, explanation: 'Normal — if the unit has its own meter, paying electricity directly is standard. Verify the amount reflects actual usage.' },
      { id: 'hold-deposit', label: 'Unit Hold Deposit (applied to rent)',  amount:  250, period: 'one-time', isSuspicious: false, explanation: 'Common — a refundable hold deposit that gets applied to your first month\'s rent or security deposit is standard.' },
      { id: 'nuisance-fee', label: 'Quarterly Nuisance Abatement Fee',    amount:   88, period: 'mo',       isSuspicious: true,  explanation: '🚩 Red flag — a "nuisance abatement" fee with no clear explanation is not a recognized or standard rental charge. This is vague language for a hidden profit line.' },
    ],
  },
];

/** Pick a random element from an array */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type Phase = 'idle' | 'playing' | 'result';

export function SpotHiddenFees() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [sessionKey, setSessionKey] = useState(0);

  // Pick a new random scenario on each session
  const scenario = useMemo(() => pickRandom(ALL_SCENARIOS), [sessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id: string) => {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const suspicious = scenario.items.filter(i => i.isSuspicious);
  const correctlyFlagged = suspicious.filter(i => flagged.has(i.id)).length;
  const falseFlagged     = scenario.items.filter(i => !i.isSuspicious && flagged.has(i.id)).length;
  const perfect = correctlyFlagged === suspicious.length && falseFlagged === 0;

  const reset = () => {
    setSessionKey(k => k + 1);
    setPhase('idle');
    setFlagged(new Set());
  };

  return (
    <>
      {/* Teaser Card */}
      {phase === 'idle' && (
        <motion.div
          whileHover={{ y: -4, boxShadow: '0 20px 60px -12px rgba(10,37,64,0.18)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="rounded-2xl bg-gradient-to-br from-white to-rose-50/50 border border-rose-100 shadow-md overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-accent"
          onClick={() => setPhase('playing')}
          role="button"
          tabIndex={0}
          aria-label="Start Spot the Hidden Fees — interactive lease review challenge"
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setPhase('playing')}
        >
          <div className="h-1 bg-gradient-to-r from-rose-500 to-accent w-full" />
          <div className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 text-rose-500" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Lease Review Challenge</span>
              <h3 className="text-lg font-bold text-primary mt-0.5 mb-1">Spot the Hidden Fees</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A landlord just emailed you a lease. Can you find the questionable charges before you sign?{' '}
                <span className="text-accent font-medium">{ALL_SCENARIOS.length} different leases rotate each round.</span>
              </p>
              <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-accent" aria-hidden="true">
                Review the lease <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {(phase === 'playing' || phase === 'result') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hidden-fees-title"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-primary px-6 pt-5 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-white/80" aria-hidden="true" />
                  <div>
                    <h2 id="hidden-fees-title" className="text-white font-bold">Lease Agreement — {scenario.address}</h2>
                    <p className="text-white/60 text-xs mt-0.5">
                      {scenario.landlord} · Click any charge that seems questionable
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Playing ── */}
              {phase === 'playing' && (
                <>
                  <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2" role="list">
                    {scenario.items.map(item => {
                      const isFlagged = flagged.has(item.id);
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => toggle(item.id)}
                          whileTap={{ scale: 0.98 }}
                          aria-pressed={isFlagged}
                          aria-label={`${item.label}: $${item.amount}/${item.period}. ${isFlagged ? 'Flagged as suspicious' : 'Not flagged'}`}
                          className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-150 ${
                            isFlagged
                              ? 'border-rose-400 bg-rose-50 shadow-sm'
                              : 'border-border/60 bg-muted/20 hover:border-primary/30 hover:bg-muted/40'
                          }`}
                          role="listitem"
                        >
                          <span className={`text-sm font-medium ${isFlagged ? 'text-rose-700' : 'text-foreground'}`}>
                            {item.label}
                          </span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-sm font-bold tabular-nums ${isFlagged ? 'text-rose-600' : 'text-primary'}`}>
                              ${item.amount.toLocaleString()}<span className="font-normal text-xs text-muted-foreground">/{item.period}</span>
                            </span>
                            {isFlagged && <AlertTriangle className="w-4 h-4 text-rose-500" aria-hidden="true" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="px-6 py-4 border-t border-border/60 shrink-0">
                    <p className="text-xs text-muted-foreground mb-3 text-center">
                      {flagged.size === 0 ? 'Tap any charge that seems questionable.' : `${flagged.size} charge${flagged.size > 1 ? 's' : ''} flagged`}
                    </p>
                    <Button
                      onClick={() => setPhase('result')}
                      className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-12"
                    >
                      Review My Selections
                    </Button>
                  </div>
                </>
              )}

              {/* ── Result ── */}
              {phase === 'result' && (
                <>
                  <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2" role="list">
                    {scenario.items.map(item => {
                      const wasFlagged = flagged.has(item.id);
                      const correct    = item.isSuspicious && wasFlagged;
                      const missed     = item.isSuspicious && !wasFlagged;
                      const falseAlarm = !item.isSuspicious && wasFlagged;

                      return (
                        <div
                          key={item.id}
                          className={`px-4 py-3 rounded-xl border-2 ${
                            correct    ? 'border-emerald-400 bg-emerald-50' :
                            missed     ? 'border-rose-400 bg-rose-50' :
                            falseAlarm ? 'border-amber-400 bg-amber-50' :
                                         'border-border/40 bg-muted/10'
                          }`}
                          role="listitem"
                          aria-label={`${item.label}: ${correct ? 'Correctly flagged' : missed ? 'You missed this red flag' : falseAlarm ? 'False alarm — this is normal' : 'Normal charge'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-bold tabular-nums text-primary">
                                ${item.amount.toLocaleString()}<span className="font-normal text-xs text-muted-foreground">/{item.period}</span>
                              </span>
                              {correct    && <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />}
                              {missed     && <XCircle className="w-4 h-4 text-rose-500" aria-hidden="true" />}
                              {falseAlarm && <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />}
                            </div>
                          </div>
                          {(correct || missed || falseAlarm) && (
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.explanation}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-6 py-5 border-t border-border/60 shrink-0">
                    <div className={`rounded-2xl p-4 mb-4 ${perfect ? 'bg-emerald-50 border border-emerald-100' : 'bg-blue-50 border border-blue-100'}`}>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> What You Learned
                      </p>
                      {perfect ? (
                        <p className="text-sm text-foreground leading-relaxed">
                          Perfect score! You found all {suspicious.length} hidden fees. Always read every line of a lease before signing — and never be afraid to ask a landlord to justify or remove a charge.
                        </p>
                      ) : (
                        <p className="text-sm text-foreground leading-relaxed">
                          You caught {correctlyFlagged} of {suspicious.length} hidden fees. Before signing any lease, ask for a written explanation of every charge beyond base rent. Virginia tenant rights law protects you.
                        </p>
                      )}
                      <Link href="/rent" className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-accent hover:underline">
                        Learn your renter rights <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                    <Button onClick={reset} variant="outline" className="w-full rounded-xl gap-2">
                      <RotateCcw className="w-4 h-4" aria-hidden="true" /> Try a Different Lease
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
